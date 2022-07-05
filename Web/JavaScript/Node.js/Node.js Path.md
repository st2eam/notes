## path

path模块提供了用来处理文件路径的实用工具，因为不同操作系统的路径规则不同，比如Windows上面路径采用 `\\` 分隔，通常路径是这种格式：

```
D:\\www\\task\\index.html
```

但Linux采用 `/` 分隔，如：

```
/root/www/task/index.html
```

`path` 提供了一致的API，可以帮我们屏蔽这些差异，要使用 `path` 的API我们只需要这样引入即可：

```js
import * as path from 'path'
```

### basename

可以返回路径的最后一部分，用来获取文件名

```js
import * as path from 'path'
path.basename('D:\\www\\task\\index.html')  // index.html
```

### dirname

用来返回路径的目录名

```js
import * as path from 'path'
path.dirname('D:\\www\\task\\index.html') // D:\\www\\task
```

### extname

用来返回路径的扩展名

```js
import * as path from 'path'
path.extname('D:\\www\\task\\index.html') // .html
```

### resolve

用来将给定的路径片段转换为绝对路径

```js
import * as path from 'path'
path.resolve('/index.html') // 如果当前工作目录位于D盘，则返回 D:\\index.html
path.resolve('index.html')  // 如果当前工作目录位于 D:\\www\\task，则返回 D:\\www\\task\\index.html
```

### join

该方法可以合并多个路径片段，在Node.js的CommonJS模块代码中，有两个特殊的路径变量

- `__dirname`：当前代码文件所在目录的绝对路径
- `__filename`：当前代码文件的绝对路径

```js
import * as path from 'path'
path.join('D:\\www', 'task', 'index.html')  // D:\\www\\task\\index.html
path.join(__dirname, 'test.js') // 假如当前文件为 D:\\www\\task\\index.js，则返回 D:\\www\\task\\test.js
```
