module.exports = function (app) {
    APPLICATION_ID_LENGTH = 16;
    
    app.get('/setPost', (req, res) => {
        const { application_id, title, body, tags } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            var tag_arr = (tags == undefined) ? [] : tags.split(",");
            app.locals.createPost(application_id, title, body, tag_arr);
            res.status(200).send('Submitted!');
        } else {
            res.status(401).send();
        }
    });

    app.get('/getPosts', (req, res) => {
        const { application_id } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            res.status(200).send(app.locals.post_data);
        } else {
            res.status(401).send();
        }
    });

    app.get('/getRecentPosts', (req, res) => {
        var posts = [];
        const { application_id } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            Object.keys(app.locals.post_data).forEach((key) => {
                posts.push({
                    id: key,
                    author: {
                        id: app.locals.post_data[key].author,
                        alias: app.locals.getUserAlias(app.locals.post_data[key].author)
                    },
                    votes: app.locals.post_data[key].votes,
                    posted_at: app.locals.post_data[key].posted_at,
                    tags: app.locals.post_data[key].tags,
                    contents: app.locals.post_data[key].contents
                });
            })
            var sorted_posts = posts.sort(function(a, b) {
                return new Date(b.posted_at) - new Date(a.posted_at);
            });
            res.status(200).send(sorted_posts.slice(0, 10));
        } else {
            res.status(401).send();
        }
    });

    app.get('/getTopPosts', (req, res) => {
        var posts = [];
        const { application_id } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            Object.keys(app.locals.post_data).forEach((key) => {
                posts.push({
                    id: key,
                    author: {
                        id: app.locals.post_data[key].author,
                        alias: app.locals.getUserAlias(app.locals.post_data[key].author)
                    },
                    votes: app.locals.post_data[key].votes,
                    posted_at: app.locals.post_data[key].posted_at,
                    tags: app.locals.post_data[key].tags,
                    contents: app.locals.post_data[key].contents
                });
            })
            var sorted_posts = posts.sort(function(a, b) {
                return b.votes.length - a.votes.length;
            });
            res.status(200).send(sorted_posts.slice(0, 10));
        } else {
            res.status(401).send();
        }
    });

    app.get('/getUserPosts', (req, res) => {
        var posts = [];
        const { application_id, user_id } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            Object.keys(app.locals.post_data).forEach((key) => {
                if (app.locals.post_data[key].author == user_id) {
                    posts.push({
                        id: key,
                        author: {
                            id: app.locals.post_data[key].author,
                            alias: app.locals.getUserAlias(app.locals.post_data[key].author)
                        },
                        votes: app.locals.post_data[key].votes,
                        posted_at: app.locals.post_data[key].posted_at,
                        tags: app.locals.post_data[key].tags,
                        contents: app.locals.post_data[key].contents
                    });
                }
            })
            var sorted_posts = posts.sort(function(a, b) {
                return new Date(b.posted_at) - new Date(a.posted_at);
            });
            res.status(200).send(sorted_posts.slice(0, 10));
        } else {
            res.status(401).send();
        }
    });

    app.get('/getTagPosts', (req, res) => {
        var posts = [];
        const { application_id, tag } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            Object.keys(app.locals.post_data).forEach((key) => {
                if (tag in app.locals.post_data[key].tags) {
                    posts.push({
                        id: key,
                        author: {
                            id: app.locals.post_data[key].author,
                            alias: app.locals.getUserAlias(app.locals.post_data[key].author)
                        },
                        votes: app.locals.post_data[key].votes,
                        posted_at: app.locals.post_data[key].posted_at,
                        tags: app.locals.post_data[key].tags,
                        contents: app.locals.post_data[key].contents
                    });
                }
            })
            var sorted_posts = posts.sort(function(a, b) {
                return new Date(b.posted_at) - new Date(a.posted_at);
            });
            res.status(200).send(sorted_posts.slice(0, 10));
        } else {
            res.status(401).send();
        }
    });

    app.get('/setVote', (req, res) => {
        const { application_id, post_id, status } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            switch(status) {
                case 'true':
                    app.locals.addVoteToPost(post_id, application_id);
                    break;
                case 'false':
                    app.locals.removeVoteFromPost(post_id, application_id);
                    break;
                default:
                    app.locals.togglePostVote(post_id, application_id);
            }
            res.status(200).send('Submitted!');
        } else {
            res.status(401).send();
        }
    });
}