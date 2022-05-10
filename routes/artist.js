module.exports = function (app) {
    app.get('/getArtist', (req, res) => {
        var { application_id, artist } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            artist = app.locals.strToKey(artist);
            var log_data = [`aid=${application_id}`, `artist=${artist}`];
            if (artist in app.locals.album_data) {
                res.status(200).send(app.locals.album_data[artist]);
            } else {
                // Missing artist
                app.locals.writeUncategorizedData(log_data);
                res.status(204).send();
            }
        } else {
            // Invalid application_id
            res.status(401).send();
        }
    });
}