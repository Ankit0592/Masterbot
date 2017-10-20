
var Botkit = require('botkit');
var mockData = require('./mock.json');
var button = require('./button.json');
var issue_id = 0;

var controller = Botkit.slackbot({
  debug: false
});

controller.spawn({
  token: process.env.SLACKTOKEN,
}).startRTM();

controller.on(['direct_mention','direct_message'],function(bot,message) {
  // reply to _message_ by using the _bot_ object
  var msg = message.text;
  var command = msg.split(' ')[0];
  var id = msg.split(' ')[1]
  if(command.toLowerCase() == 'create' && id) {
    console.log("hii");
	  createIssue(id,bot,message);
  } else if(command.toLowerCase() == 'duplicate' && id) {
	  findDuplicateIssue(id,bot,message);
  } else {
	    bot.reply(message,'Hi, I understand following commands: \n Type Create [Project Id] for creating issue\n Type Duplicate [Issue-ID] for finding duplicates of this issue');
  }
});

function createIssue(title,bot,message) {
	bot.createConversation(message,function(err,convo) {
    console.log("hiiC1");

    convo.addQuestion('Please provide summary',function(response,convo) {

      convo.say('ok, I found these issues similar to one you are creating. Click on create against most relevant issue');
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
          console.log("B");
          convo.gotoThread('summary');
        }
      },
      {
        pattern: 'T',
        callback: function(response,conv) {
          // do something else...
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


function findDuplicateIssue(id,bot,message) {
  bot.reply(message,"finding isues");
}

function matchIssue(id,bot,message) {
  var data = mockData["matching_issues"];
  var result = [];
  if(data == null || data.length == 0){
    bot.reply(message, "Cannot find any duplicate issues");
  }
  else{
    bot.reply(message, "Found following issues");
    setTimeout( function(){
      for(var i =0; i<data.length; i++){
        bot.reply(message, data[i].self);
      }
    }, 1000 );
  }
}
