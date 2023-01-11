## 删除文档

要删除一个文档，我们使用 `delete_one()` 方法。

`delete_one()` 方法的第一个参数是 query 对象，用于定义要删除的文档。

**注释：**如果查询找到了多个文档，则仅删除第一个匹配项。

```python
mycol.delete_one({ "address": "Mountain 21" })
```

## 删除多个文档

要删除多个文档，请使用 `delete_many()` 方法。

`delete_many()` 方法的第一个参数是一个查询对象，用于定义要删除的文档。

删除地址以字母 S 开头的所有文档：

```python
x = mycol.delete_many({ "address": {"$regex": "^S"} })

print(x.deleted_count, " documents deleted.")
```

## 删除集合中的所有文档

要删除集合中的所有文档，请把**空的查询对象**传递给 `delete_many()` 方法：

删除 "customers" 集合中的所有文档：

```python
x = mycol.delete_many({})

print(x.deleted_count, " documents deleted.")
```