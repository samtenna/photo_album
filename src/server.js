const path = require('path');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs').promises;

const app = express();

const DB_PATH = path.join(__dirname, './database.json');

app.use(express.json());
app.use(fileUpload());

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.use('/static', express.static(path.join(__dirname, '/static')));

// API

app.get('/api/health', (_, res) => {
  return res.json({ alive: true });
});

// Collections

// GET all existing collections
app.get('/api/collections', async (_, res) => {
  try {
    const file = await fs.readFile(DB_PATH);
    const data = JSON.parse(file);
    return res.json(data.collections);
  } catch (e) {
    console.log(`Error reading from database: ${e}`);
    return res.sendStatus(400);
  }
});

// GET single collection by id
app.get('/api/collections/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const file = await fs.readFile(DB_PATH);
    const data = JSON.parse(file);

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
    return res.sendStatus(400);
  }
});

// POST create a new collection
app.post('/api/collections/', async (req, res) => {
  try {
    const name = req.body.name;
    const id = req.body.id ?? uuidv4();

    const newCollection = {
      id,
      name
    };

    const file = await fs.readFile(DB_PATH);
    const data = JSON.parse(file);

    data.collections.push(newCollection);

    await fs.writeFile(DB_PATH, await JSON.stringify(data));

    return res.json(newCollection);
  } catch (e) {
    console.log(`Error writing to database: ${e}`);
    return res.sendStatus(400);
  }
});

// PUT update an existing collection
app.put('/api/collections/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const newName = req.body.name;

    const file = await fs.readFile(DB_PATH);
    const data = JSON.parse(file);

    let collection;
    data.collections.forEach((c) => {
      if (c.id === id) {
        collection = c;
        c.name = newName;
      }
    });

    if (collection === undefined) {
      return res.sendStatus(404);
    }

    await fs.writeFile(DB_PATH, JSON.stringify(data));
    return res.json(collection);
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
    const data = JSON.parse(file);

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

    // delete photos belonging to the collection
    data.photos = data.photos.filter((photo) => photo.collectionId !== id);

    // write back
    await fs.writeFile(DB_PATH, await JSON.stringify(data));
    return res.sendStatus(200);
  } catch (e) {
    console.log(`Error writing to database: ${e}`);
    return res.sendStatus(400);
  }
});

// Images

// POST upload an image for a photo
app.post('/api/photos/:id/upload', async (req, res) => {
  try {
    const photoId = req.params.id;
    const { image } = req.files;

    // if no image submitted, return
    if (!image) {
      return res.sendStatus(400);
    }

    // move image to static folder
    image.mv(path.join(__dirname, `/static/images/${photoId}.jpg`));
    return res.sendStatus(200);
  } catch (e) {
    console.log(`Error uploading file: ${e}`);
    return res.sendStatus(400);
  }
});

// POST create a new photo
app.post('/api/collections/:collectionId/photos', async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    const description = req.body.description;
    const photoId = req.body.id ?? uuidv4();

    const file = await fs.readFile(DB_PATH);
    const data = JSON.parse(file);

    const newPhoto = {
      id: photoId,
      collectionId,
      description
    };

    data.photos.push(newPhoto);

    await fs.writeFile(DB_PATH, await JSON.stringify(data));

    return res.json(newPhoto);
  } catch (e) {
    console.log(`Error writing to database: ${e}`);
    return res.sendStatus(400);
  }
});

// GET fetch photos of a collection
app.get('/api/collections/:collectionId/photos', async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    const file = await fs.readFile(DB_PATH);
    const data = JSON.parse(file);

    data.photos = data.photos.filter((photo) => photo.collectionId === collectionId);

    return res.json(data.photos);
  } catch (e) {
    console.log(`Error reading from database: ${e}`);
    return res.sendStatus(400);
  }
});

// GET fetch single photo
app.get('/api/photos/:photoId', async (req, res) => {
  try {
    const photoId = req.params.photoId;
    const file = await fs.readFile(DB_PATH);
    const data = JSON.parse(file);

    let photo;
    data.photos.forEach((p) => {
      if (p.id === photoId) {
        photo = p;
      }
    });

    if (photo === undefined) {
      return res.sendStatus(404);
    }

    return res.json(photo);
  } catch (e) {
    console.log(`Error reading from database: ${e}`);
    return res.sendStatus(400);
  }
});

// PUT update a photo
app.put('/api/photos/:photoId', async (req, res) => {
  try {
    const photoId = req.params.photoId;
    const newDescription = req.body.description;
    const newCollectionId = req.body.collectionId;

    const file = await fs.readFile(DB_PATH);
    const data = JSON.parse(file);

    let photo;
    data.photos.forEach((p) => {
      if (p.id === photoId) {
        photo = p;
        p.description = newDescription ?? p.description;
        p.collectionId = newCollectionId ?? p.collectionId;
      }
    });

    if (photo === undefined) {
      return res.sendStatus(404);
    }

    await fs.writeFile(DB_PATH, JSON.stringify(data));
    return res.json(photo);
  } catch (e) {
    console.log(`Error writing to database: ${e}`);
    return res.sendStatus(400);
  }
});

// DELETE delete a photo
app.delete('/api/photos/:photoId', async (req, res) => {
  try {
    const photoId = req.params.photoId;

    const file = await fs.readFile(DB_PATH);
    const data = JSON.parse(file);

    let found = false;
    data.photos.filter((p) => {
      if (p.id === photoId) {
        found = true;
        return false;
      }

      return true;
    });

    if (!found) {
      return res.sendStatus(404);
    }

    await fs.writeFile(DB_PATH, JSON.stringify(data));
    return res.sendStatus(200);
  } catch (e) {
    console.log(`Error writing to database: ${e}`);
    return res.sendStatus(400);
  }
});

module.exports = app;
