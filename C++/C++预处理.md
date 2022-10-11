## 预处理器

### 宏定义

> 字符串的替换

# define 预处理指令用于创建符号常量。该符号常量通常称为宏，指令的一般形式是：```#define macro-name replacement-text```

当这一行代码出现在一个文件中时，在该文件中后续出现的所有宏都将会在程序编译之前被替换为 replacement-text。

```cpp
#ifndef π  // 先测试π是否被宏定义过
#define π 3.1415926 //如果没有则定义并执行程序段1
//程序段1   
#else       //如果已经定义则执行程序段2
//程序段2
#endif
```

### 参数宏

```cpp
#define MIN(a,b) (a<b ? a : b)
```

### # 和 ## 运算符

> 运算符会把replacement-text令牌转换为用引号引起来的字符串。

```cpp
#define MYSTR( x ) #x
···
cout << MYSTR(HELLO C++) << endl;
```

当上面的代码被编译和执行时，它会产生下列结果：```HELLO C++```

预处理器把```cout << MKSTR(HELLO C++) << endl;```

转换成了```cout << "HELLO C++" << endl;```

> 运算符用于连接两个令牌。

```cpp
#define concat(a, b) a ## b
···
int xy = 100;
cout << concat(x, y);
```

当上面的代码被编译和执行时，它会产生下列结果：```100```

预处理器把```cout << concat(x, y);```

转换成了```cout << xy;```

### C++ 中的预定义宏

| <div style="width:80px">宏</div> | 描述                        |
|:-------------------------------:| ------------------------- |
| ```__LINE__```                  | 代表当前源代码中的行号的整数常量。         |
| ```__FILE__```                  | 这会在程序编译时包含当前文件名。          |
| ```__DATE__```                  | 进行预处理的日期，格式为"Mmm dd yyyy" |
|                                 | ```__TIME__```            |
| ```__FUNCTION__```             | 当前所在函数名                   |
