// 处理图片

var fs = require('fs');
var path = require('path');
var exec = require('child_process');
var Canvas = require('canvas');
var Image = Canvas.Image;

var image = function(){
	var img = function(url){
		img.src = url;
		return img;
	}

	// 图片处理参数
	img.opt = {};

	// 图片压缩比，for jpeg
	img.min = function(num){
		this.opt.min = num;
		return this;
	}

	// 图片压缩宽度
	img.width = function(num){
		this.opt.width = num;
		return this;
	}

	// 执行压缩
	img.run = function(callback){
		var obj = this;

		fs.readFile(this.src, function(e, buffer){
			if(e) throw e;

			var gap, canvas, ctx, out, stream, img;

			img = new Image;
			img.src = buffer;

			// 计算压缩比
			gap = obj.opt.width/img.width;
			// 计算宽度
			obj.opt.height = img.height * gap;

			// 设置画布
			canvas = new Canvas(obj.opt.width, obj.opt.height);
			ctx = canvas.getContext('2d');

			// 设置输出路径
			out = fs.createWriteStream('./out.png');
			stream = canvas.pngStream();

			// 插入图片
			ctx.drawImage(img, 0, 0, obj.opt.width, obj.opt.height);

			stream.on('data', function(chunk){
				out.write(chunk);
			});

			// Save
			stream.on('end', function(){
				return callback ?
					callback():
					console.log('out.png saved');
			});

		})
	}

	return img;
}


module.exports = image;

























