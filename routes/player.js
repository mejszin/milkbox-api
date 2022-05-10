module.exports = function (app) {
    exports.set = function (req, res) {
        const { application_id, artist, track, collection } = req.query;
        if (application_id == undefined) {
            console.log('application_id is undefined');
            res.status(401).send();
        }
        player_data = {
            artist: artist,
            track: track,
            collection: collection
        }
        if (application_id in app.locals.user_data) {
            app.locals.user_data[application_id].player = player_data;
        } else {
            app.locals.user_data[application_id] = {
                player: player_data
            }
        }
        fs.writeFileSync(app.locals.users_path, JSON.stringify(app.locals.user_data));
        console.log(application_id, JSON.stringify(player_data));
        res.status(200).send('Submitted!');
    };
    
    exports.get = function (req, res) {
        const { application_id } = req.query;
        if (application_id == undefined) {
            console.log('application_id is undefined');
            res.status(401).send();
        }
        if (application_id in app.locals.user_data) {
            res.status(200).send(app.locals.user_data[application_id].player)
        } else {
            res.status(200).send({});
        }
    };
}