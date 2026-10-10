---
title: TypeScript 高级类型
originalPath: 计算机/编程语言/TypeScript/ts高级类型.md
primaryCategory: 计算机/编程语言/TypeScript
categories:
  - path: 计算机/编程语言/TypeScript
    reason: 正文讨论 TypeScript 高级类型 的定义和使用示例。
classificationStatus: confirmed
relations:
  - target: 计算机/编程语言/TypeScript/ts类型运算符.md
    type: similar
    status: inferred
    reason: 高级类型的组合与类型运算符的细化构成相邻主题。
    evidence: 本篇解释 Bird 与 Chicken 联合类型，类型运算符笔记继续用该示例解释类型谓词。
---
# TypeScript 高级类型

类型细化与相关关键字参见 [[计算机/编程语言/TypeScript/ts类型运算符|类型运算符]]。

原文链接：[TypeScript: Documentation - Utility Types (typescriptlang.org)](https://www.typescriptlang.org/docs/handbook/utility-types.html)

## 一、高级类型

### 交叉类型(&)

交叉类型是将多个类型合并为一个类型。 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性。

语法： `T & U`

> 其返回类型既要符合 T 类型也要符合 U 类型

假设有两个接口：一个是 IPerson 接口，一个是 IWorker 接口，通过 & 运算符定义了 IStaff 交叉类型，所以该类型同时拥有 IPerson 和 IWorker 这两种类型的成员：

```ts
interface IPerson {
 id: string;
  age: number;
}

interface IWorker {
 companyId: string;
}

type IStaff = IPerson & IWorker;

// 少了任何一个属性都会报错
const staff: IStaff = {
 id: '1213',
 age: 23,
 companyId: '10086',
};
```

那么现在问题来了，假设在合并多个类型的过程中，刚好出现某些类型存在相同的成员，但对应的类型又不一致，比如：

```ts
interface X {
  c: string;
  d: string;
}

interface Y {
  c: number;
  e: string
}

type XY = X & Y;
type YX = Y & X;

// 不能将类型“number”分配给类型“never”。ts(2322)
const p: XY = { c: 6, d: 'd', e: 'e' };

// 不能将类型“string”分配给类型“never”。ts(2322)
const q: YX = { c: 'c', d: 'd', e: 'e' };

```

为什么接口 X 和接口 Y 混入后，成员 c 的类型会变成 `never` 呢？这是因为混入后成员 c 的类型为 `string & number`，即成员 c 的类型既是 `string` 类型又是 `number` 类型。很明显这种类型是不存在的，所以混入后成员 c 的类型为 `never`。

在上面示例中，刚好接口 X 和接口 Y 中内部成员 c 的类型都是基本数据类型，那么如果是非基本数据类型的话，又会是什么情形。

```ts
interface X {
 x: { a: boolean };
}

interface Y {
 x: { b: string };
}

interface Z {
 x: { c: number };
}

type XYZ = X & Y & Z;

const p: XYZ = {
 x: {
  // 少了任何一个属性都会报错
  a: true,
  b: 'str',
  c: 666,
 },
};

```

以上代码是可以编译通过的，由此可知在混入多个类型时，若存在相同的成员，且成员类型为非基本数据类型，那么是可以成功合并。

### 联合类型(|)

联合类型与交叉类型很有关联，但是使用上却完全不同。

语法： `T | U`

> 其返回类型为连接的多个类型中的任意一个

用法：假设声明一个数据，既可以是 string 类型，也可以是 null 类型

```ts
let str： string | null = null
str = ''
```

`start` 函数的参数类型既是 `Bird | Chicken`，那么在 `start` 函数中，想要直接调用的话，只能调用 `Bird` 和 `Chicken` 都具备的方法，否则编译会报错

```ts
class Bird {
 fly() {
  console.log('Bird flying');
 }
 layEggs() {
  console.log('Bird layEggs');
 }
}

class Chicken {
 playBasketball() {
  console.log('Chicken playBasketball');
 }
 layEggs() {
  console.log('Chicken layEggs');
 }
}

const bird = new Bird();
const chicken = new Chicken();

function start(pet: Bird | Chicken) {
 // 调用 layEggs 没问题，因为 Bird 或者 Chicken 都有 layEggs 方法
 pet.layEggs();

 // 会报错：Property 'fly' does not exist on type 'Bird | Chicken'
 // pet.fly();

 // 会报错：Property 'playBasketball' does not exist on type 'Bird | Chicken'
 // pet.playBasketball();
}

start(bird);

start(chicken);
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
