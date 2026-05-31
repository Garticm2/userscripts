// ==UserScript==
// @name        GarticPhone / gp-mod / Timelapse Player (stand-alone) (Unlocked)
// @namespace   Violentmonkey Scripts
// @match       https://liliezzzz.github.io/gp-timelapse-player/*
// @match       https://gpmod.github.io/gp-timelapse-player/*
// @match       https://gpmod.github.io/player/*
// @match       https://discord.com/*
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @noframes
// @version     2.5
// @author      -
// @description Bypassed Timelapse Player
// @run-at      document-end
// @connect     cdn.discordapp.com
// @connect     *
// @icon        https://www.google.com/s2/favicons?sz=64&domain=garticphone.com
// ==/UserScript==

'use strict';

(function(){
const SCRIPT_DATA={name:"Timelapse Player",version:"2.5",url:""};
if("discord.com"===location.hostname){class h{static GP_FILE_FORMAT="gpimg";static GP_ATTACHMENT_URL_PATTERN=new RegExp(`^https?:\\/\\/cdn\\.discordapp\\.com\\/attachments\\/.+\\.${this.GP_FILE_FORMAT}\\b\\??`,"i");static GP_PLAYER_URL_PATTERN=RegExp("^https?:\\/\\/(gpmod|liliezzzz)\\.github\\.io\\/(gp-timelapse-player|player)\\/\\?url=","i");constructor(){this.utils=null;const a=this;window.open=new Proxy(window.open,{async apply(c,b,f){try{f[0]=await a.handleURL(f[0])}catch(e){}return Reflect.apply(c,
b,f)}});HTMLAnchorElement.prototype.click=new Proxy(HTMLAnchorElement.prototype.click,{async apply(c,b,f){try{b.href=await a.handleURL(b.href)}catch(e){}return Reflect.apply(c,b,f)}})}async handleURL(a){if(h.GP_ATTACHMENT_URL_PATTERN.test(a))return this.isURLExpired(a)?await this.refreshURL(a):a;if(h.GP_PLAYER_URL_PATTERN.test(a)){const c=new URL(a),b=new URL(c.searchParams.get("url"));if(this.isURLExpired(b))return a=await this.refreshURL(b.href),c.searchParams.set("url",a),c.href}return a}isURLExpired(a){a=
(new URL(a)).searchParams.get("ex");if(!a)return!0;a=1E3*parseInt(a,16);return isNaN(a)?!0:a<=Date.now()+36E5}async refreshURL(a){this.utils||(this.utils=this.buildUtils());a=this.utils.removeSignedUrlParameters(a);return await this.utils.maybeRefreshAttachmentUrl(a)}buildUtils(){const a=this.findModule(c=>"\x31\x39\x38\x36\x32\x30"===c)?.exports;if(a){const c=Object.keys(a).find(b=>{b=a[b].toString();return b.startsWith("async function ")&&b.includes("toURLSafe",15)});if(c){const b={};Object.defineProperty(b,"maybeRefreshAttachmentUrl",
Object.getOwnPropertyDescriptor(a,c));Object.defineProperty(b,"removeSignedUrlParameters",{value:f=>{try{const e=new URL(f);for(let d of["ex","is","hm"])e.searchParams.delete(d);return e}catch(e){return null}}});return b}}return null}findModule(a){if(!unsafeWindow.webpackChunkdiscord_app)return null;let c=null;unsafeWindow.webpackChunkdiscord_app.push([[`_${Math.random()}`],{},({c:b})=>{for(let f in b)if(a(f)){c=b[f];break}}]);return c}}new h}else{const h="https://gpmod.github.io/pub",a={style:["dist/tp.min.css"],
script:["dist/tp.min.js"]};let c;b();document.addEventListener("source_request",({detail:{url:e}})=>{f(e).then(d=>[!0,d]).catch(()=>[!1,null]).then(([d,g])=>{document.dispatchEvent(new CustomEvent("source_request_complete",{detail:{success:d,url:e,blob:g}}))})});function b(){for(const e in a)a[e].forEach(d=>{const g=document.createElement("link");g.setAttribute("rel","preload");g.setAttribute("href",`${h}/${d}`);g.setAttribute("as",e);document.head.appendChild(g)});a.style.forEach(e=>{const d=document.createElement("link");
d.rel="stylesheet";d.href=`${h}/${e}`;d.setAttribute("defer","");document.head.appendChild(d)});a.script.forEach(e=>{const d=document.createElement("script");d.src=`${h}/${e}`;d.setAttribute("defer","");document.head.appendChild(d)})}function f(e){return new Promise((d,g)=>{c?.abort();c=GM_xmlhttpRequest({url:e,method:"GET",responseType:"blob",onload:k=>{200===k.status?d(k.response):g(k.status)},ontimeout:g,onerror:g})})}};
console.log("gpmod: timelapse player (unlocked)");
}).call(this);
