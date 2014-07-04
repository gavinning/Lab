# Linco.lab

![ilinco icon](http://ilinco.com/images/logo.png)

## for nodejs

**Linco.lab**, 用于支持日常开发nodejs模块.

## install
```
npm install linco.lab --save
```

#### 开始

```
var lib = require('linco.lab').lib;
```


#### 遍历文件夹
```
// 遍历目录
var obj = lib.dir('/User/username/Documents');

// 存储目录下所有文件路径的数组
obj.file

// 文件hash
obj.fileHash

// 存储目录下所有子目录的数组
obj.folder

// 子目录hash
obj.folderHash
```

#### 检测文件夹
```
lib.isDir('path')
```

#### 检测文件
```
lib.isFile('src')
```

#### 建立文件夹
*原生的文件夹建立api，如果父级路径不存在会报错，lib.mkdir可以自动创建不存在父级路径*

```
// 如果a路径不存在，则会自动创建a/b/c/d
lib.mkdir('/a/b/c/d')

```



