module.exports = function (app) {
    app.get('/setTopArtists', (req, res) => {
        const { application_id, aa, ab, ba, bb, ca, cb, da, db, ea, eb } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            console.log('/setTopArtists', application_id, req.body);
            app.locals.setUserStatistic(application_id, 'top_artists', {
                0: { artist: aa, listens: ab },
                1: { artist: ba, listens: bb },
                2: { artist: ca, listens: cb },
                3: { artist: da, listens: db },
                4: { artist: ea, listens: eb }
            });
            res.status(200).send();
        } else {
            res.status(401).send();
        }
    });

    app.post('/postSetTopTracks', (req, res) => {
        const { application_id } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            console.log('/postSetTopTracks', application_id, req.body);
            app.locals.setUserStatistic(application_id, 'top_tracks', req.body);
            res.status(200).send();
        } else {
            res.status(401).send();
        }
    });

    app.get('/setTopTracks', (req, res) => {
        const { application_id, aa, ab, ac, ba, bb, bc, ca, cb, cc, da, db, dc, ea, eb, ec } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            console.log('/setTopTracks', application_id, req.body);
            app.locals.setUserStatistic(application_id, 'top_tracks', {
                0: { artist: aa, track: ab, listens: ac },
                1: { artist: ba, track: bb, listens: bc },
                2: { artist: ca, track: cb, listens: cc },
                3: { artist: da, track: db, listens: dc },
                4: { artist: ea, track: eb, listens: ec }
            });
            res.status(200).send();
        } else {
            res.status(401).send();
        }
    });

    app.get('/setTopGenres', (req, res) => {
        const { application_id, aa, ab, ba, bb, ca, cb, da, db, ea, eb } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            console.log('/setTopGenres', application_id, req.body);
            app.locals.setUserStatistic(application_id, 'top_genres', {
                0: { genre: aa, listens: ab },
                1: { genre: ba, listens: bb },
                2: { genre: ca, listens: cb },
                3: { genre: da, listens: db },
                4: { genre: ea, listens: eb }
            });
            res.status(200).send();
        } else {
            res.status(401).send();
        }
    });
}