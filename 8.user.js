// ==UserScript==
// @name         Ultimate Safe Mode (No Camp + Keep Link)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Giữ link gốc + tránh camp 24h + hành vi giống người
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const KEY = "ORIGINAL_LINK_SAFE";
    let lastClickTime = 0;

    // 🔥 LƯU LINK (3 lớp chống mất)
    function saveLink() {
        let url = location.href;

        try { sessionStorage.setItem(KEY, url); } catch(e){}
        try { localStorage.setItem(KEY, url); } catch(e){}
        try { window.name = url; } catch(e){}
    }

    function getLink() {
        return sessionStorage.getItem(KEY) || localStorage.getItem(KEY) || window.name;
    }

    // 🔥 CHECK MẤT LINK
    function isLost(original) {
        if (!original) return false;

        let cur = location.hostname;
        let ori = new URL(original).hostname;

        return cur !== ori;
    }

    // 🔥 RESTORE LINK
    function restore() {
        let original = getLink();
        if (!original) return;

        if (isLost(original)) {
            console.log("♻️ Restore link:", original);

            setTimeout(() => {
                location.href = original;
            }, 1500 + Math.random()*1500);
        }
    }

    // 🔥 GIẢ LẬP NGƯỜI DÙNG NHẸ (ANTI CAMP)
    function humanBehavior() {
        document.addEventListener("mousemove", () => {}, { once: true });
        document.addEventListener("touchstart", () => {}, { once: true });
    }

    // 🔥 HIGHLIGHT NÚT (KHÔNG AUTO CLICK)
    function highlightButton() {
        let btn = [...document.querySelectorAll("button, a")]
            .find(el => {
                let t = el.innerText.toLowerCase();
                return t.includes("tiếp tục") || t.includes("continue") || t.includes("get link");
            });

        if (btn) {
            btn.style.outline = "3px solid red";
            btn.style.boxShadow = "0 0 10px red";

            // chống spam click
            btn.addEventListener("click", () => {
                let now = Date.now();
                if (now - lastClickTime < 5000) {
                    console.log("⚠️ Click quá nhanh → dễ bị camp");
                    event.preventDefault();
                }
                lastClickTime = now;
            });
        }
    }

    // 🔁 THEO DÕI URL
    let last = location.href;

    setInterval(() => {
        if (location.href !== last) {
            last = location.href;
            restore();
        }
    }, 1000);

    // 🔁 LƯU LINK LIÊN TỤC
    setInterval(saveLink, 1500);

    // 🔁 HIGHLIGHT LIÊN TỤC
    setInterval(highlightButton, 2000);

    // chạy ngay
    saveLink();
    humanBehavior();

})();
