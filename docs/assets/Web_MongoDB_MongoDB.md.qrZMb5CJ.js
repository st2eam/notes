import{_ as s,c as a,o as i,a4 as n}from"./chunks/framework.B-C7vMfR.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Web/MongoDB/MongoDB.md","filePath":"Web/MongoDB/MongoDB.md"}'),t={name:"Web/MongoDB/MongoDB.md"},e=n(`<h2 id="mongodb" tabindex="-1">MongoDB <a class="header-anchor" href="#mongodb" aria-label="Permalink to &quot;MongoDB&quot;">​</a></h2><p>MongoDB是一种新型的文档数据库，和MySQL之类的关系型数据库有很大的不同，MongoDB采用的是类似JSON的存储格式，没有表结构的限制，使用方便、灵活性特别高，尤其适合Web应用的快速开发</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> mongodb</span></span></code></pre></div><h3 id="bson" tabindex="-1">BSON <a class="header-anchor" href="#bson" aria-label="Permalink to &quot;BSON&quot;">​</a></h3><p>BSON是一种类似JSON的二进制存储格式，简称Binary JSON，它和JSON一样，支持内嵌的文档对象和数组对象，但是BSON有一些JSON没有的数据类型，如Date和二进制类型，如下面的结构</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;_id&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ObjectId</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;626e39d5d71965cff6f4ec0a&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;account&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;13000000000&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;nickname&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Tom&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;status&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;activated&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;createdAt&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1651390933788</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="objectid" tabindex="-1">ObjectId <a class="header-anchor" href="#objectid" aria-label="Permalink to &quot;ObjectId&quot;">​</a></h3><p>MongoDB中存储的文档中必须有一个 <code>_id</code> 键，这个键默认是个ObjectId对象，在每一个集合里面每一个文档都有唯一的 <code>_id</code> 值，来确保集合里面的每一个文档都能被唯一标识</p><h3 id="node-js操作mongodb" tabindex="-1">Node.js操作MongoDB <a class="header-anchor" href="#node-js操作mongodb" aria-label="Permalink to &quot;Node.js操作MongoDB&quot;">​</a></h3><p>MongoDB原生的查询语言就是js风格的，所以如果要在Node.js中使用MongoDB也是非常简单的，通常会有两种选择</p><ul><li><p>使用 <code>mongoose</code> 之类的知名ORM框架</p></li><li><p>使用原生的 <code>mongodb</code> 驱动进行操作</p></li></ul>`,11),l=[e];function o(p,h,d,k,c,r){return i(),a("div",null,l)}const u=s(t,[["render",o]]);export{g as __pageData,u as default};
