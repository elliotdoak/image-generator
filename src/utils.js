export const isValidForm = (lon, lat, horDist, verDist) =>
  /^[-+]?\d+(\.\d{1,6})?$/.test(lon) &
  /^[-+]?\d+(\.\d{1,6})?$/.test(lat) &
  /^\d+$/.test(horDist) &
  /^\d+$/.test(verDist);
