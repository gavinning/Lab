// by gavinning
// 文件及目录变更监听 

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
		// 过滤监听的目录
		filterFolder: [],
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
		lib.extend(live.opt, opt);
		// 合并callback到opt
		live.opt.callback = callback;

		return Array.isArray(src) ?
			live.array(src) : live.array([src]);
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

		// console.log(_folder)

		// 设置监听
		_folder.forEach(function(item){
			_this.watchFolder(item, _this.opt.callback)
		});
	},

	watchFolder: function(src, callback){
		var basename =  path.basename(src);

		// 过滤不需要监听的目录-1
		if(lib.inArray(basename, live.opt.filterFolder) >= 0) return;

		fs.watch(src, function(event, filename){
			var stat;

			// 过滤不需要监听的文件
			if(lib.inArray(filename, live.opt.filter) >= 0) return;

			// 过滤不需要监听的目录-2
			// 父级目录的关系，目录过滤需要过滤两遍
			if(lib.inArray(filename, live.opt.filterFolder) >= 0 && lib.isDir(path.join(src, filename))) return;


			try{
				stat = fs.statSync(path.join(src, filename));
				callback(path.join(src, filename), stat);

			// 忽略文件删除
			}catch(e){
				return console.log(e);
			}
			
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

module.exports = live.enter;
