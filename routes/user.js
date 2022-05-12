module.exports = function (app) {
    APPLICATION_ID_LENGTH = 16;
    
    app.get('/getUser', (req, res) => {
        const { application_id } = req.query;
        if (application_id == undefined) {
            res.status(204).send();
        }
        res.status(200).send(
            (application_id in app.locals.user_data) ? app.locals.user_data[application_id] : { enabled: false }
        );
    });

    app.get('/newUser', (req, res) => {
        var application_id = null;
        while ((application_id == null) || (application_id in app.locals.user_data)) {
            application_id = app.locals.generateId(APPLICATION_ID_LENGTH);
        }
        app.locals.createUser(application_id);
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
