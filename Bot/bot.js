
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
	bot.startConversation(message,function(err,convo) {
    convo.addQuestion('Please enter issue type?\n - Bug(B)\n - Task(T)\n -Exit(E)',[
      {
        pattern: 'E',
        callback: function(response,conv) {
          convo.next();
        }
      },
      {
        pattern: 'B',
        callback: function(response,conv) {
          // do something else...
          convo.next();

        }
      },
      {
        pattern: 'T',
        callback: function(response,conv) {
          // do something else...
          convo.next();
        }
      },
      {
        default: true,
        callback: function(response,conv) {
          // just repeat the question
          conv.repeat();
          conv.next();
        }
      }
    ],{},'default');
    

  })

  
  bot.startConversation(message,function(err,convo) {

    convo.addQuestion('Please provide summary',function(response,convo) {

      convo.say('ok, I found these issues similar to one you are creating. Click on create against most relevant issue');
      bot.reply(message, button);
      
      convo.next();

    },{},'default');	
	
  })
  //var issues = findIssue(title,bot);
  bot.startConversation(message,function(err,convo) {
    
        convo.addQuestion('Please provide summary',function(response,convo) {
    
          convo.say('ok, I found these issues similar to one you are creating:\n issue 1');
          convo.next();
    
        },{},'default');	
      
      })
      //var issues = findIssue(title,bot);
    
}




function findDuplicateIssue(id,bot,message) {
  bot.reply("finding isues");
  
}


