## 什么是 PIP？

PIP 是 Python 包或模块的包管理器，pip之于python，就像npm之于node。pip与npm类似，也有对于python包的查找、下载、安装、卸载的功能。

**注释：**如果您使用的是 Python 3.4 或更高版本，则默认情况下会包含 PIP。

## 查找包

在 https://pypi.org/，您可以找到更多的包。

## 导出当前环境包

```shell
pip freeze >requirements.txt
```

同时也可以把这个环境文件给别人，别人可以照着这个文件进行安装一个与你的环境一模一样的python编译环境变量安装另一个编译环境的[第三方库](https://so.csdn.net/so/search?q=第三方库&spm=1001.2101.3001.7020)：`pip install -r requirements.txt`

## 卸载所有的python包

```shell
pip uninstall -r modules.txt -y
```

