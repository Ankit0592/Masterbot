'use strict';
module.exports = function(app) {
  var botList = require('../controllers/botController');

    // Routes
    app.route('/notifications')
        .patch(botList.handler)
        .post(botList.handler)
        .get(botList.handler);

  app.route('/validate').get(botList.validate);   


app.route('/summary')
                .get(botList.labelMatching);



  app.route('/:id')
        .get(botList.getIssues);





    // This should always be at bottom of routes
    app.use(function(req, res) {
        res.status(404).send({url: req.originalUrl + ' not found'});
    });
};
