const path = require('path');
const { v4: uuidv4 } = require('uuid');
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

    let collection;
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

// POST create a new collection
app.post('/api/collections/', async (req, res) => {
  try {
    const name = req.body.name;
    const id = req.body.id ?? uuidv4();

    const newCollection = {
      id,
      name,
      photos: []
    };

    const file = await fs.readFile(DB_PATH);
    const data = await JSON.parse(file);

    data.collections.push(newCollection);

    await fs.writeFile(DB_PATH, await JSON.stringify(data));

    return res.json(newCollection);
  } catch (e) {
    console.log(`Error writing to database: ${e}`);
    return res.sendStatus(500);
  }
});

// DELETE delete an existing collection
app.delete('/api/collections/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const file = await fs.readFile(DB_PATH);
    const data = await JSON.parse(file);

    let found = false;
    data.collections = data.collections.filter((collection) => {
      if (collection.id === id) {
        found = true;
        return false;
      }

      return true;
    });

    if (!found) {
      return res.sendStatus(404);
    }

    // write back
    await fs.writeFile(DB_PATH, await JSON.stringify(data));
    return res.sendStatus(200);
  } catch (e) {
    console.log(`Error writing to database: ${e}`);
    return res.sendStatus(500);
  }
});

// Images

module.exports = app;
