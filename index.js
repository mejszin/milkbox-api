const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const PORT = 81;

app.get('/ping', (req, res) => {
    res.status(200).send('Pong!');
});

app.get('/contact', (req, res) => {
    const { metadata } = req.query;
    fs.writeFileSync('./metadata.json', JSON.stringify(metadata));
    console.log(JSON.stringify(metadata));
    res.status(200).send('Submitted!');
});

app.listen(
    PORT, 
    () => console.log(`It's alive on port ${PORT}!`)
);