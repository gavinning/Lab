// for copy

var fs = require('fs');
var path = require('path');
var events = require('events');
var exec = require('child_process').exec;
var lib = require('linco.lab').lib;
var event = new events.EventEmitter();

var opt = {
	url: '/Volumes/macdata/programtest/cate',

	target: '/Volumes/macdata/programtest/target',
}


// lib.extend({

// 	getTarget: function(file, source, target){
// 		return path.join(target, path.relative(source, file))
// 	},

// 	// 解决复制文件进程溢出问题
// 	// 串行复制，上一文件复制完成之后，开始下一个文件复制
// 	copy: function(source, target, callback){
// 		var events = require('events');
// 		var exec = require('child_process').exec;
// 		var event = new events.EventEmitter();

// 		var i, files, callback = callback || function(){};

// 		// 处理文件复制
// 		if(this.isFile(source)){
// 			// 检查目标路径是否存在
// 			if(!lib.isDir(path.dirname(target))){
// 				lib.mkdir(path.dirname(target))
// 			}
// 			// 复制文件
// 			return this.stream(source, target, callback)
// 		}

// 		// 处理错误路径
// 		if(!this.isDir(source)){
// 			return console.log('Error: ' + source + ' is not file or folder');
// 		}

// 		// 处理文件夹复制
// 		i = 0;
// 		files = lib.dir(source).files;

// 		// 定义复制文件事件
// 		event.on('copy', function(sourceFile, targetFile){
// 			var end = false;

// 			// 结束处理
// 			if(i >= files.length) return;

// 			// 最后一个文件
// 			if(i == files.length-1)
// 				end = true;

// 			// 源文件
// 			sourceFile = files[i];
// 			// 目标文件
// 			targetFile = lib.getTarget(sourceFile, source, target);

// 			// 检查目标路径是否存在
// 			if(!lib.isDir(path.dirname(targetFile))){
// 				lib.mkdir(path.dirname(targetFile))
// 			}

// 			// 开始复制文件
// 			lib.stream(sourceFile, targetFile, function(e, source, target){
// 				if(e) return console.log(e)
// 				callback(e, source, target, i, end);

// 				// 结束处理
// 				if(end) return;
// 				// next
// 				i++;
// 				event.emit('copy')
// 			})
// 		})

// 		// 开始处理
// 		event.emit('copy');
// 	},

// 	// 删除目录仅支持非window平台
// 	delete: function(source, callback){
// 		callback = callback || function(){}

// 		if(this.isFile(source)){
// 			return fs.unlink(source, callback)
// 		}

// 		if(this.isDir(source)){
// 			return exec('rm -rf ' + source, callback)
// 		}

// 		return console.log('Error: ' + source + ' is not file or folder');
// 	},

// 	// 由于delete方法限制，目前删除文件夹只支持非window平台
// 	move: function(source, target, callback){
// 		callback = callback || function(){}

// 		// 移动文件
// 		if(this.isFile(source)){
// 			// 复制源文件到目标路径
// 			return this.copy(source, target, function(e, sourceFile, targetFile){
// 				// 删除源文件
// 				lib.delete(source, function(e){
// 					if(e) return callback(e)
// 					callback(null, sourceFile, targetFile)
// 				})
// 			})
// 		}

// 		// 移动文件夹
// 		if(this.isDir(source)){
// 			// 复制源文件夹到目标路径
// 			return this.copy(source, target, function(e, sourceFile, targetFile, i, end){
// 				if(e) return console.log(e)

// 				// 判断文件夹是否复制完毕
// 				// 文件夹复制完毕后删除源文件夹
// 				end ? lib.delete(source, function(e){
// 					if(e) return callback(e)
// 					callback(null, source, target)
// 				}):"";
// 			})
// 		}

// 		return console.log('Error: ' + source + ' is not file or folder');
// 	}

// })

// // lib.copy(opt.url, opt.target, function(e, source, target, i, end){
// // 	if(e) return console.log(e)
// // 	// console.log('written: ' + target);
// // 	console.log(i, end)
// // });


lib.copy(opt.url, opt.target, function(e, source, target){
	console.log('copy: ' + target)
})

// console.log(lib.copy)
// console.log(lib.move)








