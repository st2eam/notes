---
originalPath: Fundamentals/Java.md
primaryCategory: 计算机与软件/编程语言/Java
categories:
  - path: 计算机与软件/编程语言/Java
    reason: >-
      核心学习对象为“Java”，正文依据：“声明语句：声明新的局部变量，该变量的类型必须和数组元素的类型匹配。其作用域限定在循环语句块，其值与此时数组元素的值相等。
      表达式：表达式是要访问的数组名，或者是返回值为数组的方法。”；据其实体与学习对象归入计算机与软件/编程语言/Java。
classificationStatus: confirmed
relations: []
tags:
  - 实体/Java
---
## 增强 for 循环

```java
for(声明语句 : 表达式){
   //代码句子}
```

**声明语句**：声明新的局部变量，该变量的类型必须和数组元素的类型匹配。其作用域限定在循环语句块，其值与此时数组元素的值相等。

**表达式**：表达式是要访问的数组名，或者是返回值为数组的方法。

```java
public class App {
    public static void main(String[] args) {
        int[] numbers = { 10, 20, 30, 40, 50 };
        for (int i : numbers) {
            System.out.println(i/5);
        }
    }
}
```

> 运行结果

```java
10
20
30
40
50
```

## 读入一行字符串

```java
import java.util.Scanner;

Scanner s = new Scanner(System.in);
String Id = s.nextLine();
```
