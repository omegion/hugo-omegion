export function initToc() {
  const toc = document.getElementById("toc");
  if (!toc) return;

  function syncTocTop() {
    const prose = document.querySelector(".prose");
    if (!prose) return;
    toc.style.setProperty("--toc-top", prose.offsetTop + "px");
  }

  let onFontsReady = () => {};

  syncTocTop();
  window.addEventListener("resize", syncTocTop);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      syncTocTop();
      onFontsReady();
    });
  }

  const toggle = document.getElementById("toc-toggle");
  const indicator = toc.querySelector(".toc-indicator");
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
  let pinnedIndex = null;

  // The scrollY position at which each heading becomes "current". Normally
  // that's just its document position minus OFFSET, but near the bottom of
  // a short page there may not be enough scroll room left for every
  // trailing heading to individually reach that line — several can end up
  // permanently short of it once maxScroll is hit. When that happens, those
  // trailing headings' activation points are spread evenly across whatever
  // scroll room remains, so each still gets its own turn instead of being
  // skipped in favor of the last one.
  let activations = [];

  function computeActivations() {
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    const raw = targets.map(
      (t) => t.el.getBoundingClientRect().top + window.scrollY - OFFSET,
    );

    let lastReachable = -1;
    for (let i = 0; i < raw.length; i++) {
      if (raw[i] <= maxScroll) lastReachable = i;
      else break;
    }

    activations = raw.slice();
    if (lastReachable < raw.length - 1) {
      const base = lastReachable >= 0 ? raw[lastReachable] : 0;
      const tailCount = raw.length - 1 - lastReachable;
      for (let i = lastReachable + 1; i < raw.length; i++) {
        const step = i - lastReachable;
        activations[i] = base + ((maxScroll - base) * step) / tailCount;
      }
    }
  }

  function setActive(link) {
    links.forEach((l) => l.classList.toggle("toc-active", l === link));
    if (indicator) {
      indicator.style.transform = `translateY(${link.offsetTop}px)`;
      indicator.style.height = `${link.offsetHeight}px`;
      indicator.style.opacity = "1";
    }
  }

  function releasePin() {
    pinnedIndex = null;
  }

  links.forEach((link, i) => {
    link.addEventListener("click", () => {
      pinnedIndex = i;
      setActive(link);
    });
  });

  // Only release the pin on input that actually means "the user is
  // scrolling on their own now" — not on every 'scroll' event, since the
  // browser's own jump-to-anchor from the click above also fires those.
  window.addEventListener("wheel", releasePin, { passive: true });
  window.addEventListener("touchmove", releasePin, { passive: true });
  window.addEventListener("keydown", (e) => {
    if (
      ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(
        e.key,
      )
    ) {
      releasePin();
    }
  });

  window.addEventListener("hashchange", () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const index = targets.findIndex((t) => t.el.id === id);
    if (index !== -1) {
      pinnedIndex = index;
      setActive(targets[index].link);
    }
  });

  function update() {
    ticking = false;
    updatePinned();

    if (pinnedIndex !== null) {
      setActive(targets[pinnedIndex].link);
      return;
    }

    let current = targets[0];
    for (let i = 0; i < targets.length; i++) {
      if (activations[i] <= window.scrollY) {
        current = targets[i];
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

  function onResize() {
    computeActivations();
    onScroll();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  onFontsReady = onResize;
  computeActivations();
  update();
}
