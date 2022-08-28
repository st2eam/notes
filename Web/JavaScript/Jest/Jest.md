```shell
npm install --save-dev jest
```

# 安装和移除

写测试的时候你经常需要在运行测试前做一些准备工作，和在运行测试后进行一些整理工作。 Jest 提供辅助函数来处理这个问题。

## 为多次测试重复设置

如果你有一些要为多次测试重复设置的工作，你可以使用 `beforeEach` 和 `afterEach`。

例如，我们考虑一些与城市信息数据库进行交互的测试。 你必须在每个测试之前调用方法 `initializeCityDatabase()` ，同时必须在每个测试后，调用方法 `clearCityDatabase()`。 你可以这样做：

```js
beforeEach(() => {
  initializeCityDatabase()
})
afterEach(() => {
  clearCityDatabase()
})
test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy()
})
test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy()
})
```

`beforeEach` 和 `afterEach` 能够通过与[异步代码测试](https://www.bookstack.cn/read/jestjs-28.0-zh/6ea47e6dcfb96fde.md) 相同的方式处理异步代码 — — 他们可以采取 `done` 参数或返回一个 promise。 例如，如果 `initializeCityDatabase()` 返回解决数据库初始化时的 promise ，我们会想返回这一 promise︰

```js
beforeEach(() => {  return initializeCityDatabase();});
```

## 一次性设置

在某些情况下，你只需要在文件的开头做一次设置。 如果这个通用设置是异步的，就比较麻烦，因为没办法每个用例都设置一遍，这样性能还很差。 Jest 提供 `beforeAll` 和 `afterAll` 处理这种情况。

例如，如果 `initializeCityDatabase` 和 `clearCityDatabase` 都返回了 promise ，城市数据库可以在测试中重用，我们就能把我们的测试代码改成这样:

```js
beforeAll(() => {
  return initializeCityDatabase()
})
afterAll(() => {
  return clearCityDatabase()
})
test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy()
})
test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy()
})

```

## 作用域

默认情况下，`beforeAll` 和 `afterAll` 的块会应用到文件中的每个测试。 此外可以通过 `describe` 块来将测试分组。 当 `beforeAll` 和 `afterAll` 的块在 `describe` 块内部时，则其只适用于该 `describe` 块内的测试。

```js
beforeAll(() => console.log('1 - beforeAll'));
afterAll(() => console.log('1 - afterAll'));
beforeEach(() => console.log('1 - beforeEach'));
afterEach(() => console.log('1 - afterEach'));

test('', () => console.log('1 - test'));

describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('2 - beforeAll'));
  afterAll(() => console.log('2 - afterAll'));
  beforeEach(() => console.log('2 - beforeEach'));
  afterEach(() => console.log('2 - afterEach'));

  test('', () => console.log('2 - test'));
});

// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll
```



## describe 和 test 块的执行顺序

Jest 会在所有真正的测试开始**之前**执行测试文件里所有的 describe 处理程序（handlers）。 这是在 `before*` 和 `after*` 处理程序里面 （而不是在 describe 块中）进行准备工作和整理工作的另一个原因。 当 describe  块运行完后,，默认情况下，Jest 会按照 test 出现的顺序（译者注：原文是in the order they were  encountered in the collection phase）依次运行所有测试，等待每一个测试完成并整理好，然后才继续往下走。

# 模拟函数

Mock 函数允许你测试代码之间的连接——实现方式包括：擦除函数的实际实现、捕获对函数的调用 ( 以及在这些调用中传递的参数) 、在使用 `new` 实例化时捕获构造函数的实例、允许测试时配置返回值。

有两种方法可以模拟函数：要么在测试代码中创建一个 mock 函数，要么编写一个[`手动 mock`](https://jestjs.io/zh-Hans/docs/manual-mocks)来覆盖模块依赖。

## 使用 mock 函数

假设我们要测试函数 `forEach` 的内部实现，这个函数为传入的数组中的每个元素调用一次回调函数。

```javascript
function forEach(items, callback) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}
```

为了测试此函数，我们可以使用一个 mock 函数，然后检查 mock 函数的状态来确保回调函数如期调用。

```javascript
const mockCallback = jest.fn(x => 42 + x);
forEach([0, 1], mockCallback);

// 此 mock 函数被调用了两次
expect(mockCallback.mock.calls.length).toBe(2);

// 第一次调用函数时的第一个参数是 0
expect(mockCallback.mock.calls[0][0]).toBe(0);

// 第二次调用函数时的第一个参数是 1
expect(mockCallback.mock.calls[1][0]).toBe(1);

// 第一次函数调用的返回值是 42
expect(mockCallback.mock.results[0].value).toBe(42);
```

## `.mock` 属性

所有的 mock 函数都有这个特殊的 `.mock`属性，它保存了关于此函数如何被调用、调用时的返回值的信息。 `.mock` 属性还追踪每次调用时 `this`的值，所以我们同样可以也检视（inspect） `this`：

```javascript
const myMock1 = jest.fn();
const a = new myMock1();
console.log(myMock1.mock.instances);
// > [ <a> ]

const myMock2 = jest.fn();
const b = {};
const bound = myMock2.bind(b);
bound();
console.log(myMock2.mock.contexts);
// > [ <b> ]
```

这些 mock 成员变量在测试中非常有用，用于说明这些 function 是如何被调用、实例化或返回的：

```javascript
// The function was called exactly once
expect(someMockFunction.mock.calls.length).toBe(1);

// The first arg of the first call to the function was 'first arg'
expect(someMockFunction.mock.calls[0][0]).toBe('first arg');

// The second arg of the first call to the function was 'second arg'
expect(someMockFunction.mock.calls[0][1]).toBe('second arg');

// The return value of the first call to the function was 'return value'
expect(someMockFunction.mock.results[0].value).toBe('return value');

// The function was called with a certain `this` context: the `element` object.
expect(someMockFunction.mock.contexts[0]).toBe(element);

// This function was instantiated exactly twice
expect(someMockFunction.mock.instances.length).toBe(2);

// The object returned by the first instantiation of this function
// had a `name` property whose value was set to 'test'
expect(someMockFunction.mock.instances[0].name).toEqual('test');

// The first argument of the last call to the function was 'test'
expect(someMockFunction.mock.lastCall[0]).toBe('test');
```

## Mock 的返回值

Mock 函数也可以用于在测试期间将测试值注入代码︰

```javascript
const myMock = jest.fn();
console.log(myMock());
// > undefined

myMock.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);

console.log(myMock(), myMock(), myMock(), myMock());
// > 10, 'x', true, true
```

在函数连续传递风格（functional continuation-passing style）的代码中时，Mock 函数也非常有效。 以这种代码风格有助于避免复杂的中间操作，便于直观表现组件的真实意图，这有利于在它们被调用之前，将值直接注入到测试中。

```javascript
const filterTestFn = jest.fn();

// Make the mock return `true` for the first call,
// and `false` for the second call
filterTestFn.mockReturnValueOnce(true).mockReturnValueOnce(false);

const result = [11, 12].filter(num => filterTestFn(num));

console.log(result);
// > [11]
console.log(filterTestFn.mock.calls[0][0]); // 11
console.log(filterTestFn.mock.calls[1][0]); // 12
```

大多数现实世界例子中，实际是在依赖的组件上配一个模拟函数并配置它，但手法是相同的。 在这些情况下，尽量避免在非真正想要进行测试的任何函数内实现逻辑。

## 模拟模块

假定有个从 API 获取用户的类。 该类用 [axios](https://github.com/axios/axios) 调用 API 然后返回 `data`，其中包含所有用户的属性：

users.js

```js
import axios from 'axios';

class Users {
  static all() {
    return axios.get('/users.json').then(resp => resp.data);
  }
}

export default Users;
```

现在，为测试该方法而不实际调用 API (使测试缓慢与脆弱)，我们可以用 `jest.mock(...)` 函数自动模拟 axios 模块。

一旦模拟模块，我们可为 `.get` 提供一个 `mockResolvedValue` ，它会返回假数据用于测试。 实际上，我们想说的是我们想让`axios.get('/users.json')` 有个伪造的响应结果。

users.test.js

```js
import axios from 'axios';
import Users from './users';

jest.mock('axios');

test('should fetch users', () => {
  const users = [{name: 'Bob'}];
  const resp = {data: users};
  axios.get.mockResolvedValue(resp);

  // or you could use the following depending on your use case:
  // axios.get.mockImplementation(() => Promise.resolve(resp))

  return Users.all().then(data => expect(data).toEqual(users));
});
```

## 模拟 部分模块

模块的子集可以被模拟，模块的其他部分可以维持当前实现：

foo-bar-baz.js

```js
export const foo = 'foo';
export const bar = () => 'bar';
export default () => 'baz';
//test.js
import defaultExport, {bar, foo} from '../foo-bar-baz';

jest.mock('../foo-bar-baz', () => {
  const originalModule = jest.requireActual('../foo-bar-baz');

  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => 'mocked baz'),
    foo: 'mocked foo',
  };
});

test('should do a partial mock', () => {
  const defaultExportResult = defaultExport();
  expect(defaultExportResult).toBe('mocked baz');
  expect(defaultExport).toHaveBeenCalled();

  expect(foo).toBe('mocked foo');
  expect(bar()).toBe('bar');
});
```

## Mock 实现

还有，在某些情况下用Mock函数替换指定返回值是非常有用的。 可以用 `jest.fn` 或 `mockImplementationOnce`方法来实现Mock函数。

```javascript
const myMockFn = jest.fn(cb => cb(null, true));

myMockFn((err, val) => console.log(val));
// > true
```

当你需要根据别的模块定义默认的Mock函数实现时，`mockImplementation` 方法是非常有用的。

foo.js

```js
module.exports = function () {
  // some implementation;
};
```

test.js

```js
jest.mock('../foo'); // this happens automatically with automocking
const foo = require('../foo');

// foo is a mock function
foo.mockImplementation(() => 42);
foo();
// > 42
```

当你需要模拟某个函数调用返回不同结果时，请使用 `mockImplementationOnce` 方法︰

```javascript
const myMockFn = jest
  .fn()
  .mockImplementationOnce(cb => cb(null, true))
  .mockImplementationOnce(cb => cb(null, false));

myMockFn((err, val) => console.log(val));
// > true

myMockFn((err, val) => console.log(val));
// > false
```

当 `mockImplementationOne`定义的实现逐个调用完毕时， 如果定义了`jest.fn `，它将使用 `jest.fn `。

```javascript
const myMockFn = jest
  .fn(() => 'default')
  .mockImplementationOnce(() => 'first call')
  .mockImplementationOnce(() => 'second call');

console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn());
// > 'first call', 'second call', 'default', 'default'
```

大多数情况下，我们的函数调用都是链式的，如果你希望创建的函数支持链式调用（因为返回了this），可以使用`.mockReturnThis()` 函数来支持。

```javascript
const myObj = {
  myMethod: jest.fn().mockReturnThis(),
};

// is the same as

const otherObj = {
  myMethod: jest.fn(function () {
    return this;
  }),
};
```

## Mock 名称

你可以为你的Mock函数命名，该名字会替代 `jest.fn()` 在单元测试的错误输出中出现。 用这个方法你就可以在单元测试输出日志中快速找到你定义的Mock函数。

```javascript
const myMockFn = jest
  .fn()
  .mockReturnValue('default')
  .mockImplementation(scalar => 42 + scalar)
  .mockName('add42');
```

## 自定义匹配器

最后，测试Mock函数需要写大量的断言，为了减少代码量，我们提供了一些自定义匹配器。

```javascript
// The mock function was called at least once
expect(mockFunc).toHaveBeenCalled();

// The mock function was called at least once with the specified args
expect(mockFunc).toHaveBeenCalledWith(arg1, arg2);

// The last call to the mock function was called with the specified args
expect(mockFunc).toHaveBeenLastCalledWith(arg1, arg2);

// All calls and the name of the mock is written as a snapshot
expect(mockFunc).toMatchSnapshot();
```

这些匹配器是断言Mock函数的语法糖。 你可以根据自己的需要自行选择匹配器。

```javascript
// The mock function was called at least once
expect(mockFunc.mock.calls.length).toBeGreaterThan(0);

// The mock function was called at least once with the specified args
expect(mockFunc.mock.calls).toContainEqual([arg1, arg2]);

// The last call to the mock function was called with the specified args
expect(mockFunc.mock.calls[mockFunc.mock.calls.length - 1]).toEqual([
  arg1,
  arg2,
]);

// The first arg of the last call to the mock function was `42`
// (note that there is no sugar helper for this specific of an assertion)
expect(mockFunc.mock.calls[mockFunc.mock.calls.length - 1][0]).toBe(42);

// A snapshot will check that a mock was invoked the same number of times,
// in the same order, with the same arguments. 它还会在名称上断言。 它还会在名称上断言。
expect(mockFunc.mock.calls).toEqual([[arg1, arg2]]);
expect(mockFunc.getMockName()).toBe('a mock name');
```

匹配器的完整列表，请查阅 [ 参考文档](https://jestjs.io/zh-Hans/docs/expect)。