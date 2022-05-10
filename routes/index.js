const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const PORT = 82;
const USERS_PATH = './data/users.json';
const ALBUMS_PATH = './data/albums.json';
const UNCATEGORIZED_PATH = './data/uncategorized.csv';

var user_data = JSON.parse(fs.readFileSync(USERS_PATH));
var album_data = JSON.parse(fs.readFileSync(ALBUMS_PATH));

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
    fs.appendFileSync(UNCATEGORIZED_PATH, line);
    console.log(line);
}

var application_id = require('./routes/application_id.js');
var album =  require('./routes/album.js');
var artist =  require('./routes/artist.js');
var player = require('./routes/player.js');

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