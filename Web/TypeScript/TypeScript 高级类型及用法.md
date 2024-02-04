# TypeScript 高级类型及用法

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

语法：`typeof T === "typename" `或 `typeof T !== "typename"`

`typeof` 类型保护用于确定变量的类型，它只能识别以下类型：

- boolean
- string
- bigint
- symbol
- undefined
- function
- number

对于这个列表之外的任何内容，`typeof `类型保护只会返回 `object`。

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

### 索引访问操作符(T[P])

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

### Awaited<Type>

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
// 	kind: 'circle';
// 	radius: number;
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
// 	arg: {
// 		a: number;
// 		b: string;
// 	}
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