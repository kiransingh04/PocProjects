var express=require('express');
var app=express();
app.get('/',function(req,res)
{
res.send('Hello World!');
});
var server=app.listen(3001,function() {});

// var http = require('http');

// var server = http.createServer(function(req, res) {
// res.writeHead(200);
// res.end('Hi everybody!');
// });
// server.listen(8080);