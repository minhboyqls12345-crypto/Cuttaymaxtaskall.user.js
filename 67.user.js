// ==UserScript==
// @name         Full Stable Auto Bypass (Captcha Safe)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Auto click sau captcha + giảm 404 + không reset
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let clicked = false;

    // 🔍 Detect captcha
    function hasCaptcha() {
        return (
            document.querySelector("iframe[src*='captcha']") ||
            document.body.innerText.toLowerCase().includes("captcha")
        );
    }

    // 🔎 Tìm nút tiếp tục
    function findButton() {
        return [...document.querySelectorAll("button, a")]
            .find(el => {
                let text = el.innerText.toLowerCase();
                return text.includes("tiếp tục") || text.includes("continue") || text.includes("get link");
            });
    }

    // ⏱ Delay random
    function randomDelay(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function main() {

        // ⏳ Delay ban đầu (giảm detect)
        let startDelay = randomDelay(3000, 6000);
        console.log("⏱ Start delay:", startDelay);
        await wait(startDelay);

        setInterval(async () => {

            if (clicked) return;

            // ❌ Nếu còn captcha → không làm gì
            if (hasCaptcha()) {
                console.log("🛑 Waiting captcha...");
                return;
            }

            let btn = findButton();

            if (btn) {
                clicked = true;

                let delay = randomDelay(2000, 4000);
                console.log("⏱ Delay click:", delay);

                await wait(delay);

                console.log("👉 Auto click button");
                btn.click();
            }

        }, 1000);
    }

    main();

})();
