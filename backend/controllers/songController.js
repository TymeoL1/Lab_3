const db = require('../db');

// create
exports.createSong = (req, res) => {
  const { name, release_year, album_id } = req.body;
  const sql = 'INSERT INTO songs (name, release_year, album_id) VALUES (?, ?, ?)';
  db.query(sql, [name, release_year, album_id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Song created', id: result.insertId });
  });
};

// get
exports.getSongs = (req, res) => {
  db.query('SELECT * FROM songs', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
};

// upload
exports.updateSong = (req, res) => {
  const id = req.params.id;
  const { name, release_year, album_id } = req.body;
  const sql = 'UPDATE songs SET name = ?, release_year = ?, album_id = ? WHERE id = ?';
  db.query(sql, [name, release_year, album_id, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Song updated' });
  });
};

// delete
exports.deleteSong = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM songs WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Song deleted' });
  });
};
