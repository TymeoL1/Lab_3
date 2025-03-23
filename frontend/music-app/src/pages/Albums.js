import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    artist_id: '',
    release_year: '',
    listens: '',
    songs: ''
  });
  const [selectedId, setSelectedId] = useState(null);

  const fetchAlbums = () => {
    axios.get('http://localhost:3001/albums')
      .then(res => setAlbums(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleCreate = () => {
    const data = {
      ...formData,
      artist_id: parseInt(formData.artist_id),
      release_year: parseInt(formData.release_year),
      listens: parseInt(formData.listens),
      songs: formData.songs.split(',').map(id => parseInt(id.trim()))
    };

    axios.post('http://localhost:3001/albums', data)
      .then(() => {
        fetchAlbums();
        setFormData({ name: '', artist_id: '', release_year: '', listens: '', songs: '' });
      })
      .catch(err => console.error(err));
  };

  const handleUpdate = () => {
    const data = {
      ...formData,
      artist_id: parseInt(formData.artist_id),
      release_year: parseInt(formData.release_year),
      listens: parseInt(formData.listens),
      songs: formData.songs.split(',').map(id => parseInt(id.trim()))
    };

    axios.put(`http://localhost:3001/albums/${selectedId}`, data)
      .then(() => {
        fetchAlbums();
        setFormData({ name: '', artist_id: '', release_year: '', listens: '', songs: '' });
        setSelectedId(null);
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/albums/${id}`)
      .then(() => fetchAlbums())
      .catch(err => console.error(err));
  };

  const handleSelect = (album) => {
    setSelectedId(album.id);
    setFormData({
      name: album.name,
      artist_id: album.artist_id,
      release_year: album.release_year,
      listens: album.listens,
      songs: JSON.parse(album.songs).join(',')
    });
  };

  return (
    <div className="container">
      <h2>Album Management</h2>
      <input placeholder="Album Title" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
      <input placeholder="Artist ID" value={formData.artist_id} onChange={e => setFormData({ ...formData, artist_id: e.target.value })} />
      <input placeholder="Year of release" value={formData.release_year} onChange={e => setFormData({ ...formData, release_year: e.target.value })} />
      <input placeholder="Number of plays" value={formData.listens} onChange={e => setFormData({ ...formData, listens: e.target.value })} />
      <input placeholder="Song ID List" value={formData.songs} onChange={e => setFormData({ ...formData, songs: e.target.value })} />
      <button onClick={selectedId ? handleUpdate : handleCreate}>{selectedId ? 'Upload' : 'Creat'}</button>

      <h3>Album List</h3>
      <ul>
        {albums.map(album => (
          <li key={album.id}>
            <b>{album.name}</b> | Year：{album.release_year} | listeners：{album.listens}
            <br />
            Artist ID: {album.artist_id} <br />
            Song ID List: {album.songs}
            <br />
            <button onClick={() => handleSelect(album)}>Edit</button>
            <button onClick={() => handleDelete(album.id)}>Delete</button>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Albums;
