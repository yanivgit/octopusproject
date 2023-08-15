pipeline {
    agent any
    environment {
        REPO = 'gitmanyaniv/gitmanrepo'
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
    }
    stages {
        stage('clone from git') {
            steps {
                
                    git 'https://github.com/yanivgit/octopusproject.git'
                
            }
        }
        stage('build image') {  
            steps {
                sh "docker build -t \$REPO ."
            }
        }
         
        stage('testing') {  
            steps {
                sh "echo testing"
            }
        }

        stage('push to dockerhub') {
            steps {
                sh "echo \$DOCKERHUB_CREDENTIALS_PSW | docker login -u \$DOCKERHUB_CREDENTIALS_USR --password-stdin"
                sh "docker push \$REPO"  
            }
        }
        
        stage('Deployment'){
            steps{
                sh 'docker context use remote'
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh 'docker pull $REPO'
                sh 'docker compose -f docker-compose.yml up -d'

           }
        }
        post{
            always{
                sh 'docker image prune -af'
                sh 'docker context use default'
                sh 'docker logout'

            }
        }

    }
}


