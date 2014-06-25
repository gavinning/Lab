/*
 * lib.js
 * Tool library for nodejs project
 * Author, gavinning
 * Home, www.ilinco.com
 */

var fs = require('fs');
var path = require('path');
var http = require('http');
var lib = require('./linco');

lib.include({

	isFile: function(src){
		try{
			return fs.statSync(src).isFile();
		}catch(e){
			return false;
		}
	},

	isDir: function(src){
		try{
			return fs.statSync(src).isDirectory();
		}catch(e){
			return false;
		}
	},

	isDirectory: function(src){
		return this.isDir(src);
	},

	mkdir: function(src, child){
		if(!this.isDir(src)){
			try{
				fs.mkdirSync(src);
			}catch(e){
				var parent = path.join(src, '../');
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

	dir: function(folder, filter){
		var fileList = [];
		var folderList = [];
		var fileHash = {};
		var folderHash = {};
		var that = this;

		function eachDir(folder, filter){
			var dirList = fs.readdirSync(folder);
			var tmpDir, isFilter;

			folderHash[folder] = true;

			dirList.forEach(function(item, i){
				tmpDir = path.join(folder, item);
				isFilter = lib.inArray(item, filter) >= 0;

				if(fs.statSync(tmpDir).isDirectory()){
					if(!isFilter){
						if(!folderHash[tmpDir]){
							folderList.push(tmpDir);
							eachDir(tmpDir);
							folderHash[tmpDir] = true;
						}
					}
				}else{
					if( !fileHash[tmpDir] ){
						fileList.push(tmpDir);
						fileHash[tmpDir] = true;
					}
				}
			});

			return {file: fileList, folder: folderList, fileHash: fileHash, folderHash: folderHash};
		}

		return eachDir(folder, filter);
	},

	upload: function(url, file, callback){
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
	}
});

module.exports = new lib;