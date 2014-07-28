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
var linco = require('linco.lab');
```


### linco.lib模块

linco工具库，封装了使用工具方法，基础方法来源jquery

```
var lib = linco.lib;
```

##### 基础方法
来自jquery，如果有jquery基础，可以直接使用

###### lib.extend 扩展，同jquery的$.extend
```
// 扩展lib自身
lib.extend({
	foo: function(){}
})

// 扩展其他对象
lib.extend(foo, {
	bar: function(){}
})

// 合并对象
var obj = lib.extend({}, foo, bar);

```

###### lib.each 遍历，同jquery的$.each
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

###### lib.type 类型检查，同jquery的$.type
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

###### lib.dir 遍历目录下的所有文件及所有子文件夹，非常方便
一个很强大的方法，opt参数详解请参考 [linco.dir](https://github.com/gavinning/dir), linco.dir是基于lib.dir 所以opt参数是一致的，内部使用同步读取fs.readdirSync

```
// opt参数为可选，不设置将执行默认规则，以下为默认规则
var opt = {
    deep: true,
    filterFile      : ['^.*', '.svn-base', '_tmp', '副本', 'desktop.ini', '.DS_Store'],
    filterFolder    : ['^.git$', '^.svn$'],
    onlyFile        : [],
    onlyFolder      : []
}

// 遍历目录
var obj = lib.dir('/User/username/Documents', opt);

// 存储目录下所有文件路径的数组
obj.files

// 存储目录下所有子目录的数组
obj.folders

```

###### lib.isDir 检测文件夹
```
// 检查不存在的路径不报错，而返回false
// 实际开发中经常会检测不确定存在的路径，是否是文件夹或者文件
// 如果路径不存在，直接检查如果会报错，这里做了try处理
// 如果路径不存在则返回false
lib.isDir('path')
```

###### lib.isFile 检测文件
```
// 检查不存在的路径不报错，而返回false
// 同上
lib.isFile('src')
```

###### lib.mkdir 可直接建立深层侧文件夹
*原生的文件夹建立api，如果父级路径不存在会报错，lib.mkdir可以自动创建不存在父级路径*

```
// 如果a路径不存在，则会自动创建a/b/c/d
lib.mkdir('/a/b/c/d')

```


###### lib.copy 复制文件或文件夹
```
// 复制，MAC下数量过多会文件进程溢出
// 可在启动进程时分配更多的内存以防止溢出
lib.copy(source, target, callback)
```




###### lib.toTemplate 将HTML代码转换为js模板，就是用+连起来
个人有使用场景就封装了一个

```
var template = lib.toTemplate(htmlDom);

```



### linco.watch模块
用于监听的一个方法

```
var watch = linco.watch;

var opt = {
	// 相对根目录
	// 如果传入的路径是相对路径则需要此参数
	baseDir: null,
	// 监听目录树
	isTree: true,
	// 文件夹级监听
	isFolder: true,
	// 过滤监听的文件
	// 使用linco.lab/lib.dir进行过滤
	// 此处采用lib.dir过滤规则
	filter: {},
	// 回调
	callback: function(){}
}

// src可以是具体路径，也可以是路径的数组
watch(src, opt, function(filename, stat){
	// your code
})

```


### linco.server模块
用于创建测试服务器的server模块，本地开发过程中经常需要用到测试服务器，安装一个iis，apache实在太大，如果你要求功能不多，如果你已经有了nodejs，直接安装linco.server一句话搞定；

```
var Server = linco.server;

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
