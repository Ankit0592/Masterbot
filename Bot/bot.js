
var Botkit = require('botkit');
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
  console.log("yoyo"+message);
  var command = msg.split(' ')[0];
  var id = msg.split(' ')[1]
  if(command == '$create' && id) {
	  createIssue(id,bot,message);
	  console.log("honey"+message);
  } else if(command == '$create' && id) {
	  matchIssue(id,bot,message);
  } else {
	    bot.reply(message,'Hi, I understand the following commands \n - $create [Issue_Title]\n - $match [Issue_ID]');
  }
});

function createIssue(title,bot,message) {
	bot.startConversation(message,function(err,convo) {
		console.log("singh"+message);
    convo.addQuestion('Please enter issue type?\n - Bug(B)\n - Task(T)\n -Exit(E)',[
      {
        pattern: 'E',
        callback: function(response,convo) {
          convo.say('OK you are done!');
          convo.next();
        }
      },
      {
        pattern: 'B',
        callback: function(response,convo) {
          convo.say('Great! I will take this as a bug');
          // do something else...
          convo.next();

        }
      },
      {
        pattern: 'T',
        callback: function(response,convo) {
          convo.say('Okay, so you are facing an issue.');
          // do something else...
          convo.next();
        }
      },
      {
        default: true,
        callback: function(response,convo) {
          // just repeat the question
          convo.repeat();
          convo.next();
        }
      }
    ],{},'default');

  })

  
  	bot.startConversation(message,function(err,convo) {
    convo.addQuestion('Please enter summary (at least 50 words)',[
      {
        pattern: 'E',
        callback: function(response,convo) {
    		if(response.text.length > 50) {
              convo.say('The summary has been recorded!');
		    } else {
			  convo.repeat();
	    	}
		    convo.next();
        }
      }
    ],{},'default');

  })
  

  bot.startConversation(message,function(err,convo) {

    convo.addQuestion('Please provide summary',function(response,convo) {

      convo.say('Cool, you said: ' + response.text);
      convo.next();

    },{},'default');	
	
  })
	var issues = findIssue(title,bot);
}

function matchIssue(id,bot,message) {
	var issues = findIssue(id,bot);
}

function findIssue(id,bot) {
	bot.reply("finding isues");
}
