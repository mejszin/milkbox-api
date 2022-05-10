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

module.exports = function(app){
    fs.readdirSync(__dirname).forEach(function(file) {
        if (file == "index.js") return;
        var name = file.substr(0, file.indexOf('.'));
        console.log(`Requiring ./${name}...`)
        require('./' + name)(app);
    });

    app.get('/ping', (req, res) => {
        res.status(200).send('Pong!');
    });
    
    app.listen(
        PORT, 
        () => console.log(`It's alive on port ${PORT}!`)
    );
}