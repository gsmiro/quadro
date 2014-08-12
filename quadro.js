#!/usr/bin/env node
var db = require("level")('./quadro.db');

var qd = function(){

}
qd.exports.people = function(obj,cb){
  if(typeof obj === undefined)return db.get("people",cb);
  if(typeof obj === 'string'){
    obj = require(obj);
  }

  return db.put("people",obj,cb);
}
qd.exports.rules = 
