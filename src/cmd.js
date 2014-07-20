// for !window

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var cmd  = {
	makeCmd: function(cmd, source, target){
		return cmd + ' "' + source + '" "' + target + '"';
	},

	makeMethod: function(cmd, source, target, cb){
		exec(this.makeCmd(cmd, source, target), function(e, msg){
			if(e){
				console.log(source)
				console.log(target)
				console.log(e.message);
				return;
			}

			if(cb){
				cb(e, 'done: ' + target);
			}else{
				console.log('done: ' + target)
			}
		})
	},

	copy: function(source, target, cb){
		return this.makeMethod('cp -r', source, target, cb);
	},

	move: function(source, target, cb){
		return this.makeMethod('mv', source, target, cb);
	}


}

module.exports = cmd;