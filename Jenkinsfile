pipeline {
    agent any

    environment {
        BUILD_LOCATION = 'build'
        TEST_ENV = 'test'
        TEST_PORT = 9001
        RELEASE_LOCATION = 'release'
        PROD_ENV = 'prod'
        PROD_PORT = 9002
    }

    stages {

        stage('info') {
          steps {
            sh 'User home directory: ${user.home}'
          }
        }

        stage('build') {
            steps {
                sh 'echo Building # ${BUILD_NUMBER}'
                sh 'npm i'
                sh 'mkdir -p ${BUILD_LOCATION}'
                sh 'zip -rq ${BUILD_HOME}/${BUILD_LOCATION}/application_${BUILD_NUMBER}.zip ./*'
                sh 'echo Build completed'
            }
        }

        stage('test') {
            steps {
                sh 'echo Testing'
                sh 'mkdir -p ${TEST_ENV}'
                sh 'unzip -oq ${BUILD_HOME}/${BUILD_LOCATION}/application_${BUILD_NUMBER}.zip -d ${BUILD_HOME}/${TEST_ENV}'
                sh 'pm2 --name test-app start ${TEST_ENV}/index.js -- ${TEST_PORT}'
                sh 'echo Running Postman tests...'
                sh 'pm2 stop --silent test-app'
                sh 'pm2 delete --silent test-app'
                sh 'echo Test completed'
            }
        }


        stage('release') {
            steps {
                sh 'echo Releasing'
                sh 'mkdir -p ${BUILD_HOME}/${RELEASE_LOCATION}'
                sh 'cp -rf ${BUILD_HOME}/${BUILD_LOCATION}/application_${BUILD_NUMBER}.zip ${BUILD_HOME}/${RELEASE_LOCATION}/application_${BUILD_NUMBER}.zip'
                sh 'echo Release completed'
            }
        }

        stage('Sanity check') {
            steps {
                input "Does the build look ok?"
            }
        }

        stage('deploy') {
            steps {
                sh 'echo Deploy'
                sh 'mkdir -p ${BUILD_HOME}/${PROD_ENV}'
                catchError {
                  sh 'pm2 stop prod-app' 
                  sh 'pm2 delete prod-app'
                }
                sh 'unzip -oq ${BUILD_HOME}/${RELEASE_LOCATION}/application_${BUILD_NUMBER}.zip -d ${BUILD_HOME}/${PROD_ENV}'
                sh 'pm2 --name prod-app start ${BUILD_HOME}/${PROD_ENV}/index.js -- ${PROD_PORT}'
                sh 'echo Deploy completed'
            }
        }
    }

     post {
        always {
            echo 'Cleaning build and test environment'
            deleteDir()
            sh 'rm -rf ${BUILD_HOME}/${TEST_ENV}'
            
        }
        success {
            echo 'Build is successful'
        }
        failure {
            echo 'Build failed'
        }
        unstable {
            echo 'Build was marked as unstable'
        }
        changed {
            echo 'This will run only if the state of the Pipeline has changed'
            echo 'For example, if the Pipeline was previously failing but is now successful'
        }
    }
}