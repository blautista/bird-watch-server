exports.generateBirdWatchesURLByRegionCode = (regionCode, limit) =>
  `https://api.ebird.org/v2/data/obs/${regionCode}/notable?maxResults=${limit}`;

exports.generateBirdWatchesURLByLatAndLng = (
  lat,
  lng,
  distance,
  limit,
  type = "notable"
) =>
  `https://api.ebird.org/v2/data/obs/geo/${type}?lat=${lat}&lng=${lng}&dist=${distance}&maxResults=${limit}`;

exports.generateXenoCantoURLBySearchTerm = (q) =>
  `https://www.xeno-canto.org/api/2/recordings?query=${q}+len_lt:20`;

exports.generateReverseGeocodingURL = (lat, lng, apiKey) =>
  `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${apiKey}`;

exports.generateWikipediaPageInformationUrl = (titles, limit = 5) => {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "pageimages|extracts|info",
    indexpageids: 1,
    titles: titles.join("|"),
    redirects: 1,
    converttitles: 1,
    formatversion: "latest",
    piprop: "thumbnail|original|name",
    pithumbsize: "200",
    pilimit: 100,
    pilicense: "any",
    exintro: 1,
    inprop: "url",
  });
  return `https://en.wikipedia.org/w/api.php?${params.toString()}`;
};
