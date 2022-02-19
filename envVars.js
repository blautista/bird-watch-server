require("dotenv").config();

const envVars = {
  PIXABAY_API_KEY: process.env.PIXABAY_API_KEY,
  EBIRD_API_KEY: process.env.EBIRD_API_KEY,
  OPENWEATHERMAP_API_KEY: process.env.OPENWEATHERMAP_API_KEY,
  EBIRD_KEY_HEADER_NAME: process.env.EBIRD_KEY_HEADER_NAME,
  PORT: process.env.PORT,
};

module.exports = envVars;
