const express = require("express");
const birdInformationController = require("../controllers/birdsController");
const router = express.Router();

router.route("/").get(birdInformationController);

module.exports = router;
