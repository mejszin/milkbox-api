const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const PORT = 82;

app.locals.users_path = './data/users.json';
app.locals.albums_path = './data/albums.json';
app.locals.uncategorized_path = './data/uncategorized.csv';

app.locals.user_data = JSON.parse(fs.readFileSync(app.locals.users_path));
app.locals.album_data = JSON.parse(fs.readFileSync(app.locals.albums_path));

app.locals.strToKey = function(str) {
    return str
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
        .split(' ')
        .join('_');
}

app.locals.writeUncategorizedData = function(data) {
    var date = new Date().toISOString();
    const line = `${date},${data.join(",")}\n`;
    fs.appendFileSync(app.locals.uncategorized_path, line);
    console.log(line);
}

app.get('/ping', (req, res) => {
    res.status(200).send('Pong!');
});

require('../routes/application_id.js')(app);
require('../routes/artist.js')(app);
require('../routes/album.js')(app);
require('../routes/player.js')(app);

app.listen(PORT, () => console.log(`It's alive on port ${PORT}!`));