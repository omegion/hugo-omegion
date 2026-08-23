export function initCodeCopy() {
  const buttons = document.querySelectorAll(".code-copy");
  if (!buttons.length) return;

  buttons.forEach((button) => {
    const label = button.querySelector(".code-copy-label");
    const defaultLabel = label ? label.textContent : "";
    let resetTimer;

    button.addEventListener("click", async () => {
      const pre = button.closest(".code-block")?.querySelector("pre");
      if (!pre) return;

      try {
        await navigator.clipboard.writeText(pre.textContent.replace(/\n$/, ""));
      } catch {
        return;
      }

      button.classList.add("is-copied");
      if (label) label.textContent = "Copied";

      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        button.classList.remove("is-copied");
        if (label) label.textContent = defaultLabel;
      }, 1500);
    });
  });
}
