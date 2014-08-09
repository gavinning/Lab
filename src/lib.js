/*
 * lib.js
 * Tool library for nodejs project
 * Author, gavinning
 * Home, www.ilinco.com
 */

var fs = require('fs');
var path = require('path');
var lib = require('./linco');

lib.include({

	isFile: function(src){
		try{
			return fs.statSync(src).isFile();
		}catch(e){
			// console.log('waring: ' + e.message, 'from lib.js line.19');
		}
		return false;
	},

	isDir: function(src){
		try{
			return fs.statSync(src).isDirectory();
		}catch(e){
			// console.log('waring: ' + e.message, 'from lib.js line.28');
		}
		return false;
	},

	isDirectory: function(src){
		return this.isDir(src);
	},

	mkdir: function(src, child){
		var parent;

		if(!this.isDir(src)){
			try{
				fs.mkdirSync(src);
			}catch(e){
				parent = path.join(src, '../');
				this.mkdir(parent, src);
			}
			finally{
				child ? this.mkdir(child) : "";
			}
		}
	},

	toTemplate: function(str, space){
		space = space || '';
		str = '\n' + str.replace(/[\r\n]$/, '');
		str = str.replace(/[\r\n]/g, '\' +\n ' + space + ' \'') + '\';';
		str = str.replace(/^\' /, '');
		str = str.replace(/^\+[\r\n]/, '');
		str = '\'\'+\n' + str;
		return str;
	},

	formatHTML: function(str, space){
		return this.toTemplate(str, space);
	},

	// 遍历文件夹
	// 稳定版本
	dir: function(url, opt){
		var lib = this;
		var result = {};
		var files = result.files = [];
		var folders = result.folders = [];
		var defaults = {
			// 是否进行递归
			deep 			: true,

			// 过滤规则将以正则表达式方式进行判断，其中*被转换成通配符
			// 将优先执行过滤规则
			filterFile		: ['^.*', '.svn-base', '_tmp', '副本', 'desktop.ini', '.DS_Store'],
			filterFolder	: ['^.git$', '^.svn$'],


			// 将在过滤规则之后执行指定规则
			// 指定规则将以正则表达式方式进行判断，其中*被转换成通配符，同过滤规则
			onlyFile		: [],
			// 慎用，过滤的文件夹将不会进行递归检查
			onlyFolder		: []
		}

		// 不符合规则的url，直接返回
		if(!url || !lib.isDir(url)) return result;

		// 合并参数
		opt = lib.extend(defaults, opt);

		// 条件检查
		function verify(arr, obj){
			return arr.some(function(_filter){
				// 检查元素是否为字符串
				if(typeof _filter == 'string'){

					// 转换通配符
					_filter = _filter.replace('*.', '[\\s\\S]+\\.');
					_filter = _filter.replace('.*', '\\.[\\s\\S]+');

					// 执行条件检查
					try{
						return obj.match(new RegExp(_filter));
					}catch(e){
						throw e;
					}
				}
				// 检查元素是否为regexp对象
				if(lib.type(_filter) == 'regexp'){

					// 执行条件检查
					try{
						return obj.match(_filter);
					}catch(e){
						throw e;
					}
				}
			})
		}

		// 递归
		function deepDir(_url){
			var arr = fs.readdirSync(_url);

			// 遍历当前文件夹子级
			arr.forEach(function(sub){
				var tmpSrc = path.join(_url, sub);
				var isFilterFile;
				var isFilterFolder;
				var isOnlyFile;
				var isOnlyFolder;

				// 处理文件
				if(lib.isFile(tmpSrc)){
					// 判断是否为应该过滤的文件
					isFilterFile = verify(opt.filterFile, sub);
					// 不被过滤的文件进行下一步处理
					if(!isFilterFile){

						// 判断是否已指定需要的文件
						// 当存在指定文件时，过滤不需要的文件，将指定文件放进files数组
						if(opt.onlyFile.length > 0){
							// 判断是否为指定的文件
							isOnlyFile = verify(opt.onlyFile, sub);
							// 指定的文件放入数组
							if(isOnlyFile){
								files.push(tmpSrc);
							}

						// 当不存在指定文件时，直接将文件放进数组
						}else{
							files.push(tmpSrc);
						}
					}
				}
				
				// 处理文件夹
				if(lib.isDir(tmpSrc)){
					// 判断是否为应该过滤的文件夹
					isFilterFolder = verify(opt.filterFolder, sub);
					// 不被过滤的文件夹进行下一步处理
					if(!isFilterFolder){
						
						// 判断是否已指定需要的文件夹
						// 当存在指定文件夹时，过滤不需要的文件夹，将指定文件夹放进folders数组
						if(opt.onlyFolder.length > 0){
							// 判断是否为指定的文件夹
							isOnlyFolder = verify(opt.onlyFolder, sub);
							// 指定的文件夹放入数组
							if(isOnlyFolder){
								folders.push(tmpSrc);

								// 判断是否执行递归
								if(opt.deep){
									deepDir(tmpSrc);
								}
							}

						// 当不存在指定文件夹时，直接将文件夹放进数组
						}else{
							folders.push(tmpSrc);

							// 判断是否执行递归
							if(opt.deep){
								deepDir(tmpSrc);
							}
						}
					}
				}
			})
		};

		// 递归
		deepDir(url);

		return result;
	},

	// 数据流复制
	stream: function(source, target, callback){
		var input = fs.createReadStream(source);
		var output = fs.createWriteStream(target);

		input.pipe(output);

		input.on('end', function(){
			output.end();
			callback(null, source, target);
		});
	},

	upload: function(url, file, callback){
		var http = require('http');
		var opt, req, input;

		opt = require('url').parse(url);
		opt.method = 'POST';

		req = http.request(opt, function(res){
			if(res.statusCode == 201){
				callback(null, res);
			}else{
				console.log('upload failed.');
			}
		});

		input = fs.createReadStream(file);
		input.pipe(req);
	},

	// 获取目标路径
	getTarget: function(file, source, target){
		return path.join(target, path.relative(source, file))
	},

	// 解决复制文件进程溢出问题
	// 串行复制，上一文件复制完成之后，开始下一个文件复制
	copy: function(source, target, callback){
		var lib = this;
		var events = require('events');
		var event = new events.EventEmitter();
		var i, files, callback = callback || function(){};

		// 处理文件复制
		if(this.isFile(source)){
			// 检查目标路径是否存在
			if(!lib.isDir(path.dirname(target))){
				lib.mkdir(path.dirname(target))
			}
			// 复制文件
			return this.stream(source, target, callback)
		}

		// 处理错误路径
		if(!this.isDir(source)){
			return console.log('Error: ' + source + ' is not file or folder');
		}

		// 处理文件夹复制
		i = 0;
		files = lib.dir(source).files;

		// 定义复制文件事件
		event.on('copy', function(sourceFile, targetFile){
			var end = false;

			// 结束处理
			if(i >= files.length) return;

			// 最后一个文件
			if(i == files.length-1)
				end = true;

			// 源文件
			sourceFile = files[i];
			// 目标文件
			targetFile = lib.getTarget(sourceFile, source, target);

			// 检查目标路径是否存在
			if(!lib.isDir(path.dirname(targetFile))){
				lib.mkdir(path.dirname(targetFile))
			}

			// 开始复制文件
			lib.stream(sourceFile, targetFile, function(e, source, target){
				if(e) return console.log(e)
				callback(e, source, target, i, end);

				// 结束处理
				if(end) return;
				// next
				i++;
				event.emit('copy')
			})
		})

		// 开始处理
		event.emit('copy');
	},

	// 删除目录仅支持非window平台
	delete: function(source, callback){
		var lib = this;
		var exec = require('child_process').exec;

		callback = callback || function(){}

		if(this.isFile(source)){
			return fs.unlink(source, callback)
		}

		if(this.isDir(source)){
			return exec('rm -rf ' + source, callback)
		}

		return console.log('Error: ' + source + ' is not file or folder');
	},

	// 由于delete方法限制，目前删除文件夹只支持非window平台
	move: function(source, target, callback){
		var lib = this;

		callback = callback || function(){}

		// 移动文件
		if(this.isFile(source)){
			// 复制源文件到目标路径
			return this.copy(source, target, function(e, sourceFile, targetFile){
				// 删除源文件
				lib.delete(source, function(e){
					if(e) return callback(e)
					callback(null, sourceFile, targetFile)
				})
			})
		}

		// 移动文件夹
		if(this.isDir(source)){
			// 复制源文件夹到目标路径
			return this.copy(source, target, function(e, sourceFile, targetFile, i, end){
				if(e) return console.log(e)

				// 判断文件夹是否复制完毕
				// 文件夹复制完毕后删除源文件夹
				end ? lib.delete(source, function(e){
					if(e) return callback(e)
					callback(null, source, target)
				}):"";
			})
		}

		return console.log('Error: ' + source + ' is not file or folder');
	}

});

module.exports = new lib;