const axios = require("axios").default;
const { EBIRD_API_KEY, EBIRD_KEY_HEADER_NAME } = require("../envVars");
const { generateBirdWatchesURLByLatAndLng } = require("./serviceUrls");

exports.getBirdWatches = async (userLat, userLng, numberOfBirds = 5) => {
  const radiusInKm = 25;
  console.log("lessget sum birds form ebird ");

  const url = generateBirdWatchesURLByLatAndLng(
    userLat,
    userLng,
    radiusInKm,
    numberOfBirds,
    "recent"
  );

  try {
    const eBirdApiKey = EBIRD_API_KEY;
    const eBirdKeyHeaderName = EBIRD_KEY_HEADER_NAME;

    const customHeaders = { [eBirdKeyHeaderName]: eBirdApiKey };
    const res = await axios.get(url, { headers: { ...customHeaders } });

    const watchData = res.data.map((bird) => parseBirdWatchesResponse(bird));

    return watchData;
  } catch (error) {
    return { error };
  }
};

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
