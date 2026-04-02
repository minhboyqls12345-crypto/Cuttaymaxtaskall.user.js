// ==UserScript==
// @name         FULL Auto MaxTask + Uptolink
// @namespace    auto-full
// @version      2.0
// @description  Gộp tất cả: nhận task + bypass + verify + nút + auto back
// @match        *://maxtask.net/*
// @match        *://uptolink.*/*
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const DELAY = 5000;

    // ===== CLICK AN TOÀN =====
    function safeClick(el) {
        if (!el) return;
        el.click();
        el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    // ===== AUTO VERIFY HOLD =====
    function autoVerify() {
        const canvas = document.querySelector("canvas");
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const options = {
                bubbles: true,
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2
            };

            console.log("✔ Hold verify");

            canvas.dispatchEvent(new MouseEvent('mousedown', options));

            setTimeout(() => {
                canvas.dispatchEvent(new MouseEvent('mouseup', options));
                canvas.dispatchEvent(new MouseEvent('click', options));
            }, 5000);
        }
    }

    // ===== AUTO NHẬN TASK =====
    function autoPickTask() {
        document.querySelectorAll("button, a").forEach(el => {
            let text = el.innerText?.toLowerCase();

            if (text?.includes("làm nhiệm vụ")) {
                let card = el.closest("div");
                if (card && card.innerText.includes("Uptolink 2 Step")) {
                    console.log("✔ Nhận Uptolink");
                    safeClick(el);
                }
            }
        });
    }

    // ===== AUTO STEP =====
    function autoNext() {
        document.querySelectorAll("button, a").forEach(el => {
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

    // ===== AUTO BACK =====
    function autoBack() {
        document.querySelectorAll("button, a, div").forEach(el => {
            let text = el.innerText?.toLowerCase();

            if (text?.includes("quay về nhiệm vụ")) {
                console.log("✔ Quay về");
                safeClick(el);

                setTimeout(() => {
                    window.location.href = "https://maxtask.net/home/task";
                }, 2000);
            }
        });
    }

    // ===== BỎ DISABLED (bypass robot) =====
    function removeDisabled() {
        document.querySelectorAll("[disabled]").forEach(el => {
            el.removeAttribute("disabled");
        });
    }

    // ===== NÚT VÀO TASK =====
    function createButton() {
        if (document.getElementById("auto-btn")) return;

        const btn = document.createElement("button");
        btn.id = "auto-btn";
        btn.innerText = "VÀO TASKS";

        Object.assign(btn.style, {
            position: "fixed",
            top: "120px",
            right: "10px",
            zIndex: 999999,
            padding: "10px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px"
        });

        btn.onclick = () => {
            window.location.href = "https://maxtask.net/home/tasks";
        };

        document.body.appendChild(btn);
    }

    // ===== LOOP =====
    setInterval(() => {

        removeDisabled();

        if (location.host.includes("maxtask")) {
            autoPickTask();
            createButton();
        }

        if (location.host.includes("uptolink")) {
            autoNext();
            autoVerify();
            autoBack();
        }

    }, DELAY);

})();
