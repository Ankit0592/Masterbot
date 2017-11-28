'use strict';
var request = require('request');
var natural = require('natural');
var token = process.env.JIRATOKEN;
var urlRoot = "https://masterbot.atlassian.net/rest/api/2";
var browseIssueURL = "https://masterbot.atlassian.net/browse/"
var config = require('../../config.js');
var pos = require('pos');

exports.getIssues = function(req, res) {

    var callback=function(matchedIssues){
        res.status(200).json({
            matching_issues: matchedIssues
        });
    }
    getIssues(req.params.id, callback);

};

function getMatch(str1, str2) {
    return natural.JaroWinklerDistance(str1, str2);
};

function getIssues(id, callback)
{
  //console.log(id);
  var project_id = id.split("-")[0];
    var projectName = project_id;
    var options = {
        url: urlRoot + '/search?jql=project=' + projectName, //+ "&maxResults=15",
        method: 'GET',
        headers: {
            "content-type": "application/json",
            "Authorization": token
        }
    };
  //Use case 3
    // Send a http request to url and specify a callback that will be called upon its return.
    request(options, function (error, response, body)
    {
        var matchedIssues=[];
        if(body) {
            var obj = JSON.parse(body);
            if(!obj.issues){
              matchedIssues.push("Invalid");
              callback(matchedIssues);
              return 0;
            }
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
                        matchedIssues.push(browseIssueURL+''+obj.issues[i].key);
                    }
                }
            }
        }
        callback(matchedIssues);
    });
}


exports.labelMatching = function(req, res) {

  //console.log(req.body);
  var callback=function(userIssuesAndLabels){
      res.status(200).json({
          user_issues: userIssuesAndLabels
      });
  }

labelMatching(req.body.summary,req.body.project_id,callback);

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

function labelMatching(summary,project_id,callback ){


     var projectName = project_id;
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
         var userIssues = [];
         if(body) {
             var obj = JSON.parse(body)
             if(!obj.issues){
               userIssues.push('Invalid');
               callback([userIssues,[]]);
               return 0;
             }
              var arrayOfLabels = extractLabels(summary);
              var thLength = (arrayOfLabels.length)/2 ;
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

    // Use Case 2
    function sendNotification(body, emailAddress, fromString, toString, key){
        var targetUser = JSON.parse(body).fields.assignee.emailAddress.split('@')[0];
        var url = config.team_members[0][targetUser];

        var result = "UPDATE: "+emailAddress +" changed status of task- <" + browseIssueURL + key+"|"+key+">";

        if(url!= undefined && emailAddress != JSON.parse(body).fields.assignee.emailAddress){
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
        var method = "POST";
        var postData = myJSON;
        var async = true;

        request.open(method, url, async);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(postData);
      }
    }
}
