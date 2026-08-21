pipeline {
  agent any

  environment {
    EC2_HOST = '15.135.240.116'
  }

  stages {
    stage('Build backend') {
      agent {
        docker {
          image 'maven:3.9.9-eclipse-temurin-21'
          reuseNode true
        }
      }
      steps {
        dir('back') {
          sh '''
            java -version
            mvn -B -DskipTests package
            ls -la target/*.jar
            test -f target/back-0.0.1-SNAPSHOT.jar
          '''
        }
      }
    }
    stage('Build frontend') {
      agent {
        docker {
          image 'node:18-alpine'
          reuseNode true
        }
      }
      steps {
        dir('front') {
          sh '''
            node --version
            npm --version
            npm ci
            CI=false npm run build
            ls -la build
            test -f build/index.html
          '''
        }
      }
    }
    stage('Deploy') {
      steps {
        withCredentials([sshUserPrivateKey(
          credentialsId: 'ec2-ssh',
          keyFileVariable: 'SSH_KEY',
          usernameVariable: 'SSH_USER'
        )]) {
          sh '''
            test -f back/target/back-0.0.1-SNAPSHOT.jar
            test -f front/build/index.html

            scp -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new \
              back/target/back-0.0.1-SNAPSHOT.jar \
              "$SSH_USER@$EC2_HOST:/tmp/movie-backend.jar"

            ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new \
              "$SSH_USER@$EC2_HOST" "rm -rf /tmp/movie-frontend-build"
            scp -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new -r \
              front/build \
              "$SSH_USER@$EC2_HOST:/tmp/movie-frontend-build"

            ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "$SSH_USER@$EC2_HOST" bash -s << 'ENDSSH'
              set -e
              APP_DIR=/home/ubuntu
              JAR_NAME=back-0.0.1-SNAPSHOT.jar
              LIVE_DIR=/home/ubuntu/build
              PM2=/usr/local/bin/pm2

              PID=$(ss -lntp | grep ':8888' | grep -oP 'pid=\\K[0-9]+' | head -1)
              if [ -n "$PID" ]; then
                CMDLINE=$(tr '\\0' ' ' < /proc/$PID/cmdline || true)
                echo "$CMDLINE" | grep -qi catalina && { echo "8888이 톰캣이다. 중단"; exit 1; }
              fi

              test -f /tmp/movie-backend.jar
              test -f "$APP_DIR/$JAR_NAME"
              cp /tmp/movie-backend.jar "$APP_DIR/$JAR_NAME"
              sudo -n "$PM2" restart backend
              for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
                ss -lntp | grep -q ':8888' && break
                sleep 5
              done
              ss -lntp | grep ':8888'

              test -f /tmp/movie-frontend-build/index.html
              test -d "$LIVE_DIR"
              test "$LIVE_DIR" = /home/ubuntu/build
              rm -rf "$LIVE_DIR"
              cp -a /tmp/movie-frontend-build "$LIVE_DIR"
              test -f "$LIVE_DIR/index.html"
              sudo -n "$PM2" restart frontend
              for i in 1 2 3 4 5 6; do
                ss -lntp | grep -q ':80 ' && break
                sleep 2
              done
              ss -lntp | grep ':80 '

              sudo -n "$PM2" list
ENDSSH
          '''
        }
      }
    }
    stage('Verify') {
      steps {
        echo '영화 백+프론트 라이브. http://15.135.240.116/ 와 :8888/swagger-ui/index.html'
        echo 'StockHub 톰캣은 이 Job이 안 건드렸어야 한다'
      }
    }
  }
}
