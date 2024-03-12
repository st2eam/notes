import{_ as e,c as a,o as r,a4 as t}from"./chunks/framework.COET-Ywn.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Web/JavaScript/Network/HTTP.md","filePath":"Web/JavaScript/Network/HTTP.md"}'),l={name:"Web/JavaScript/Network/HTTP.md"},s=t(`<h2 id="http协议" tabindex="-1">HTTP协议 <a class="header-anchor" href="#http协议" aria-label="Permalink to &quot;HTTP协议&quot;">​</a></h2><p><a href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP" target="_blank" rel="noreferrer">HTTP | MDN</a></p><p><strong>超文本传输协议（HTTP）</strong> 也就是HyperText Transfer Protocol。是一个用于传输超媒体文档（例如 HTML）的<strong>应用层</strong>协议。它是为 Web 浏览器与 Web 服务器之间的通信而设计的，但也可以用于其他目的。</p><p>HTTP 遵循经典的<strong>C/S模型</strong>，客户端打开一个连接以发出请求，然后等待直到收到服务器端响应。HTTP使用了面向连接的TCP作为运输层协议，保证了数据的可靠传输。HTTP不必考虑数据在传输过程中被丢弃后又怎样被重传。</p><p>HTTP 是<strong>无状态协议</strong>，这意味着通信的双方在交换HTTP报文之前不需要先建立HTTP连接，服务器不会在两个请求之间保留任何数据（状态）。</p><h3 id="http的基本性质" tabindex="-1">HTTP的基本性质 <a class="header-anchor" href="#http的基本性质" aria-label="Permalink to &quot;HTTP的基本性质&quot;">​</a></h3><h4 id="http-是简单的" tabindex="-1">HTTP 是简单的 <a class="header-anchor" href="#http-是简单的" aria-label="Permalink to &quot;HTTP 是简单的&quot;">​</a></h4><p>虽然下一代 HTTP/2 协议将 HTTP 消息封装到了帧（frames）中，HTTP 大体上还是被设计得简单易读。HTTP 报文能够被人读懂，还允许简单测试，降低了门槛，对新人很友好。</p><h4 id="http-是可扩展的" tabindex="-1">HTTP 是可扩展的 <a class="header-anchor" href="#http-是可扩展的" aria-label="Permalink to &quot;HTTP 是可扩展的&quot;">​</a></h4><p>在 HTTP/1.0 中出现的 <a href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers" target="_blank" rel="noreferrer">HTTP headers</a> 让协议扩展变得非常容易。只要服务端和客户端就新 headers 达成语义一致，新功能就可以被轻松加入进来。</p><h4 id="http-是无状态-有会话的" tabindex="-1">HTTP 是无状态，有会话的 <a class="header-anchor" href="#http-是无状态-有会话的" aria-label="Permalink to &quot;HTTP 是无状态，有会话的&quot;">​</a></h4><p>HTTP 是无状态的：在同一个连接中，两个执行成功的请求之间是没有关系的。这就带来了一个问题，用户没有办法在同一个网站中进行连续的交互，比如在一个电商网站里，用户把某个商品加入到购物车，切换一个页面后再次添加了商品，这两次添加商品的请求之间没有关联，浏览器无法知道用户最终选择了哪些商品。而使用 HTTP 的头部扩展，HTTP Cookies 就可以解决这个问题。把 Cookies 添加到头部中，创建一个会话让每次请求都能<strong>共享相同的上下文信息</strong>，达成相同的状态。</p><p>注意，HTTP 本质是无状态的，使用 Cookies 可以创建有状态的会话。</p><h4 id="http-和连接" tabindex="-1">HTTP 和连接 <a class="header-anchor" href="#http-和连接" aria-label="Permalink to &quot;HTTP 和连接&quot;">​</a></h4><p>一个连接是由传输层来控制的，这从根本上不属于 HTTP 的范围。HTTP 并不需要其底层的传输层协议是面向连接的，只需要它是可靠的，或不丢失消息的（至少返回错误）。</p><p>在互联网中，有两个最常用的传输层协议：TCP 是可靠的，而 UDP 不是。因此，HTTP 依赖于面向连接的 TCP 进行消息传递，但连接并不是必须的。</p><p>在客户端（通常指浏览器）与服务器能够交互（客户端发起请求，服务器返回响应）之前，必须在这两者间建立一个 TCP 链接，打开一个 TCP 连接需要多次往返交换消息（因此耗时）。HTTP/1.0 默认为每一对 HTTP 请求/响应都打开一个单独的 TCP 连接。当需要连续发起多个请求时，这种模式比多个请求共享同一个 TCP 链接更低效。</p><p>为了减轻这些缺陷，HTTP/1.1 引入了流水线（被证明难以实现）和持久连接的概念：底层的 TCP 连接可以通过<a href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Connection" target="_blank" rel="noreferrer"><code>Connection</code></a>头部来被部分控制。HTTP/2 则发展得更远，通过在一个连接复用消息的方式来让这个连接始终保持为暖连接。</p><p>为了更好的适合 HTTP，设计一种更好传输协议的进程一直在进行。Google 就研发了一种以 UDP 为基础，能提供更可靠更高效的传输协议<a href="https://en.wikipedia.org/wiki/QUIC" target="_blank" rel="noreferrer">QUIC</a>。</p><h3 id="http-2" tabindex="-1">HTTP/2 <a class="header-anchor" href="#http-2" aria-label="Permalink to &quot;HTTP/2&quot;">​</a></h3><p>协议HTTP/2是协议HTTP/1.1的升级版本，其HTTP方法/状态码/语义都没有改变，主要特点：</p><ol><li><p>HTTP/2把服务器发回的响应变成可以并行地发回（使用同一个TCP连接），这就大大缩短了服务器的响应时间。</p></li><li><p>HTTP/2允许客户复用TCP连接进行多个请求，这样就节省了TCP连续多次建立和释放连接所花费的时间。</p></li><li><p>HTTP/2把所有报文都划分为许多较小的二进制编码的帧，并采用了新的压缩算法，不发送重复的首部字段，大大减小了首部的开销，提高了传输效率。</p></li></ol><img src="https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview/fetching_a_page.png" title="" alt="A Web document is the composition of different resources" data-align="center"><p>客户端和服务端通过交换各自的消息（与数据流正好相反）进行交互。由像浏览器这样的客户端发出的消息叫做 <em>requests</em>，被服务端响应的消息叫做 <em>responses。</em></p><img src="https://mdn.mozillademos.org/files/13673/HTTP%20&amp;%20layers.png" title="" alt="HTTP as an application layer protocol, on top of TCP (transport layer) and IP (network layer) and below the presentation layer." data-align="center"><h3 id="基于-http-的组件系统" tabindex="-1">基于 HTTP 的组件系统 <a class="header-anchor" href="#基于-http-的组件系统" aria-label="Permalink to &quot;基于 HTTP 的组件系统&quot;">​</a></h3><p>HTTP 是一个 client-server 协议：请求通过一个实体被发出，实体也就是用户代理。大多数情况下，这个用户代理都是指浏览器，当然它也可能是任何东西，比如一个爬取网页生成维护搜索引擎索引的机器爬虫。</p><p>每一个发送到服务器的请求，都会被服务器处理并返回一个消息，也就是<em>response</em>。在这个请求与响应之间，还有许许多多的被称为 <a href="https://developer.mozilla.org/zh-CN/docs/Glossary/Proxy_server" target="_blank" rel="noreferrer">proxies</a> 的实体，他们的作用与表现各不相同，比如有些是网关，还有些是<a href="https://developer.mozilla.org/zh-CN/docs/Glossary/Cache" target="_blank" rel="noreferrer">caches</a>等。</p><p><img src="https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview/client-server-chain.png" alt="img"></p><p>实际上，在一个浏览器和处理请求的服务器之间，还有路由器、调制解调器等许多计算机。由于 Web 的层次设计，那些在网络层和传输层的细节都被隐藏起来了。HTTP 位于最上层的应用层。虽然底层对于分析网络问题非常重要，但是大多都跟对 HTTP 的描述不相干。</p><h4 id="客户端-user-agent" tabindex="-1">客户端：user-agent <a class="header-anchor" href="#客户端-user-agent" aria-label="Permalink to &quot;客户端：user-agent&quot;">​</a></h4><p><em>user-agent</em> 就是任何能够为用户发起行为的工具。这个角色通常都是由浏览器来扮演。一些例外情况，比如是工程师使用的程序，以及 Web 开发人员调试应用程序。</p><p>要展现一个网页，浏览器首先发送一个请求来获取页面的 HTML 文档，再解析文档中的资源信息发送其他请求，获取可执行脚本或 CSS 样式来进行页面布局渲染，以及一些其它页面资源（如图片和视频等）。然后，浏览器将这些资源整合到一起，展现出一个完整的文档，也就是网页。浏览器执行的脚本可以在之后的阶段获取更多资源，并相应地更新网页。</p><p>一个网页就是一个超文本文档。也就是说，有一部分显示的文本可能是链接，启动它（通常是鼠标的点击）就可以获取一个新的网页，使得用户可以控制客户端进行网上冲浪。浏览器来负责发送 HTTP 请求，并进一步解析 HTTP 返回的消息，以向用户提供明确的响应。</p><h4 id="web-服务端" tabindex="-1">Web 服务端 <a class="header-anchor" href="#web-服务端" aria-label="Permalink to &quot;Web 服务端&quot;">​</a></h4><p>在上述通信过程的另一端，是由 Web Server 来<strong>服务</strong>并提供客户端所请求的文档。Server 只是虚拟意义上代表一个机器：它可以是共享负载（负载均衡）的一组服务器组成的计算机集群，也可以是一种复杂的软件，通过向其他计算机（如缓存，数据库服务器，电子商务服务器 ...）发起请求来获取部分或全部资源。</p><h4 id="代理-proxies" tabindex="-1">代理：Proxies <a class="header-anchor" href="#代理-proxies" aria-label="Permalink to &quot;代理：Proxies&quot;">​</a></h4><p>在浏览器和服务器之间，有许多计算机和其他设备转发了 HTTP 消息。由于 Web 栈层次结构的原因，它们大多都出现在传输层、网络层和物理层上，对于 HTTP 应用层而言就是透明的，虽然它们可能会对应用层性能有重要影响。还有一部分是表现在应用层上的，被称为<strong>代理（Proxies）</strong>。代理（Proxies）既可以表现得透明，又可以不透明（“改变请求”会通过它们）。代理主要有如下几种作用：</p><ul><li>缓存（可以是公开的也可以是私有的，像浏览器的缓存）</li><li>过滤（像反病毒扫描，家长控制...）</li><li>负载均衡（让多个服务器服务不同的请求）</li><li>认证（对不同资源进行权限管理）</li><li>日志记录（允许存储历史信息）</li></ul><h3 id="http-能控制什么" tabindex="-1">HTTP 能控制什么 <a class="header-anchor" href="#http-能控制什么" aria-label="Permalink to &quot;HTTP 能控制什么&quot;">​</a></h3><p>多年以来，HTTP 良好的扩展性使得越来越多的 Web 功能归其控制。缓存和认证很早就可以由 HTTP 来控制了。另一方面，对同源同域的限制到 2010 年才有所改变。</p><p>以下是可以被 HTTP 控制的常见特性。</p><ul><li><a href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching" target="_blank" rel="noreferrer">缓存</a> 文档如何缓存能通过 HTTP 来控制。服务端能告诉代理和客户端哪些文档需要被缓存，缓存多久，而客户端也能够命令中间的缓存代理来忽略存储的文档。</li><li><em>开放同源限制</em><br> 为了防止网络窥听和其它隐私泄漏，浏览器强制对 Web 网站做了分割限制。只有来自于<strong>相同来源</strong>的网页才能够获取网站的全部信息。这样的限制有时反而成了负担，HTTP 可以通过修改头部来开放这样的限制，因此 Web 文档可以是由不同域下的信息拼接成的（某些情况下，这样做还有安全因素考虑）。</li><li><em>认证</em><br> 一些页面能够被保护起来，仅让特定的用户进行访问。基本的认证功能可以直接通过 HTTP 提供，使用<a href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Authenticate" title="This is a link to an unwritten page" target="_blank" rel="noreferrer"><code>Authenticate</code></a>相似的头部即可，或用 HTTP Cookies 来设置指定的会话。</li><li><em><a href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Proxy_servers_and_tunneling" target="_blank" rel="noreferrer">代理和隧道</a></em><br> 通常情况下，服务器和/或客户端是处于内网的，对外网隐藏真实 IP 地址。因此 HTTP 请求就要通过代理越过这个网络屏障。但并非所有的代理都是 HTTP 代理。例如，SOCKS 协议的代理就运作在更底层，一些像 FTP 这样的协议也能够被它们处理。</li><li><em>会话</em> 使用 HTTP Cookies 允许你用一个服务端的状态发起请求，这就创建了会话。虽然基本的 HTTP 是无状态协议。这很有用，不仅是因为这能应用到像购物车这样的电商业务上，更是因为这使得任何网站都能轻松为用户定制展示内容了。</li></ul><h3 id="http-流" tabindex="-1">HTTP 流 <a class="header-anchor" href="#http-流" aria-label="Permalink to &quot;HTTP 流&quot;">​</a></h3><p>当客户端想要和服务端进行信息交互时（服务端是指最终服务器，或者是一个中间代理），过程表现为下面几步：</p><ol><li><p>打开一个 TCP 连接：TCP 连接被用来发送一条或多条请求，以及接受响应消息。客户端可能打开一条新的连接，或重用一个已经存在的连接，或者也可能开几个新的 TCP 连接连向服务端。</p></li><li><p>发送一个 HTTP 报文：HTTP 报文（在 HTTP/2 之前）是语义可读的。在 HTTP/2 中，这些简单的消息被封装在了帧中，这使得报文不能被直接读取，但是原理仍是相同的。</p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">GET / HTTP/1.1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Host: developer.mozilla.org</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Accept-Language: fr</span></span></code></pre></div></li><li><p>读取服务端返回的报文信息：</p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">HTTP/1.1 200 OK</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Date: Sat, 09 Oct 2010 14:28:02 GMT</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Server: Apache</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Last-Modified: Tue, 01 Dec 2009 20:18:22 GMT</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ETag: &quot;51142bc1-7449-479b075b2891b&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Accept-Ranges: bytes</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Content-Length: 29769</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Content-Type: text/html</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;!</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">DOCTYPE</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> html...</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> (here</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> comes</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> the</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> 29769</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> bytes</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> of</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> the</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> requested</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> web</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> page)</span></span></code></pre></div></li><li><p>关闭连接或者为后续请求重用连接。</p></li></ol><p>当 HTTP 流水线启动时，后续请求都可以不用等待第一个请求的成功响应就被发送。然而 HTTP 流水线已被证明很难在现有的网络中实现，因为现有网络中有很多老旧的软件与现代版本的软件共存。因此，HTTP 流水线已被在有多请求下表现得更稳健的 HTTP/2 的帧所取代。</p><h3 id="http-报文" tabindex="-1">HTTP 报文 <a class="header-anchor" href="#http-报文" aria-label="Permalink to &quot;HTTP 报文&quot;">​</a></h3><p>HTTP/1.1 以及更早的 HTTP 协议报文都是语义可读的。在 HTTP/2 中，这些报文被嵌入到了一个新的二进制结构，<strong>帧</strong>。帧允许实现很多优化，比如报文头部的压缩和复用。即使只有原始 HTTP 报文的一部分以 HTTP/2 发送出来，每条报文的语义依旧不变，客户端会重组原始 HTTP/1.1 请求。因此用 HTTP/1.1 格式来理解 HTTP/2 报文仍旧有效。</p><p>有两种 HTTP 报文的类型，请求与响应，每种都有其特定的格式。</p><h4 id="请求" tabindex="-1">请求 <a class="header-anchor" href="#请求" aria-label="Permalink to &quot;请求&quot;">​</a></h4><p>HTTP 请求的一个例子：</p><p><img src="https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview/http_request.png" alt="A basic HTTP request"></p><p>请求由以下元素组成：</p><ul><li>一个 HTTP 的<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods" target="_blank" rel="noreferrer">method</a>，经常是由一个动词像<a href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET" target="_blank" rel="noreferrer"><code>GET</code></a>, <a href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/POST" target="_blank" rel="noreferrer"><code>POST</code></a> 或者一个名词像<a href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/OPTIONS" target="_blank" rel="noreferrer"><code>OPTIONS</code></a>，<a href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/HEAD" target="_blank" rel="noreferrer"><code>HEAD</code></a>来定义客户端的动作行为。通常客户端的操作都是获取资源（GET 方法）或者发送<a href="https://developer.mozilla.org/zh-CN/docs/Learn/Forms" target="_blank" rel="noreferrer">HTML form</a>表单（POST 方法），虽然在一些情况下也会有其他操作。</li><li>要获取的资源的路径，通常是上下文中就很明显的元素资源的 URL，它没有<a href="https://developer.mozilla.org/zh-CN/docs/Glossary/Protocol" target="_blank" rel="noreferrer">protocol</a>（<code>http://</code>），<a href="https://developer.mozilla.org/zh-CN/docs/Glossary/Domain" target="_blank" rel="noreferrer">domain</a>（<code>developer.mozilla.org</code>），或是 TCP 的<a href="https://developer.mozilla.org/en-US/docs/Glossary/Port" title="Currently only available in English (US)" target="_blank" rel="noreferrer">port (en-US)</a>（HTTP 一般在 80 端口）。</li><li>HTTP 协议版本号。</li><li>为服务端表达其他信息的可选头部<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers" target="_blank" rel="noreferrer">headers</a>。</li><li>对于一些像 POST 这样的方法，报文的 body 就包含了发送的资源，这与响应报文的 body 类似。</li></ul><h4 id="响应" tabindex="-1">响应 <a class="header-anchor" href="#响应" aria-label="Permalink to &quot;响应&quot;">​</a></h4><p>HTTP 响应的一个例子：</p><p><img src="https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview/http_response.png" alt=""></p><p>响应报文包含了下面的元素：</p><ul><li>HTTP 协议版本号。</li><li>一个状态码（<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status" target="_blank" rel="noreferrer">status code</a>），来告知对应请求执行成功或失败，以及失败的原因。</li><li>一个状态信息，这个信息是非权威的状态码描述信息，可以由服务端自行设定。</li><li>HTTP <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers" target="_blank" rel="noreferrer">headers</a>，与请求头部类似。</li><li>可选项，比起请求报文，响应报文中更常见地包含获取的资源 body。</li></ul><h3 id="基于-http-的-apis" tabindex="-1">基于 HTTP 的 APIs <a class="header-anchor" href="#基于-http-的-apis" aria-label="Permalink to &quot;基于 HTTP 的 APIs&quot;">​</a></h3><p>基于 HTTP 的最常用 API 是<a href="https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest" target="_blank" rel="noreferrer"><code>XMLHttpRequest</code></a> API，可用于在<a href="https://developer.mozilla.org/zh-CN/docs/Glossary/User_agent" target="_blank" rel="noreferrer">user agent</a>和服务器之间交换数据。 现代<a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API" target="_blank" rel="noreferrer"><code>Fetch API</code></a>提供相同的功能，具有更强大和灵活的功能集。</p><p>另一种 API，即服务器发送的事件，是一种单向服务，允许服务器使用 HTTP 作为传输机制向客户端发送事件。 使用<a href="https://developer.mozilla.org/zh-CN/docs/Web/API/EventSource" target="_blank" rel="noreferrer"><code>EventSource</code></a>接口，客户端打开连接并建立事件句柄。 客户端浏览器自动将到达 HTTP 流的消息转换为适当的<a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Event" target="_blank" rel="noreferrer"><code>Event</code></a>对象，并将它们传递给专门处理这类<a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Event/type" title="type" target="_blank" rel="noreferrer"><code>type</code></a>事件的句柄，如果有这么个句柄的话。但如果相应的事件处理句柄根本没有建立，那就交给<a href="https://developer.mozilla.org/en-US/docs/Web/API/EventSource/message_event" title="Currently only available in English (US)" target="_blank" rel="noreferrer"><code>onmessage</code> (en-US)</a>事件处理程序处理</p>`,63),o=[s];function i(n,p,h,T,d,P){return r(),a("div",null,o)}const H=e(l,[["render",i]]);export{g as __pageData,H as default};
