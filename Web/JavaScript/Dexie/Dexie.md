# Dexie

Dexie.js 是 indexedDB 的包装库 – 浏览器中的标准数据库。<https://dexie.org/>

## 为什么使用 Dexie ？

Dexie 解决了原生 IndexedDB API 的三个主要问题：

- 不明确的错误处理
- 糟糕的查询
- 代码复杂度

Dexie 提供了一个简洁的数据库 API，具有经过深思熟虑的 API 设计、强大的错误处理、可扩展性、更改跟踪感知和扩展的 KeyRange 支持（不区分大小写的搜索、设置匹配和 OR 操作）。

## Install dependencies

yarn

```shell
yarn add dexie
yarn add dexie-react-hooks
```

npm

```shell
npm install dexie
npm install dexie-react-hooks
```

## 速通

### Create a file（`db.ts`）

如果你使用Typescript，为了帮助你解决数据库实例的类型问题，表的属性（如db.friends）需要在Dexie的子类上明确声明。

```ts
// db.ts
import Dexie, { Table } from 'dexie';

export interface Friend {
  id?: number;
  name: string;
  age: number;
}

export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  friends!: Table<Friend>; 

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      friends: '++id, name, age' // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();
```

### Create a component that adds some data

写入数据库可以使用`Table.add()`、`Table.put()`、`Table.update()`和`Collection.modify()`--例子见Dexie的快速参考。这里我们要创建一个简单的React组件，允许用户使用`Table.add()`将数据添加到数据库中。

```tsx
export function AddFriendForm({defaultAge} = {defaultAge: 21}) {
  const [name, setName] = useState("");
  const [age, setAge] = useState(defaultAge);
  const [status, setStatus] = useState("");

  async function addFriend() {
    try {

      // Add the new friend!
      const id = await db.friends.add({
        name,
        age
      });

      setStatus(`Friend ${name} successfully added. Got id ${id}`);
      setName("");
      setAge(defaultAge);
    } catch (error) {
      setStatus(`Failed to add ${name}: ${error}`);
    }
  }

  return <>
    <p>
      {status}
    </p>
    Name:
    <input
      type="text"
      value={name}
      onChange={ev => setName(ev.target.value)}
    />
    Age:
    <input
      type="number"
      value={age}
      onChange={ev => setAge(Number(ev.target.value))}
    />
    
    <button onClick={addFriend}>
      Add
    </button>
  </>
}
```

### Create a component that queries data

```tsx

  const friends = useLiveQuery(() => db.friends.toArray())

  ...

  <ul>
    {friends?.map(friend => (
      <li key={friend.id}>
        {friend.name}, {friend.age}
      </li>
    ))}
  </ul>
```

要进行更详细的查询，请参考Dexie的查询项目的快速参考。

Notice two things here:

- 传递给`useLiveQuery()`的函数查询dexie的所有friends。
- 在最初的结果到来之前，结果将暂时未被定义——这解释了为什么我们把它称为`friends?` 而不是`friends`。

### Pass some query params

让我们改进FriendList组件，允许父组件传递一些props用于条件查询。

```tsx
export function FriendList({minAge, maxAge}) {
  const friends = useLiveQuery(
    async () => {
      //
      // Query Dexie's API
      //
      const friends = await db.friends
        .where('age')
        .between(minAge, maxAge)
        .toArray();

      // Return result
      return friends;
    },
    // specify vars that affect query:
    [minAge, maxAge] 
  );

  return <ul>
    {friends?.map(friend => <li key={friend.id}>
      {friend.name}, {friend.age}
    </li>)}
  </ul>;
}
```

Notice two things in the above example:

- 我们将两个参数传递给`useLiveQuery()`: async函数和deps。这个回调只是一个普通的异步函数，可以根据它所查询的内容计算任何类型的结果。它可以使用`Promise.all()`并行查询或者顺序查询。路上的任何 Dexie-call 都会被标记出来进行观察。在任何情况下，最终结果都会被观察到。

- 当查询函数使用影响查询的闭包时，需要`Deps`。在这种情况下，`minAge`和`maxAge`参数。父级组件可能为其传递新的值，这需要被检测到并使我们的查询重新执行。

## [API-Reference](https://dexie.org/docs/API-Reference)
