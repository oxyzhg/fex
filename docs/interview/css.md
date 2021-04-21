---
id: css
title: CSS 相关题目总结
---

import TOCInline from '@theme/TOCInline';

<TOCInline toc={toc} />

### 介绍一下 CSS 盒子模型？

盒模型由 content, padding, border, margin 四部分组成。

两种盒模型分别是 W3C 标准盒模型（content-box）、IE 盒模型（border-box），它们的区别在于 width/height 对应的范围不同：

- W3C 标准盒模型：属性 width/height 只包含 content，不包含 padding+border，即设置的宽高就是实际可用尺寸。
- IE 盒模型：属性 width/height 包含 content+padding+border 三部分，除去 padding+border 才是元素实际可用尺寸。

一般来说，我们可以通过修改元素的 box-sizing 属性来改变元素的盒模型。

### CSS 选择符有哪些？

- ID 选择器 `#myid`
- 类选择器 `.myclassname`
- 标签选择器 `div,h1,p`
- 后代选择器 `h1 p`
- 相邻后代选择器（子）选择器 `ul>li`
- 兄弟选择器 `li~a`
- 相邻兄弟选择器 `li+a`
- 属性选择器 `a[rel="external"]`
- 伪类选择器 `a:hover,li:nth-child`
- 伪元素选择器 `::before,::after`
- 通配符选择器 `*`

### CSS 优先级如何计算？

CSS 的优先级是根据样式声明的特殊性值来判断的。

选择器的特殊性值分为四个等级，如下：

1. 行内样式 (x,0,0,0)
2. ID 选择符 (0,x,0,0)
3. 类选择符/属性选择符/伪类选择符 (0,0,x,0)
4. 元素和伪元素选择符 (0,0,0,x)

优先级计算规则：

1. 首先判断权重，声明权重的优先级最高。如果权重相同，则比较匹配规则的特殊性。
2. 选择器的特殊性值分为 4 个等级，每个等级的初始值为 0，按选择器出现的次数相加，但不可进位。从左向右逐级对比，同级特殊性值越大的声明优先级越高。
3. 如果两个优先级相同，则后出现的优先级高。
4. 继承样式优先级最低，通配符样式优先级高于继承样式。

### 伪类和伪元素的区别？

CSS 引入伪类和伪元素概念是为了**格式化文档树以外的信息**。比如，一句话中的第一个字母，或者是列表中的第一个元素。

伪类用于当已有的元素处于某个状态时，为其添加对应的样式，这个状态是根据用户行为而动态变化的。比如说，当用户悬停在指定的元素时，我们可以通过 `:hover` 来描述这个元素的状态。

伪元素用于创建一些不在文档树中的元素，并为其添加样式。它们允许我们为元素的某些部分设置样式。比如说，我们可以通过 `::before` 来在一个元素前增加一些文本，并为这些文本添加样式。虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。

### CSS 中哪些属性可以继承？

属性的可继承性决定了当未设置值时该如何取值。

当元素的一个继承属性没有指定值时，则取父元素的同属性的计算值。只有文档根元素取该属性的概述中给定的初始值。当元素的一个非继承属性没有指定值时，则取属性的初始值 initialvalue（默认值）。

常见的可继承属性有：

1. 字体系列属性：font-family, font-weight, font-size, font-style, font-variant, font-stretch, font-size-adjust
2. 文本系列属性：text-indent, text-align, text-shadow, line-height, word-spacing, letter-spacing, text-transform, text-direction, color
3. 表格布局属性：caption-side, border-collapse, empty-cells
4. 列表属性：list-style-type, list-style-image, list-style-position, list-style
5. 光标属性：cursor
6. 可见性属性：visibility

当一个属性不是继承属性时，可以使用 inherit 关键字显式地指定继承性，可用于任何继承性/非继承性属性。

### 什么是 BFC？

块格式化上下文（Block Formatting Context，BFC）是布局过程中生成块级盒子的区域，也是浮动元素与其他元素的交互限定区域。如果一个元素符合触发 BFC 的条件，则 BFC 内的元素布局不受外部影响。

触发 BFC 的条件：

- 根元素
- 浮动元素
- 绝对定位元素 position: absolute|fixed
- 非块级盒子的块级容器 display: inline-block|flex|inline-flex|table-cell|table-caption
- overflow≠visible

BFC 特点：

- BFC 是一个独立的布局环境，和其他区域互不影响。
- BFC 区域不会和浮动元素重叠，可清除浮动。
- 在同一个 BFC 内，会出现垂直方向外边距折叠现象。
- 计算 BFC 高度时浮动元素也会参与计算，可防止高度塌陷。

### 请解释一下为什么需要清除浮动？清除浮动的方式

清除浮动是为了清除使用浮动元素产生的影响。浮动的元素，高度会塌陷，而高度的塌陷使后面的布局不能正常显示。

清除浮动的方式：

- 使用 clear 属性清除浮动
- 创建 BFC 清除浮动

```css
.clear::after {
  content: '';
  display: block;
  clear: both;
}
```

### 水平、垂直居中方案有哪些？

