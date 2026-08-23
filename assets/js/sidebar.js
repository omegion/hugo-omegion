export function initLogoIntro() {
  const logos = document.querySelectorAll(".logo-letters");

  logos.forEach((logo) => {
    const spans = logo.querySelectorAll("span");
    if (!spans.length) return;

    logo.classList.add("intro");
    const totalDuration = (spans.length - 1) * 70 + 1100;
    setTimeout(() => logo.classList.remove("intro"), totalDuration + 50);
  });
}

export function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const toggle = document.getElementById("sidebar-toggle");
  const backdrop = document.getElementById("sidebar-backdrop");
  if (!sidebar || !toggle || !backdrop) return;

  function close() {
    sidebar.classList.remove("is-open");
    backdrop.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }

  function open() {
    sidebar.classList.add("is-open");
    backdrop.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  }

  toggle.addEventListener("click", () => {
    if (sidebar.classList.contains("is-open")) close();
    else open();
  });

  backdrop.addEventListener("click", close);

  sidebar.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900) close();
  });
}
