---
title: TypeScript 类型运算符
originalPath: 计算机与软件/编程语言/TypeScript/ts类型运算符.md
primaryCategory: 计算机与软件/编程语言/TypeScript
categories:
  - path: 计算机与软件/编程语言/TypeScript
    reason: 正文讨论 TypeScript 类型运算符 的定义和使用示例。
classificationStatus: confirmed
relations:
  - target: 计算机与软件/编程语言/TypeScript/ts高级类型.md
    type: citation
    status: confirmed
    reason: 类型谓词与类型保护解释联合类型的细化。
    evidence: 正文的类型谓词使用 Bird 与 Chicken 联合类型，并引用高级类型中的示例。
  - target: 计算机与软件/编程语言/TypeScript/ts内置工具类型.md
    type: citation
    status: confirmed
    reason: 条件类型示例直接解释 NonNullable 工具。
    evidence: 正文对比 NonNullable 与 NoNull 如何去除 null 和 undefined。
---
# TypeScript 类型运算符

本篇的联合类型示例承接 [[计算机与软件/编程语言/TypeScript/ts高级类型|高级类型]]；NonNullable 等现成实现参见 [[计算机与软件/编程语言/TypeScript/ts内置工具类型|内置工具类型]]。

原文链接：[TypeScript: Documentation - Utility Types (typescriptlang.org)](https://www.typescriptlang.org/docs/handbook/utility-types.html)

## 二、关键字

### extends

语法：`T extends K`

#### 接口继承

`extends` 用来做继承功能，相信大家都不陌生,就不展开说明了。

#### 类型约束

此时这里的 extends 不是类、接口的继承，而是对于类型的判断和约束，意思是判断 T 能否赋值给 K

就像三元运算符一样，条件类型根据条件来选择两种可能的类型之一:

`T extends U ? X : Y`

看一个简单的例子，一个值可以是用户的名字或年龄。如果是名字，那么这个值的类型就是 `string`；如果是年龄，那这个值的类型就是 `number`。

```ts
type Name = string;
type Age = number;
type UserInformation<T> = T extends Age ? Age : Name;

const userAge: UserInformation<Age> = 100;
const userName: UserInformation<Name> = 'admin';

```

单独使用条件类型可能用处不是很大，但是结合泛型使用时就非常有用，可以在泛型中对传入的类型进行约束。一个常见的用例就是使用带有 never 类型的条件类型来修剪类型中的值。

1. 定义一个名为 `NoNull` 的类型别名：

```ts
type NoNull<T>
```

2. 我们想从类型中剔除 `null`，需要通过条件来检查类型是否包含 `null`：

```ts
type NoNull<T> = T extends null
```

3. 当这个条件为 true 时，不想使用该类型，返回 `never` 类型：

```ts
type NoNull<T> = T extends null ? never
```

4. 当这个条件为 false 时，说明类型中不包含 `null` ，可以直接返回 `T` ：

```ts
type NoNull<T> = T extends null ? never : T;
```

将 str 变量的类型更改为 `NoNull`：

```ts
type NoNull<T> = T extends null ? never : T;
type NullableString = string | null;
const str: NoNull<NullableString> = 'str';
```

事实上，TypeScript 有一个类似的实用程序类型，称为 `NonNullable`，其实现如下：

```ts
type NonNullable<T> = T extends null | undefined ? never : T;
```

`NonNullable` 和 `NoNull` 之间的区别在于 `NonNullable` 将从类型中删除 `undefined` 以及 `null`。

### 类型映射(in)

`in` 会遍历指定接口的 key 或者是遍历联合类型

`in`的右侧一般会跟一个联合类型，使用`in`操作符可以对该联合类型进行迭代。 其作用类似`for...in`或者`for...of`

```ts
type Animal = 'pig' | 'cat' | 'dog';

type Animals = {
 [key in Animal]: string;
};

// type Animals = {
//   pig: string;
//   cat: string;
//   dog: string;
// }

// 将 T 的所有属性转换为只读类型
type ReadOnlyType<T> = {
 readonly [P in keyof T]: string;
};

type ReadOnlyAnimals = ReadOnlyType<Animals>;

// type ReadOnlyAnimals = {
//   readonly pig: string;
//   readonly cat: string;
//   readonly dog: string;
// }

const animals: ReadOnlyAnimals = {
 pig: 'peppa',
 cat: 'candy',
 dog: 'danny',
};

```

### 类型谓词(is)

语法：`parameterName is Type`

> parameterName 必须是来自于当前函数签名里的一个参数名，判断 parameterName 是否是 Type 类型。

看完联合类型的例子后，可能会考虑：如果想要在 start 函数中，根据情况去调用 Bird 的 fly 方法和 Chicken 的 swim 方法，该如何操作呢？

首先想到的可能是直接检查成员是否存在，然后进行调用：

```ts
function isBird(pet: Bird | Chicken): boolean {
 return pet instanceof Bird;
}

function isChicken(pet: Bird | Chicken): boolean {
 return pet instanceof Chicken;
}

function start(pet: Bird | Chicken) {
 // 调用 layEggs 没问题，因为 Bird 或者 Chicken 都有 layEggs 方法
 pet.layEggs();

 if (isBird(pet)) {
  (pet as Bird).fly();
 } else if (isChicken(pet)) {
  (pet as Chicken).playBasketball();
 }
}

```

看起来简洁了一点，但是调用方法的时候，还是要进行类型转换才可以，否则还是会报错，那有什么好的办法，能让我们判断完类型之后，就可以直接调用方法，不用再进行类型转换呢？

OK，肯定是有的，类型谓词 `is` 就派上用场了

```ts
function isBird(pet: Bird | Chicken): pet is Bird {
 return pet instanceof Bird;
}

function isChicken(pet: Bird | Chicken): pet is Chicken {
 return pet instanceof Chicken;
}

function start(pet: Bird | Chicken) {
 // 调用 layEggs 没问题，因为 Bird 或者 Chicken 都有 layEggs 方法
 pet.layEggs();

 if (isBird(pet)) {
  pet.fly();
 } else {
  pet.playBasketball();
 }
}
```

TypeScript 不仅知道在 if 分支里 pet 是 Chicken 类型； 它还清楚在 else 分支里，一定不是 Bird 类型，一定是 Chicken 类型

### 待推断类型(infer)

`infer`是在`typescript 2.8`中新增的关键字，几乎所有复杂的类型方法都有`infer`的身影。

`infer` 可以在 `extends` 的条件语句中推断待推断的类型。

可以用 `infer P` 来标记一个泛型，表示这个泛型是一个待推断的类型，并且可以直接使用

```ts
type ParamType<T> = T extends (param: infer P) => any ? P : T;

type FunctionType = (value: number) => boolean

type Param = ParamType<FunctionType>;   // type Param = number

type OtherParam = ParamType<symbol>;   // type Param = symbol

```

判断 T 是否能赋值给 `(param: infer P) => any`，并且将参数推断为泛型 P，如果可以赋值，则返回参数类型 P，否则返回传入的类型。

再来一个获取函数返回类型的例子：

```ts
type ReturnValueType<T> = T extends (param: any) => infer U ? U : T;

type FunctionType = (value: number) => boolean

type Return = ReturnValueType<FunctionType>;   // type Return = boolean

type OtherReturn = ReturnValueType<number>;   // type OtherReturn = number

```

判断 T 是否能赋值给 `(param: any) => infer U`，并且将返回值类型推断为泛型 U，如果可以赋值，则返回返回值类型 P，否则返回传入的类型

### 原始类型保护(typeof)

语法：`typeof T === "typename"`或 `typeof T !== "typename"`

`typeof` 类型保护用于确定变量的类型，它只能识别以下类型：

- boolean
- string
- bigint
- symbol
- undefined
- function
- number

对于这个列表之外的任何内容，`typeof`类型保护只会返回 `object`。

`typename` 只能是`number`、`string`、`boolean`和`symbol`四种类型，在 TS 中，只会把这四种类型的 `typeof` 比较识别为类型保护。

```ts
function direction(param: string | number) {
  if (typeof param === "string") {
    ...
  }
  if (typeof param === "number") {
    ...
  }
  ...
}
```

### 类型保护(instanceof)

与 `typeof` 类似，不过作用方式不同，`instanceof` 类型保护是通过构造函数来细化类型的一种方式。

`instanceof` 的右侧要求是一个构造函数，`TypeScript` 将细化为：

- 此构造函数的 `prototype` 属性的类型，如果它的类型不为 `any` 的话
- 构造签名所返回的类型的联合

在之前的例子中其实也有用到这个关键字：

```ts
function isBird(pet: Bird | Chicken): boolean {
 return pet instanceof Bird;
}

function isChicken(pet: Bird | Chicken): boolean {
 return pet instanceof Chicken;
}
```

### 索引类型查询操作符(keyof)

语法：`keyof T`

使用 `keyof` 操作符可以返回一个由这个类型的**公共属性名**组成的联合类型：

```ts
class Animal {
 height: number;
 weight: number;
 private speed: string;
}

type AnimalProps = keyof Animal; // "height" | "weight"

```

例如我们经常会获取对象的某个属性值，但是不确定是哪个属性，这个时候可以使用 `extends` 配合 `typeof` 对属性名进行限制，限制传入的参数只能是对象的属性名

```ts
const animal = {
 height: 2,
 weight: 10,
};

function getAnimalValue<T extends keyof typeof animal>(
 fieldName: keyof typeof animal
) {
 return animal[fieldName];
}

const heightValue = getAnimalValue('height');
const weightValue = getAnimalValue('weight');

// 报错：类型“"gender"”的参数不能赋给类型“"height" | "weight"”的参数。
// const genderValue = getAnimalValue('gender');

```

### 索引访问操作符(`T[P]`)

类似于 js 中使用对象索引的方式，只不过 js 中是返回对象属性的值，而在 ts 中返回的是 T 对应属性 P 的类型

```ts
type User = {
 id: number;
 name: string;
 address: {
  city: string;
  country: string;
 };
};

type Params = {
 id: User['id']; // number
 address: User['address'];
};

```

当然，也可以访问嵌套属性的类型：

```ts
type City = User['address']['city']; // string
```

可以通过联合类型来一次获取多个属性的类型：

```ts
type IdOrName = User['id' | 'name']; // string | number
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
