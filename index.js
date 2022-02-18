const express = require("express");
const app = express();
const axios = require("axios").default;
const {
  generateBirdWatchesURLByLatAndLng,
  generateBirdWatchesURLByRegionCode,
  generateWikipediaPageInformationUrl,
  generateXenoCantoURLBySearchTerm,
  generateReverseGeocodingURL,
} = require("./serviceUrls.js");
const {
  htmlStringToText,
  convertWikipediaRedirectToBirdName,
} = require("./utils.js");
require("dotenv").config();
const PORT = process.env.PORT;

app.get("/birds", async (req, res) => {
  console.log("Starting request");
  const regionCode = req.query.regionCode;
  const userLat = req.query?.lat;
  const userLng = req.query?.lng;
  const shouldFetchAudio = req.query?.audio;

  const numberOfBirds = 10;
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
    const birdSciNames = birdWatchesArray.map(({ birdSciName }) => birdSciName);

    console.log("finished fetching eBird information." + birdNames.join(","));
    const wikiInfoPromise = getWikipediaInformation(birdSciNames);
    const xenoCantoPromise = getBirdRecordings(birdSciNames, birdNames);
    const reverseGeocodingPromise = getLocationFromCoordinates(
      userLat,
      userLng
    );

    const [wikiInfoObject, xenoCantoObject, userLocationObject] =
      await Promise.all([
        wikiInfoPromise,
        xenoCantoPromise,
        reverseGeocodingPromise,
      ]);

    console.log("finished fetching both wikiInfo and birdRecs");
    const response = birdWatchesArray.map((bird) => ({
      ...bird,
      wikiInfo: wikiInfoObject[bird.birdSciName],
      recordings: xenoCantoObject[bird.birdSciName],
    }));
    console.log("response sent");
    res.header("Content-type", "application/json");
    res.send({ data: response, ...userLocationObject });
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

const getBirdRecordings = async (birdSciNames, birdNames) => {
  console.log("fetching bird recordings...");
  const promises = birdSciNames.map((n) => fetchBirdRecordings(n));
  try {
    const dataArray = await Promise.all(promises);
    const birdRecordingsObject = {};
    for (let i = 0; i < birdSciNames.length; i++) {
      birdRecordingsObject[birdSciNames[i]] = dataArray[i].recordings.slice(
        0,
        3
      );
    }
    return birdRecordingsObject;
  } catch (error) {
    return { error };
  } finally {
    console.log("finished fetching bird recordings");
  }
};

const fetchBirdRecordings = async (searchTerm) => {
  const url = generateXenoCantoURLBySearchTerm(searchTerm);
  try {
    const res = await axios.get(url);
    console.log("finished birdRec req for " + searchTerm);
    return res.data;
  } catch (error) {
    return { error };
  }
};

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

const fetchWikipediaInformation = async (birdNames) => {
  try {
    const url = generateWikipediaPageInformationUrl(birdNames);
    const res = await axios.get(url);

    return res.data;
  } catch (error) {
    return { error };
  }
};

const getLocationFromCoordinates = async (lat, lng) => {
  try {
    console.log(`trying to convert ${lat},${lng} to address`);
    const url = generateReverseGeocodingURL(
      lat,
      lng,
      process.env.OPENWEATHERMAP_API_KEY
    );
    const res = await axios.get(url);

    return { userLocation: res.data[0] };
  } catch (error) {
    console.log(error.message);
    return { error };
  }
};

const getWikipediaInformation = async (birdNames) => {
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
