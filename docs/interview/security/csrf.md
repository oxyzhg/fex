---
id: csrf
title: CSRF 攻击
---

## 什么是 CSRF

CSRF（Cross-Site Request Forgery）跨站请求伪造：攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。

一个典型的 CSRF 攻击有着如下的流程：

1. 受害者登录 a.com，并保留了登录凭证（Cookie）；
2. 攻击者引诱受害者访问了 b.com；
3. b.com 向 a.com 发送了一个请求：a.com/act=xx；浏览器会默认携带 a.com 的 Cookie；
4. a.com 接收到请求后，对请求进行验证，并确认是受害者的凭证，误以为是受害者自己发送的请求；
5. a.com 以受害者的名义执行了 act=xx；
6. 攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让 a.com 执行了自己定义的操作。

![CSRF](/img/posts/csrf.jpg)

## 常见的攻击类型

### GET 类型

GET 类型的 CSRF 利用非常简单，只需要一个 HTTP 请求，一般会这样利用：

```markdown
![](https://awps-assets.meituan.net/mit-x/blog-images-bundle-2018b/ff0cdbee.example/withdraw?amount=10000&for=hacker)
```

在受害者访问含有这个 img 的页面后，浏览器会自动向 `http://bank.example/withdraw?account=xiaoming&amount=10000&for=hacker` 发出一次 HTTP 请求。bank.example 就会收到包含受害者登录信息的一次跨域请求。

### POST 类型

这种类型的 CSRF 利用起来通常使用的是一个自动提交的表单，如：

```html
<form action="http://bank.example/withdraw" method="POST">
  <input type="hidden" name="account" value="xiaoming" />
  <input type="hidden" name="amount" value="10000" />
  <input type="hidden" name="for" value="hacker" />
</form>
<script>
  document.forms[0].submit();
</script>
```

访问该页面后，表单会自动提交，相当于模拟用户完成了一次 POST 操作。

POST 类型的攻击通常比 GET 要求更加严格一点，但仍并不复杂。任何个人网站、博客，被黑客上传页面的网站都有可能是发起攻击的来源，后端接口不能将安全寄托在仅允许 POST 上面。

### 链接类型

链接类型的 CSRF 并不常见，比起其他两种用户打开页面就中招的情况，这种需要用户点击链接才会触发。这种类型通常是在论坛中发布的图片中嵌入恶意链接，或者以广告的形式诱导用户中招，攻击者通常会以比较夸张的词语诱骗用户点击，例如：

```html
<a href="http://test.com/csrf/withdraw.php?amount=1000&for=hacker" taget="_blank">重磅消息！！</a>
```

由于之前用户登录了信任的网站 A，并且保存登录状态，只要用户主动访问上面的这个 PHP 页面，则表示攻击成功。

## CSRF 攻击的特点

- 攻击一般发起在第三方网站，而不是被攻击的网站。被攻击的网站无法防止攻击发生。
- 攻击利用受害者在被攻击网站的登录凭证，冒充受害者提交操作；而不是直接窃取数据。
- 整个过程攻击者并不能获取到受害者的登录凭证，仅仅是“冒用”。
- 跨站请求可以用各种方式：图片 URL、超链接、CORS、Form 提交等。部分请求方式可以直接嵌入在第三方论坛、文章中，难以进行追踪。

## 防护策略

CSRF 通常从第三方网站发起，被攻击的网站无法防止攻击发生，只能通过增强自己网站针对 CSRF 的防护能力来提升安全性。

上文中讲了 CSRF 的两个特点：

- CSRF 通常发生在第三方域名。
- CSRF 攻击者不能获取到 Cookie 等信息，只是使用。

针对这两点，我们可以专门制定防护策略，如下：

- 阻止不明外域的访问
  - 同源检测
  - Samesite Cookie
- 提交时要求附加本域才能获取的信息
  - CSRF Token
  - 双重 Cookie 验证

### 同源检测

既然 CSRF 大多来自第三方网站，那么我们就直接禁止外域（或者不受信任的域名）对我们发起请求。

在 HTTP 协议中，每一个异步请求都会携带两个 Request Header，用于标记来源域名：`Origin` 和 `Referer`。它们在浏览器发起请求时，大多数情况会自动带上，并且不能由前端自定义内容。

