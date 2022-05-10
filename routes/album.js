module.exports = function(app){

    app.get('/getArtist', (req, res) => {
        var { application_id, artist } = req.query;
        if ((application_id != undefined) && (application_id in user_data)) {
            artist = strToKey(artist);
            var log_data = [`aid=${application_id}`, `artist=${artist}`];
            if (artist in album_data) {
                res.status(200).send(album_data[artist]);
            } else {
                // Missing artist
                writeUncategorizedData(log_data);
                res.status(204).send();
            }
        } else {
            // Invalid application_id
            res.status(401).send();
        }
    });
    
    app.get('/getAlbum', (req, res) => {
        var { application_id, artist, album } = req.query;
        if ((application_id != undefined) && (application_id in user_data)) {
            artist = strToKey(artist);
            album  = strToKey(album);
            var log_data = [`aid=${application_id}`, `artist=${artist}`, `album=${album}`];
            if (artist in album_data) {
                if (album in album_data[artist]) {
                    res.status(200).send(album_data[artist][album]);
                } else {
                    // Missing album
                    writeUncategorizedData(log_data);
                    res.status(204).send();
                }
            } else {
                // Missing artist & album
                writeUncategorizedData(log_data);
                res.status(204).send();
            }
        } else {
            // Invalid application_id
            res.status(401).send();
        }
    });

}