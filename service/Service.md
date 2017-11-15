
## Code
[Code for service](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/tree/master/service) </br>
[Code for bot](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Bot/bot.js)</br>

## Use Cases
#### Use Case 1: Issue creation and auto assign on Jira

Preconditions: Bot must be able to access Jira API</br>

Main: User requests creation of a task on Jira [s1] and provide issue type and description of the issue to the bot [s2][s3]. </br> 
Bot will return links of similar issues along with a create button against each issue [s4]. </br>
User can check them and click submit corresponding to the most relevant issue [s5]. </br>

Bot creates the issue with provided description and assigns to a team member who worked on that selected relevant similar issue. Bot also provides a create button if user cannot find any relevant similar issue. If user clicks on this create button, new isse is created and not assigned to anyone at this point (can be assigned later). </br>

Sub flows: [S1] User enters ‘Create {project id}’ to the bot. </br>
           [S2] Bot requests user to enter issue type and user provides the same. </br>
           [S3] Bot asks for description of issue and user enters the text. </br>
           [S4] Bot gives list of similar issues along with the name of team member who worked on it and a "Create" button against each similar issue. </br>
           [S5] User go through those issues and after finding out the most relevant one, clicks on corresponding 'Create' button. </br>
           [S6] Bot creates the issue with provided description on Jira and assigns it to a team member who worked on the similar issue (from S5, the most relevant similar issue as per the user who created this issue). </br>
           [s7] Bot acknowledges the successful creation of issue. </br>

Alternate flows: [E1] No similar issues found. Bot provides an option saying "Click Create if most releavant similar issue does not exists" along with a create button. User can click on this create button for issue creation and assign it someone later. </br>
[E2] User does not click on create button for creation of an issue. In this case bot conversation terminates. </br>
[E3] User wants to assign the issue to some other developer (other than the ones suggested by bot). In this case the issue can be created without any assignee. 

#### Use Case 2: Notify relevant team members about Status change of an issue.
This use case demonstrates how this bot can notify relevant team members about status changes on the tasks they are working on. This is useful when there's a dependency on team member working. Simply updating the team immediately is useful in many situations. </br>

Preconditions: JIRA is configured to push update to BOT service. </br>
Main: Whenever a team member changes the status of an issue, all other team members working on the same will be notfied of the change on slack by this bot. [S1] Developer changes the status of an issue from “In Progress” to “Completed”. </br>
                   [S2] Bot receives notification from Jira about this event. </br>
                   [S3] Bot sends message about this to relevant team members on Slack. </br>

Sub flows: [S1] A developer named Foo changes the status of an issue from “In Progress” to “Completed”. </br>
           [S2] Bot sends notification to other team members who are working on the same as: UPDATE TEST-1234 has been marked as ‘Completed’ by Foo. </br>

#### Use Case 3: Find duplicate issues of a given issue on Jira
Preconditions: Bot must be able to access Jira API </br>
Main: User asks bot to provide duplicate issues of a given issue. Bot lists the duplicate issue number and url for the same.
Sub flows: [S1] User types "Duplicate {issue id}". 
            [S2] Bot provides list of duplicate issues.
Alternate flows: [E1] No duplicate issue found. </br>

## Implementation Architecture: 
![Image](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Images/Arch.png)       
           
#### Use Case 2 Implementation:  
For Notifications, we are using Webhooks on JIRA and Slack. When user modifies the status of a task on JIRA(To Do, In Progress, Done), webhook on JIRA sends subtasks associated with the task to express server. The server then notifies all the users associated with the subtasks about the status updates.        
           
## Task Tracking : [WORKSHEET2.md](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/service/WORKSHEET.md)<br>

## Screencast:
[See Screencast](URL)<br>




