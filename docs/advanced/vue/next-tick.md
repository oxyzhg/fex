---
id: next-tick
title: nextTick
---

## JS 运行机制

JavaScript 执行是单线程的，它是基于事件循环的。事件循环大致分为以下几个步骤：

1. 所有同步任务都在主线程上执行，形成一个**执行栈**（execution context stack）。
2. 主线程之外，还存在一个**任务队列**（task queue）。只要异步任务有了运行结果，就在任务队列之中放置一个事件。
3. 一旦执行栈中的所有同步任务执行完毕，系统就会读取任务队列，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
4. 主线程不断重复上面的第三步。

主线程的执行过程就是一个 tick，而所有的异步结果都是通过任务队列来调度。消息队列中存放的是一个个的任务（task）。规范中规定 task 分为两大类，分别是 `macro task` 和 `micro task`，并且每个 `macro task` 结束后，都要清空所有的 `micro task`。

在浏览器环境中，常见的 macro task 有：

- setTimeout
- MessageChannel
- postMessage
- setImmediate

常见的 micro task 有：

- MutationObsever
- Promise.then

## nextTick 实现原理

```js title="src/core/util/next-tick.js"
const callbacks = [];
let pending = false;

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// highlight-next-line
let timerFunc;

if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop);
  };
  isUsingMicroTask = true;
} else if (
  !isIE &&
  typeof MutationObserver !== 'undefined' &&
  (isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]')
) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  isUsingMicroTask = true;
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve;
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  // highlight-start
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // highlight-end
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise((resolve) => {
      _resolve = resolve;
    });
  }
}
```

首先 `nextTick` 函数接受一个函数，把它缓存起来，并注册一个异步任务，等本轮事件循环结束后，取出执行异步任务的回调，即 `flushCallbacks` 方法。值得注意的是 `nextTick` 不会开启多个异步任务，而是把这些异步任务都压成一个同步任务，在下一个 tick 执行。

`timerFunc` 声明了注册异步任务的方式，为更好的兼容运行环境，提供了多种向下兼容方案，它们的优先级分别是：`Promise.then`, `MutationObserver`, `setImmediate`, `setTimeout`。
