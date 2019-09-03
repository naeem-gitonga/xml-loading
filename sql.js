exports.createAlbumsTable = `CREATE TABLE albums (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                  title TEXT,
                                                  artist TEXT,
                                                  year INT,
                                                  grammy INT);`;

exports.albumsQueryBuilder = album => {
  const { title, artist, year, grammy } = album;
  const query = `INSERT INTO albums (title,
                                     artist,
                                     year,
                                     grammy) 
                             VALUES ('${title}',
                                     '${artist}',
                                     ${parseInt(year)},
                                     ${grammy});`;
  return query;
};

exports.createAwardsTable = `CREATE TABLE awards (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                grammy INT)`;
/** 
 * ! to extend this we might would loop
 * ! over the awards object to get the object keys,
 * ! maybe have a stored list of generic (well known) awards,
 * ! compare those two list, and for any extraneous awards,
 * ! run the following query
 * ! ALTER TABLE awards ADD new-column-name INT,
 * ! and lastly INSERT them into the awards table
 */                                               
exports.awardsQueryBuilder = awards => {
  const { grammy } = awards;
  const query = `INSERT INTO awards (grammy) VALUES (${parseInt(grammy)})`;
  return query;
};

exports.getAllAlbums = `SELECT * FROM albums`;

exports.getAllAlbumsByName = title => `SELECT * FROM albums WHERE title LIKE '${title}'`;
