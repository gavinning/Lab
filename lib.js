var fs = require('fs')
var path = require('path')

class Lib {
    constructor() {

    }

    mkdir(src, child){
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
    }

    isFile(src){
        try{
            return fs.statSync(src).isFile();
        }catch(e){
            return false;
        }
        return false;
    }

    isDir(src){
        try{
            return fs.statSync(src).isDirectory();
        }catch(e){
            return false;
        }
        return false;
    }

    isFolder(src){
        return this.isDir(src);
    }

    isDirectory(src){
        return this.isDir(src);
    }

    isAbsolute(src){
        return /^\/|^\w:/.test(src)
    }

    isSymboliclink(src){
        try{
            return fs.lstatSync(src.replace(/[\\\/]+$/, '')).isSymbolicLink()
        }
        catch(e){
            return false
        }
    }

    isSymbolicLink(src){
        return this.isSymboliclink(src)
    }

    isSymlink(src){
        return this.isSymboliclink(src)
    }

    isSymLink(src){
        return this.isSymboliclink(src)
    }

}

let lib = new Lib
lib.Lib = Lib;
module.exports = lib;
