const db = require("../storage/queries.js");
const asyncHandler = require("express-async-handler");
const CustomError = require("../util/CustomError.js");

const getIndex = asyncHandler(async (req, res) => {
  const albums = await db.getAllAlbums();

  if (!albums) {
    throw new CustomError("Albums not found", 404);
  }

  res.render("index", { title: "Album Manager", albums: albums });
});

const getAlbumDetails = asyncHandler(async (req, res) => {
  const { albumId } = req.params;
  const [album] = await db.getAlbum(albumId);
  res.render("albumDetails", { title: `${album.title} Details`, album: album });
});

const getNewAlbumForm = (req, res) => {
  res.render("newAlbum", { title: "New Album" });
};

const postNewAlbumForm = asyncHandler(async (req, res) => {
  const data = req.body;
  res.send(data);
});

module.exports = {
  getIndex,
  getAlbumDetails,
  getNewAlbumForm,
  postNewAlbumForm,
};
