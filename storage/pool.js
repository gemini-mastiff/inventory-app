const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const ssl =
  isProduction && process.env.CA_CERT
    ? {
        rejectUnauthorized: true,
        ca: process.env.CA_CERT,
      }
    : false;

module.exports = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl,
});
