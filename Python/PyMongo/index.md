## PyMongo

Python 需要 MongoDB 驱动程序来访问 MongoDB 数据库。

```shell
python -m pip install pymongo
```

### 创建数据库

要在 MongoDB 中创建数据库，首先要创建 MongoClient 对象，然后使用正确的 IP 地址和要创建的数据库的名称指定连接 URL。

如果数据库不存在，MongoDB 将创建数据库并建立连接。

```python
import pymongo

myclient = pymongo.MongoClient("mongodb://localhost:27017/")

mydb = myclient["mydatabase"]
```

**重要说明：**在 MongoDB 中，数据库只有在内容插入后才会创建! 就是说，数据库创建后要创建集合(数据表)并插入一个文档(记录)，数据库才会真正创建。

#### 检查数据库是否存在

```python
dblist = myclient.list_database_names()
if "mydatabase" in dblist:
  print("The database exists.")
```

### 创建集合

要在 MongoDB 中创建集合，请使用数据库对象并指定要创建的集合的名称。

如果它不存在，MongoDB 会创建该集合。

```python
mycol = mydb["customers"]
```

检查 "customers" 集合是否存在：

```python
collist = mydb.list_collection_names()
if "customers" in collist:
  print("The collection exists.")
```

### 如何使用

用法与其他语言驱动程序都大致相同。