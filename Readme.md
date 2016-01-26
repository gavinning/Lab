# Linco.lab

![ilinco icon](http://ilinco.com/images/logo.png)

## for nodejs

**Linco.lab**, 用于支持日常开发nodejs模块.

## install
```
npm install linco.lab --save
```

## 开始

```
var lab = require('linco.lab');
```


### lab.lib模块

```

// 直接调用实例化的lib
var lib = lab.lib;
```

```
// 调用Lib类
var Lib = lab.Lib

// 直接扩展Lib
Lib.fn.extend({})

// 创建实例
var lib = new Lib;

// 扩展实例
lib.extend({})
```

```
// 基于Lib创建子类
var Util = Lib.create();

Util.fn.extend({
    foo: function(){
        console.log('bar')
    }
})

var util = new Util;

util.foo() // => bar
```


#### lib.each 遍历，同jquery的$.each
```
// 遍历数组
// 对于数组的遍历更推荐arr.forEach,原生支持的，很赞
// arr.some, arr.every都是很棒的方法
lib.each(arr, function(i, item){
    // your code
})

// 遍历对象
lib.each(obj, function(){
    // your code
})
```

#### lib.type 类型检查，同jquery的$.type
```
lib.type(obj)

lib.isFunction(obj);

lib.isArray(obj);

lib.isNumber(obj);

lib.isEmptyObject(obj);

lib.isPlainObject(obj);
```



##### 高级方法
在基础方法之上进行扩展的适用nodejs开发的高级方法

#### lib.dir
查找目录，返回数组，支持[glob](https://www.npmjs.com/package/glob)语法
```
// 遍历当前目录
var filepaths = lib.dir('*')

// 深度遍历当前目录及子目录
var filepaths = lib.dir('**')

// 查找目录下所有的js文件
var filepaths = lib.dir('**/*.js')

// 过滤app.js
var filepaths = lib.dir('**/*.js', 'app.js')

// 过滤app.js
var filepaths = lib.dir('**/*.js', ['app.js'])

// 过滤app.js
var filepaths = lib.dir('**/*.js', {filter: ['app.js']})

// 查找所有文件，过滤js文件和readme.md文件
var filepaths = lib.dir('**', {filter: ['**/*.js', 'readme.md']})

// 异步
lib.dir('**', {filter: ['**/*.js', 'readme.md']}, function(err, filepaths){
    console.log(filepaths)
})
```

#### lib.isDir 检测文件夹
```
// 检查不存在的路径不报错，而返回false
// 实际开发中经常会检测不确定存在的路径，是否是文件夹或者文件
// 如果路径不存在，直接检查如果会报错，这里做了try处理
// 如果路径不存在则返回false
lib.isDir('path')
```

#### lib.isFile 检测文件
```
// 检查不存在的路径不报错，而返回false
// 同上
lib.isFile('src')
```

#### lib.mkdir 可直接建立深层侧文件夹
*原生的文件夹建立api，如果父级路径不存在会报错，lib.mkdir可以自动创建不存在父级路径*

```
// 如果a路径不存在，则会自动创建a/b/c/d
lib.mkdir('/a/b/c/d')
```


#### 文件、文件夹操作
```
// 复制文件|文件夹
lib.cp(source, target, callback)
lib.copy(source, target, callback)

// 删除文件|文件夹
lib.rm(source, target, callback)
lib.delete(source, target, callback)

// 移动文件|文件夹
lib.mv(source, target, callback)
lib.move(source, target, callback)
```

```
// 支持通配符操作
lib.rm('./a/*.txt', fn)

lib.rm('./a/**/*.txt', fn)
```



#### lib.toTemplate 将HTML代码转换为js模板，就是用+连起来
个人有使用场景就封装了一个

```
var template = lib.toTemplate(htmlDom);

```



### lab.watch
已废弃，请使用gaze，更详细的文档请见：[gaze](https://www.npmjs.com/package/gaze)



### lab.server模块
用于创建测试服务器的server模块，本地开发过程中经常需要用到测试服务器，安装一个iis，apache实在太大，如果你要求功能不多，如果你已经有了nodejs，直接安装lab.server一句话搞定；

```
var Server = lab.server;

// or

var Server = require('linco.lab').server;

// 一句话启动server
// 静态资源目录直接指向服务器根目录
// port参数可选，默认为3000
var app = Server.create(src [,port]);

// 进一步设置
// 路由分发

// get请求
app.get('/', function(req, res){
    res.end('Hello linco.server');
})

// post请求
app.post('/', function(req, res){
    res.end('Hello linco.server');
})
```

你还可以自启动server

```
var Server = linco.server;
var app = new Server(src);
var port = 3000;


app.set('port', port);

// get请求
app.get('/', function(req, res){
    res.end('Hello linco.server');
})

// post请求
app.post('/', function(req, res){
    res.end('Hello linco.server');
})


http.createServer(app).listen(port);
console.log('listen '+ port +', by ' + src);
```