```css
/* 定宽 */
.outer {
  width: 100px;
  margin: 0 auto;
}

/* 行内元素 */
.outer {
  text-align: center;
}
.inner {
  display: inline-block;
}

/* 定位+定宽 */
.outer {
  position: relative;
}
.inner {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100px;
  height: 100px;
  margin: auto;
}

/* 定位+定宽 */
.outer {
  posotion: relative;
}
.inner {
  position: absolute;
  width: 100px;
  height: 100px;
  top: 50%;
  left: 50%;
  margin: -50px -50%;
}

/* 定位 */
.outer {
  posotion: relative;
}
.inner {
  position: absolute;
  width: 100px;
  height: 100px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Flex */
.outer {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}

/* Grid */
.outer {
  display: grid;
  grid-auto-flow: row dense;
  justify-content: center;
  align-items: center;
}
```

更多资料可以参考：

- [CSS Grid 网格布局教程](https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)

### 如何实现一个宽度自适应，高度为宽度的一半的矩形？

`padding-top/bottom`, `margin-top/bottom` 都是相对于父元素的宽度来计算的，因此我们只需要设置子元素 `padding-bottom` 是父元素宽度的一半，就可以实现宽高等比缩放。最后 `.box` 元素用来控制所有内容元素的宽高，否则设置高度可能不生效。

```html
<style>
  .outer {
    width: 400px; /* 控制宽度 */
  }
  .inner {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 50%; /* 控制宽高比例 */
  }
  .box {
    position: absolute;
    width: 100%;
    height: 100%;
    background: aquamarine;
  }
</style>
<div class="outer">
  <div class="inner">
    <div class="box">Hello</div>
  </div>
</div>
```

类似的，设置其他等比例缩放的矩形也可以通过这个原理实现。

### 用 CSS 画三角形的原理是什么？

采用的是相邻边框连接处的均分原理。将宽高置为 0，通过 border-color 把其余三边隐藏，剩下的就是三角形。还可以通过各边框的尺寸，得到不同形状的三角形，可能会涉及三角函数计算。

```css
.box {
  width: 0;
  height: 0;
  border-width: 10px 10px 0;
  border-style: solid;
  border-color: blue transparent transparent;
}
```

### 媒体查询？

### 经常遇到的浏览器兼容性有哪些？

### 什么是响应式设计？响应式设计的原理是什么？

### 怎么让 Chrome 支持小于 12px 的文字？

可以设置 `transform:scale(0.5)` 属性收缩元素大小，注意该属性收缩的是整个元素的大小，如果是内联元素，必须要将内联元素转换成块级元素。

不影响开发和浏览体验的话，也可以使用图片文字。

### 画一条 0.5px 的线？

0.5px 相当于高清屏物理像素的 1px。这样的目的是在高清屏上看起来会更细一点，效果会更好一点，例如更细的分隔线。

```css
/* scale */
.line {
  height: 1px;
  background: #000;
  transform: scaleY(0.5);
  transform-origin: 50% 100%;
}

/* gradient */
.line {
  height: 1px;
  background: linear-gradient(0deg, #fff, #000);
}

/* shadow */
.line {
  height: 1px;
  box-shadow: 0 0.5px 0 #000;
}

/* svg+base64 */
.line {
  height: 1px;
  background: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='1px'><line x1='0' y1='0' x2='100%' y2='0' stroke='#000'></line></svg>");
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAlJyBoZWlnaHQ9JzFweCc+PGxpbmUgeDE9JzAnIHkxPScwJyB4Mj0nMTAwJScgeTI9JzAnIHN0cm9rZT0nIzAwMCc+PC9saW5lPjwvc3ZnPg==');
}

/* viewport */
<meta name="viewport" content="width=device-width,initial-sacle=0.5">
```

更多资料可以参考：

- [怎么画一条 0.5px 的边](https://juejin.cn/post/6844903582370643975)
- [half-px](https://www.rrfed.com/html/half-px.html)

### 如何实现单行/多行文本溢出省略？

```css
/* 单行文本截断 */
.text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 多行文本截断 */
.text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
}
```

### 如何实现两列布局？三栏布局？

圣杯布局：利用浮动和负边距来实现。

```html
<style>
  .container {
    padding-left: 200px;
    padding-right: 100px;
    overflow: auto;
  }

  .middle,
  .left,
  .right {
    position: relative;
    float: left;
  }

  .middle {
    width: 100%;
    height: 100px;
    background: lightpink;
  }

  .left {
    left: -200px;
    width: 200px;
    margin-left: -100%;
    background: lightskyblue;
  }

  .right {
    width: 100px;
    left: 100px;
    margin-left: -100px;
    background: lightgreen;
  }
</style>
<div class="container">
  <div class="middle">middle</div>
  <div class="left">left</div>
  <div class="right">right</div>
</div>
```

双飞翼布局：本质上也是通过浮动和负边距来实现。与圣杯布局不同的是，两边区域是由中间列 padding 实现，而圣杯布局是由父元素 padding 实现。

```html
<style>
  .middle,
  .left,
  .right {
    float: left;
    height: 100px;
  }

  .middle {
    width: 100%;
    background: lightpink;
  }

  .left {
    width: 200px;
    margin-left: -100%;
    background: lightskyblue;
  }

  .right {
    width: 100px;
    margin-left: -100px;
    background: lightgreen;
  }

  .content {
    padding-left: 200px;
    padding-right: 100px;
  }
</style>
<div class="container">
  <div class="middle">
    <div class="content">middle</div>
  </div>
  <div class="left">left</div>
  <div class="right">right</div>
</div>
```

### visibility 和 display 的差别（还有 opacity）
