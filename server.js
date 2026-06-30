import express from 'express';
import db from './db.js';
import uploadRouter from './routes/upload.js';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.get('/contacts', (req, res) => {
  const contacts = db.prepare('SELECT * FROM contacts').all();
  res.json(contacts);
});

app.use('/', uploadRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});