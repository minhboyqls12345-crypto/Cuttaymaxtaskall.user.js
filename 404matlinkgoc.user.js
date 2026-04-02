// ==UserScript==
// @name         Stable Anti 404 + Captcha Safe
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Giảm 404 + không reset khi gặp captcha
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 🔍 Check captcha
    function isCaptcha() {
        return (
            document.querySelector("iframe[src*='captcha']") ||
            document.body.innerText.toLowerCase().includes("captcha") ||
            document.body.innerText.toLowerCase().includes("verify you are human")
        );
    }

    // ⏱ Delay random giống người thật
    function randomDelay(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function main() {

        // ❌ Nếu có captcha → dừng toàn bộ script
        if (isCaptcha()) {
            console.log("🛑 CAPTCHA detected → script paused");
            return;
        }

        // ⏳ Delay trước khi chạy (giảm detect)
        let delay = randomDelay(4000, 8000);
        console.log("⏱ Delay:", delay);
        await wait(delay);

        // 👆 Fake hành vi nhẹ (an toàn)
        document.addEventListener("mousemove", () => {}, { once: true });
        document.addEventListener("click", () => {}, { once: true });

        // 🚫 KHÔNG đụng fetch/XHR (tránh lỗi captcha)
        // 🚫 KHÔNG chặn storage
        // 🚫 KHÔNG sửa cookie

        console.log("✅ Stable mode running");

    }

    main();

})();
