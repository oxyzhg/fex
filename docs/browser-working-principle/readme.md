---
id: readme
title: 概览
slug: /browser-working-principle
sidebar_position: 0
---

> Referer: https://blog.poetries.top/browser-working-principle/

## CONTENT

- 宏观视角上的浏览器
  - Chrome 架构：仅仅打开了 1 个页面，为什么有 4 个进程
  - TCP 协议：如何保证页面文件能被完整送达浏览器
  - HTTP 请求流程：为什么很多站点第二次打开速度会很快
  - 导航流程：从输入 URL 到页面展示这中间发生了什么
  - 渲染流程（上）：HTML、CSS 和 JavaScript 是如何变成页面的
  - 渲染流程（下）：HTML、CSS 和 JavaScript 是如何变成页面的
- 浏览器中的 JavaScript 执行机制
  - 变量提升：JavaScript 代码是按顺序执行的吗
  - 调用栈：为什么 JavaScript 代码会出现栈溢出
  - 块级作用域：var 缺陷以及为什么要引入 let 和 const
  - 作用域链和闭包：代码中出现相同的变量，JavaScript 引擎如何选择
  - this：从 JavaScript 执行上下文视角讲 this
- V8 工作原理
  - 栈空间和堆空间：数据是如何存储的
  - 垃圾回收：垃圾数据如何自动回收
  - 编译器和解析器：V8 如何执行一段 JavaScript 代码的
- 浏览器中的页面循环系统
  - 消息队列和事件循环：页面是怎么活起来的
  - Webapi：setTimeout 是怎么实现的
  - Webapi：XMLHttpRequest 是怎么实现的
  - 宏任务和微任务：不是所有的任务都是一个待遇
  - 使用 Promise 告别回调函数
  - async await 使用同步方式写异步代码
- 浏览器中的页面
  - 页面性能分析：利用 chrome 做 web 性能分析
  - DOM 树：JavaScript 是如何影响 DOM 树构建的
  - 渲染流水线：CSS 如何影响首次加载时的白屏时间？
  - 分层和合成机制：为什么 css 动画比 JavaScript 高效
  - 页面性能：如何系统优化页面
  - 虚拟 DOM：虚拟 DOM 和实际 DOM 有何不同
  - PWA：解决了 web 应用哪些问题
  - webComponent：像搭积木一样构建 web 应用
- 浏览器中的网络
  - HTTP1：HTTP 性能优化
  - HTTP2：如何提升网络速度
  - HTTP3：甩掉 TCP、TCL 包袱 构建高效网络
  - 同源策略：为什么 XMLHttpRequst 不能跨域请求资源
  - 跨站脚本攻击 XSS：为什么 cookie 中有 httpOnly 属性
  - CSRF 攻击：陌生链接不要随便点
  - 沙盒：页面和系统之间的隔离墙
  - HTTPS：让数据传输更安全