服务器可以通过解析这两个 Header 中的域名，确定请求的来源域。如果 Origin 存在，那么直接使用 Origin 中的字段确认来源域名就可以。但是 Origin 在某些情况下并不存在：IE11 同源策略、302 重定向，这时可以解析 Referer 进行判断。

2014 年，W3C 的 Web 应用安全工作组发布了 Referrer Policy 草案，对浏览器该如何发送 Referer 做了详细的规定。截止现在新版浏览器大部分已经支持了这份草案，我们终于可以灵活地控制自己网站的 Referer 策略了。

| Policy Name                | Value                             |
| -------------------------- | --------------------------------- |
| No Referrer                | no-referrer                       |
| No Referrer When Downgrade | no-referrer-when-downgrade        |
| Origin Only                | (same or strict) origin           |
| Origin When Cross Origin   | (strict) origin-when-cross-origin |
| Unsafe URL                 | unsafe-url                        |

根据上面的表格因此需要把 Referrer Policy 的策略设置成 `same-origin`，对于同源的链接和引用，会发送 Referer，referer 值为 Host 不带 Path；跨域访问则不携带 Referer。例如：aaa.com 引用 bbb.com 的资源，不会发送 Referer。

设置 Referrer Policy 的方法有三种：

- 在 CSP 设置
- 页面头部增加 meta 标签
- a 标签增加 referrerpolicy 属性

另外在以下情况下 Referer 没有或者不可信：

- IE6/7 下使用 `window.location.href=url` 进行界面的跳转，会丢失 Referer。
- IE6/7 下使用 `window.open`，也会缺失 Referer。
- HTTPS 页面跳转到 HTTP 页面，所有浏览器 Referer 都丢失。

如果 Origin 和 Referer 都不存在，建议直接进行阻止。

综上所述：同源验证是一个相对简单的防范方法，能够防范绝大多数的 CSRF 攻击。但这并不是万无一失的，对于安全性要求较高，或者有较多用户输入内容的网站，我们就要对关键的接口做额外的防护措施。

### CSRF Token

前面讲到 CSRF 的另一个特征是，攻击者无法直接窃取到用户的信息（Cookie，Header，网站内容等），仅仅是冒用 Cookie 中的信息。

而 CSRF 攻击之所以能够成功，是因为服务器误把攻击者发送的请求当成了用户自己的请求。那么我们可以要求所有的用户请求都携带一个 CSRF 攻击者无法获取到的 Token。服务器通过校验请求是否携带正确的 Token，来把正常的请求和攻击的请求区分开，也可以防范 CSRF 的攻击。这是一种非常主流的防护策略。

CSRF Token 的防护策略分为三个步骤：

1. 将 CSRF Token 输出到页面中
2. 页面提交的请求携带这个 Token
3. 服务器验证 Token 是否正确

Token 是一个比较有效的 CSRF 防护方法，只要页面没有 XSS 漏洞泄露 Token，那么接口的 CSRF 攻击就无法成功。

### 双重 Cookie 验证

另一种防御措施是使用双重提交 Cookie。利用 CSRF 攻击不能获取到用户 Cookie 的特点，我们可以要求 Ajax 和表单请求携带一个 Cookie 中的值。

双重 Cookie 采用以下流程：

1. 在用户访问网站页面时，向请求域名注入一个 Cookie，内容为随机字符串（例如 `csrfcookie=v8g9e4ksfhw`）。
2. 在前端向后端发起请求时，取出 Cookie，并添加到 URL 的参数中（接上例 `POST https://www.a.com/comment?csrfcookie=v8g9e4ksfhw`）。
3. 后端接口验证 Cookie 中的字段与 URL 参数中的字段是否一致，不一致则拒绝。

此方法相对于 CSRF Token 就简单了许多。可以直接通过前后端拦截的的方法自动化实现。后端校验也更加方便，只需进行请求中字段的对比，而不需要再进行查询和存储 Token。

当然，此方法并没有大规模应用，其在大型网站上的安全性还是没有 CSRF Token 高，原因我们举例进行说明。

由于任何跨域都会导致前端无法获取 Cookie 中的字段（包括子域名之间），于是发生了如下情况：

