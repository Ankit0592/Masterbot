# RE-DESIGN 
 Please note that only use cases, storyboarding and wire frame has been modified

## Problem Statement 

Facing similar issues has always been an obstruction in the productivity of software development teams. A developer can encounter multiple bugs with similar steps to reproduce and consequently a similar root cause. Automating the process of finding similar bugs possesses can help in avoiding duplication and boost productivity by avoiding parallel investigations by multiple teams. Some suggestions about whom to assign an issue currently being created based on the history of bugs raised can save time. 
 
Dependency among two or more team members is another issue that software engineers face. When one member progresses on a particular user story and other members are concerned about it, there can be wastage of time if the status is not communicated immediately. Scrum call or email is useful here but it may take time to give update. A better approach would be to notify about the progress immediately to all the team members who are assigned sub tasks of the user story. Otherwise, completion of all sub tasks of a user story may take longer time due to gap in communication. 

## Bot Description 
Our bot 'Master-Bot' provides suggestions, creates issues on JIRA, and assigns them to team members depending on input from the user. User needs to provide the issue summary to the bot and the bot extracts a list of links of issues, similar to the current issue, from Jira. The bot can then create an issue on JIRA based on the issue number that the user selects. This bot is a good solution to simplify the process of assigning the issues by providing the right suggestions for whom to assign. It ensures that the task gets assigned to a person who has already worked on similar tasks and expedites the development of the new task. Also if the user has an issue number with him, he can provide this number to the bot and the bot will return duplicate of that, if any.. Master-bot is an initiative aimed to boost the productivity of teams.

This bot also notifies the team members whenever the state of a task changes on JIRA(In Progress, Completed etc.) which is useful when different team members are working on subtasks within a task and their tasks have dependency on each other. 

Our bot belongs the category of Chatbot as the user provides the description of task to create and bot replies with the issue list, then bot creates task on JIRA and assign task to appropriate team member (as decided by user).
Also, bot triggers notification to team members whenever task state changes (when event occurs).

## Use Cases 
####Use Case 1: Issue creation and auto assign on Jira

Preconditions: Bot must be able to access Jira API

Main: User requests creation of a task on Jira [s1] and provide issue type and description of the issue to the bot [s2][s3]. Bot will return links of similar issues along with a create button against each issue [s4]. User can check them and click submit corresponding to the most relevant issue [s5]. Bot creates the issue with provided description and assigns to a team member who worked on that selected relevant similar issue. Bot also provides a create button if user cannot find any relevant similar issue. If user clicks on this create button, new isse is created and not assigned to anyone at this point (can be assigned later).

Sub flows: [S1] User enters ‘Create {project id}’ to the bot.

[S2] Bot requests user to enter issue type and user provides the same.

[S3] Bot asks for description of issue and user enters the text.

[S4] Bot gives list of similar issues along with the name of team member who worked on it and a "Create" button against each similar issue.

[S5] User go through those issues and after finding out the most relevant one, clicks on corresponding 'Create' button.

[S6] Bot creates the issue with provided description on Jira and assigns it to a team member who worked on the similar issue (from S5, the most relevant similar issue as per the user who created this issue).

[s7] Bot acknowledges the successful creation of issue.

Alternate flows: [E1] No similar issues found. Bot provides an option saying "Click Create if most releavant similar issue does not exists" along with a create button. User can click on this create button for issue creation and assign it someone later.

[E2] User does not click on create button for creation of an issue. In this case bot conversation terminates.

[E3] User wants to assign the issue to some other developer (other than the ones suggested by bot). In this case the issue can be created without any assignee.

#### Use Case 2: Notify relevant team members about Status change of an issue.

This use case demonstrates how this bot can notify relevant team members about status changes on the tasks they are working on. This is useful when there's a dependency on team member working. Simply updating the team immediately is useful in many situations.

Preconditions: JIRA is configured to push update to BOT service.

Main: Whenever a team member changes the status of an issue, all other team members working on the same will be notfied of the change on slack by this bot. [S1] Developer changes the status of an issue from “In Progress” to “Completed”.

[S2] Bot receives notification from Jira about this event.

