const { Router } = require("express");
const imagesController = require("../controllers/images");
const upload = require("../utils/upload");
const ifImageExists = require("../utils/ifImageExists");
const router = Router();
router.post("/upload", upload, imagesController.post.upload);
// router.post('/upload', imagesController.post.upload)

router.delete("/delete/", imagesController.delete.image);
router.post("/search", imagesController.post.search);

module.exports = router;
