require("dotenv").config();
const { Client } = require("pg");

const SQL = `

CREATE TABLE albums (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  release_year INTEGER,
  cover_image_url TEXT,
  description TEXT
);

CREATE TABLE artists (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  bio TEXT,
  formed_year INTEGER,
  disband_year INTEGER
);

CREATE TABLE genres (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL
);

CREATE TABLE album_genres (
  album_id INTEGER REFERENCES albums(id),
  genre_id INTEGER REFERENCES genres(id),
  PRIMARY KEY(album_id, genre_id)
);

CREATE TABLE album_artists (
  album_id INTEGER REFERENCES albums(id),
  artist_id INTEGER REFERENCES artists(id),
  PRIMARY KEY(album_id, artist_id)
);


INSERT INTO albums (title, release_year)
VALUES ('Second Stage Turbine Blade', 2002);

INSERT INTO artists (name, formed_year)
VALUES ('Coheed and Cambria', 1995);

INSERT INTO genres (name) VALUES ('Progressive Rock');
INSERT INTO genres (name) VALUES ('Emo');

INSERT INTO album_artists (album_id, artist_id)
VALUES (
  (SELECT id FROM albums WHERE title = 'Second Stage Turbine Blade'),
  (SELECT id FROM artists WHERE name = 'Coheed and Cambria')
);

INSERT INTO album_genres (album_id, genre_id)
VALUES (
  (SELECT id FROM albums WHERE title = 'Second Stage Turbine Blade'),
  (SELECT id FROM genres WHERE name = 'Progressive Rock')
);

INSERT INTO album_genres (album_id, genre_id)
VALUES (
  (SELECT id FROM albums WHERE title = 'Second Stage Turbine Blade'),
  (SELECT id FROM genres WHERE name = 'Emo')
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.CONNECTION_STRING,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
