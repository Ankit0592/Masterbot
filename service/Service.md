#### Task Tracking : [WORKSHEET2.md](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/service/WORKSHEET.md)<br>

#### Screencasts:
[Use case-1](URL)<br>
[Use case-2](URL)<br>
[Use case-3](URL) <br>

[Code](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/tree/master/service) </br>

'Master-Bot' provides suggestions, creates issues on JIRA, and assigns them to team members depending on input from the user. It also notifies the team members whenever the state of a task changes on JIRA(In Progress, Completed etc.) which is useful when different team members are working on subtasks within a task and their tasks have dependency on each other. 

#### Use Cases
## Use Case 1: Issue creation and auto assign on Jira 
Preconditions: Bot must be able to access Jira API

We are making use of slack's interactive messaging feature for implementing the buttons that we use for the first test case. This requires us to provide a end point where slack sends a post message when we claick on any button. This end point has been implemented using the Lambda function on Amazon AWS

#### Use Case 2: Notify relevant team members about Status change of an issue. 
Preconditions: JIRA is configured to push update to BOT service.
