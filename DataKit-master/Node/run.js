/*jslint node: true, es5: true, nomen: true, regexp: true, indent: 2*/
"use strict";

require("./datakit").run({
  "secret": "270ce9f952d11722b0108d6b6f34538f3a3b20c1f6d048331d355f468267fe06",
  "salt": "thegrapespub",
  //for TOPBARAPP "mongoURI": 'mongodb://topBarAppTest:thegrapespub@localhost:27017/topBarApp',
  "mongoURI": 'mongodb://datakitTest:datakit123@localhost:27017/dataKitTest', //for Datakit test
  "port": 3000, // The port DataKit runs on
  //"path": "v1", // The root API path to append to the host, defauts to empty string
  "allowDestroy": false, // Flag if the server allows destroying entity collections
  "allowDrop": false, // Flag if the server allows db drop
  //"cert": "path/to/cert", // SSL certificate
  //"key": "path/to/key", // SSL key
  "express": function (app) { /* Add your custom configuration to the express app */}
});