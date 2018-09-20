var wsc = {
  getSize : function(callback){
    var rest = new XMLHttpRequest();
    rest.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        try {
          var r = JSON.parse(this.response);
          console.log("Initial window scaling : " + r.size);
          callback(null, r);
        } catch (e) {
          console.log("Results parse error: " + e);
          callback(e, null);
        }
      } else {
        callback("getSize request failed with " + this.status, null);
      }
   };
   rest.open("GET", "/westSize/api/windowScale");
   rest.send();
  },
  setSize : function(size, callback){
    var rest = new XMLHttpRequest();
    rest.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
          callback(null, "success");
      } else {
        callback("setSize request failed with " + this.status, null);
      }
    };
    rest.open("POST", "/westSize/api/windowScale?size=" + size);
    rest.send();
  }
}
