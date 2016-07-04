![alt tag](https://d12m9erqbesehq.cloudfront.net/wp-content/uploads/2016/04/30152042/event-smart-rest-api.png)

Includes:

1-Vanilla Javascript REST API (No NPM libraries used)

2-Test suite (using libraries)

Start Server:

node server

Run Mocha Chai tests:

npm test

Routes:

api/register

api/auth

api/protected

api/users

Or use the following curl commands: (Replace token with your token)

curl -X POST -d 'username=foo' -d 'password=bar' http://localhost:1337/api/register

curl -X POST -d 'username=foo' -d 'password=bar' http://localhost:1337/api/auth

curl -X GET -H "Authorization: Token 0C5qd4bhkHayUxPMFz6UXkBwMDsMakj0" http://localhost:1337/api/protected

curl -X GET -H "Authorization: Token 0C5qd4bhkHayUxPMFz6UXkBwMDsMakj0" http://localhost:1337/api/users

//Time Line Dev Log - Chris

//Hour 1 Working APi

//Hour 2 State with user object reg + checks

//Hour 3 JWT Token 

//Hour 4 Refactoring
