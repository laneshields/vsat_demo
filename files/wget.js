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
            resolve(stderr);
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
function runWget(resource) {
  console.log(`Starting wget`);
  return osTask('/usr/bin/time', ['--format="%e"', 'wget', '-nv', '-O', '/dev/null', resource]);
}

module.exports = {
  wget : (resource, callback)=>{
    runWget(resource)
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
