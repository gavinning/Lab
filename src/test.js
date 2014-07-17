// var fs = require('fs');
// var path = require('path');
// var lib = require('linco.lab').lib;
// var Image = require('./images');
// var img, opt;

// var src = '/Users/gavinning/Pictures/test';


// opt = {
// 	mark: 'Users/gavinning/Pictures/mark.png',
// 	min : 1,
// 	log : false,
// 	maxWidth: 950
// }

// img = new Image(opt);
// console.log(img._mark)
// img('/Users/gavinning/Pictures/3.jpg', '/Users/gavinning/Pictures/out.jpg').width(750).run();


// for dir, the new dir method
var fs = require('fs');
var path = require('path');
var lib = require('./lib');


// 遍历文件夹
function dir(url, opt){
	var result = {};
	var files = result.files = [];
	var folders = result.folders = [];
	var defaults = {
		// 是否进行递归
		deep 			: true,

		// 过滤规则将以正则表达式方式进行判断，其中*被转换成通配符
		// 将优先执行过滤规则
		filterFile		: ['^.*'],
		filterFolder	: ['^.*'],


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
			// 转换通配符
			_filter = _filter.replace('*.', '[\\s\\S]+\\.');
			_filter = _filter.replace('.*', '\\.[\\s\\S]+');

			// 执行条件检查
			try{
				return obj.match(new RegExp(_filter));
			}catch(e){
				throw e;
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
}

// dir() //'/Users/gavinning/Documents/lab/github/xyzning'

console.log(dir('/Users/gavinning/Documents/lab/github/xyzning', {deep: false}))





