---
title: TypeScript 函数工具类型
originalPath: 计算机/编程语言/TypeScript/ts函数工具类型.md
primaryCategory: 计算机/编程语言/TypeScript
categories:
  - path: 计算机/编程语言/TypeScript
    reason: 正文讨论 TypeScript 函数工具类型 的定义和使用示例。
classificationStatus: confirmed
relations:
  - target: 计算机/编程语言/TypeScript/ts类型运算符.md
    type: citation
    status: confirmed
    reason: 函数工具通过条件推断提取参数与返回值。
    evidence: ConstructorParameters、Parameters 和 ReturnType 的定义包含 extends 与 infer。
  - target: 计算机/编程语言/TypeScript/ts高级类型.md
    type: citation
    status: confirmed
    reason: ThisType 示例使用交叉类型组合对象。
    evidence: ObjectDescriptor 的 methods 类型为 M & ThisType<D & M>。
---
# TypeScript 函数工具类型

参数与返回值提取使用 [[计算机/编程语言/TypeScript/ts类型运算符|类型运算符]]中的条件类型与 infer；ThisType 示例的交叉类型参见 [[计算机/编程语言/TypeScript/ts高级类型|高级类型]]。

原文链接：[TypeScript: Documentation - Utility Types (typescriptlang.org)](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### 构造函数参数类型(`ConstructorParameters<typeof T>`)

返回 `class` 中构造函数参数类型组成的元组类型

定义：

```ts
type ConstructorParameters<T extends new (...args: any) => any> =
 T extends new (...args: infer P) => any ? P : never;
```

Example

```ts
type T0 = ConstructorParameters<ErrorConstructor>;
// 相当于 type T0 = [message?: string | undefined];

type T1 = ConstructorParameters<FunctionConstructor>;
// 相当于 type T1 = string[];

type T2 = ConstructorParameters<RegExpConstructor>;
// 相当于 type T2 = [pattern: string | RegExp, flags?: string | undefined];

class C {
 constructor(a: number, b: string) {}
}
type T3 = ConstructorParameters<typeof C>;
// 相当于 type T3 = [a: number, b: string];

type T4 = ConstructorParameters<any>;
// 相当于 type T4 = unknown[];

```

### 实例类型(`InstanceType<T>`)

获取 class 构造函数的返回类型

定义：

```ts
type InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any;
```

使用：

```ts
class C {
 x = 0;
 y = 0;
}

type T0 = InstanceType<typeof C>;
// type T0 = C

type T1 = InstanceType<any>;
// type T1 = any

type T2 = InstanceType<never>;
// type T2 = never

type T3 = InstanceType<string>;
// 类型“string”不满足约束“abstract new (...args: any) => any”。ts(2344)

```

### 函数参数类型(`Parameters<T>`)

获取函数的参数类型组成的 元组

定义：

```ts
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
```

用法：

```ts
type T0 = Parameters<() => string>;
// 相当于 type T0 = [];

type T1 = Parameters<(s: string) => void>;
// 相当于 type T1 = [s: string];

type T2 = Parameters<<T>(arg: T) => T>;
// 相当于 type T2 = [arg: unknown];

declare function f1(arg: { a: number; b: string }): void;

type T3 = Parameters<typeof f1>;
// 相当于
// type T3 = [
//  arg: {
//   a: number;
//   b: string;
//  }
// ];

type T4 = Parameters<any>;
// 相当于 type T4 = unknown[];

type T5 = Parameters<never>;
// 相当于 type T5 = never;

type T6 = Parameters<string>;
// string”不满足约束“(...args: any) => any
// 相当于 type T6 = never

```

### 函数返回值类型(`ReturnType<T>`)

获取函数的返回值类型

定义：

```ts
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

使用：

```ts
type T0 = ReturnType<() => string>;
// 相当于 type T0 = string

type T1 = ReturnType<(s: string) => void>;
// 相当于 type T1 = void

type T2 = ReturnType<<T>() => T>;
// 相当于 type T2 = unknown

type T3 = ReturnType<<T extends U, U extends number[]>() => T>;
// 相当于 type T3 = number[]

declare function f1(): { a: number; b: string };

type T4 = ReturnType<typeof f1>;
// 相当于
// type T4 = {
//     a: number;
//     b: string;
// }

type T5 = ReturnType<any>;
// type T5 = any

type T6 = ReturnType<never>;
// type T6 = never

type T7 = ReturnType<string>;
// 类型“string”不满足约束“(...args: any) => any”。
// type T7 = any

type T8 = ReturnType<Function>;
// 类型“Function”不满足约束“(...args: any) => any”。
// 类型“Function”提供的内容与签名“(...args: any): any”不匹配。
// type T8 = any

```

### `ThisParameterType< T >`

提取函数类型的`this`参数的类型，如果函数类型没有`this`形参，则返回`unknown`。

定义：

```ts
type ThisParameterType<T> = T extends (this: infer U, ...args: any[]) => any ? U : unknown;
```

使用：

```ts
function toHex(this: Number) {
 return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex>) {
 return toHex.apply(n);
}
```

### `OmitThisParameter<Type>`

删除 `Type` 中的 `this` 参数。如果 `Type` 没有显式声明 `this` 参数，则结果为 `Type`。否则，将从 `Type` 创建一个没有 `this` 参数的新函数类型。

定义：

```ts
type OmitThisParameter<T> = unknown extends ThisParameterType<T> ? T : T extends (...args: infer A) => infer R ? (...args: A) => R : T;
```

使用：

```ts
function toHex(this: Number) {
  return this.toString(16);
}
 
const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);
 
console.log(fiveToHex());
```

### `ThisType<Type>`

此实用程序不会返回转换后的类型。相反，它可以作为上下文此类型的标记。请注意，必须启用 [noImplicitThis](https://www.typescriptlang.org/tsconfig#noImplicitThis) 标记才能使用此工具。

```ts
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
};
 
function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}
 
let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // Strongly typed this
      this.y += dy; // Strongly typed this
    },
  },
});
 
obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
```

在上面的示例中，`makeObject` 的参数中的方法对象的上下文类型包括 `ThisType<D & M>`，因此方法对象中方法的 `this` 类型是 `{ x: number, y: number } & { moveBy(dx: number, dy: number): void }`。请注意，`methods` 属性的类型同时是方法中 `this` 类型的推理目标和来源。

`ThisType<T>` 标记接口只是 `lib.d.ts` 中声明的一个空接口。除了在对象字面的上下文类型中被识别外，该接口的行为与任何空接口一样。

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
