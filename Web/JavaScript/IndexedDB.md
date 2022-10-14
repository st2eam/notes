# IndexedDB

IndexedDB 是一种底层 API，用于在客户端存储大量的结构化数据（也包括文件/二进制大型对象（blobs））。该 API 使用索引实现对数据的高性能搜索。虽然 Web Storage 在存储较少量的数据很有用，但对于存储更大量的结构化数据来说力不从心。而 IndexedDB 提供了这种场景的解决方案。使用 IndexedDB 执行的操作是异步执行的，以免阻塞应用程序。

意思就是IndexedDB主要用来客户端存储大量数据而生的，我们都知道cookie、localstorage等存储方式都有存储大小限制。如果数据量很大，且都需要客户端存储时，那么就可以使用IndexedDB数据库。

**客户端各存储方式对比**：

||会话期Cookie|持久性Cookie|sessionStorage|localStorage|indexedDB|
|---|---|---|---|---|---|
|**存储大小**|4kb|4kb|2.5~10MB|2.5~10MB|>250MB|
|**失效时间**|浏览器关闭自动清除|设置到期时间。到期清除|浏览器关闭后清除|永久保存（手动清除）|手动更新或删除|
|**与服务端交互**|有|有|无|无|无|
|**访问策略**|符合同源策略可以访问|符合同源策略可以访问|符合同源策略可以访问|即使同源也不可互相访问|符合同源策略可以访问|

## IndexedDB使用场景

所有的场景都基于客户端需要存储大量数据的前提下：

- 数据可视化等界面，大量数据，每次请求会消耗很大性能。
- 即时聊天工具，大量消息需要存在本地。
- 其它存储方式容量不满足时，不得已使用IndexedDB

## IndexedDB特点

1. 非关系型数据库(NoSql)

我们都知道MySQL等数据库都是关系型数据库，它们的主要特点就是数据都以一张二维表的形式存储，而Indexed DB是非关系型数据库，主要以键值对的形式存储数据。

2. 持久化存储

cookie、localStorage、sessionStorage等方式存储的数据当我们清楚浏览器缓存后，这些数据都会被清除掉的，而使用IndexedDB存储的数据则不会，除非手动删除该数据库。

3. 异步操作

IndexedDB操作时不会锁死浏览器，用户依然可以进行其他的操作，这与localstorage形成鲜明的对比，后者是同步的。

4. 支持事务

IndexedDB支持事务(transaction)，这意味着一系列的操作步骤之中，只要有一步失败了，整个事务都会取消，数据库回滚的事务发生之前的状态，这和MySQL等数据库的事务类似。

5. 同源策略

IndexedDB同样存在同源限制，每个数据库对应创建它的域名。网页只能访问自身域名下的数据库，而不能访问跨域的数据库。

7. 存储容量大

这也是IndexedDB最显著的特点之一了，这也是不用localStorage等存储方式的最好理由。

## IndexedDB重要概念

### 仓库 objectStore

IndexedDB没有表的概念，它只有仓库store的概念，把仓库理解为表即可，即一个store是一张表。

### 索引 index

在关系型数据库当中也有索引的概念，我们可以给对应的表字段添加索引，以便加快查找速率。在IndexedDB中同样有索引，我们可以在创建store的时候同时创建索引，在后续对store进行查询的时候即可通过索引来筛选，给某个字段添加索引后，在后续插入数据的过成功，索引字段便不能为空。

### 游标 cursor

游标是IndexedDB数据库新的概念，大家可以把游标想象为一个指针，比如我们要查询满足某一条件的所有数据时，就需要用到游标，我们让游标一行一行的往下走，游标走到的地方便会返回这一行数据，此时我们便可对此行数据进行判断，是否满足条件。

>【注意】：IndexedDB查询不像MySQL等数据库方便，它只能通过主键、索引、游标方式查询数据。

### 事务

IndexedDB支持事务，即对数据库进行操作时，只要失败了，都会回滚到最初始的状态，确保数据的一致性。

## 创建或连接数据库

兼容浏览器:

```js
  var indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB
```

代码如下：

