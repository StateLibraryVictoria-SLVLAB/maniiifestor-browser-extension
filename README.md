# IIIF-powered browser extension

## Project description

A brief and descriptive introduction to the project/product contained in the repository.

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

### Deployment

- Chrome: follow the instructions here [https://developer.chrome.com/docs/webstore/register](https://developer.chrome.com/docs/webstore/register)

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
