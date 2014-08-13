#!/usr/bin/env node
var lvl = require("level");

function _dbprop(ent,sfx){
  return ent +"."+sfx;
}

function _idx(ent){
  return _dbprop(ent,"index");
}
function _max(ent){
  return _dbprop(ent,"index");
}

function initDb(db,ents){
  var bch = db.batch();
  for(var ent in ents){
    bch.put(ent,{}).put(ent+".max",0).put(ent+'.index');
  }
  bch.write();
  return db;
}

function procData(db,data){
  for(var ent in data){
    db.get(_max(ent),function(err,max){
      if(err)throw err;
      db.get(_idx(ent),function(err,idx){
        if(err)throw err;

      })
    });
  }
}

function ctor(db,data){
  var _self = this;
  lvl(typeof db === 'string'?db:'./quadro.db',{"valueEncoding":"json"},function(err,db){
    if(err)throw err;
    _self.db = initDb(db,data);
  });
  if(data)
    procData(this.db,typeof data === 'string'?require(data):data);
}

ctor.prototype = {
  rule:function(v){
    this.db.put('v',v,{},function(err){
      if(err)throw err;
      console.log(arguments);
    })
  }
}

module.exports = ctor;
