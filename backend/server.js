const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const artistRoutes = require('./routes/artistRoutes');
const songRoutes = require('./routes/songRoutes');
const albumRoutes = require('./routes/albumRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/artists', artistRoutes);
app.use('/songs', songRoutes);
app.use('/albums', albumRoutes);

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
