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

const setupListeners = () => {
  const paneToggleEle = document.getElementById("pane-toggle");

  if (paneToggleEle) {
    paneToggleEle.addEventListener("click", toggleInfoPane);
  }
};

setupListeners();
