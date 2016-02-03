var fs = require('fs');
var path = require('path');
var glob = require('glob');
var Class = require('aimee-class');
var Lib = module.exports = Class.create();
var lib = new Lib;

Lib.include(require('./is'));
Lib.include(require('./core'));

// For client
Lib.include({

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
    dir: function(patterns, filter, fn){
        var options = {};

        if(lib.isPlainObject(filter)){
            options = filter;
        }

        if(typeof filter === 'function'){
            fn = filter;
            filter = null;
        }

        options.dot = true;
        options.ignore = filter;

        return fn ?
            glob(patterns, options, fn):
            glob.sync(patterns, options);
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

    // 复制文件|文件夹
    copy: function(source, target, callback){
        require('copy-dir')(source, target, callback || FN);
    },

    // 删除文件|文件夹
    delete: function(source, callback){
        require('rm-rf')(source, callback || FN);
    },

    // 移动文件|文件夹
    move: function(source, target, callback){
        this.copy(source, target, function(e){
            if(e){
                if(callback){
                    callback(e)
                }else{
                    throw e;
                }
                return;
            }
            this.delete(source, callback || FN);
        }.bind(this))
    },

    cp: function(){
        this.copy.apply(this, arguments);
    },

    rm: function(){
        this.delete.apply(this, arguments);
    },

    mv: function(){
        this.move.apply(this, arguments);
    }
})
