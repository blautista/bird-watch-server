const express = require("express");
const app = express();
const birdRouter = require("./routes/birdRoutes");

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8888");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use("/api/birds", birdRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "not found",
    message: `Can't find ${req.originalUrl} in the server`,
  });
});

module.exports = app;
