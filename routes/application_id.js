module.exports = function (app) {
    APPLICATION_ID_LENGTH = 16;
    
    app.get('/applicationId', (req, res) => {
        const { application_id } = req.query;
        if (application_id == undefined) {
            console.log('application_id is undefined');
            res.status(204).send();
        }
        res.status(200).send({
            exists: (application_id in app.locals.user_data)
        });
    });

    app.get('/newApplicationId', (req, res) => {
        var application_id = null;
        var char_set = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        while ((application_id == null) || (application_id in app.locals.user_data)) {
            application_id = '';
            for (var i = 0; i < APPLICATION_ID_LENGTH; i++) {
                application_id += char_set.charAt(
                    Math.floor(Math.random() * char_set.length)
                );
            }
        }
        res.status(200).send({
            application_id: application_id
        });
    });
}
