// ==UserScript==
// @name        GarticPhone / gp-mod / [2] Extensions (Unlocked)
// @namespace   Violentmonkey Scripts
// @match       https://garticphone.com/*
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// @noframes
// @version     4.7
// @author      -
// @description Bypassed Extensions
// @run-at      document-end
// @connect     github.io
// @icon        https://www.google.com/s2/favicons?sz=64&domain=garticphone.com
// ==/UserScript==

'use strict';

(function(){
const SCRIPT_DATA={name:"Extensions",version:"4.7",url:""},REQUEST_CACHE={VALIDATE:"no-cache",NO_CACHE:"no-store",DEFAULT:""},BASE_URL="https://gpmod.github.io/pub",resources={style:["dist/main.min.css"],script:["dist/main.min.js"]};
let inProgress=!1;
document.addEventListener("DOMContentLoaded",loadResources);
loadResources();

function loadResources() {
    if(inProgress) return;

    resources.style.forEach(a => {
        const b = document.createElement("link");
        b.rel = "stylesheet";
        b.href = `${BASE_URL}/${a}`;
        b.setAttribute("defer", "");
        document.head.appendChild(b);
    });

    resources.script.forEach(a => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `${BASE_URL}/${a}`,
            onload: function(res) {
                let code = res.responseText;

                // Patch to completely bypass the key check dynamically
                const patchRegex = /document\.addEventListener\("gp:prx\.auth_id",\s*async\s*\(\s*\{\s*detail:\s*\{\s*authId:\s*([a-zA-Z0-9_]+)\s*,\s*authTypeId:\s*([a-zA-Z0-9_]+)\s*,\s*isAuthorized:\s*([a-zA-Z0-9_]+)\s*\}\s*\}\s*\)\s*=>\s*\{/g;
                code = code.replace(patchRegex, (match, c, d, e) => {
                    return match + `
                    if (this.s && !this.s.allowAnalytics && this.waitForAnalyticsConsent) {
                        this.setEditionState && this.setEditionState(GPModulesManager_.STATE.ANALYTICS);
                    }
                    if (this.lm && this.lm.length) {
                        this.lm.forEach(y => {
                            if (!y.disabled && !y.initialized && this.initModuleInstance) {
                                this.initModuleInstance(y, this.root, this.loc.get(y.name));
                            }
                            y.locked = false;
                        });
                        this.renderModulesList && this.renderModulesList();
                        document.dispatchEvent(new CustomEvent("gp:act.auth_perms", {detail:{ps: 0xFFFFFFFF}}));
                    }
                    this.dispatchEvent(new CustomEvent("modules_loaded", {
                        detail: {
                            decryptedData: {e: "Unlocked", m: false},
                            authTypeId: ${d},
                            isAuthorized: ${e},
                            isSubscribed: true,
                            kd: false,
                            kt: false
                        }
                    }));
                    if(this.setEditionTitle) this.setEditionTitle("Unlocked");
                    if(this.container && this.container.dataset) this.container.dataset.state = "subscription";
                    return;
                    `;
                });

                const script = document.createElement("script");
                script.textContent = code;
                document.head.appendChild(script);
            }
        });
    });
    inProgress = !0;
}

class Activation{constructor(){sessionStorage.setItem("gp_auth-data","bypassed");}}new Activation;

// Safely stubbed out the remote Avatar webhook to protect privacy
class AvatarController{
    constructor(){document.addEventListener("gp:av.submit",({detail:a})=>{this.send(a)})}
    send({type:a}) {
        document.dispatchEvent(new CustomEvent("gp:av.submitted",{detail:{type:a}}));
    }
}
new AvatarController;

class LocalizationController extends EventTarget{static STORAGE="gp_localization";static DEFAULT_LANGUAGE="en";static PATH="https://gpmod.github.io/localization";constructor(){super();this.l10n=this.hashes=null;this.cache=this.getCache();this.requestLocalization().then(a=>{document.dispatchEvent(new CustomEvent("_gp_l10n",{detail:a??{lang:"",entries:{}}}))});document.addEventListener("gp:get_l10n",async a=>{document.dispatchEvent(new CustomEvent("gp:l10n",{detail:{l10n:this.l10n??await this.requestLocalization()}}))})}async requestLocalization(){try{const a=this.hashes??await this.loadHashes();if(this.cache&&this.cache.hash===a[this.cache.lang])return{lang:this.cache.lang,entries:this.cache.entries};const b=this.cache?.lang??this.getDefaultLanguage(a),d=await this.loadEntries(b);this.setCache(b,d,a[b]);this.setLocalization({lang:b,entries:d});return{lang:b,entries:d}}catch{return null}}getCache(){return JSON.parse(localStorage.getItem(LocalizationController.STORAGE))}getDefaultLanguage(a={}){const b=window.navigator.language.split("-")[0].toLowerCase();return b in a?b:LocalizationController.DEFAULT_LANGUAGE}setCache(a,b,d){localStorage.setItem(LocalizationController.STORAGE,JSON.stringify({lang:a,hash:d,entries:b}))}setLocalization(a){this.l10n=a}async loadHashes(){return this.hashes=await request({url:`${LocalizationController.PATH}/hashes.json`})}loadEntries(a){return request({url:`${LocalizationController.PATH}/locales/${a}.json`})}}new LocalizationController;
class Analytics{constructor(){}}new Analytics; // Disabled analytics
function escapeMarkdown(a){return a.replace(/(_|\*|`|~|\\)/g,"\\$1")}function capitalizeString(a){return a?`${a[0].toUpperCase()}${a.slice(1)}`:""}
function request({url:a,method:b="GET",headers:d={},data:c,timeout:f,responseType:e="json",successStatus:g=200,cache:h=REQUEST_CACHE.VALIDATE},n){return new Promise((p,k)=>{GM_xmlhttpRequest({url:a,method:b,headers:Object.assign(getCacheHeaders(h),d),responseType:"json"===e?"text":e,data:c,anonymous:!0,timeout:f,onload:m=>{try{if(Array.isArray(g)&&g.includes(m.status)||m.status===g){let l=m.response||m.responseText;m.response instanceof ArrayBuffer&&("json"===e||"text"===e)&&(l=(new TextDecoder).decode(l));switch(e){case "json":l=JSON.parse(l)}n?n(Object.assign({},m,{response:l}),p,k):p(l)}else k(m.status)}catch(l){k(l.message)}},ontimeout:k,onerror:k})})}function getCacheHeaders(a){return a===REQUEST_CACHE.DEFAULT?{}:{"Cache-Control":a}}
console.log("gpmod: extensions (unlocked)");
}).call(this);
