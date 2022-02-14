exports.generateBirdWatchesURLByRegionCode = (regionCode) =>
  `https://api.ebird.org/v2/data/obs/${regionCode}/recent?maxResults=1`;
exports.generateBirdWatchesURLByLatAndLng = (lat, lng, distance) =>
  `https://api.ebird.org/v2/data/obs/geo/recent?lat=${lat}&lng=${lng}&dist=${distance}&maxResults=1`;
exports.generateWikipediaPageInformationUrl = (searchTerm) => {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "pageimages|extracts|info",
    indexpageids: 1,
    titles: searchTerm,
    redirects: 1,
    converttitles: 1,
    piprop: "thumbnail|original|name",
    pithumbsize: "50",
    pilimit: "1",
    exintro: 1,
    inprop: "url",
  });
  return `https://en.wikipedia.org/w/api.php?${params.toString()}`;
};
