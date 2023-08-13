pipeline {
    agent any
    environment{
        REPO=gitmanyaniv/gitmanrepo
         DOCKERHUB_CREDENTIALS = credentials('dockerhub')
    }
    stages {
        stage('build image ') {
            steps {
                sh 'echo "$(DOCKERHUB_CREDENTIALS )"'
            }
        }
        stage('login to dockerhub') {  
            steps {
                sh 'echo "yaniv git"'
            }
        }
        stage('push to dockerhub') {
            steps {
                sh 'echo "hello word"'
            }
        }
    }
}
