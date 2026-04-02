// ==UserScript==
// @name         Keep Original Link Stable
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Giữ link gốc, tránh bị mất khi mở nhiều tab
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const KEY = "ORIGINAL_LINK_BACKUP";

    // 🔹 1. Lưu link gốc ngay khi vào trang
    if (!sessionStorage.getItem(KEY)) {
        sessionStorage.setItem(KEY, window.location.href);
        console.log("💾 Saved original link:", window.location.href);
    }

    // 🔹 2. Nếu bị chuyển hướng / mất link → khôi phục
    function restoreLink() {
        const saved = sessionStorage.getItem(KEY);

        if (!saved) return;

        // Nếu URL hiện tại KHÔNG giống link gốc
        if (window.location.href !== saved) {
            console.log("♻️ Restoring original link...");
            window.location.href = saved;
        }
    }

    // 🔹 3. Theo dõi thay đổi URL (SPA / redirect JS)
    let lastUrl = location.href;

    setInterval(() => {
        if (location.href !== lastUrl) {
            console.log("🔄 URL changed");
            lastUrl = location.href;

            setTimeout(restoreLink, 1000);
        }
    }, 1000);

})();
