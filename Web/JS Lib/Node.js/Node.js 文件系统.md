# Node.js 文件系统

Node.js 提供一组类似 UNIX（POSIX）标准的文件操作API。 Node 导入文件系统模块(fs)语法如下所示：

```js
var fs = require("fs")
```

## 异步和同步

Node.js 文件系统（fs 模块）模块中的方法均有异步和同步版本，例如读取文件内容的函数有异步的 fs.readFile() 和同步的 fs.readFileSync()。

异步的方法函数最后一个参数为回调函数，回调函数的第一个参数包含了错误信息(error)。

建议大家使用异步方法，比起同步，异步方法性能更高，速度更快，而且没有阻塞。

fs模块提供了操作本地文件的能力，是我们最常用的功能之一，fs中的绝大多数API都有三种版本，分别为

**异步非阻塞版本**

这种版本的API异步非阻塞，在执行的时候不会阻塞线程，但是需要通过回调函数才能拿到返回结果，例如

```js
import * as fs from 'fs'

fs.readFile('data.txt', 'utf-8', (err, data) => {
  if (err) {
    console.error('文件读取失败')
  } else {
    console.log(data)
  }
})
```

**同步阻塞版本**

这种版本的API在执行的时候会阻塞线程，需要等它执行完才能处理其他任务，所以一般在服务端开发中我们都会禁止使用这种同步IO的API，同步版本的API名字和异步版本的类似，会在末尾加上 `Sync`，如

```js
import * as fs from 'fs'

try {
  let data = fs.readFileSync('data.txt', 'utf-8')
  console.log(data)
} catch (err) {
  console.error('文件读取失败')
}
```

**Promise版本**

Promise版本的API是Node.js新加入的特性，它相当于是对异步非阻塞版本API的Promise化，配合async/await，既可以让我们以串行的方式写代码，又可以避免IO阻塞线程，通过 `fs.promises` 可以访问到这些API

```js
async function run() {
  try {
    let data = await fs.promises.readFile('data.txt', 'uttf-8')
    console.log(data)
  } catch (err) {
    console.error('文件读取失败')
  }
}
```

> 需要注意，在实际项目中文件操作时最好传入文件的绝对路径，如果传入的是相对路径，那么得到的是相对于当前工作目录的路径，而不是相对于代码文件的路径，这个和模块加载的相对路径规则不同。

假如有代码 `D:\\www\\node\\src\\fs.js`，内容如下

```js
import * as fs from 'fs'

let data = fs.readFileSync('../data/news.json', 'utf-8')
console.log(data)
```

我们在读取文件的时候传入了一个相对路径，本来的期望是读取 `D:\\www\\node\\data\\news.json` 这个文件，但是这个相对路径是相对于我们的工作目录的，而不是代码文件自身，所以如果我们在 `D:\\www\\node\\src\\` 目录下面执行 `node fs.js` 那么得到的将会是正确的结果，如果我们在 `D:\\www\\node\\` 目录下面执行，则文件路径变成了 `D:\\www\\data\\news.json`，读取出错，所以一定要使用绝对路径来读取，这样就不会受工作目录的影响，如

```js
import * as fs from 'fs'
import * as path from 'path'

let data = fs.readFileSync(path.join(__dirname, '../data/news.json'), 'utf-8')
console.log(data)
```

通过 `path.join` 将 `__dirname` 和目标文件的相对路径连接起来就可以得到目标文件的绝对路径了，同样的道理，其他的文件操作API也需要用这种方式

### 示例

```ts
function readFile() {
  fs.readFile(__filename, 'utf-8', (err, data) => {
    if (err) {
      console.error('文件读取失败')
    } else {
      console.log(data)
    }
  })
}

function readFileSync() {
  try {
    const data = fs.readFileSync(__filename, 'utf-8')
    console.log(data)
  } catch (err) {
    console.error('文件读取失败')
  }
}

async function readFilePromise() {
  try {
    const data = await fs.promises.readFile(__filename, 'utf-8')
    console.log(data)
  } catch (err) {
    console.error('文件读取失败')
  }
}
```

### 语法

以下为在异步模式下打开文件的语法格式：

