// 删除重复的文件夹

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

// 源会被删除重复文件夹
var source = "D:\\imgData\\mark";
var target = "D:\\imgData\\nomark";

var _repeat = [];

function repeat(){

	fs.readdir(source, function(e, _source){

		fs.readdir(target, function(e, _target){
			_source.forEach(function(item){

				if(_target.indexOf(item) >= 0){
					exec('rd /s /q ' + '"' + path.join(source, item) + '"')
				}
			})

			console.log(_repeat, _repeat.length)
		})

	})

}

repeat();