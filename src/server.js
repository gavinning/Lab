#!/usr/bin/env node

var fs = require('fs');
var http = require('http');
var path = require('path');
var argv = process.argv.slice(2)[0] || process.cwd();
var App, app;

function App(){
	var app = function(req, res){

		// 检测路由定义
		if(app.hash[req.method + ':' + req.url]){
			app.hash[req.method + ':' + req.url](req, res);
		}
		// 检测静态资源
		else if(path.join(argv, req.url)){
			fs.readFile(path.join(argv, req.url), function(e, data){
				if(e){
					console.log(e.message)
					res.writeHead(404);
					return res.end('404');
				}else{
					res.writeHead(200);
					res.end(data);
				}
			})
		}
		// 返回404
		else{
			res.writeHead(404);
			return res.end('404');
		}
	}

	// 存储路由
	app.hash = {};

	app.post = function(url, callback){
		this.hash['POST:' + url] = callback;
	}

	app.get = function(url, callback){
		this.hash['GET:' + url] = callback;
	}

	return app;
}

app = new App();

// eg: 路由定义
// app.get('/', function(req, res){
// 	res.end('hello world');
// })

http.createServer(app).listen(3000);
console.log('listen 3000, by ' + argv);