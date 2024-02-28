import{_ as t,c as s,o as e,a4 as i}from"./chunks/framework.BtCE5x9j.js";const E=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Python/python基础/python日期.md","filePath":"Python/python基础/python日期.md"}'),a={name:"Python/python基础/python日期.md"},l=i(`<h2 id="python-日期" tabindex="-1">Python 日期 <a class="header-anchor" href="#python-日期" aria-label="Permalink to &quot;Python 日期&quot;">​</a></h2><p>Python 中的日期不是其自身的数据类型，但是我们可以导入名为 <code>datetime</code> 的模块，把日期视作日期对象进行处理。</p><p>导入 <code>datetime</code> 模块并显示当前日期：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> datetime</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">x </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> datetime.datetime.now()</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(x)</span></span></code></pre></div><h2 id="strftime-方法" tabindex="-1">strftime() 方法 <a class="header-anchor" href="#strftime-方法" aria-label="Permalink to &quot;strftime() 方法&quot;">​</a></h2><p><code>datetime</code> 对象拥有把日期对象格式化为可读字符串的方法。</p><p>该方法称为 <code>strftime()</code>，并使用一个 <code>format</code> 参数来指定返回字符串的格式：</p><p>显示月份的名称：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> datetime</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">x </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> datetime.datetime(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2019</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(x.strftime(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;%B&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span></code></pre></div><h3 id="所有合法格式代码的参考" tabindex="-1">所有合法格式代码的参考： <a class="header-anchor" href="#所有合法格式代码的参考" aria-label="Permalink to &quot;所有合法格式代码的参考：&quot;">​</a></h3><table><thead><tr><th style="text-align:left;">指令</th><th style="text-align:left;">描述</th><th style="text-align:left;">实例</th></tr></thead><tbody><tr><td style="text-align:left;">%a</td><td style="text-align:left;">Weekday，短版本</td><td style="text-align:left;">Wed</td></tr><tr><td style="text-align:left;">%A</td><td style="text-align:left;">Weekday，完整版本</td><td style="text-align:left;">Wednesday</td></tr><tr><td style="text-align:left;">%w</td><td style="text-align:left;">Weekday，数字 0-6，0 为周日</td><td style="text-align:left;">3</td></tr><tr><td style="text-align:left;">%d</td><td style="text-align:left;">日，数字 01-31</td><td style="text-align:left;">31</td></tr><tr><td style="text-align:left;">%b</td><td style="text-align:left;">月名称，短版本</td><td style="text-align:left;">Dec</td></tr><tr><td style="text-align:left;">%B</td><td style="text-align:left;">月名称，完整版本</td><td style="text-align:left;">December</td></tr><tr><td style="text-align:left;">%m</td><td style="text-align:left;">月，数字01-12</td><td style="text-align:left;">12</td></tr><tr><td style="text-align:left;">%y</td><td style="text-align:left;">年，短版本，无世纪</td><td style="text-align:left;">18</td></tr><tr><td style="text-align:left;">%Y</td><td style="text-align:left;">年，完整版本</td><td style="text-align:left;">2018</td></tr><tr><td style="text-align:left;">%H</td><td style="text-align:left;">小时，00-23</td><td style="text-align:left;">17</td></tr><tr><td style="text-align:left;">%I</td><td style="text-align:left;">小时，00-12</td><td style="text-align:left;">05</td></tr><tr><td style="text-align:left;">%p</td><td style="text-align:left;">AM/PM</td><td style="text-align:left;">PM</td></tr><tr><td style="text-align:left;">%M</td><td style="text-align:left;">分，00-59</td><td style="text-align:left;">41</td></tr><tr><td style="text-align:left;">%S</td><td style="text-align:left;">秒，00-59</td><td style="text-align:left;">08</td></tr><tr><td style="text-align:left;">%f</td><td style="text-align:left;">微妙，000000-999999</td><td style="text-align:left;">548513</td></tr><tr><td style="text-align:left;">%z</td><td style="text-align:left;">UTC 偏移</td><td style="text-align:left;">+0100</td></tr><tr><td style="text-align:left;">%Z</td><td style="text-align:left;">时区</td><td style="text-align:left;">CST</td></tr><tr><td style="text-align:left;">%j</td><td style="text-align:left;">天数，001-366</td><td style="text-align:left;">365</td></tr><tr><td style="text-align:left;">%U</td><td style="text-align:left;">周数，每周的第一天是周日，00-53</td><td style="text-align:left;">52</td></tr><tr><td style="text-align:left;">%W</td><td style="text-align:left;">周数，每周的第一天是周一，00-53</td><td style="text-align:left;">52</td></tr><tr><td style="text-align:left;">%c</td><td style="text-align:left;">日期和时间的本地版本</td><td style="text-align:left;">Mon Dec 31 17:41:00 2018</td></tr><tr><td style="text-align:left;">%x</td><td style="text-align:left;">日期的本地版本</td><td style="text-align:left;">12/31/18</td></tr><tr><td style="text-align:left;">%X</td><td style="text-align:left;">时间的本地版本</td><td style="text-align:left;">17:41:00</td></tr><tr><td style="text-align:left;">%%</td><td style="text-align:left;">A % character</td><td style="text-align:left;">%</td></tr></tbody></table><h2 id="strptime和strftime的区别" tabindex="-1">strptime和strftime的区别 <a class="header-anchor" href="#strptime和strftime的区别" aria-label="Permalink to &quot;strptime和strftime的区别&quot;">​</a></h2><h3 id="strptime" tabindex="-1">strptime <a class="header-anchor" href="#strptime" aria-label="Permalink to &quot;strptime&quot;">​</a></h3><p>p表示parse，表示分析的意思，所以strptime是给定一个时间<strong>字符串</strong>和分析模式，返回一个<strong>时间对象</strong>。</p><h3 id="strftime" tabindex="-1">strftime <a class="header-anchor" href="#strftime" aria-label="Permalink to &quot;strftime&quot;">​</a></h3><p>f表示format，表示格式化，和strptime正好相反，要求给一个<strong>时间对象</strong>和输出格式，返回一个时间<strong>字符串</strong></p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> datetime</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">time1 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> datetime.datetime.strptime(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;2019/07/04 14:47&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;%Y/%m/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">%d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> %H:%M&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(time1), time1)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 两种写法都是一样的，这里time1即上面代码返回的时间对象</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">time2 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> datetime.datetime.strftime(time1, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;%Y/%m/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">%d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> %H:%M&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">time2 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> time1.strftime(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;%Y/%m/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">%d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> %H:%M:%S&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(time2), time2)</span></span></code></pre></div>`,17),n=[l];function d(h,p,r,k,y,g){return e(),s("div",null,n)}const f=t(a,[["render",d]]);export{E as __pageData,f as default};
