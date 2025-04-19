pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'nextfij'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        // DOCKER_REGISTRY = 'your-registry-url' // Replace with your Docker registry URL
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                script {
                    if (env.BRANCH_NAME.startsWith('release')) {
                        sh 'docker build -t ${DOCKER_IMAGE}:${env.BRANCH_NAME} -t ${DOCKER_IMAGE}:latest .'
                    } else {
                        sh 'npm run build'
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully'
        }
        failure {
            echo 'Pipeline failed'
        }
    }
} 