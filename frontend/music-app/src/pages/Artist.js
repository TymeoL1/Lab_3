import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Artist = () => {
  const [artists, setArtists] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    listeners: '',
    genre: '',
    songs: '',
    albums: ''
  });
  const [selectedId, setSelectedId] = useState(null);

  const fetchArtists = () => {
    axios.get('http://localhost:3001/artists')
      .then(res => setArtists(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleCreate = () => {
    const data = {
      ...formData,
      listeners: parseInt(formData.listeners),
      songs: formData.songs.split(',').map(id => parseInt(id.trim())),
      albums: formData.albums.split(',').map(id => parseInt(id.trim()))
    };

    axios.post('http://localhost:3001/artists', data)
      .then(() => {
        fetchArtists();
        setFormData({ name: '', listeners: '', genre: '', songs: '', albums: '' });
      })
      .catch(err => console.error(err));
  };

  const handleUpdate = () => {
    if (!selectedId) return;
    const data = {
      ...formData,
      listeners: parseInt(formData.listeners),
      songs: formData.songs.split(',').map(id => parseInt(id.trim())),
      albums: formData.albums.split(',').map(id => parseInt(id.trim()))
    };
    axios.put(`http://localhost:3001/artists/${selectedId}`, data)
      .then(() => {
        fetchArtists();
        setSelectedId(null);
        setFormData({ name: '', listeners: '', genre: '', songs: '', albums: '' });
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/artists/${id}`)
      .then(() => fetchArtists())
      .catch(err => console.error(err));
  };

  const handleSelect = (artist) => {
    setSelectedId(artist.id);
    setFormData({
      name: artist.name,
      listeners: artist.listeners,
      genre: artist.genre,
      songs: JSON.parse(artist.songs).join(','),
      albums: JSON.parse(artist.albums).join(',')
    });
  };

  return (
    <div className="container">
      <h2>Artist Management</h2>
      <input placeholder="Artist Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
      <input placeholder="Monthly listeners" value={formData.listeners} onChange={e => setFormData({ ...formData, listeners: e.target.value })} />
      <input placeholder="Style" value={formData.genre} onChange={e => setFormData({ ...formData, genre: e.target.value })} />
      <input placeholder="List of song IDs" value={formData.songs} onChange={e => setFormData({ ...formData, songs: e.target.value })} />
      <input placeholder="Album ID List" value={formData.albums} onChange={e => setFormData({ ...formData, albums: e.target.value })} />
      <button onClick={selectedId ? handleUpdate : handleCreate}>{selectedId ? 'Update' : 'Creat'}</button>

      <h3>Artist List</h3>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            <b>{artist.name}</b> | listeners：{artist.listeners} | Style：{artist.genre}
            <br />
            Music ID: {artist.songs} <br />
            Album ID: {artist.albums} <br />
            <button onClick={() => handleSelect(artist)}>Edit</button>
            <button onClick={() => handleDelete(artist.id)}>Delete</button>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Artist;
