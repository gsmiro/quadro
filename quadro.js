#!/usr/bin/env node
var lvl = require("level");

function _dbprop(ent,sfx){
  return ent +"."+sfx;
}

function _idx(ent){
  return _dbprop(ent,"index");
}
function _max(ent){
  return _dbprop(ent,"max");
}

function initDb(db,ents){
  var bch = db.batch();
  for(var ent in ents){
    bch = bch.put(ent,{}).put(_idx(ent),{}).put(_max(ent),0);
  }
  bch = bch.write(function(){

  });
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
    data = typeof data === 'string'?require(data):data;
    _self.db = initDb(db,data);
    for(var a in data){
      _self.entity(a,data[a]);
    }
    console.log(_self)
  });
  /*if(data)
    procData(this.db,typeof data === 'string'?require(data):data);*/
}

ctor.prototype = {
  _set:function(e,datarr){
    if(typeof e !== 'string')return;
    if(!this[e]){
      var arr = datarr && datarr.slice(0) || [];
      this[e] = {
        data:datarr,
        rules:{},
        put:function(data){
          return datarr.push(data);
        }
      }
    }
    return this[e];
  },
  entity:function(e,data){
    return this._set(e,data);
  },
  rule:function(r,e,v){
    if(v){
      var rec = this.recurrence(r)
      rec.rules[e] = v;
    }
  },
  recurrence:function(r,data){
    return this._set(r,data);
  },
  gen:function(){
    var ret = {};
    for(var r in this){
      var rl = this[r].rules
      var arr = [];
      for(var e in rl){
        var proc = rl[e].call(this,this[e].data);
        if(proc)arr.push(proc);
      }
      ret[r] = arr;
    }
    return ret;
  }
}

module.exports = ctor;
