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
  console.log(manifest);

  const imageId =
    manifest?.sequences?.[0]?.canvases?.[0]?.images?.[0]?.resource?.service?.[
      "@id"
    ];
  if (!imageId) {
    throw new Error("Invalid manifest structure");
  }
  return imageId;
};

const handleViewerError = (error) => {
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

const iiifViewer = async (manifest) => {
  try {
    const tileSource = `${manifest}/info.json`;

    // Initialise viewer with fetched manifest
    return await initialiseViewer(tileSource);
  } catch (error) {
    const errorMessage = handleViewerError(error);

    if (typeof window !== "undefined") {
      console.log(errorMessage);
    }

    //TODO: implement a fallback option if possible
  }
};

const initialiseViewer = async (tileSource) => {
  const viewer = OpenSeadragon({
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
    preserveImageSizeOnResize: true,
    minZoomImageRatio: 0.5,
    springStiffness: 20,
    animationTime: 0.75,
  });

  viewer.addHandler("open", function () {
    const currentZoom = viewer.viewport.getZoom();

    // wait for next tick to zoom image
    setTimeout(() => {
      viewer.viewport.zoomTo(currentZoom * 0.8, null, true);

      // Pan the image up a tiny bit
      const currentCenter = viewer.viewport.getCenter();
      const pixelDelta = new OpenSeadragon.Point(0, 45);
      const viewportDelta = viewer.viewport.deltaPointsFromPixels(pixelDelta);
      viewer.viewport.panTo(
        new OpenSeadragon.Point(
          currentCenter.x,
          currentCenter.y + viewportDelta.y
        ),
        true
      );
    }, 1);
  });

  return viewer;
};

const fetchRandomImageManifest = async () => {
  const response = await fetchWithTimeout(
    "https://86l3n9wbnc.execute-api.ap-southeast-2.amazonaws.com/Prod/cfip/random/iiif",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();

  return data?.record;
};

const viewer = async () => {
  try {
    const imageRecord = await fetchRandomImageManifest();

    const iePid = imageRecord?.iePid;
    const title = imageRecord?.title;
    const metadata = imageRecord?.metadata;

    const palette1RGB = imageRecord?.["palette_1"];
    const palette5RGB = imageRecord?.["palette_5"];

    const viewer = await iiifViewer(imageRecord?.manifest);

    const descMetadata = document.getElementById("desc-metadata");

    let titleH2 = document.createElement("h2");
    titleH2.innerText = title;

    if (descMetadata) {
      descMetadata.append(titleH2);
    }

    const descMetadataV = document.getElementById("desc-metadata-v");
    if (descMetadataV) {
      let titleH2 = document.createElement("h2");
      titleH2.innerText = title;
      descMetadataV.append(titleH2);
    }

    const titleMetadata = document.getElementById("title-metadata");

    if (titleMetadata) {
      titleMetadata.innerHTML = title;
    }

    const creatorMetadata = document.getElementById("creator-metadata");
    if (creatorMetadata && metadata?.[0]?.value) {
      creatorMetadata.innerText = `${metadata?.[0]?.value}`;
    }

    const linkCat = document.getElementById("link-cat");

    if (linkCat) {
      linkCat.href = `https://viewer.slv.vic.gov.au/?entity=${iePid}&mode=browse`;
    }

    const linkManifest = document.getElementById("link-manifest");

    if (linkManifest) {
      linkManifest.href = `https://rosetta.slv.vic.gov.au/delivery/iiif/presentation/2.1/${iePid}/manifest`;
    }

    const osdContainer = document.getElementById("container");

    osdContainer.style.setProperty("--c1", `rgb(${palette1RGB})`);
    osdContainer.style.setProperty("--c2", `rgb(${palette5RGB})`);

    // Trigger the window resize event to resize the title to fit
    window.dispatchEvent(new Event("resize"));

    viewer.addHandler("canvas-drag", () => {
      document.body.classList.add("dragging");
    });

    viewer.addHandler("canvas-drag-end", () => {
      document.body.classList.remove("dragging");
    });

    return viewer;
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    const descMetadata = document.getElementById("desc-metadata");
    descMetadata.innerHTML = `<h2>Oops! something went wrong. try refreshing the tab.</h2>`;
  }
};

viewer();
