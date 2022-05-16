const fs = require('fs');

const express = require('express');
const app = express();
app.use(express.json());

const axios = require('axios');

const PORT = 82;

const VERSION = 'v0.0.1';

const ROLE_USER        = 0b0001;
const ROLE_ADMIN       = 0b0010;
const ROLE_CONTRIBUTOR = 0b0100;

app.locals.users_path = './data/users.json';
app.locals.albums_path = './data/albums.json';
app.locals.posts_path = './data/posts.json';
app.locals.uncategorized_path = './data/uncategorized.csv';

app.locals.user_data = JSON.parse(fs.readFileSync(app.locals.users_path));
app.locals.album_data = JSON.parse(fs.readFileSync(app.locals.albums_path));
app.locals.post_data = JSON.parse(fs.readFileSync(app.locals.posts_path));

app.locals.strToKey = function (str) {
    return str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(' ').join('_');
}

app.locals.generateId = function (length = 16) {
    var char_set = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var id = '';
    for (var i = 0; i < length; i++) {
        id += char_set.charAt(
            Math.floor(Math.random() * char_set.length)
        );
    }
    return id;
}

app.locals.validApplicationId = function (application_id) {
    return ((application_id != undefined) && (application_id in app.locals.user_data));
}

app.locals.validPostId = function (post_id) {
    return ((post_id != undefined) && (post_id in app.locals.post_data));
}

app.locals.writeUncategorizedData = function (data) {
    var date = new Date().toISOString();
    const line = `${date},${data.join(",")}\n`;
    //fs.appendFileSync(app.locals.uncategorized_path, line);
    console.log(line);
}

app.locals.writeUserData = function () {
    fs.writeFileSync(app.locals.users_path, JSON.stringify(app.locals.user_data));
}

app.locals.writeAlbumData = function () {
    fs.writeFileSync(app.locals.albums_path, JSON.stringify(app.locals.album_data));
}

app.locals.writePostData = function () {
    fs.writeFileSync(app.locals.posts_path, JSON.stringify(app.locals.post_data));
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

app.locals.createAlbum = function (artist, album, year, genres) {
    var artist_id = app.locals.strToKey(artist);
    var album_id = app.locals.strToKey(album);
    if (!(artist_id in app.locals.album_data)) {
        app.locals.album_data[artist_id] = {
            name: artist,
            albums: {}
        }
    }
    app.locals.album_data[artist_id].albums[album_id] = {
        name: album,
        year: year,
        genres: genres
    }
    app.locals.writeAlbumData();
}

app.locals.createUser = function (application_id) {
    app.locals.user_data[application_id] = {
        enabled: true,
        role: ROLE_USER | ROLE_CONTRIBUTOR,
        player: {
            paused: false
        },
        contributions: {
            count: 0
        }
    }
    app.locals.writeUserData();
}

app.locals.createPost = function (application_id, title, body) {
    app.locals.post_data[app.locals.generateId()] = {
        author: application_id,
        posted_at: new Date().toISOString(),
        votes: [application_id],
        contents: {
            title: title,
            body: body
        }
    }
    app.locals.writePostData();
}

app.locals.setUserAlias = function (application_id, alias) {
    if (app.locals.user_data[application_id].enabled) {
        app.locals.user_data[application_id].alias = alias;
        app.locals.writeUserData();
    }
}

app.locals.getUserAlias = function (application_id) {
    if (!app.locals.validApplicationId(application_id)) { return null }
    if ('alias' in app.locals.user_data[application_id]) {
        return app.locals.user_data[application_id].alias;
    } else {
        return 'User';
    }
}

app.locals.incrementContributionCount = function (application_id) {
    if (app.locals.user_data[application_id].enabled) {
        app.locals.user_data[application_id].contributions.count += 1;
        app.locals.writeUserData();
    }
}

app.locals.addVoteToPost = function (post_id, application_id) {
    if (!app.locals.validApplicationId(application_id)) { return null }
    if (!app.locals.validPostId(post_id)) { return null }
    if (!app.locals.post_data[post_id].votes.includes(application_id)) {
        app.locals.post_data[post_id].votes.push(application_id)
        app.locals.writePostData();
    }
}

app.locals.removeVoteFromPost = function (post_id, application_id) {
    if (!app.locals.validApplicationId(application_id)) { return null }
    if (!app.locals.validPostId(post_id)) { return null }
    if (app.locals.post_data[post_id].votes.includes(application_id)) {
        app.locals.post_data[post_id].votes.splice(
            app.locals.post_data[post_id].votes.indexOf(application_id), 1
        );
        app.locals.writePostData();
    }
}

app.locals.togglePostVote = function (post_id, application_id) {
    if (!app.locals.validApplicationId(application_id)) { return null }
    if (!app.locals.validPostId(post_id)) { return null }
    if (app.locals.post_data[post_id].votes.includes(application_id)) {
        app.locals.post_data[post_id].votes.splice(
            app.locals.post_data[post_id].votes.indexOf(application_id), 1
        );
    } else {
        app.locals.post_data[post_id].votes.push(application_id)
    }
    app.locals.writePostData();
}

app.get('/ping', (req, res) => {
    res.status(200).send('Pong!');
});

app.get('/shield', (req, res) => {
    var http = require('http'),
    request = require('request');
    http.createServer(function(req, res) {
        res.setHeader("content-disposition", "attachment; filename=shield.svg");
        request(`https://img.shields.io/badge/milkbox%20API-${VERSION}-ff69b4`).pipe(res);
    }).listen(8080);
});

require('./user.js')(app);
require('./artist.js')(app);
require('./album.js')(app);
require('./player.js')(app);
require('./post.js')(app);

app.listen(PORT, () => console.log(`It's alive on port ${PORT}!`));