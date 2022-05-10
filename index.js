const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const PORT = 82;
const USERS_PATH = './data/users.json';
const ALBUMS_PATH = './data/albums.json';
const UNCATEGORIZED_PATH = './data/uncategorized.csv';
const APPLICATION_ID_LENGTH = 16;

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

app.get('/ping', (req, res) => {
    res.status(200).send('Pong!');
});

app.get('/newApplicationId', (req, res) => {
    var application_id = null;
    var char_set = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    while ((application_id == null) || (application_id in user_data)) {
        application_id = '';
        for (var i = 0; i < APPLICATION_ID_LENGTH; i++) {
            application_id += char_set.charAt(
                Math.floor(Math.random() * char_set.length)
            );
        }
    }
    res.status(200).send({
        application_id: application_id
    });
});


app.get('/applicationId', (req, res) => {
    const { application_id } = req.query;
    if (application_id == undefined) {
        console.log('application_id is undefined');
        res.status(204).send();
    }
    res.status(200).send({
        exists: (application_id in user_data)
    });
});

app.get('/getAlbum', (req, res) => {
    var { application_id, artist, album } = req.query;
    if ((application_id != undefined) && (application_id in user_data)) {
        artist = strToKey(artist);
        album  = strToKey(album);
        var log_data = [`aid=${application_id}`, `artist=${artist}`, `album=${album}`];
        if (artist in album_data) {
            if (album in album_data[artist]) {
                res.status(200).send(album_data[artist][album]);
            } else {
                // Missing album
                writeUncategorizedData(log_data);
                res.status(204).send();
            }
        } else {
            // Missing artist & album
            writeUncategorizedData(log_data);
            res.status(204).send();
        }
    } else {
        // Invalid application_id
        res.status(401).send();
    }
});

app.get('/setPlaying', (req, res) => {
    const { application_id, artist, track, collection } = req.query;
    if (application_id == undefined) {
        console.log('application_id is undefined');
        res.status(401).send();
    }
    player_data = {
        artist: artist,
        track: track,
        collection: collection
    }
    if (application_id in user_data) {
        user_data[application_id].player = player_data;
    } else {
        user_data[application_id] = {
            player: player_data
        }
    }
    fs.writeFileSync(USERS_PATH, JSON.stringify(user_data));
    console.log(application_id, JSON.stringify(player_data));
    res.status(200).send('Submitted!');
});

app.get('/getPlaying', (req, res) => {
    const { application_id } = req.query;
    if (application_id == undefined) {
        console.log('application_id is undefined');
        res.status(401).send();
    }
    if (application_id in user_data) {
        res.status(200).send(user_data[application_id].player)
    } else {
        res.status(200).send({});
    }
});

app.listen(
    PORT, 
    () => console.log(`It's alive on port ${PORT}!`)
);