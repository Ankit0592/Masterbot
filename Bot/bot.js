var service = require('../service/api/controllers/botController.js');
var ajax = require('request');
var Botkit = require('botkit');
var mockData = require('./mock.json');
var issueButton = require('./Issue.json');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var nock = require('nock');
var request = new XMLHttpRequest();
var issue_id = 0;
var express = require('express');
var bodyParser = require('body-parser')
var app = express()
var urlencodedParser = bodyParser.urlencoded({ extended: false })


var controller = Botkit.slackbot({
  interactive_replies: true,
  debug: false
});
/*
.configureSlackApp({
  clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    scopes: ['bot'],
    //Bot AppID
});
*/
/*
controller.setupWebserver(process.env.port,function(err,webserver) {
  controller.createWebhookEndpoints(controller.webserver);

  controller.createOauthEndpoints(controller.webserver,function(err,req,res) {
    if (err) {
      res.status(500).send('ERROR: ' + err);
    } else {
      res.send('Success!');
    }
  });
});
*/
app.post('/slackactions', urlencodedParser, (req, res) =>{
  console.log('hinata');
    res.status(200).end() // best practice to respond with 200 status
    var actionJSONPayload = JSON.parse(req.body.payload) // parse URL-encoded payload JSON string
    /*var message = {
        "text": actionJSONPayload.user.name+" clicked: "+actionJSONPayload.actions[0].name,
        "replace_original": false
    }*/
    //sendMessageToSlackResponseURL(actionJSONPayload.response_url, message)
    console.log(actionJSONPayload);
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

controller.on('interactive_message_callback', function(bot, message) {
    console.log("Please come here");
    bot.replyInteractive(message,'Please come here');
   //var ids = message.callback_id.split(/\-/);
    //var user_id = ids[0];
    //var item_id = ids[1];
    ///bot.reply(message,'Please come here');
});

// start conversation for use case-1
function createIssue(title,bot,message) {
	bot.createConversation(message,function(err,convo) {

    // conversation thread for user summary
    convo.addQuestion('Please provide summary',function(response,convo) {
    var issueType = convo.vars.Type;
       //convo.say('The summary is: ' + response.text + ' and the issue is {{vars.Type}}');
     var callback = function(arrayOfNames){
        var button = {
          text: 'ok, I found these issues similar to one you are creating. Click on create against most relevant issue: ',
          attachments: [
              {
                  text: "Click the most relevant user",
                  color: "#3AA3E3",
                  callback_id: 'C12',
                  attachment_type: "default",
                  actions: [],
              }
          ],

        }
        if(arrayOfNames.length == 0){
        bot.reply(message, 'No user has worked on similar issues');
        }
        // displaying buttons in bot UI
        else{
        for (var i = 0; i < arrayOfNames.length; i++) {
          button.attachments[0].actions.push(
          {
            "name": arrayOfNames[i],
            "text": arrayOfNames[i],
            "type": "button",
            "value": issueType
          })
        }

        bot.reply(message, button);
  }
        convo.next();

      }

getLikelyUsers(response.text,bot,message,callback);

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


},{},'default');*/

    convo.activate();

  });


/*
  bot.startConversation(message,function(err,convo) {
    console.log("hiiC2");
    convo.addQuestion('Please provide summary',function(response,convo) {

      convo.say('ok, I found these issues similar to one you are creating. Click on create against most relevant issue');
      bot.reply(message, button);
      bot(message, button);

      convo.next();

    },{},'default');

  });
  */
  //var issues = findIssue(title,bot);

      //var issues = findIssue(title,bot);

}

//var hasReturned = false;

// fetch mock data for likely users in use case-1
////////////////////////////////////
/*function getLikelyUsers(summary,bot, message){
  console.log(summary);
  var options = {
  		url: 'http://localhost:3000/' + 'MAS-45',
		method: 'GET',
		headers: {
			"content-type": "application/json"
		}
	};
  ajax(options, function (error, response, body)
  {
    console.log('in ajax');
    returnUsers(body,bot,message);
    });
//    return JSON.parse(result);
while(true){

}
//console.log('How did i get here?');
};

function returnUsers(body,bot,message){
  console.log('body');
  return [ "Issue 5143: amedhek", "Issue 5173: apshukla", "Issue 51: admin","Issue 7709: panand4","Issue 5000: sbiswas4" ];
}*/
//////////////////////////////////////////////////////////////////////////////////////
// Call Service
function getIssues(id,bot,message) {
  console.log(id);
	var options = {
  		//url: 'http://localhost:3000/' + id,
      url: 'http://localhost:3000/' + 'MAS-45',
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

function getLikelyUsers(summary,bot,message,callback) {
  //console.log(summary);
	var options = {
  		//url: 'http://localhost:3000/' + id,
      url: 'http://localhost:3000/summary',
		method: 'GET',
		headers: {
			"content-type": "application/json"
		},
    json: {
      "summary": summary
    }
	};

	// Send a http request to url and specify a callback that will be called upon its return.
  ajax(options, function (error, response, body)
  {
    //console.log('In ajax');
  //  mreturnnames(body,bot,message);
//  var data = JSON.parse(body).matching_issues;
  console.log(body);
  checknmes = ["Issue 5143: amedhek", "Issue 5173: apshukla", "Issue 51: admin","Issue 7709: panand4","Issue 5000: sbiswas4"];
  callback(checknmes);
    });
};





// fetch mock data for duplicate issues in use case-3
function mreturnnames(body,bot,message) {
//  console.log('inside mreturnnames');

	if(body){
    return ["Issue 5143: amedhek", "Issue 5173: apshukla", "Issue 51: admin","Issue 7709: panand4","Issue 5000: sbiswas4"];
	}
//  setTimeout( function(){
//    notifications(message, bot);
//  }, 2000 );
}

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
