import{_ as s,c as i,o as a,a4 as t}from"./chunks/framework.BtCE5x9j.js";const E=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Python/PyMongo/index.md","filePath":"Python/PyMongo/index.md"}'),n={name:"Python/PyMongo/index.md"},h=t(`<h2 id="pymongo" tabindex="-1">PyMongo <a class="header-anchor" href="#pymongo" aria-label="Permalink to &quot;PyMongo&quot;">​</a></h2><p>Python 需要 MongoDB 驱动程序来访问 MongoDB 数据库。</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">python</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -m</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> pip</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> pymongo</span></span></code></pre></div><h3 id="创建数据库" tabindex="-1">创建数据库 <a class="header-anchor" href="#创建数据库" aria-label="Permalink to &quot;创建数据库&quot;">​</a></h3><p>要在 MongoDB 中创建数据库，首先要创建 MongoClient 对象，然后使用正确的 IP 地址和要创建的数据库的名称指定连接 URL。</p><p>如果数据库不存在，MongoDB 将创建数据库并建立连接。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> pymongo</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">myclient </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> pymongo.MongoClient(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;mongodb://localhost:27017/&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">mydb </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> myclient[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;mydatabase&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span></code></pre></div><p>**重要说明：**在 MongoDB 中，数据库只有在内容插入后才会创建! 就是说，数据库创建后要创建集合(数据表)并插入一个文档(记录)，数据库才会真正创建。</p><h4 id="检查数据库是否存在" tabindex="-1">检查数据库是否存在 <a class="header-anchor" href="#检查数据库是否存在" aria-label="Permalink to &quot;检查数据库是否存在&quot;">​</a></h4><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">dblist </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> myclient.list_database_names()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">if</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;mydatabase&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> dblist:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;The database exists.&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><h3 id="创建集合" tabindex="-1">创建集合 <a class="header-anchor" href="#创建集合" aria-label="Permalink to &quot;创建集合&quot;">​</a></h3><p>要在 MongoDB 中创建集合，请使用数据库对象并指定要创建的集合的名称。</p><p>如果它不存在，MongoDB 会创建该集合。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">mycol </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> mydb[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;customers&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span></code></pre></div><p>检查 &quot;customers&quot; 集合是否存在：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">collist </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> mydb.list_collection_names()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">if</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;customers&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> collist:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;The collection exists.&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><h3 id="如何使用" tabindex="-1">如何使用 <a class="header-anchor" href="#如何使用" aria-label="Permalink to &quot;如何使用&quot;">​</a></h3><p>用法与其他语言驱动程序都大致相同。</p>`,18),e=[h];function l(p,o,k,d,r,c){return a(),i("div",null,e)}const y=s(n,[["render",l]]);export{E as __pageData,y as default};
