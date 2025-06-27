const pool = require("./pool.js");

async function getAllAlbums() {
  const { rows } = await pool.query(`
    SELECT
     albums.id, 
     title, 
     release_year, 
     STRING_AGG(DISTINCT artists.name, ', ') AS artists, 
     STRING_AGG(DISTINCT genres.name, ', ') AS genres,
     cover_image_url
     FROM albums
     JOIN album_artists AS aa ON albums.id = aa.album_id
     JOIN artists ON artists.id = aa.artist_id
     JOIN album_genres AS ag ON albums.id = ag.album_id
     JOIN genres ON genres.id = ag.genre_id
     GROUP BY albums.id;`);
  return rows;
}

async function getAlbum(albumId) {
  const { rows } = await pool.query(
    `
      SELECT
     albums.id, 
     title, 
     release_year, 
     STRING_AGG(DISTINCT artists.name, ', ') AS artists, 
     STRING_AGG(DISTINCT genres.name, ', ') AS genres,
     cover_image_url
     FROM albums
     JOIN album_artists AS aa ON albums.id = aa.album_id
     JOIN artists ON artists.id = aa.artist_id
     JOIN album_genres AS ag ON albums.id = ag.album_id
     JOIN genres ON genres.id = ag.genre_id
     WHERE albums.id = $1
     GROUP BY albums.id;
    `,
    [albumId]
  );
  return rows;
}

module.exports = {
  getAllAlbums,
  getAlbum,
};
