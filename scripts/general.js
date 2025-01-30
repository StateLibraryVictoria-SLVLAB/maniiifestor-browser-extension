const MAX_FONT_SIZE = 40;
const MIN_FONT_SIZE = 24;
let currentFontSize = MAX_FONT_SIZE;

const toggleInfoPane = () => {
  const body = document.body;

  if (!body) return;

  const isOpen = body.classList.contains("open-pane");

  if (isOpen) {
    body.classList.remove("open-pane");
  } else {
    body.classList.add("open-pane");
  }
};

const resetFontSize = () => {
  const pane = document.getElementById("info-pane-upper");
  const vEl = document.getElementById("desc-metadata-v");

  if (pane && vEl) {
    currentFontSize = MAX_FONT_SIZE;

    vEl.style.setProperty("--title-font-size", `${currentFontSize}px`);
    vEl.style.setProperty("--title-line-height", `${currentFontSize * 1.5}px`);
  }
};

const handleWindowResize = () => {
  const pane = document.getElementById("info-pane-upper");
  const vEl = document.getElementById("desc-metadata-v");

  if (pane && vEl) {
    let valid = true;
    resetFontSize();
    let under = vEl.offsetHeight > pane.offsetHeight;

    while (under && valid) {
      currentFontSize -= 1;

      if (currentFontSize < MIN_FONT_SIZE) {
        // TODO handle truncation
        valid = false;
      } else {
        vEl.style.setProperty("--title-font-size", `${currentFontSize}px`);
        vEl.style.setProperty(
          "--title-line-height",
          `${currentFontSize * 1.5}px`,
        );
        under = vEl.offsetHeight > pane.offsetHeight;
      }
    }

    document.documentElement.style.setProperty(
      "--title-font-size",
      `${currentFontSize}px`,
    );
    document.documentElement.style.setProperty(
      "--title-line-height",
      `${currentFontSize * 1.5}px`,
    );
  }
};

const setupListeners = () => {
  const paneToggleEle = document.getElementById("pane-toggle");

  if (paneToggleEle) {
    paneToggleEle.addEventListener("click", toggleInfoPane);
  }

  window.addEventListener("resize", handleWindowResize);
};

setupListeners();
