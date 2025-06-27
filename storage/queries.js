const pool = require("./pool.js");

async function getAllAlbums() {
  const { rows } = await pool.query(`
    SELECT
     albums.id, 
     title, 
     release_year, 
     STRING_AGG(DISTINCT artists.name, ', ') AS artists, 
     cover_image_url
     FROM albums
     JOIN album_artists AS aa ON albums.id = aa.album_id
     JOIN artists ON artists.id = aa.artist_id
     GROUP BY albums.id;`);
  return rows;
}

async function getAlbumById(albumId) {
  const { rows } = await pool.query(
    `
      SELECT
     albums.id, 
     title, 
     release_year, 
     STRING_AGG(DISTINCT artists.name, ', ') AS artists, 
     cover_image_url,
     albums.description
     FROM albums
     JOIN album_artists AS aa ON albums.id = aa.album_id
     JOIN artists ON artists.id = aa.artist_id
     WHERE albums.id = $1
     GROUP BY albums.id;
    `,
    [albumId]
  );
  return rows;
}

async function checkForAlbum(title, year) {
  const { rows } = await pool.query(
    `
  SELECT 1 FROM albums
  WHERE title = $1 AND release_year = $2;
  `,
    [title, year]
  );
  return rows;
}

async function getArtistId(name) {
  const { rows } = await pool.query(
    `
    SELECT id FROM artists
    WHERE name = $1;`,
    [name]
  );
  return rows;
}

async function addArtist(name) {
  await pool.query(
    `
    INSERT INTO artists (name)
    VALUES ($1);
    `,
    [name]
  );
  return;
}

async function addAlbum(
  title,
  release_year,
  cover_image_url,
  description,
  artist
) {
  await pool.query(
    `
    INSERT INTO albums (title, release_year, cover_image_url, description)
    VALUES ($1, $2, $3, $4);
    `,
    [title, release_year, cover_image_url, description]
  );
  console.log("Added Album");
  await pool.query(
    `
    INSERT INTO album_artists (album_id, artist_id)
    VALUES (
      (SELECT id FROM albums WHERE title = $1),
      (SELECT id FROM artists WHERE name = $2)
    )
    `,
    [title, artist]
  );
  console.log("Added Album-Artist relation");
  return;
}

module.exports = {
  getAllAlbums,
  getAlbumById,
  checkForAlbum,
  getArtistId,
  addArtist,
  addAlbum,
};

// STATEMENT INCLUDING GENRES

// SELECT
//      albums.id,
//      title,
//      release_year,
//      STRING_AGG(DISTINCT artists.name, ', ') AS artists,
//      STRING_AGG(DISTINCT genres.name, ', ') AS genres,
//      cover_image_url
//      FROM albums
//      JOIN album_artists AS aa ON albums.id = aa.album_id
//      JOIN artists ON artists.id = aa.artist_id
//      JOIN album_genres AS ag ON albums.id = ag.album_id
//      JOIN genres ON genres.id = ag.genre_id
//      GROUP BY albums.id;
