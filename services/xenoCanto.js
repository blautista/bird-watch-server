const axios = require("axios").default;
const { generateXenoCantoURLBySearchTerm } = require("./serviceUrls");

exports.getBirdRecordings = async (birdSciNames, birdNames) => {
  console.log("fetching bird recordings...");
  const promises = birdSciNames.map((n) => fetchBirdRecordings(n));
  try {
    const dataArray = await Promise.all(promises);
    const birdRecordingsObject = parseAllBirdRecordings(
      dataArray,
      birdSciNames
    );

    return birdRecordingsObject;
  } catch (error) {
    return { error };
  } finally {
    console.log("finished fetching bird recordings");
  }
};

const parseAllBirdRecordings = (dataArray, birdSciNames) => {
  let parsedAllBirdRecordings = {};
  dataArray.map((birdData, index) => {
    const sciName = birdSciNames[index];
    const parsedBirdRecordings = birdData.recordings
      .map(({ loc, rec, file, date }) => ({
        location: loc,
        recordedBy: rec,
        url: file,
        date,
      }))
      .slice(0, 3);

    parsedAllBirdRecordings[sciName] = parsedBirdRecordings;
  });

  return parsedAllBirdRecordings;
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
