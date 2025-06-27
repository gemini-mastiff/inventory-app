const express = require("express");
const controller = require("../controllers/controller.js");
const router = express.Router();

router.get("/", controller.getIndex);
router.get("/albums/new", controller.getNewAlbumForm);
router.get("/albums/:albumId", controller.getAlbumDetails);

module.exports = router;
