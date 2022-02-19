const express = require("express");
const app = express();
const birdRouter = require("./routes/birdRoutes");

app.use(express.json());
app.use("/api/birds", birdRouter);

module.exports = app;
