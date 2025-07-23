// ==UserScript==
// @name        GarticPhone / gp-mod / [8] Advanced Tools
// @namespace   Violentmonkey Scripts
// @match       https://garticphone.com/*
// @grant       none
// @noframes
// @version     1.0
// @author      -
// @description Adds Pen Pressure and Copy/Paste functionality.
// @run-at      document-idle
// @downloadURL http://localhost:8000/userscripts/dist/tools.user.js
// ==/UserScript==

'use strict';

(function() {
    console.log("gpmod: Advanced Tools script loaded. Waiting for painter instance...");

    function waitForPainterInstance() {
        if (window.gpmod && window.gpmod.pa && window.gpmod.pa.layerManager) {
            console.log("gpmod: Painter and Layer Manager found. Applying tools patch.");
            applyToolsPatch(window.gpmod.pa);
        } else {
            setTimeout(waitForPainterInstance, 150);
        }
    }

    function applyToolsPatch(painter) {
        const PainterClass = window.GPPainter_;
        const layerManager = painter.layerManager;

        // --- 1. PEN PRESSURE ---
        try {
            if (!PainterClass.DEFAULT_SETTINGS.hasOwnProperty('enablePenPressure')) {
                PainterClass.DEFAULT_SETTINGS.enablePenPressure = true;
            }
            if (!PainterClass.SETTINGS_UI.hasOwnProperty('enablePenPressure')) {
                 const ui = PainterClass.SETTINGS_UI;
                 const newUI = {};
                 for (const key in ui) {
                     newUI[key] = ui[key];
                     if (key === '_2') {
                         newUI['enablePenPressure'] = {
                             type: "switch",
                             description: "Включить чувствительность к нажиму пера"
                         };
                     }
                 }
                 PainterClass.SETTINGS_UI = newUI;
            }
        } catch (e) { console.error("gpmod: Failed to add pen pressure UI.", e); }

        const originalStrokeDown = painter.strokeDown.bind(painter);
        const originalStrokeMove = painter.strokeMove.bind(painter);
        const originalStrokeUp = painter.strokeUp.bind(painter);
        
        painter.isPressureStroke = false;
        
        painter.strokeDown = function(event, color) {
            this.isPressureStroke = this.s.enablePenPressure && event.pointerType === 'pen' && event.pressure > 0 && (this.tool === PainterClass.TOOL.BRUSH || this.tool === PainterClass.TOOL.ERASER);
            originalStrokeDown(event, color);
        };

        painter.strokeMove = function(event) {
            if (this.isPressureStroke && event.pressure > 0) {
                const currentCoords = this.getOCoords(event);
                const baseThickness = this.thickness;
                const pressureThickness = Math.max(this.s.minThickness, Math.min(this.s.maxThickness, baseThickness * event.pressure * 2.5));

                const segmentOptions = this.getStrokeOptions(this.tool, this.color, pressureThickness);
                const segmentData = [...segmentOptions, this.lastCoords, currentCoords];
                
                this.drawFunction(this.strokeCtx, [segmentData], this.density, false);
                this.drawFunction(layerManager.getActiveContext(), [segmentData], this.density, true);

                this.lastCoords = currentCoords;
            } else {
                originalStrokeMove(event);
            }
        };

        painter.strokeUp = function(event) {
             if (this.isPressureStroke) {
                this.clearStroke();
                this.isDrawing = false;
                this.isPressureStroke = false;
             }
             originalStrokeUp(event);
        };


        // --- 2. COPY / PASTE ---
        let isSelecting = false;
        let selectionRect = null;
        let clipboard = null;
        const marquee = document.createElement('div');
        marquee.className = 'gp-selection-marquee';
        marquee.style.display = 'none';
        painter.drawingArea.appendChild(marquee);

        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'c' && e.ctrlKey) {
                if (selectionRect) {
                    const ctx = layerManager.getActiveContext();
                    if (!ctx) return;
                    const { x, y, w, h } = selectionRect;
                    clipboard = ctx.getImageData(x * painter.density, y * painter.density, w * painter.density, h * painter.density);
                    console.log(`Copied ${w}x${h} region.`);
                }
            }
            if (e.key.toLowerCase() === 'v' && e.ctrlKey) {
                if (clipboard) {
                    const ctx = layerManager.getActiveContext();
                    if (!ctx) return;
                    const coords = painter.getOCoords({ clientX: painter.cX, clientY: painter.cY });
                    ctx.putImageData(clipboard, coords[0] * painter.density, coords[1] * painter.density);
                    console.log("Pasted.");
                }
            }
        });
        
        painter.stroke.addEventListener('pointerdown', (e) => {
            if (e.altKey) { // Alt + Drag to select
                e.stopImmediatePropagation();
                isSelecting = true;
                marquee.style.display = 'block';
                const startCoords = painter.getOCoords(e);
                selectionRect = { x: startCoords[0], y: startCoords[1], w: 0, h: 0 };

                const onMove = (moveEvent) => {
                    const moveCoords = painter.getOCoords(moveEvent);
                    const newX = Math.min(startCoords[0], moveCoords[0]);
                    const newY = Math.min(startCoords[1], moveCoords[1]);
                    const newW = Math.abs(startCoords[0] - moveCoords[0]);
                    const newH = Math.abs(startCoords[1] - moveCoords[1]);
                    
                    marquee.style.left = `${newX}px`;
                    marquee.style.top = `${newY}px`;
                    marquee.style.width = `${newW}px`;
                    marquee.style.height = `${newH}px`;

                    selectionRect = { x: newX, y: newY, w: newW, h: newH };
                };
                
                const onUp = () => {
                    isSelecting = false;
                    setTimeout(() => { marquee.style.display = 'none'; }, 2000); // Hide after 2s
                    painter.stroke.removeEventListener('pointermove', onMove);
                    painter.stroke.removeEventListener('pointerup', onUp);
                };
                
                painter.stroke.addEventListener('pointermove', onMove);
                painter.stroke.addEventListener('pointerup', onUp);
            }
        }, true);

        console.log("gpmod: Advanced Tools patch applied successfully. Hold ALT to select, CTRL+C to copy, CTRL+V to paste.");
    }

    waitForPainterInstance();
})();
