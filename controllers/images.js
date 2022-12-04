const fs = require("fs");
const { imagesPath } = require("../config");
const sharp = require("sharp");
const exifr = require("exifr");
const imageModel = require("../utils/imageModel");
const zip = require("express-zip");
module.exports = {
  post: {
    upload: async (req, res, next) => {
      const info = req.file;
      const { filename, originalname, path, mimetype, size } = info;
      const findImage = await imageModel.findOne({ originalname });
      if (!!findImage) {
        return res.status(202).json(`image with name ${originalname} already exists`);
      }
      const { latitude, longitude } = await exifr.gps(imagesPath + filename);
      const obj = { filename, originalname, path, mimetype, size, latitude: Number(latitude), longitude: Number(longitude), inputDate: new Date() };
      sharp(imagesPath + filename)
        .resize(256, 256)
        //   .jpeg({ mozjpeg: true })
        .toFile(imagesPath + "thumb-" + filename)
        .then(() => imageModel.create(obj))
        .catch(console.error);
      return res.send(JSON.stringify({ error: null, response: info }));
    },
    search: async (req, res, next) => {
      const { latitudeMin, latitudeMax, longitudeMin, longitudeMax, archive } = req.body;
      const searchStr = () => {
        const searchObj = {};
        if (latitudeMin) {
          searchObj.latitude = { ...searchObj.latitude, ["$gte"]: +latitudeMin };
        }
        if (latitudeMax) {
          searchObj.latitude = { ...searchObj.latitude, ["$lte"]: +latitudeMax };
        }
        if (longitudeMin) {
          searchObj.longitude = { ...searchObj.longitude, ["$gte"]: +longitudeMin };
        }
        if (longitudeMax) {
          searchObj.longitude = { ...searchObj.longitude, ["$lte"]: +longitudeMax };
        }
        return searchObj;
      };
      const images = await imageModel.find(searchStr());
      if (images.length === 0) {
        return res.status(404).json("no images found");
      }
      if (archive) {
        const filenames = images.reduce((accu, curr) => {
          return [...accu, { path: imagesPath + curr.filename, name: curr.filename }, { path: imagesPath + `thumb-${curr.filename}`, name: `thumb-${curr.filename}` }];
        }, []);
        return res.zip(filenames);
      }
      const filenames = images.reduce((accu, curr) => {
        return [...accu, imagesPath + curr.filename, imagesPath + `thumb-${curr.filename}`];
      }, []);
        res.status(200).json(filenames);
      //   res.setHeader("Content-Disposition", "attachment; filename=jpg");
      //   res.sendFile(imagesPath + "vasko.jpg");
    },
  },
  delete: {
    image: async (req, res, next) => {
      const { name } = req.body;
      const imageExists = await imageModel.findOne({ filename: name });
      if (!imageExists) {
        return res.status(202).json({message: `image ${name} not exists`});
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
