const db = require("../storage/queries.js");

async function getIndex(req, res) {
  const albums = await db.getAllAlbums();
  res.render("index", { title: "Album Manager", albums: albums });
}

module.exports = {
  getIndex,
};
