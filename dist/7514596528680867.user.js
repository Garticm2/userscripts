// ==UserScript==
// @name        GarticPhone / gp-mod / [2] Extensions
// @namespace   Violentmonkey Scripts
// @match       https://garticphone.com/*
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// @noframes
// @version     4.6-free
// @author      -
// @description 9/18/2021, 8:11:02 PM
// @run-at      document-end
// @connect     github.io
// @connect     localhost 
// @icon        https://www.google.com/s2/favicons?sz=64&domain=garticphone.com
// @downloadURL https://garticm2.github.io/userscripts/dist/1591521169568152.user.js
// ==/UserScript==

'use strict';

(function () {
    const SCRIPT_DATA = { name: "Extensions", version: "4.6", url: "https://garticm2.github.io/userscripts/dist/1591521169568152.user.js" },
        REQUEST_CACHE = { VALIDATE: "no-cache", NO_CACHE: "no-store", DEFAULT: "" },
        BASE_URL = "https://garticm2.github.io/pub",
        resources = { style: ["dist/main.min.css"], script: ["dist/main.min.js"] };
    let inProgress = !1;
    document.addEventListener("DOMContentLoaded", loadResources);
    loadResources();

    function loadResources() {
        if (!inProgress) {
            for (const a in resources) resources[a].forEach(b => {
                const c = document.createElement("link");
                c.setAttribute("rel", "preload");
                c.setAttribute("href", `${BASE_URL}/${b}`);
                c.setAttribute("as", a);
                document.head.appendChild(c)
            });
            resources.style.forEach(a => {
                const b = document.createElement("link");
                b.rel = "stylesheet";
                b.href = `${BASE_URL}/${a}`;
                b.setAttribute("defer", "");
                document.head.appendChild(b)
            });
            resources.script.forEach(a => {
                const b = document.createElement("script");
                b.src = `${BASE_URL}/${a}`;
                b.setAttribute("defer", "");
                document.head.appendChild(b)
            });
            inProgress = !0
        }
    }
    const UPDATES_URL = "https://garticm2.github.io/userscripts/dist/versions.json";
    let outdatedScripts = new Map,
        updatesData = {};
    document.addEventListener("_check-for-updates", () => { document.dispatchEvent(new CustomEvent("_us_check-for-updates", { detail: { ...SCRIPT_DATA } })) });
    document.addEventListener("_us_check-for-updates", ({ detail: { name: a, version: b, url: c } }) => {
        const d = updatesData[a];
        d && isOutdatedScript(b, d) && outdatedScripts.set(a, { name: a, version: b, latestVersion: d, url: c })
    });
    document.addEventListener("_get-outdated-scripts", a => { document.dispatchEvent(new CustomEvent("_outdated-scripts", { detail: { outdatedScripts } })) });
    document.addEventListener("_update-script", ({ detail: { name: a } }) => {
        (a = outdatedScripts.get(a)?.url) && GM_openInTab(`${a}?${Date.now()}.user.js`)
    });
    requestUpdatesData().then(a => { updatesData = a }).then(checkForUpdates);

    function checkForUpdates() { document.dispatchEvent(new CustomEvent("_check-for-updates", { detail: { ...SCRIPT_DATA } })) }

    function isOutdatedScript(a, b) {
        const [c, d] = [a, b].map(e => e.split(".").map(f => +f));
        a = Math.max(c.length, d.length);
        for (b = 0; b < a; b++) {
            const e = c[b] ?? 0,
                f = d[b] ?? 0;
            if (e !== f) return f > e
        }
        return !1
    }

    function requestUpdatesData() { return request({ url: UPDATES_URL }) }
    class LocalizationController extends EventTarget {
        static STORAGE = "gp_localization";
        static DEFAULT_LANGUAGE = "en";
        static PATH = "http://localhost:8000/localization";
        constructor() {
            super();
            this.loadHashes().then(a => {
                let { lang: b, hash: c, entries: d } = this.getCache();
                b = b in a ? b : this.getDefaultLanguage(a);
                c && d && a[b] === c ? this.setLocalization(b, d) : this.load(b).then(e => {
                    this.setCache(b, a[b], e);
                    this.setLocalization(b, e)
                })
            })
        }
        getDefaultLanguage(a) {
            const b = window.navigator.language.split("-")[0].toLowerCase();
            return b in a ? b : LocalizationController.DEFAULT_LANGUAGE
        }
        setLocalization(a, b) { document.dispatchEvent(new CustomEvent("_gp_l10n", { detail: { lang: a, entries: b } })) }
        getLocalization() { return { lang, entries } = this }
        getCache() { return JSON.parse(localStorage.getItem(LocalizationController.STORAGE)) ?? {} }
        setCache(a, b, c) { localStorage.setItem(LocalizationController.STORAGE, JSON.stringify({ lang: a, hash: b, entries: c })) }
        load(a) { return request({ url: `${LocalizationController.PATH}/locales/${a}.json` }) }
        loadHashes() { return request({ url: `${LocalizationController.PATH}/hashes.json` }) }
    }
    new LocalizationController;

    function request({ url: a, method: b = "GET", headers: c = {}, data: d, responseType: e = "json", successStatus: f = 200, cache: k = REQUEST_CACHE.VALIDATE }, g) {
        return new Promise((m, n) => {
            GM_xmlhttpRequest({
                url: a,
                method: b,
                headers: Object.assign(getCacheHeaders(k), c),
                responseType: "json" === e ? "text" : e,
                data: d,
                anonymous: !0,
                onload: l => {
                    try {
                        if (Array.isArray(f) && f.includes(l.status) || l.status === f) {
                            let h = l.response || l.responseText;
                            l.response instanceof ArrayBuffer && ("json" === e || "text" === e) && (h = (new TextDecoder).decode(h));
                            switch (e) {
                                case "json":
                                    h = JSON.parse(h)
                            }
                            g ? g(Object.assign({}, l, { response: h }), m, n) : m(h)
                        } else n(l.status)
                    } catch (h) { n(h.message) }
                },
                ontimeout: n,
                onerror: n
            })
        })
    }

    function getCacheHeaders(a) { return a === REQUEST_CACHE.DEFAULT ? {} : { "Cache-Control": a } }
    console.log("gpmod: extensions (free edition)");
}).call(this)
