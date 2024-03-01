import{_ as a,c as s,o as i,a4 as n}from"./chunks/framework.B-C7vMfR.js";const b=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Web/CSS/CSS布局.md","filePath":"Web/CSS/CSS布局.md"}'),e={name:"Web/CSS/CSS布局.md"},l=n(`<h2 id="display-属性" tabindex="-1">display 属性 <a class="header-anchor" href="#display-属性" aria-label="Permalink to &quot;display 属性&quot;">​</a></h2><p>display 属性规定是否/如何显示元素。</p><p>每个 HTML 元素都有一个默认的 display 值，具体取决于它的元素类型。大多数元素的默认 display 值为 block 或 inline。</p><h4 id="块级元素-block-element" tabindex="-1">块级元素（block element） <a class="header-anchor" href="#块级元素-block-element" aria-label="Permalink to &quot;块级元素（block element）&quot;">​</a></h4><p>块级元素总是从新行开始，并占据可用的全部宽度（尽可能向左和向右伸展）。</p><p>这个 <code>&lt;div&gt;</code> 元素属于块级元素。 块级元素的一些例子：</p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; - &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h6</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">form</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">header</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">footer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">section</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><h4 id="行内元素-inline-element" tabindex="-1">行内元素（inline element） <a class="header-anchor" href="#行内元素-inline-element" aria-label="Permalink to &quot;行内元素（inline element）&quot;">​</a></h4><p>内联元素不从新行开始，仅占用所需的宽度。</p><p>这是段落中的行内<code>&lt;span&gt;</code>元素。</p><p>行内元素的一些例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>&lt;span&gt;</span></span>
<span class="line"><span>&lt;a&gt;</span></span>
<span class="line"><span>&lt;img&gt;</span></span></code></pre></div><h4 id="覆盖默认的-display-值" tabindex="-1">覆盖默认的 Display 值 <a class="header-anchor" href="#覆盖默认的-display-值" aria-label="Permalink to &quot;覆盖默认的 Display 值&quot;">​</a></h4><p>1.一个常见的例子是为实现水平菜单而生成行内的<code>&lt;li&gt;</code> 元素：</p><p>实例</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  display</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">inline</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>2.将<code>&lt;span&gt;</code>元素显示为块元素：</p><p>实例</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">span</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  display</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">block</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h4 id="display-inline-block" tabindex="-1">display: inline-block <a class="header-anchor" href="#display-inline-block" aria-label="Permalink to &quot;display: inline-block&quot;">​</a></h4><p>与 display: inline 相比，主要区别在于 display: inline-block 允许在元素上设置宽度和高度。</p><p>同样，如果设置了 display: inline-block，将保留上下外边距/内边距，而 display: inline 则不会。</p><p>与 display: block 相比，主要区别在于 display：inline-block 在元素之后不添加换行符，因此该元素可以位于其他元素旁边。</p><h3 id="隐藏元素-display-none-还是-visibility-hidden" tabindex="-1">隐藏元素 - display:none 还是 visibility:hidden？ <a class="header-anchor" href="#隐藏元素-display-none-还是-visibility-hidden" aria-label="Permalink to &quot;隐藏元素 - display:none 还是 visibility:hidden？&quot;">​</a></h3><ol><li>通过将 display 属性设置为 none 可以隐藏元素。该元素将被隐藏，并且页面将显示为好像该元素不在其中</li><li>visibility:hidden; 也可以隐藏元素。 但是，该元素仍将占用与之前相同的空间。元素将被隐藏，但仍会影响布局：</li></ol><h2 id="position-属性" tabindex="-1"><a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/position" target="_blank" rel="noreferrer">position 属性</a> <a class="header-anchor" href="#position-属性" aria-label="Permalink to &quot;[position 属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)&quot;">​</a></h2><h4 id="position-static" tabindex="-1">position: static <a class="header-anchor" href="#position-static" aria-label="Permalink to &quot;position: static&quot;">​</a></h4><p>HTML 元素默认情况下的定位方式为 static（静态）。</p><p>静态定位的元素不受 top、bottom、left 和 right 属性的影响。</p><p>position: static; 的元素不会以任何特殊方式定位；它始终根据页面的正常流进行定位</p><h4 id="position-relative" tabindex="-1">position: relative <a class="header-anchor" href="#position-relative" aria-label="Permalink to &quot;position: relative&quot;">​</a></h4><p>position: relative; 的元素相对于其正常位置进行定位。</p><p>设置相对定位的元素的 top、right、bottom 和 left 属性将导致其偏离其正常位置进行调整。不会对其余内容进行调整来适应元素留下的任何空间。</p><h4 id="position-fixed" tabindex="-1">position: fixed <a class="header-anchor" href="#position-fixed" aria-label="Permalink to &quot;position: fixed&quot;">​</a></h4><p>position: fixed; 的元素是相对于视口定位的，这意味着即使滚动页面，它也始终位于同一位置。 top、right、bottom 和 left 属性用于定位此元素。</p><p>固定定位的元素不会在页面中通常应放置的位置上留出空隙。</p><h4 id="position-absolute" tabindex="-1">position: absolute <a class="header-anchor" href="#position-absolute" aria-label="Permalink to &quot;position: absolute&quot;">​</a></h4><p>position: absolute; 的元素相对于最近的定位祖先元素进行定位（而不是相对于视口定位，如 fixed）。</p><p>然而，如果绝对定位的元素没有祖先，它将使用文档主体（body），并随页面滚动一起移动。</p><p>注意：“被定位的”元素是其位置除 static 以外的任何元素。</p><h4 id="position-sticky" tabindex="-1">position: sticky <a class="header-anchor" href="#position-sticky" aria-label="Permalink to &quot;position: sticky&quot;">​</a></h4><p>position: sticky; 的元素根据用户的滚动位置进行定位。</p><p>粘性元素根据滚动位置在相对（relative）和固定（fixed）之间切换。起先它会被相对定位，直到在视口中遇到给定的偏移位置为止 - 然后将其“粘贴”在适当的位置（比如 position:fixed）。</p><h4 id="重叠元素" tabindex="-1">重叠元素 <a class="header-anchor" href="#重叠元素" aria-label="Permalink to &quot;重叠元素&quot;">​</a></h4><p>在对元素进行定位时，它们可以与其他元素重叠。</p><p>z-index 属性指定元素的堆栈顺序（哪个元素应放置在其他元素的前面或后面）。</p><p>元素可以设置正或负的堆叠顺序：</p><h2 id="css-overflow" tabindex="-1">CSS Overflow <a class="header-anchor" href="#css-overflow" aria-label="Permalink to &quot;CSS Overflow&quot;">​</a></h2><p>overflow 属性指定在元素的内容太大而无法放入指定区域时是剪裁内容还是添加滚动条。</p><p>overflow 属性可设置以下值：</p><ul><li>visible - 默认。溢出没有被剪裁。内容在元素框外渲染</li><li>hidden - 溢出被剪裁，其余内容将不可见</li><li>scroll - 溢出被剪裁，同时添加滚动条以查看其余内容</li><li>auto - 与 scroll 类似，但仅在必要时添加滚动条</li></ul><h2 id="float-属性" tabindex="-1">float 属性 <a class="header-anchor" href="#float-属性" aria-label="Permalink to &quot;float 属性&quot;">​</a></h2><p>float 属性用于定位和格式化内容，例如让图像向左浮动到容器中的文本那里。</p><p>float 属性可以设置以下值之一：</p><p>left - 元素浮动到其容器的左侧 right - 元素浮动在其容器的右侧 none - 元素不会浮动（将显示在文本中刚出现的位置）。默认值。 inherit - 元素继承其父级的 float 值 最简单的用法是，float 属性可实现（报纸上）文字包围图片的效果。</p><h2 id="水平和垂直对齐" tabindex="-1">水平和垂直对齐 <a class="header-anchor" href="#水平和垂直对齐" aria-label="Permalink to &quot;水平和垂直对齐&quot;">​</a></h2><h3 id="居中对齐元素" tabindex="-1">居中对齐元素 <a class="header-anchor" href="#居中对齐元素" aria-label="Permalink to &quot;居中对齐元素&quot;">​</a></h3><p>要使块元素（例如 <code>&lt;div&gt;</code> ）水平居中，请使用<code>margin: auto;</code></p><p>设置元素的宽度将防止其延伸到容器的边缘。</p><p>然后，元素将占用指定的宽度，剩余空间将在两个外边距之间平均分配</p><p>==注意==：如果未设置 width 属性（或将其设置为 100％），则居中对齐无效。</p><h3 id="居中对齐文本" tabindex="-1">居中对齐文本 <a class="header-anchor" href="#居中对齐文本" aria-label="Permalink to &quot;居中对齐文本&quot;">​</a></h3><p>如果仅需在元素内居中文本，请使用 text-align: center;</p><h3 id="居中对齐图像" tabindex="-1">居中对齐图像 <a class="header-anchor" href="#居中对齐图像" aria-label="Permalink to &quot;居中对齐图像&quot;">​</a></h3><p>如需居中图像，请将左右外边距设置为 auto，并将其设置为块元素：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>img {</span></span>
<span class="line"><span>  display: block;</span></span>
<span class="line"><span>  margin-left: auto;</span></span>
<span class="line"><span>  margin-right: auto;</span></span>
<span class="line"><span>  width: 40%;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="左和右对齐" tabindex="-1">左和右对齐 <a class="header-anchor" href="#左和右对齐" aria-label="Permalink to &quot;左和右对齐&quot;">​</a></h3><h4 id="_1-使用-position" tabindex="-1">1. 使用 position <a class="header-anchor" href="#_1-使用-position" aria-label="Permalink to &quot;1. 使用 position&quot;">​</a></h4><p>对齐元素的一种方法是使用 position: absolute</p><h4 id="_2-使用-float" tabindex="-1">2. 使用 float <a class="header-anchor" href="#_2-使用-float" aria-label="Permalink to &quot;2. 使用 float&quot;">​</a></h4><p>对齐元素的另一种方法是使用 float 属性</p><p>如果一个元素比包含它的元素高，并且它是浮动的，它将溢出其容器。可以使用 clearfix hack 来解决此问题</p><p><a href="https://www.w3school.com.cn/tiy/t.asp?f=css_layout_clearfix" target="_blank" rel="noreferrer">clearfix Hack</a> 我们可以向包含元素添加 overflow: auto;，来解决此问题</p><h3 id="垂直对齐" tabindex="-1">垂直对齐 <a class="header-anchor" href="#垂直对齐" aria-label="Permalink to &quot;垂直对齐&quot;">​</a></h3><h4 id="_1-使用-padding" tabindex="-1">1. 使用 padding <a class="header-anchor" href="#_1-使用-padding" aria-label="Permalink to &quot;1. 使用 padding&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>.center {</span></span>
<span class="line"><span>  padding: 70px 0;</span></span>
<span class="line"><span>  border: 3px solid green;</span></span>
<span class="line"><span>  text-align: center;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="_2-使用-line-height" tabindex="-1">2. 使用 line-height <a class="header-anchor" href="#_2-使用-line-height" aria-label="Permalink to &quot;2. 使用 line-height&quot;">​</a></h4><p>使用其值等于 height 属性值的 line-height 属性</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>.center {</span></span>
<span class="line"><span>  line-height: 200px;</span></span>
<span class="line"><span>  height: 200px;</span></span>
<span class="line"><span>  border: 3px solid green;</span></span>
<span class="line"><span>  text-align: center;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* 如果有多行文本，请添加如下代码：*/</span></span>
<span class="line"><span>.center p {</span></span>
<span class="line"><span>  line-height: 1.5;</span></span>
<span class="line"><span>  display: inline-block;</span></span>
<span class="line"><span>  vertical-align: middle;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="_3-使用-position-和-transform" tabindex="-1">3. 使用 position 和 transform <a class="header-anchor" href="#_3-使用-position-和-transform" aria-label="Permalink to &quot;3. 使用 position 和 transform&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>.center p {</span></span>
<span class="line"><span>  margin: 0;</span></span>
<span class="line"><span>  position: absolute;</span></span>
<span class="line"><span>  top: 50%;</span></span>
<span class="line"><span>  left: 50%;</span></span>
<span class="line"><span>  transform: translate(-50%, -50%);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="_4-使用-flexbox" tabindex="-1">4. 使用 Flexbox <a class="header-anchor" href="#_4-使用-flexbox" aria-label="Permalink to &quot;4. 使用 Flexbox&quot;">​</a></h4><p>您还可以使用 flexbox 将内容居中。请注意，IE10 以及更早的版本不支持 flexbox：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>.center {</span></span>
<span class="line"><span>  display: flex;</span></span>
<span class="line"><span>  justify-content: center;</span></span>
<span class="line"><span>  align-items: center;</span></span>
<span class="line"><span>  height: 200px;</span></span>
<span class="line"><span>  border: 3px solid green; </span></span>
<span class="line"><span>}</span></span></code></pre></div>`,84),p=[l];function t(o,h,r,d,c,k){return i(),s("div",null,p)}const u=a(e,[["render",t]]);export{b as __pageData,u as default};
