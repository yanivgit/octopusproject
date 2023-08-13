pipeline {
    agent any
    environment {
        REPO = 'gitmanyaniv/gitmanrepo'
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
    }
    stages {
        stage('connect to git') {
            steps {
                script {
                    git 'https://github.com/yanivgit/octopusproject.git'
                }
            }
        }
        stage('build image') {  
            steps {
                sh "echo \$DOCKERHUB_CREDENTIALS_PSW | docker login -u \$DOCKERHUB_CREDENTIALS_USR --password-stdin"
                sh "docker build -t \$REPO ."
            }
        }
        stage('push to dockerhub') {
            steps {
                sh "docker push \$REPO"  
            }
        }
    }
}


