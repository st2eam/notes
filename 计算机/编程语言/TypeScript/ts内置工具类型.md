---
title: TypeScript 内置工具类型
originalPath: 计算机/编程语言/TypeScript/ts内置工具类型.md
primaryCategory: 计算机/编程语言/TypeScript
categories:
  - path: 计算机/编程语言/TypeScript
    reason: 正文讨论 TypeScript 内置工具类型 的定义和使用示例。
classificationStatus: confirmed
relations:
  - target: 计算机/编程语言/TypeScript/ts类型运算符.md
    type: citation
    status: confirmed
    reason: 内置工具的实现使用类型运算符。
    evidence: Partial 与 Record 定义使用 keyof 和 in，Extract 与 Exclude 使用 extends 条件类型。
---
# TypeScript 内置工具类型

这些工具使用的 keyof、in、extends 等语法参见 [[计算机/编程语言/TypeScript/ts类型运算符|类型运算符]]。

原文链接：[TypeScript: Documentation - Utility Types (typescriptlang.org)](https://www.typescriptlang.org/docs/handbook/utility-types.html)

## 三、映射类型

### 只读类型(`Readonly<T>`)

定义：

```ts
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
}
```

用于将 T 类型的所有属性设置为只读状态。被 `readonly` 标记的属性只能在声明时或类的构造函数中赋值，之后将不可改（即只读属性）

```
interface Person {
    name: string
    age: number
}

const person: Readonly<Person> = {
    name: 'Lucy',
    age: 22
}
```

总所周知，对象属性并不在`const`保护的范围内，因此我们可以使用`Readonly`这个关键字对对象的内容进行保护。

说到`Readonly`就不得不提到 TypeScript 3.4 中引入的一个实用功能：const 断言

在 TypeScript 中使用 `as const` 时，可以将对象的属性或数组的元素设置为只读，向语言表明表达式中的类型不会被扩大（例如从 42 到 number）。

```ts
const person = {
 name: 'Lucy',
 age: 22,
} as const;

// 相当于

const person: {
    readonly name: "Lucy";
    readonly age: 22;
}
```

通过 `as const`，使得数组成为只读元组，因此其内容是无法更改的，如果试图改变数组的内容，会得到一个错误：

```ts
// 相当于 const arr: readonly [3, 4]
const arr = [3, 4] as const;

// 报错：类型“readonly [3, 4]”上不存在属性“push”。
arr.push(5);
```

### 只读数组(`ReadonlyArray<T>`)

定义：

```ts
interface ReadonlyArray<T> {
    /** Iterator of values in the array. */
    [Symbol.iterator](): IterableIterator<T>;

    /**
     * Returns an iterable of key, value pairs for every entry in the array
     */
    entries(): IterableIterator<[number, T]>;

    /**
     * Returns an iterable of keys in the array
     */
    keys(): IterableIterator<number>;

    /**
     * Returns an iterable of values in the array
     */
    values(): IterableIterator<T>;
}

```

只能在数组初始化时为变量赋值，之后数组无法修改.

```ts
interface Person {
 name: string;
}

const personList: ReadonlyArray<Person> = [{ name: 'Jack' }, { name: 'Rose' }];

// 会报错：Property 'push' does not exist on type 'readonly Person[]'
// personList.push({ name: 'Lucy' })

// 但是内部元素如果是引用类型，元素自身是可以进行修改的
personList[0].name = 'Lily';
```

### 可选类型(`Partial<T>`)

用于将 `T` 类型的所有属性设置为可选状态，首先通过 `keyof T`，取出类型 `T` 的所有属性， 然后通过 `in` 操作符进行遍历，最后在属性后加上 `?`，将属性变为可选属性。

定义：

```ts
type Partial<T> = {
    [P in keyof T]?: T[P];
}
```

用法：

```ts
interface Person {
 name: string;
 age: number;
}

let person: Partial<Person> = {};

person = { name: 'ikun', age: 24 };

person = { name: 'z' };

person = { age: 18 };

```

### 必选类型(`Required<T>`)

和 `Partial` 的作用相反

用于将 `T` 类型的所有属性设置为必选状态，首先通过 `keyof T`，取出类型 `T` 的所有属性， 然后通过 `in` 操作符进行遍历，最后在属性后的 `?` 前加上 `-`，将属性变为必选属性。

定义：

```ts
type Required<T> = {
    [P in keyof T]-?: T[P];
}
```

使用：

```ts
interface Person {
 name?: string;
 age?: number;
}
// 报错：类型“{}”缺少类型“Required<Person>”中的以下属性: name, agets(2739)
let person: Required<Person> = {};

```

### 提取属性(`Pick<T>`)

从 T 类型中提取部分属性，作为新的返回类型。

定义：

```ts
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
}
```

使用：

```ts
interface Person {
  name: string;
  age: number;
  id: number;
  sex: 0 | 1;
}

// 问女生年纪不太礼貌，所以我们不需要 age 这个属性
type Woman = Pick<Person, "name" | "id">;

// 此时 Woman 等效于 Female

interface Female {
  name: string;
  id: number;
}
```

### 排除属性(`Omit<T>`)

和 `Pick` 作用相反，用于从 `T` 类型中，排除部分属性

定义：

```ts
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

```

使用：

```ts
interface User {
 id: number;
 name: string;
 age: number;
 sex: 0 | 1;
 tel: number;
}

type EditUser = Omit<User, 'tel'>; // 就是在 User 的基础上，去掉 id 属性

```

### `Awaited<Type>`

该类型旨在模拟异步函数中的 `await` 或 `Promise` 上的 `.then()` 方法等操作，特别是它们递归解除 `Promise` 的方式。

> Released: 4.5

```ts
type A = Awaited<Promise<string>>;
// 相当于 type A = string

type B = Awaited<Promise<Promise<number>>>;
// 相当于 type B = number

type C = Awaited<boolean | Promise<number>>;
// 相当于 type C = number | boolean

```

### 摘取类型(`Extract<T, U>`)

提取 T 中可以 赋值 给 U 的类型

定义：

```ts
type Extract<T, U> = T extends U ? T : never;
```

使用：

```ts
type T0 = Extract<'a' | 'b' | 'c', 'a' | 'f'>;
// 相当于 type T0 = "a"

type T1 = Extract<string | number | (() => void), Function>;
// 相当于 type T1 = () => void

type Shape =
 | { kind: 'circle'; radius: number }
 | { kind: 'square'; x: number }
 | { kind: 'triangle'; x: number; y: number };

type T2 = Extract<Shape, { kind: 'circle' }>;
// 相当于：
// type T2 = {
//  kind: 'circle';
//  radius: number;
// };

```

### 排除类型(`Exclude<T, U>`)

与 `Extract` 用法相反，从 `T` 中剔除可以赋值给 `U` 的类型

定义：

```ts
type Exclude<T, U> = T extends U ? never : T

```

用法：

```ts
type T0 = Exclude<'a' | 'b' | 'c', 'a'>;
// 相当于 type T0 = "b" | "c"

type T1 = Exclude<'a' | 'b' | 'c', 'a' | 'b'>;
// 相当于 type T1 = "c"

type T2 = Exclude<string | number | (() => void), Function>;
// 相当于 type T2 = string | number

type Shape =
 | { kind: 'circle'; radius: number }
 | { kind: 'square'; x: number }
 | { kind: 'triangle'; x: number; y: number };

type T3 = Exclude<Shape, { kind: 'circle' }>;
// 相当于：
// type T3 = {
//     kind: "square";
//     x: number;
// } | {
//     kind: "triangle";
//     x: number;
//     y: number;
// }

```

### 属性映射(`Record<Keys, Type>`)

构造属性键为Keys、属性值为Type的对象类型。此实用类型可用于将一个类型的属性映射到另一个类型

定义

```ts
type Record<Keys extends string | number | symbol, Type> = {
    [P in Keys]: Type;
}
```

接收两个泛型，Keys 必须可以是可以赋值给 `string | number | symbol` 的类型，通过 in 操作符对 Keys 进行遍历，每一个属性的类型都必须是 Type 类型

```ts
interface CatInfo {
 age: number;
 breed: string;
}

type CatName = 'miffy' | 'boris' | 'mordred';

const cats: Record<CatName, CatInfo> = {
 miffy: { age: 10, breed: 'Persian' },
 boris: { age: 5, breed: 'Maine Coon' },
 mordred: { age: 16, breed: 'British Shorthair' },
};

cats.boris;
// ^const cats: Record<CatName, CatInfo>
```

比如在传递参数时，希望参数是一个对象，但是不确定具体的类型，就可以使用 Record 作为参数类型

```ts
function doSomething(obj: Record<string, any>) {
 // do something
}
```

### 不可为空类型(`NonNullable<T>`)

之前提到过，`NonNullable`通过从type中排除null和undefined来构造类型。

Example

```ts
type T0 = NonNullable<string | number | undefined>;
// 相当于 type T0 = string | number

type T1 = NonNullable<string[] | null | undefined>;
// 相当于 type T1 = string[]
```

## 参考文献

1. [TypeScript: Documentation - Utility Types (typescriptlang.org)](https://www.typescriptlang.org/docs/handbook/utility-types.html)
2. [TypeScript 高级类型及用法 - 掘金 (juejin.cn)](https://juejin.cn/post/6985296521495314445)
3. [你需要知道的 TypeScript 高级类型 - 知乎](https://juejin.cn/post/6985296521495314445)
4. [【TypeScript】keyof & in 关键字详解 - 掘金 (juejin.cn)](https://juejin.cn/post/7105778922851139598)
5. [TypeScript 中的 is - 个人文章 - SegmentFault 思否](https://segmentfault.com/a/1190000022883470)
6. [TS关键字extends用法总结 - 掘金 (juejin.cn)](https://juejin.cn/post/6998736350841143326)
7. [TypeScript：一文搞懂 infer - 掘金 (juejin.cn)](https://juejin.cn/post/6998347146709696519)
8. [ts 之 Pick and Omit - 掘金 (juejin.cn)](https://juejin.cn/post/7080894326296805406)
9. [Typescript 中的 Partial, Readonly, Record, Pick - 掘金 (juejin.cn)](https://juejin.cn/post/6844904066489778183)
10. [TypeScript 的所有 高级类型 - 掘金 (juejin.cn)](https://juejin.cn/post/6844904068096196621)

## 总结

如果有写的不对或不严谨的地方，欢迎大家能提出宝贵的意见，十分感谢。
