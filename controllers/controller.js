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

module.exports = {
  getIndex,
};
