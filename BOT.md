﻿# BOT MILESTONE

## Use Case Refinement 

#### Use Case 1: Issue creation and auto assign on Jira 
Preconditions: Bot must be able to access Jira API

Main:
User requests creation of a task on Jira [s1] and provide issue type and description of the issue to the bot [s2][s3]. Bot will return links of similar issues along with a create button against each issue [s4]. User can check them and click submit corresponding to the most relevant issue [s5]. Bot creates the issue with provided description and assigns to a team member who worked on that selected relevant similar issue.  Bot also provides a create button if user cannot find any relevant similar issue. If user clicks on this create button, new isse is created and not assigned to anyone at this point (can be assigned later). 

Sub flows:
[S1] User enters ‘Create {project id}’ to the bot.

[S2] Bot requests user to enter issue type and user provides the same.

[S3] Bot asks for description of issue and user enters the text.

[S4] Bot gives list of similar issues along with the name of team member who worked on it and a "Create" button against each similar issue.

[S5] User go through those issues and after finding out the most relevant one, clicks on corresponding 'Create' button.

[S6] Bot creates the issue with provided description on Jira and assigns it to a team member who worked on the similar issue (from S5, the most relevant similar issue as per the user who created this issue).

[s7] Bot acknowledges the successful creation of issue.

Alternate flows:
[E1] No similar issues found. Bot provides an option saying "Click Create if most releavant similar issue does not exists" along with a create button. User can click on this create button for issue creation and assign it someone later.

[E2] User does not click on create button for creation of an issue. In this case bot conversation terminates.

[E3] User wants to assign the issue to some other developer (other than the ones suggested by bot). In this case the issue can be created without any assignee.

#### Use Case 2: Notify relevant team members about Status change of an issue. 
This use case demonstrates how this bot can notify relevant team members about status changes on the tasks they are working on. This is useful when there's a dependency on team member working. Simply updating the team immediately is useful in many situations.

Preconditions: JIRA is configured to push update to BOT service.

Main:
Whenever a team member changes the status of an issue, all other team members working on the same will be notfied of the change on slack by this bot.
[S1] Developer changes the status of an issue from “In Progress” to “Completed”.

[S2] Bot receives notification from Jira about this event.

[S3] Bot sends message about this to relevant team members on Slack.

Sub flows:
[S1] A developer named Foo changes the status of an issue from “In Progress” to “Completed”.

[S2] Bot sends notification to other team members who are working on the same as: UPDATE TEST-1234 has been marked as ‘Completed’ by Foo.

#### Use Case 3:  Find duplicate issues of a given issue on Jira
Preconditions: Bot must be able to access Jira API

Main: User asks bot to provide duplicate issues of a given issue. Bot lists the duplicate issue number and url for the same. 

Sub flows:
[S1] User types "Duplicate {issue id}". 

[S2] Bot provides list of duplicate issues.

Alternate flows:
[E1] No duplicate issue found.

## Mocking Service Component

## Bot Platform
    
## Bot Integration
     
## Selenium Testing 

#### Use Case 1

#### Use Case 2

#### Use Case 3
 
## Task Tracking 
[Work Sheet](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/WORKSHEET.md)

## Screencast
