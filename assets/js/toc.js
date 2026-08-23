export function initToc() {
  const toc = document.getElementById("toc");
  if (!toc) return;

  function syncTocTop() {
    const prose = document.querySelector(".prose");
    if (!prose) return;
    toc.style.setProperty("--toc-top", prose.offsetTop + "px");
  }

  syncTocTop();
  window.addEventListener("resize", syncTocTop);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncTocTop);
  }

  const toggle = document.getElementById("toc-toggle");
  const links = Array.from(toc.querySelectorAll(".toc-link"));
  const targets = links
    .map((link) => {
      const id = decodeURIComponent(link.getAttribute("href").slice(1));
      return { link, el: document.getElementById(id) };
    })
    .filter((t) => t.el);

  if (toggle) {
    function closeDrawer() {
      toc.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
    function openDrawer() {
      toc.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (toc.classList.contains("is-open")) closeDrawer();
      else openDrawer();
    });

    links.forEach((link) => link.addEventListener("click", closeDrawer));

    document.addEventListener("click", (e) => {
      if (!toc.classList.contains("is-open")) return;
      if (toc.contains(e.target) || toggle.contains(e.target)) return;
      closeDrawer();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });
  }

  const PIN_THRESHOLD = 320;

  function updatePinned() {
    toc.classList.toggle("toc-pinned", window.scrollY > PIN_THRESHOLD);
  }

  if (!targets.length) {
    updatePinned();
    window.addEventListener("scroll", updatePinned, { passive: true });
    return;
  }

  const OFFSET = 96;
  let ticking = false;

  function setActive(link) {
    links.forEach((l) => l.classList.toggle("toc-active", l === link));
  }

  function update() {
    ticking = false;
    updatePinned();
    let current = targets[0];
    for (const target of targets) {
      if (target.el.getBoundingClientRect().top - OFFSET <= 0) {
        current = target;
      } else {
        break;
      }
    }
    setActive(current.link);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
}
