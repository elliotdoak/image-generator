import $ from "jquery";
import Swal from "sweetalert2";
import JSZip from "jszip";
import { saveAs } from "file-saver";

$(document).ready(() => {
  $("#submit-btn").on("click", async (event) => {
    event.preventDefault();
    const lon = Number($("#lon").val());
    const lat = Number($("#lat").val());
    const horDist = $("#hor-dist").val();
    const verDist = $("#ver-dist").val();

    if (!isValidForm(lon, lat, horDist, verDist)) {
      Swal.fire({
        icon: "error",
        title: "Invalid input",
        text: "One of the inputs does not match the required criteria",
        backdrop: `
          rgb(108, 122, 137, 0.75)
        `,
      });
      return false;
    }
    const urls = getUrls(lon, lat, horDist, verDist);
    downloadZip(urls);
  });
});

const getUrls = (startLon, startLat, horDist, verDist) => {
  const urls = [];
  let prevLat = Number(startLat.toFixed(6));
  let count = 0;
  for (let i = 0; i < verDist; i++) {
    let prevLon = Number(startLon.toFixed(6));
    for (let j = 0; j < horDist; j++) {
      count++;
      urls.push({
        url: `https://maps.googleapis.com/maps/api/staticmap?center=${prevLat}%2C%20${prevLon}&zoom=19&size=600x400&maptype=satellite&key={API_KEY}
        `,
        name: `image[${count}]_lat=${prevLat}_lon=${prevLon}.png`,
      });
      prevLon = Number((prevLon + 0.01).toFixed(6));
    }
    prevLat = Number((prevLat - 0.01).toFixed(6));
  }
  return urls;
};

const downloadZip = async (urls) => {
  const zip = new JSZip();
  Promise.all(
    urls.map(async ({ url, name }) => {
      return fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          zip.file(name, blob);
        });
    })
  ).then(() => {
    //  Generate the zip file.
    zip.generateAsync({ type: "blob" }).then((blob) => {
      // Use FileSaver.js to download the zip file.
      saveAs(blob, "images.zip");
    });
  });
};

const isValidForm = (lon, lat, horDist, verDist) =>
  /^[-+]?\d+(\.\d{1,6})?$/.test(lon) &
  /^[-+]?\d+(\.\d{1,6})?$/.test(lat) &
  /^\d+$/.test(horDist) &
  /^\d+$/.test(verDist);
