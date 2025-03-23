import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function Songs() {
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [form, setForm] = useState({
    name: '',
    release_year: '',
    album_id: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [songsRes, albumsRes] = await Promise.all([
      axios.get('http://localhost:3001/songs'),
      axios.get('http://localhost:3001/albums')
    ]);
    setSongs(songsRes.data);
    setAlbums(albumsRes.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.album_id) {
      alert("Please select an album");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:3001/songs/${editingId}`, form);
      } else {
        await axios.post('http://localhost:3001/songs', form);
      }
      setForm({ name: '', release_year: '', album_id: '' });
      setEditingId(null);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please check your data.");
    }
  };

  const handleEdit = (song) => {
    setForm({
      name: song.name,
      release_year: song.release_year,
      album_id: song.album_id
    });
    setEditingId(song.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/songs/${id}`);
    fetchAll();
  };

  return (
    <div className="form-container">
      <h2>Song Management</h2>
      <input
        className="input"
        name="name"
        placeholder="Song Name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        className="input"
        name="release_year"
        placeholder="Release Year"
        value={form.release_year}
        onChange={handleChange}
      />
      <select
        className="select"
        name="album_id"
        value={form.album_id}
        onChange={handleChange}
      >
        <option value="">Select Album</option>
        {albums.map((album) => (
          <option key={album.id} value={album.id}>
            {album.name} (ID: {album.id})
          </option>
        ))}
      </select>
      <button className="button" onClick={handleSubmit}>
        {editingId ? 'Update' : 'Create'}
      </button>

      <h3>Song List</h3>
      {songs.map((song) => (
        <div key={song.id} className="list-item">
          <strong>{song.name}</strong> ({song.release_year}) | Album ID: {song.album_id}
          <div>
            <button className="button edit" onClick={() => handleEdit(song)}>Edit</button>
            <button className="button delete" onClick={() => handleDelete(song.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Songs;
