exports.htmlStringToText = (htmlString) =>
  htmlString.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, "");
