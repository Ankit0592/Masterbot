# DESIGN 

## Problem Statement 

Facing similar issues has always been an obstruction in the productivity of software development teams. A developer can encounter multiple bugs with similar steps to reproduce and consequently a similar root cause. Automating the process of finding similar bugs possesses can help in avoiding duplication and boost productivity by avoiding parallel investigations by multiple teams. Some suggestions about whom to assign an issue currently being created based on the history of bugs raised can save time. 
 
Dependency among two or more team members is another issue that software engineers face. When one member progresses on a particular user story and other members are concerned about it, there can be wastage of time if the status is not communicated immediately. Scrum call or email is useful here but it may take time to give update. A better approach would be to notify about the progress immediately to all the team members who are assigned sub tasks of the user story. Otherwise, completion of all sub tasks of a user story may take longer time due to gap in communication. 

## Bot Description 
Our bot 'Master-Bot' creates tasks on JIRA and assigns them to team members based upon suggestions from JIRA. User needs to provide the task summary to the bot and JIRA provides the list of users who have worked on similar issues using the history of previous tasks. The bot can then create a task on JIRA based on the selection from the users list. This bot is a good solution to simplify the process of assigning the tasks by providing the right suggestions for whom to assign the task. It ensures that the task gets assigned to a person who has already worked on similar tasks and expedite the development of new task. Master-bot is an initiative aimed to boost the productivity of teams.

This bot also notifies the team members whenever the state of a task changes on JIRA(In Progress, Done etc.) which is useful when different team members are working on subtasks within a task and their tasks have dependency on each other. 

Our bot belongs the category of Chatbot as the user provides the description of task to create and bot replies with the users list, then bot creates task on JIRA and assign task to appropriate team member.
Also, bot triggers notification to team members whenever task state changes (when event occurs).

## Use Cases 
1. Use Case 1: Issue creation on Jira (This use case demonstrates how our bot helps in selecting an appropriate assignee for a particular issue if an issue similar to this already exists Jira)
 
   Preconditions: None

   Main:<br>[S1] Developer will provide a description of the bug to our bot.<br>[S2] Bot will return links of Jira issues similar to the description we have provided.<br>[S3] User will go through them and decide which one is relevant and provide the suggestion number to the bot.<br>[S4] Bot creates Jira issue with given description and assignee name. 

   Sub flows:<br>
   [S1] User types ‘Help’ to the bot.<br>
   [S2] Bot will provide its possible functionalities 1) $create {project_id} 2) match {issue_id}.<br>
   [S3] User types $create TEST.<br>
   [S4] Bot asks whether it is a Bug(B) or Task(T)<br>
   [S5] User replies with B.<br>
   [S6] Bot asks user for summary.<br>
   [S7] User provides summary ‘Sample summary 1’.<br>
   [S8] Bot provides a list of relevant issues and asks if user wants to continue with the issue creation.<br>
   [S9] The user types Y.<br>
   [S10] Bot asks which issue to choose assignee from or whether the user wants to specify the assignee manually on Jira.<br>
   [S11] The user provides the relevant issue number.<br>
   [S12] Bot creates a new issue on Jira with the required assignee and provides success message.<br>

   Alternate flows:<br>
   [E1] No similar issues found. In this case, bot will inform the developer accordingly.<br>
   [E2] User does not want to create a new bug. In this case bot conversation terminates.<br>
   [E3] User wants to assign the issue to some other developer (other than the ones suggested by bot). In this case the issue is created without any assignee.<br>
    
2. Use Case 2: Status change updates (This use case demonstrates how our bot can notify relevant team members about status changes on the tasks they are working on)
 
    Preconditions: None

    Main:<br> [S1] Developer changes the status of an issue from “Dev in Progress” to “Completed”.<br>[S2] Bot receives notification from Jira about this event.<br>[S3] Bot sends message about this to relevant team members on Slack.

    Sub flows:<br> (Sudipto and Pavneet are working on TEST-1234)<br>
    [S1] Sudipto changes the status of TEST-1234 from “Dev in Progress” to “Completed”.<br>
    [S2] Bot sends notification to both Sudipto and Pavneet: UPDATE TEST-1234 has been marked as ‘Completed’ by Sudipto. 
    
