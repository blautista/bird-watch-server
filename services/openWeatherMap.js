const axios = require("axios").default;
const { convertCountryCodeToCountryName } = require("../utils");
const { OPENWEATHERMAP_API_KEY } = require("../envVars");
const { generateReverseGeocodingURL } = require("./serviceUrls");

exports.getLocationFromCoordinates = async (lat, lng) => {
  try {
    console.log(`trying to convert ${lat},${lng} to address`);
    const url = generateReverseGeocodingURL(lat, lng, OPENWEATHERMAP_API_KEY);
    const res = await axios.get(url);
    const data = res.data[0];
    return {
      userLocation: {
        ...data,
        country: convertCountryCodeToCountryName(data.country),
      },
    };
  } catch (error) {
    console.log(error.message);
    return { error };
  }
};
