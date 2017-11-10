'use strict';
module.exports = function(app) {
  var botList = require('../controllers/botController');

    // Routes
    app.route('/notifications')
        .patch(botList.handler)
        .post(botList.handler)
        .get(botList.handler);

        app.route('/summary')
                .get(botList.labelMatching);

    app.route('/:id')
        .get(botList.getIssues);

    app.route('/issues')
        .get(botList.getIssues)
        .post(botList.createIssue);



    // This should always be at bottom of routes
    app.use(function(req, res) {
        res.status(404).send({url: req.originalUrl + ' not found'});
    });
};
