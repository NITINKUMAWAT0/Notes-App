const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const notesRoutes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/notes', notesRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
