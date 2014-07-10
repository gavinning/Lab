// 处理图片
/*
 * 1.压缩：尺寸，质量
 * 2.水印：增删
 * 3.筛选：尺寸最小值，图片数量最小值，图片数量最大值
 *
 */

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
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
	// 下面列出的参数将会被得到验证和处理
	// 处理顺序根据下列参数排序
	child.opt = {
		// 过滤
		// 高级过滤模式
		// 过滤图片数量，指定分辨率的图片
		// 可移动到指定的目录
		// 由child.proFilter()处理
		isFilter: false,
		// 高清宽度
		HDWidth: 1400,
		// 高清数量
		HDLength: 8,

		// 图片宽度是否处理
		width: null,
		// 图片是否限制最大宽度
		maxWidth: null,
		// 是否有水印
		mark: null,
		// 图片质量，仅jpeg有效 0-1
		min: 1,

		// 是否打日志
		log: false
	}


	// 数据存储
	child.db = {};

	// ！参数设置类方法
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

	// ！功能实现类方法
	// 获取水印图片信息并缓存
	child.getMark = function(){
		var img;

// 水印检测出问题
console.log(fs.existsSync(child.opt.mark))
		// 是否插入水印
		if(child.opt.mark && (fs.existsSync(child.opt.mark) || fs.existsSync(path.join(__dirname, child.opt.mark)))){
			img = new Image;
			img.src = fs.readFileSync(child.opt.mark);
			return img;
		}

		return null;
	};

	// 记录日志
	child.log = function(msg){
		if(!this.opt.log) return;
		msg.time ? "" : msg.time = new Date().getTime();
		child.db.log.insert(msg, function(e){
			if(e) console.log('insert log error: ' + e.message)
		})
	}

	// 读图回调，简化run方法
	child.read = function(callback){
		fs.readFile(this.src, function(e, buffer){
			if(e) throw e;
			callback(child, buffer)
		})
	}

	// 创建需要处理的img对象
	child.createImg = function(buffer){
		var img = new Image;
		img.src = buffer;
		return img;
	}

	// 创建canvas对象
	child.canvas = function(img){
		var gap, canvas;

		// 计算压缩比
		gap = this.opt.width/img.width;
		// 计算宽度
		this.opt.height = img.height * gap;

		// 设置画布
		canvas = new Canvas(this.opt.width, this.opt.height);
		
		return canvas;
	}

	// 处理图片，所有处理条件在此方法里进行
	child.handleImg = function(canvas, img){
		var ctx = canvas.getContext('2d');

		// 插入图片
		ctx.drawImage(img, 0, 0, this.opt.width, this.opt.height);
		// 插入水印
		this._mark ?
			ctx.drawImage(this._mark, canvas.width - this._mark.width, canvas.height - this._mark.height, this._mark.width, this._mark.height):"";

	}

	// 输出图片
	child.outputImg = function(canvas, callback){
		var out, stream;

		// 设置输出路径
		out = fs.createWriteStream(child.output);
		
		// 检测是否为符合要求的图片
		if(!this.src.match(/png$|jpg$/)) return console.log(this.src + ' is not pic');

		// 设置png输出
		if(path.extname(this.src) == '.png')
			stream = canvas.pngStream();

		// 设置jpg输出
		if(path.extname(this.src) == '.jpg')
			stream = canvas.jpegStream({
			    bufsize: 4096 // output buffer size in bytes, default: 4096
			  , quality: this.opt.min * 100 // JPEG quality (0-100) default: 75
			  , progressive: false // true for progressive compression, default: false
			});


		// 输出图片
		stream.on('data', function(chunk){
			out.write(chunk);
		});

		// 输出完成
		stream.on('end', function(){
			var log = {
				filename: path.basename(child.src),
				source: child.src,
				target: child.output,
				time: new Date().getTime()
			};

			callback ?
				callback():
				console.log('filename: '+log.filename, ', target: ' + log.target);

			child.log(log);
		});
	}

	// 高级过滤
	child.proFilter = function(){

	}

	// 执行压缩
	child.run = function(callback){

		this.read(function(obj, buffer){

			var canvas, ctx, out, stream, img;

			// 生成图片对象
			img = obj.createImg(buffer);

			// 生成canvas对象
			canvas = obj.canvas(img);

			// 处理图片
			obj.handleImg(canvas, img);

			// 输出图片
			obj.outputImg(canvas, callback);

		})
	}

	// 初始化，合并参数，缓存水印等
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

























