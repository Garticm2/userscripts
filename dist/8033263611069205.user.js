// ==UserScript==
// @name        GarticPhone / gp-mod / Timelapse Player (stand-alone)
// @namespace   Violentmonkey Scripts
// @match       https://liliezzzz.github.io/gp-timelapse-player/*
// @match       https://garticm2.github.io/gp-timelapse-player/*
// @match       https://garticm2.github.io/player/*
// @match       https://discord.com/*
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @noframes
// @version     2.4
// @author      -
// @description 10/20/2021, 6:18:00 AM
// @run-at      document-end
// @connect     cdn.discordapp.com
// @connect     *
// @connect     localhost 
// @icon        https://www.google.com/s2/favicons?sz=64&domain=garticphone.com
// @downloadURL https://garticm2.github.io/userscripts/dist/8033263611069205.user.js
// ==/UserScript==

'use strict';

(function(){
const SCRIPT_DATA={name:"Timelapse Player",version:"2.4",url:"https://garticm2.github.io/userscripts/dist/8033263611069205.user.js"};
if("discord.com"===location.hostname){class g{static GP_FILE_FORMAT="gpimg";static GP_ATTACHMENT_URL_PATTERN=new RegExp(`^https?:\\/\\/cdn\\.discordapp\\.com\\/attachments\\/.+\\.${this.GP_FILE_FORMAT}\\b\\??`,"i");static GP_PLAYER_URL_PATTERN=RegExp("^https?:\\/\\/(gpmod|liliezzzz)\\.github\\.io\\/(gp-timelapse-player|player)\\/\\?url=","i");constructor(){this.utils=null;const a=this;window.open=new Proxy(window.open,{async apply(e,b,c){try{c[0]=await a.handleURL(c[0])}catch(d){}return Reflect.apply(e,
b,c)}});HTMLAnchorElement.prototype.click=new Proxy(HTMLAnchorElement.prototype.click,{async apply(e,b,c){try{b.href=await a.handleURL(b.href)}catch(d){}return Reflect.apply(e,b,c)}})}async handleURL(a){if(g.GP_ATTACHMENT_URL_PATTERN.test(a))return this.isURLExpired(a)?await this.refreshURL(a):a;if(g.GP_PLAYER_URL_PATTERN.test(a)){const e=new URL(a),b=new URL(e.searchParams.get("url"));if(this.isURLExpired(b))return a=await this.refreshURL(b.href),e.searchParams.set("url",a),e.href}return a}isURLExpired(a){a=
(new URL(a)).searchParams.get("ex");if(!a)return!0;a=1E3*parseInt(a,16);return isNaN(a)?!0:a<=Date.now()+36E5}async refreshURL(a){this.utils||(this.utils=this.buildUtils());a=this.utils.removeSignedUrlParameters(a);return await this.utils.maybeRefreshAttachmentUrl(a)}buildUtils(){const a=this.findModule(e=>"\x31\x39\x38\x36\x32\x30"===e)?.exports;if(a){const e=Object.keys(a).find(b=>{b=a[b].toString();return b.startsWith("async function ")&&b.includes("toURLSafe",15)});if(e){const b={};Object.defineProperty(b,"maybeRefreshAttachmentUrl",
Object.getOwnPropertyDescriptor(a,e));Object.defineProperty(b,"removeSignedUrlParameters",{value:c=>{try{const d=new URL(c);for(let f of["ex","is","hm"])d.searchParams.delete(f);return d}catch(d){return null}}});return b}}return null}findModule(a){if(!unsafeWindow.webpackChunkdiscord_app)return null;let e=null;unsafeWindow.webpackChunkdiscord_app.push([[`_${Math.random()}`],{},({c:b})=>{for(let c in b)if(a(c)){e=b[c];break}}]);return e}}new g}else{const g={style:["dist/tp.min.css"],script:["dist/tp.min.js"]};
let a;e();document.addEventListener("source_request",({detail:{url:c}})=>{b(c).then(d=>[!0,d]).catch(()=>[!1,null]).then(([d,f])=>{document.dispatchEvent(new CustomEvent("source_request_complete",{detail:{success:d,url:c,blob:f}}))})});function e(){for(const c in g)g[c].forEach(d=>{const f=document.createElement("link");f.setAttribute("rel","preload");f.setAttribute("href",`${"https://garticm2.github.io/pub"}/${d}`);f.setAttribute("as",c);document.head.appendChild(f)});g.style.forEach(c=>{const d=document.createElement("link");
d.rel="stylesheet";d.href=`${"https://garticm2.github.io/pub"}/${c}`;d.setAttribute("defer","");document.head.appendChild(d)});g.script.forEach(c=>{const d=document.createElement("script");d.src=`${"https://garticm2.github.io/pub"}/${c}`;d.setAttribute("defer","");document.head.appendChild(d)})}function b(c){return new Promise((d,f)=>{a?.abort();a=GM_xmlhttpRequest({url:c,method:"GET",responseType:"blob",onload:h=>{200===h.status?d(h.response):f(h.status)},ontimeout:f,onerror:f})})}};
}).call(this)
