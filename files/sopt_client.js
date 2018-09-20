var sopt = {
  getState : function(callback){
    var rest = new XMLHttpRequest();
    rest.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        try {
          var r = JSON.parse(this.response);
          console.log("Initial Session Opt state : " + r.state);
          callback(null, r);
        } catch (e) {
          console.log("Results parse error: " + e);
          callback(e, null);
        }
      } else {
        callback("getState request failed with " + this.status, null);
      }
   };
   rest.open("GET", "/configure/api/t128Config");
   rest.send();
  },
  setState : function(state, callback){
    var rest = new XMLHttpRequest();
    rest.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
          callback(null, "success");
      } else {
        callback("setState request failed with " + this.status, null);
      }
    };
    rest.open("POST", "/configure/api/t128Config?state=" + state);
    rest.send();
  }
}
