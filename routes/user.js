module.exports = function (app) {
    const axios = require('axios');
    
    app.get('/getUserBadge', (req, res) => {
        const { user_id } = req.query;
        if (app.locals.validUserId(user_id)) {
            var alias = encodeURIComponent(app.locals.getUserAlias(user_id));
            var contributions = app.locals.getUserById(user_id).contributions.count;
            var url = `https://img.shields.io/badge/${alias}-${contributions}-ff69b4`;
            axios.get(url).then((response) => {
                res.setHeader("Content-Type", "image/svg+xml");
                res.status(200).send(response.status == '200' ? response.data : '');
            });
        } else {
            res.status(204).send();
        }
    });

    app.get('/getUserRoles', (req, res) => {
        const { application_id, user_id } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            if (app.locals.validUserId(user_id)) {
                var roles = [];
                var role = app.locals.getUserById(user_id).role;
                if (role & app.locals.ROLE_USER       ) { roles.push('User') };
                if (role & app.locals.ROLE_ADMIN      ) { roles.push('Admin') };
                if (role & app.locals.ROLE_CONTRIBUTOR) { roles.push('Contributor') };
                res.status(200).send(roles);
            } else {
                res.status(204).send();
            }
        } else {
            res.status(401).send();
        }
    });

    app.get('/getUsersByAlias', (req, res) => {
        const { application_id, alias } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            var users = app.locals.getUsersByAlias(alias);
            if (users.length > 0) {
                res.status(200).send(users);
            } else {
                res.status(204).send();
            }
        } else {
            res.status(401).send();
        }
    });

    app.get('/getTopUsers', (req, res) => {
        const { application_id } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            // TODO: Get users sorted by contribution count
            res.status(200).send({});
        } else {
            res.status(401).send();
        }
    });
}