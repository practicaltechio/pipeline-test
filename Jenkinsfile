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

        stage('build') {
            steps {
                echo 'BUILD_HOME ${BUILD_HOME}'
                echo 'Building # ${BUILD_NUMBER}'
                sh 'npm i'                
                zip zipFile: 'application_v${BUILD_NUMBER}.zip', dir: '.', archive: 'true'                
                echo 'Build completed'
            }
        }

        stage('test') {
            steps {
                echo 'Testing'
                unzip zipFile: 'application_v${BUILD_NUMBER}.zip', dir: '${BUILD_HOME}/${TEST_ENV}'
                sh 'pm2 --name test-app start ${BUILD_HOME}/${TEST_ENV}/index.js -- ${TEST_PORT}'
                echo 'Running Postman tests...'
                sh 'pm2 stop --silent test-app'
                sh 'pm2 delete --silent test-app'
                echo 'Test completed'
            }
        }


        stage('release') {
            steps {
                echo 'Releasing'
                fileOperations([fileCopyOperation(
                  excludes: '',
                  flattenFiles: false,
                  includes: 'application_v${BUILD_NUMBER}.zip',
                  targetLocation: '${BUILD_HOME}/${RELEASE_LOCATION}'
                )])
                echo 'Release completed'
            }
        }

        stage('Sanity check') {
            steps {
                input 'Do you want to deploy this release to production?'
            }
        }

        stage('deploy') {
            steps {
                echo 'Deploy'
                catchError {
                  sh 'pm2 stop prod-app' 
                  sh 'pm2 delete prod-app'
                }
                dir('${BUILD_HOME}/${PROD_ENV}') {
                  deleteDir()
                }
                unzip zipFile: 'application_v${BUILD_NUMBER}.zip', dir: '${BUILD_HOME}/${PROD_ENV}'
                sh 'pm2 --name prod-app start ${BUILD_HOME}/${PROD_ENV}/index.js -- ${PROD_PORT}'
                echo 'Deploy completed'
            }
        }
    }

     post {
        always {
            echo 'Cleaning build and test environment'
            // deleteDir()
            dir('${BUILD_HOME}/${TEST_ENV}') {
              deleteDir()
            }                      
        }
        success {
            echo 'Build is successful'
            archiveArtifacts artifacts: 'application_v${BUILD_NUMBER}.zip'
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