import{_ as l,E as p,c as t,J as a,w as n,a4 as k,m as s,a as h,o as e}from"./chunks/framework.B-C7vMfR.js";const T=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Design Patterns/观察者模式.md","filePath":"Design Patterns/观察者模式.md"}'),E={name:"Design Patterns/观察者模式.md"},r=k("",5),d=s("img",{src:"https://refactoringguru.cn/images/patterns/content/observer/observer-comic-1-zh.png"},null,-1),g=s("p",null,"另一方面， 每次新产品到货时， 商店可以向所有顾客发送邮件 （可能会被视为垃圾邮件）。 这样， 部分顾客就无需反复前往商店了， 但也可能会惹恼对新产品没有兴趣的其他顾客。",-1),y=s("p",null,"我们似乎遇到了一个矛盾： 要么让顾客浪费时间检查产品是否到货， 要么让商店浪费资源去通知没有需求的顾客。",-1),F=s("h3",{id:"解决方案",tabindex:"-1"},[h("解决方案 "),s("a",{class:"header-anchor",href:"#解决方案","aria-label":'Permalink to "解决方案"'},"​")],-1),c=s("p",null,"拥有一些值得关注的状态的对象通常被称为目标， 由于它要将自身的状态改变通知给其他对象， 我们也将其称为发布者 （publisher）。 所有希望关注发布者状态变化的其他对象被称为订阅者 （subscribers）。",-1),o=s("p",null,"观察者模式建议你为发布者类添加订阅机制， 让每个对象都能订阅或取消订阅发布者事件流。 不要害怕！ 这并不像听上去那么复杂。 实际上， 该机制包括 1） 一个用于存储订阅者对象引用的列表成员变量； 2） 几个用于添加或删除该列表中订阅者的公有方法。",-1),C=s("img",{src:"https://refactoringguru.cn/images/patterns/diagrams/observer/solution1-zh.png"},null,-1),A=s("p",null,"现在， 无论何时发生了重要的发布者事件， 它都要遍历订阅者并调用其对象的特定通知方法。",-1),D=s("p",null,"实际应用中可能会有十几个不同的订阅者类跟踪着同一个发布者类的事件， 你不会希望发布者与所有这些类相耦合的。 此外如果他人会使用发布者类， 那么你甚至可能会对其中的一些类一无所知。",-1),B=s("p",null,"因此， 所有订阅者都必须实现同样的接口， 发布者仅通过该接口与订阅者交互。 接口中必须声明通知方法及其参数， 这样发布者在发出通知时还能传递一些上下文数据。",-1),u=s("img",{src:"https://refactoringguru.cn/images/patterns/diagrams/observer/solution2-zh.png"},null,-1),b=s("p",null,"如果你的应用中有多个不同类型的发布者， 且希望订阅者可兼容所有发布者， 那么你甚至可以进一步让所有订阅者遵循同样的接口。 该接口仅需描述几个订阅方法即可。 这样订阅者就能在不与具体发布者类耦合的情况下通过接口观察发布者的状态。",-1),_=s("h3",{id:"观察者模式结构",tabindex:"-1"},[h("观察者模式结构 "),s("a",{class:"header-anchor",href:"#观察者模式结构","aria-label":'Permalink to "观察者模式结构"'},"​")],-1),v=s("img",{src:"https://refactoringguru.cn/images/patterns/diagrams/observer/structure-indexed.png"},null,-1),m=k("",5);function f(q,j,x,w,S,O){const i=p("center");return e(),t("div",null,[r,a(i,null,{default:n(()=>[d]),_:1}),a(i,null,{default:n(()=>[h("前往商店和发送垃圾邮件。")]),_:1}),g,y,F,c,o,a(i,null,{default:n(()=>[C]),_:1}),a(i,null,{default:n(()=>[h("订阅机制允许对象订阅事件通知。")]),_:1}),A,D,B,a(i,null,{default:n(()=>[u]),_:1}),a(i,null,{default:n(()=>[h("发布者调用订阅者对象中的特定通知方法来通知订阅者。")]),_:1}),b,_,a(i,null,{default:n(()=>[v]),_:1}),m])}const V=l(E,[["render",f]]);export{T as __pageData,V as default};
