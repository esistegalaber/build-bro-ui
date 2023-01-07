pipeline {

    options {
        buildDiscarder(logRotator(numToKeepStr: '50'))
        disableConcurrentBuilds()
    }

    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                script {
                    sh "git clean -dfx"
                }
            }
        }

        stage('Boot API') {
            steps {
                script {
                    withEnv(["PATH+EXTRA=/usr/local/bin"]) {
                        sh "docker network create jnk_bb"
                        sh "docker run --name build_bruh_db --network jnk_bb -d -p 3306:3306 -e MYSQL_DATABASE=build_bruh -e MYSQL_USER=build_bruh -e MYSQL_PASSWORD=build_bruh -e MYSQL_ROOT_PASSWORD=build_bruh mariadb:10.10"
                        sleep 5
                        sh "docker run --name api --network jnk_bb -d -p 8080:8080 -e DB_USR=build_bruh -e DB_PWD=build_bruh -e DB_URL=jdbc:mariadb://build_bruh_db:3306/build_bruh esistegalaber/build-bruh-api:0.1.0"
                        sleep 5
                        sh "docker logs api"
                        sh "docker exec -i build_bruh_db sh -c 'exec mariadb -ubuild_bruh -pbuild_bruh' < testdata.sql"
                    }
                }
            }
        }
        stage('Build UI') {
            steps {
                script {
//                     sh "./gradlew clean build jacocoTestReport"
                  echo "OK"
                }
            }
        }
    }
    post('Cleanup') {
        always {
            script {
                withEnv(["PATH+EXTRA=/usr/local/bin"]) {
                    sh "docker stop build_bruh_db api | true"
                    sh "docker rm build_bruh_db api | true"
                    sh "docker network rm jnk_bb | true"
                }

            }
        }
    }
}
