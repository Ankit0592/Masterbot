
var Botkit = require('botkit');
var issue_id = 0;

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

controller.hears('create',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  project_id = message.text.split(' ');

  // var issue0 = nock("https://jira.atlassian.com")
  // .post("/rest/api/2/issue")
  // .reply(200, JSON.stringify({
  //   "id": ++issue_id,
  //   "key": "TST-24",
  //   "self": "http://www.example.com/jira/rest/api/2/issue/"+issue_id
  // }) );

  var data = createIssueMock();

  bot.reply(message,"Successfully created issue and issue id is: "+data.id);
});


function createIssueMock(){
  return {
    "id": ++issue_id,
    "key": "TST-24",
    "self": "http://www.example.com/jira/rest/api/2/issue/"+issue_id
  }
}
