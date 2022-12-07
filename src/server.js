const express = require("express");

const PORT = 8080;

const app = express();

app.use(express.json());

app.get("/", (_, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(PORT, () => {
  console.log(`🖥️ Server listening on port: ${PORT}`);
});
