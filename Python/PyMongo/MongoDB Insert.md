## 插入集合

要在 MongoDB 中把记录或我们所称的文档插入集合，我们使用 `insert_one()` 方法。

`insert_one()` 方法的第一个参数是字典，其中包含希望插入文档中的每个字段名称和值。

在 "customers" 集合中插入记录：

```python
import pymongo

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["mydatabase"]
mycol = mydb["customers"]

mydict = { "name": "Bill", "address": "Highway 37" }

x = mycol.insert_one(mydict)
```

### 返回 _id 字段

`insert_one()` 方法返回 `InsertOneResult` 对象，该对象拥有属性 `inserted_id`，用于保存插入文档的 id。

```python
print(x.inserted_id)
```

## 插入多个文档

要将多个文档插入 MongoDB 中的集合，我们使用 `insert_many()` 方法。

`insert_many()` 方法的第一个参数是包含字典的列表，其中包含要插入的数据：

```python
import pymongo

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["mydatabase"]
mycol = mydb["customers"]

mylist = [
    {"name": "Amy", "address": "Apple st 652"},
    {"name": "Hannah", "address": "Mountain 21"},
    {"name": "Michael", "address": "Valley 345"},
    {"name": "Sandy", "address": "Ocean blvd 2"},
    {"name": "Betty", "address": "Green Grass 1"},
    {"name": "Richard", "address": "Sky st 331"},
    {"name": "Susan", "address": "One way 98"},
    {"name": "Vicky", "address": "Yellow Garden 2"},
    {"name": "Ben", "address": "Park Lane 38"},
    {"name": "William", "address": "Central st 954"},
    {"name": "Chuck", "address": "Main Road 989"},
    {"name": "Viola", "address": "Sideway 1633"}
]

x = mycol.insert_many(mylist)

# 打印被插入文档的  _id 值列表：
print(x.inserted_ids)
```

`insert_many()` 方法返回 `InsertManyResult` 对象，该对象拥有属性 `inserted_ids`，用于保存被插入文档的 id。