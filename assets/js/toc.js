export function initToc() {
  const toc = document.getElementById("toc");
  if (!toc) return;

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

  if (!targets.length) return;

  const OFFSET = 96;
  let ticking = false;

  function setActive(link) {
    links.forEach((l) => l.classList.toggle("toc-active", l === link));
  }

  function update() {
    ticking = false;
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
