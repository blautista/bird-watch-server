const express = require("express");
const app = express();
require("dotenv").config();
const axios = require("axios").default;
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

const apiKey = "";

const fetchBirdWatches = async (regionCode, amount) => {
  try {
    const eBirdApiKey = process.env.EBIRD_API_KEY;
    const eBirdKeyHeaderName = process.env.EBIRD_KEY_HEADER_NAME;
    const url = `https://api.ebird.org/v2/data/obs/${regionCode}/recent?maxResults=${amount}`;
    const customHeaders = { [eBirdKeyHeaderName]: eBirdApiKey };
    const res = await axios.get(url, { headers: { ...customHeaders } });

    const watchData = res.data;
    console.log("Succesfully fetched " + regionCode + " watches");

    return watchData;
  } catch (error) {
    console.log(error.message);
  }
};

const fetchBirdPictures = async (searchTerm) => {
  try {
    const pixabayApiKey = process.env.PIXABAY_API_KEY;
    const url = `https://pixabay.com/api/?q=${searchTerm}&per_page=3&category=animals&key=${pixabayApiKey}`;
    const res = await axios.get(url);

    const imageUrl = res.data.hits[0].webformatURL;
    console.log("Succesfully fetched " + searchTerm + " pictures");
    return imageUrl;
  } catch (error) {
    console.log(error.message);
  }
};
