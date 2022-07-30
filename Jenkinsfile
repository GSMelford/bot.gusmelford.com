#!groovy

pipeline {
    agent any
    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        CONTAINER_NAME = "bot.gusmelford.com"
        DOCKER_CONTAINER_TAG = "latest"
        DOCKER_REPO = "gsmelford"
        PORT = "5690"
    }

    stages {
        stage("Yarn install") {
            steps {
                script {
                    echo "=== building ==="
                    sh "yarn install"
                }
            }
        }
        stage("Yarn build") {
            steps {
                echo "=== pushing image ==="
                sh "sudo yarn build -S $SUDO_PASSWORD"
            }
        }
        stage("Deploy") {
            steps {
                echo "=== deploying ==="
                sh "sudo cp -ra ./dist/. /var/www/BotGusMelfordCom"
            }
        }
        stage("Nginx restart") {
            steps {
                sh "docker restart nginx_nginx_1"
            }
        }
    }
    post {
        always {
            sh "docker logout"
        }
    }
}