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

async function getAlbumByNameAndYear(title, year) {
  const { rows } = await pool.query(
    `
  SELECT * FROM albums
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

async function updateAlbum(data) {
  await pool.query(
    `
    UPDATE albums
    SET title = $1,
        release_year = $2,
        description = $3
    WHERE id = $4;
    `,
    [data.title, data.release_year, data.description, data.id]
  );
  if (data.cover_image_url) {
    await pool.query(
      `
      UPDATE albums
    SET cover_image_url = $1
    WHERE id = $2;
      `,
      [data.cover_image_url, data.id]
    );
  }
  await pool.query(
    `
    UPDATE album_artists
    SET artist_id = (SELECT id FROM artists WHERE name = $1)
    WHERE album_id = $2;
    `,
    [data.artist, data.id]
  );
}

module.exports = {
  getAllAlbums,
  getAlbumById,
  getAlbumByNameAndYear,
  getArtistId,
  addArtist,
  addAlbum,
  updateAlbum,
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
