module.exports = function (app) {
    app.get('/getAlbum', (req, res) => {
        var { application_id, artist, album } = req.query;
        if ((application_id != undefined) && (application_id in app.locals.user_data)) {
            artist = app.locals.strToKey(artist);
            album  = app.locals.strToKey(album);
            var log_data = [`aid=${application_id}`, `artist=${artist}`, `album=${album}`];
            if (artist in app.locals.album_data) {
                if (album in app.locals.album_data[artist]) {
                    res.status(200).send(app.locals.album_data[artist][album]);
                } else {
                    // Missing album
                    app.locals.writeUncategorizedData(log_data);
                    res.status(204).send();
                }
            } else {
                // Missing artist & album
                app.locals.writeUncategorizedData(log_data);
                res.status(204).send();
            }
        } else {
            // Invalid application_id
            res.status(401).send();
        }
    });
}