const fs = require("fs");
const { imagesPath } = require("../config");
const sharp = require("sharp");
const exifr = require("exifr");
const imageModel = require("./imageModel");
const AdmZip = require("adm-zip");

module.exports = {
  post: {
    upload: async (req, res, next) => {
      const info = req.file;
      const { filename, originalname, path, mimetype, size } = info;
      const findImage = await imageModel.findOne({ originalname });

      if (!!findImage) {
        //mutler doesn't allow checking during picter upload, that's why it's put here and delete the already created photo to avoid dubbing
        const deleteImage = await fs.promises.unlink(path);
        // There is no technical reason not to save the file. We may save it and return normal response, but it will depend on the system requirement
        return res.status(400).json({ error: `Image with name ${originalname} already exists` });
      }

      const { latitude, longitude } = await exifr.gps(imagesPath + filename);
      const obj = { filename, originalname, path, mimetype, size, latitude: Number(latitude), longitude: Number(longitude), inputDate: new Date() };

      sharp(imagesPath + filename)
        .resize(256, 256)
        .toFile(imagesPath + "thumb-" + filename)
        .then(() => {
          imageModel.create(obj);
          return res.status(200).json({ info });
        })
        .catch(async (err) => {
          console.error(err);
          await fs.promises.unlink(path);
          return res.status(500).json({ error: "Error during uploading process" });
        });

      // return res.send(JSON.stringify({ error: null, response: info }));
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
      // it is well to make pagenation, but it is not mentioned as requirements in the task 
      const images = await imageModel.find(searchStr()).lean();

      if (images.length === 0) {
        return res.status(404).json({ error: "No images found" });
      }

      if (archive) {
        const zip = new AdmZip();

        images.map((el) => {
          zip.addLocalFile(el.path);
          zip.addLocalFile(imagesPath + "thumb-" + el.filename);
        });

        const zipFileContents = zip.toBuffer();

        res.writeHead(200, {
          "Content-Disposition": `attachment; filename="uploads.zip"`,
          "Content-Type": "application/zip",
        });
        return res.end(zipFileContents);
      }

      const fileNames = images.reduce((accu, curr) => {
        return [...accu, curr.filename,`thumb-${curr.filename}`];
      }, []);

      res.status(200).json({ fileNames });
    },
  },
  delete: {
    image: async (req, res, next) => {
      const { name } = req.body;
      const imageExists = await imageModel.findOne({ filename: name });

      if (!imageExists) {
        return res.status(400).json({ message: `Image ${name} not exists` });
      }

      const deleteImage = fs.promises.unlink(imagesPath + name);
      const deleteThumb = fs.promises.unlink(imagesPath + "thumb-" + name);

      Promise.all([deleteImage, deleteThumb])
        .then(() => {
          return imageModel.deleteOne({ filename: name });
        })
        .then(() => {
          res.status(200).json({ message: `File ${name} is deleted` });
        })
        .catch((err) => {
          res.status(500).json({ error: `Could not delete file ${name}` });
        });
    },
  },
};
