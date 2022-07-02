### useRef

“勾住”某些组件挂载完成或重新渲染完成后才拥有的某些对象，并返回该对象的引用。该引用在组件整个生命周期中都固定不变，该引用也不会随着组件重新渲染而失效。

```js
const refContainer = useRef(initialValue);
```

`useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数（`initialValue`）。返回的 ref 对象在组件的整个生命周期内持续存在。

### useRef使用示例

需求分析：  

1. 我们可以很轻松使用`<input >`创建出这个输入框。  

2. 需要使用useRef “勾住”这个输入框，当它被挂载到网页后，通过操作原生html的方法，将焦点赋予该输入框上。

完整代码如下：

```jsx
import React,{useEffect,useRef} from 'react'

function Component() {
  //先定义一个inputRef引用变量，用于“勾住”挂载网页后的输入框
  const inputRef = useRef(null);

  useEffect(() => {
    //inputRef.current就是挂载到网页后的那个输入框，一个真实DOM，因此可以调用html中的方法focus()
    inputRef.current.focus();
  },[]);

  return <div>
      {/* 通过 ref 属性将 inputRef与该输入框进行“挂钩” */}
      <input type='text' ref={inputRef} />
    </div>
}
export default Component
```
