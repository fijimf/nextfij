pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'nextfij'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        DOCKER_REGISTRY = 'your-registry-url' // Replace with your Docker registry URL
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        stage('Test Docker Image') {
            steps {
                script {
                    // Run container and test if it starts successfully
                    def container = docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").run('-p 3000:3000 --name test-container')
                    
                    // Wait for the container to be ready
                    sleep(time: 10, unit: 'SECONDS')
                    
                    // Check if the container is running
                    def isRunning = sh(script: "docker inspect -f '{{.State.Running}}' test-container", returnStdout: true).trim()
                    if (isRunning != 'true') {
                        error "Container failed to start"
                    }
                    
                    // Clean up test container
                    sh "docker stop test-container"
                    sh "docker rm test-container"
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Login to Docker registry (credentials should be configured in Jenkins)
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-credentials') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                        // Also push as latest if this is the main branch
                        if (env.BRANCH_NAME == 'main') {
                            docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push('latest')
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            // Clean up any remaining containers
            sh 'docker stop test-container || true'
            sh 'docker rm test-container || true'
            
            // Clean up Docker images
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