var service = require('../service/api/controllers/botController.js');
var ajax = require('request');
var Botkit = require('botkit');
var mockData = require('./mock.json');
//var issueButton = require('./Issue.json');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var nock = require('nock');
var request = new XMLHttpRequest();
var issue_id = 0;
var express = require('express');
var bodyParser = require('body-parser')
var app = express()
var urlencodedParser = bodyParser.urlencoded({ extended: false })


var controller = Botkit.slackbot({
  debug: false,
});

controller.spawn({
  token: process.env.SLACKTOKEN,
}).startRTM();

controller.on(['direct_mention','direct_message'],function(bot,message) {
  // reply to _message_ by using the _bot_ object
  var msg = message.text;
  var command = msg.split(' ')[0];
  var id = msg.split(' ')[1];


  if(command.toLowerCase() == 'create' && id) { // Use Case-1
	  createIssue(id,bot,message);
  }
  else if(command.toLowerCase() == 'duplicate' && id) {// Use Case-3
	  getIssues(id,bot,message);
  }
  else {
	    bot.reply(message,'Hi, I understand following commands: \n Type Create [Project Id] for creating issue\n Type Duplicate [Issue-ID] for finding duplicates of this issue');
  }
});


// start conversation for use case-1
function createIssue(title,bot,message) {
	bot.createConversation(message,function(err,convo) {

    // conversation thread for user summary
    convo.addQuestion('Please provide summary',function(response,convo) {
    var issueType = convo.vars.Type;
       //convo.say('The summary is: ' + response.text + ' and the issue is {{vars.Type}}');
     var callback = function(arrayOfNames, labels){
        if(arrayOfNames.length == 0){
          console.log(issueType);
          console.log(response.text);
          console.log(labels);
          var button = {
            text: 'No user has worked on similar issues. Create issue anyway?',
            attachments: [
                {
                    text: "Click on relevant option",
                    color: "#3AA3E3",
                    callback_id: 'C_no_user',
                    attachment_type: "default",
                    actions: [],
                }
            ],

          };
          button.attachments[0].actions.push(
          {
            "name": 'Create',
            "text": 'Create',
            "type": "button",
            //"value": [issueType, response.text, labels]
            "value": issueType + ":"+response.text + ":"+ labels + ":" + title

          });
          button.attachments[0].actions.push(
          {
            "name": 'Exit',
            "text": 'Exit',
            "type": "button",
            "value": []
          });
      //  bot.reply(message, 'No user has worked on similar issues. Create issue any way?');
          bot.reply(message, button);
          //console.log('did i come here?');
        }
        // displaying buttons in bot UI
        else{
          var button = {
            text: 'ok, I found these issues similar to one you are creating. Click on create against most relevant issue: ',
            attachments: [
                {
                    text: "Click the most relevant user",
                    color: "#3AA3E3",
                    callback_id: 'C_user_select',
                    attachment_type: "default",
                    actions: [],
                }
            ],

          };
        for (var i = 0; i < arrayOfNames.length; i++) {
          button.attachments[0].actions.push(
          {
            "name": arrayOfNames[i],
            "text": arrayOfNames[i],
            "type": "button",
            "value": issueType + ":"+response.text + ":"+ labels + ":" + title
          });
        }
         //console.log('bfr new?');
        button.attachments[0].actions.push(
        {
          "name": 'Exit',
          "text": 'Exit',
          "type": "button",
          "value": 'null'
        });
       //console.log('afr new?');
        bot.reply(message, button);
      //  console.log('did i come here?');
  }
        convo.next();

      }

     getLikelyUsers(response.text,title,bot,message,callback);

    },{},'summary');

    convo.addMessage({
          text: 'Sorry I did not understand. Please come again',
          action: 'default',
      },'bad_response');

    convo.addMessage({
          text: 'Thanks for talking to me',

      },'Exit');

    convo.addQuestion('Please enter issue type? 1 Bug 2 Task 3 Exit',[
      {
        pattern: '3',
        callback: function(response,conv) {
          convo.gotoThread('Exit');
        }
      },
      {
        pattern: '1',
        callback: function(response,conv) {
          // do something else...
          convo.setVar('Type','Bug');
          convo.gotoThread('summary');
        }
      },
      {
        pattern: '2',
        callback: function(response,conv) {
          // do something else...
          convo.setVar('Type','Task');
          convo.gotoThread('summary');
        }
      },
      {
        default: true,
        callback: function(response,conv) {
          // just repeat the question
          convo.gotoThread('bad_response');
        }
      }
    ],{},'default');

/*convo.addQuestion(issueButton,function(response,convo){

 console.log('Look where I am');

setTimeout( function(){
  //bot.reply(message, result);
  convo.gotoThread('summary');
}, 1000 );

},{},'default');*/

  /*  convo.addMessage(issueButton,function(convo){

     //console.log('Look where I am');
    convo.gotoThread('summary');

  },{},'default');*/
    convo.activate();
//    convo.gotoThread('summary');

  });
}

// Call Service
function getIssues(id,bot,message) {
  //console.log(id);
	var options = {
  		//url: 'http://localhost:3000/' + id,
      url: 'http://ec2-13-58-43-95.us-east-2.compute.amazonaws.com:80/' + id,
		method: 'GET',
		headers: {
			"content-type": "application/json"
		}
	};
	// Send a http request to url and specify a callback that will be called upon its return.
	ajax(options, function (error, response, body)
	{
		matchIssue(body,bot,message);
    });
};

// fetch mock data for duplicate issues in use case-3
function matchIssue(body,bot,message) {
	if(body){
		var data = JSON.parse(body).matching_issues;
		if(data == undefined || data.length == 0){
			bot.reply(message, "Cannot find any duplicate issues");
		} else {
			var result = '';
			for(var i = 0; i < data.length; ++i) {
				result += data[i] + '\n';
			}
			bot.reply(message, "Found following duplicate issues:");
			setTimeout( function(){
				bot.reply(message, result);
			}, 1000 );
		}
	}
//  setTimeout( function(){
//    notifications(message, bot);
//  }, 2000 );
}

function getLikelyUsers(summary,project_id,bot,message,callback) {
  //console.log(summary);
	var options = {
  		//url: 'http://localhost:3000/' + id,
      url: 'http://ec2-13-58-43-95.us-east-2.compute.amazonaws.com:80/summary',
		method: 'GET',
		headers: {
			"content-type": "application/json"
		},
    json: {
      "summary": summary,
      "project_id": project_id
    }
	};

	// Send a http request to url and specify a callback that will be called upon its return.
  ajax(options, function (error, response, body)
  {
  //var data = JSON.parse(body).user_issues;
  var data = body.user_issues;
      //console.log(data);
      callback(data[0],data[1]);
    });
};


// Notifications for Use case-2
function notifications(message, bot){
  var mocked=nock("https://jira.atlassian.com/rest/api/2")
  .post("/issue/123/notify")
  .reply(200, mockData["notification_users"]);

  var data = JSON.parse(mocked.interceptors[0].body);
  if(data != null && data.length !=0){
    var url = data[Math.floor(Math.random()*data.length)].url;
    var method = "POST";
    var postData = mockData["notifications"][Math.floor(Math.random()*mockData["notifications"].length)];
    var async = true;


    request.onload = function () {

      var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
      if(status == 404)
        bot.reply(message, "Invalid user has been assigned a task");
    }
    request.open(method, url, async);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(postData));
  }
}
