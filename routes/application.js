module.exports = function (app) {
    APPLICATION_ID_LENGTH = 16;

    // TODO: Seperate application object from user object

    app.get('/getApplication', (req, res) => {
        const { application_id } = req.query;
        if (application_id == undefined) {
            res.status(204).send();
        }
        res.status(200).send(
            (application_id in app.locals.application_data) ? app.locals.application_data[application_id] : { enabled: false }
        );
    });
    
    app.get('/getUser', (req, res) => {
        const { application_id, user_id } = req.query;
        if (application_id == undefined) {
            res.status(204).send();
        }
        if (user_id == undefined) {
            res.status(200).send(
                (application_id in app.locals.application_data) ? app.locals.application_data[application_id] : { enabled: false }
            );
        } else {
            for (var app_id of Object.keys(app.locals.application_data)) {
                if (user_id == app.locals.application_data[app_id].user_id) {
                    res.status(200).send(app.locals.application_data[app_id]);
                    return
                }
            }
            res.status(200).send({ enabled: false });
        }
    });

    function getUserIDs() {
        var list = [];
        for (var app_id of Object.keys(app.locals.application_data)) {
            list.push(app.locals.application_data[app_id].user_id);
        }
        return list;
    }

    app.get('/newUser', (req, res) => {
        var application_id = null;
        var user_id = null;
        while ((application_id == null) || (application_id in app.locals.application_data)) {
            application_id = app.locals.generateId(APPLICATION_ID_LENGTH);
        }
        while ((user_id == null) || (user_id in getUserIDs())) {
            user_id = app.locals.generateId(APPLICATION_ID_LENGTH);
        }
        app.locals.createUser(application_id, user_id);
        res.status(200).send({
            application_id: application_id
        });
    });

    app.get('/getAdmin', (req, res) => {
        const { application_id } = req.query;
        if (application_id == undefined) {
            res.status(204).send();
        }
        res.status(200).send(
            { admin: app.locals.isAdmin(application_id) }
        );
    });

    app.get('/setAlias', (req, res) => {
        const { application_id, alias } = req.query;
        if (application_id == undefined) {
            res.status(204).send();
        }
        app.locals.setUserAlias(application_id, alias);
        res.status(200).send('Submitted!');
    });
}
