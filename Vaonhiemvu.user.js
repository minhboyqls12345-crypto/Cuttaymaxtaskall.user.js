// ==UserScript==
// @name         Go To MaxTask Tasks Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Nút vào trang tasks maxtask
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const btn = document.createElement("button");
    btn.innerText = "VÀO TASKS";

    btn.style.position = "fixed";
    btn.style.top = "120px";
    btn.style.right = "10px";
    btn.style.zIndex = 999999;
    btn.style.padding = "10px 12px";
    btn.style.background = "#007bff";
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.borderRadius = "6px";
    btn.style.cursor = "pointer";

    btn.onclick = () => {
        window.location.href = "https://maxtask.net/home/tasks";
    };

    document.body.appendChild(btn);
})();
