// ==UserScript==
// @name         SMART MODE - Ultimate Safe
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Không phá captcha + giữ link + highlight đúng lúc
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const KEY = "SMART_ORIGINAL_LINK";
    let captchaMode = false;

    // 🔍 Detect captcha
    function hasCaptcha() {
        return (
            document.querySelector("iframe[src*='recaptcha']") ||
            document.querySelector("iframe[src*='hcaptcha']") ||
            document.body.innerText.toLowerCase().includes("captcha")
        );
    }

    // 💾 Save link (3 lớp)
    function saveLink() {
        let url = location.href;
        try { sessionStorage.setItem(KEY, url); } catch(e){}
        try { localStorage.setItem(KEY, url); } catch(e){}
        try { window.name = url; } catch(e){}
    }

    function getLink() {
        return sessionStorage.getItem(KEY) || localStorage.getItem(KEY) || window.name;
    }

    // 🔁 Restore nếu mất link
    function restore() {
        let original = getLink();
        if (!original) return;

        let cur = location.hostname;
        let ori = new URL(original).hostname;

        if (cur !== ori) {
            console.log("♻️ Restore link");
            setTimeout(() => {
                location.href = original;
            }, 1500);
        }
    }

    // 🔴 Highlight nút
    function highlight() {
        let btn = [...document.querySelectorAll("button, a")]
            .find(el => {
                let t = el.innerText.toLowerCase();
                return t.includes("tiếp tục") || t.includes("continue") || t.includes("get link");
            });

        if (btn) {
            btn.style.outline = "3px solid red";
            btn.style.boxShadow = "0 0 10px red";
        }
    }

    // 🧠 Main logic
    setInterval(() => {

        // 👉 Nếu có captcha → STOP
        if (hasCaptcha()) {
            if (!captchaMode) {
                console.log("🛑 Captcha detected → pause");
                captchaMode = true;
            }
            return;
        }

        // 👉 Hết captcha → chạy lại
        if (captchaMode) {
            console.log("✅ Captcha solved → resume");
            captchaMode = false;
        }

        // 👉 Chỉ chạy khi KHÔNG có captcha
        saveLink();
        restore();
        highlight();

    }, 1500);

})();
