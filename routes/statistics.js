module.exports = function (app) {
    app.get('/setTopArtists', (req, res) => {
        const { application_id, aa, ab, ba, bb, ca, cb, da, db, ea, eb } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            console.log('/setTopArtists', application_id, req.body);
            app.locals.setUserStatistic(application_id, 'top_artists', {
                [aa]: ab, [ba]: bb, [ca]: cb, [da]: db, [ea]: eb,
            });
            res.status(200).send();
        } else {
            res.status(401).send();
        }
    });

    app.post('/setTopTracks', (req, res) => {
        const { application_id } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            console.log('/setTopTracks', application_id, req.body);
            app.locals.setUserStatistic(application_id, 'top_tracks', req.body);
            res.status(200).send();
        } else {
            res.status(401).send();
        }
    });

    app.post('/setTopGenres', (req, res) => {
        const { application_id } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            console.log('/setTopGenres', application_id, req.body);
            app.locals.setUserStatistic(application_id, 'top_genres', req.body);
            res.status(200).send();
        } else {
            res.status(401).send();
        }
    });
}