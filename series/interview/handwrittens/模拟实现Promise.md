---
id: promise
title: 模拟实现Promise
---

> Promise 表示异步操作的最终结果，它的主要交互方式是 then 方法，该方法通过注册回调接收 Promise 的最终值或错误信息。实现参考 [Promise A+](https://promisesaplus.com/) 标准规范。

1. Promise 解决了哪些问题？
2. Promise 的基础特征？
3. Promise 常见的 API 有哪些？
4. 手写符合 Promise A+ 规范的 Promise？
5. then 的链式调用和值穿透特性原理
6. Promise 在事件循环中的执行过程是怎样的？
7. Promise 有什么缺陷？如何解决？

## 产生的原因

Promise 为我们解决了什么问题？在传统的异步编程中，如果异步之间存在依赖关系，我们需要层层嵌套回调来满足这种依赖，如果嵌套层数过多，可读性和可维护性都会变得很差，产生所谓回调地狱，而 Promise 将回调嵌套改为链式调用，增加可读性和可维护性。

## 基本特征

### States

1. 三个状态：pending, fulfilled, or rejected
1. 默认的状态是 pending
1. 状态只能从 pending 转换到 fulfilled，或从 pending 转换到 rejected，且一经转换不能再变更

### Then Method

1. Promise 原型必须有一个 then 方法
1. then 方法接收两个可选参数：onFulfilled, onRejected；如果参数是非函数类型，需忽略
1. then 方法返回一个新的 Promise（它的一些实例方法和原型方法能够链式调用的原因）
1. then 方法可以被调用多次
1. Promise 状态变成 fulfilled 执行 onFulfilled(value) ；Promise 状态变成 rejected 执行 onRejected(reason)
1. 回调函数 onFulfilled 或 onRejected 都会返回一个值，这个值还需要进一步解析
1. 如果 onFulfilled 或 onRejected 是非函数类型，上一步的值需要透传给下一个 then 方法

### Promise Resolution Procedure

1. 如果 promise 和 x 相同，报 TypeError 错误
1. 如果 x 是 Promise 类型，根据状态处理
1. 如果 x 是对象或函数
   1. 如果存在 x.then 方法，按 then 方法执行
   1. 否则将 x 作为新值传递下去
   1. 这个过程只能被执行一次（通常有个变量标记实现）
1. 如果 x 是其他值，将 x 作为新值传递下去

Promise 以上三个核心概念，基本囊括了 promise 的整个灵魂，在此基础上，可以延伸出其他的一些特性。这里只做了简单的概述，详细的规则还得查阅 [Promise/A+](https://promisesaplus.com/#requirements) 文档，多读几遍就明白了。

## Promise API

- Promise.resolve
- Promise.reject
- Promise.prototype.then
- Promise.prototype.catch
- Promise.prototype.finally
- Promise.all
- Promise.race（用的少）
- Promise.allSettled（新）

## 模拟实现

Promise 实现的核心是实现它的构造函数部分和 then 方法，其他的大多是基于此拓展的一些内容。

### 构造函数

```javascript
// 三种状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class PromisePro {
  constructor(execute) {
    if (typeof executor !== "function") {
      throw new TypeError(`Promise resolver ${executor} is not a function`);
    }

    this.state = PENDING; // default pending
    this.value = undefined;
    this.reason = undefined;

    // 缓存 pending 状态时注册的回调函数
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    // 将状态转换成 fulfilled
    const resolve = (value) => {
      // 这里 setTimeout 决定了在 execute 执行完所有同步代码再执行回调
      setTimeout(() => {
        if (this.state === PENDING) {
          this.state = FULFILLED;
          this.value = value;
          this.onFulfilledCallbacks.forEach((cb) => cb(this.value));
        }
      });
    };

    // 将状态转换成 rejected
    const reject = (reason) => {
      setTimeout(() => {
        if (this.state === PENDING) {
          this.state = REJECTED;
          this.reason = reason;
          this.onRejectedCallbacks.forEach((cb) => cb(this.reason));
        }
      });
    };

    // 在构造函数中直接执行次函数即可
    try {
      execute(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
```

### Promise.prototype.then

该方法是实例方法，用于给 Promise 状态发生变化时添加回调函数。这是 Promise 的核心方法。

```javascript
class PromisePro {
  // ...

  then(onFulfilled, onRejected) {
    // 非函数类型的参数忽略，予以默认值
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (e) => {
            throw e;
          };

    let promise;

    // 分状态处理
    switch (this.state) {
      case FULFILLED:
        promise = new PromisePro((resolve, reject) => {
          setTimeout(() => {
            try {
              // onFulfilled,onRejected 都可能产生新值，这决定本次的值是否透传下去
              const x = onFulfilled(this.value);
              // 返回的值类型有很多种，需要分情况解析
              resolvePromise(promise, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          });
        });
        break;

      case REJECTED:
        promise = new PromisePro((resolve, reject) => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          });
        });
        break;

      case PENDING:
        promise = new PromisePro((resolve, reject) => {
          this.onFulfilledCallbacks.push(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          });

          this.onRejectedCallbacks.push(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          });
        });
        break;

      default:
    }
  }
}

function resolvePromise(promise, x, resolve, reject) {
  // 1. x 不能与 promise 相等，否则报错
  if (x === promise) {
    return reject(new TypeError(`error: x === promise`));
  }

  // 2. x 是实例，根据状态分情况处理
  if (x instanceof PromisePro) {
    if (x.state === FULFILLED) {
      resolve(x.value);
    } else if (x.state === REJECTED) {
      reject(x.reason);
    } else if (x.state === PENDING) {
      x.then((y) => {
        resolvePromise(promise, y, resolve, reject);
      }, reject);
    }
  }

  // 3. x 是对象或函数，存在 then 方法
  else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let executed;

    try {
      let then = x.then;

      if (typeof then === 'function') {
        then.call(
          x,
          (y) => {
            if (executed) return;
            executed = true;
            resolvePromise(promise, y, resolve, reject);
          },
          (e) => {
            if (executed) return;
            executed = true;
            reject(e);
          }
        );
      } else {
        resolve(x);
      }
    } catch (err) {
      if (executed) return;
      executed = true;
      reject(err);
    }
  }

  // 4. 直接返回 x
  else {
    resolve(x);
  }
}
```

注意几点：

1. then 方法是 Promise 非常核心的一个点
1. 它接受两个可选的参数，如果是非函数类型便忽略，且值透传
1. 它返回一个新的 Promise，链式调用基于此
1. 根据不同的状态，分情况讨论：
   1. fulfilled 就执行 onFulfilled 回调，并解析
   1. rejected 就执行 onRejected 回调，并解析
   1. pending 就把两种方案缓存起来，等状态发生变化再执行
1. 不管是 onFulfilled, onRejected 执行都可能产生新值，这里需要增加 resolvePromise 进一步解析：
   1. x 等于 promise2，类型报错
   1. x 是 Promise 的实例，根据 x 的状态分情况进入下一步
   1. x 是对象或函数类型，尝试执行其 then 方法，注意这里的递归解析
   1. x 是其他类型，直接传递到下一步即可

### Promise.prototype.catch

该方法是实例方法，用于给 Promise 添加 rejected 状态时的回调函数。

```javascript
class PromisePro {
  // ...
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
}
```

这个方法可以理解为 then 方法的语法糖，then 能实现更多。

### Promise.finally

该方法是实例方法，用于给 Promise 添加状态变化时的回调函数，不是最终执行，而是无论如何都会执行。

```javascript
class PromisePro {
  // ...
  finally(callback) {
    return this.then(
      (value) => PromisePro.resolve(callback()).then(() => value),
      (error) =>
        PromisePro.resolve(callback()).then(() => {
          throw error;
        })
    );
  }
}
```

### Promise.resolve

该方法是静态方法，用于产生一个 fulfilled 状态的 Promise.

```javascript
class PromisePro {
  // ...
  static resolve(value) {
    if (value instanceof PromisePro) return value;

    return new PromisePro((resolve, reject) => {
      resolve(value);
    });
  }
}
```

### Promise.reject

该方法是静态方法，用于产生一个 rejected 状态的 Promise.

```javascript
class PromisePro {
  // ...
  static reject(reason) {
    return new PromisePro((resolve, reject) => {
      reject(reason);
    });
  }
}
```

### Promise.all

该方法是静态方法，用于解决并发问题，多个异步并发获取最终的结果，如果有一个失败则失败。

```javascript
class PromisePro {
  // ...
  static all(promiseArr) {
    return new PromisePro((resolve, reject) => {
      const length = promiseArr.length;
      const result = [];
      if (length === 0) return result;

      let count = 0;
      for (let p of PromiseArr) {
        PromisePro.resolve(p).then(
          (data) => {
            result[count++] = data; // 这里使用 count 存疑
            if (count === length) resolve(result);
          },
          (err) => {
            reject(err);
          }
        );
      }
    });
  }
}
```

### Promise.race

该方法是静态方法，用于处理多个异步请求，返回第一个结果。

```javascript
class PromisePro {
  // ...
  static race(promiseArr) {
    return new PromisePro((resolve, reject) => {
      for (let p of promiseArr) {
        PromisePro.resolve(p).then(
          (data) => {
            resolve(data);
          },
          (err) => {
            reject(err);
          }
        );
      }
    });
  }
}
```

### Promise.allSettled

该方法是静态方法，用于处理多个异步请求，并返回每个请求的状态和结果。

```javascript
class PromisePro {
  // ...
  static allSettled(promiseArr) {
    return new PromisePro((resolve, reject) => {
      const length = promiseArr.length;
      const result = [];
      if (length === 0) return result;

      let count = 0;
      for (let i = 0; i < length; i++) {
        const p = promiseArr[i];
        PromisePro.resolve(p).then(
          (data) => {
            result[i] = { status: FULFILLED, value: data };
            count++;
            if (count === length) resolve(result);
          },
          (err) => {
            result[i] = { status: REJECTED, reason: err };
            count++;
            if (count === length) resolve(result);
          }
        );
      }
    });
  }
}
```

注意：

- 这里不管是成功还是失败，都会通过 resolve 将值传递下去，也就是说几乎不会出现 reject 的情况
