# DESIGN 

## Problem Statement 

Issue tracking and duplication has always been an obstruction in the productivity of software development teams. Most of the team members having worked for a couple of years at corporates have experienced this problem and are coming together to bring a one stop solution to it. Our bot – ‘Master-Bot’ is an intelligent tracker and issue creator which knows when an issue is a duplicate of other instance. It also provides suggestions about whom to assign an issue currently being created based on the history of bugs raised. 

 A developer can encounter multiple bugs with similar steps to reproduce and consequently a similar root cause. Having a bot who can track somewhat similar bugs possesses an amazing power to avoid duplication and also boost productivity by avoiding parallel investigations by multiple teams. This also helps a non-technical person raise and assign bugs to the appropriate team without any debugging required. Master-bot is an initiative aimed to boost the output of teams through its intelligence and automation.

Dependency among two or more team members is another issue that software engineers face. When one member progresses on a particular user story and other members are concerned about it, there can be wastage of time if the status is not communicated immediately. Scrum call or email is useful here but it takes time to give update. A better approach would be to notify about the progress immediately to all the team members who are assigned sub tasks of the user story. Otherwise, completion of all sub tasks of a user story may take longer time due to gap in communication. 

## Bot Description 
Our bot creates tasks on JIRA and assigns them to team members based upon suggestions from JIRA. User needs to provide the task description to the bot and JIRA provides the list of users who have worked on similar issues using the history of previous tasks. The bot can then create a task on JIRA based on the selection from the users list. This bot is a good solution to simplify the process of assigning the tasks by providing the right suggestions for whom to assign the task. It ensures that the task gets assigned to a person who has already worked on similar tasks and expedite the development of new task. Our bot also notifies the team members whenever the state of a task changes on JIRA(In Progress, Done etc.) which is useful when different team members are working on subtasks within a task and their tasks have dependency on each other. 

Our bot fits in the category of Chatbot as the user provides the description of task to create and bot replies with the users list, then user selects from the list and bot creates task on JIRA.
Hence, our bot includes conversation with the user as well as it triggers notification to team members whenever task state changes.

## Use Cases 
1. Use Case 1:
    Preconditions: Project must be using Jira for tracking issues
 
    Main Flow: [S1] Developer will provide a description of the bug to our bot. [S2] Bot will return links of Jira issues similar to the description we have provided. [S3] User will go through them and decide which one is relevant and provide the assignee name to the bot. [S4] Bot creates Jira issue with given description and assignee name and returns the Jira no. 

    Sub flows:
    [S1] User provides description with @description
    [S2] Bot will return links of issues similar to the one described.
    [S3] User will decide who the assignee for the new issue should be based on the provided list.
    [S4] User will provide assignee with @assignee
    [S5] Bot creates the bug on Jira and returns Jira number

    Alternate flows:
    [E1] No similar issues found. In this case, bot will inform the developer accordingly. 
    
2. Use Case 2:
 
    Preconditions: Project must be using Jira for tacking issues. Project must have a separate channel in slack for status updates.

    Main: [S1] Developer changes the status of an issue from “Dev in Progress” to “Dev Completed”. [S2] Bot receives notification from Jira about this event. [S3] Bot post a message about this on the status channel in Slack. 
    
## Design Sketches 
   * Wireframe of bot in action
      ![alt text](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Images/Wireframe1.png) 
      
   * Wireframe bot in action
      ![alt text](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Images/Wireframe2.png) 
      
   * StoryBoard of primary task that a user undergoes with bot 
       ![alt text](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Images/StoryBoard.jpeg) 
    
## Architecture Design 
 * Diagram illustrating the components of the bot
  ![alt text](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Images/Architecture.png)  
  
 * Architecture components in text 
   
 
 * Constraints 
   1. The bot will be embedded in Slack. So developers using slack can add this bot to their channel.
   2. User should specify the project ID, summary of the issue and issue type as asked by bot. This information is required for                        the bot to provide suggestions for similar issues. 
   3. When a team member changes the status of a task, not all members of that team are notified. Instead, all team members who are assigned the sub-tasks are notified about the status. 
   4. Team members should be using JIRA.

 * Additional Design patterns 
 
    Currently,  we identify the following design pattern in our project:
      Observer - users are notified about the status change of tasks on JIRA

