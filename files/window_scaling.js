"use strict";

const task = require('child_process'); // Set up a shortcut var to spawn child processes

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
            console.log(error);
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
* Download a file using wget over two parallel paths
* @function
*/
function getScaling() {
  return osTask('sysctl', ['net.ipv4.tcp_window_scaling']);
}

function setScaling(size) {
  console.log("size: " + size);
  if (size === "large") {
    return osTask('sysctl', ['net.ipv4.tcp_window_scaling=1']);
  } else if (size === "small") {
    return osTask('sysctl', ['net.ipv4.tcp_window_scaling=0']);
  }
}

module.exports = {
  getScaling : (callback)=>{
    getScaling()
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
  setScaling : (size, callback)=>{
    setScaling(size)
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
