'use strict';
module.exports = function(app) {
  var botList = require('../controllers/botController');

    // Routes
    app.route('/')
        .get(botList.getIssues);

    app.route('/issues')
        .get(botList.getIssues)
        .post(botList.createIssue);


    // This should always be at bottom of routes
    app.use(function(req, res) {
        res.status(404).send({url: req.originalUrl + ' not found'});
    });
};