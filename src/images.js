// 处理图片
/*
 * 1.压缩：尺寸，质量
 * 2.水印：增删
 * 3.筛选：尺寸最小值，图片数量最小值，图片数量最大值
 *
 */

var fs = require('fs');
var path = require('path');
var exec = require('child_process');
var lib = require('./lib');
var Canvas = require('canvas');
var Image = Canvas.Image;

var image = function(opt){
	var DB, child;

	child = function(url, output){
		child.src = url;
		child.output = output || 'out.png';
		return child;
	}

	// 图片处理参数
	child.opt = {
		mark: null,
		min: 1,
		log: false
	}

	// 数据存储
	child.db = {};

	// 图片压缩比，for jpeg
	child.min = function(num){
		this.opt.min = num;
		return this;
	}

	// 图片压缩宽度
	child.width = function(num){
		this.opt.width = num;
		return this;
	}

	// 图片最大宽度
	child.maxWidth = function(num){
		this.opt.maxWidth = num;
		return this;
	}

	child.mark = function(url){
		this.opt.mark = url;
		return this;
	}

	child.getMark = function(){
		var img;

		// 是否插入水印
		if(child.opt.mark && (fs.exists(child.opt.mark) || fs.existsSync(path.join(__dirname, child.opt.mark)))){
			img = new Image;
			img.src = fs.readFileSync(child.opt.mark);
			return img;
		}

		return null;
	};

	child.log = function(msg){
		msg.time ? "" : msg.time = new Date().getTime();
		child.db.log.insert(msg, function(e){
			if(e) console.log('insert log error: ' + e.message)
		})
	}

	// 执行压缩
	child.run = function(callback){
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
			out = fs.createWriteStream(obj.output);
			stream = canvas.pngStream();

			// 插入图片
			ctx.drawImage(img, 0, 0, obj.opt.width, obj.opt.height);
			// 插入水印
			obj._mark ?
				ctx.drawImage(obj._mark, canvas.width - obj._mark.width, canvas.height - obj._mark.height, obj._mark.width, obj._mark.height):"";


			// 输出图片
			stream.on('data', function(chunk){
				out.write(chunk);
			});

			// 输出完成
			stream.on('end', function(){
				var log = {
					filename: path.basename(obj.src),
					source: obj.src,
					target: obj.output,
					time: new Date().getTime()
				};

				callback ?
					callback():
					console.log('filename: '+log.filename, ', target: ' + log.target);

				child.log(log);
			});

		})
	}

	child.init = function(){
		console.log('linco.lab image is init');

		// 合并参数
		lib.extend(child.opt, opt||{});

		// 获取水印信息
		child._mark = child.getMark();

		// 是否打日志
		if(child.opt.log){
			DB = require('nedb');
			child.db.log = new DB({filename: './db/log.db', autoload: true});
		}

	}();

	return child;
}


module.exports = image;

























