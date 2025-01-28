const readDataset = async (fileName) => {
  const dataset = await fetch(`./${fileName}`);
  const response = await dataset.json();
  const { data } = response;
  return data;
};

const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

const getManifest = async (url) => {
  const response = await fetchWithTimeout(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

const validateManifest = (manifest) => {
  const imageId =
    manifest?.sequences?.[0]?.canvases?.[0]?.images?.[0]?.resource?.service?.[
      "@id"
    ];
  if (!imageId) {
    throw new Error("Invalid manifest structure");
  }
  return imageId;
};

const handleError = (error) => {
  console.error("Error loading IIIF manifest:", error);

  if (error.name === "AbortError") {
    return "Request timed out. Please try again.";
  }

  if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
    return "CORS error or network issue. Using fallback image.";
  }

  if (error.message.includes("HTTP error! status: 502")) {
    return "Server temporarily unavailable. Using fallback image.";
  }

  return "An error occurred while loading the image.";
};

const iiifViewer = async (iePid, fallbackTileSource) => {
  const defaultFallbackTileSource =
    "https://rosetta.slv.vic.gov.au:2083/iiif/2/IE1258179:FL20898197.jpg/info.json";
  const iiifManifestUrl = `https://rosetta.slv.vic.gov.au/delivery/iiif/presentation/2.1/${iePid}/manifest`;

  try {
    // Fetch and validate manifest
    const manifest = await getManifest(iiifManifestUrl);
    const imageId = validateManifest(manifest);
    const tileSource = `${imageId}/info.json`;

    // Initialise viewer with fetched manifest
    return await initialiseViewer(tileSource);
  } catch (error) {
    const errorMessage = handleError(error);

    if (typeof window !== "undefined") {
      console.log(errorMessage);
    }

    //TODO: implement a fallback option if possible
  }
};

const initialiseViewer = (tileSource) => {
  return OpenSeadragon({
    id: "openseadragoncontainer",
    prefixUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.1/images",
    showFullPageControl: true,
    showNavigationControl: false,
    tileSources: [tileSource],
    crossOriginPolicy: "Anonymous",
    loadTilesWithAjax: true,
    ajaxHeaders: {
      Accept: "image/jpeg",
    },
  });
};

const viewer = async () => {
  try {
    const dataset = await readDataset("./data/dataset.json");

    const randomIndex = Math.floor(Math.random() * dataset.length);
    const randomEntry = dataset[randomIndex];

    const iePid = randomEntry["IE PID"];
    const title = randomEntry["Title (DC)"];
    const palette1 = randomEntry["palette_1"];
    const palette1RGB = `${palette1[0]}, ${palette1[1]}, ${palette1[2]}`;
    const palette5 = randomEntry["palette_5"];
    const palette5RGB = `${palette5[0]}, ${palette5[1]}, ${palette5[2]}`;

    const viewer = await iiifViewer(iePid);

    const descMetadata = document.getElementById("desc-metadata");
    descMetadata.innerHTML = `<h2> ${title} </h2>`;

    const iiifManifestLink = `https://rosetta.slv.vic.gov.au/delivery/iiif/presentation/2.1/${iePid}/manifest`;
    const imageLink = `https://viewer.slv.vic.gov.au/?entity=${iePid}&mode=browse`;

    descMetadata.innerHTML += `<div id="links">
          <a href="${imageLink}" target="_blank" rel="noopener noreferrer">SLV image viewer</a>
          <a href="${iiifManifestLink}" target="_blank" rel="noopener noreferrer">IIIF manifest</a>
        </div>`;

    const osdContainer = document.getElementById("container");

    osdContainer.style.setProperty("--c1", `rgb(${palette1RGB})`);
    osdContainer.style.setProperty("--c2", `rgb(${palette5RGB})`);

    return viewer;
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    const descMetadata = document.getElementById("desc-metadata");
    descMetadata.innerHTML = `<h2>Oops! something went wrong. try refreshing the tab.</h2>`;
  }
};

viewer();
