"use strict";
/* eslint-env node, mocha */
var helloHandler = require("../myService/handler");
var assert = require("assert");
describe("Sample Tests", function() {
  describe("Greetings", function() {
    it("I greet the Yow West audience", function() {
      helloHandler.hello({}, {}, (_, response)=>{
        assert.equal(200,  response.statusCode);
        let body = JSON.parse(response.body);
        assert.equal("Hello, YOW West!",  body.message);
      });
    });
  });
});
