---
id: merge-promise
title: 实现 mergePromise
---

实现 mergePromise 函数，把传进去的函数数组按顺序先后执行，并且把返回的数据先后放到数组 data 中。

代码如下：

```js
const timeout = (ms) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

const ajax1 = () =>
  timeout(2000).then(() => {
    console.log('1');
    return 1;
  });

const ajax2 = () =>
  timeout(1000).then(() => {
    console.log('2');
    return 2;
  });

const ajax3 = () =>
  timeout(2000).then(() => {
    console.log('3');
    return 3;
  });

const mergePromise = (ajaxArray) => {
  // 在这里实现你的代码
};

mergePromise([ajax1, ajax2, ajax3]).then((data) => {
  console.log('done');
  console.log(data); // data 为 [1, 2, 3]
});

// 要求分别输出
// 1
// 2
// 3
// done
// [1, 2, 3]
```

实现方式：

```js
// 实现方式 1
function mergePromise(promiseList) {
  let data = [];
  let sequence = Promise.resolve();

  for (let p of promiseList) {
    sequence = sequence.then(p).then((res) => {
      data.push(res);
    });
  }

  return sequence.then(() => data);
}

// 实现方式 2
function mergePromise(promiseList) {
  let data = [];

  for (let p of promiseList) {
    data.push(await p());
    sequence = sequence.then(p).then((res) => {
      data.push(res);
    });
  }

  return sequence.then(() => data);
}
```
