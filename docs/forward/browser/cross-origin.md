---
id: cross-origin
title: 跨域
---

## 什么是跨域

跨域是指一个域下的文档或脚本试图去请求另一个域下的资源，这里跨域是广义的。

广义的跨域有：

- 资源跳转：外链、重定向、表单提交
- 资源嵌入：`<link>`, `<script>`, `<img>`, `<frame>` 等 DOM 标签，还有样式中 `background:url()`, `@font-face()` 等文件外链
- 脚本请求：JavaScript 发起的 Ajax 请求、DOM 和 JavaScript 对象的跨域操作等

实际上，我们通常所说的跨域，是由浏览器**同源策略**限制的一类请求场景。

## 同源策略

同源策略（SOP, Same origin policy）是一种约定，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到 XSS、CSFR 等攻击。所谓同源是指**协议+域名+端口**三者相同，即便两个不同的域名指向同一个 IP 地址，也非同源。

同源策略限制的内容有以下几种：

- Cookie、localStorage 和 IndexDB 等存储性内容
- DOM 节点
- AJAX 请求发送后，被浏览器拦截

## 跨域解决方案

1. JSONP
2. CORS
3. postMessage
4. WebSocket
5. Node 中间件代理
6. Nginx 反向代理
7. window.name+iframe
8. location.hash+iframe
9. document.domain+iframe

### JSONP

原理：利用 `<script>` 标签没有跨域限制的漏洞，网页可以得到从其他来源动态产生的 JSON 数据。JSONP 请求一定需要对方的服务器做支持才可以。

虽然 JSONP 和 AJAX 一样，都是客户端向服务器端发送请求，从服务器端获取数据的方式。但 AJAX 属于同源策略，JSONP 属于非同源策略。

JSONP 优点是简单兼容性好，可用于解决主流浏览器的跨域数据访问的问题。缺点是仅支持 GET 方法具有局限性，不安全可能会遭受 XSS 攻击。

实现流程：

1. 声明一个回调函数，其函数名作参数值传递给跨域请求数据的服务器，函数形参为要获取目标数据。
2. 创建一个 `<script>` 标签，把跨域的 API 接口地址赋值给 src 属性，并向服务器传递该函数名。
3. 服务器接收到请求后，需要进行特殊的处理：把传递进来的函数名和它需要给你的数据拼接成一个字符串返回。如：传递 `?callback=show`，返回 `show(data)`
4. 最后服务器响应的内容，在浏览器得到执行，即执行了请求参数中的回调函数，并传入返回数据。

```js
function jsonp({ url, params, callback }) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    window[callback] = function (data) {
      resolve(data);
      document.body.removeChild(script);
    };
    params = { ...params, callback }; // wd=b&callback=show
    const arrs = [];
    for (let key in params) {
      arrs.push(`${key}=${params[key]}`);
    }
    script.src = `${url}?${arrs.join('&')}`;
    document.body.appendChild(script);
  });
}
```

### CORS

CORS（Cross-origin resource sharing）跨域资源共享，它允许浏览器向跨源服务器发出 XMLHttpRequest 请求。

CORS 需要浏览器和服务器同时支持。浏览器会自动进行 CORS 通信，实现 CORS 通信的关键是后端服务。只要服务器实现了 CORS 接口，就可以跨源通信。

浏览器将 CORS 请求分成两类：

- 简单请求（simple request）
- 非简单请求（not-so-simple request）

只要同时满足以下两大条件，就属于简单请求。

