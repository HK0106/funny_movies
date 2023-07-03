Introduction:
- This app use to share and view video shared, notice when new user share new video
Prerequisites: 
- Node v18.14.1
- Docker
- docker-compose
Installation & Configuration:
- git clone https://github.com/HK0106/funny_movies.git
- docker-compose up -d

Database Setup: runing docker mysql v 5.7.40 with database funnymovies
- docker run -d -p 3306:3306 --name mysql-5.7.40 \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e MYSQL_DATABASE=funnymovies \
  mysql:5.7.40
Running the Application: 
- cd .\backend\
- npm install
- to strart server run : npm run start:dev
- to run test : npm run test:watch
Docker Deployment: 
- make sure in root folder then run docker-compose up -d
Usage: 
- User login
- user login with email not register -> register new
- user login with wrong password
- list video
- share video
Troubleshooting: 
