const db = require('../db');

// creat
exports.createArtist = (req, res) => {
  const { name, listeners, genre, songs, albums } = req.body;
  const sql = 'INSERT INTO artists (name, listeners, genre, songs, albums) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, listeners, genre, JSON.stringify(songs), JSON.stringify(albums)], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Artist created', id: result.insertId });
  });
};

// get
exports.getArtists = (req, res) => {
  db.query('SELECT * FROM artists', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
};

// upload
exports.updateArtist = (req, res) => {
  const id = req.params.id;
  const { name, listeners, genre, songs, albums } = req.body;
  const sql = 'UPDATE artists SET name = ?, listeners = ?, genre = ?, songs = ?, albums = ? WHERE id = ?';
  db.query(sql, [name, listeners, genre, JSON.stringify(songs), JSON.stringify(albums), id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Artist updated' });
  });
};

// delete
exports.deleteArtist = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM artists WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Artist deleted' });
  });
};
