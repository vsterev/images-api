const app = require("express")();
const config = require("./config");
const routes = require("./routes");
const express = require("express");
const mongoose = require("mongoose");
const imagesController = require("./controllers/images");
const { Router } = require("express");

mongoose
  .connect(config.dataBaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true })); //to recognize req.body in post request
    app.use("/images", routes.images);
    app.post("/search", imagesController.post.search);

    app.use(function (err, req, res, next) {
      console.error(err);
    });
    app.listen(config.port, console.log(`Listening on port ${config.port}! Image API is running ...`));
  })
  .catch((err) => {
    console.log(err);
  });
