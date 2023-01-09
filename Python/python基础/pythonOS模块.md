## Python OS 模块

`os`就是“operating system”的缩写，顾名思义，`os`模块提供的就是各种 Python 程序与操作系统进行交互的接口。

通过使用`os`模块，一方面可以方便地与操作系统进行交互，另一方面页可以极大增强代码的可移植性。如果该模块中相关功能出错，会抛出`OSError`异常或其子类异常。

## 常用功能

### os.access()

os.access() 方法使用当前的uid/gid尝试访问路径。大部分操作使用有效的 uid/gid, 因此运行环境可以在 suid/sgid 环境尝试。

```python
import os
import sys
abspath = sys.argv[0]
print("F_OK", os.access(abspath, os.F_OK))  # F_OK True
print("R_OK", os.access(abspath, os.R_OK))  # R_OK True
print("W_OK", os.access(abspath, os.W_OK))  # W_OK True
print("X_OK", os.access(abspath, os.X_OK))  # X_OK True

```

### os.name

该属性宽泛地指明了当前 Python 运行所在的环境，实际上是导入的操作系统相关模块的名称。

### os.chdir()

“chdir”其实是“change the directory”的简写，因此`os.chdir()`的用处实际上是切换当前工作路径为指定路径。其中“指定路径”需要作为参数传入函数`os.chdir()`，该参数既可以是文本或字节型字符串，也可以是一个文件描述符，还可以是一个广义的类路径（path-like）对象。若指定路径不存在，则会抛出`FileNotFoundError`异常。

### os.environ

`os.environ`属性可以返回环境相关的信息，主要是各类环境变量。

返回值是一个映射（类似字典类型），具体的值为第一次导入`os`模块时的快照；其中的各个键值对，键是环境变量名，值则是环境变量对应的值。

在第一次导入`os`模块之后，除非直接修改`os.environ`的值，否则该属性的值不再发生变化。

### os.walk()

这个函数需要传入一个路径作为`top`参数，函数的作用是在以`top`为根节点的目录树中游走，对树中的每个目录生成一个由`(dirpath, dirnames, filenames)`三项组成的三元组。

```python
for item in os.walk("."):
    print(item)
```

### os.listdir()

“listdir”即“list directories”，列出（当前）目录下的全部路径（及文件）。该函数存在一个参数，用以指定要列出子目录的路径，默认为`“.”`，即“当前路径”。

函数返回值是一个列表，其中各元素均为字符串，分别是各路径名和文件名。

```python
print(os.listdir())
```

### os.mkdir()

“mkdir”，即“make directory”，用处是“新建一个路径”。需要传入一个类路径参数用以指定新建路径的位置和名称，如果指定路径已存在，则会抛出`FileExistsError`异常。

该函数只能在已有的路径下新建一级路径，否则（即新建多级路径）会抛出`FileNotFoundError`异常。

相应地，在需要新建多级路径的场景下，可以使用`os.makedirs()`来完成任务。函数`os.makedirs()`执行的是递归创建，若有必要，会分别新建指定路径经过的中间路径，直到最后创建出末端的“叶子路径”。

### os.remove()

用于删除文件，如果指定路径是目录而非文件的话，就会抛出`IsADirectoryError`异常。删除目录应该使用`os.rmdir()`函数。

同样的，对应于`os.makedirs()`，删除路径操作`os.rmdir()`也有一个递归删除的函数`os.removedirs()`，该函数会尝试从最下级目录开始，逐级删除指定的路径，几乎就是一个`os.makedirs()`的逆过程；一旦遇到非空目录即停止。

### os.rename()

该函数的作用是将文件或路径重命名，一般调用格式为`os.rename(src, dst)`，即将`src`指向的文件或路径重命名为`dst`指定的名称。

