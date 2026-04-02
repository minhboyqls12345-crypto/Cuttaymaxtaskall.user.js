// ==UserScript==
// @name         Auto Uptolink 2 Step + Auto Back FIX
// @namespace    maxtask-auto
// @version      1.4
// @description  Auto nhận + làm + quay về nhiệm vụ (fix click)
// @match        *://maxtask.net/*
// @match        *://uptolink.*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const DELAY = 5000;

    // ===== CLICK AN TOÀN =====
    function safeClick(el) {
        if (!el) return;

        el.click();

        // fallback cho web khó chịu
        el.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        }));
    }

    // ===== AUTO QUAY VỀ =====
    function autoBack() {
        let elements = document.querySelectorAll("button, a, div");

        elements.forEach(el => {
            let text = el.innerText?.trim();

            if (text && text.includes("Quay về Nhiệm vụ")) {
                console.log("→ Đã tìm thấy nút quay về");

                safeClick(el);

                // fallback nếu không chuyển trang
                setTimeout(() => {
                    window.location.href = "https://maxtask.net/home/task";
                }, 2000);
            }
        });
    }

    // ===== AUTO NHẬN TASK =====
    function autoPickTask() {
        let elements = document.querySelectorAll("button, a");

        elements.forEach(el => {
            let text = el.innerText?.trim();

            if (text && text.includes("Làm nhiệm vụ")) {
                let card = el.closest("div");

                if (card && card.innerText.includes("Uptolink 2 Step")) {
                    console.log("→ Nhận Uptolink 2 Step");
                    safeClick(el);
                }
            }
        });
    }

    // ===== AUTO STEP =====
    function autoNext() {
        let elements = document.querySelectorAll("button, a");

        elements.forEach(el => {
            let text = el.innerText?.toLowerCase();

            if (
                text?.includes("bắt đầu") ||
                text?.includes("tiếp tục") ||
                text?.includes("lấy mã") ||
                text?.includes("xác nhận")
            ) {
                safeClick(el);
            }
        });
    }

    // ===== LOOP =====
    setInterval(() => {
        autoPickTask();
        autoNext();
        autoBack();
    }, DELAY);

})();
