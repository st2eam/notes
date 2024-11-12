import{_ as i,c as a,a2 as n,o as t}from"./chunks/framework.BW-ZVgUE.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Web/CSS/CSS过渡.md","filePath":"Web/CSS/CSS过渡.md"}'),h={name:"Web/CSS/CSS过渡.md"};function l(p,s,k,e,E,d){return t(),a("div",null,s[0]||(s[0]=[n(`<h3 id="对过渡的浏览器支持" tabindex="-1">对过渡的浏览器支持 <a class="header-anchor" href="#对过渡的浏览器支持" aria-label="Permalink to &quot;对过渡的浏览器支持&quot;">​</a></h3><p>表格中的数字注明了完全支持该属性的首个浏览器版本。 <img src="https://note.youdao.com/yws/public/resource/c99ad8ee8977e056429a6768b07877cb/WEB998c28b0c3a66578b0bf0cb93f3ee811/WEBRESOURCE12c08b35243363422d1da581b9bfd966?ynotemdtimestamp=1656685941051" alt="image"> CSS 过渡允许您在给定的时间内平滑地改变属性值。</p><h3 id="如何使用-css-过渡" tabindex="-1">如何使用 CSS 过渡？ <a class="header-anchor" href="#如何使用-css-过渡" aria-label="Permalink to &quot;如何使用 CSS 过渡？&quot;">​</a></h3><p>如需创建过渡效果，必须明确两件事：</p><ul><li>您要添加效果的 CSS 属性</li><li>效果的持续时间</li></ul><p>实例</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  width</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">px</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  height</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">px</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  background</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">aqua</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  transition</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: width </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">.3</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">s</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, height </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">.2</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">s</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">:hover</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  width</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">300</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">px</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  height</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">300</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">px</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="指定过渡的速度曲线" tabindex="-1">指定过渡的速度曲线 <a class="header-anchor" href="#指定过渡的速度曲线" aria-label="Permalink to &quot;指定过渡的速度曲线&quot;">​</a></h3><p>transition-timing-function 属性规定过渡效果的速度曲线。</p><p>transition-timing-function 属性可接受以下值：</p><ul><li><p>ease - 规定过渡效果，先缓慢地开始，然后加速，然后缓慢地结束（默认）</p></li><li><p>linear - 规定从开始到结束具有相同速度的过渡效果</p></li><li><p>ease-in -规定缓慢开始的过渡效果</p></li><li><p>ease-out - 规定缓慢结束的过渡效果</p></li><li><p>ease-in-out - 规定开始和结束较慢的过渡效果</p></li><li><p>cubic-bezier(n,n,n,n) - 允许您在三次贝塞尔函数中定义自己的值</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">#div1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">transition-timing-function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">linear</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">#div2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">transition-timing-function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">ease</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">#div3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">transition-timing-function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">ease-in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">#div4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">transition-timing-function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">ease-out</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">#div5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">transition-timing-function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">ease-in-out</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;}</span></span></code></pre></div></li></ul><h3 id="延迟过渡效果" tabindex="-1">延迟过渡效果 <a class="header-anchor" href="#延迟过渡效果" aria-label="Permalink to &quot;延迟过渡效果&quot;">​</a></h3><p>transition-delay 属性规定过渡效果的延迟（以秒计）。</p><p>下例在启动之前有 1 秒的延迟：</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  transition-delay</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">s</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div>`,15)]))}const c=i(h,[["render",l]]);export{g as __pageData,c as default};
