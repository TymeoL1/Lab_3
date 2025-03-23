import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const safeJsonArray = (val) => {
  try {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch {
    return [];
  }
};

function Albums() {
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [form, setForm] = useState({
    name: '',
    artist_id: '',
    release_year: '',
    listens: '',
    songs: []
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [albumsRes, songsRes, artistsRes] = await Promise.all([
      axios.get('http://localhost:3001/albums'),
      axios.get('http://localhost:3001/songs'),
      axios.get('http://localhost:3001/artists')
    ]);
    setAlbums(albumsRes.data);
    setSongs(songsRes.data);
    setArtists(artistsRes.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (e) => {
    const { name, selectedOptions } = e.target;
    const selected = Array.from(selectedOptions, (opt) => parseInt(opt.value));
    setForm((prev) => ({ ...prev, [name]: selected }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      songs: JSON.stringify(form.songs)
    };
    if (editingId) {
      await axios.put(`http://localhost:3001/albums/${editingId}`, payload);
    } else {
      await axios.post('http://localhost:3001/albums', payload);
    }
    setForm({ name: '', artist_id: '', release_year: '', listens: '', songs: [] });
    setEditingId(null);
    fetchAll();
  };

  const handleEdit = (album) => {
    setForm({
      name: album.name,
      artist_id: album.artist_id,
      release_year: album.release_year,
      listens: album.listens,
      songs: safeJsonArray(album.songs)
    });
    setEditingId(album.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/albums/${id}`);
    fetchAll();
  };

  return (
    <div className="form-container">
      <h2>Album Management</h2>
      <input className="input" name="name" placeholder="Album Name" value={form.name} onChange={handleChange} />
      <select className="select" name="artist_id" value={form.artist_id} onChange={handleChange}>
        <option value="">Select Artist</option>
        {artists.map((a) => (
          <option key={a.id} value={a.id}>{a.name} (ID: {a.id})</option>
        ))}
      </select>
      <input className="input" name="release_year" placeholder="Release Year" value={form.release_year} onChange={handleChange} />
      <input className="input" name="listens" placeholder="Listens" value={form.listens} onChange={handleChange} />
      <label>Songs:</label>
      <select className="select" name="songs" multiple value={form.songs} onChange={handleMultiSelect}>
        {songs.map((s) => (
          <option key={s.id} value={s.id}>{s.name} (ID: {s.id})</option>
        ))}
      </select>
      <button className="button" onClick={handleSubmit}>
        {editingId ? 'Update' : 'Create'}
      </button>

      <h3>Album List</h3>
      {albums.map((a) => (
        <div key={a.id} className="list-item">
          <strong>{a.name}</strong> | Artist ID: {a.artist_id} <br />
          Songs: {safeJsonArray(a.songs).join(', ')}
          <div>
            <button className="button edit" onClick={() => handleEdit(a)}>Edit</button>
            <button className="button delete" onClick={() => handleDelete(a.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Albums;
