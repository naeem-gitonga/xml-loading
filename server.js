const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const xmlparser = require("express-xml-bodyparser");
const { errorHandler } = require("./server.helpers");
const {
  createAlbumsTable,
  createAwardsTable,
  albumsQueryBuilder,
  awardsQueryBuilder,
  getAllAlbums,
  getAllDocsByName
} = require("./sql");

const db = new sqlite3.Database(":memory:");
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xmlparser());

app.get("/", (req, res) => {
  const index = path.resolve(__dirname, "public", "./index.html");
  res.sendFile(index);
});

app.get("/albums", (req, res) => {
  db.serialize(function() {
    db.all(`${getAllAlbums}`, function(err, rows) {
      if (err) console.error(err);
      res.json(rows);
    });
  });
});

app.get("/albums/:ip", (req, res) => {
  const ip = req.params.ip;
  const query = getAllAlbumsByName(ip);
  db.serialize(function() {
    db.all(`${query}`, function(err, rows) {
      if (err) console.error(err);
      res.json(rows);
    });
  });
});

app.post("/", (req, res) => {
  const albums = req.body.albums.album;
  try {
    db.serialize(function() {
      albums.forEach(album => {
        const { awards } = album;
        const query = albumsQueryBuilder(album);

        db.run(`${query}`, err => errorHandler({ err, res }));
        db.

        awards.forEach(award => {
          const query = awardsQueryBuilder(award);
          db.run(`${query}`, err => errorHandler({ err, res }));
        });
      });
    });
  } catch (err) {
    console.error(err);
  }
  res.send(`successfully added to db`);
});

app.listen(port, () => {
  db.serialize(() => {
    db.run(`${createAlbumsTable}`);
    db.run(`${createAwardsTable}`);
    console.log("May the force be with you!");
  });
});
