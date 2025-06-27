const db = require("../storage/queries.js");
const asyncHandler = require("express-async-handler");

const getIndex = asyncHandler(async (req, res) => {
  const albums = await db.getAllAlbums();

  if (!album) {
    const err = new Error("Albums not found");
    err.status(400);
    next(err);
  }

  res.render("index", { title: "Album Manager", albums: albums });
});

module.exports = {
  getIndex,
};
