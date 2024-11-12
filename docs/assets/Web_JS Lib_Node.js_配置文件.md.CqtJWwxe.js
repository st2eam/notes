import{_ as e,c as a,a2 as t,o as i}from"./chunks/framework.BW-ZVgUE.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Web/JS Lib/Node.js/配置文件.md","filePath":"Web/JS Lib/Node.js/配置文件.md"}'),n={name:"Web/JS Lib/Node.js/配置文件.md"};function p(o,s,d,l,c,h){return i(),a("div",null,s[0]||(s[0]=[t('<h3 id="配置文件" tabindex="-1">配置文件 <a class="header-anchor" href="#配置文件" aria-label="Permalink to &quot;配置文件&quot;">​</a></h3><p>在实际的项目中通常都会有很多的配置项，如数据库的连接信息、服务监听的端口，当程序运行在不同地方的时候这些信息可能会是有变化的，所以不应该将它们硬编码在代码中，我们通常会将这些信息放在配置文件当中，这样程序在启动的时候就可以动态获取这些数据了</p><p>实现配置文件的方式有很多种，这里介绍一个使用比较广泛、非常简单的方案，那就是 <code>dotenv</code> 这个库，首先在项目根目录放置一个 <code>.env</code> 文件，内容格式如下</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PORT=1234</span></span></code></pre></div><p>然后在入口代码的第一行引入</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;dotenv/config&#39;</span></span></code></pre></div><p><code>dotenv</code> 就会将配置文件中的内容解析成当前进程的环境变量，通过下面的方式就可以拿到这个值了</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">process.env.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">PORT</span></span></code></pre></div>',8)]))}const k=e(n,[["render",p]]);export{g as __pageData,k as default};