```ts
  openDB(dbName: string, version：number = 1) {
    new Promise((resolve, reject) => {
      // 打开数据库，若没有则会创建
      const request = indexedDB.open(dbName, version)
      // 数据库有更新时候的回调
      request.onsuccess = (event: Event) => {
        let target = event.target as IDBOpenDBRequest
        this.db = target.result as IDBDatabase
        console.log('数据库打开成功', target)
        resolve(this.db)
      }
      // 数据库打开失败的回调
      request.onerror = (event: Event) => {
        console.log('数据库打开报错', event)
      }
      // 数据库有更新时候的回调
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        // 数据库创建或升级的时候会触发
        console.log('onupgradeneeded', event)
        let target = event.target as IDBOpenDBRequest
        this.db = target.result as IDBDatabase
        // 创建一个数据库存储对象，并指定主键
        let objectStore = this.db.createObjectStore('store', {
          keyPath: 'Index1', // 这是主键
          autoIncrement: true // 实现自增
        })
        /**
        * @description 创建索引，定义存储对象的数据项
        * @param 1.第一个参数是创建的索引名称
        * @param 2.第二个参数是索引使用的关键名称
        * @param 3.第三个参数是可选配置参数
        */
        objectStore.createIndex('Index1', 'Index1', { unique: false })
        objectStore.createIndex('Index2', 'Index2', { unique: false })
        objectStore.createIndex('Index3', 'Index3', { unique: false })
      }
    })
```

我们将创建数据库的操作封装成了一个函数，并且该函数返回一个promise对象，使得在调用的时候可以链式调用，函数主要接收两个参数：数据库名称、数据库版本。函数内部主要有三个回调函数，分别是：

- `onsuccess`：数据库打开成功或者创建成功后的回调，这里我们将数据库实例返回了出去。
- `onerror`：数据库打开或创建失败后的回调。
- `onupgradeneeded`：当数据库版本有变化的时候会执行该函数，比如我们想创建新的存储库（表），就可以在该函数里面操作，更新数据库版本即可。

## 关闭数据库

当我们数据库操作完毕后，建议关闭它，节约资源。

代码如下：

```ts
  db.close()
```

## 删库跑路

```ts
/**
 * 删除数据库
 * @param {string} dbName 数据库名称
 */
function deleteDBAll(dbName) {
  let deleteRequest = indexedDB.deleteDatabase(dbName);
  deleteRequest.onerror = function (event) {
    console.log("删除失败");
  };
  deleteRequest.onsuccess = function (event) {
    console.log("删除成功");
  };
}
```

## 添加数据

```ts
  /**
   * 新增数据
   * @param {string} storeName 仓库名称
   * @param {object} data 数据
   */
  addData(storeName: string, data: IData) {
    const request = this.db
      .transaction(storeName, 'readwrite') // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
      .objectStore(storeName) // 仓库对象
      .add(data)

    request.onsuccess = event => {
      console.log('数据写入成功')
    }

    request.onerror = event => {
      console.log('数据写入失败')
    }
  }
}
```

## 删除数据

**通过主键删除数据**

```ts
  /**
   * 通过主键删除数据
   * @param {string} storeName 仓库名称
   * @param {object} key 主键值
   */
  delData(storeName: string, key: string) {
    const request = this.db
      .transaction([storeName], 'readwrite')
      .objectStore(storeName)
      .delete(key)

    request.onsuccess = function () {
      console.log('数据删除成功')
    }

    request.onerror = function () {
      console.log('数据删除失败')
    }
  }
```

**通过索引和游标删除指定的数据**

```ts
  /**
   * 通过索引和游标删除指定的数据
   * @param {string} storeName 仓库名称
   * @param {string} indexName 索引名
   * @param {object} indexValue 索引值
   */
  cursorDel(storeName: string, indexName: string, indexValue: string) {
    const store = this.db
      .transaction(storeName, 'readwrite')
      .objectStore(storeName)
    const request = store
      .index(indexName) // 索引对象
      .openCursor(IDBKeyRange.only(indexValue)) // 指针对象

    request.onsuccess = e => {
      const target = e.target as IDBRequest
      const cursor = target.result
      if (cursor) {
        const deleteRequest = cursor.delete() // 请求删除当前项
        deleteRequest.onerror = function () {
          console.log('游标删除该记录失败')
        }
        deleteRequest.onsuccess = function () {
          console.log('游标删除该记录成功')
        }
        cursor.continue()
      }
    }
    request.onerror = () => {
      console.log('数据删除失败')
    }
  }
```

