## 什么是装饰器？

装饰器以其最简单的形式只是将一段代码与另一段代码包装在一起的一种方式-实际上就是“修饰”它。您可能以前已经听说过这个概念，即功能组合或高阶功能。

## 如何使用JavaScript装饰器

装饰器在JavaScript中使用一种特殊的语法，在装饰器中将前缀一个`@`符号并放置在装饰代码的最前面。

## 装饰器的种类

装饰器可以用来装饰四种类型的值。

- 类
- 类的属性（public, private, and static）
- 类的方法（public, private, and static）
- 属性存取器（accessor）（public, private, and static）

### 装饰器 API

装饰器是一个函数，API 的类型描述如下（TypeScript 写法）。

```typescript
type Decorator = (value: Input, context: {
  kind: string;
  name: string | symbol;
  access: {
    get?(): unknown;
    set?(value: unknown): void;
  };
  private?: boolean;
  static?: boolean;
  addInitializer?(initializer: () => void): void;
}) => Output | void;
```

装饰器函数调用时，会接收到两个参数。

- `value`：被装饰的值，某些情况下可能是`undefined`（装饰属性时）。
- `context`：一个对象，包含了被装饰的值的上下文信息。

另外，`input`和`output`表示输入的值和输出的值，每种装饰器都不一样，放在后面介绍。所有装饰器都可以不返回任何值。

`context`对象的属性如下。

- `kind`：字符串，表示装饰类型，可能取值有`class`、`method`、`getter`、`setter`、`field`、`accessor`。
- `name`：被装饰的值的名称: The name of the value, or in the case of private elements the description of it (e.g. the readable name).
- `access`：对象，包含访问这个值的方法，即存值器和取值器。
- `static`: 布尔值，该值是否为静态元素。
- `private`：布尔值，该值是否为私有元素。
- `addInitializer`：函数，允许用户增加初始化逻辑。

装饰器的执行步骤如下。

1. 计算各个装饰器的值，按照从左到右，从上到下的顺序。
2. 调用方法装饰器。
3. 调用类装饰器。

### 类的装饰

装饰器可以用来装饰整个类。

```javascript
@testable
class MyTestableClass {
  // ...
}

function testable(target) {
  target.isTestable = true;
}

MyTestableClass.isTestable // true
```
