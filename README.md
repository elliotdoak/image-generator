# Image Downloader

This JavaScript code allows you to download a set of satellite images from Google Maps API, given the latitude, longitude, and dimensions of the area you want to download. When entering a starting coordinate, use the most north western point of the area you require coverage over.

## Dependencies

The following dependencies are required:

- jQuery
- SweetAlert2
- JSZip
- FileSaver.js

## Setup

1. Clone the repository or copy the code into a new project directory.
2. Install the dependencies listed above by running the yarn command in terminal.

```
yarn
```

3. Create a new file named constants.js in the same directory as index.js.
4. In constants.js, define your GOOGLE_API_KEY value as shown below.

```
   export const GOOGLE_API_KEY = "your_google_maps_api_key_here"
```

5. To create `dist` build folder, run the following in your terminal

```
yarn run build
```

## Usage

1. Open index.html in your web browser, in vs code you can open the index.html and select the GoLive feature to easily start a local web server and preview the project in your browser.
2. Enter the latitude and longitude of the area you want to download, as well as the surface area dimensions you would like to cover.
3. Click the "Download" button to download a .zip file containing the requested images, this may take a minute depending on size of area.
