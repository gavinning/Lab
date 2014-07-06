// 处理图片

var fs = require('fs');
var path = require('path');
var exec = require('child_process');


function image(){
	var img = function(url){
		return fs.readFileSync(url)
	}

	



	return img;
}

var img = new image();

var a = img('m.png')
console.log(a)