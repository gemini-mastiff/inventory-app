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
  const [albumExists] = await db.getAlbumByNameAndYear(
    data.title,
    data.release_year
  );
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

const postAlbumUpdateForm = asyncHandler(async (req, res) => {
  const { albumId } = req.params;
  const data = req.body;
  if (data.password !== process.env.PASSWORD) {
    throw new CustomError(
      "User does not have permission to update this item",
      403
    );
  }
  const [existingAlbum] = await db.getAlbumByNameAndYear(
    data.title,
    data.release_year
  );
  // the id check is to allow user to update the album,
  // but not turn it into an already existing album.
  if (existingAlbum && existingAlbum.id !== Number(albumId)) {
    throw new CustomError("Album already exists");
  }

  let [artistId] = await db.getArtistId(data.artist);
  if (!artistId) {
    await db.addArtist(data.artist);
  }

  const albumData = {
    id: Number(albumId),
    title: data.title,
    release_year: data.release_year,
    cover_image_url: data.cover_image_url,
    description: data.description,
    artist: data.artist,
  };
  await db.updateAlbum(albumData);
  res.redirect(`/albums/${albumId}`);
});

const getAlbumDelete = asyncHandler(async (req, res) => {
  const { albumId } = req.params;
  const [album] = await db.getAlbumById(albumId);
  res.render("delAlbum", { title: "Delete Album", album: album });
});

const postAlbumDelete = asyncHandler(async (req, res) => {
  const { albumId } = req.params;
  const { password } = req.body;
  if (password !== process.env.PASSWORD) {
    throw new CustomError(
      "User does not have permission to delete this item",
      403
    );
  }
  const [album] = await db.getAlbumById(albumId);
  const [artist] = await db.getArtistId(album.artists);
  console.log(albumId);
  console.log(artist.id);
  await db.delAlbum(Number(albumId), artist.id);
  res.redirect("/");
});

module.exports = {
  getIndex,
  getAlbumDetails,
  getNewAlbumForm,
  postNewAlbumForm,
  getAlbumUpdateForm,
  postAlbumUpdateForm,
  getAlbumDelete,
  postAlbumDelete,
};
