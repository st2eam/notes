### CSS Modules

`create-react-app` 会把 `.module.css` 或者 `.module.scss` 结尾的文件当成 `CSS Modules` 来处理，所以如果我们想要使用该功能，只需要将组件的css文件命名为 `style.module.css` 这种结构，然后在组件中这样来引用

```ts
import styles from './style.module.css'
```

后面的用法和之前就完全一样了，对于不是以 `.module.css` 结尾的css文件，会被当做普通css处理，不会做类名转换。

ComponentA/index.tsx

```jsx
import style from './style.module.css'
export default function ComponentA() {
  return (
    <div className="ComponentA">
      <div className={style.children}>
        <h1 className={style.title}>A</h1>
      </div>
    </div>
  );
}
```

ComponentA/style.module.css

```css
.children .title {
  color: red;
  font-size: 2em;
  font-weight: bold;
  text-align: center;
}
```

类似 Vue 的 scope
