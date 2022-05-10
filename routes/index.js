const fs = require('fs');

const express = require('express');
const app = express();
app.use(express.json());

const PORT = 82;

const ROLE_USER = 0b0001;
const ROLE_ADMIN = 0b0010;

app.locals.users_path = './data/users.json';
app.locals.albums_path = './data/albums.json';
app.locals.uncategorized_path = './data/uncategorized.csv';

app.locals.user_data = JSON.parse(fs.readFileSync(app.locals.users_path));
app.locals.album_data = JSON.parse(fs.readFileSync(app.locals.albums_path));

app.locals.strToKey = function (str) {
    return str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(' ').join('_');
}

app.locals.validApplicationId = function (application_id) {
    return ((application_id != undefined) && (application_id in app.locals.user_data));
}

app.locals.writeUncategorizedData = function (data) {
    var date = new Date().toISOString();
    const line = `${date},${data.join(",")}\n`;
    fs.appendFileSync(app.locals.uncategorized_path, line);
    console.log(line);
}

app.locals.writeUserData = function () {
    fs.writeFileSync(app.locals.users_path, JSON.stringify(app.locals.user_data));
}

app.locals.writeAlbumData = function () {
    fs.writeFileSync(app.locals.albums_path, JSON.stringify(app.locals.album_data));
}

app.locals.isAdmin = function (application_id) {
    if (app.locals.validApplicationId(application_id)) {
        return !!(app.locals.user_data[application_id].role & ROLE_ADMIN);
    } else {
        return false;
    }
}

app.locals.createArtist = function (artist) {
    var artist_id = app.locals.strToKey(artist);
    app.locals.album_data[artist_id] = {
        name: artist,
        albums: {}
    }
    app.locals.writeAlbumData();
}

app.locals.createUser = function (application_id) {
    app.locals.user_data[application_id] = {
        enabled: true,
        role: ROLE_USER,
        player: {}
    }
    app.locals.writeUserData();
}

app.get('/ping', (req, res) => {
    res.status(200).send('Pong!');
});

require('./user.js')(app);
require('./artist.js')(app);
require('./album.js')(app);
require('./player.js')(app);

app.listen(PORT, () => console.log(`It's alive on port ${PORT}!`));