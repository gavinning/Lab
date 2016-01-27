# Linco.lab
![ilinco icon](http://ilinco.com/images/logo.png)

**Linco.lab**, 用于支持日常开发nodejs模块.

## Install
```
npm install linco.lab --save
```
```js
var lab = require('linco.lab');
```


###Example lib
```js

var lib = lab.lib;

// or
var lib = require('linco.lab').lib;

// or
var lib, Lib = require('linco.lab').Lib;
Lib.include({
    foo: function(){
        console.log('bar')
    }
})
lib = new Lib;
lib.foo() // => bar
```

```js
lib.isNumber(1)             // => true

lib.isArray([])             // => true

lib.isPlainObject({})       // => true

lib.isEmptyObject({})       // => true

lib.isString('1')           // => true

lib.type(1) === 'number'    // => true

lib.type([]) === 'array'    // => true

lib.type({}) === 'object'   // => true

lib.type('1') === 'string'  // => true

lib.type(lib.type) === 'function'   // => true

```

```js
lib.isDir(__dirname)        // => true

lib.isFile(__filename)      // => true
```

```js
lib.now()                   // => 2015-12-12 16:12:10

lib.mkdir('/a/b/c/d')       // => /a/b/c/d
```

```js
// 遍历数组
// 对于数组的遍历更推荐arr.forEach,原生支持的，很赞
// arr.some, arr.every都是很棒的方法
lib.each(arr, function(i, item){
    // your code
})

// 遍历对象
lib.each(obj, function(key, value){
    // your code
})
```

### Example lib.dir
查找目录，返回数组，支持[glob](https://www.npmjs.com/package/glob)语法
```js
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

#### Example 文件、文件夹操作
```js
// 复制文件|文件夹
lib.cp(source, target, callback)
lib.copy(source, target, callback)

// 删除文件|文件夹
lib.rm(source, target, callback)
lib.delete(source, target, callback)

// 移动文件|文件夹
lib.mv(source, target, callback)
lib.move(source, target, callback)

// 支持通配符操作
lib.rm('./a/*.txt', fn)
lib.rm('./a/**/*.txt', fn)
```

#### lib.toTemplate 将HTML代码转换为js模板，就是用+连起来
个人有使用场景就封装了一个

```js
var template = lib.toTemplate(htmlDom);

```

### lab.watch
已废弃，请使用gaze，更详细的文档请见：[gaze](https://www.npmjs.com/package/gaze)

### lab.server模块
用于创建测试服务器的server模块，本地开发过程中经常需要用到测试服务器，安装一个iis，apache实在太大，如果你要求功能不多，如果你已经有了nodejs，直接安装lab.server一句话搞定；

```js
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

```js
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
