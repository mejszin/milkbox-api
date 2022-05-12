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

    app.get('/getRecentPosts', (req, res) => {
        var posts = [];
        var post_data = {};
        const { application_id } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            Object.keys(app.locals.post_data).forEach(function(key) {
                posts.push({
                    author: {
                        id: app.locals.post_data[key].author,
                        alias: app.locals.getUserAlias(app.locals.post_data[key].author)
                    },
                    votes: app.locals.post_data[key].votes,
                    posted_at: app.locals.post_data[key].posted_at,
                    contents: app.locals.post_data[key].contents
                });
            })
            sorted_posts = posts.sort(function(a, b) {
                return new Date(b.posted_at) - new Date(a.posted_at);
            });
            res.status(200).send(sorted_posts.slice(0, 10));
        } else {
            res.status(204).send();
        }
    });

    app.get('/setVote', (req, res) => {
        const { application_id, post_id, status } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            if (status == 'true') {
                app.locals.addVoteToPost(post_id, application_id);
            } else {
                app.locals.removeVoteFromPost(post_id, application_id);
            }
            res.status(200).send('Submitted!');
        } else {
            res.status(204).send();
        }
    });
}