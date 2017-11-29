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

10. We have deployed the chat bot to slack channel- this https://se-projecthq.slack.com/

We have made dummy TA user : <br>
  UserID:  tamasterbot@gmail.com Password: tamaster <br>
  
Please log into the channel using the above credentials.

11. This is jira account we are using: [Jira Account](https://masterbot.atlassian.net/projects/MAS/issues/MAS-88?filter=allissues)
Login with following credentials for testing use case 2:
UserID:  tamasterbot@gmail.com Password: tamaster <br>

## Acceptance Tests

### Use Case: 1

#### Happy Path
1. User enters ‘Create MAS’ to the bot. (MAS is the currently hosted project ID)<br>
2. User then enters issue type.<br>
3. User then enters description.<br>
4. Bot then provides a list of similar issues. 
5. User can select 'Exit' <br>
   i. If 'Exit' is selected no further action is taken.<br>
   ii. No new issue will be created. [PASS]<br>
or 
5. Click on user that worked on similar issue to be assigned to new issue. <br>
   i. In this case a new issue will be created. [PASS]<br>
   
#### Sad Path
I. 1. User enters ‘Create Proj’ to the bot.<br>
       i. User will be shown Invalid Project ID message. [PASS]<br>
II. 1. User enters ‘Create MAS’ to the bot. (MAS is the currently hosted project ID)<br>
    2. User then enters wrong issue type like 4.<br>
       i. User is shown message for invalid issue type <br>
III. 

### Use Case: 2 

[Jira Account](https://masterbot.atlassian.net/projects/MAS/issues/MAS-88?filter=allissues)
#### Happy Path
UserID:  tamasterbot@gmail.com Password: tamaster <br>
1. Login as tamasterbot@gmail.com<br>
2. Go to Jira<br>
3. Change status from 'In Progress' to 'Done'<br>
4. Since tamasterbot is assigned to the subtask under the above refernced issue she will get a noitfication. [PASS] <br>

#### Sad Path
UserID:  tamasterbot2@gmail.com Password: tamaster <br>
1. Login as tamasterbot2@gmail.com<br>
2. Go to Jira<br>
3. Change status from 'In Progress' to 'Done'<br>
4. Since tamasterbot2 is not assigned to the subtask under the above refernced issue she will not get a noitfication. [PASS] <br>


### Use Case: 3

User enters wrong issue number or project id.<br>
Result: User is shown message for invalid project/number accordingly.<br>

User enters Duplicate (no issue number given)<br>
Result: User is shown message for invalid issue.<br>

User enters Duplicate MAS-77 (Happy case)<br>
Result: User is shown duplicate issue links if they exist.<br>


## Screencast Videos:
  
  Please find the deployment to Amazon-AWS in following video: 
###   [Deployment video](http://www.google.com/)

 Please find the bot interaction when bot is running in following video: 
###   [Bot video](http://www.google.com/)

## Task Tracking :

  Please find the task tracking at 
      [WORKSHEET](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Deploy/WORKSHEET.md)
      


.
  
 
  
 
