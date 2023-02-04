#!groovy

pipeline {
    agent any
    options {
        timestamps()
        disableConcurrentBuilds()
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
                sh "sudo yarn build"
            }
        }
        stage("Deploy") {
            steps {
                echo "=== deploying ==="
                sh "sudo cp -ra ./dist/. /var/www/AppGusMelfordCom"
            }
        }
        stage("Nginx restart") {
            steps {
                sh "docker restart nginx"
            }
        }
    }
    post {
        always {
            sh "docker logout"
        }
    }
}
