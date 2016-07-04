var chalk = require('chalk'); 
var querystring = require('querystring');var http = require('http');
var assert = require('chai').assert; //Readibility for TDD or BDD 
var Promise = require("bluebird"); // Promises
var restify = require('restify') ; // REST Server 
var i, output = ""; 
var start = new Date().getTime(); 
var paramater = process.argv[2]; 
var integration = true;
 var Client = require('node-rest-client').Client;
  
 chalk.bug    = function(data){ if(isJSON){ console.log("\n" + chalk.bgRed(JSON.stringify(data)));}else{console.log("\n" + chalk.bgRed(data));}};
chalk.data    = function(data){ if(isJSON){ console.log("\n" + chalk.blue(JSON.stringify(data)));}else{console.log("\n" + chalk.blue(data));}};
chalk.test    = function(){ console.log("\n" + chalk.green("Logging Working")); };  
chalk.title   = function(data){ if(isJSON){ console.log("\n" + chalk.yellow(JSON.stringify(data)));}else{console.log("\n" + chalk.yellow(data));}};
chalk.command = function(data){ if(isJSON){ console.log("\n" + chalk.cyan(JSON.stringify(data)));}else{console.log("\n" + chalk.cyan(data));}};
chalk.success = function(data){ if(isJSON){ console.log("\n" + chalk.green(JSON.stringify(data)));}else{console.log("\n" + chalk.green(data));}};
 
var args = "'username=foo'&'password=bar'";

var randy = Math.floor(Math.random()*1000);

var post_data = querystring.stringify({
      'username' : 'foo',
      'password': 'bar' 
  });


var theName = 'test'+randy;


var post_data_random = querystring.stringify({
      'username' : theName,
      'password': 'bar' ,
      'token':''
  });

var post_options = {
      host: '127.0.0.1',
      port: '1337',
      path: '/api/register',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };

var post_options_random = {
      host: '127.0.0.1',
      port: '1337',
      path: '/api/register',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data_random)
      }
  };

  var post_options_random_auth = {
      host: '127.0.0.1',
      port: '1337',
      path: '/api/auth',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data_random)
      }
  };




//console.log(JSON.stringify(data_random));

function getChron(){ //For timing the test
    var end = new Date().getTime(); 
    var timeTaken = (end - start) /1000;
    return timeTaken;  
} 

 
  var environment = {
  user : process.env.API_USER_DEV,
  password : process.env.API_PASSWORD_DEV,
  connectString : process.env.API_CONNECTIONSTRING_DEV ,
    environment : 'test'}
 

// START CLIENT
var client = restify.createJsonClient({
    version: '*',
    url: 'http://127.0.0.1:1337'
}) ;

/*
var args = { 
            'grant_type'    : 'password',
            'bearer-only'   : 'true',
            'username'      : 'foo',
            'password'      : 'bar',
            'client_id'     : 'security-admin-console' ,
            'Content-type'  : 'application/x-www-form-urlencoded' 
            }; 
*/

client.headers = args;


function isJSON (jsonString){
    try {
        var o = JSON.parse(jsonString); 
        if (o && typeof o === "object" && o !== null) {
            return true;
        }
    }
    catch (e) { } 
    return false;
}
  
///////////////////////
// INTEGRATION TESTS //
///////////////////////

chalk.title("STARTING UNIT TESTS"); 

             
describe('/api/register', function() {
    it('should be able to register a new user', function(done) {

        var post_req = http.request(post_options_random, function(res) {
          res.setEncoding('utf8');
              res.on('data', function (chunk) {
                   //console.log('Response: ' + chunk);
                    assert.equal( chunk , 'User Created' ); 
                    chalk.success("/api/register a user: " + chunk); 
                    done();
                    this.end();
              });
        });
 
        post_req.write(post_data_random);
        post_req.end(); 
    });
});


var token;

describe('/api/auth', function() {
    it('should be able to get access token', function(done) {
      var post_req = http.request(post_options_random_auth, function(res) {
          res.setEncoding('utf8');
              res.on('data', function (chunk) { 

                token = chunk.substring(0,13) ;

                assert.equal( token , 'Your token is' ); 
                chalk.success("/api/auth a user: " + chunk); 
 
                done();
                this.end();

 
              });
      });
     post_req.write(post_data_random);
     post_req.end(); 
    });
});

 
describe('/api/auth', function() {
    it('should be able to get access token and access protected area', function(done) {
      var post_req = http.request(post_options_random_auth, function(res) {
          res.setEncoding('utf8');
              res.on('data', function (chunk) { 

                response = chunk.substring(0,13) ;
                    token = chunk.substring(14) ;

               assert.equal( response , 'Your token is' ); 
                chalk.success("/api/auth a user: " + chunk); 
 
              });

 
                 res.on('end', function (chunk) { 



                              //post_options_random_auth.path = '/api/protected';
                               //post_data_random += token;
                            
                        
  var post_options_random_protected = {
      host: '127.0.0.1',
      port: '1337',
      path: '/api/protected',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': ' Token '  + token,
          'Content-Length': Buffer.byteLength(post_data_random)
      }
  };
                            // console.log(  post_options_random_auth  );
                               console.log("TRYING AGAIN " + JSON.stringify( post_options_random_protected   ));
              
                                  var post_req2 = http.request(post_options_random_protected, function(res) {
                                      res.setEncoding('utf8');
                                          res.on('data', function (chunk) { 
                                            console.log("INSIDE");
              

                                            assert.equal( chunk , 'THIS DATA IS PROTECTED (Permission Granted)' ); 
                                            chalk.success("/api/protected a user: " + chunk); 
                                            done();
                                             
                                          });
                                  });
                                   
                                post_req2.write(post_data_random);
                                post_req2.end();
                               });





      });
     post_req.write(post_data_random);
      post_req.end();
    });
});







describe('/api/auth', function() {
    it('should be able to get access token and access protected area to retrieve users', function(done) {
      var post_req = http.request(post_options_random_auth, function(res) {
          res.setEncoding('utf8');
              res.on('data', function (chunk) { 

                response = chunk.substring(0,13) ;
                    token = chunk.substring(14) ;

               assert.equal( response , 'Your token is' ); 
                chalk.success("/api/auth a user: " + chunk); 
 
              });

 
                 res.on('end', function (chunk) { 


 
                            
                        
  var post_options_random_protected = {
      host: '127.0.0.1',
      port: '1337',
      path: '/api/users',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': ' Token '  + token,
          'Content-Length': Buffer.byteLength(post_data_random)
      }
  };
                            // console.log(  post_options_random_auth  );
                              
                                  var post_req2 = http.request(post_options_random_protected, function(res) {
                                      res.setEncoding('utf8');
                                          res.on('data', function (chunk) { 
                                            console.log("INSIDE");
              

                                            assert.isNotNull( chunk  ); 
                                            chalk.success("/api/users : " + chunk); 
                                            done();
                                             
                                          });
                                  });
                                   
                                post_req2.write(post_data_random);
                                post_req2.end();
                               });





      });
     post_req.write(post_data_random);
      post_req.end();
    });
});

 
  /*

    describe('/api/register', function() {
        it('should be able to register', function(done) {
            client.post('/api/register', args, function(err, req, res, obj) {
                assert.isNotNull( obj , 'Null response from /api/register.' ); 
                chalk.success("/api/register tested"); 
                done();
            });
        });
    }); 
*/