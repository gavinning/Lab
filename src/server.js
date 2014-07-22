// by gavinning
// test server

var fs = require('fs');
var http = require('http');
var path = require('path');
var qs = require('querystring');
var argv = process.argv.slice(2)[0] || process.cwd();
var App;

function App(src){
	console.log(src)
	var app = function(req, res){
		var arr = req.url.split('?');
		var url = arr[0];
		var query = arr[1];

		// 存储get参数
		req.query = {};
		// 存储post data
		req.body = {};

		// 处理url参数
		if(query && !path.extname(url) || query && path.extname(url).slice(1).match(/html|htm|asp|jsp|php/)){
			req.query = qs.parse(query);
		}

		// 检测路由定义
		if(app.hash[req.method + ':' + url]){
			app.hash[req.method + ':' + url](req, res);
		}
		// 检测静态资源
		else if(path.join(src, url)){
			fs.readFile(path.join(src, url), function(e, data){
				if(e){
					console.log(e.message);
					res.writeHead(404);
					return res.end('404');
				}else{
					// 处理html文件
					path.extname(url) == '.html' ?
						res.writeHead(200, {'Content-Type': 'text/html'}):
						res.writeHead(200);
					return res.end(data);
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

	// app选项
	app.opt = {};


	app.set = function(key, value){
		if(!value) return;
		this.opt[key] = value;
	}

	app.post = function(url, callback){
		if(!callback) return;
		this.hash['POST:' + url] = callback;
	}

	app.get = function(url, callback){
		if(!callback) return this.opt[url];
		this.hash['GET:' + url] = callback;
	}

	return app;
}

App.create = function(src, port){
	var app = new App(src||__dirname);

	app.set('port', port || 3000);

	// eg: 路由定义
	app.get('/', function(req, res){
		res.end('hello linco.server');
	});

	port = app.get('port');

	http.createServer(app).listen(port);
	console.log('listen '+ port +', by ' + src);

	return app;
}

module.exports = App;















