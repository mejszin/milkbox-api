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
}