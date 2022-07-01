## 类型

在 JavaScript 中

有 5 种不同的可以包含值的数据类型：

- string
- number
- boolean
- object
- function

有 6 种类型的对象：

- Object
- Date
- Array
- String
- Number
- Boolean

以及 2 种不能包含值的数据类型：

- null
- undefined

### constructor 属性

`constructor` 属性返回所有 JavaScript 变量的构造函数。

```js
"Bill".constructor                // 返回 function String()  {[native code]}
(3.14).constructor                // 返回 function Number()  {[native code]}
false.constructor                 // 返回 function Boolean() {[native code]}
[1,2,3,4].constructor             // 返回 function Array()   {[native code]}
{name:'Bill',age:19}.constructor  // 返回 function Object()  {[native code]}
new Date().constructor            // 返回 function Date()    {[native code]}
function () {}.constructor        // 返回 function Function(){[native code]}
```

## 类型转换

JavaScript 类型转换表

下表中列出了将不同 JavaScript 值转换为数字、字符串和布尔的结果：

<table>
  <tbody>
    <tr>
      <th>原始值</th>
      <th>转换为数字</th>
      <th>转换为字符串</th>
      <th>转换为逻辑</th>
    </tr>
    <tr>
      <td>false</td>
      <td>0</td>
      <td>"false"</td>
      <td>false</td>
    </tr>
    <tr>
      <td>true</td>
      <td>1</td>
      <td>"true"</td>
      <td>true</td>
    </tr>
    <tr>
      <td>0</td>
      <td>0</td>
      <td>"0"</td>
      <td>false</td>
    </tr>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>"1"</td>
      <td>true</td>
    </tr>
    <tr>
      <td>"0"</td>
      <td>0</td>
      <td>"0"</td>
      <td>true</td>
    </tr>
    <tr>
      <td>"000"</td>
      <td>0</td>
      <td>"000"</td>
      <td>true</td>
    </tr>
    <tr>
      <td>"1"</td>
      <td>1</td>
      <td>"1"</td>
      <td>true</td>
    </tr>
    <tr>
      <td>NaN</td>
      <td>NaN</td>
      <td>"NaN"</td>
      <td>false</td>
    </tr>
    <tr>
      <td>Infinity</td>
      <td>Infinity</td>
      <td>"Infinity"</td>
      <td>true</td>
    </tr>
    <tr>
      <td>-Infinity</td>
      <td>-Infinity</td>
      <td>"-Infinity"</td>
      <td>true</td>
      </td>
    </tr>
    <tr>
      <td>""</td>
      <td>0</td>
      <td>""</td>
      <td>false</td>
    </tr>
    <tr>
      <td>"20"</td>
      <td>20</td>
      <td>"20"</td>
      <td>true</td>
      </td>
    </tr>
    <tr>
      <td>"twenty"</td>
      <td>NaN</td>
      <td>"twenty"</td>
      <td>true</td>
    </tr>
    <tr>
      <td>[ ]</td>
      <td>0</td>
      <td>""</td>
      <td>true</td>
    </tr>
    <tr>
      <td>[20]</td>
      <td>20</td>
      <td>"20"</td>
      <td>true</td>
      </td>
    </tr>
    <tr>
      <td>[10,20]</td>
      <td>NaN</td>
      <td>"10,20"</td>
      <td>true</td>
      </td>
    </tr>
    <tr>
      <td>["twenty"]</td>
      <td>NaN</td>
      <td>"twenty"</td>
      <td>true</td>
      </td>
    </tr>
    <tr>
      <td>["ten","twenty"]</td>
      <td>NaN</td>
      <td>"ten,twenty"</td>
      <td>true</td>
      </td>
    </tr>
    <tr>
      <td>function(){}</td>
      <td>NaN</td>
      <td>"function(){}"</td>
      <td>true</td>
    </tr>
    <tr>
      <td>{ }</td>
      <td>NaN</td>
      <td>"[object Object]"</td>
      <td>true</td>
    </tr>
    <tr>
      <td>null</td>
      <td>0</td>
      <td>"null"</td>
      <td>false</td>    
    </tr>
    <tr>
      <td>undefined</td>
      <td>NaN</td>
      <td>"undefined"</td>
      <td>false</td>
    </tr>
  </tbody>
</table>
