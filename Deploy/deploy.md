## Deployment scripts:

We have deployed Masterbot to Amazon-AWS instance and for this we have used following Ansible Playbook :

#### Setup

1. Created virtual machine (ubuntu) on aws ec2 and using winScp to connect to this machine using public ip.
2. Installed vagrant
3. Created a directory named boxes and created a directory named ansible.
4. Ran these commands inside this directory
   vagrant up
   vagrant ssh
5. Installed ansible on configuration server that is ansible machine.
sudo apt-add-repository ppa:ansible/ansible
sudo apt-get update
sudo apt-get install ansible

6. Created inventory file in configuration server having location of private key of virtual machine with public ip 34.214.77.95.
'''
[nodes]
34.214.77.95 ansible_ssh_user=ubuntu ansible_ssh_private_key_file=./keys/ubuntu.key
'''
7. Created directory keys and stored private key of ubuntu machine in node0.key in this directory of ansible machine. Also, make this executable using chmod 600 keys/ubuntu.key 

8. Created Ansible playbook slackbot_deploy.yml on ansible machine which will install node, clone git repository, install forever and npm packages, start app. 
9. Ran this file using command : ```ansible-playbook -i inventory slackbot_deploy.yml``` which will execute all defined tasks in this file. 

[Ansible Playbook](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Deploy/slackbot_deploy.yml)

10. We have deployed the chat bot to slack channel- this https://se-projecthq.slack.com/

We have made 2 dummy TA users : <br>
  1.UserID:  tamasterbot@gmail.com Password: tamaster <br>
  2.UserID:  tamasterbot2@gmail.com Password: tamaster2 <br>
  
Please log into the channel using the above credentials.

## Acceptance Tests


## Screencast Videos:
  
  Please find the deployment to Amazon-AWS in following video: 
###   [Deployment video](http://www.google.com/)

 Please find the bot interaction when bot is running in following video: 
###   [Bot video](http://www.google.com/)

## Task Tracking :

  Please find the task tracking at 
      [WORKSHEET](https://github.ncsu.edu/sbiswas4/CSC510_Fall17_Project/blob/master/Deploy/WORKSHEET.md)
      


.
  
 
  
 
