require("dotenv").config();
const express = require("express");
const path = require("path");
const router = require("./routers/router.js");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", router);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.log(err);
  res.status(statusCode).json({ statusCode, message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (req, res) => console.log(`App listening on port ${PORT}`));
