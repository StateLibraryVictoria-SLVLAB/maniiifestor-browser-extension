import { MAX_FONT_SIZE, MIN_FONT_SIZE } from "./constants.js";
import PreferenceManager from "./PreferenceManager.js";

const preferenceManager = new PreferenceManager();
let currentFontSize = MAX_FONT_SIZE;

const toggleInfoPane = (instant = false) => {
  const body = document.body;
  if (!body) return;

  if (instant) {
    body.classList.add("no-pane-anim");
  } else {
    body.classList.remove("no-pane-anim");
  }

  const isOpen = body.classList.contains("open-pane");
  preferenceManager.setPreference("paneOpen", !isOpen);

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
          `${currentFontSize * 1.5}px`
        );
        under = vEl.offsetHeight > pane.offsetHeight;
      }
    }

    document.documentElement.style.setProperty(
      "--title-font-size",
      `${currentFontSize}px`
    );
    document.documentElement.style.setProperty(
      "--title-line-height",
      `${currentFontSize * 1.5}px`
    );
  }
};

const setupListeners = () => {
  const paneToggleEle = document.getElementById("pane-toggle");

  if (paneToggleEle) {
    paneToggleEle.addEventListener("click", () => toggleInfoPane(false));
  }

  const dismissWarningEle = document.getElementById("warning-dismiss-button");

  if (dismissWarningEle) {
    dismissWarningEle.addEventListener("click", () =>
      handleContentWarningDisplay()
    );
  }

  const showWarningEle = document.getElementById(
    "harmful-content-warning-button"
  );

  if (showWarningEle) {
    showWarningEle.addEventListener("click", () =>
      handleContentWarningDisplay(true)
    );
  }

  window.addEventListener("resize", handleWindowResize);
};

const handleContentWarningDisplay = (show = false) => {
  if (show) {
    document.body.classList.add("show-warning");
  } else {
    document.body.classList.remove("show-warning");
    preferenceManager.setPreference("hasSeenWarning", true);
  }
};

const handlePreferences = () => {
  const hasSeenWarning = preferenceManager.getPreference(
    "hasSeenWarning",
    false
  );
  if (!hasSeenWarning) handleContentWarningDisplay(true);

  const paneOpen = preferenceManager.getPreference("paneOpen", false);
  if (paneOpen) toggleInfoPane(true);
};

setupListeners();
handlePreferences();
