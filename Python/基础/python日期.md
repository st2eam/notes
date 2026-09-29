## Python 日期

Python 中的日期不是其自身的数据类型，但是我们可以导入名为 `datetime` 的模块，把日期视作日期对象进行处理。

导入 `datetime` 模块并显示当前日期：

```python
import datetime

x = datetime.datetime.now()
print(x)
```

## strftime() 方法

`datetime` 对象拥有把日期对象格式化为可读字符串的方法。

该方法称为 `strftime()`，并使用一个 `format` 参数来指定返回字符串的格式：

显示月份的名称：

```python
import datetime

x = datetime.datetime(2019, 10, 1)

print(x.strftime("%B"))
```

### 所有合法格式代码的参考：

| 指令 | 描述                            | 实例                     |
| :--- | :------------------------------ | :----------------------- |
| %a   | Weekday，短版本                 | Wed                      |
| %A   | Weekday，完整版本               | Wednesday                |
| %w   | Weekday，数字 0-6，0 为周日     | 3                        |
| %d   | 日，数字 01-31                  | 31                       |
| %b   | 月名称，短版本                  | Dec                      |
| %B   | 月名称，完整版本                | December                 |
| %m   | 月，数字01-12                   | 12                       |
| %y   | 年，短版本，无世纪              | 18                       |
| %Y   | 年，完整版本                    | 2018                     |
| %H   | 小时，00-23                     | 17                       |
| %I   | 小时，00-12                     | 05                       |
| %p   | AM/PM                           | PM                       |
| %M   | 分，00-59                       | 41                       |
| %S   | 秒，00-59                       | 08                       |
| %f   | 微妙，000000-999999             | 548513                   |
| %z   | UTC 偏移                        | +0100                    |
| %Z   | 时区                            | CST                      |
| %j   | 天数，001-366                   | 365                      |
| %U   | 周数，每周的第一天是周日，00-53 | 52                       |
| %W   | 周数，每周的第一天是周一，00-53 | 52                       |
| %c   | 日期和时间的本地版本            | Mon Dec 31 17:41:00 2018 |
| %x   | 日期的本地版本                  | 12/31/18                 |
| %X   | 时间的本地版本                  | 17:41:00                 |
| %%   | A % character                   | %                        |

## strptime和strftime的区别

### strptime

p表示parse，表示分析的意思，所以strptime是给定一个时间**字符串**和分析模式，返回一个**时间对象**。

### strftime

f表示format，表示格式化，和strptime正好相反，要求给一个**时间对象**和输出格式，返回一个时间**字符串**

```python
import datetime

time1 = datetime.datetime.strptime('2019/07/04 14:47', '%Y/%m/%d %H:%M')
print(type(time1), time1)

# 两种写法都是一样的，这里time1即上面代码返回的时间对象
time2 = datetime.datetime.strftime(time1, '%Y/%m/%d %H:%M')
time2 = time1.strftime('%Y/%m/%d %H:%M:%S')

print(type(time2), time2)

```

