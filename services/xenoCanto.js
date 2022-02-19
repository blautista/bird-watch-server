const axios = require("axios").default;
const { generateXenoCantoURLBySearchTerm } = require("./serviceUrls");

exports.getBirdRecordings = async (birdSciNames, birdNames) => {
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