1. 请求方法是以下三种方法之一：`HEAD`、`GET`、`POST`
2. HTTP 的头信息不超出以下几种字段：`Accept`、`Accept-Language`、`Content-Language`、`Last-Event-ID`、`Content-Type`（只限于三个值 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`）

浏览器对这两种请求的处理，是不一样的。

#### 简单请求

对于简单请求，浏览器直接发出 CORS 请求。具体来说，就是在头信息之中，增加一个 `Origin` 字段。服务器根据这个值，决定是否同意这次请求。

如果 Origin 指定的源，不在许可范围内，服务器会返回一个正常的 HTTP 回应。浏览器发现，这个回应的头信息没有包含 `Access-Control-Allow-Origin` 字段，会抛出一个错误，被 XMLHttpRequest 的 `onerror` 回调函数捕获。注意，这种错误无法通过状态码识别，因为 HTTP 回应的状态码有可能是 200。

如果 Origin 指定的域名在许可范围内，服务器返回的响应，会多出几个头信息字段。

```plain
Access-Control-Allow-Origin: http://api.domain.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: foobar
Content-Type: text/html;charset=utf-8
```

#### 非简单请求

非简单请求是对服务器有特殊要求的请求，比如请求方法是 PUT 或 DELETE，或者 Content-Type 字段的类型是 application/json。

非简单请求的 CORS 请求，会在正式通信之前，增加一次 HTTP 查询请求，称为**预检请求**（preflight）。

服务器收到预检请求以后，检查了 `Origin`、`Access-Control-Request-Method` 和 `Access-Control-Request-Headers` 字段以后，确认允许跨源请求，就可以做出回应。

如果服务器否定了预检请求，会返回一个正常的 HTTP 回应。浏览器发现没有任何 CORS 相关的头信息字段会抛出一个错误，被 XMLHttpRequest 的 `onerror` 回调函数捕获。

服务器回应的 CORS 相关字段如下：

```plain
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 1728000
```

一旦服务器通过了预检请求，以后每次浏览器正常的 CORS 请求，就都跟简单请求一样，会有一个 `Origin` 头信息字段。服务器的回应，也都会有一个 `Access-Control-Allow-Origin`

### WebSocket

WebSocket 是 HTML5 的一个持久化的协议，它实现了浏览器与服务器的全双工通信，同时也是跨域的一种解决方案。WebSocket 和 HTTP 都是应用层协议，都基于 TCP 协议。但是 WebSocket 是一种双向通信协议，在建立连接之后，WebSocket 的 server 与 client 都能主动向对方发送或接收数据。同时，WebSocket 在建立连接时需要借助 HTTP 协议，连接建立好了之后 client 与 server 之间的双向通信就与 HTTP 无关了。

### postMessage

postMessage 是 HTML5 XMLHttpRequest API，且是为数不多可以跨域操作的 window 属性之一，它可用于解决以下方面的问题：

- 页面和其打开的新窗口的数据传递
- 多窗口之间消息传递
- 页面与嵌套的 iframe 消息传递
- 上面三个场景的跨域数据传递

postMessage 方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递。

```js
otherWindow.postMessage(message, targetOrigin, [transfer]);
```

### Node 中间件代理

实现原理：同源策略是浏览器需要遵循的标准，而如果是服务器向服务器请求就无需遵循同源策略。代理服务器，需要做以下几个步骤：

- 接受客户端请求
- 将请求转发给服务器
- 拿到服务器响应数据
- 将响应转发给客户端

### Nginx 反向代理

实现原理类似于 Node 中间件代理，需要搭建一个中转 Nginx 服务器，用于转发请求。不同的是，Node 是正向代理，而 Ngixn 是反向代理。

使用 Nginx 反向代理实现跨域，是最简单的跨域方式。只需要修改 Nginx 的配置即可解决跨域问题，支持所有浏览器，支持 session，不需要修改任何代码，并且不会影响服务器性能。

实现思路：通过 Nginx 配置一个代理服务器（域名与 domain1 相同，端口不同）做跳板机，反向代理访问 domain2 接口，并且可以顺便修改 cookie 中 domain 信息，方便当前域 cookie 写入，实现跨域登录。

## 总结

- CORS 支持所有类型的 HTTP 请求，是跨域 HTTP 请求的根本解决方案
- JSONP 只支持 GET 请求，JSONP 的优势在于支持老式浏览器，以及可以向不支持 CORS 的网站请求数据。
- 不管是 Node 中间件代理还是 nginx 反向代理，主要是通过同源策略对服务器不加限制。
- 日常工作中，用得比较多的跨域方案是 cors 和 nginx 反向代理

---

参考资料：

- [跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)
- [九种跨域方式实现原理（完整版）](https://juejin.cn/post/6844903767226351623)
