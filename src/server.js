const path = require('path');
const fs = require('fs').promises;

const express = require('express');

const app = express();

const DB_PATH = path.join(__dirname, './database.json');

app.use(express.json());

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// API

app.get('/api/health', (_, res) => {
  return res.json({ alive: true });
});

// Collections

// GET all existing collections
app.get('/api/collections', async (_, res) => {
  try {
    const file = await fs.readFile(DB_PATH);
    const data = await JSON.parse(file);
    return res.json(data.collections);
  } catch (e) {
    console.log(`Error reading from database: ${e}`);
    return res.sendStatus(500);
  }
});

// GET single collection by id
app.get('/api/collections/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const file = await fs.readFile(DB_PATH);
    const data = await JSON.parse(file);

    let collection = null;
    data.collections.forEach((c) => {
      if (c.id === id) {
        collection = c;
      }
    });

    if (collection === null) {
      return res.sendStatus(404);
    }

    return res.json(collection);
  } catch (e) {
    console.log(`Error reading from database: ${e}`);
    return res.sendStatus(500);
  }
});

// Images

module.exports = app;
