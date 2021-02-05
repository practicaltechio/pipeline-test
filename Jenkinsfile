pipeline {
    agent any

    environment {
        DB_TYPE     = 'MongoDB'
        ENV_NAME    = 'local'
    }

    stages {

        stage('build') {
            steps {
                sh 'echo Build'
                sh 'echo Running in ${ENV_NAME} with database type ${DB_TYPE}'
                sh 'npm --version'
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