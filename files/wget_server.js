"use strict";

// call the packages we need
var express    = require('express')         // call express
var app        = express();                 // define our app using express
var router = express.Router();              // get an instance of the express Router
var wget = require('./wget');               // File downloader
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const port = process.env.PORT || 8000;        // set our port
const svr_resource = 'http://30.30.30.30:8000/10M'        // wget resource for SVR path
//const ipsec_resource = '192.168.101.15/500M'  // wget resource for IPSec path

app.use(express.static('client'));            // serve client HTML

io.on('connection', function(client){
  console.log('socket.io client connnected');
});

/* ROUTES FOR OUR API
*  =============================================================================
*/

// test route to make sure everything is working (GET /api)
router.get('/', function(req, res) {
    res.json({ message: 'success!' });
});

/* REST resource /api/downloadFile
*  =============================================================================
*  This resource accepts POST method to start a download test.
*
*/
router.route('/downloadFile')
  .get((req, res)=> {
    res.status(501).send('Not implemented');
  })
  // POST starts downloads
  .post((req, res)=> {
    console.log("request to download file");
    wget.wget(svr_resource, (err, results)=>{
      if (err) {
        console.log(err);
        res.status(500).send('Unable to start test');
      } else {
        console.log("SVR results: " + results);
        var split_results = results.split('\n');
        var svr_time = split_results[split_results.length-2]
        svr_time = svr_time.replace(/"/g,"");
        console.log("SVR time: " + svr_time);
        io.emit('svr', svr_time);
      }
    });
/*
    wget.wget(ipsec_resource, (err, results)=>{
      if (err) {
        console.log(err);
        res.status(500).send('Unable to start test');
      } else {
        console.log("IPSec results: " + results);
        var split_results = results.split('\n');
        var ipsec_time = split_results[split_results.length-2]
        ipsec_time = ipsec_time.replace(/"/g,"");
        console.log("IPSec time: " + ipsec_time);
        io.emit('ipsec', ipsec_time);
      }
    });
*/
    res.status(202).send('wget started');
  })

/* REGISTER OUR ROUTES
*  =============================================================================
*  all of our routes will be prefixed with /api
*/
app.use('/api', router);

/* START THE SERVER
*  =============================================================================
*/
server.listen(port);
