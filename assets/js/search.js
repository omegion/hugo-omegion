export function initSearch() {
  const openBtn = document.getElementById("search-open");
  const closeBtn = document.getElementById("search-close");
  const modal = document.getElementById("search-modal");
  const backdrop = document.getElementById("search-backdrop");
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  if (!openBtn || !modal || !input || !results) return;

  const recentPostsCount = parseInt(input.dataset.recentPosts, 10) || 3;
  const recentProjectsCount = parseInt(input.dataset.recentProjects, 10) || 3;
  let index = null;

  function loadIndex() {
    if (index) return Promise.resolve(index);
    return fetch(input.dataset.indexUrl || "/index.json")
      .then((res) => res.json())
      .then((data) => {
        index = data;
        return index;
      })
      .catch(() => {
        index = [];
        return index;
      });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[c]);
  }

  function renderRow(item) {
    return `<a class="link-row" href="${item.url}"><span class="link-row-title">${escapeHtml(item.title)}</span><span class="link-row-meta">${escapeHtml(item.date)}</span></a>`;
  }

  function render(items, label) {
    if (!items.length) {
      results.innerHTML = '<p class="search-empty">No results.</p>';
      return;
    }
    const rows = items.slice(0, 20).map(renderRow).join("");
    results.innerHTML = (label ? `<div class="search-label">${escapeHtml(label)}</div>` : "") + rows;
  }

  function renderGroups(groups) {
    const nonEmpty = groups.filter((g) => g.items.length);
    if (!nonEmpty.length) {
      results.innerHTML = '<p class="search-empty">No results.</p>';
      return;
    }
    results.innerHTML = nonEmpty
      .map((g) => `<div class="search-label">${escapeHtml(g.label)}</div>` + g.items.map(renderRow).join(""))
      .join("");
  }

  function renderSuggestions() {
    const posts = (index || []).filter((item) => item.section === "posts").slice(0, recentPostsCount);
    const projects = (index || []).filter((item) => item.section === "projects").slice(0, recentProjectsCount);
    renderGroups([
      { label: "Recent posts", items: posts },
      { label: "Recent projects", items: projects },
    ]);
  }

  function search(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      renderSuggestions();
      return;
    }
    const matches = (index || []).filter((item) => {
      const haystack = [item.title, item.summary, (item.tags || []).join(" ")].join(" ").toLowerCase();
      return haystack.includes(q);
    });
    render(matches);
  }

  const panel = modal.querySelector(".search-panel");

  function open() {
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    input.value = "";
    results.innerHTML = "";
    loadIndex().then(renderSuggestions);
    requestAnimationFrame(() => {
      modal.classList.add("is-open");
      input.focus();
    });
  }

  function close() {
    if (!modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    panel.addEventListener(
      "transitionend",
      () => {
        modal.hidden = true;
      },
      { once: true }
    );
  }

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", close);
  input.addEventListener("input", (e) => search(e.target.value));

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== input && !modal.contains(document.activeElement)) {
      e.preventDefault();
      open();
    } else if (e.key === "Escape" && !modal.hidden) {
      close();
    }
  });
}
