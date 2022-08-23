## MongoDB

MongoDB是一种新型的文档数据库，和MySQL之类的关系型数据库有很大的不同，MongoDB采用的是类似JSON的存储格式，没有表结构的限制，使用方便、灵活性特别高，尤其适合Web应用的快速开发

```bash
npm install mongodb
```

### BSON

BSON是一种类似JSON的二进制存储格式，简称Binary JSON，它和JSON一样，支持内嵌的文档对象和数组对象，但是BSON有一些JSON没有的数据类型，如Date和二进制类型，如下面的结构

```js
{

  "_id" : ObjectId("626e39d5d71965cff6f4ec0a"),

  "account" : "13000000000",

  "nickname" : "Tom",

  "status" : 1,

  "activated" : true,

  "createdAt" : 1651390933788

}
```

### ObjectId

MongoDB中存储的文档中必须有一个 `_id` 键，这个键默认是个ObjectId对象，在每一个集合里面每一个文档都有唯一的 `_id` 值，来确保集合里面的每一个文档都能被唯一标识

### Node.js操作MongoDB

MongoDB原生的查询语言就是js风格的，所以如果要在Node.js中使用MongoDB也是非常简单的，通常会有两种选择

- 使用 `mongoose` 之类的知名ORM框架

- 使用原生的 `mongodb` 驱动进行操作
