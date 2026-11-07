const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// In-memory store (resets when the server restarts)
const messages = [
  { id: 1, name: 'deployinn', text: 'Welcome to the guestbook! Leave a message below.', createdAt: new Date().toISOString() }
];
let nextId = 2;

app.get('/', (req, res) => {
  res.json({ ok: true, service: 'guestbook', endpoints: ['GET /api/messages', 'POST /api/messages'] });
});

app.get('/api/messages', (req, res) => {
  res.json([...messages].reverse());
});

app.post('/api/messages', (req, res) => {
  const name = String((req.body && req.body.name) || '').trim().slice(0, 50);
  const text = String((req.body && req.body.text) || '').trim().slice(0, 500);
  if (!name || !text) {
    return res.status(400).json({ error: 'Both name and message are required.' });
  }
  const msg = { id: nextId++, name, text, createdAt: new Date().toISOString() };
  messages.push(msg);
  if (messages.length > 500) messages.shift();
  res.status(201).json(msg);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Guestbook API listening on ${PORT}`));
