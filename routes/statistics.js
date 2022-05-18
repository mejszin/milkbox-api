module.exports = function (app) {
    app.post('/setTopArtists', (req, res) => {
        const { application_id } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            app.locals.setUserStatistic(application_id, 'top_artists', res.body);
            res.status(200).send();
        } else {
            res.status(401).send();
        }
    });

    app.post('/setTopTracks', (req, res) => {
        const { application_id } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            app.locals.setUserStatistic(application_id, 'top_tracks', res.body);
            res.status(200).send();
        } else {
            res.status(401).send();
        }
    });

    app.post('/setTopGenres', (req, res) => {
        const { application_id } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            app.locals.setUserStatistic(application_id, 'top_genres', res.body);
            res.status(200).send();
        } else {
            res.status(401).send();
        }
    });
}