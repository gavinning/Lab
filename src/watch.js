var fs = require('fs');
var path = require('path');
var lib = require('./lib');
var live;


var live = {

	opt: {
		// 相对根目录
		// 如果传入的路径是相对路径则需要此参数
		baseDir: null,
		// 监听目录树
		isTree: true,
		// 文件夹级监听
		isFolder: true,
		// 过滤监听的文件
		filter: [],
		// 监听指定的文件
		only: [],
		// 回调
		callback: function(){}
	},

	enter: function(src, opt, callback){
		// 检测参数
		if(typeof opt == 'function'){
			callback = opt;
			opt = {};
		}
		// 检测callback
		if(!opt || typeof opt != 'function' && !callback){
			return console.log('error: don\'t has callback')
		}
		// 合并opt
		lib.extend(this.opt, opt);
		// 合并callback到opt
		this.opt.callback = callback;

		return Array.isArray(src) ?
			this.array(src) : this.array([src]);
	},

	array: function(arr){
		var folder = [], _folder = [];
		var _this = this;

		arr.forEach(function(item){
			if(lib.isDir(item))
				return folder.push(item)

			if(_this.opt.baseDir && lib.isDir(path.join(_this.opt.baseDir, item)))
				return folder.push(path.join(_this.opt.baseDir, item))

			return console.error('error: ' + item + ' is not a directory')
		});

		// 父级纳入监听
		_folder = _folder.concat(folder);

		// 合并需要建立监听的文件夹数组
		this.opt.isTree ?
		// 遍历子目录
		folder.forEach(function(item){
			_folder = _folder.concat(lib.dir(item, _this.opt.filter, _this.opt.only).folder);
		}):
		// 只监听直属子目录
		folder.forEach(function(item){
			_folder = _folder.concat(_this.dir(item, _this.opt.filter));
		});

		console.log(_folder)

		// 设置监听
		// _folder.forEach(function(item){
		// 	_this.watchFolder(item, _this.opt.callback)
		// });
	},

	watchFolder: function(src, callback){
		fs.watch(src, function(event, filename){
			callback(event, filename);
		})
	},

	dir: function(src, filter){
		var arr = [];
		fs.readdirSync(src).forEach(function(item){
			var _src = path.join(src, item);
			if(lib.isDir(_src) && lib.inArray(item, filter) == -1){
				arr.push(_src)
			}
		})
		return arr;
	},

	is: function(){

	}


}

live.enter('/Users/gavinning/Downloads/tmp', function(){
	console.log(arguments)
})