var http = require('http');  
var url = require('url');
var querystring = require('querystring');
var state = []; //state.push({username:'foo',password:'bar'});
var post;
var server = http.createServer();
var date = new Date();

//Functions
function getUser(name) {
    var user = {};

    state.forEach(function(value, index) {
        if (value.username == name) {
            user = {
                'username': value.username,
                'password': value.password
            };
        }
    });

    if (user) {
        return user;
    } else {
        return false;
    }
}

function checkToken(submittedToken) {
    var authorised = false;
    console.log("TOKEN CHECK " + JSON.stringify(state));

    state.forEach(function(value, index) {
        var userToken = "";

        if (value.token)
            userToken = value.token.toString().replace(/"/g, "");

        submittedToken = submittedToken.replace(/"/g, "");
        userToken = userToken.replace(/"/g, "");

        console.log(userToken + "-" + submittedToken);
        var match = (userToken.toString() === submittedToken.toString());

        if (match) {
            authorised = true;
        }

    });

    return authorised;

}

function updateToken(name, token) {
    var user = {};

    state.forEach(function(value, index) {
        if (value.username == name) {
            value.token = token;
            value.tokenDate = new Date();
        }
    });

}


//Server
server.on('request', function(request, response) {

    var url = request.url;
    console.log(url);
    var body = [];

    request.on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function() {
        body = Buffer.concat(body);
        var body2 = [];

        var params = [];

        body = body.toString().replace(/['"]+/g, '').split("&")


        if (url == '/api/register') {
            var param1 = "";
            var param2 = "";


            if (body[0])
                param1 = body[0].split("=")[1];
            if (body[1])
                param2 = body[1].split("=")[1];

            var user = param1;
            var password = param2;
            var userObject = {
                'username': user,
                'password': password
            };

            console.log(JSON.stringify(userObject));

            function userExists() {
                var match = false;

                state.forEach(function(value, index) {
                    if (value.username == "foo") {
                        match = true;
                    }
                });

                return match;
            }

            if (!userExists()) {
                state.push(userObject);
                response.end('User Created');
            } else {
                response.end('User already Exists :(');
                //request.end();
            }
            console.log(JSON.stringify(state));
        }
        45

        if (url == '/api/protected') {

            if (!request.headers.authorization)
                return response.end('THIS DATA IS PROTECTED (Permission Denied) - No headers');

            var token = JSON.stringify(request.headers.authorization).substring(7);
            console.log("Token submitted:" + token);
            console.log(JSON.stringify(state));

            if (checkToken(token)) {
                response.end('THIS DATA IS PROTECTED (Permission Granted)');
            } else {
                response.end('THIS DATA IS PROTECTED (Permission Denied)');
            }
        }

        if (url == '/api/users') {

            if (!request.headers.authorization)
                return response.end('THIS DATA IS PROTECTED (Permission Denied)');

            var token = JSON.stringify(request.headers.authorization).substring(7);
            console.log("Token submitted:" + token);
            console.log(JSON.stringify(state));

            if (checkToken(token)) {
                var usernames = [];
                state.forEach(function(value, index) {
                    if (value.username != "") {
                        usernames.push(value.username);
                    }
                });
                response.end(usernames.toString());
            } else {
                response.end('THIS DATA IS PROTECTED (Permission Denied)');
            }
        }




        if (url == '/api/auth') {
            if (body[0])
                param1 = body[0].split("=")[1];
            if (body[1])
                param2 = body[1].split("=")[1];

            var user = param1;
            var password = param2;
            var userObject = getUser(user);

            if (userObject.password == password) {

                var token = randomString();
                updateToken(user, token);
                response.end('Your token is ' + token);
                console.log(JSON.stringify(state));
            } else {
                response.end('Credentials Incorrect');
            }
        } else {
            response.end('404');
        }
    });

    function randomString() {
        var length = 32;
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
    var rString = randomString();

}).listen(1337);
console.log('Server running at http://127.0.0.1:1337/');

// Token Expiry Check
setInterval(function() {

    console.log("Checking token timestamps, removing old tokens.");

    state.forEach(function(value, index) {

        var old = value.tokenDate; //Date comparison  

        if (Math.floor((new Date() - old) / 60000) > 0) {
            value.token = "";
            console.log("Token check : " + value.username + " (OLD) [REMOVING]");

        } else {
            console.log("Token check : " + value.username + " [DONE]");
        }
    });
    console.log(JSON.stringify(state));
}, 100000);