```js
fs.open(path, flags[, mode], callback)
```

### 参数

参数使用说明如下：

- **path** - 文件的路径。

- **flags** - 文件打开的行为。具体值详见下文。

- **mode** - 设置文件模式(权限)，文件创建默认权限为 0666(可读，可写)。

- **callback** - 回调函数，带有两个参数如：callback(err, fd)。

flags 参数可以是以下值：

| Flag | 描述                             |
| ---- | ------------------------------ |
| r    | 以读取模式打开文件。如果文件不存在抛出异常。         |
| r+   | 以读写模式打开文件。如果文件不存在抛出异常。         |
| rs   | 以同步的方式读取文件。                    |
| rs+  | 以同步的方式读取和写入文件。                 |
| w    | 以写入模式打开文件，如果文件不存在则创建。          |
| wx   | 类似 'w'，但是如果文件路径存在，则文件写入失败。     |
| w+   | 以读写模式打开文件，如果文件不存在则创建。          |
| wx+  | 类似 'w+'， 但是如果文件路径存在，则文件读写失败。   |
| a    | 以追加模式打开文件，如果文件不存在则创建。          |
| ax   | 类似 'a'， 但是如果文件路径存在，则文件追加失败。    |
| a+   | 以读取追加模式打开文件，如果文件不存在则创建。        |
| ax+  | 类似 'a+'， 但是如果文件路径存在，则文件读取追加失败。 |

## 获取文件信息

### 语法

以下为通过异步模式获取文件信息的语法格式：

```js
fs.stat(path, callback)
```

### 参数

参数使用说明如下：

- **path** - 文件路径。

- **callback** - 回调函数，带有两个参数如：(err, stats), **stats** 是 fs.Stats 对象。

fs.stat(path)执行后，会将stats类的实例返回给其回调函数。可以通过stats类中的提供方法判断文件的相关属性。例如判断是否为文件：

```js
var fs = require('fs');

fs.stat('/Users/liuht/code/itbilu/demo/fs.js', function (err, stats) {
 console.log(stats.isFile());         //true
})
```

stats类中的方法有：

| 方法                        | 描述                                                |
| ------------------------- | ------------------------------------------------- |
| stats.isFile()            | 如果是文件返回 true，否则返回 false。                          |
| stats.isDirectory()       | 如果是目录返回 true，否则返回 false。                          |
| stats.isBlockDevice()     | 如果是块设备返回 true，否则返回 false。                         |
| stats.isCharacterDevice() | 如果是字符设备返回 true，否则返回 false。                        |
| stats.isSymbolicLink()    | 如果是软链接返回 true，否则返回 false。                         |
| stats.isFIFO()            | 如果是FIFO，返回true，否则返回 false。FIFO是UNIX中的一种特殊类型的命令管道。 |
| stats.isSocket()          | 如果是 Socket 返回 true，否则返回 false。                    |

例子

```js
var fs = require("fs");

console.log("准备打开文件！");
fs.stat("input.txt", function (err, stats) {
  if (err) {
    return console.error(err);
  }
  console.log(stats);
  console.log("读取文件信息成功！");

  // 检测文件类型
  console.log("是否为文件(isFile) ? " + stats.isFile());
  console.log("是否为目录(isDirectory) ? " + stats.isDirectory());
});
```

运行结果

```js
准备打开文件！
Stats {
  dev: 1680571647,
  mode: 33206,
  nlink: 1,
  uid: 0,
  gid: 0,
  rdev: 0,
  blksize: 4096,
  ino: 281474977757222,
  size: 26,
  blocks: 0,
  atimeMs: 1657006630294.2458,
  mtimeMs: 1657006620150.0486,
  ctimeMs: 1657006620150.0486,
  birthtimeMs: 1657006121983.7034,
  atime: 2022-07-05T07:37:10.294Z,
  mtime: 2022-07-05T07:37:00.150Z,
  ctime: 2022-07-05T07:37:00.150Z,
  birthtime: 2022-07-05T07:28:41.984Z
}
读取文件信息成功！
是否为文件(isFile) ? true
是否为目录(isDirectory) ? false
```

