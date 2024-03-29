#!/usr/bin/env node
/* -*- mode: js2 -*- */

const express = require('express'),
      mime = require('express/node_modules/mime'),
      path = require('path');

// webapp mimetype is defined in the current release of node-mime, but
// it was not yet available for the older version of express we are using.
mime.define({
  "application/x-web-app-manifest+json": ['webapp']
});

var app = module.exports = express.createServer();

app.locals({
  ip_address: "0.0.0.0:3000"
});

// Configuration

app.configure(function(){
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res) {
  return res.render('index');
});

// run

if (!module.parent) {
  app.listen(process.env.PORT || 3000);
  console.log("Listening on port %d in %s mode", app.address().port, app.settings.env);
}
