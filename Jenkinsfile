pipeline {
    agent any

    environment {
        BUILD_LOCATION = '~/dev/staging/build'
        TEST_ENV = '~/dev/staging/test'
        TEST_PORT = 9001
        RELEASE_LOCATION = '~/dev/staging/release'
        PROD_ENV = '~/dev/staging/prod'
        PROD_PORT = 9002
    }

    stages {

        stage('build') {
            steps {
                sh 'echo Building'
                sh 'npm i'
                sh 'mkdir -p ${BUILD_LOCATION}'
                sh 'zip -FSrq ${BUILD_LOCATION}/application.zip ./'
                sh 'echo Build completed'
            }
        }

        stage('test') {
            steps {
                sh 'echo Testing'
                sh 'mkdir -p ${TEST_ENV}'
                sh 'unzip -oq ${BUILD_LOCATION}/application.zip -d ${TEST_ENV}'
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
                sh 'mkdir -p ${RELEASE_LOCATION}'
                sh 'cp -rf ${BUILD_LOCATION}/application.zip ${RELEASE_LOCATION}/application.zip'
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
                sh 'mkdir -p ${PROD_ENV}'
                sh '#pm2 --silent stop prod-app'
                sh '#pm2 --silent delete prod-app'
                sh 'unzip -oq ${RELEASE_LOCATION}/application.zip -d ${PROD_ENV}'
                sh 'pm2 --name prod-app start ${PROD_ENV}/index.js -- ${PROD_PORT}'
                sh 'echo Deploy completed'

            }
        }
    }

     post {
        always {
            echo 'This will always run'
        }
        success {
            echo 'This will run only if successful'
        }
        failure {
            echo 'This will run only if failed'
        }
        unstable {
            echo 'This will run only if the run was marked as unstable'
        }
        changed {
            echo 'This will run only if the state of the Pipeline has changed'
            echo 'For example, if the Pipeline was previously failing but is now successful'
        }
    }
}