## 写入文件

### 语法

以下为异步模式下写入文件的语法格式：

```js
fs.writeFile(file, data[, options], callback)
```

writeFile 直接打开文件默认是 w 模式，所以如果文件存在，该方法写入的内容会覆盖旧的文件内容。

### 参数

参数使用说明如下：

- **file** - 文件名或文件描述符。

- **data** - 要写入文件的数据，可以是 String(字符串) 或 Buffer(缓冲) 对象。

- **options** - 该参数是一个对象，包含 {encoding, mode, flag}。默认编码为 utf8, 模式为 0666 ， flag 为 'w'

- **callback** - 回调函数，回调函数只包含错误信息参数(err)，在写入失败时返回。

## 读取文件

### 语法

以下为异步模式下读取文件的语法格式：

```js
fs.read(fd, buffer, offset, length, position, callback)
```

该方法使用了文件描述符来读取文件。

### 参数

参数使用说明如下：

- **fd** - 通过 fs.open() 方法返回的文件描述符。

- **buffer** - 数据写入的缓冲区。

- **offset** - 缓冲区写入的写入偏移量。

- **length** - 要从文件中读取的字节数。

- **position** - 文件读取的起始位置，如果 position 的值为 null，则会从当前文件指针的位置读取。

- **callback** - 回调函数，有三个参数err, bytesRead, buffer，err 为错误信息， bytesRead 表示读取的字节数，buffer 为缓冲区对象。

## 关闭文件

### 语法

以下为异步模式下关闭文件的语法格式：

```js
fs.close(fd, callback)
```

该方法使用了文件描述符来读取文件。

### 参数

参数使用说明如下：

- **fd** - 通过 fs.open() 方法返回的文件描述符。

- **callback** - 回调函数，没有参数。

## 截取文件

### 语法

以下为异步模式下截取文件的语法格式：

```js
fs.ftruncate(fd, len, callback)
```

该方法使用了文件描述符来读取文件。

### 参数

参数使用说明如下：

- **fd** - 通过 fs.open() 方法返回的文件描述符。

- **len** - 文件内容截取的长度。

- **callback** - 回调函数，没有参数。

## 删除文件

### 语法

以下为删除文件的语法格式：

```js
fs.unlink(path, callback)
```

### 参数

参数使用说明如下：

- **path** - 文件路径。

- **callback** - 回调函数，没有参数。

## 创建目录

### 语法

以下为创建目录的语法格式：

```js
fs.mkdir(path[, options], callback)
```

### 参数

参数使用说明如下：

- **path** - 文件路径。

- options 参数可以是：
  
  - **recursive** - 是否以递归的方式创建目录，默认为 false。
  - **mode** - 设置目录权限，默认为 0777。

- **callback** - 回调函数，没有参数。

## 读取目录

### 语法

以下为读取目录的语法格式：

```js
fs.readdir(path, callback)
```

### 参数

参数使用说明如下：

- **path** - 文件路径。

- **callback** - 回调函数，回调函数带有两个参数err, files，err 为错误信息，files 为 目录下的文件数组列表。

## 删除目录

### 语法

以下为删除目录的语法格式：

```js
fs.rmdir(path, callback)
```

### 参数

参数使用说明如下：

- **path** - 文件路径。

- **callback** - 回调函数，没有参数。

## 文件模块方法参考手册

以下为 Node.js 文件模块相同的方法列表：

