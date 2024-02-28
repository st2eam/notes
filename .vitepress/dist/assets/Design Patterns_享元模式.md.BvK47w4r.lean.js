import{_ as i,E as n,c as e,J as t,w as l,m as s,a as p,a4 as r,o as h}from"./chunks/framework.BtCE5x9j.js";const w=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Design Patterns/享元模式.md","filePath":"Design Patterns/享元模式.md"}'),k={name:"Design Patterns/享元模式.md"},c=s("h2",{id:"享元模式-flyweight-pattern",tabindex:"-1"},[p("享元模式（Flyweight Pattern） "),s("a",{class:"header-anchor",href:"#享元模式-flyweight-pattern","aria-label":'Permalink to "享元模式（Flyweight Pattern）"'},"​")],-1),o=s("p",null,"享元模式是一种结构型设计模式， 它摒弃了在每个对象中保存所有数据的方式， 通过共享多个对象所共有的相同状态， 让你能在有限的内存容量中载入更多对象。",-1),E=s("p",null,"说到享元模式，第一个想到的应该就是池技术了，String常量池、数据库连接池、缓冲池等等都是享元模式的应用，所以说享元模式是池技术的重要实现方式。",-1),g=s("p",null,"比如我们每次创建字符串对象时，都需要创建一个新的字符串对象的话，内存开销会很大，所以如果第一次创建了字符串对象“stream“，下次再创建相同的字符串”stream“时，只是把它的引用指向”stream“，这样就实现了”stream“字符串再内存中的共享。",-1),d=s("p",null,"举个最简单的例子，网络联机下棋的时候，一台服务器连接了多个客户端（玩家），如果我们每个棋子都要创建对象，那一盘棋可能就有上百个对象产生，玩家多点的话，因为内存空间有限，一台服务器就难以支持了，所以这里要使用享元模式，将棋子对象减少到几个实例。下面给出享元模式的定义。",-1),y=s("img",{src:"https://refactoringguru.cn/images/patterns/content/flyweight/flyweight-zh.png?id=3454f49363769767c6ff3500cf9f4889"},null,-1),m=r("",20);function _(u,f,T,A,D,x){const a=n("center");return h(),e("div",null,[c,o,E,g,d,t(a,null,{default:l(()=>[y]),_:1}),m])}const C=i(k,[["render",_]]);export{w as __pageData,C as default};
