const iso = require("iso-3166-1");

exports.htmlStringToText = (htmlString) =>
  htmlString.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, "");

exports.convertBirdNameToWikipediaRedirect = (birdName, redirectsArray) => {
  for (let redirect of redirectsArray) {
    if (redirect.from === birdName) return redirect.to;
  }
  return undefined;
};
exports.convertWikipediaRedirectToBirdName = (title, redirectsArray) => {
  for (let redirect of redirectsArray) {
    if (redirect.to === title) return redirect.from;
  }
  return undefined;
};

exports.convertCountryCodeToCountryName = (alpha2) =>
  iso.whereAlpha2(alpha2).country;
