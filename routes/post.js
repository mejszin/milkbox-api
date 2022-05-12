module.exports = function (app) {
    APPLICATION_ID_LENGTH = 16;
    
    app.get('/setPost', (req, res) => {
        const { application_id, title, body } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            app.locals.createPost(application_id, title, body);
            res.status(200).send('Submitted!');
        } else {
            res.status(204).send();
        }
    });

    app.get('/getPosts', (req, res) => {
        const { application_id } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            res.status(200).send(app.locals.post_data);
        } else {
            res.status(204).send();
        }
    });
}