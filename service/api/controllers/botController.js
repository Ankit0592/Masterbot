'use strict';
var request = require('request');
var natural = require('natural');
var mockData = require('./mock.json');
var token = "Basic YWFyb3JhNkBuY3N1LmVkdTpBbmtpdDMxMTMh";
var urlRoot = "https://masterbot.atlassian.net/rest/api/2/";

var matchedIssues=[];
exports.getIssues = function(req, res) {
    var callback=function(){
        res.status(200).json({
            matching_issues: matchedIssues
        });
    }
     getIssues('MAS', callback);   
     
//   Task.find({}, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json(task);
//   });
};

function getMatch(str1, str2) {
	return natural.JaroWinklerDistance(str1, str2);
};

function getIssues(projectName, callback)
{  
 	var options = {
  		url: urlRoot + '/search?jql=project=' + projectName + "&maxResults=15",
		method: 'GET',
		headers: {
			"content-type": "application/json",
			"Authorization": token
		}
	};
	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) 
	{
		var obj = mockData;
        for(var i =0; i<obj.issues.length; i++){
            var a=getMatch("Notify",obj.issues[i].fields.summary);
            if(a > 0.7){
                var link="https://masterbot.atlassian.net/browse/"
                matchedIssues.push(link+''+obj.issues[i].key);
             }
        }
        callback(matchedIssues);        
    });
}

exports.createIssue = function(req, res) {
    res.json("created");
//   var new_task = new Task(req.body);
//   new_task.save(function(err, task) {
//     if (err)
//       res.send(err);
//     res.json(task);
//   });
};