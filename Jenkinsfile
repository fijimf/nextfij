pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'nextfij'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        IMAGE_VERSION="${env.BRANCH_NAME}"
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
                        sh 'docker build -t ${DOCKER_IMAGE}:${IMAGE_VERSION} -t ${DOCKER_IMAGE}:latest .'
                    } else {
                        sh 'docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .'                       
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true'
        }
        success {
            echo 'Pipeline completed successfully'
        }
        failure {
            echo 'Pipeline failed'
        }
    }
} 