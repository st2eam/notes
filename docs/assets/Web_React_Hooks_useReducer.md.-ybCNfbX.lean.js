import{_ as h,c as t,m as i,a as s,t as l,a4 as n,o as k}from"./chunks/framework.B-C7vMfR.js";const f=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Web/React/Hooks/useReducer.md","filePath":"Web/React/Hooks/useReducer.md"}'),p={name:"Web/React/Hooks/useReducer.md"},e=n("",41),E=i("code",null,"React.createContext()",-1),r=i("br",null,null,-1),d=i("code",null,"useReducer",-1),g=i("code",null,"dispatch",-1),y=i("br",null,null,-1),c=i("code",null,"reducer",-1),F=i("br",null,null,-1),o=i("br",null,null,-1),u=i("code",null,"useContext",-1),C=i("br",null,null,-1),A=i("code",null,"xxContext.dispatch",-1),D=n("",8);function x(a,B,b,R,m,v){return k(),t("div",null,[e,i("p",null,[s("1、用"),E,s("定义一个全局数据对象；"),r,s(" 2、在父组件中用 "),d,s(" 定义全局变量xx和负责抛出修改事件的"),g,s("；"),y,s(" 3、在父组件之外，定义负责具体修改全局变量的处理函数"),c,s("，根据修改xx事件类型和参数，执行修改xx的值；"),F,s(" 4、在父组件中用"),i("code",null,"<XxxContext.Provider value="+l(a.xx,a.dispath)+">",1),s("标签把 全局共享数据和负责抛出修改xx的dispatch 暴露给子组件；"),o,s(" 5、在子组件中用 "),u,s("获取全局变量；"),C,s(" 6、在子组件中用 "),A,s(" 去抛出修改xx的事件，携带修改事件类型和参数；")]),D])}const q=h(p,[["render",x]]);export{f as __pageData,q as default};
