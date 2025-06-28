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
  const [album] = await db.getAlbumById(albumId);

  if (!album) {
    throw new CustomError("Album not found", 404);
  }

  res.render("albumDetails", { title: `${album.title} Details`, album: album });
});

const getNewAlbumForm = (req, res) => {
  res.render("newAlbum", {
    title: "New Album",
    currentYear: new Date().getFullYear(),
  });
};

const postNewAlbumForm = asyncHandler(async (req, res) => {
  const data = req.body;
  const [albumExists] = await db.checkForAlbum(data.title, data.release_year);
  if (albumExists) {
    throw new CustomError("Album already exists");
  }

  let [artistId] = await db.getArtistId(data.artist);
  if (!artistId) {
    await db.addArtist(data.artist);
  }
  await db.addAlbum(
    data.title,
    data.release_year,
    data.cover_image_url,
    data.description,
    data.artist
  );
  res.redirect("/");
});

const getAlbumUpdateForm = asyncHandler(async (req, res) => {
  const { albumId } = req.params;
  const [album] = await db.getAlbumById(albumId);
  res.render("updateAlbum", {
    title: "Update Album",
    album: album,
    currentYear: new Date().getFullYear(),
  });
});

module.exports = {
  getIndex,
  getAlbumDetails,
  getNewAlbumForm,
  postNewAlbumForm,
  getAlbumUpdateForm,
};