| 序号  | 方法 & 描述                                                                                                                                      |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **fs.rename(oldPath, newPath, callback)**<br>异步 rename().回调函数没有参数，但可能抛出异常。                                                                   |
| 2   | **fs.ftruncate(fd, len, callback)**<br>异步 ftruncate().回调函数没有参数，但可能抛出异常。                                                                      |
| 3   | **fs.ftruncateSync(fd, len)**<br>同步 ftruncate()                                                                                              |
| 4   | **fs.truncate(path, len, callback)**<br>异步 truncate().回调函数没有参数，但可能抛出异常。                                                                      |
| 5   | **fs.truncateSync(path, len)**<br>同步 truncate()                                                                                              |
| 6   | **fs.chown(path, uid, gid, callback)**<br>异步 chown().回调函数没有参数，但可能抛出异常。                                                                       |
| 7   | **fs.chownSync(path, uid, gid)**<br>同步 chown()                                                                                               |
| 8   | **fs.fchown(fd, uid, gid, callback)**<br>异步 fchown().回调函数没有参数，但可能抛出异常。                                                                       |
| 9   | **fs.fchownSync(fd, uid, gid)**<br>同步 fchown()                                                                                               |
| 10  | **fs.lchown(path, uid, gid, callback)**<br>异步 lchown().回调函数没有参数，但可能抛出异常。                                                                     |
| 11  | **fs.lchownSync(path, uid, gid)**<br>同步 lchown()                                                                                             |
| 12  | **fs.chmod(path, mode, callback)**<br>异步 chmod().回调函数没有参数，但可能抛出异常。                                                                           |
| 13  | **fs.chmodSync(path, mode)**<br>同步 chmod().                                                                                                  |
| 14  | **fs.fchmod(fd, mode, callback)**<br>异步 fchmod().回调函数没有参数，但可能抛出异常。                                                                           |
| 15  | **fs.fchmodSync(fd, mode)**<br>同步 fchmod().                                                                                                  |
| 16  | **fs.lchmod(path, mode, callback)**<br>异步 lchmod().回调函数没有参数，但可能抛出异常。Only available on Mac OS X.                                              |
| 17  | **fs.lchmodSync(path, mode)**<br>同步 lchmod().                                                                                                |
| 18  | **fs.stat(path, callback)**<br>异步 stat(). 回调函数有两个参数 err, stats，stats 是 fs.Stats 对象。                                                          |
| 19  | **fs.lstat(path, callback)**<br>异步 lstat(). 回调函数有两个参数 err, stats，stats 是 fs.Stats 对象。                                                        |
| 20  | **fs.fstat(fd, callback)**<br>异步 fstat(). 回调函数有两个参数 err, stats，stats 是 fs.Stats 对象。                                                          |
| 21  | **fs.statSync(path)**<br>同步 stat(). 返回 fs.Stats 的实例。                                                                                         |
| 22  | **fs.lstatSync(path)**<br>同步 lstat(). 返回 fs.Stats 的实例。                                                                                       |
| 23  | **fs.fstatSync(fd)**<br>同步 fstat(). 返回 fs.Stats 的实例。                                                                                         |
| 24  | **fs.link(srcpath, dstpath, callback)**<br>异步 link().回调函数没有参数，但可能抛出异常。                                                                       |
| 25  | **fs.linkSync(srcpath, dstpath)**<br>同步 link().                                                                                              |
| 26  | **fs.symlink(srcpath, dstpath[, type], callback)**<br>异步 symlink().回调函数没有参数，但可能抛出异常。 type 参数可以设置为 'dir', 'file', 或 'junction' (默认为 'file') 。 |
| 27  | **fs.symlinkSync(srcpath, dstpath[, type])**<br>同步 symlink().                                                                                |
| 28  | **fs.readlink(path, callback)**<br>异步 readlink(). 回调函数有两个参数 err, linkString。                                                                 |
| 29  | **fs.realpath(path[, cache], callback)**<br>异步 realpath(). 回调函数有两个参数 err, resolvedPath。                                                      |
| 30  | **fs.realpathSync(path[, cache])**<br>同步 realpath()。返回绝对路径。                                                                                  |
| 31  | **fs.unlink(path, callback)**<br>异步 unlink().回调函数没有参数，但可能抛出异常。                                                                               |
| 32  | **fs.unlinkSync(path)**<br>同步 unlink().                                                                                                      |
| 33  | **fs.rmdir(path, callback)**<br>异步 rmdir().回调函数没有参数，但可能抛出异常。                                                                                 |
| 34  | **fs.rmdirSync(path)**<br>同步 rmdir().                                                                                                        |
| 35  | **fs.mkdir(path[, mode], callback)**<br>S异步 mkdir(2).回调函数没有参数，但可能抛出异常。 访问权限默认为 0777。                                                         |
| 36  | **fs.mkdirSync(path[, mode])**<br>同步 mkdir().                                                                                                |
| 37  | **fs.readdir(path, callback)**<br>异步 readdir(3). 读取目录的内容。                                                                                    |
| 38  | **fs.readdirSync(path)**<br>同步 readdir().返回文件数组列表。                                                                                           |
| 39  | **fs.close(fd, callback)**<br>异步 close().回调函数没有参数，但可能抛出异常。                                                                                   |
| 40  | **fs.closeSync(fd)**<br>同步 close().                                                                                                          |
| 41  | **fs.open(path, flags[, mode], callback)**<br>异步打开文件。                                                                                        |
| 42  | **fs.openSync(path, flags[, mode])**<br>同步 version of fs.open().                                                                             |
| 43  | **fs.utimes(path, atime, mtime, callback)**<br>                                                                                              |
| 44  | **fs.utimesSync(path, atime, mtime)**<br>修改文件时间戳，文件通过指定的文件路径。                                                                                |
| 45  | **fs.futimes(fd, atime, mtime, callback)**<br>                                                                                               |
| 46  | **fs.futimesSync(fd, atime, mtime)**<br>修改文件时间戳，通过文件描述符指定。                                                                                   |
| 47  | **fs.fsync(fd, callback)**<br>异步 fsync.回调函数没有参数，但可能抛出异常。                                                                                     |
| 48  | **fs.fsyncSync(fd)**<br>同步 fsync.                                                                                                            |
| 49  | **fs.write(fd, buffer, offset, length[, position], callback)**<br>将缓冲区内容写入到通过文件描述符指定的文件。                                                     |
| 50  | **fs.write(fd, data[, position[, encoding]], callback)**<br>通过文件描述符 fd 写入文件内容。                                                               |
| 51  | **fs.writeSync(fd, buffer, offset, length[, position])**<br>同步版的 fs.write()。                                                                 |
| 52  | **fs.writeSync(fd, data[, position[, encoding]])**<br>同步版的 fs.write().                                                                       |
| 53  | **fs.read(fd, buffer, offset, length, position, callback)**<br>通过文件描述符 fd 读取文件内容。                                                            |
| 54  | **fs.readSync(fd, buffer, offset, length, position)**<br>同步版的 fs.read.                                                                       |
| 55  | **fs.readFile(filename[, options], callback)**<br>异步读取文件内容。                                                                                  |
| 56  | **fs.readFileSync(filename[, options])**                                                                                                     |
| 57  | **fs.writeFile(filename, data[, options], callback)**<br>异步写入文件内容。                                                                           |
| 58  | **fs.writeFileSync(filename, data[, options])**<br>同步版的 fs.writeFile。                                                                        |
| 59  | **fs.appendFile(filename, data[, options], callback)**<br>异步追加文件内容。                                                                          |
| 60  | **fs.appendFileSync(filename, data[, options])**<br>The 同步 version of fs.appendFile.                                                         |
| 61  | **fs.watchFile(filename[, options], listener)**<br>查看文件的修改。                                                                                  |
| 62  | **fs.unwatchFile(filename[, listener])**<br>停止查看 filename 的修改。                                                                               |
| 63  | **fs.watch(filename[, options][, listener])**<br>查看 filename 的修改，filename 可以是文件或目录。返回 fs.FSWatcher 对象。                                       |
| 64  | **fs.exists(path, callback)**<br>检测给定的路径是否存在。                                                                                                |
| 65  | **fs.existsSync(path)**<br>同步版的 fs.exists.                                                                                                   |
| 66  | **fs.access(path[, mode], callback)**<br>测试指定路径用户权限。                                                                                         |
| 67  | **fs.accessSync(path[, mode])**<br>同步版的 fs.access。                                                                                           |
| 68  | **fs.createReadStream(path[, options])**<br>返回ReadStream 对象。                                                                                 |
| 69  | **fs.createWriteStream(path[, options])**<br>返回 WriteStream 对象。                                                                              |
| 70  | **fs.symlink(srcpath, dstpath[, type], callback)**<br>异步 symlink().回调函数没有参数，但可能抛出异常。                                                         |
