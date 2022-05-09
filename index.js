const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const PORT = 82;
const USERS_PATH = './users.json';

app.get('/ping', (req, res) => {
    res.status(200).send('Pong!');
});

app.get('/setPlaying', (req, res) => {
    const { application_id, artist, track, collection } = req.query;
    player_data = {
        artist: artist,
        track: track,
        collection: collection
    }
    var user_data = JSON.parse(fs.readFileSync(USERS_PATH));
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
    if (fs.existsSync(USERS_PATH)) {
        var user_data = JSON.parse(fs.readFileSync(USERS_PATH));
        if (application_id in user_data) {
            res.status(200).send(user_data[application_id].player)
        } else {
            res.status(200).send({});
        }
    } else {
        res.status(204).send({});
    }
});

app.listen(
    PORT, 
    () => console.log(`It's alive on port ${PORT}!`)
);