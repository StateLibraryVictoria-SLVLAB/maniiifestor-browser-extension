const readDataset = async (fileName) => {
  const dataset = await fetch(`./${fileName}`);
  const response = await dataset.json();
  const { data } = response;
  return data;
};

const iiifViewer = async (iePid) => {
  const iiifManifestUrl = `https://rosetta.slv.vic.gov.au/delivery/iiif/presentation/2.1/${iePid}/manifest`;
  const response = await fetch(iiifManifestUrl);
  const iiifManifest = await response.json();

  let tileSource;

  if (iiifManifest) {
    const imageId =
      iiifManifest["sequences"][0]["canvases"][0]["images"][0]["resource"][
        "service"
      ]["@id"];
    tileSource = `${imageId}/info.json`;
  } else {
    console.log("Error");
    tileSource =
      "https://rosetta.slv.vic.gov.au:2083/iiif/2/IE1258179:FL20898197.jpg/info.json";
  }

  return OpenSeadragon({
    id: "openseadragoncontainer",
    prefixUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.1/images",
    showFullPageControl: true,
    showNavigationControl: false,
    tileSources: [tileSource],
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

    osdContainer.style.backgroundImage = `linear-gradient(to bottom right, rgb(${palette1RGB}), rgb(${palette5RGB}))`;

    return viewer;
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    const descMetadata = document.getElementById("desc-metadata");
    descMetadata.innerHTML = `<h2>Oops! something went wrong. try refreshing the tab.</h2>`;
  }
};

viewer();
