## [异常](https://www.runoob.com/cplusplus/cpp-exceptions-handling.html)

**Error Code**

- 基于Error Code的错误处理
  - 被调用函数发生错误时返回错误码
  - 函数调用方检查并处理错误码
- 痛点
  - 代码繁琐，错误处理和业务逻辑耦合
  - 错误码表现力不足
  - 容易被忽略
  - 有的特殊函数没有返回值（构造函数，赋值操作符等）

**关键词**

```exception, throw, try/catch```

**抛出异常**

> 您可以使用 throw 语句在代码块中的任何地方抛出异常。throw语句的操作数可以是任意的表达式，表达式的结果的类型决定了抛出的异常的类型。

```cpp
double division(int a, int b)
{
   if( b == 0 )
   {
      throw "Division by zero condition!";
   }
   return (a/b);
}
```

**捕获异常**

> catch 块跟在 try 块后面，用于捕获异常。您可以指定想要捕捉的异常类型，这是由catch关键字后的括号内的异常声明决定的。

```cpp
try
{
   // 保护代码
}catch( ExceptionName e )
{
  // 处理 ExceptionName 异常的代码
}
```

> 实例

```cpp
#include <iostream>
using namespace std;

double division(int a, int b)
{
   if( b == 0 )
   {
      throw "Division by zero condition!";
   }
   return (a/b);
}

int main ()
{
   int x = 50;
   int y = 0;
   double z = 0;

   try {
     z = division(x, y);
     cout << z << endl;
   }catch (const char* msg) {
     cerr << msg << endl;
   }

   return 0;
}
```

> 运行结果

```cpp
Division by zero condition!
```

**捕获多种类型异常**

- 多个catch块
- 不发生隐式转换
- 支持子类转基类对象

**捕获所有异常**  

```catch(...)```

Catch块中的那些事儿

- 错误恢复
  - 如果可以，如果有必要
- 记录错误
  - 如果有必要
- 向上返回
  - 返回错误码
  - 重新抛出异常

**异常捕获链**

- 异常抛出后程序执行将立即跳转至最近的try块的最后，按顺序匹配catch块并执行；
- 相应的catch块执行后异常被处理，程序继续执行；
- 若无匹配的catch块则继续跳转至下一个最近的try块进行处理；
- 若当前函数中异常未被处理，则退出该函数（stack unwinding），在其调用函数中进行处理；
- 递归以上步骤支持异常被处理；
- 若跳转至最顶层依然无匹配的catch块，则程序退出;

**捕获Windows SEH异常**  
__try/__except

**异常总结**

- 优点
  - 隔离异常处理代码
  - 异常无法被忽略
  - 构造函数可以报错
- 缺点
  - 写异常安全的代码并不简单
  - 错误现场易丢失
  - 性能损失（现代编译器可能问题不大）
  - 编译出的二进制文件体积较大
