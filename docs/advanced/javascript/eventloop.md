---
id: eventloop
title: 事件循环
---

事件循环（EventLoop）是指浏览器或 Nodejs 中一个解决 JavaScript 单线程运行时可能阻塞的一种机制，也就**异步**的原理。

## 任务队列

代码的执行过程中，除了依靠函数调用栈来解决函数的执行顺序外，还依靠**任务队列**(task queue)来解决另外一些代码的执行。整个执行过程，我们称为事件循环过程。

一个线程中，事件循环是唯一的，但是任务队列可以拥有多个。任务队列又分为 **macro-task**(task) 与 **micro-task**(jobs)两种。

### 宏任务

- `script`
- `setTimeout`/`setInterval`/`setImmediate`
- `I/O`
- `UI Render`

### 微任务

- `Promise.then`
- `asycn/await`
- `MutationObserver` (H5)
- `process.nectTick` (Nodejs)

## 浏览器中的事件循环

JavaScript 有一个 `main thread` 主线程和 `call-stack` 执行栈，所有的任务都会被放到执行栈等待主线程依次执行。

### 执行栈

执行栈，也叫调用栈，用于存储在代码执行期间创建的所有执行上下文，具有**后进先出**的特点。当函数执行时，会被添加到栈的顶部，当函数执行完成后，就会从栈顶移出，直到栈内被清空。

### 同步任务和异步任务

JavaScript 单线程任务被分为**同步任务**和**异步任务**，同步任务会在调用栈中按照顺序等待主线程依次执行，而异步任务首先要等上一步产生结果后，将注册的回调函数放入任务队列中，待主线程空闲时，被读取到栈内等待主线程执行。

所有代码都在执行栈中等待主线程依次执行，任务队列中存放的是待执行函数。

## Node 中的事件循环

参考资料：

- [详解 JavaScript 中的 Event Loop（事件循环）机制](https://zhuanlan.zhihu.com/p/33058983)
- [Node.js 事件循环](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/#what-is-the-event-loop)
