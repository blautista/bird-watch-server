exports.generateBirdWatchesURLByRegionCode = (regionCode, limit) =>
  `https://api.ebird.org/v2/data/obs/${regionCode}/recent?maxResults=${limit}`;
exports.generateBirdWatchesURLByLatAndLng = (lat, lng, distance, limit) =>
  `https://api.ebird.org/v2/data/obs/geo/recent?lat=${lat}&lng=${lng}&dist=${distance}&maxResults=${limit}`;
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
    pilimit: limit,
    pilicense: "any",
    exintro: 1,
    inprop: "url",
  });
  return `https://en.wikipedia.org/w/api.php?${params.toString()}`;
};
