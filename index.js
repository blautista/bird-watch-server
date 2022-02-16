const express = require("express");
const app = express();
const axios = require("axios").default;
const {
  generateBirdWatchesURLByLatAndLng,
  generateBirdWatchesURLByRegionCode,
  generateWikipediaPageInformationUrl,
} = require("./serviceUrls.js");
const {
  htmlStringToText,
  convertWikipediaRedirectToBirdName,
} = require("./utils.js");
require("dotenv").config();
const PORT = process.env.PORT;

app.get("/birds", async (req, res) => {
  const regionCode = req.query.regionCode;
  const userLat = req.query?.lat;
  const userLng = req.query?.lng;

  const numberOfBirds = 5;
  let url = "";

  if (userLat && userLng)
    url = generateBirdWatchesURLByLatAndLng(
      userLat,
      userLng,
      25,
      numberOfBirds
    );
  else url = generateBirdWatchesURLByRegionCode(regionCode, numberOfBirds);

  try {
    const birdWatchesArray = await fetchBirdWatches(url);

    const birdNames = birdWatchesArray.map(({ birdName }) => birdName);

    const wikiInfoObject = await getWikipediaInformation(birdNames);

    const response = birdWatchesArray.map((bird) => ({
      ...bird,
      wikiInfo: wikiInfoObject[bird.birdName],
    }));

    res.header("Content-type", "application/json");
    res.send({ data: response });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {});

const parseBirdWatchesResponse = ({
  locName,
  comName,
  sciName,
  obsDt,
  lat,
  lng,
}) => ({
  birdLocation: locName,
  birdName: comName,
  birdSciName: sciName,
  observedAt: obsDt,
  lat,
  lng,
});

const fetchBirdWatches = async (url, amount = 1) => {
  try {
    const eBirdApiKey = process.env.EBIRD_API_KEY;
    const eBirdKeyHeaderName = process.env.EBIRD_KEY_HEADER_NAME;

    const customHeaders = { [eBirdKeyHeaderName]: eBirdApiKey };
    const res = await axios.get(url, { headers: { ...customHeaders } });

    const watchData = res.data.map((bird) => parseBirdWatchesResponse(bird));

    return watchData;
  } catch (error) {
    console.log(error.message);
  }
};

const getWikipediaInformation = async (birdNames) => {
  try {
    const url = generateWikipediaPageInformationUrl(birdNames);
    const res = await axios.get(url);
    if (res.data) {
      const queryData = res.data.query;
      let wikiInfoObject = {};
      for (let i = 0; i < queryData.pages.length; i++) {
        const { title, original, thumbnail, extract, pagelanguage, fullurl } =
          queryData.pages[i];

        const birdWikiInfo = {
          title,
          image: original?.source,
          thumbnail: thumbnail?.source,
          summary: htmlStringToText(extract),
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
    console.error(error.message);
  }
};
