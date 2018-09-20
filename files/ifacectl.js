"use strict";
/**
* Bit of ES to handle manipulating state of a network interface
*/

const fs = require('fs');              // Requires the fs module to read interface state from file system
//const iface="enp0s8";                  // Interface to control
const task = require('child_process'); // Set up a shortcut var to spawn child processes

/**
* Fetch interface state.
* @function
* @param {string} intf - The name of an interface.
* @returns {Promise} Promise for results of interface state.
*/
function intGet(intf){

  return new Promise(
    (resolve, reject)=> {
      fs.readFile(`/sys/class/net/${intf}/operstate`, 'utf8', (err, newInterfaceState) => {
        if (err) {
          // something when wrong, reject the promise with the error
          reject(err);
        } else {
          newInterfaceState = newInterfaceState.trim();
          resolve(newInterfaceState);
        }
      });
    }
  );
}

/**
* Run a command in the OS.
* @function
* @param {string} cmd - The name the command to run.
* @param {Array<string>} args - Command arguments.
* @returns {Promise} Promise for results of the command.
*/
function osTask(cmd, args = [] ){
  return new Promise(
    (resolve, reject)=> {
      if (!Array.isArray(args)) {
        reject('args not an array.');
      } else {
        task.execFile(cmd, args, (error, stdout, stderr) => {
          if (error) {
            //console.log(error);
            reject(stderr);
          } else {
            resolve(stdout);
          }
        });
      }
    }
  );
}


/**
* Manipulate interface state
* @function
* @param {string} intf - The name of an interface.
* @param {string} state - up or down state to apply to interface.
*/
function intSet(intf, state) {
  // state is supplied, use it
  if (state === "up" || state === "down") {
    console.log(`Turning ${intf} ${state}.`);
    // return the osTask promise
    return osTask('ip', ['link', 'set', intf, state]);
  }
  // state not supplied. toggle the interface based on current state
  else {
    // return the intGet promise, with the osTask promise nested
    return intGet(intf)
      .then(
        (state)=>{
          if (state == 'up') {
            console.log("Interface up...turning down.");
            return osTask('ip', ['link', 'set', intf, 'down']);
          } else if (state == 'down') {
            console.log("Interface down...turning up.");
            return osTask('ip', ['link', 'set', intf, 'up']);
          }
        }
      )
  }
}

/**
* Fetch interface netem filter.
* @function
* @param {string} intf - The name of an interface.
* @returns {Promise} Promise for current netem filter.
*/
function netemGet(intf){
  return osTask('tc', ['qdisc', 'show', 'dev', intf]);
}

/**
* Manipulate interface netem filter
* @function
* @param {string} intf - The name of an interface.
* @param {string} loss - The amount of packet loss as a percentage
* @param {string} delay - The amount of delay including unit (ms or s)
* @param {string} jitter - The amount of jitter including unit (ms or s)
*/
function netemSet(intf, loss, delay, jitter) {
  console.log(`Configuring netem for ${intf} with ${loss}% loss, ${delay}ms delay, and ${jitter}ms jitter.`);
  // return the osTask promise
  return osTask('tc', ['qdisc', 'change', 'dev', intf, 'root', 'netem', 'loss', loss, 'delay', delay + 'ms', jitter + 'ms']);
}

module.exports = {
  getState : (iface, callback)=>{
    intGet(iface)
      .then(
        (results)=> {
          callback(null, results);
        }
      )
      .catch(
        (error)=> {
          callback(error, null);
        }
      );
  },
  setState : (iface, state, callback)=>{
    intSet(iface, state)
      .then(
        (results)=> {
          callback(null);
        }
      )
      .catch(
        (error)=> {
          callback(error);
        }
      );
  },
  getNetem : (iface, callback)=>{
    netemGet(iface)
      .then(
        (results)=> {
          callback(null, results);
        }
      )
      .catch(
        (error)=> {
          callback(error, null);
        }
      );
  },
  setNetem : (iface, loss, delay, jitter, callback)=>{
    netemSet(iface, loss, delay, jitter)
      .then(
        (results)=> {
          callback(null, results);
        }
      )
      .catch(
        (error)=> {
          callback(error, null);
        }
      );
  }
}
