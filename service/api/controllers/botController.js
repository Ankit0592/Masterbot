'use strict';
var request = require('request');
var natural = require('natural');
//var mockData = require('./mock.json');
var token = "Basic YWFyb3JhNkBuY3N1LmVkdTpBbmtpdDMxMTMh";
var urlRoot = "https://masterbot.atlassian.net/rest/api/2/";
var config = require('../../config.js');
var pos = require('pos');

exports.getIssues = function(req, res) {
  console.log('In get Issues');
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
  console.log(id);
    var projectName = 'MAS';
    var options = {
        url: urlRoot + '/search?jql=project=' + projectName, //+ "&maxResults=15",
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
/*
  var projectName = 'MAS';
  var options = {
      url: urlRoot + 'issue/',
      method: 'POST',
      headers: {
          "content-type": "application/json",
          "Authorization": token
      },
     json: {
      'fields': {
        "project":
            {
              "key": "MAS"
             },
         "summary": "REST ye merry gentlemen.",
        "description": "Creating of an issue using project keys and issue type names using the REST API",
         "issuetype": {
            "name": "Bug"
           }
      }
      }
  };*/
};

exports.labelMatching = function(req, res) {

  //console.log(req.body);
  var callback=function(userIssuesAndLabels){
      res.status(200).json({
          user_issues: userIssuesAndLabels
      });
  }
  //getIssues(req.params.id, callback);
//callback('Kinnetic');
labelMatching(req.body.summary,callback);

};

function Comparator(arr1, arr2) {
  if (arr1[2] < arr2[2])
  {
    return 1;
  }
  else if (arr1[2] > arr2[2])
  {
    return -1;
  }
  else{
     return 0;
  }

}

function labelMatching(summary,callback ){

     var arrayOfLabels = extractLabels(summary);
     var projectName = 'MAS';
     var options = {
         url: urlRoot + '/search?jql=project=' + projectName + "&expand=labels",
         method: 'GET',
         headers: {
             "content-type": "application/json",
             "Authorization": token
         }
     };
     // Send a http request to url and specify a callback that will be called upon its return.
     request(options, function (error, response, body)
     {
         var countArray = [];
         var thLength = (arrayOfLabels.length)/2 ;
         //console.log(arrayOfLabels);
         //console.log(arrayOfLabels.length);
        // var matchedIssues=[];
        //var userIssues = '';
        var userIssues = [];
         if(body) {
             var obj = JSON.parse(body)
             for(var i =0; i<obj.issues.length; i++){
                // console.log(obj.issues[i].labels);
                 var ct = countNoOfSims(obj.issues[i].fields.labels,arrayOfLabels);
                 if(ct >= thLength){
                   var arrToAdd = [];
                   arrToAdd.push(obj.issues[i].key);
                   arrToAdd.push(obj.issues[i].fields.assignee.name);
                   arrToAdd.push(ct);
                   countArray.push(arrToAdd);
                 }

             }
            // console.log(countArray.length);
             countArray = countArray.sort(Comparator);
             for(var i =0; (i<countArray.length && i < 4); i++){
                  var issueArr = countArray[i];
                  //userIssues = userIssues + issueArr[0] + ' : ' + issueArr[1] + ', ';
                  userIssues.push(issueArr[0] + ' : ' + issueArr[1]);
             }
            //console.log(myArray);
         }
         //console.log(userIssues);
         //console.log(arrayOfLabels);
         callback([userIssues,arrayOfLabels]);
     });


}

function countNoOfSims(inputLabelsArray, issueLabelsArray){
       var retCount = 0;
       var candidate = '';
       for(var i=0; i < inputLabelsArray.length; i++){
         candidate = inputLabelsArray[i];
         for(var j=0; j < issueLabelsArray.length; j++){
           if(issueLabelsArray[j] == candidate){
              retCount = retCount + 1;
              break;
           }
         }
       }
      return retCount;
}
//console.log(extractLabels('Bugs exist in code. Deployment fails on Jenkins'))
function extractLabels(summary){
  var retArray = [];
  var words = new pos.Lexer().lex(summary);
  var tagger = new pos.Tagger();
  var taggedWords = tagger.tag(words);
  for (var i in taggedWords) {
    var taggedWord = taggedWords[i];
    var word = taggedWord[0];
    var tag = taggedWord[1];
    //console.log(word + " /" + tag);
    if(tag == 'NN' || tag == 'NNP' ||  tag == 'NNPS' ||  tag == 'NNS' ){
    retArray.push(word);
    }
  }
  return retArray;
}

/*
exports.handler = (event, context, callback) => {
    //console.log(event.body);
    payload = decodeURIComponent(event.body);
    json = payload.substring(8);
    json_obj = JSON.parse(json);
    console.log(json_obj);
    names = json_obj.actions[0].name.split("+");
    issueType = json_obj.actions[0].value;
 //callback(null, { statusCode: 200, body:"Issue created and successfully assigned to : " + names[2] });
    createIssue(names[2],callback,issueType)
};
*/
function createIssue(userName, callback,issueType){

    var options = {
      url: urlRoot + 'issue/',
      method: 'POST',
      headers: {
          "content-type": "application/json",
          "Authorization": token
      },
      json: {
      "fields": {
        "project":
            {
              "key": "MAS"
             },
         "summary": "REST ye merry gentlemen.",
        "description": "Creating of an issue using project keys and issue type names using the REST API",
         "issuetype": {
            "name": issueType
           },
           "assignee":{"name":userName}
      }
      }
  };
  request(options, function (error, response, body)
    {
        if(body){
          //  var obj = JSON.parse(body);
            console.log(body);
        }
        callback(null, { statusCode: 200, body:"Issue "+body.key+" created and successfully assigned to : " + userName+". For furhter info click on: "+ body.self});
    });
}

// Notification handler: use ngrok to get public url and put the url in jira webhooks
exports.handler = (event, context, callback) =>{
    var json_obj = event.body;
    if(json_obj.issue_event_type_name == "issue_generic"){
        var emailAddress = json_obj.user.emailAddress;
        var id = json_obj.changelog.id;
        var fromString = json_obj.changelog.items[0].fromString !== null ? json_obj.changelog.items[0].fromString : "To Do";
        var toString = json_obj.changelog.items[0].toString !== null ? json_obj.changelog.items[0].toString : "To Do";
        var key = json_obj.issue.key;
        var subtasks = json_obj.issue.fields.subtasks;

        for(var i = 0; i<subtasks.length; i++){
            var subtaskUrl = subtasks[i].self;
            var options = {
                url: subtaskUrl,
                method: 'GET',
                headers: {
                    "content-type": "application/json",
                    "Authorization": token
                }
            };
        // Send a http request to url and specify a callback that will be called upon its return.
            request(options, function (error, response, body)
            {
                sendNotification(body, emailAddress, fromString, toString, key);
            });
        }
    }


    function sendNotification(body, emailAddress, fromString, toString, key){
        //var targetUser = JSON.parse(body).fields.assignee.name;
        var targetUser = JSON.parse(body).fields.assignee.emailAddress.split('@')[0];
        var url = config.team_members[0][targetUser];

        var result = "UPDATE: "+emailAddress +" changed status of task- <https://masterbot.atlassian.net/browse/"+key+"|"+key+">";
        if(emailAddress != JSON.parse(body).fields.assignee.emailAddress){
        var myObj = { "attachments": [ {"color":"#439FE0", "text": result, "fields": [
                    {
                        "title": "Previous Status",
                        "value": fromString,
                        "short": true
                    },
                    {
                        "title": "Updated Status",
                        "value": toString,
                        "short": true
                    }

                ] }]};
        var myJSON = JSON.stringify(myObj);

        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        var request = new XMLHttpRequest();
        // common channel url "https://hooks.slack.com/services/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"

        //var url = urls[targetUser];
        var method = "POST";
        var postData = myJSON;
        var async = true;

        request.open(method, url, async);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(postData);
      }
    }
}
