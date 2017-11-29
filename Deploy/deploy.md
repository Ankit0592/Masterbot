## Deployment scripts:

We have deployed Masterbot to Amazon-AWS instance and for this we have used following Ansible Playbook :

#### Configuration

1. Created virtual machine (ubuntu) on aws ec2 and using winScp to connect to this machine using public ip.
2. Installed vagrant
3. Created a directory named boxes and created a directory named ansible.
4. Ran these commands inside this directory
   vagrant up
   vagrant ssh
5. Installed ansible on configuration server that is ansible machine.
```
sudo apt-add-repository ppa:ansible/ansible
sudo apt-get update
sudo apt-get install ansible
```

6. Created inventory file in configuration server having location of private key of virtual machine with public ip 34.214.77.95.
```
[nodes]
34.214.77.95 ansible_ssh_user=ubuntu ansible_ssh_private_key_file=./keys/ubuntu.key
```
7. Created directory keys and stored private key of ubuntu machine in node0.key in this directory of ansible machine. Also, make this executable using chmod 600 keys/ubuntu.key 

8. Created Ansible playbook slackbot_deploy.yml on ansible machine which will install node, clone git repository, install forever and npm packages, start app. 
9. Ran this file using command : ```ansible-playbook -i inventory slackbot_deploy.yml``` which will execute all defined tasks in this file. 

[Ansible Playbook](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Deploy/slackbot_deploy.yml)

### Instructions to run:
1. We have deployed the chat bot to slack channel- this https://se-projecthq.slack.com/

We have made dummy TA user : <br>
  UserID:  tamasterbot@gmail.com Password: tamaster <br>
  
Please log into the channel using the above credentials.

2. This is jira account we are using: [Jira Account](https://masterbot.atlassian.net/projects/MAS/issues/MAS-88?filter=allissues)

Login with following credentials:
UserID:  tamasterbot@gmail.com Password: tamaster <br>

## Acceptance Tests

### Use Case: 1

#### Happy Path
1. User enters ‘Create MAS’ to the bot. (MAS is the currently hosted project ID)<br>
2. User then enters issue type. (1 for Bug, 2 for Task, 3 for Exit)<br>
3. User then enters summary.<br>
4. Bot then provides a list users who have worked on similar issues. 
5. User can select 'Exit' <br>
   i. If 'Exit' is selected no further action is taken.<br>
   ii. No new issue will be created. [PASS]<br>
or 
5. Click on a user for the newly created issue to be assigned to the selected user. <br>
   i. In this case a new issue will be created and assigned to the selected user. [PASS]<br>
   
#### Sad Path
I. 1. User enters ‘Create Proj’ to the bot. (Proj is not a valid project ID)<br>
       i. User will be shown Invalid Input message. [PASS]<br>
II. 1. User enters ‘Create MAS’ to the bot. (MAS is the currently hosted project ID)<br>
    2. User then enters wrong issue type like 4.<br>
       i. User is shown message for Invalid Input.<br>


### Use Case: 2 

[Jira Account](https://masterbot.atlassian.net/browse/MAS-88)
#### Happy Path
UserID:  tamasterbot2@gmail.com Password: tamaster2 <br>
1. Login as tamasterbot2@gmail.com on JIRA<br>
2. Login as tamasterbot@gmail.com on Slack. (Credentials - UserID:  tamasterbot@gmail.com Password: tamaster)<br>
2. Visit [MAS-88](https://masterbot.atlassian.net/browse/MAS-88)<br>
3. Change status from 'In Progress' to 'Done'<br>
4. Since tamasterbot is assigned to the subtask under the above referenced issue she will get a notification on slack. [PASS] <br>

#### Sad Path
UserID:  tamasterbot2@gmail.com Password: tamaster <br>
1. Login as tamasterbot2@gmail.com on JIRA as well as slack.<br>
2. Go to Jira<br>
3. Visit [MAS-88](https://masterbot.atlassian.net/browse/MAS-88).<br>
4. Change status from 'In Progress' to 'Done' (vice versa is also true as "Done" to "In Progress" is also a status change)<br>
5. Since tamasterbot2 is not assigned to the subtask under the above referenced issue she will not get a notification. [PASS] <br>


### Use Case: 3

LOGIN credentials:-
TA1 UserID:  tamasterbot@gmail.com Password: tamaster <br>
TA2 UserID:  tamasterbot2@gmail.com Password: tamaster2 <br>
#### Happy Path
I. 1. User (either of TA1 or TA2) enters ‘Duplicate MAS-77’ as a messageto the bot on slack. (MAS is the currently hosted project ID)<br>
   2. Bot provides issues which is/are suspected duplicate(s) of [MAS-77](https://masterbot.atlassian.net/browse/MAS-77). The duplicates reported are [MAS-76](https://masterbot.atlassian.net/browse/MAS-76), [MAS-94](https://masterbot.atlassian.net/browse/MAS-94), [MAS-95](https://masterbot.atlassian.net/browse/MAS-95) because they have very similar summaries. 

II. 1. User enters ‘Duplicate MAS-97’ [MAS-97](https://masterbot.atlassian.net/browse/MAS-97) to the bot. (MAS is the currently hosted project ID)<br>
    2. As there are no duplicate issues, Bot returns "Cannot find any duplicate issues." 

#### Sad Path
    1. User enters ‘Duplicate MAS-7’ to the bot. (MAS is the currently hosted project ID)<br>
    2. As there are no such ID the bot returns Invalid Input message.

## Screencast Videos:
  
  Please find the Deployment to Amazon-AWS + Bot interaction + Acceptance testing in following video: 
###   [Deployment video](https://youtu.be/LPwTM-SMgGo)

In case the audio is not good, plaes play the given [mp3 file](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Not.mp3) along with the video. 


## Task Tracking :

  Please find the task tracking at 
      [WORKSHEET](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Deploy/WORKSHEET.md)
      


.
  
 
  
 
