import $ from "jquery";
import Swal from "sweetalert2";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { GOOGLE_API_KEY, incrementer } from "./constants";
import { isValidForm } from "./utils";

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

  $("#csv-download-btn").on("click", async (event) => {
    event.preventDefault();
    const startLon = Number($("#lon").val());
    const horDist = $("#hor-dist").val();
    const verDist = $("#ver-dist").val();
    let prevLat = Number($("#lat").val());
    let count = 0;
    let data = [];

    for (let i = 0; i < verDist; i++) {
      let prevLon = Number(startLon.toFixed(6));
      for (let j = 0; j < horDist; j++) {
        count++;
        data.push({
          latitude: prevLat,
          longitude: prevLon,
          imageNumber: count,
        });
        prevLon = Number((prevLon + incrementer).toFixed(6));
      }
      prevLat = Number((prevLat - incrementer).toFixed(6));
    }

    let csv =
      "ImageNo,Latitude,Longitude,Boma,Fence,Building,Track/Road,Name,Comment,Boma,Fence,Building,Track/Road,Name,Comment,Boma,Fence,Building,Track/Road,Name,Comment\n";

    for (let i = 0; i < data.length; i++) {
      const row = `${data[i].imageNumber},${data[i].latitude},${data[i].longitude}\n`;
      csv += row;
    }

    const filename = "image-logging.csv";

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }
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
        url: `https://maps.googleapis.com/maps/api/staticmap?center=${prevLat}%2C%20${prevLon}&zoom=17&size=600x400&maptype=satellite&key=${GOOGLE_API_KEY}`,
        name: `image[${count}]_lat=${prevLat}_lon=${prevLon}.png`,
      });
      prevLon = Number((prevLon + incrementer).toFixed(6));
    }
    prevLat = Number((prevLat - incrementer).toFixed(6));
  }
  return urls;
};

const downloadZip = async (urls) => {
  const zip = new JSZip();

  try {
    await Promise.all(
      urls.map(async ({ url, name }) => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            `Failed to download image: ${response.status} ${response.statusText}`
          );
        }
        const blob = await response.blob();
        zip.file(name, blob);
      })
    );

    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Use FileSaver.js to download the zip file.
    saveAs(zipBlob, "images.zip");
  } catch (error) {
    // Display error message using Swal
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  }
};
