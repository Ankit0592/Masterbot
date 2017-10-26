# BOT MILESTONE

## Use Case Refinement 

#### Use Case 1: Issue creation and auto assign on Jira 
Preconditions: Bot must be able to access Jira API

Main:
User requests creation of a task on Jira [s1] and provide issue type and description of the issue to the bot [s2][s3]. Bot will return links of similar issues along with a create button against each issue [s4]. User can check them and click submit corresponding to the most relevant issue [s5]. Bot creates the issue with provided description and assigns to a team member who worked on that selected relevant similar issue.  Bot also provides a create button if user cannot find any relevant similar issue. If user clicks on this create button, new isse is created and not assigned to anyone at this point (can be assigned later). 

Sub flows:
[S1] User enters ‘Create {project id}’ to the bot. </br>
[S2] Bot requests user to enter issue type and user provides the same. </br>
[S3] Bot asks for description of issue and user enters the text. </br>
[S4] Bot gives list of similar issues along with the name of team member who worked on it and a "Create" button against each similar issue. </br>
[S5] User go through those issues and after finding out the most relevant one, clicks on corresponding 'Create' button. </br>
[S6] Bot creates the issue with provided description on Jira and assigns it to a team member who worked on the similar issue (from S5, the most relevant similar issue as per the user who created this issue). </br>
[s7] Bot acknowledges the successful creation of issue.

Alternate flows:
[E1] No similar issues found. Bot provides an option saying "Click Create if most releavant similar issue does not exists" along with a create button. User can click on this create button for issue creation and assign it someone later. </br>
[E2] User does not click on create button for creation of an issue. In this case bot conversation terminates. </br>
[E3] User wants to assign the issue to some other developer (other than the ones suggested by bot). In this case the issue can be created without any assignee. </br>

#### Use Case 2: Notify relevant team members about Status change of an issue. 
This use case demonstrates how this bot can notify relevant team members about status changes on the tasks they are working on. This is useful when there's a dependency on team member working. Simply updating the team immediately is useful in many situations.

Preconditions: JIRA is configured to push update to BOT service.

Main:
Whenever a team member changes the status of an issue, all other team members working on the same will be notfied of the change on slack by this bot.
[S1] Developer changes the status of an issue from “In Progress” to “Completed”. </br>
[S2] Bot receives notification from Jira about this event. </br>
[S3] Bot sends message about this to relevant team members on Slack. </br>

Sub flows:
[S1] A developer named Foo changes the status of an issue from “In Progress” to “Completed”. </br>
[S2] Bot sends notification to other team members who are working on the same as: UPDATE TEST-1234 has been marked as ‘Completed’ by Foo. </br>

#### Use Case 3:  Find duplicate issues of a given issue on Jira
Preconditions: Bot must be able to access Jira API

Main: User asks bot to provide duplicate issues of a given issue. Bot lists the duplicate issue number and url for the same. 

Sub flows:
[S1] User types "Duplicate {issue id}". </br>
[S2] Bot provides list of duplicate issues.</br>

Alternate flows:
[E1] No duplicate issue found.

## Mocking Service Component
We will be using JIRA APIs for our bot. In this milestone, we have mocked JIRA APIs using http mock service called **nock**. We have created a JSON file which is returning the data similar to what would be returned by the service to be created in next milestone. The JSON file consists of matching issues, notifications, users to whom notifications will be sent, and likely users to assign issues on JIRA. This mock data is fetched in bot.js file as required in the bot implementation.   

Code for mocking JIRA search Api used in our bot:      
```
var data=nock("https://jira.atlassian.com/rest/api/2")
  .get("/search?jql=project=123")
  .reply(200, mockData["likely_users"]);
```
        
Please find mock.json file here: [Link](./Bot/mock.json)    

## Bot Implementation        

**Bot Platform:**          
In this milestone we have implemented hooks into our platform(Slack) and have fully operational bot in Slack that responds to the commands in our platform like: a) create project_id b) duplicate issue_id c) Exit

**Bot Integration:**    
We have a basic conversation with our bot. If the bot does not understand the user, it specifies what commands, it can understand.      
        
Use Case-1:     
1. Following command starts a conversation with the bot: **create project_id**          
2. Bot replies with list of options about issue type: 1) Bug(B) 2) Task(T) 3) Exit(E)   
3. User types: "B"
4. Bot asks for summary for the issue   
5. User provides summary        
6. Bot returns list of users who have worked on similar issue in the form of interactive buttons in slack app.    
7. Clicking on button assigns issue to appropriate user.        

Use Case-2:     
1. Notification is sent directly to user using webhooks in slack app.  
2. If the user does not exist on slack app, it send notification in channel that "Invalid user has been assigned a task"
        
Use Case-3:     
1. User enters command: "duplicate issue_id"    
2. Bot replies with links of issues which are duplicates else replies "No Duplicates found".

**Facilitating use of buttons:**
We are making use of slack's interactive messaging feature for implementing the buttons that we use for the first test case. This requires us to provide a end point where slack sends a post message when we claick on any button. This end point has been implemented using the Lambda function on Amazon AWS
```
exports.handler = (event, context, callback) => {
    payload = decodeURIComponent(event.body);
    json = payload.substring(8);
    json_obj = JSON.parse(json);
    names = json_obj.actions[0].name.split("+");
   callback(null, { statusCode: 200, body:"Issue created and successfully assigned to : " + names[2] });
};

```
     
## Selenium Testing   
Selenium test cases for each of the use-case can be found at [link](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Selenium/src/test/java/selenium/tests/WebTest.java)
    
#### Use Case 1   
Happy Path: Users who have worked on similar issues found in Jira   
Alternate Path: No user who has worked on a similar issue is found
    
#### Use Case 2   
Happy Path: Notification is sent directly to the member who has to work next on the issue after first person changes status.    
Alternate Path: If the user does not exist in the slack team, notification should not be sent.  
    
#### Use Case 3   
Happy Path: Duplicate issues found similar to the current issue    
Alternate Path: Duplicate issues are not found    
    
## Task Tracking 
[Work Sheet](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/WORKSHEET.md)

## Steps to run Selenium Tests on our code:
1) Clone the Repo.
2) Go inside Bot folder and run 'npm install'
3) Once this is done Run 'node bot.js' to start the bot
4) Import the selenium folder as maven project into Eclipse Workspace.
5) We need an external jar to be added into the build path. For this follow the steps: a) Right click on the Project, click on
Properties, then go to Java Build Path b) Remove the json-simple-1.1.1.jar which is added by default. c) Download the same jar from
our Repo main page. d) Now place this jar in a location on our system and add it as a external JAR to your build path using the Add
External JARs option.
6) You are now ready to run Selenium Tests.

## Screencast

