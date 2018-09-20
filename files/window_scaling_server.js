"use strict";

// call the packages we need
var express    = require('express')         // call express
var app        = express();                 // define our app using express
var router = express.Router();              // get an instance of the express Router
var ws = require('./window_scaling');               // File downloader
var server = require('http').createServer(app);

const port = process.env.PORT || 8001;        // set our port


/* ROUTES FOR OUR API
*  =============================================================================
*/

// test route to make sure everything is working (GET /api)
router.get('/', function(req, res) {
    res.json({ message: 'success!' });
});

/* REST resource /api/window_scaling
*  =============================================================================
*  This resource accepts GET method to return the status of window scaling size
*
*/
router.route('/windowScale')
  .get((req, res)=> {
    ws.getScaling((err, results)=>{
      if (err) {
        console.log(err);
        res.status(500).send('Error getting window scaling');
      } else {
        console.log("getScaling results: " + results);
        var split_results = results.split('=');
        var window_scale = split_results[split_results.length-1].replace(/\n/,'').trim();
        console.log("window scale: " + window_scale);
        if (window_scale === "1") {
          res.json({size: "large"});
        } else if (window_scale === "0") {
          res.json({size: "small"});
        } else {
          res.status(500).send('Unexpected Results');
        }
      }
    })
  })
  .post((req, res)=> {
    ws.setScaling(req.query.size, (err, results)=>{
      if (err) {
        console.log(err);
        res.status(500).send('Server Error');
      } else {
        console.log("setScaling results: " + results);
        var split_results = results.split('=');
        var window_scale = split_results[split_results.length-1].replace(/\n/,'').trim();
        if (window_scale === "1") {
          res.json({size: "large"});
        } else if (window_scale === "0") {
          res.json({size: "small"});
        } else {
          res.status(500).send('Unexpected Results');
        }
      }
    });
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
