var fs = require('fs');
var path = require('path');
var lib = require('linco.lab').lib;
var Image = require('./images');
var img, opt;

var src = '/Users/gavinning/Pictures/test';


opt = {
	mark: 'Users/gavinning/Pictures/mark.png',
	min : 1,
	log : false,
	maxWidth: 950
}

img = new Image(opt);
console.log(img._mark)
img('/Users/gavinning/Pictures/3.jpg', '/Users/gavinning/Pictures/out.jpg').width(750).run();

// function dir(){

// }


// var folders = fs.readdirSync(src);

// folders.forEach(function(item){
// 	var _src = path.join(src, item);
// 	if(!lib.isDir(_src)) return;

// 	var pics = fs.readdirSync(_src);

// 	pics.forEach(function(pic){
// 		var _pic = path.join(_src, pic);
// 		if(!_pic.match(/jpg|png/)) return;

// 		console.log(pic)
// 	})
// })
