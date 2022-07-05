## Map

ES6提供了 `Map` 数据结构，它类似于的对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值都可以当作键，也就是说，`Object` 提供了“字符串-值”的对应，`Map` 提供了“值-值”的对应，是一种更完善的Hash结构。

```js
let obj = { a: 1 }
let map = new Map()
map.set('name', 'Frank')
map.set(111, 123)
map.set(obj, { b: 2 })
console.log(map.keys()) // 
console.log(map.has(obj))  // true
console.log(map.delete(obj)) // true
console.log(map.size)  // 2
```

`Map` 的遍历会复杂一些，它提供了几个迭代器可供我们使用

- `keys()`：返回键名的遍历器
- `values()`：返回键值的遍历器
- `entries()`：返回所有成员的遍历器
- `forEach()`：遍历所有成员

```js
let map = new Map()
map.set('age', 21)
map.set('name', 'Frank')
// 使用keys()遍历
for (let key of map.keys()) {
  console.log(key, map.get(key))
}
// 'age' 21
// 'name' 'Frank'

// 使用values()遍历
for (let value of map.values()) {
  console.log(value)
}
// 21
// 'Frank'

// 使用entries()遍历
for (let item of map.entries()) {
  // entries()返回的item是一个数组，结构为：[key, value]
  console.log(item[0], items[1])
}
// 'age' 21
// 'name' 'Frank'

// 使用forEach()遍历
map.forEach((value, key) => {
  console.log(key, value)
})
// 'age' 21
// 'name' 'Frank'
```

我们还可以使用扩展运算符 `...` 来将 `Map` 展开为数组结构

```js
let map = new Map()
map.set('age', 21)
map.set('name', 'Frank')

console.log([...map.keys()])  // [ 'age', 'name' ]
console.log([...map.values()])  // [ 21, 'Frank' ]
console.log([...map.entries()]) // [ ['age', 21], ['name', 'Frank'] ]
```
