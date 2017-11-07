'use strict';
var request = require('request');
var natural = require('natural');
//var mockData = require('./mock.json');
var token = "Basic YWFyb3JhNkBuY3N1LmVkdTpBbmtpdDMxMTMh";
var urlRoot = "https://masterbot.atlassian.net/rest/api/2/";

exports.getIssues = function(req, res) {
    var callback=function(matchedIssues){
        res.status(200).json({
            matching_issues: matchedIssues
        });
    }
    getIssues(req.params.id, callback);

//   Task.find({}, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json(task);
//   });
};

function getMatch(str1, str2) {
    return natural.JaroWinklerDistance(str1, str2);
};

function getIssues(id, callback)
{
    var projectName = 'MAS';
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
        var matchedIssues=[];
        if(body) {
            var obj = JSON.parse(body);
            var issueDescription = '';
            for(var i =0; i<obj.issues.length; i++){
                if(obj.issues[i].key === id){
                    issueDescription = obj.issues[i].fields.summary;
                    obj.issues.splice(i,1);
                    break;
                }
            }
            if (issueDescription.length > 0) {
                for(var i =0; i<obj.issues.length; i++){
                    var summaryOverlap = getMatch(issueDescription, obj.issues[i].fields.summary);
                    if(summaryOverlap > 0.7){
                        var link="https://masterbot.atlassian.net/browse/"
                        matchedIssues.push(link+''+obj.issues[i].key);
                    }
                }
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