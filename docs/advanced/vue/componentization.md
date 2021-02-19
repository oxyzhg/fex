---
id: componentization
title: 组件化
---

Vue.js 另一个核心思想是组件化。所谓组件化，就是把页面拆分成多个组件 (component)，每个组件依赖的 CSS、JavaScript、模板、图片等资源放在一起开发和维护。组件是资源独立的，组件在系统内部可复用，组件和组件之间可以嵌套。

## createComponent

在数据驱动一节分析 `_createElement` 方法时说到，如果 tag 是普通 html 标签，就实例化一个普通 VNode，否则通过 `createComponent` 方法创建一个组件 VNode。

```js title="src/core/vdom/create-component.js"
export function createComponent(
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  if (isUndef(Ctor)) {
    return;
  }

  // highlight-start
  const baseCtor = context.$options._base;
  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }
  // highlight-end

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    // ...
    return;
  }

  // async component
  let asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  const propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children);
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  const listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    const slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  // highlight-next-line
  installComponentHooks(data);

  // return a placeholder vnode
  const name = Ctor.options.name || tag;
  // highlight-start
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
  // highlight-end

  // ...
  return vnode;
}
```

它的作用是创建组件类型的 VNode，主要就 3 个关键步骤：构造子类构造函数、安装组件钩子函数、实例化 VNode。

### 构造子类构造函数

实际上，代码中 `baseCtor` 就是 `Vue`，这在初始化阶段就有定义。

```js title="src/core/global-api/index.js"
export function initGlobalAPI(Vue: GlobalAPI) {
  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  // highlight-next-line
  Vue.options._base = Vue;
}
```

然后我们看一下 `Vue.extend` 函数的定义。

```js title="src/core/global-api/extend.js"
/**
 * Class inheritance
 */
Vue.extend = function (extendOptions: Object): Function {
  extendOptions = extendOptions || {};
  const Super = this;
  const SuperId = Super.cid;
  // highlight-start
  const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
  if (cachedCtors[SuperId]) {
    return cachedCtors[SuperId];
  }
  // highlight-end

  const name = extendOptions.name || Super.options.name;
  if (process.env.NODE_ENV !== 'production' && name) {
    validateComponentName(name);
  }

  const Sub = function VueComponent(options) {
    // highlight-next-line
    this._init(options);
  };
  // highlight-start
  Sub.prototype = Object.create(Super.prototype);
  Sub.prototype.constructor = Sub;
  // highlight-end
  Sub.cid = cid++;
  Sub.options = mergeOptions(Super.options, extendOptions);
  Sub['super'] = Super;

  // For props and computed properties, we define the proxy getters on
  // the Vue instances at extension time, on the extended prototype. This
  // avoids Object.defineProperty calls for each instance created.
  if (Sub.options.props) {
    initProps(Sub);
  }
  if (Sub.options.computed) {
    initComputed(Sub);
  }

  // allow further extension/mixin/plugin usage
  Sub.extend = Super.extend;
  Sub.mixin = Super.mixin;
  Sub.use = Super.use;

  // create asset registers, so extended classes
  // can have their private assets too.
  ASSET_TYPES.forEach(function (type) {
    Sub[type] = Super[type];
  });
  // enable recursive self-lookup
  if (name) {
    Sub.options.components[name] = Sub;
  }

  // keep a reference to the super options at extension time.
  // later at instantiation we can check if Super's options have
  // been updated.
  Sub.superOptions = Super.options;
  Sub.extendOptions = extendOptions;
  Sub.sealedOptions = extend({}, Sub.options);

  // cache constructor
  cachedCtors[SuperId] = Sub;
  return Sub;
};
```

这是一种非常经典的原型继承的方式，只不过在继承后拓展了一些属性方法，然后缓存了这个构造函数。

:::important
实际上 Vue.js 建议 data 使用函数而不是直接使用对象，就跟这个缓存的构造函数有关系。试想同一个组件构造函数只会被创建一次，在第一次构造时 data 对应的状态就已经产生了，由于对象类型的数据是地址引用，那么复用的构造函数中 data 属性必然会指向同一处引用。
:::

### 安装组件钩子函数

我们之前提到 Vue.js 使用的 Virtual DOM 参考的是开源库 snabbdom ，它的一个特点是在 VNode 的 patch 流程中对外暴露了各种时机的钩子函数，方便我们做一些额外的事情，Vue.js 也是充分利用这一点，在初始化一个 Component 类型的 VNode 的过程中实现了几个钩子函数。

```js title="src/core/vdom/create-component.js"
function installComponentHooks(data: VNodeData) {
  const hooks = data.hook || (data.hook = {});
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i];
    const existing = hooks[key];
    const toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge;
    }
  }
}
```

整个 `installComponentHooks` 的过程就是把 `componentVNodeHooks` 的钩子函数合并到 `data.hook` 中，在 VNode 执行 patch 的过程中执行相关的钩子函数。这里要注意的是合并策略，在合并过程中，如果某个时机的钩子已经存在 `data.hook` 中，那合并后最终执行的时候，依次执行这两个钩子函数即可。

`componentVNodeHooks` 包含的钩子函数有：`init`、`prepatch`、`insert`、`destroy`。

### 实例化 VNode

最后一步非常简单，通过 `new VNode` 实例化一个 `vnode` 并返回。需要注意的是和普通元素节点的 `vnode` 不同，组件的 `vnode` 是没有 `children` 的，这点很关键。

## patch

前面说到，在执行 `createElm` 创建真实节点时，会先尝试执行 `createComponent` 创建子组件，否则执行 `createChildren` 递归创建普通 VNode。

### createComponent

```js title="src/core/vdom/patch.js"
function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data;
  if (isDef(i)) {
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
    // highlight-start
    if (isDef((i = i.hook)) && isDef((i = i.init))) {
      i(vnode, false /* hydrating */);
    }
    // highlight-end
    // after calling the init hook, if the vnode is a child component
    // it should've created a child instance and mounted it. the child
    // component also has set the placeholder vnode's elm.
    // in that case we can just return the element and be done.
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue);
      insert(parentElm, vnode.elm, refElm);
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
      }
      return true;
    }
  }
}
```

这里首先对 `vnode.data` 作了一些判断，如果 `vnode` 是一个组件 VNode，判断后得到的 `i` 就是 `init` 钩子函数。

```js title="src/core/vdom/create-component.js"
const componentVNodeHooks = {
  init(vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (vnode.componentInstance && !vnode.componentInstance._isDestroyed && vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      // highlight-start
      const child = (vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      ));
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
      // highlight-end
    }
  },
  prepatch(oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {},
  insert(vnode: MountedComponentVNode) {},
  destroy(vnode: MountedComponentVNode) {},
};
```

`init` 钩子函数通过 `createComponentInstanceForVnode` 创建一个 Vue 的实例，然后调用 `$mount` 方法挂载子组件。

```js title="src/core/vdom/create-component.js"
export function createComponentInstanceForVnode(
  vnode: any, // we know it's MountedComponentVNode but flow doesn't
  parent: any // activeInstance in lifecycle state
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent,
  };
  // check inline-template render functions
  const inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  // highlight-next-line
  return new vnode.componentOptions.Ctor(options);
}
```

所以子组件的实例化实际上就是在这个时机执行的，并且它会执行实例的 `_init` 方法。
