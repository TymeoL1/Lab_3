import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    release_year: '',
    album_id: ''
  });
  const [selectedId, setSelectedId] = useState(null);

  const fetchSongs = () => {
    axios.get('http://localhost:3001/songs')
      .then(res => setSongs(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleCreate = () => {
    axios.post('http://localhost:3001/songs', {
      name: formData.name,
      release_year: parseInt(formData.release_year),
      album_id: parseInt(formData.album_id)
    }).then(() => {
      fetchSongs();
      setFormData({ name: '', release_year: '', album_id: '' });
    }).catch(err => console.error(err));
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:3001/songs/${selectedId}`, {
      name: formData.name,
      release_year: parseInt(formData.release_year),
      album_id: parseInt(formData.album_id)
    }).then(() => {
      fetchSongs();
      setFormData({ name: '', release_year: '', album_id: '' });
      setSelectedId(null);
    }).catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/songs/${id}`)
      .then(() => fetchSongs())
      .catch(err => console.error(err));
  };

  const handleSelect = (song) => {
    setSelectedId(song.id);
    setFormData({
      name: song.name,
      release_year: song.release_year,
      album_id: song.album_id
    });
  };

  return (
    <div className="container">
      <h2>Song Management</h2>
      <input placeholder="Song" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
      <input placeholder="Year of release" value={formData.release_year} onChange={e => setFormData({ ...formData, release_year: e.target.value })} />
      <input placeholder="Album ID" value={formData.album_id} onChange={e => setFormData({ ...formData, album_id: e.target.value })} />
      <button onClick={selectedId ? handleUpdate : handleCreate}>{selectedId ? 'Upload' : 'Creat'}</button>

      <h3>Music List</h3>
      <ul>
        {songs.map(song => (
          <li key={song.id}>
            <b>{song.name}</b> | {song.release_year} | Albums ID: {song.album_id}
            <br />
            <button onClick={() => handleSelect(song)}>Edit</button>
            <button onClick={() => handleDelete(song.id)}>Delete</button>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Songs;
