---
id: websocket
title: WebSocket
---

## 为什么需要 WebSocket

HTTP 协议有一个缺陷：通信只能由客户端发起。

这种单向请求的特点，注定了如果服务器有连续的状态变化，客户端要获知就非常麻烦。因此我们只能使用轮询，每隔一段时候，就发出一个询问，了解服务器有没有新的信息。

轮询的效率低，非常浪费资源（因为必须不停连接，或者 HTTP 连接始终打开）。

WebSocket 的出现，使得浏览器具备了实时双向通信的能力。

## 什么是 WebSocket

HTML5 开始提供的一种浏览器与服务器进行**全双工**通讯的网络技术，属于应用层协议。它基于 TCP 传输协议，并复用 HTTP 的握手通道。

对比 HTTP 协议的优点：

- 支持双向通信，实时性更强。
- 更好的二级制支持。
- 较小的控制开销。连接创建后，ws 客户端、服务端进行数据交换时，协议控制的数据包头部较小。在不包含头部的情况下，服务端到客户端的包头只有 2~10 字节（取决于数据包长度），客户端到服务端的的话，需要加上额外的 4 字节的掩码。而 HTTP 协议每次通信都需要携带完整的头部。
- 支持拓展。ws 协议定义了扩展，用户可以扩展协议，或者实现自定义的子协议。（比如支持自定义压缩算法等）
- 没有同源策略限制。

## WebSocket 握手

WebSocket 的 RFC6455 标准中制定了 2 个高级组件，一个是开放性 HTTP 握手用于协商连接参数，另一个是二进制消息分帧机制用于支持低开销的基于消息的文本和二进制数据传输。

客户端发起 WebSocket 请求，执行双方握手过程，客户端发送数据格式类似：

```basic
GET /chat HTTP/1.1
// highlight-next-line
Connection: Upgrade
Host: server.example.com
Origin: http://example.com
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
// highlight-next-line
Upgrade: websocket
```

可以看到 WebSocket 与 HTTP 请求不同的是两个高亮的请求头，告诉服务器协议升级。

其中，`Sec-WebSocket-Key` 是 WebSocket 客户端发送的一个 base64 编码的密文，要求服务端必须返回一个对应加密的 `Sec-WebSocket-Accept` 应答。

服务端收到报文后返回的数据格式类似：

```basic
HTTP/1.1 101 Switching Protocols
// highlight-next-line
Upgrade: websocket
Sec-WebSocket-Accept: K7DJLdLooIwIG/MOpvWFB3y3FE8=
// highlight-next-line
Connection: Upgrade
```

`Sec-WebSocket-Accept` 是服务端采用与客户端一致的密钥计算出来值，返回客户端。

### 连接状态

造成 WebSocket 断线原因：

- 网络状态不好（网络断开、网络信号差）
- 数据受各种阻塞（路由器、防火墙、代理服务器）
- Web 服务端故障

解决 websocket 断线方法：**心跳重连**。

---

参考资料：

- [全双工通信的 WebSocket](https://halfrost.com/websocket/)
