'use strict';

exports.getIssues = function(req, res) {
    res.status(200).json({
        message: 'Welcome to the issues api'
    });
//   Task.find({}, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json(task);
//   });
};

exports.getMatch = function(str1, str2) {
	var natural = require('natural');
	return natural.JaroWinklerDistance(str1, str2);
};



exports.createIssue = function(req, res) {
    res.json("created");
//   var new_task = new Task(req.body);
//   new_task.save(function(err, task) {
//     if (err)
//       res.send(err);
//     res.json(task);
//   });
};