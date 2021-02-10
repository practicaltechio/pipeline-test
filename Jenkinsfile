pipeline {
    agent any
    triggers {
        pollSCM '* * * * *'
    }

    environment {
        BUILD_LOCATION = 'build'
        TEST_ENV = 'test'
        TEST_PORT = 9001
        RELEASE_LOCATION = 'release'
        PROD_ENV = 'prod'
        PROD_PORT = 9002
    }

    stages {

        stage('build') {
            steps {
                echo "Build home ${env.BUILD_HOME}"
                echo "Build # ${BUILD_NUMBER}"
                sh "npm i"
                script {
                  zip zipFile: "application_v${BUILD_NUMBER}.zip", dir: ".", archive: true
                }                             
                echo "Build completed"
            }
        }

        stage('test') {
            steps {
                echo 'Testing'
                script {
                  unzip zipFile: "application_v${BUILD_NUMBER}.zip", dir: "${env.BUILD_HOME}/${TEST_ENV}", quiet: true
                }
                
                sh "pm2 --name test-app start ${env.BUILD_HOME}/${TEST_ENV}/index.js -- ${TEST_PORT}"
                catchError {
                  echo "Running Postman tests..."
                  sh "newman run postman-tests.json"
                }
                sh "pm2 stop --silent test-app"
                sh "pm2 delete --silent test-app"
                echo "Test completed"
            }
        }


        stage('release') {
            steps {
                echo "Releasing"
                fileOperations([fileCopyOperation(
                  excludes: "",
                  flattenFiles: false,
                  includes: "application_v${BUILD_NUMBER}.zip",
                  targetLocation: "${env.BUILD_HOME}/${RELEASE_LOCATION}"
                )])
                echo "Release completed"
            }
        }

        stage('Sanity check') {
            steps {
                input "Do you want to deploy this release to production?"
            }
        }

        stage('deploy') {
            steps {
                echo "Deploy"
                catchError {
                  sh "pm2 stop prod-app"
                  sh "pm2 delete prod-app"
                }
                dir("${env.BUILD_HOME}/${PROD_ENV}") {
                  deleteDir()
                }
                script {
                  unzip zipFile: "application_v${BUILD_NUMBER}.zip", dir: "${env.BUILD_HOME}/${PROD_ENV}", quiet: true
                }                
                sh "pm2 --name prod-app start ${env.BUILD_HOME}/${PROD_ENV}/index.js -- ${PROD_PORT}"
                echo "Deploy completed"
            }
        }
    }

     post {
        always {
            echo "Cleaning build and test environment"
            deleteDir()
            dir("${env.BUILD_HOME}/${TEST_ENV}") {
              deleteDir()
            }                      
        }
        success {
            echo "Build is successful"
        }
        failure {
            echo "Build failed"
        }
        unstable {
            echo "Build was marked as unstable"
        }
        changed {
            echo "This will run only if the state of the Pipeline has changed"
            echo "For example, if the Pipeline was previously failing but is now successful"
        }
    }
}