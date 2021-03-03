---
id: v-model
title: v-model
---

我们之前提到的数据响应，都是通过数据的改变去驱动 DOM 视图的变化，而双向绑定除了数据驱动 DOM 外， DOM 的变化反过来影响数据，是一个双向关系，在 Vue 中，我们可以通过 `v-model` 来实现双向绑定。它即可以作用在普通表单元素上，又可以作用在组件上，它其实是一个语法糖。

## 编译分析

先从编译阶段分析，首先是 parse 阶段，`v-model` 被当做普通的指令解析到 `el.directives` 中。

然后是 codegen 阶段，

```js title="src/compiler/codegen/index.js"
function genDirectives(el: ASTElement, state: CodegenState): string | void {
  const dirs = el.directives;
  if (!dirs) return;
  let res = 'directives:[';
  let hasRuntime = false;
  let i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    // highlight-next-line
    const gen: DirectiveFunction = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      // highlight-next-line
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += `{name:"${dir.name}",rawName:"${dir.rawName}"${
        dir.value ? `,value:(${dir.value}),expression:${JSON.stringify(dir.value)}` : ''
      }${dir.arg ? `,arg:"${dir.arg}"` : ''}${
        dir.modifiers ? `,modifiers:${JSON.stringify(dir.modifiers)}` : ''
      }},`;
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']';
  }
}
```

web 平台关于 directives 的定义包括：`model`, `text`, `html`。

也就是说，对于 `v-model` 而言，需要继续判断是否运行时的副本。

```js title="src/platforms/web/compiler/directives/model.js"
export default function model(el: ASTElement, dir: ASTDirective, _warn: Function): ?boolean {
  warn = _warn;
  const value = dir.value;
  const modifiers = dir.modifiers;
  const tag = el.tag;
  const type = el.attrsMap.type;
  // ...

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false;
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false;
  } else if (process.env.NODE_ENV !== 'production') {
    // ...
  }

  // ensure runtime directive metadata
  return true;
}
```

上面的逻辑中，对于不同的表单元素或组件做了不同的处理。

### 表单元素

以 textarea 为例，执行 `getDefaultModel` 方法。

```js
function genDefaultModel(el: ASTElement, value: string, modifiers: ?ASTModifiers): ?boolean {
  const type = el.attrsMap.type;

  // warn if v-bind:value conflicts with v-model
  // except for inputs with v-bind:type

  // highlight-next-line
  const { lazy, number, trim } = modifiers || {};
  const needCompositionGuard = !lazy && type !== 'range';
  const event = lazy ? 'change' : type === 'range' ? RANGE_TOKEN : 'input';

  let valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = `$event.target.value.trim()`;
  }
  if (number) {
    valueExpression = `_n(${valueExpression})`;
  }

  // highlight-next-line
  let code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = `if($event.target.composing)return;${code}`;
  }

  // highlight-start
  addProp(el, 'value', `(${value})`);
  addHandler(el, event, code, null, true);
  // highlight-end
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}
```

该方法首先处理了修饰符，然后去执行 `genAssignmentCode` 方法生成代码，最后执行 `addProp` 和 `addHandler` 方法为元素添加属性和方法。

最后一步可以说是 `v-model` 的精髓，通过修改 AST 元素，给元素动态绑定了 `value` 属性，又给元素绑定了方法，这样实际上就完成了数据双向绑定。

### 组件

对于组件来说，执行了 `genComponentModel` 方法。

```js
export function genComponentModel(
  el: ASTElement,
  value: string,
  modifiers: ?ASTModifiers
): ?boolean {
  // highlight-next-line
  const { number, trim } = modifiers || {};

  const baseValueExpression = '$$v';
  let valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      `(typeof ${baseValueExpression} === 'string'` +
      `? ${baseValueExpression}.trim()` +
      `: ${baseValueExpression})`;
  }
  if (number) {
    valueExpression = `_n(${valueExpression})`;
  }
  const assignment = genAssignmentCode(value, valueExpression);

  // highlight-start
  el.model = {
    value: `(${value})`,
    expression: `"${value}"`,
    callback: `function (${baseValueExpression}) {${assignment}}`,
  };
  // highlight-end
}
```

该函数最终生成 `el.model` 对象，然后在创建子组件 vnode 阶段，会执行 `createComponent` 函数。

```js title="src/core/vdom/create-component.js"
export function createComponent(
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  // ...
  // transform component v-model data into props & events
  if (isDef(data.model)) {
    // highlight-next-line
    transformModel(Ctor.options, data);
  }

  // extract props
  const propsData = extractPropsFromVNodeData(data, Ctor, tag);
  // ...
  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  const listeners = data.on;
  // ...
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data,
    undefined,
    undefined,
    undefined,
    context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  );

  return vnode;
}
```

其中会对 `data.model` 的情况做处理，执行 `transformModel(Ctor.options, data)` 方法，将 `v-model` 数据分别添加到 prop 和 event。

```js
// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel(options, data: any) {
  const prop = (options.model && options.model.prop) || 'value';
  const event = (options.model && options.model.event) || 'input';
  (data.props || (data.props = {}))[prop] = data.model.value;
  const on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}
```

回到这里，我们可以发现这就是典型的 `prop/emit` 父子组件通信模式，父组件通过 `prop` 把数据传递到子组件，子组件修改了数据后把改变通过 `$emit` 事件的方式通知父组件。
