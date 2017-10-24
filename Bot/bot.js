
var Botkit = require('botkit');
var mockData = require('./mock.json');
//var button = require('./button.json');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var request = new XMLHttpRequest();
var issue_id = 0;

var controller = Botkit.slackbot({
  interactive_replies: true,
  debug: false
});
/*
.configureSlackApp({
  clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    scopes: ['bot'],
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
	  matchIssue(id,bot,message);
  }
  else if(command.toLowerCase() == 'update') { // Use Case-2... triggering using update command for now
    notifications(message, bot);
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
  //convo.say('The summary is: ' + response.text + ' and the issue is {{vars.Type}}');
      var arrayOfNames = getLikelyUsers(response.text);
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

      // displaying buttons in bot UI
      for (var i = 0; i < arrayOfNames.length; i++) {
        button.attachments[0].actions.push(
        {
          "name": arrayOfNames[i],
          "text": arrayOfNames[i],
          "type": "button",
          "value": arrayOfNames[i]
        })
      }

      bot.reply(message, button);

      convo.next();

    },{},'summary');

    convo.addMessage({
          text: 'Sorry I did not understand. Please come again',
          action: 'default',
      },'bad_response');

    convo.addMessage({
          text: 'Thanks for using me',

      },'Exit');

    convo.addQuestion('Please enter issue type?\n - Bug(B)\n - Task(T)\n -Exit(E)',[
      {
        pattern: 'E',
        callback: function(response,conv) {
          console.log("E");
          convo.gotoThread('Exit');
        }
      },
      {
        pattern: 'B',
        callback: function(response,conv) {
          // do something else...
          convo.setVar('Type','B');
          console.log("B");
          convo.gotoThread('summary');
        }
      },
      {
        pattern: 'T',
        callback: function(response,conv) {
          // do something else...
          convo.setVar('Type','T');
          console.log("T");
          convo.gotoThread('summary');
        }
      },
      {
        default: true,
        callback: function(response,conv) {
          // just repeat the question
          console.log("Defaubbblt");
          convo.gotoThread('bad_response');
        }
      }
    ],{},'default');

    convo.activate();

  });


/*
  bot.startConversation(message,function(err,convo) {
    console.log("hiiC2");
    convo.addQuestion('Please provide summary',function(response,convo) {

      convo.say('ok, I found these issues similar to one you are creating. Click on create against most relevant issue');
      bot.reply(message, button);

      convo.next();

    },{},'default');

  });
  */
  //var issues = findIssue(title,bot);

      //var issues = findIssue(title,bot);

}

// fetch mock data for likely users in use case-1
function getLikelyUsers(message){
  var arr3 = mockData["likely_users"];
  return arr3;
}

// fetch mock data for duplicate issues in use case-3
function matchIssue(id,bot,message) {
  var data = mockData["matching_issues"];
  var result = [];

  if(data == null || data.length == 0){
    bot.reply(message, "Cannot find any duplicate issues");
  }
  else{
    bot.reply(message, "Found following duplicate issues");
    var result = "";
    setTimeout( function(){
      for(var i =0; i<data.length; i++){
        result = result + data[i].self + "\n";
      }
      bot.reply(message, result);
    }, 1000 );

  }

  // setTimeout( function(){
  //   notifications(message, bot);
  // }, 2000 );
}

// Notifications for Use case-2
function notifications(message, bot){
  if(mockData["notification_users"] != null && mockData["notification_users"].length !=0){
    var url = mockData["notification_users"][Math.floor(Math.random()*mockData["notification_users"].length)].url;
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
