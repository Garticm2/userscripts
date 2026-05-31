// ==UserScript==
// @name        GarticPhone / gp-mod / [1] Core
// @namespace   Violentmonkey Scripts
// @match       https://garticphone.com/*
// @grant       none
// @noframes
// @version     4.2
// @author      -
// @description 9/18/2021, 8:11:02 PM
// @run-at      document-start
// @icon        https://www.google.com/s2/favicons?sz=64&domain=garticphone.com
// @downloadURL https://gpmod.github.io/userscripts/dist/7314405506749249.user.js
// ==/UserScript==

'use strict';

(function(){
const SCRIPT_DATA={name:"Core",version:"4.2",url:"https://gpmod.github.io/userscripts/dist/7314405506749249.user.js"};
class WebSocket1 extends WebSocket{static wsFired=!1;static lastWs;constructor(...a){super(...a);a=sessionStorage.getItem("gp_auth-data");a=new CustomEvent("_ws",{detail:{ws:this,authData:a,l10n}});document.dispatchEvent(a);WebSocket1.wsFired=!0;WebSocket1.lastWs=this}send(...a){const b=new CustomEvent("_ws_send_data",{detail:{encodedPacket:a[0]}});document.dispatchEvent(b);super.send(...a)}set onmessage(a){super.addEventListener("message",b=>{document.dispatchEvent(new CustomEvent("_onmessage_intercept",
{detail:{handler:a,e:b}}))})}}WebSocket=WebSocket1;document.addEventListener("gp:ready",a=>{WebSocket1.wsFired&&document.dispatchEvent(new CustomEvent("_ws",{detail:{ws:WebSocket1.lastWs,authData:sessionStorage.getItem("gp_auth-data"),l10n}}))});class XMLHttpRequest1 extends XMLHttpRequest{constructor(...a){super(...a);this.addEventListener("load",b=>{b=new CustomEvent("_xhr_data",{detail:{encodedPacket:this.responseText}});document.dispatchEvent(b)})}}XMLHttpRequest=XMLHttpRequest1;
History.prototype.pushState=new Proxy(History.prototype.pushState,{apply(a,b,c){document.dispatchEvent(new CustomEvent("_url_changed",{detail:{path:c[0].url}}));return a.apply(b,c)}});History.prototype.replaceState=new Proxy(History.prototype.replaceState,{apply(a,b,c){document.dispatchEvent(new CustomEvent("_url_changed",{detail:{path:c[0].url}}));return a.apply(b,c)}});const l10n={lang:"",entries:{}};
document.addEventListener("_gp_l10n",({detail:{lang:a,entries:b}})=>{Object.assign(l10n,{lang:a,entries:b})},{once:!0});document.addEventListener("_check-for-updates",()=>{document.dispatchEvent(new CustomEvent("_us_check-for-updates",{detail:{...SCRIPT_DATA}}))});console.log("gpmod: core");
}).call(this)
