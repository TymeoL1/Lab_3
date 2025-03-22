const db = require('../db');

// create
exports.createAlbum = (req, res) => {
  const { name, artist_id, release_year, listens, songs } = req.body;
  const sql = 'INSERT INTO albums (name, artist_id, release_year, listens, songs) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, artist_id, release_year, listens, JSON.stringify(songs)], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Album created', id: result.insertId });
  });
};

// get
exports.getAlbums = (req, res) => {
  db.query('SELECT * FROM albums', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
};

// upload
exports.updateAlbum = (req, res) => {
  const id = req.params.id;
  const { name, artist_id, release_year, listens, songs } = req.body;
  const sql = 'UPDATE albums SET name = ?, artist_id = ?, release_year = ?, listens = ?, songs = ? WHERE id = ?';
  db.query(sql, [name, artist_id, release_year, listens, JSON.stringify(songs), id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Album updated' });
  });
};

// delete
exports.deleteAlbum = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM albums WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Album deleted' });
  });
};
