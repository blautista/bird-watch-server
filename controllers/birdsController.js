const { getBirdWatches } = require("../services/eBird");
const { getWikipediaInformation } = require("../services/wikipedia");
const { getBirdRecordings } = require("../services/xenoCanto");
const { getLocationFromCoordinates } = require("../services/openWeatherMap");

const getAllBirdDAta = async (req, res, next) => {
  console.log("Starting request");
  const userLat = req.query?.lat;
  const userLng = req.query?.lng;
  const shouldFetchAudio = req.query?.audio;

  const numberOfBirds = 10;

  try {
    const birdWatchesArray = await getBirdWatches(
      userLat,
      userLng,
      numberOfBirds
    );

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
    res.json({ data: response, ...userLocationObject });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = getAllBirdDAta;
