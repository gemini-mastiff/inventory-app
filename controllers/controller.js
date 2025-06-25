const db = require("../storage/queries.js");

async function getIndex(req, res) {
  const albums = await db.getAllAlbums();
  console.log(albums);
  res.render("index", { title: "Album Manager" });
}

module.exports = {
  getIndex,
};
