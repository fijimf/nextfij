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

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .'
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