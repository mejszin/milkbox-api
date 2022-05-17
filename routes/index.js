const fs = require('fs');

const express = require('express');
const app = express();

const multer  = require('multer');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const axios = require('axios');

const PORT = 82;

const VERSION = 'v0.0.1';

app.locals.ROLE_USER        = 0b0001;
app.locals.ROLE_ADMIN       = 0b0010;
app.locals.ROLE_CONTRIBUTOR = 0b0100;

app.locals.applications_path = './data/applications.json';
app.locals.albums_path = './data/albums.json';
app.locals.posts_path = './data/posts.json';
app.locals.uncategorized_path = './data/uncategorized.csv';

app.locals.application_data = JSON.parse(fs.readFileSync(app.locals.applications_path));
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
    return ((application_id != undefined) && (application_id in app.locals.application_data));
}

app.locals.validUserId = function (user_id) {
    console.log('validUserId', user_id)
    for (var application_id of Object.keys(app.locals.application_data)) {
        if (app.locals.application_data[application_id].user_id == user_id) { return true }
    }
    return false;
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

app.locals.writeApplicationData = function () {
    fs.writeFileSync(app.locals.applications_path, JSON.stringify(app.locals.application_data));
}

app.locals.writeAlbumData = function () {
    fs.writeFileSync(app.locals.albums_path, JSON.stringify(app.locals.album_data));
}

app.locals.writePostData = function () {
    fs.writeFileSync(app.locals.posts_path, JSON.stringify(app.locals.post_data));
}

app.locals.isAdmin = function (application_id) {
    if (app.locals.validApplicationId(application_id)) {
        return !!(app.locals.application_data[application_id].role & app.locals.ROLE_ADMIN);
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

app.locals.createUser = function (application_id, user_id) {
    app.locals.application_data[application_id] = {
        enabled: true,
        user_id: user_id,
        role: app.locals.ROLE_USER | app.locals.ROLE_CONTRIBUTOR,
        player: {
            paused: false
        },
        contributions: {
            count: 0
        }
    }
    app.locals.writeApplicationData();
}

app.locals.createPost = function (application_id, title, body, tags) {
    app.locals.post_data[app.locals.generateId()] = {
        author: app.locals.application_data[application_id].user_id,
        posted_at: new Date().toISOString(),
        votes: [app.locals.application_data[application_id].user_id],
        tags: tags,
        contents: {
            title: title,
            body: body
        }
    }
    app.locals.writePostData();
}

app.locals.getUserById = function (user_id) {
    for (var app_id of Object.keys(app.locals.application_data)) {
        if (app.locals.application_data[app_id].user_id == user_id) { 
            return app.locals.application_data[app_id];
        }
    }
    return {};
}

app.locals.setUserAlias = function (application_id, alias) {
    if (app.locals.application_data[application_id].enabled) {
        app.locals.application_data[application_id].alias = alias;
        app.locals.writeApplicationData();
    }
}

app.locals.getUserAlias = function (user_id) {
    console.log('getUserAlias', user_id);
    if (!app.locals.validUserId(user_id)) { return null }
    var application_data = app.locals.getUserById(user_id);
    return ('alias' in application_data) ? application_data.alias : 'User';
}

app.locals.incrementContributionCount = function (application_id) {
    if (app.locals.application_data[application_id].enabled) {
        app.locals.application_data[application_id].contributions.count += 1;
        app.locals.writeApplicationData();
    }
}

app.locals.addVoteToPost = function (post_id, application_id) {
    if (!app.locals.validApplicationId(application_id)) { return null }
    if (!app.locals.validPostId(post_id)) { return null }
    var user_id = app.locals.application_data[application_id].user_id;
    if (!app.locals.post_data[post_id].votes.includes(user_id)) {
        app.locals.post_data[post_id].votes.push(user_id)
        app.locals.writePostData();
    }
}

app.locals.removeVoteFromPost = function (post_id, application_id) {
    if (!app.locals.validApplicationId(application_id)) { return null }
    if (!app.locals.validPostId(post_id)) { return null }
    var user_id = app.locals.application_data[application_id].user_id;
    if (app.locals.post_data[post_id].votes.includes(user_id)) {
        app.locals.post_data[post_id].votes.splice(
            app.locals.post_data[post_id].votes.indexOf(user_id), 1
        );
        app.locals.writePostData();
    }
}

app.locals.togglePostVote = function (post_id, application_id) {
    if (!app.locals.validApplicationId(application_id)) { return null }
    if (!app.locals.validPostId(post_id)) { return null }
    var user_id = app.locals.application_data[application_id].user_id;
    if (app.locals.post_data[post_id].votes.includes(user_id)) {
        app.locals.post_data[post_id].votes.splice(
            app.locals.post_data[post_id].votes.indexOf(user_id), 1
        );
    } else {
        app.locals.post_data[post_id].votes.push(user_id)
    }
    app.locals.writePostData();
}

app.get('/ping', (req, res) => {
    res.status(200).send('Pong!');
});

app.get('/badge', (req, res) => {
    var url = `https://img.shields.io/badge/milkbox%20API-${VERSION}-ff69b4`;
    axios.get(url).then((response) => {
        res.setHeader("Content-Type", "image/svg+xml")
        res.status(200).send(response.status == '200' ? response.data : '');
    });
});
  

require('./application.js')(app);
require('./user.js')(app);
require('./artist.js')(app);
require('./album.js')(app);
require('./player.js')(app);
require('./post.js')(app);

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './data/uploads/');
    },
    fileFilter: function (req, file, cb) {
        const { application_id } = req.query;
        const extension = path.extname(file.originalname).toLowerCase();
        const mimetyp = file.mimetype;
        if ((!app.locals.validApplicationId(application_id)) || (extension !== '.png' || mimetyp !== 'image/png')) {
            cb('error message', true);
        }
    },
    filename: function (req, file, callback) {
        const { user_id } = req.query;
        callback(null, user_id + '.png');
    },
});

const upload = multer({ storage: storage })

app.post('/setAvatar', upload.single('avatar'), function (req, res, next) {
    const { application_id, user_id } = req.query;
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log(user_id, req.file, req.body);
    if (app.locals.validApplicationId(application_id)) {
        res.status(200).send('Submitted!');
    } else {
        res.status(401).send();
    }
    
})

app.listen(PORT, () => console.log(`It's alive on port ${PORT}!`));