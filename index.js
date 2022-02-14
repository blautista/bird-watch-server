const express = require("express");
const app = express();
const axios = require("axios").default;
const {
  generateBirdWatchesURLByLatAndLng,
  generateBirdWatchesURLByRegionCode,
  generateWikipediaPageInformationUrl,
} = require("./serviceUrls.js");
const { htmlStringToText } = require("./utils.js");
require("dotenv").config();
const PORT = process.env.PORT;

app.get("/", async (req, res) => {
  const regionCode = req.query.regionCode;
  const userLat = req.query?.lat;
  const userLng = req.query?.lng;
  let url;

  if (userLat && userLng)
    url = generateBirdWatchesURLByLatAndLng(userLat, userLng, 25);
  else url = generateBirdWatchesURLByRegionCode(regionCode, 25);

  try {
    const { comName, locName, sciName, obsDt, lat, lng } =
      await fetchBirdWatches(url, 1);

    const wikiInfo = await getWikipediaInformation(comName);

    console.log(wikiInfo);

    const resObject = {
      birdLocation: locName,
      birdName: comName,
      birdSciName: sciName,
      observedAt: obsDt,
      lat,
      lng,
      wikiInfo: wikiInfo,
    };

    res.send(JSON.stringify(resObject));
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {});

const fetchBirdWatches = async (url, amount = 1) => {
  try {
    const eBirdApiKey = process.env.EBIRD_API_KEY;
    const eBirdKeyHeaderName = process.env.EBIRD_KEY_HEADER_NAME;

    const customHeaders = { [eBirdKeyHeaderName]: eBirdApiKey };
    const res = await axios.get(url, { headers: { ...customHeaders } });

    const watchData = res.data;

    return watchData[0];
  } catch (error) {
    console.log(error.message);
  }
};

const getWikipediaInformation = async (searchTerm) => {
  try {
    const url = generateWikipediaPageInformationUrl(searchTerm);
    console.log(url);
    const res = await axios.get(url);

    if (res.data) {
      const queryData = res.data.query;
      const pageId = queryData.pageids[0];
      const { title, original, extract, pagelanguage, fullurl } =
        queryData.pages[pageId];

      const wikiInfo = {
        title,
        image: original.source,
        summary: htmlStringToText(extract),
        pagelanguage,
        url: fullurl,
      };

      return wikiInfo;
    }
  } catch (error) {
    console.log(error.message);
  }
};