## 更新数据

IndexedDB更新数据较为简单，直接使用put方法，值得注意的是如果数据库中没有该条数据，则会默认增加该条数据，否则更新。有些小伙伴喜欢更新和新增都是用put方法，这也是可行的。

```ts
  /**
   * 更新数据
   * @param {object} db 数据库实例
   * @param {string} storeName 仓库名称
   * @param {object} data 数据
   */
  updateData(storeName: string, data: IData) {
    var request = this.db
      .transaction([storeName], 'readwrite') // 事务对象
      .objectStore(storeName) // 仓库对象
      .put(data)

    request.onsuccess = function () {
      console.log('数据更新成功')
    }

    request.onerror = function () {
      console.log('数据更新失败')
    }
  }
```

## 查找数据

**通过主键读取数据**

```ts
  /**
   * 通过主键读取数据
   * @param {string} storeName 仓库名称
   * @param {string} key 主键值
   */
  getDataByKey(storeName: string, key: string) {
    return new Promise((resolve, reject) => {
      var transaction = this.db.transaction([storeName]) // 事务
      var objectStore = transaction.objectStore(storeName) // 仓库对象
      var request = objectStore.get(key) // 通过主键获取数据

      request.onerror = function (event) {
        console.log('事务失败')
      }

      request.onsuccess = function (event) {
        console.log('主键查询结果: ', request.result)
        resolve(request.result)
      }
    })
  }
```

**通过游标遍历获取数据**

```ts
  /**
   * 通过游标遍历获取数据
   * @param {string} storeName 仓库名称
   */
  getDataByCursor(storeName: string) {
    let list: Array<string> = []
    const store = this.db
      .transaction(storeName, 'readwrite') // 事务
      .objectStore(storeName) // 仓库对象
    const request = store.openCursor() // 指针对象
    // 游标开启成功，逐行读数据
    request.onsuccess = function (e) {
      const target = e.target as IDBRequest
      const cursor = target.result
      if (cursor) {
        // 必须要检查
        list.push(cursor.value)
        cursor.continue() // 遍历了存储对象中的所有内容
      } else {
        console.log('游标读取的数据：', list)
      }
    }
  }
```

**通过索引读取数据**

```ts
  /**
   * 通过索引读取数据
   * @param {string} storeName 仓库名称
   * @param {string} indexName 索引名称
   * @param {string} indexValue 索引值
   */
  getDataByIndex(storeName: string, indexName: string, indexValue: string) {
    const store = this.db
      .transaction(storeName, 'readwrite')
      .objectStore(storeName)
    const request = store.index(indexName).get(indexValue)
    request.onerror = function () {
      console.log('事务失败')
    }
    request.onsuccess = function (e) {
      const target = e.target as IDBRequest
      const result = target.result
      console.log('索引查询结果：', result)
    }
  }
```

**通过索引和游标查询数据**

我们发现，单独通过索引或者游标查询出的数据都是部分或者所有数据，如果我们想要查询出索引中满足某些条件的所有数据，那么单独使用索引或游标是无法实现的。当然，你也可以查询出所有数据之后在循环数组筛选出合适的数据，但是这不是最好的实现方式，最好的方式当然是将索引和游标结合起来。

```ts
  /**
   * 通过索引和游标查询记录
   * @param {string} storeName 仓库名称
   * @param {string} indexName 索引名称
   * @param {string} indexValue 索引值
   */
  cursorGetDataByIndex(
    storeName: string,
    indexName: string,
    indexValue: string
  ) {
    let list: Array<string> = []
    const store = this.db
      .transaction(storeName, 'readwrite')
      .objectStore(storeName) // 仓库对象
    const request = store
      .index(indexName) // 索引对象
      .openCursor(IDBKeyRange.only(indexValue)) // 指针对象
    request.onsuccess = function (e) {
      const target = e.target as IDBRequest
      const cursor = target.result
      if (cursor) {
        // 必须要检查
        list.push(cursor.value)
        cursor.continue() // 遍历了存储对象中的所有内容
      } else {
        console.log('游标索引查询结果：', list)
      }
    }
    request.onerror = function (e) {}
  }
```

参考链接：[https://zhuanlan.zhihu.com/p/429086021](https://zhuanlan.zhihu.com/p/429086021)
