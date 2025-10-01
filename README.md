# ManIIIFestor: a IIIF-powered browser extension

## Project description

ManIIIFestor is an extension or add-on that can be added to either the Chrome or Firefox web browsers. It adds an image selected at random from the Library's copyright-free image pool. It does this by leveraging the IIIF image API.

The project was originally developed as part of a collaborative hack day between the Library's Collection, Curation and Engagement department and Code Club. You can read more about it's development and access associated resources here [https://lab.slv.vic.gov.au/experiments/maniiifestor-browser-extension](https://lab.slv.vic.gov.au/experiments/maniiifestor-browser-extension).

### Tech stack

Built using:

- HTML
- CSS
- JavaScript
- OpenSeaDragon [https://openseadragon.github.io/](https://openseadragon.github.io/)

### Directory structure

```md
    image-browser-extension
    ┣ assets
    ┃ ┣ images
    ┃ ┃ ┣ icon.png
    ┃ ┃ ┗ IIIF-logo-colored-text.svg
    ┃ ┗ style
    ┃ ┃ ┗ style.css
    ┣ data
    ┃ ┗ dataset.json
    ┣ openseadragon-bin-5.0.1
    ┣ scripts
    ┃ ┗ iiif-viewer.js
    ┣ manifest.json
    ┣ package.json
    ┣ README.md
    ┗ slv-iiif-image-tab.html
```

## Getting started

### Installation

Follow these steps to install and run the repository locally:

- `git clone git@github.com:StateLibraryVictoria/maniiifestor-browser-extension.git`

### Running locally

The HTML file can previewed directly through any browser.

If you wish to test the browser-specific features you should follow the instructions here:

- Chrome [https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).
- Firefox [https://addons.mozilla.org/en-US/developers/addon/validate](https://addons.mozilla.org/en-US/developers/addon/validate)

### Deployment

The browser extension is distributed via the Chrome webstore and as a Firefox Add-on. In order to contribute to them you will need access to the listings:

- Chrome: you will need to have a Google Developer account, and to be added to the 'SLV LAB' private Google Group [https://groups.google.com/g/slv-lab](https://groups.google.com/g/slv-lab)
- Firefox: credentials for the Add On developer account are saved in the SLV LAB BeyondTrust secrets vault.

For both Chrome and Firefox updates are made by uploading a zip package containing the contents of this repository. Each update requires an updated and unique `version` in the [manifest.json](manifest.json) file.

### Commit style

Contributors to this repository are requested to use the Library's commit style guide [https://github.com/StateLibraryVictoria/basic-template/wiki/Commit-message-style-guide](https://github.com/StateLibraryVictoria/basic-template/wiki/Commit-message-style-guide).

Here is an overview of the format:

```bash
git commit -m'
    <type>[optional scope]: <description>

    [optional body]

    [optional footer(s)]'
```

### Branching strategy & naming convention

Updates/pushes directly to the `main` branch are strongly discouraged. Instead code should be updated through the use of feature branches. Branches should be created and named in accordance with the Library's branch naming guides: [https://github.com/StateLibraryVictoria/basic-template/wiki/branching-strategy](https://github.com/StateLibraryVictoria/basic-template/wiki/branching-strategy).
