#!/usr/bin/env node

var Qd = require('./quadro');
var q = new Qd('./teste.db');
for(var i = 0;i<10;i++)q.rule(i);
  
