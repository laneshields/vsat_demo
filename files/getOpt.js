// This will use the https module built into NodeJS
var https = require('https');

// The hostname or IP address of the 128T Conductor
var conductorHost = '192.168.2.100';
// The port that the 128T Conductor is using to listen for Web requests
var conductorPort = 443
// A valid administrator username
var user = 'admin';
// A the password for the administrator user
var password = '128Tadmin'

// The HTTP headers to be sent to the API
var RESTHeaders = {
    'Content-Type' : 'application/json',
    'Accept' : 'application/json'
    //'Content-Length' : Buffer.byteLength(RESTBody, 'utf8')
};

var RESTHeaders = {
    'Accept' : 'application/json',
    'Authorization' : 'Bearer ' + apiKey
};

function sesOptGetRequest(router, node, device_interface) {
  // An object containing the option settings for our REST request
  return RESTRequestOptions = {
      host : conductorHost,
      port : conductorPort,
      path : `/api/v1/config/candidate/authority/router/${router}/node/${node}/device-interface/${device_interface}/session-optimization`,
      // rejectUnauthorized : false is required when using self-signed certificates on the 128T Control
      rejectUnauthorized: false,
      method : 'GET',
      headers : RESTHeaders
  }
}

function sendREST(restRequest) {
  // Set up the HTTPS request using the above variables
  return getConfigRequest = https.request(restRequest, function(response) {
    // If we get a successful response...
    if (response.statusCode == 200) {
        // Output the returned config
        response.on('data', function(responseData) {
            var config = JSON.parse(responseData);
            // Print the config in prettyfied JSON format
            console.log(JSON.stringify(config, null, 2));
        });
    }
    // else we get an unsuccessful response...
    else {
        // write an error
        console.log("Unsuccessful. Status Code returned: ", response.statusCode);
    }
  });
}

/*
 Everything is set up...let's try it!
*/

const westRouter = 'west-128t';
const westNode = 'west-128t';
const westDi = 'west-vsat';
// Finish the REST request
rr = sendRest(sesOptGetRequest(westRouter, westNode, westDi));
rr.end();
// Handle any errors that might occurr
getConfigRequest.on('error', function(e) {
    console.error(e);
});
