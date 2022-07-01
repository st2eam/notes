## react hook 预览

##### 定义变量

[useState()](https://github.com/puxiao/react-hook-tutorial/blob/master/02%20useState%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95.md)：定义普通变量  
[useReducer()](https://github.com/puxiao/react-hook-tutorial/blob/master/08%20useReducer%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95.md)：定义有不同类型、参数的变量

##### 组件传值

[useContext()](https://github.com/puxiao/react-hook-tutorial/blob/master/06%20useContext%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95.md)：定义和接收具有全局性质的属性传值对象，必须配合React.createContext()使用

##### 对象引用

[useRef()](https://github.com/puxiao/react-hook-tutorial/blob/master/12%20useRef%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95.md)：获取渲染后的DOM元素对象，可调用该对象原生html的方法，可能需要配合React.forwardRef()使用  
[useImperativeHandle()](https://github.com/puxiao/react-hook-tutorial/blob/master/13%20useImperativeHandle%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95.md)：获取和调用渲染后的DOM元素对象拥有的自定义方法，必须配合React.forwardRef()使用

##### 生命周期

[useEffect()](https://github.com/puxiao/react-hook-tutorial/blob/master/04%20useEffect%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95.md)：挂载或渲染完成后、即将被卸载前，调度  
[useLayoutEffect()](https://github.com/puxiao/react-hook-tutorial/blob/master/14%20useLayoutEffect%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95.md)：挂载或渲染完成后，同步调度

##### 性能优化

[useCallback()](https://github.com/puxiao/react-hook-tutorial/blob/master/10%20useCallback%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95.md)：获取某处理函数的引用，必须配合React.memo()使用  
[useMemo()](https://github.com/puxiao/react-hook-tutorial/blob/master/11%20useMemo%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95.md)：获取某处理函数返回值的副本

##### 代码调试

[useDebugValue()](https://github.com/puxiao/react-hook-tutorial/blob/master/15%20useDebugValue%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95.md)：对react开发调试工具中的自定义hook，增加额外显示信息

##### 自定义hook

[useCustomHook()](https://github.com/puxiao/react-hook-tutorial/blob/master/16%20%E8%87%AA%E5%AE%9A%E4%B9%89hook.md)：将hook相关逻辑代码从组件中抽离，提高hook代码可复用性

##### 自定义 Hook 大全

必不可少的 React Hooks集合。  
[GitHub - zenghongtu/react-use-chinese: 中文文档@react-use](https://github.com/zenghongtu/react-use-chinese)
