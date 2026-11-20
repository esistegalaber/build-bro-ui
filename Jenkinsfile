// Builds the UI, packages it into the nginx image (Dockerfile) and runs the Cypress specs in live mode
// against that image, which proxies /api to the Build Bro API with testdata.sql loaded.
//
// The agent needs Docker (in /usr/local/bin), Chrome (the e2e tests run in it) and Node 26 (NODE_BIN).
// Ports 8080 (API) and 4200 (UI) must be free on the agent.
pipeline {

  options {
    buildDiscarder(logRotator(numToKeepStr: '50'))
    disableConcurrentBuilds()
  }

  agent any

  environment {
    // The Angular 22 CLI needs Node ^22.22.3, ^24.15 or >=26; builds and tests are verified on 26.
    NODE_BIN = '/Users/josip/.nvm/versions/node/v26.13.1/bin'
    API_IMAGE = 'esistegalaber/build-bruh-api:0.1.0'
    UI_IMAGE = 'build-bro-ui:jenkins'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
        sh 'git clean -dfx'
      }
    }

    stage('Boot API') {
      steps {
        withEnv(['PATH+EXTRA=/usr/local/bin']) {
          sh 'docker network create jnk_bb'
          sh 'docker run --name build_bruh_db --network jnk_bb -d -e MYSQL_DATABASE=build_bruh -e MYSQL_USER=build_bruh -e MYSQL_PASSWORD=build_bruh -e MYSQL_ROOT_PASSWORD=build_bruh mariadb:10.10'
          sh '''
            for i in $(seq 1 60); do
              docker exec build_bruh_db mariadb-admin ping -ubuild_bruh -pbuild_bruh --silent && exit 0
              sleep 2
            done
            echo "MariaDB did not start"; exit 1
          '''
          // the API creates the schema (Flyway) on startup, so testdata.sql can only be loaded once it answers
          sh "docker run --name api --network jnk_bb -d -p 8080:8080 -e DB_USR=build_bruh -e DB_PWD=build_bruh -e DB_URL=jdbc:mariadb://build_bruh_db:3306/build_bruh ${API_IMAGE}"
          sh '''
            for i in $(seq 1 60); do
              curl -sf -o /dev/null http://localhost:8080/api/v1/stats && exit 0
              sleep 2
            done
            docker logs api; echo "The API did not start"; exit 1
          '''
          sh "docker exec -i build_bruh_db sh -c 'exec mariadb -ubuild_bruh -pbuild_bruh build_bruh' < testdata.sql"
        }
      }
    }

    stage('Build UI') {
      steps {
        withEnv(["PATH+EXTRA=${NODE_BIN}:/usr/local/bin"]) {
          // npm ci also downloads the Cypress binary (approved in package.json -> allowScripts)
          sh 'npm ci'
          sh 'npm run build'
          sh "docker build -t ${UI_IMAGE} ."
        }
      }
    }

    stage('E2E') {
      steps {
        withEnv(["PATH+EXTRA=${NODE_BIN}:/usr/local/bin"]) {
          // nginx serves the built app on :4200 and proxies /api to the 'api' container (BUILDZ_API defaults to api)
          sh "docker run --name build_bruh_ui --network jnk_bb -d -p 4200:80 ${UI_IMAGE}"
          sh '''
            for i in $(seq 1 30); do
              curl -sf -o /dev/null http://localhost:4200 && exit 0
              sleep 1
            done
            docker logs build_bruh_ui; echo "The UI did not start"; exit 1
          '''
          sh 'npm run cypress:run:live'
        }
      }
    }

  }

  post {
    always {
      withEnv(['PATH+EXTRA=/usr/local/bin']) {
        sh 'docker stop build_bruh_ui api build_bruh_db || true'
        sh 'docker rm build_bruh_ui api build_bruh_db || true'
        sh 'docker network rm jnk_bb || true'
      }
    }
  }
}
