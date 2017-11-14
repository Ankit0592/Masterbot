#### Task Tracking : [WORKSHEET2.md](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/service/WORKSHEET.md)<br>

#### Screencasts:
[Use case-1](URL)<br>
[Use case-2](URL)<br>
[Use case-3](URL) <br>

[Code repo for service](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/tree/master/service) </br>

'Master-Bot' provides suggestions, creates issues on JIRA, and assigns them to team members depending on input from the user. It also notifies the team members whenever the state of a task changes on JIRA(In Progress, Completed etc.) which is useful when different team members are working on subtasks within a task and their tasks have dependency on each other. 

#### Use Cases
#### Use Case 1: Issue creation and auto assign on Jira 
Preconditions: Bot must be able to access Jira API

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

We are making use of slack's interactive messaging feature for implementing the buttons that we use for the first test case. This requires us to provide a end point where slack sends a post message when we claick on any button. This end point has been implemented using the Lambda function on Amazon AWS

#### Use Case 2: Notify relevant team members about Status change of an issue. 
Preconditions: JIRA is configured to push update to BOT service.

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

