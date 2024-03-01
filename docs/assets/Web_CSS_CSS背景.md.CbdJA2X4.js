import{_ as a,c as i,o as s,a4 as n}from"./chunks/framework.B-C7vMfR.js";const E=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Web/CSS/CSS背景.md","filePath":"Web/CSS/CSS背景.md"}'),e={name:"Web/CSS/CSS背景.md"},t=n(`<h2 id="背景简写属性" tabindex="-1">背景简写属性 <a class="header-anchor" href="#背景简写属性" aria-label="Permalink to &quot;背景简写属性&quot;">​</a></h2><p>在使用简写属性时，属性值的顺序为：</p><ul><li>background-color</li><li>background-image</li><li>background-repeat</li><li>background-attachment</li><li>background-position</li></ul><h2 id="_1-background-color" tabindex="-1">1.background-color <a class="header-anchor" href="#_1-background-color" aria-label="Permalink to &quot;1.background-color&quot;">​</a></h2><h2 id="_2-background-image" tabindex="-1">2.background-image <a class="header-anchor" href="#_2-background-image" aria-label="Permalink to &quot;2.background-image&quot;">​</a></h2><h3 id="css多重背景" tabindex="-1">CSS多重背景 <a class="header-anchor" href="#css多重背景" aria-label="Permalink to &quot;CSS多重背景&quot;">​</a></h3><p>CSS 允许您通过 background-image 属性为一个元素添加多幅背景图像。</p><p>不同的背景图像用逗号隔开，并且图像会彼此堆叠，其中的第一幅图像最靠近观看者。</p><p>下面的例子有两幅背景图像，第一幅图像是花朵（与底部和右侧对齐），第二幅图像是纸张背景（与左上角对齐）：</p><p>实例</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">#example1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  background-image</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">url</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">flower.gif</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">url</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">paper.gif</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  background-position</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">right</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> bottom</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">left</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> top</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  background-repeat</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">no-repeat</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">repeat</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">简写属性：</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">#example1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  background</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">url</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">flower.gif</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">right</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> bottom</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> no-repeat</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">url</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">paper.gif</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">left</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> top</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> repeat</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h2 id="_3-background-repeat" tabindex="-1">3.background-repeat <a class="header-anchor" href="#_3-background-repeat" aria-label="Permalink to &quot;3.background-repeat&quot;">​</a></h2><h3 id="repeat-x-y" tabindex="-1">repeat-x/y <a class="header-anchor" href="#repeat-x-y" aria-label="Permalink to &quot;repeat-x/y&quot;">​</a></h3><p>仅在水平方向重复</p><h3 id="no-repeat" tabindex="-1">no-repeat <a class="header-anchor" href="#no-repeat" aria-label="Permalink to &quot;no-repeat&quot;">​</a></h3><p>只显示一次背景图像</p><h2 id="_4-background-attachment" tabindex="-1">4.background-attachment <a class="header-anchor" href="#_4-background-attachment" aria-label="Permalink to &quot;4.background-attachment&quot;">​</a></h2><p><code>background-attachment</code> 属性指定背景图像是应该滚动还是固定的</p><h3 id="fixed" tabindex="-1">fixed <a class="header-anchor" href="#fixed" aria-label="Permalink to &quot;fixed&quot;">​</a></h3><p>指定应该固定背景图像</p><h3 id="scroll" tabindex="-1">scroll <a class="header-anchor" href="#scroll" aria-label="Permalink to &quot;scroll&quot;">​</a></h3><p>指定背景图像应随页面的其余部分一起滚动</p><h2 id="_5-background-position" tabindex="-1">5.background-position <a class="header-anchor" href="#_5-background-position" aria-label="Permalink to &quot;5.background-position&quot;">​</a></h2><h3 id="把背景图片放在右上角" tabindex="-1">把背景图片放在右上角 <a class="header-anchor" href="#把背景图片放在右上角" aria-label="Permalink to &quot;把背景图片放在右上角&quot;">​</a></h3><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">background-position</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: right top;</span></span></code></pre></div><h2 id="_6-background-size" tabindex="-1">6.background-size <a class="header-anchor" href="#_6-background-size" aria-label="Permalink to &quot;6.background-size&quot;">​</a></h2><p>可以通过长度、百分比或使用以下两个关键字之一来指定背景图像的大小：contain 或 cover。</p><p><code>contain</code>关键字将背景图像缩放为尽可能大的尺寸（但其宽度和高度都必须适合内容区域）。这样，取决于背景图像和背景定位区域的比例，可能存在一些未被背景图像覆盖的背景区域。</p><p><code>cover</code>关键字会缩放背景图像，以使内容区域完全被背景图像覆盖（其宽度和高度均等于或超过内容区域）。这样，背景图像的某些部分可能在背景定位区域中不可见。</p><h2 id="_7-background-origin" tabindex="-1">7.background-origin <a class="header-anchor" href="#_7-background-origin" aria-label="Permalink to &quot;7.background-origin&quot;">​</a></h2><p>属性指定背景图像的位置。</p><p>该属性接受三个不同的值：</p><ul><li>border-box - 背景图片从边框的左上角开始</li><li>padding-box -背景图像从内边距边缘的左上角开始（默认）</li><li>content-box - 背景图片从内容的左上角开始</li></ul><h2 id="_8-background-clip" tabindex="-1">8.background-clip <a class="header-anchor" href="#_8-background-clip" aria-label="Permalink to &quot;8.background-clip&quot;">​</a></h2><p>属性指定背景的绘制区域。</p><p>该属性接受三个不同的值：</p><ul><li>border-box - 背景绘制到边框的外部边缘（默认）</li><li>padding-box - 背景绘制到内边距的外边缘</li><li>content-box - 在内容框中绘制背景</li></ul>`,37),l=[t];function h(r,p,k,o,d,c){return s(),i("div",null,l)}const u=a(e,[["render",h]]);export{E as __pageData,u as default};
