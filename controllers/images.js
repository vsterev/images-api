const fs = require("fs");
const { imagesPath } = require("../config");
const sharp = require("sharp");
const exifr = require("exifr");
const imageModel = require("../utils/imageModel");
module.exports = {
  post: {
    upload: async (req, res, next) => {
      const info = req.file;
      //   console.log(info);
      const { filename, originalname, path, mimetype, size } = info;
      //   console.log({ filename, latitude, longitude });
      const findImage = await imageModel.findOne({ originalname });
      if (!!findImage) {
        return res.status(202).json(`image with name ${originalname} already exists`);
      }
      const { latitude, longitude } = await exifr.gps(imagesPath + filename);
      const obj = { filename, originalname, path, mimetype, size, latitude, longitude, inputDate: new Date() };

      //   console.log(findImage);
      sharp(imagesPath + filename)
        .resize(256, 256)
        //   .jpeg({ mozjpeg: true })
        .toFile(imagesPath + "thumb-" + filename)
        .then(() => imageModel.create(obj))
        .catch(console.error);
      return res.send(JSON.stringify({ error: null, response: info }));
    },
    search: async (req, res, next) => {
      const { latitudeMin, latitudeMax, longitudeMin, longitudeMax } = req.body;
      console.log({ latitudeMin, latitudeMax, longitudeMin, longitudeMax });
      return;
      const images = await imageModel.find({ latitude: { $gte: latitudeMin, $lte: latitudeMax }, longitude: { $gte: longitudeMin, $lte: longitudeMax } });
      return res.status(200).json(images);
    },
  },
  delete: {
    image: async (req, res, next) => {
      const { name } = req.body;
      const imageExists = await imageModel.findOne({ filename: name });
      if (!imageExists) {
        return res.status(202).json(`image ${name} not exists`);
      }
      const deleteImage = fs.promises.unlink(imagesPath + name);
      const deleteThumb = fs.promises.unlink(imagesPath + "thumb-" + name);
      Promise.all([deleteImage, deleteThumb])
        .then(() => {
          return imageModel.deleteOne({ filename: name });
        })
        .then(() => {
          res.status(200).send({
            message: `File ${name} is deleted.`,
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send({ message: `Could not delete file ${name}. ` + err });
        });
    },
  },
};
