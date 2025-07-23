// ==UserScript==
// @name        GarticPhone / gp-mod / [7] Layer System
// @namespace   Violentmonkey Scripts
// @match       https://garticphone.com/*
// @grant       none
// @noframes
// @version     1.0
// @author      -
// @description Adds a layer management system to the painter.
// @run-at      document-idle
// @downloadURL https://garticm2.github.io/userscripts/dist/layers.user.js
// ==/UserScript==

'use strict';

(function() {
    console.log("gpmod: Layer System script loaded. Waiting for painter instance...");

    function waitForPainterInstance() {
        if (window.gpmod && window.gpmod.pa) {
            console.log("gpmod: Painter instance found. Applying Layers patch.");
            applyLayersPatch(window.gpmod.pa);
        } else {
            setTimeout(waitForPainterInstance, 150);
        }
    }

    function applyLayersPatch(painter) {
        class LayerManager {
            constructor(painterInstance) {
                this.painter = painterInstance;
                this.layers = [];
                this.activeLayerIndex = -1;
                this.drawingArea = painter.drawingArea;

                const toolsContainer = document.createElement('div');
                toolsContainer.className = 'gp-tools-container';

                this.panel = document.createElement('div');
                this.panel.className = 'gp-layers-panel';
                this.panel.innerHTML = `
                    <h4>Слои</h4>
                    <div class="gp-layers-list"></div>
                    <div class="gp-layers-buttons">
                        <button class="add-layer-btn" title="Добавить новый слой">+</button>
                        <button class="remove-layer-btn" title="Удалить слой">-</button>
                    </div>
                `;
                
                toolsContainer.appendChild(this.panel);
                this.drawingArea.appendChild(toolsContainer);

                this.listElement = this.panel.querySelector('.gp-layers-list');
                this.panel.querySelector('.add-layer-btn').addEventListener('click', () => this.addLayer());
                this.panel.querySelector('.remove-layer-btn').addEventListener('click', () => this.removeLayer());
                
                this.addLayer();
            }

            addLayer() {
                const index = this.layers.length;
                const canvas = document.createElement('canvas');
                canvas.className = 'layer-canvas';
                canvas.width = this.painter.width;
                canvas.height = this.painter.height;
                canvas.style.zIndex = index;

                this.drawingArea.insertBefore(canvas, this.painter.stroke);

                const layer = { id: Date.now(), canvas: canvas, context: canvas.getContext('2d'), visible: true };
                this.layers.push(layer);
                this.setActiveLayer(index);
            }

            removeLayer() {
                if (this.layers.length <= 1) return;
                const layerToRemove = this.layers.splice(this.activeLayerIndex, 1)[0];
                layerToRemove.canvas.remove();
                this.setActiveLayer(Math.max(0, this.activeLayerIndex - 1));
            }
            
            setActiveLayer(index) {
                if (index >= 0 && index < this.layers.length) {
                    this.activeLayerIndex = index;
                    this.render();
                }
            }

            getActiveContext() {
                return this.layers[this.activeLayerIndex]?.context;
            }

            render() {
                this.listElement.innerHTML = '';
                this.layers.forEach((layer, index) => {
                    const item = document.createElement('div');
                    item.className = 'gp-layer-item';
                    if (index === this.activeLayerIndex) item.classList.add('active');
                    if (!layer.visible) item.classList.add('hidden');
                    
                    const visibilityToggle = document.createElement('div');
                    visibilityToggle.className = 'visibility-toggle';
                    visibilityToggle.onclick = (e) => { e.stopPropagation(); this.toggleVisibility(index); };
                    
                    const name = document.createElement('span');
                    name.textContent = `Слой ${index + 1}`;
                    
                    item.appendChild(visibilityToggle);
                    item.appendChild(name);
                    item.addEventListener('click', () => this.setActiveLayer(index));
                    this.listElement.appendChild(item);
                });
            }

            toggleVisibility(index) {
                const layer = this.layers[index];
                layer.visible = !layer.visible;
                layer.canvas.style.display = layer.visible ? '' : 'none';
                this.render();
            }

            mergeLayers() {
                this.painter.clearCanvas();
                this.painter.history = [];
                this.layers.forEach(layer => {
                    if (layer.visible) {
                        this.painter.canvasCtx.drawImage(layer.canvas, 0, 0);
                    }
                });
                // Hack to make the game recognize the drawing is not empty
                const finalStroke = [1, Date.now(), ["#00000000", 1, 0.01], [0,0], [0,0]];
                this.painter.history.push(finalStroke);
            }
        }

        const layerManager = new LayerManager(painter);
        painter.layerManager = layerManager;

        const originalDrawFunction = painter.drawFunction;
        painter.drawFunction = function(context, data, ...args) {
            const targetContext = (context === this.strokeCtx) ? this.strokeCtx : layerManager.getActiveContext();
            if (targetContext) {
                originalDrawFunction.call(this, targetContext, data, ...args);
            }
        };

        const readyBtn = document.querySelector(window.GPDrawInterface_.SELECTORS.READY_ICON)?.closest("button");
        if (readyBtn) {
            readyBtn.addEventListener('mousedown', () => {
                layerManager.mergeLayers();
            }, true);
        }
        
        console.log("gpmod: Layer System patch applied successfully.");
    }
    
    waitForPainterInstance();
})();
