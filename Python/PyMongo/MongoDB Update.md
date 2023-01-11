## 更新集合

您可以使用 `update_one()` 方法来更新 MongoDB 中调用的记录或文档。

`update_one()` 方法的第一个参数是 query 对象，用于定义要更新的文档。

注释：如果查询找到多个记录，则仅更新第一个匹配项。第二个参数是定义文档新值的对象。

把地址 "Valley 345" 改为 "Canyon 123"：

```python
mycol.update_one({"address": "Valley 345"},
                 {"$set": {"address": "Canyon 123"}})
```

## 更新多个

如需更新符合查询条件的所有文档，请使用 `update_many()` 方法。

更新地址以字母 "S" 开头的所有文档：

```python
x = mycol.update_many({"address": {"$regex": "^S"}},
                      {"$set": {"name": "Minnie"}})

print(x.modified_count, "documents updated.")
```