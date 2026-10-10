---
originalPath: Web/数据/MongoDB/MongoDB.md
primaryCategory: 计算机/数据/MongoDB
categories:
  - path: 计算机/数据/MongoDB
    reason: >-
      核心学习对象为“MongoDB”，正文依据：“MongoDB是一种新型的文档数据库，和MySQL之类的关系型数据库有很大的不同，MongoDB采用的是类似JSON的存储格式，没有表结构的限制，使用方便、灵活性特别高，尤其适合Web应用的快速开发
      BSON是一种类似JSON的二进制存储格式，简称Binary
      JSON，它和JSON一样，支持内嵌的文档对象和数组对象，但是BSON有一些JSON没有的数据类型，如Date和二进制类型，如下面的结构”；据其实体与学习对象归入计算机/数据/MongoDB。
classificationStatus: confirmed
relations:
  - target: 计算机/数据/MongoDB/PyMongo/index.md
    type: similar
    label: 主题对照
    reason: 共同操作 MongoDB 文档；数据库介绍与 Python 驱动接口互补。
    evidence: >-
      源笔记：MongoDB是一种新型的文档数据库，和MySQL之类的关系型数据库有很大的不同，MongoDB采用的是类似JSON的存储格式，没有表结构的限制，使用方便、灵活性特别高，尤其适合Web应用的快速开发
      BSON是一种类似JSON的二进制存储格式，简称Binary
      JSON，它和JSON一样，支持内嵌的文档对象和数组对象，但是BSON有一些JSON没有的数据类型，如Date和二进制类型，如下面的结构；目标笔记：Python
      需要 MongoDB 驱动程序来访问 MongoDB 数据库。
    status: inferred
tags:
  - 实体/MongoDB
---
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


## 与关系数据库如何选择

文档数据库适合结构随实体变化、聚合文档自然成形的场景；有关联约束、跨表查询和事务需求时，也应评估关系数据库。AI 应用的文档正文可以放对象存储或文档库，身份、权限和评测记录则需按访问模式设计，不能因为要做向量检索就放弃数据建模。先读[SQL 与数据建模](/%E8%AE%A1%E7%AE%97%E6%9C%BA%E4%B8%8E%E8%BD%AF%E4%BB%B6/%E6%95%B0%E6%8D%AE/%E5%85%B3%E7%B3%BB%E6%95%B0%E6%8D%AE%E5%BA%93/SQL%E4%B8%8E%E6%95%B0%E6%8D%AE%E5%BB%BA%E6%A8%A1.md)，再按实际查询和更新方式选型。最后核对：2026-09-29。