[S3] Bot sends message about this to relevant team members on Slack.

Sub flows: [S1] A developer named Foo changes the status of an issue from “In Progress” to “Completed”.

[S2] Bot sends notification to other team members who are working on the same as: UPDATE TEST-1234 has been marked as ‘Completed’ by Foo.

#### Use Case 3: Find duplicate issues of a given issue on Jira

Preconditions: Bot must be able to access Jira API

Main: User asks bot to provide duplicate issues of a given issue. Bot lists the duplicate issue number and url for the same.

Sub flows: [S1] User types "Duplicate {issue id}".

[S2] Bot provides list of duplicate issues.

Alternate flows: [E1] No duplicate issue found.
    
## Design Sketches 
   * Wireframe of bot in action  
      ![alt text](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Images/UseCase1.png)   
      
   * Wireframe bot in action
      ![alt text]()  
      
   * Prototypes of bot  
     ![alt text]()   
        
     ![alt text]()   
         
   * StoryBoard of primary task that a user undergoes with bot 
       ![Story Board](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/StoryBoarding.pdf)  
          
## Architecture Design 
 * Diagram illustrating the components of the bot:
  ![alt text](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Images/Architecture.png)  
  
##### Architecture components: 

Following are the major components in our bot <br>
     __Users:__ Software Development team <br>
     __Slack:__ A portal where team members can interact with each other. <br>
     __Jira:__ A tool for tracking and managing software projects. We are planning to use the free trial version of Jira for our purpose. <br>
     __Bot Service:__ Our bot will be a slack bot and will be connected to all the 3 other components. It will be able to interact with team members on Slack. It will fetch a list of relevant issues from Jira, create new issues on Jira and also receive/notify about updates when the status of an issue undergoes a change on Jira. 

  There are three main components of the bot service:<br>
    1. Similar Issue Suggestions: When the user wants to create a new issue, he will provide a summary of this issue to the bot.  The bot will then provide links of similar issues from Jira to the user. For this we have 2 approaches in mind. <br>    
          §  The bot will initially query the Jira API for a list of all the existing issues for that project. Once it has this, it will compare the summary of each of these issues with the current issue summary and try to find a similarity percentage between them using a text similarity comparison tool. After this it will select the top 3 issues and return their links. <br>        
          §  Because it will be difficult to fetch entire summaries for all the issues belonging to that project on Jira, we will define a set of labels that will define each issue. The bot will then fetch these labels from Jira, and try to match them with labels present in the current issue summary.
         Alternately the user can also provide an issue number to the bot. The bot will use a similar process to provide links of relevant issues to the user.<br>  
       
2. Issue creator: Once these links are provided, the user will go through each of them and decide which is most relevant to the   issue on hand. Then he will provide the required option number to the bot who will create the issue with the relevant assignee ame. For this the bot will use Jira’s REST API service. Some of the parameters provided will be project name, summary, issue type, and assignee name (optional).<br>
    

3. Status updates: Whenever there is a change in the status of an issue, Jira will notify our Slack Bot about this change. For this we will make use of Webhooks callback provided by Jira. The bot will notify the relevant team members about these status updates.
    
    
###### Platform the bot is embedded in: Slack
###### Third Party Services: Jira REST Api
 
 ##### Constraints/Guidelines: 
   1. The bot will be embedded in Slack. So developers using slack can add this bot to their channel.
   2. User should specify the project ID, summary of the issue and issue type as asked by bot. This information is required for                        the bot to provide suggestions for similar issues. 
   3. When a team member changes the status of a task, not all members of that team are notified. Instead, all team members who are assigned the sub-tasks are notified about the status. 
   4. Team members should be using JIRA.
   5. Bot only provides suggestions about similar bugs and create tasks. Team member need to decide if the task can be marked duplicate or whom to assign the task.

 ##### Additional Design patterns:
    Currently,  we identify the following design pattern in our project:
    Observer - users are notified about the status change of tasks on JIRA
    Observer - Webhook callback waits for changes to be made to the status of an issue on JIRA
    Iterator - We could use Iterator pattern for iterating through the list of fetched issues while comparing summaries

