---
id: browser-storage
title: 浏览器存储
---

浏览器的本地存储主要分为 `Cookie`, `WebStorage`, `IndexedDB`，而 WebStorage 又分为 `localStorage` 和 `sessionStorage`。

这里主要介绍 `Cookie`, `WebStorage`，并附带相关的对比。

## Cookie

Cookie 最开始被设计出来其实并不是来做本地存储的，而是为了弥补 HTTP 在状态管理上的不足。HTTP 是无状态的，即它不会记住用户的操作，这让我们在记住用户状态等场景被限制，所以就有了 Cookie。

Cookie 本质上就是浏览器里面存储的一个很小的文本文件，内部以键值对的方式来存储。

### Cookie 的缺陷

- 容量：单 cookie 上限是 4kb，只能存储少量信息。
- 性能：每次请求都会带上 Cookie，不管是否需要，随着请求量增多，造成性能浪费。
- 安全：明文存储和传输，容易被非法截获和篡改。

### cookie/session 差异对比

- **存储位置**：cookie 保存在浏览器端，而 session 保存在服务端。
- **存储内容**：cookie 只能存储字符串类型，而 session 能存储任何数据类型的对象。
- **存储大小**：cookie 容量上限 4kb，而 session 没有上限。
- **使用方式**：cookie 如果不设置过期时间，保存在内存中，随着浏览器关闭而消失；如果设置了过期时间，保存在硬盘中，直到过期时间才消失。每次 HTTP 请求都会在请求头带上 cookie 信息，即使不需要。session 数据存储在服务端，通过 cookie 把 sessionID 传给浏览器端。
- **安全性**：cookie 明文存储和传输，存在安全隐患；session 存储在服务端，传输安全。

## WebStorage

WebStorage 又分为 `localStorage` 和 `sessionStorage` 两种，是浏览器端的存储方式，详见 [Web Storage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Storage)。

- 共同点：都是保存在浏览器端，且都遵循同源策略，有相同的 API。
- 不同点：生命周期和作用域存在差异。

### localStorage/sessionStorage/cookie 差异对比

作用域：

- localStorage 只要在相同的协议、主机名、端口下，就能读取/修改到同一份数据。
- sessionStorage 除了协议、主机名、端口外，还要求在同一窗口下。

生命周期：

- localStorage 是持久化的本地存储，存储在其中的数据是永远不会过期的，使其消失的唯一办法是手动删除。
- sessionStorage 是临时性的本地存储，它是会话级别的存储，当会话结束（页面被关闭）时，存储内容也随之被释放。
- cookie 一般由服务器生成，可设置失效时间，如果在浏览器端生成 cookie，默认关闭浏览器后失效。

存储容量：

- Web Storage 容量上限是 5M。
- cookie 容量上限是 4kb。

与服务端通信：

- Web Storage 仅在浏览器端保存，不参与通信。
- cookie 每次在携带在 HTTP 请求头部，即使不需要。
