const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const PORT = 82;
const METADATA_PATH = './metadata.json';

app.get('/ping', (req, res) => {
    res.status(200).send('Pong!');
});

app.get('/setPlaying', (req, res) => {
    const { artist, track, collection } = req.query;
    data = {
        artist: artist,
        track: track,
        collection: collection
    }
    fs.writeFileSync(METADATA_PATH, JSON.stringify(data));
    console.log(JSON.stringify(data));
    res.status(200).send('Submitted!');
});

app.get('/getPlaying', (req, res) => {
    if (fs.existsSync(METADATA_PATH)) {
        data = JSON.parse(fs.readFileSync(METADATA_PATH));
        res.status(200).send(data);
    } else {
        res.status(204).send({});
    }
});

app.listen(
    PORT, 
    () => console.log(`It's alive on port ${PORT}!`)
);