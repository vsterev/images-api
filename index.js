const app = require("express")();
const config = require("./config");
const express = require("express");
const mongoose = require("mongoose");
const functions = require("./utils/functions");
const upload = require("./utils/upload");

mongoose
  .connect(config.dataBaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true })); //to recognize req.body in post request
    app.use('/uploads', express.static('./uploads'));
    app.post("/search", functions.post.search);
    app.post("/upload", upload, functions.post.upload);
    app.delete("/delete", functions.delete.image);
    app.use(function (err, req, res, next) {
      console.error(err);
    });
    app.listen(config.port, console.log(`Listening on port ${config.port}! Image API is running ...`));
  })
  .catch((err) => {
    console.log(err);
  });
