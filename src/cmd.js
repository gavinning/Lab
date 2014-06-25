/*
 * cmd.js v0.0.1
 * Base library for lib
 * Author, gavinning
 * Home, www.ilinco.com
 */

var fs = require('fs');
var exec = require('child_process').exec;
var lib = require('./lib');
var OS = require('os').type();
var isWin = OS == 'Windows_NT';

var CMDHash = {};

if(isWin){
	CMDHash.cp = 'copy';
	CMDHash.xcp = 'xcopy';
	CMDHash.mv = 'move';
	CMDHash.ls = 'dir';
}else{
	CMDHash.cp = 'cp';
	CMDHash.mv = 'mv';
	CMDHash.ls = 'ls';
};

function Cmd(){}

Cmd.prototype = {
	exec: function(cmd, callback){
		exec(cmd, function(e, msg){
			callback ? callback(e, msg) : "";
		})
	},

	command: function(){
		var cmd = arguments[0];
		var arr = [].slice.call(arguments, 1);//arguments.slice(1);
		var source = '"' +　arr.join('" "') + '"';
		return cmd + ' ' + source;
	},

	move: function(source, target, callback){
		this.exec(this.command(CMDHash.mv, source, target), callback)
	},

	copy: function(source, target, callback){
		var cp = this.command(CMDHash.cp, source, target);
		var xcp = this.command(CMDHash.xcp + ' /i /e', source, target);

		isWin?
			lib.isDir(source)?
				this.exec(xcp, callback):
				this._copy(source, target, callback):
			this.exec(cp, callback);
	},

	_copy: function(source, target, callback){
		console.log(source, target)
		var rs = fs.createReadStream(source);
		var ws = fs.createWriteStream(target);

		rs.on('data', function(chunk){
			ws.write(chunk)
		})
		rs.on('end', function(){
			callback(null, 'success')
		})
	},

	test: function(callback){
		this.exec('ls', callback);
	}
}

module.exports = Cmd;

// var cmd = new Cmd;

// cmd.copy('f:\\a', 'f:\\b', function(){
// 	console.log(arguments)
// })