注意，如果指定的目标路径在其他目录下，该函数还可实现文件或路径的“剪切并粘贴”功能。但无论直接原地重命名还是“剪切粘贴”，中间路径都必须要存在，否则就会抛出`FileNotFoundError`异常。如果目标路径已存在，Windows 下会抛出`FileExistsError`异常；Linux 下，如果目标路径为空且用户权限允许，则会静默覆盖原路径，否则抛出`OSError`异常，

和上两个函数一样，该函数也有对应的递归版本`os.renames()`，能够创建缺失的中间路径。

注意，这两种情况下，如果函数执行成功，都会调用`os.removedir()`函数来递归删除源路径的最下级目录。

### os.getcwd()

“getcwd”实际上是“get the current working directory”的简写，顾名思义，也就是说这个函数的作用是“获取当前工作路径”。在程序运行的过程中，无论物理上程序在实际存储空间的什么地方，“当前工作路径”即可认为是程序所在路径；与之相关的“相对路径”、“同目录下模块导入”等相关的操作均以“当前工作路径”为准。

在交互式环境中，返回的就是交互终端打开的位置；而在 Python 文件中，返回的则是文件所在的位置。

```python
print(os.getcwd())
# d:\DeskTop\project\2022_11
```

## os.path 模块

使用该模块要注意一个很重要的特性：`os.path`中的函数基本上是纯粹的字符串操作。换句话说，传入该模块函数的参数甚至不需要是一个有效路径，该模块也不会试图访问这个路径，而仅仅是按照“路径”的通用格式对字符串进行处理。

更进一步地说，`os.path`模块的功能我们都可以自己使用字符串操作手动实现，该模块的作用是让我们在实现相同功能的时候不必考虑具体的系统，尤其是不需要过多关注文件系统分隔符的问题。

### os.path.getsize(path)

返回 path 的大小，以字节为单位，若 path 是目录则返回 0。

### os.path.abspath(path)

将传入路径规范化，返回一个相应的绝对路径格式的字符串。

也就是说当传入路径符合“绝对路径”的格式时，该函数仅仅将路径分隔符替换为适应当前系统的字符，不做其他任何操作，并将结果返回。所谓“绝对路径的格式”，其实指的就是一个字母加冒号，之后跟分隔符和字符串序列的格式：

```python
print(os.path.abspath(os.listdir()[0]))
# d:\DeskTop\project\2022_11\learn.py
```

### os.path.basename(path)

`os.path.basename()`该函数返回传入路径的“基名”，即文件名。

### os.path.dirname(path)

`os.path.dirname()`返回文件路径

```python
abspath = os.path.abspath(os.listdir()[0])
print(os.path.dirname(abspath))
print(os.path.basename(abspath))

# d:\DeskTop\project\2022_11
# learn.py
```

### os.path.join(path, *paths)

把目录和文件名合成一个路径

```python
import os
abspath = os.path.abspath(os.listdir()[0])
dirname = os.path.dirname(abspath)
basename = os.path.basename(abspath)
print(os.path.join(dirname, basename))

# d:\DeskTop\project\2022_11\learn.py
```

但如果传入路径中存在一个“绝对路径”格式的字符串，且这个字符串不是函数的第一个参数，那么其他在这个参数之前的所有参数都会被丢弃，余下的参数再进行组合。

换句话说，只有最后一个“绝对路径”及其之后的参数才会体现在返回结果中。

### os.path.exists(path)

这个函数用于判断路径所指向的位置是否存在。若存在则返回`True`，不存在则返回`False`。
一般的用法是在需要持久化保存某些数据的场景，为避免重复创建某个文件，需要在写入前用该函数检测一下相应文件是否存在，若不存在则新建，若存在则在文件内容之后增加新的内容。

### os.path.isabs(path)

该函数判断传入路径是否是绝对路径，若是则返回`True`，否则返回`False`。当然，仅仅是检测格式，同样不对其有效性进行任何核验

### os.path.isfile(path)

判断路径是否为文件

### os.path.isdir(path)

 判断路径是否为目录

### os.system(command)

调用 shell 脚本。

```python
import os
print(os.system('ipconfig'))
```
