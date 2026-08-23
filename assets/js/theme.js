function applyFaviconTheme(theme) {
  document.querySelectorAll("link[data-icon-theme]").forEach((link) => {
    link.media = link.dataset.iconTheme === theme ? "" : "not all";
  });
}

export function initTheme() {
  applyFaviconTheme(document.documentElement.getAttribute("data-theme"));

  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    applyFaviconTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });
}
