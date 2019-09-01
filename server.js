const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const xmlparser = require("express-xml-bodyparser");
const { errorHandler } = require("./server.helpers");
const {
  createHostsTable,
  createPortsTable,
  hostsQueryBuilder,
  createTasksTable,
  portsQueryBuilder,
  tasksQueryBuilder,
  getAllDocs,
  getAllDocsByIp
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

app.get("/files", (req, res) => {
  db.serialize(function() {
    db.all(`${getAllDocs}`, function(err, rows) {
      if (err) console.error(err);
      res.json(rows);
    });
  });
});

app.get("/files/:ip", (req, res) => {
  const ip = req.params.ip;
  const query = getAllDocsByIp(ip);
  db.serialize(function() {
    db.all(`${query}`, function(err, rows) {
      if (err) console.error(err);
      res.json(rows);
    });
  });
});

app.post("/", (req, res) => {
  const name = req.params.name;
  const nmaprun = req.body.nmaprun;
  const host = nmaprun.host;
  const scaninfo = nmaprun.scaninfo[0].$;
  const runstats = nmaprun.runstats[0].finished[0].$;

  try {
    db.serialize(function() {
      host.forEach(h_ => {
        const query = hostsQueryBuilder(h_, nmaprun, scaninfo, runstats, name);

        db.run(`${query}`, errorHandler);

        h_.ports[0].port.forEach(p => {
          const query = portsQueryBuilder(p, h_);
          db.run(`${query}`, errorHandler);
        });

        nmaprun.taskbegin.forEach((t, i) => {
          const query = tasksQueryBuilder(t, i, nmaprun);
          db.run(`${query}`, errorHandler);
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
    db.run(`${createHostsTable}`);
    db.run(`${createPortsTable}`);
    db.run(`${createTasksTable}`);
    console.log("May the force be with you!");
  });
});
