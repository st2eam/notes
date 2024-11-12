import{_ as s,c as t,a2 as i,o as p}from"./chunks/framework.BW-ZVgUE.js";const g=JSON.parse('{"title":"小程序-简介","description":"","frontmatter":{},"headers":[],"relativePath":"Web/微信小程序/微信小程序-简介.md","filePath":"Web/微信小程序/微信小程序-简介.md"}'),e={name:"Web/微信小程序/微信小程序-简介.md"};function o(n,a,r,l,h,d){return p(),t("div",null,a[0]||(a[0]=[i(`<h1 id="小程序-简介" tabindex="-1">小程序-简介 <a class="header-anchor" href="#小程序-简介" aria-label="Permalink to &quot;小程序-简介&quot;">​</a></h1><h2 id="为什么是微信小程序" tabindex="-1">为什么是微信小程序 ？ <a class="header-anchor" href="#为什么是微信小程序" aria-label="Permalink to &quot;为什么是微信小程序 ？&quot;">​</a></h2><ol><li><p>微信有海量⽤⼾，⽽且粘性很⾼，在微信⾥开发产品更容易触达⽤⼾；</p></li><li><p>推⼴app 或公众号的成本太⾼。</p></li><li><p>开发适配成本低。</p></li><li><p>容易⼩规模试错，然后快速迭代。</p></li><li><p>跨平台。</p></li></ol><h2 id="小程序与普通网页开发的区别" tabindex="-1">小程序与普通网页开发的区别 <a class="header-anchor" href="#小程序与普通网页开发的区别" aria-label="Permalink to &quot;小程序与普通网页开发的区别&quot;">​</a></h2><ol><li>运行环境不同</li></ol><p><strong>网页</strong>运行在<strong>浏览器环境</strong>中</p><p><strong>小程序</strong>运行在<strong>微信环境</strong>中</p><ol start="2"><li>API 不同</li></ol><p>由于运行环境的不同，所以小程序中，</p><p>无法调用 DOM和BOM的API。</p><p>但是，小程序中可以调用微信环境提供的各种 API，例如：</p><ul><li><p>地理定位</p></li><li><p>扫码</p></li><li><p>支付</p></li></ul><ol start="3"><li>开发模式不同</li></ol><p>网页的开发模式：<strong>浏览器 +代码编辑器</strong></p><p>小程序有自己的一套标准开发模式：</p><ul><li><strong>申请小程序开发账号</strong></li><li><strong>安装小程序开发者工具</strong></li><li><strong>创建和配置小程序项目</strong></li></ul><h2 id="小程序代码的构成-项目结构" tabindex="-1">小程序代码的构成 - 项目结构 <a class="header-anchor" href="#小程序代码的构成-项目结构" aria-label="Permalink to &quot;小程序代码的构成 - 项目结构&quot;">​</a></h2><p>1.基本组成结构</p><p><img src="https://note.youdao.com/yws/public/resource/c99ad8ee8977e056429a6768b07877cb/xmlnote/WEB3f86b4e72799babc61d27f85c60d0299/WEBRESOURCE029b89ecc91d4296554f2390913afd98/8832" alt="0"></p><p>① <strong>pages</strong> 用来存放所有小程序的页面</p><p>② utils 用来存放工具性质的模块（例如：格式化时间的自定义模块）</p><p>③ <strong>app.js 小程序项目的入口文件</strong></p><p>④ <strong>app.json 小程序项目的全局配置文件</strong></p><p>⑤ app.wxss 小程序项目的全局样式文件</p><p>⑥ project.config.json 项目的配置文件</p><p>⑦ sitemap.json 用来配置小程序及其页面是否允许被微信索引</p><p>2.小程序页面的组成部分</p><p>小程序官方建议把所有小程序的页面，都存放在<strong>pages目录</strong>中，以<strong>单独的文件夹</strong>存在，如图所示：</p><p><img src="https://note.youdao.com/yws/public/resource/c99ad8ee8977e056429a6768b07877cb/xmlnote/WEB3f86b4e72799babc61d27f85c60d0299/WEBRESOURCE5a52cf0452f2f7dee26e15a5808f721c/8849" alt="0"></p><p>其中，每个页面由 4 个基本文件组成，它们分别是：</p><p>① <strong>.js</strong> 文件（页面的脚本文件，存放页面的数据、事件处理函数等）</p><p>② <strong>.json</strong> 文件（当前页面的配置文件，配置窗口的外观、表现等）</p><p>③ <strong>.wxml</strong> 文件（页面的模板结构文件）</p><p>④ <strong>.wxss</strong> 文件（当前页面的样式表文件）</p><h2 id="小程序代码的构成-json-配置文件" tabindex="-1">小程序代码的构成 - JSON 配置文件 <a class="header-anchor" href="#小程序代码的构成-json-配置文件" aria-label="Permalink to &quot;小程序代码的构成 - JSON 配置文件&quot;">​</a></h2><h3 id="_1-json-配置文件的作用" tabindex="-1">1. JSON 配置文件的作用 <a class="header-anchor" href="#_1-json-配置文件的作用" aria-label="Permalink to &quot;1. JSON 配置文件的作用&quot;">​</a></h3><p>JSON是一种数据格式，在实际开发中，JSON总是以<strong>配置文件</strong>的形式出现。小程序项目中也不例外：通过不同的.json配置文件，可以对小程序项目进行不同级别的配置。</p><p>小程序项目中有4种json配置文件，分别是：</p><p>①项目根目录中的<strong>app.json</strong>配置文件</p><p>②项目根目录中的<strong>project.config.json</strong>配置文件</p><p>③项目根目录中的sitemap.json 配置文件</p><p>④<strong>每个页面文件夹中的.json配置文件</strong></p><h3 id="_2-app-json-文件" tabindex="-1">2. app.json 文件 <a class="header-anchor" href="#_2-app-json-文件" aria-label="Permalink to &quot;2. app.json 文件&quot;">​</a></h3><p><img src="https://note.youdao.com/yws/public/resource/c99ad8ee8977e056429a6768b07877cb/xmlnote/WEB3f86b4e72799babc61d27f85c60d0299/WEBRESOURCEc2fe097058a7b65adf6888181de03494/8897" alt="0"></p><p>app.json是当前小程序的全局配置，包括了小程序的所有页面路径、窗口外观、界面表现、底部 tab等。Demo项目里边的app.json配置内容如下：</p><p>简单了解下这4个配置项的作用：</p><p>①pages：用来记录当前小程序所有页面的路径</p><p>②window：全局定义小程序所有页面的背景色、文字颜色等</p><p>③style：全局定义小程序组件所使用的样式版本</p><p>④sitemapLocation：用来指明sitemap.json 的位置</p><h3 id="_3-project-config-json-文件" tabindex="-1">3.project.config.json 文件 <a class="header-anchor" href="#_3-project-config-json-文件" aria-label="Permalink to &quot;3.project.config.json 文件&quot;">​</a></h3><p>project.config.json是项目配置文件，用来记录我们对小程序开发工具所做的个性化配置，例如：</p><ul><li>setting 中保存了编译相关的配置</li><li>projectname 中保存的是项目名称</li><li>appid 中保存的是小程序的账号ID</li></ul><h3 id="_4-sitemap-json-文件" tabindex="-1">4.sitemap.json 文件 <a class="header-anchor" href="#_4-sitemap-json-文件" aria-label="Permalink to &quot;4.sitemap.json 文件&quot;">​</a></h3><p>微信现已开放小程序内搜索，效果类似于PC网页的SEO。sitemap.json 文件用来配置小程序页面是否允许微信索引。</p><p>当开发者允许微信索引时，微信会通过爬虫的形式，为小程序的页面内容建立索引。当用户的搜索关键字和页面的索引匹配成功的时候，小程序的页面将可能展示在搜索结果中。</p><p>注意：sitemap的索引提示是默认开启的，如需要关闭sitemap的索引提示，可在小程序项目配置文件project.config.json的setting 中配置字段checkSiteMap 为 false</p><h3 id="_5-页面的-json-配置文件" tabindex="-1">5.页面的 .json 配置文件 <a class="header-anchor" href="#_5-页面的-json-配置文件" aria-label="Permalink to &quot;5.页面的 .json 配置文件&quot;">​</a></h3><p>小程序中的每一个页面，可以使用.json文件来对本页面的窗口外观进行配置，页面中的配置项会覆盖 app.json 的 window 中相同的配置项。</p><h3 id="_6-新建小程序页面" tabindex="-1">6.新建小程序页面 <a class="header-anchor" href="#_6-新建小程序页面" aria-label="Permalink to &quot;6.新建小程序页面&quot;">​</a></h3><p>只需要在app.json-&gt;pages 中新增页面的存放路径，小程序开发者工具即可帮我们自动创建对应的页面文件。</p><h3 id="_7-修改项目首页" tabindex="-1">7.修改项目首页 <a class="header-anchor" href="#_7-修改项目首页" aria-label="Permalink to &quot;7.修改项目首页&quot;">​</a></h3><p>只需要调整 app.json -&gt; pages 数组中页面路径的前后顺序，即可修改项目的首页。小程序会把排在第一位的页面，当作项目首页进行渲染。</p><h2 id="小程序代码的构成-wxml-模板" tabindex="-1">小程序代码的构成 - WXML 模板 <a class="header-anchor" href="#小程序代码的构成-wxml-模板" aria-label="Permalink to &quot;小程序代码的构成 - WXML 模板&quot;">​</a></h2><h3 id="_1-什么是-wxml" tabindex="-1">1.什么是 WXML <a class="header-anchor" href="#_1-什么是-wxml" aria-label="Permalink to &quot;1.什么是 WXML&quot;">​</a></h3><p>WXML（WeiXinMarkup Language）是小程序框架设计的一套标签语言，用来构建小程序页面的结构，其作用类似于网页开发中的HTML。</p><h3 id="_2-wxml-和-html-的区别" tabindex="-1">2.WXML 和 HTML 的区别 <a class="header-anchor" href="#_2-wxml-和-html-的区别" aria-label="Permalink to &quot;2.WXML 和 HTML 的区别&quot;">​</a></h3><p>① 标签名称不同</p><p>HTML（div, span, img, a）</p><p>WXML（view,text, image, navigator）</p><p>② 属性节点不同</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">a</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> href</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;#&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;超链接&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">a</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">navigator</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> url</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/pages/home/home&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">navigator</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><p>③ 提供了类似于Vue中的模板语法</p><ul><li>数据绑定</li><li>列表渲染</li><li>条件渲染</li></ul><h2 id="小程序代码的构成-wxss-样式" tabindex="-1">小程序代码的构成 - WXSS 样式 <a class="header-anchor" href="#小程序代码的构成-wxss-样式" aria-label="Permalink to &quot;小程序代码的构成 - WXSS 样式&quot;">​</a></h2><h3 id="_1-什么是-wxss" tabindex="-1">1.什么是 WXSS <a class="header-anchor" href="#_1-什么是-wxss" aria-label="Permalink to &quot;1.什么是 WXSS&quot;">​</a></h3><p>WXSS(WeiXin Style Sheets)是一套<strong>样式语言</strong>，用于描述WXML的组件样式，类似于网页开发中的CSS。</p><h3 id="_2-wxss-和-css-的区别" tabindex="-1">2.WXSS 和 CSS 的区别 <a class="header-anchor" href="#_2-wxss-和-css-的区别" aria-label="Permalink to &quot;2.WXSS 和 CSS 的区别&quot;">​</a></h3><p>① <strong>新增了 rpx 尺寸单位</strong></p><p>CSS中需要手动进行像素单位换算，例如 rem</p><p>WXSS在底层支持新的尺寸单位 rpx，在不同大小的屏幕上小程序会自动进行换算</p><p>② <strong>提供了全局的样式和局部样式</strong></p><p>项目根目录中的app.wxss 会作用于所有小程序页面</p><p>局部页面的.wxss 样式仅对当前页面生效</p><p>③ <strong>WXSS仅支持部分CSS选择器</strong></p><ul><li>.class和 #id</li><li>element</li><li>并集选择器、后代选择器</li><li>::after和 ::before 等伪类选择器</li></ul><h2 id="小程序代码的构成-js-逻辑交互" tabindex="-1">小程序代码的构成 - JS 逻辑交互 <a class="header-anchor" href="#小程序代码的构成-js-逻辑交互" aria-label="Permalink to &quot;小程序代码的构成 - JS 逻辑交互&quot;">​</a></h2><h3 id="_1-小程序中的-js-文件" tabindex="-1">1.小程序中的 .js 文件 <a class="header-anchor" href="#_1-小程序中的-js-文件" aria-label="Permalink to &quot;1.小程序中的 .js 文件&quot;">​</a></h3><p>一个项目仅仅提供界面展示是不够的，在小程序中，我们通过.js文件来处理用户的操作。例如：响应用户的点击、获取用户的位置等等。</p><h3 id="_2-小程序中-js-文件的分类" tabindex="-1">2.小程序中 .js 文件的分类 <a class="header-anchor" href="#_2-小程序中-js-文件的分类" aria-label="Permalink to &quot;2.小程序中 .js 文件的分类&quot;">​</a></h3><p>小程序中的 JS 文件分为三大类，分别是：</p><p>①app.js</p><p>是<strong>整个小程序项目的入口文件</strong>，通过调用App() 函数来启动整个小程序</p><p>②页面的.js 文件</p><p>是<strong>页面的入口文件</strong>，通过调用<strong>Page() 函数</strong>来创建并运行页面</p><p>③普通的.js文件</p><p>是<strong>普通的功能模块文件</strong>，用来封装<strong>公共的函数或属性</strong>供页面使用</p>`,97)]))}const u=s(e,[["render",o]]);export{g as __pageData,u as default};
