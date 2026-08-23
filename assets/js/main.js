import { initTheme } from "./theme.js";
import { initSearch } from "./search.js";
import { initToc } from "./toc.js";
import { initSidebar, initLogoIntro } from "./sidebar.js";
import { initCodeCopy } from "./codeblock.js";

function initResizeGuard() {
  const root = document.documentElement;
  let resizeTimer;

  window.addEventListener("resize", () => {
    root.classList.add("is-resizing");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => root.classList.remove("is-resizing"), 150);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initSearch();
  initToc();
  initSidebar();
  initLogoIntro();
  initResizeGuard();
  initCodeCopy();
});