- 如果用户访问的网站为 `www.a.com`，而后端的 api 域名为 `api.a.com`。那么在 `www.a.com`下，前端拿不到 `api.a.com` 的 Cookie，也就无法完成双重 Cookie 认证。
- 于是这个认证 Cookie 必须被种在 `a.com` 下，这样每个子域都可以访问。
- 任何一个子域都可以修改 `a.com` 下的 Cookie。
- 某个子域名存在漏洞被 XSS 攻击（例如 `upload.a.com`）。虽然这个子域下并没有什么值得窃取的信息。但攻击者修改了 `a.com` 下的 Cookie。
- 攻击者可以直接使用自己配置的 Cookie，对 XSS 中招的用户再向 `www.a.com` 下，发起 CSRF 攻击。

使用双重 Cookie 防御 CSRF 优缺点都很明显，优点：

1. 无需使用 Session，适用面更广，易于实施。
1. Token 储存于客户端中，不会给服务器带来压力。
1. 相对于 Token，实施成本更低，可以在前后端统一拦截校验，而不需要一个个接口和页面添加。

缺点：

- Cookie 中增加了额外的字段。
- 如果有其他漏洞（例如 XSS），攻击者可以注入 Cookie，那么该防御方式失效。
- 难以做到子域名的隔离。
- 为了确保 Cookie 传输安全，采用这种防御方式的最好确保用整站 HTTPS 的方式，如果还没切 HTTPS 的使用这种方式也会有风险。

### Samesite Cookie

为了从源头上解决这个问题，Google 起草了一份草案来改进 HTTP 协议，为 Set-Cookie 响应头新增 Samesite 属性，用来标明这个 Cookie 是个同站 Cookie，且它只能作为第一方 Cookie，不能作为第三方 Cookie。

Samesite 有两个属性值，分别是 Strict 和 Lax，下面分别讲解：

- **Strict**：严格模式，表明这个 Cookie 在任何情况下都不可能作为第三方 Cookie 上传。
- **Lax**：宽松模式，比 Strict 放宽了点限制，假如这个请求是这种请求（改变了当前页面或者打开了新页面）且同时是个 GET 请求，则这个 Cookie 可以作为第三方 Cookie 上传。

```
Set-Cookie: foo=1; Samesite=Strict
Set-Cookie: bar=2; Samesite=Lax
Set-Cookie: baz=3
```

例如上述给 b.com 设置了 3 个 Cookie，当 a.com 对 b.com 发起请求时，`foo` 这个 Cookie 不会出现在请求头中，而 `bar` 会。但假如这个请求是从 a.com 发起的对 b.com 的异步请求，或者页面跳转是通过表单的 POST 提交触发的，则 `bar` 也不会发送。

如果 Samesite Cookie 被设置为 Strict，浏览器在任何跨域请求中都不会携带 Cookie，新标签重新打开也不携带，所以说 CSRF 攻击基本没有机会。但是跳转子域名或者是新标签重新打开刚登陆的网站，之前的 Cookie 都不会存在。尤其是有登录的网站，那么我们新打开一个标签进入，或者跳转到子域名的网站，都需要重新登录。对于用户来讲，可能体验不会很好。

如果 Samesite Cookie 被设置为 Lax，那么其他网站通过页面跳转过来的时候可以使用 Cookie，可以保障外域连接打开页面时用户的登录状态。但相应的，其安全性也比较低。

Samesite Cookie 也存在一些缺点：兼容性不好，且不支持子域。

总之，Samesite Cookie 是一个可能替代同源验证的方案，但目前还并不成熟，其应用场景有待观望。

### 防止网站被利用

- 严格管理所有的上传接口，防止任何预期之外的上传内容（例如 HTML）。
- 添加 `Header X-Content-Type-Options: nosniff` 防止黑客上传 HTML 内容的资源被解析为网页。
- 对于用户上传的图片，进行转存或者校验，不要直接使用用户填写的图片链接。
- 当前用户打开其他用户填写的链接时，需告知风险。

## 总结

CSRF 攻击的特点是利用被攻击网站注册的凭证，进而冒充用户对被攻击网站执行某项操作。

那么我们要预防 CSRF 攻击，关键是要**做好用户信息认证**，防护策略：

- 自动防御策略：同源检测（Origin、Referer）
- 主动防御措施：Token 验证、双重 Cookie 验证、设置 Samesite Cookie
- 保证页面的幂等性，后端接口不要在 GET 页面中做用户操作。
