const axios = require("axios").default;
const { generateWikipediaPageInformationUrl } = require("./serviceUrls");
const {
  convertWikipediaRedirectToBirdName,
  htmlStringToText,
} = require("../utils");

exports.getWikipediaInformation = async (birdNames) => {
  console.log("Getting wikipedia information");
  try {
    const data = await fetchWikipediaInformation(birdNames);
    if (data) {
      const queryData = data.query;
      let wikiInfoObject = {};
      for (let i = 0; i < queryData.pages.length; i++) {
        const { title, original, thumbnail, extract, pagelanguage, fullurl } =
          queryData.pages[i];

        const birdWikiInfo = {
          title,
          image: original?.source,
          thumbnail: thumbnail?.source,
          summary: extract
            ? htmlStringToText(extract)
            : "No description was found",
          pagelanguage,
          url: fullurl,
        };

        const originalBirdName = convertWikipediaRedirectToBirdName(
          title,
          queryData.redirects
        );

        wikiInfoObject[originalBirdName] = { ...birdWikiInfo };
      }
      return wikiInfoObject;
    }
  } catch (error) {
    return { error };
  } finally {
    console.log("finished fetching wikipedia information");
  }
};

const fetchWikipediaInformation = async (birdNames) => {
  try {
    const url = generateWikipediaPageInformationUrl(birdNames);
    const res = await axios.get(url);

    return res.data;
  } catch (error) {
    return { error };
  }
};
