
var Botkit = require('botkit');

var controller = Botkit.slackbot({
  debug: false
});

controller.spawn({
  token: process.env.SLACKTOKEN,
}).startRTM()

controller.hears('Greetings',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  console.log(message);
  bot.reply(message,"Hello");

});
