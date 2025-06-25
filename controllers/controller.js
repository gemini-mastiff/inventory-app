async function getIndex(req, res) {
  res.render("index", { title: "Album Manager" });
}

module.exports = {
  getIndex,
};
