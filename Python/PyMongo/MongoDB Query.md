## MongoDB 查询

`find_one()` 方法返回选择中的第一个匹配项。

`find()` 方法返回选择中的所有匹配项。

在集合中查找文档时，您能够使用 query 对象过滤结果。

`find()` 方法的第一个参数是 query 对象，用于限定搜索。

查找地址为 "Park Lane 38" 的文档：

```python
mydoc = mycol.find({ "address": "Park Lane 38" })
for x in mydoc:
  print(x)
```

### 只返回某些字段

`find()` 方法的第二个参数是描述包含在结果中字段的对象。

此参数是可选的，如果省略，则所有字段都将包含在结果中。

只返回姓名和地址，而不是 _ids：

```python
for x in mycol.find({},{ "_id": 0, "name": 1, "address": 1 }):
  print(x)
```

## 高级查询

如需进行高级查询，可以使用修饰符作为查询对象中的值。

例如，要查找 "address" 字段以字母 "S" 或更高（按字母顺序）开头的文档，请使用大于修饰符：`{"$gt": "S"}`：

查找地址以字母 "S" 或更高开头的文档：

```python
mydoc = mycol.find({ "address": { "$gt": "S" } })
```

### 使用正则表达式来筛选

您也可以将正则表达式用作修饰符。

正则表达式只能用于查询字符串。

如果只查找 "address" 字段以字母 "S" 开头的文档，请使用正则表达式 `{"$regex": "^S"}`：

查找地址以字母 "S" 开头的文档：

```python
mydoc = mycol.find({ "address": { "$regex": "^S" } })
```

### 限定结果

要限制 MongoDB 中的结果，我们使用 `limit()` 方法。

`limit()` 方法接受一个参数，定义的数字表示返回的文档数。

把结果限定为只返回 5 个文档：

```python
myresult = mycol.find().limit(5)
```

### 结果排序

`sort()` 方法为 "fieldname"（字段名称）提供一个参数，为 "direction"（方向）提供一个参数（升序是默认方向）

```python
sort("name", 1) # 升序
sort("name", -1) # 降序
```
按姓名的字母顺序对结果进行排序：
```python
mydoc = mycol.find().sort("name")
```