---
id: jsonp
title: 手写JSONP
---

```js
function jsonp(url, data = {}) {
  // 拼接 URL
  let querystring = '?';
  for (let key in data) {
    querystring += `${key}=${data[key]}`;
  }

  // 创建 script 标签，发起跨域请求
  const script = document.createElement('script');
  script.src = url + querystring + 'cb=callback';
  document.body.appendChild(script);

  // 返回 Promise
  return new Promise((resolve, reject) => {
    window[callback] = (data) => {
      try {
        resolve(data);
      } catch (err) {
        reject(err);
      } finally {
        // 移除 script 标签
        script.parentNode.removeChild(script);
      }
    };
  });
}
```