3. Use Case 3: Find similar issues from Jira
 
     Preconditions: None

     Main:<br> [S1] Developer provides an issue number to our bot.<br>[S2] Bot return issues similar to this one to the user.

     Sub flows:<br>
     [S1] User types ‘Help’ to the bot.<br>
     [S2] Bot will provide its possible functionalities 1) $create {project_id} 2) match {issue_id}.<br>
     [S3] User types $match TEST-3452.<br>
     [S4] Bot returns similar issues found on Jira.<br>

     Alternate flows:<br>
     [E1] No similar issues are found.

    
## Design Sketches 
   * Wireframe of bot in action
      ![alt text](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Images/Wireframe1.png) 
      
   * Wireframe bot in action
      ![alt text](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Images/Wireframe2.png) 
      
   * StoryBoard of primary task that a user undergoes with bot (Part1)
       ![alt text](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Images/StoryBoard1.jpeg) 
     Part 2 
       ![alt text](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Images/StoryBoard2.jpeg) 
    
## Architecture Design 
 * Diagram illustrating the components of the bot:
  ![alt text](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Images/Architecture.png)  
  
 * Architecture components in text: <br>
     Following are the major components in our bot <br>
     __Users:__ Software Development team <br>
     __Slack:__ A portal where team members can interact with each other. <br>
     __Jira:__ A tool for tracking and managing software projects. We are planning to use the free trial version of Jira for our purpose. <br>
     __Bot Service:__ Our bot will be a slack bot and will be connected to all the 3 other components. It will be able to interact with team members on Slack. It will fetch a list of relevant issues from Jira, create new issues on Jira and also receive/notify about updates when the status of an issue undergoes a change on Jira. 

    There are three main components of the bot service:
    1. Similar Issue Suggestions: When the user wants to create a new issue, he will provide a summary of this issue to the bot.  The bot will then provide links of similar issues from Jira to the user. For this we have 2 approaches in mind. <br>    
        §  The bot will initially query the Jira API for a list of all the existing issues for that project. Once it has this, it will compare the summary of each of these issues with the current issue summary and try to find a similarity percentage between them using a text similarity comparison tool. After this it will select the top 3 issues and return their links. <br>        
        §  Because it will be difficult to fetch entire summaries for all the issues belonging to that project on Jira, we will define a set of labels that will define each issue. The bot will then fetch these labels from Jira, and try to match them with labels present in the current issue summary.
                  Alternately the user can also provide an issue number to the bot. The bot will use a     similar process to provide links of relevant issues to the user.  

    2. Issue creator: Once these links are provided, the user will go through each of them and decide which is most relevant to the issue on hand. Then he will provide the required option number to the bot who will create the issue with the relevant assignee name. For this the bot will use Jira’s REST API service. Some of the parameters provided will be project name, summary, issue type, and assignee name (optional).

    3. Status updates: Whenever there is a change in the status of an issue, Jira will notify our Slack Bot about this change. For this we will make use of Webhooks callback provided by Jira. The bot will notify the relevant team members about these status updates.
 
 ##### Constraints/Guidelines: 
   1. The bot will be embedded in Slack. So developers using slack can add this bot to their channel.
   2. User should specify the project ID, summary of the issue and issue type as asked by bot. This information is required for                        the bot to provide suggestions for similar issues. 
   3. When a team member changes the status of a task, not all members of that team are notified. Instead, all team members who are assigned the sub-tasks are notified about the status. 
   4. Team members should be using JIRA.
   5. Bot only provides suggestions about similar bugs and create tasks. Team member need to decide if the task can be marked duplicate or whom to assign the task.

 ##### Additional Design patterns:
    Currently,  we identify the following design pattern in our project:<br>
    Observer - users are notified about the status change of tasks on JIRA

