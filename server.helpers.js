const formidable = require("formidable");

exports.writeFile = (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) res.status(500).send(err);
  });

  form.on("fileBegin", function(name, file) {
    file.path = __dirname + "/" + `xml-${file.name}`;
  });

  form.on("file", function(name, file) {
    res.send(`xml-${file.name}`);
  });
};

exports.errorHandler = ({ err, res }) => {
  console.log(err.message);
  res.send(err);
  return;
};
