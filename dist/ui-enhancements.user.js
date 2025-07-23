// ==UserScript==
// @name        GarticPhone / gp-mod / [UI] Enhancements
// @namespace   Violentmonkey Scripts
// @match       https://garticphone.com/*
// @grant       GM_addStyle
// @noframes
// @version     1.0
// @author      -
// @description Adds custom styles for Layers, Pen Pressure, and Copy/Paste tools.
// @run-at      document-start
// @downloadURL http://localhost:8000/userscripts/dist/ui-enhancements.user.js
// ==/UserScript==

'use strict';

GM_addStyle(`
    /* --- Main Container for New Tools --- */
    .gp-tools-container {
        position: absolute;
        top: 10px;
        right: -135px; /* Position next to the drawing area */
        width: 125px;
        z-index: 10030;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    /* --- Layers Panel --- */
    .gp-layers-panel {
        background: #535fa1;
        border: 2px solid #7779a6;
        border-radius: 6px;
        padding: 5px;
        box-shadow: 3px 3px 5px rgba(0,0,0,0.2);
        font-family: "Bold", sans-serif;
        color: white;
    }
    .gp-layers-panel h4 {
        margin: 0 0 5px 0;
        padding-bottom: 5px;
        border-bottom: 1px solid #7779a6;
        text-align: center;
        font-size: 14px;
        text-transform: uppercase;
    }
    .gp-layers-list {
        max-height: 150px;
        overflow-y: auto;
        padding-right: 3px;
    }
    .gp-layer-item {
        background: #626aae;
        padding: 8px 5px;
        border-radius: 4px;
        margin-bottom: 4px;
        cursor: pointer;
        border: 2px solid transparent;
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 13px;
    }
    .gp-layer-item.active {
        border-color: #fff;
        background: #7882d0;
    }
    .gp-layer-item .visibility-toggle {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        background: 50% / 70% no-repeat url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/%3E%3C/svg%3E");
    }
    .gp-layer-item.hidden .visibility-toggle {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-4 .7l2.17 2.17c.57-.23 1.18-.37 1.83-.37zm-4.32 9.32L9.17 14.83c-.15-.25-.28-.51-.39-.78A3.95 3.95 0 0 1 7 12c0-2.21 1.79-4 4-4 .97 0 1.85.36 2.53.94l.54.54L17.61 21l-1.41 1.41-2.4-2.4a5.05 5.05 0 0 1-7.37-7.37l-2.4-2.4L2.6 7.82l2.09 2.09L6.1 11.33c-.94.63-1.75 1.45-2.4 2.4-1.73 4.39 2.27 7.5 7.3 7.5 1.55 0 3.03-.3 4.38-.84l-1.58-1.58c-.6.12-1.21.18-1.82.18-2.76 0-5-2.24-5-5 0-.69.12-1.35.34-1.95z'/%3E%3C/svg%3E");
    }
    .gp-layers-buttons {
        display: flex;
        gap: 4px;
        margin-top: 5px;
    }
    .gp-layers-buttons button {
        flex-grow: 1;
        background: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: 'Black';
        font-size: 16px;
        color: #301a6b;
        padding: 5px;
    }

    /* --- Canvas Stacking --- */
    .gp-painter_ .drawing-area canvas {
        pointer-events: none; /* Disable direct interaction with canvases */
        position: absolute;
    }
    .gp-painter_ .drawing-area .stroke_ {
        pointer-events: all; /* Re-enable for the top interaction canvas */
        z-index: 1000; /* Ensure it's always on top */
    }

    /* --- Copy/Paste Selection Marquee --- */
    .gp-selection-marquee {
        position: absolute;
        border: 2px dashed #ff47a1;
        background-color: rgba(255, 71, 161, 0.1);
        pointer-events: none;
        z-index: 1001; /* Above layers, below stroke canvas */
        box-sizing: border-box;
    }
`);
})();
