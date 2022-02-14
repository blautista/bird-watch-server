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
