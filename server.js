const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const xmlparser = require("express-xml-bodyparser");
const { errorHandler } = require("./server.helpers");
const {
  createAlbumsTable,
  albumsQueryBuilder,
  getAllAlbums,
  getAllAlbumsByName
} = require("./sql");

const db = new sqlite3.Database(":memory:");
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xmlparser());

app.get('/', (req, res) => {
  const index = path.resolve(__dirname, "public", "./index.html");
  res.sendFile(index);
});

app.get('/albums', (req, res) => {
  db.serialize(function() {
    db.all(`${getAllAlbums}`, function(err, rows) {
      if (err) console.error(err);
      res.json(rows);
    });
  });
});

app.get('/albums/:title', (req, res) => {
  const title = req.params.title;
  const query = getAllAlbumsByName(title);
  db.serialize(function() {
    db.all(`${query}`, function(err, rows) {
      if (err) console.error(err);
      res.json(rows);
    });
  });
});

app.post('/', (req, res) => {
  const albums = req.body.albums.album;
  new Promise((resolve, reject) => {
    try {
      db.serialize(function() {
        albums.forEach(a => {
          a.grammy = parseInt(a.awards[0].grammy);
          const query = albumsQueryBuilder(a);
          db.run(`${query}`);
        });
      });
    } catch (err) {
      reject(err);
    }
    finally {
      resolve();
    }
  })
  .then(() => res.send(`successfully added to db`))
  .catch(err => errorHandler({ err, res }));
});

app.listen(port, () => {
  db.serialize(() => {
    db.run(`${createAlbumsTable}`);
    console.log("May the force be with you!");
  });
});
