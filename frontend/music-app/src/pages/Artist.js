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

function Artist() {
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [form, setForm] = useState({
    name: '',
    listeners: '',
    genre: '',
    songs: [],
    albums: []
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [artistsRes, songsRes, albumsRes] = await Promise.all([
      axios.get('http://localhost:3001/artists'),
      axios.get('http://localhost:3001/songs'),
      axios.get('http://localhost:3001/albums')
    ]);
    setArtists(artistsRes.data);
    setSongs(songsRes.data);
    setAlbums(albumsRes.data);
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
      songs: JSON.stringify(form.songs),
      albums: JSON.stringify(form.albums)
    };
    if (editingId) {
      await axios.put(`http://localhost:3001/artists/${editingId}`, payload);
    } else {
      await axios.post('http://localhost:3001/artists', payload);
    }
    setForm({ name: '', listeners: '', genre: '', songs: [], albums: [] });
    setEditingId(null);
    fetchAll();
  };

  const handleEdit = (artist) => {
    setForm({
      name: artist.name,
      listeners: artist.listeners,
      genre: artist.genre,
      songs: safeJsonArray(artist.songs),
      albums: safeJsonArray(artist.albums)
    });
    setEditingId(artist.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/artists/${id}`);
    fetchAll();
  };

  return (
    <div className="form-container">
      <h2>Artist Management</h2>
      <input className="input" name="name" placeholder="Artist Name" value={form.name} onChange={handleChange} />
      <input className="input" name="listeners" placeholder="Monthly Listeners" value={form.listeners} onChange={handleChange} />
      <input className="input" name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} />
      <label>Songs:</label>
      <select className="select" name="songs" multiple value={form.songs} onChange={handleMultiSelect}>
        {songs.map((s) => (
          <option key={s.id} value={s.id}>{s.name} (ID: {s.id})</option>
        ))}
      </select>
      <label>Albums:</label>
      <select className="select" name="albums" multiple value={form.albums} onChange={handleMultiSelect}>
        {albums.map((a) => (
          <option key={a.id} value={a.id}>{a.name} (ID: {a.id})</option>
        ))}
      </select>
      <button className="button" onClick={handleSubmit}>
        {editingId ? 'Update' : 'Create'}
      </button>

      <h3>Artist List</h3>
      {artists.map((a) => (
        <div key={a.id} className="list-item">
          <strong>{a.name}</strong> | {a.genre} | {a.listeners} listeners <br />
          {(() => {
            const songIds = safeJsonArray(a.songs);
            const songNames = Array.isArray(songIds)
              ? songIds.map(id => {
                  const song = songs.find(s => s.id === id);
                  return song ? song.name : `ID:${id}`;
                }).join(', ')
              : '';
            return <>Songs: {songNames} <br /></>;
          })()}
          {(() => {
            const albumIds = safeJsonArray(a.albums);
            const albumNames = Array.isArray(albumIds)
              ? albumIds.map(id => {
                  const album = albums.find(al => al.id === id);
                  return album ? album.name : `ID:${id}`;
                }).join(', ')
              : '';
            return <>Albums: {albumNames} <br /></>;
          })()}
          <button className="button edit" onClick={() => handleEdit(a)}>Edit</button>
          <button className="button delete" onClick={() => handleDelete(a.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Artist;
