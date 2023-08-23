# octopusproject
Server
The server is a simple nodejs app that gets its database from the user and print the data base it have and the amount of apples it connecting to a mongodb database.(I used chatgpt to write this code)
Dockerfile
The dockerfile containerize the server app  to a node container 
Terraform 
The terraform directory creates docker image and run it with a container of mongo
And create a load balancer in the aws
Compile 
To compile the app you will have to go to the terraform directory and run the command
“terraform apply” and after it you can connect to “localhost:3000”
Jenkinsfile
The pipeline create an image from the docker file and push it to my repository then using
Docker context it pulls the images from repository and run it with docker compose

