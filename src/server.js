const path = require('path');
const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

module.exports = app;
