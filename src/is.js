var fs = require('fs');

module.exports = {
    isFile: function(src){
        try{
            return fs.statSync(src).isFile();
        }catch(e){
            return false;
        }
        return false;
    },

    isDir: function(src){
        try{
            return fs.statSync(src).isDirectory();
        }catch(e){
            return false;
        }
        return false;
    },

    isFolder: function(src){
        return this.isDir(src);
    },

    isDirectory: function(src){
        return this.isDir(src);
    },

    isAbsolute: function(src){
        return /^\/|^\w:/.test(src)
    }
}
