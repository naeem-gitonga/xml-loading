exports.createAlbumsTable = `CREATE TABLE albums (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                  title TEXT,
                                                  artist TEXT,
                                                  year INT);`;

exports.albumsQueryBuilder = album => {
  const { title, artist, year } = album;

  const query = `INSERT INTO albums VALUES ('${title}',
                                          '${artist}',
                                          ${parseInt(year)});`;
  return query;
};

exports.createAwardsTable = `CREATE TABLE awards (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                grammy INT)`;

/** 
 * ! to extend this we would need to loop
 * ! over the awards object to get the object keys,
 * ! maybe have a stored list of generic (well know) awards,
 * ! compare those two, and for any extraneous awards,
 * ! run the following query
 * ! ALTER TABLE awards ADD new-column-name INT,
 * ! and lastly INSERT them into the awards table
 */                                               
exports.awardsQueryBuilder = awards => {
  const { grammy } = awards;
  const query = `INSERT INTO awards (grammy) VALUES (${parseInt(grammy)})`;
  return query;
};

exports.getAllAlbums = `SELECT * FROM albums 
                      LEFT OUTER JOIN awards 
                      ON albums.id=awards.id`;

exports.getAllAlbumsByName = title => `SELECT * FROM albums
                                LEFT OUTER JOIN awards 
                                ON albums.id=awards.id
                                WHERE albums.title='${title}'`;
