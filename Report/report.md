# Report

## Problem 
During development software engineers often face the issue of having to create and manage issues they face during development process. We have tried to harness the power of collaboration through our MasterBot which allows users to not only keep track of issues she is involved in but also find out issues and their users that are similar to the one she wants to create. Thirdly, it can also tell a user whether two issues are similar or not.<br>
<br>
Suppose a developer gets a defect or bug while coding for which he has to raise an issue. It is inefficient to have the developer work on this issue if it is very similar to one that has already been solved by someone else. The developer should have the ability to assign this new issue to the person who solved the similar issue in the past as he can solve it much faster due to his prior experience. So rather than fixing the new issue our developer can get back to doing more productive things. This saves hours and therefore money for the team.<br>
<br>
On a similar note developers and testers should also have the ability to look up two duplicate issues. This helps in reducing redundancies in the issues tracked in a system(Jira) which reduces the team's productivity. <br>
<br>
Also when two or more members are working on the same issue and when one assignee changes the status of the issue, all other assignees should get a notification alerting them the change in status. Emails, Email notifications and scrums are a cumbersome way to keep track of such assigned issues. They also take time to be triggered. A direct message should be triggered to all relevant user. This should happen instantly so the user does not need to keep checking back on the issue/emails to find its status. <br>
<br>

## Features
1. __Confusion in determining right team to assign bugs__- MasterBot provides suggestions on who can be assigned a new issue being created based on similarity with past issues and then creates the issue on Jira assigning it to the member chosen. It ensures that the task gets assigned to a person who has already worked on similar tasks and expedites the development process. <br>
A. User enters ‘Create MAS’ to the bot. (MAS is the currently hosted project ID)<br>
B. User then enters issue type. (1 for Bug, 2 for Task, 3 for Exit)<br>
C. User then enters summary like 'Lazy loading on profile page not working'.<br>
D. Bot then provides a list users who have worked on similar issues. <br>
E. Click on a user for the newly created issue to be assigned to the selected user. A new issue will be created and assigned to the selected user. <br>

![alt text](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Images/MasterBOT_Demo.gif) 

<br>
2.__Slippage of relevant notifications__- MasterBot also notifies assignees of the change of state of a task on JIRA(In Progress, Completed etc.) which is useful when different team members are working on subtasks within a task and their tasks have dependency on each other. It sends push notifications as direct message/s to the relevant assignee/s of a task.<br>
A. Login as apshukla on JIRA<br>
B. Login as aarora6 on Slack. (Credentials - UserID:  tamasterbot@gmail.com Password: tamaster)<br>
C. Visit [MAS-1](https://masterbot.atlassian.net/browse/MAS-88)<br>
D. Change status from 'In Progress' to 'Done'<br>
E. Since aarora6 is assigned to the subtask under the above referenced issue she will get a notification on slack. <br>

![alt text](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Images/MasterBOT_Demo2.gif) 

<br>
3. __Redundant issue/bugs__- MasterBot can reduce the number of redundant issues in the system by pulling up issues from Jira that it thinks are similar to the one provided to it. <br>
 A. User (either of TA1 or TA2) enters ‘Duplicate MAS-77’ as a messageto the bot on slack. (MAS is the currently hosted project ID)<br>
   B. Bot provides issues which is/are suspected duplicate(s) of [MAS-77](https://masterbot.atlassian.net/browse/MAS-77). The duplicates reported are [MAS-76](https://masterbot.atlassian.net/browse/MAS-76) <br>
   
![alt text](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Images/MasterBOT_Demo3.gif) 


### Diagram illustrating the components of the bot:
  ![alt text](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Images/design.png) 
  
### Implementation Architecture: 
![Image](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Images/Arch.png) 

## Refelction on development proceeatures
??

## Limitations 
1. In our current implementation there will be a lookup every time a new issue is created. So a project with a large number of issues will be very slow as the issue to be created will have to be matched with all of those past issues. So in its current model our MasterBot will not scale up well with larger projects.<br>
2. Secondly the text matching algorithm extracts words from issue summary and uses them as labels for the particular issue. Therefore the length of an issue's summary will have a large bearing on it being matched to other issues. Long summaries will have more labels making it more likely to be matched with past issues.<br>
3. Currently MasterBot only matches two issues based on the similarity of their summary/title.<br>

## Future work
1. There could be an index of issues and their respective assignees pertaining to a particular module that will be referenced if a new issue is being created for that module.
2. Automatic jobs can be run to report duplicate issues in the system thereby getting rid of developers spending time on matching pairs of issues manually.
3. When a new issue is being created it should be matched with other issues in the system to ascertain whether the issue being created is a duplicate of another.

## Team Members:

1. Akanksha Shukla (apshukla)
2. Ankit Arora(aarora6) 
3. Abhinav Medhekar(amedhek) 
4. Pavneet Singh Anand (panand4) 
5. Sudipto Biswas (sbiswas4)


## Project Presentation
[Screencast](https://youtu.be/L-Ub6Lx6CrI)

## Important Milestones 
### Bot Design   
[Link](./DESIGN.md) to design file.   
    
### Bot Milestone
[Link](./BOT.md) to bot file.   
        
### Service Milestone
[Link](./service/Service.md) to service file. 

### Deploy Milestone 
[Link](./Deploy/deploy.md) to deploy file

### Report Milestone
[Link](./report.md)
