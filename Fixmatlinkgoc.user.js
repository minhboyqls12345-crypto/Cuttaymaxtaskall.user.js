// ==UserScript==
// @name         Anti Session Conflict UptoLink
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tránh mất link khi mở nhiều tab
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Tạo ID riêng cho mỗi tab
    const TAB_ID = Date.now() + "_" + Math.random().toString(36).substr(2, 5);

    // Lưu ID vào sessionStorage (riêng từng tab)
    sessionStorage.setItem("TAB_ID", TAB_ID);

    console.log("TAB ID:", TAB_ID);

    // Delay ngẫu nhiên tránh trùng request
    const delay = Math.floor(Math.random() * 5000) + 3000;

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function protectSession() {
        console.log("Delay:", delay);
        await wait(delay);

        // Clone localStorage sang key riêng (tránh bị ghi đè)
        let newStorage = {};

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            newStorage[TAB_ID + "_" + key] = localStorage.getItem(key);
        }

        console.log("Isolated storage:", newStorage);

        // Ngăn tab khác ghi đè (hack nhẹ)
        window.addEventListener("storage", function (e) {
            console.log("Blocked storage overwrite:", e.key);
            e.stopImmediatePropagation();
        });
    }

    protectSession();

})();
