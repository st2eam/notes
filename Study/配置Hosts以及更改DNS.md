## 修改 Hosts 解决 Github 访问失败的问题

通过该网站来查询
[https://www.ipaddress.com/](https://www.ipaddress.com/)

以下网址的ip地址

```shell
github.com
assets-cdn.github.com
github.global.ssl.fastly.net
```

将得到的地址写入Hosts里

```shell
140.82.113.3 github.com
185.199.108.153 assets-cdn.github.com
151.101.193.194 github.global.ssl.fastly.net
```

点击 Close idle sockets 和 Flush socket pools 两项即可清除 DNS 缓存

[edge://net-internals/#sockets](edge://net-internals/#sockets)  
[chrome://net-internals/#sockets](chrome://net-internals/#sockets)  

## [阿里云公共DNS](https://alidns.com/)

```shell
223.5.5.5

223.6.6.6
```
