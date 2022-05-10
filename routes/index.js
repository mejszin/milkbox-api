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

function strToKey(str) {
    return str
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
        .split(' ')
        .join('_');
}

function writeUncategorizedData(data) {
    var date = new Date().toISOString();
    const line = `${date},${data.join(",")}\n`;
    fs.appendFileSync(app.locals.uncategorized_path, line);
    console.log(line);
}

var application_id = require('../routes/application_id.js')(app);
var album =  require('../routes/album.js')(app);
var artist =  require('../routes/artist.js')(app);
var player = require('../routes/player.js')(app);

app.get('/ping', (req, res) => {
    res.status(200).send('Pong!');
});

app.get('/applicationId', application_id.check);
app.get('/newApplicationId', application_id.new);

app.get('/getAlbum', album.get);

app.get('/getArtist', artist.get);

app.get('/getPlaying', player.get);
app.get('/setPlaying', player.set);

app.listen(
    PORT, 
    () => console.log(`It's alive on port ${PORT}!`)
);