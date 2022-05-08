const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const PORT = 82;

app.get('/ping', (req, res) => {
    res.status(200).send('Pong!');
});

app.get('/playing', (req, res) => {
    const { artist, track, collection } = req.query;
    data = {
        artist: artist,
        track: track,
        collection: collection
    }
    fs.writeFileSync('./metadata.json', JSON.stringify(data));
    console.log(JSON.stringify(metadata));
    res.status(200).send('Submitted!');
});

app.listen(
    PORT, 
    () => console.log(`It's alive on port ${PORT}!`)
);