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

```js title="src/core/instance/init.js"
Vue.prototype._init = function (options?: Object) {
  const vm: Component = this;
  // merge options
  if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    // highlight-next-line
    initInternalComponent(vm, options);
  } else {
    vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm);
  }
  // ...
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
};
```

`_isComponent` 是内部组件标识，因此这里通过 `initInternalComponent` 方法合并 `options`。

```js title="src/core/instance/init.js"
export function initInternalComponent(vm: Component, options: InternalComponentOptions) {
  const opts = (vm.$options = Object.create(vm.constructor.options));
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode;
  // highlight-start
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;
  // highlight-end

  const vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}
```

配置合并完成后，在非服务端渲染场景下，会执行 `child.$mount(undefined, false)` 进行挂载。这最终会执行到 `mountComponent` 方法，进而执行 `vm._render` 方法。

```js
Vue.prototype._render = function (): VNode {
  const vm: Component = this;
  const { render, _parentVnode } = vm.$options;

  // set parent vnode. this allows render functions to have access
  // to the data on the placeholder node.
  // highlight-next-line
  vm.$vnode = _parentVnode;
  // render self
  let vnode;
  try {
    vnode = render.call(vm._renderProxy, vm.$createElement);
  } catch (e) {
    // ...
  }
  // set parent
  // highlight-next-line
  vnode.parent = _parentVnode;
  return vnode;
};
```

注意这里设置了 parent 属性，也就是 `$vnode`，它们是一致父子的关系。

接下来就是把组件的 VNode 渲染成真实节点，执行 `vm_update` 方法。

```js title="src/core/instance/lifecycle.js"
// highlight-next-line
export let activeInstance: any = null;
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this;
  const prevEl = vm.$el;
  const prevVnode = vm._vnode;
  const prevActiveInstance = activeInstance;
  activeInstance = vm;
  // highlight-next-line
  vm._vnode = vnode;
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) {
    // initial render
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode);
  }
  activeInstance = prevActiveInstance;

  // if parent is an HOC, update its $el as well
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el;
  }
  // updated hook is called by the scheduler to ensure that children are
  // updated in a parent's updated hook.
};
```

这里 `vm._vnode` 和 `vm.$vnode` 的关系就是一种父子关系，用代码表达就是 `vm._vnode.parent === vm.$vnode`，即 `$vnode` 是当前组件的父组件。

另外，这个 `activeInstance` 变量的作用就是保持当前上下文的 Vue 实例，它在执行 `createComponentInstanceForVnode` 时作为 parent 参数传入，把它作为子组件的父 Vue 实例。

实际上，组件的实例与根组件的实例化过程相比，在合并配置、挂载实例等过程中，由于 `parent` 的存在，出现了一些差异。但这其实不用过多解读，目的都是为了实现组件化。

## 合并配置

其实，在执行 `_init` 方法时，不同场景下就合并配置就产生了差异。

```js title="src/core/instance/init.js"
Vue.prototype._init = function (options?: Object) {
  const vm: Component = this;
  // ...
  // merge options
  if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    // highlight-next-line
    initInternalComponent(vm, options);
  } else {
    // highlight-next-line
    vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm);
  }

  // ...
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
};
```

其中 `mergeOptions` 在外部调用场景执行，`initInternalComponent` 在组件场景执行。

### 外部调用场景

执行 `mergeOptions` 时，`resolveConstructorOptions(vm.constructor)` 相当于 `Vue.options`。

```js title="src/core/global-api/index.js"
export function initGlobalAPI(Vue: GlobalAPI) {
  // ...
  Vue.options = Object.create(null);
  ASSET_TYPES.forEach((type) => {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);
  // ...
}
```

这段代码创建了一个空对象，然后为对象增加了 `components,directives,filters` 属性，最后把一些内置组件拓展到实例上。

```js title="src/core/util/options.js"
/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
export function mergeOptions(parent: Object, child: Object, vm?: Component): Object {
  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  const extendsFrom = child.extends;
  if (extendsFrom) {
    // highlight-next-line
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (let i = 0, l = child.mixins.length; i < l; i++) {
      // highlight-next-line
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  const options = {};
  let key;
  // highlight-next-line
  for (key in parent) {
    mergeField(key);
  }
  // highlight-next-line
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField(key) {
    const strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options;
}
```

`mergeOptions` 主要功能就是把 parent 和 child 这两个对象根据一些合并策略，合并成一个新对象并返回。比较核心的几步，先递归把 `extends` 和 `mixins` 合并到 `parent` 上，然后遍历 parent，调用 `mergeField`，然后再遍历 child，如果 key 不在 `parent` 的自身属性上，则调用 `mergeField`。

合并后 `vm.$options` 的值差不多是这样：

```js
vm.$options = {
  el: '#app',
  components: {},
  directives: {},
  filters: {},
  created: [
    function created() {}, // created hooks
  ],
  _base: function Vue(options) {
    this._init();
  },
  render: function (h) {},
};
```

### 组件调用场景

在组件内部，组件实例的构造函数通过 `Vue.extend` 继承自 `Vue`。

```js title="src/core/global-api/extend.js"
Vue.extend = function (extendOptions: Object): Function {
  // ...
  Sub.options = mergeOptions(Super.options, extendOptions);
  // ...
  // keep a reference to the super options at extension time.
  // later at instantiation we can check if Super's options have
  // been updated.
  Sub.superOptions = Super.options;
  Sub.extendOptions = extendOptions;
  Sub.sealedOptions = extend({}, Sub.options);
  // ...
  return Sub;
};
```

其中 `extendOptions` 是在执行 `createComponentInstanceForVnode` 时产生。

```js title="src/core/vdom/create-component.js
export function createComponentInstanceForVnode(vnode: any, parent: any): Component {
  // highlight-start
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent,
  };
  // highlight-end
  // ...
  return new vnode.componentOptions.Ctor(options);
}
```

这里组件实例化后，立即执行构造函数，然后进入 `this._init(options)` 流程。如果符合 `options._isComponent` 则执行 `initInternalComponent(vm, options)` 逻辑。

```js title="src/core/instance/init.js"
export function initInternalComponent(vm: Component, options: InternalComponentOptions) {
  const opts = (vm.$options = Object.create(vm.constructor.options));
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  const vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}
```

这里给 `vm.$options` 保存了父 Vue 实例 `parent`、父 VNode 实例 `parentVnod`。

不管是外部调用场景还是组件场景，他们合并的逻辑大致相似，合并完的结果保留在 `vm.$options` 中，组件场景还会额外增加一些定义组件的私有属性。

## 组件注册

Vue.js 提供了 2 种组件的注册方式，全局注册和局部注册。

### 全局注册

要注册一个全局组件，可以使用 `Vue.component(id, definition)`。它的定义过程发生在最开始初始化 Vue 的全局函数的时候。

```js title="src/core/global-api/assets.js"
import { ASSET_TYPES } from 'shared/constants';
import { isPlainObject, validateComponentName } from '../util/index';

export function initAssetRegisters(Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach((type) => {
    Vue[type] = function (id: string, definition: Function | Object): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id];
      } else {
        // ...
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        // highlight-next-line
        this.options[type + 's'][id] = definition;
        return definition;
      }
    };
  });
}
```

函数首先遍历 `ASSET_TYPES`，得到 `type` 后挂载到 Vue 上 。

由于我们每个组件的创建都是通过 `Vue.extend` 继承而来，也就是在创建子组件构造函数的时候，就把全局注册的资源合并到新构造函数 `vm.$options` 上。

在解析 vnode 过程中，会执行到 `_createElement` 方法，其中有段代码是尝试创建组件 VNode，如果已经注册了对应组件，就会返回组件 VNode。

### 局部注册

局部注册就是 options 的一个配置，使用时机跟全局注册一致。

注意，局部注册和全局注册不同的是，只有该类型的组件才可以访问局部注册的子组件，而全局注册是扩展到 `Vue.options` 下，所以在所有组件创建的过程中，都会从全局的 `Vue.options.components` 扩展到当前组件的 `vm.$options.components` 下，这就是全局注册的组件能被任意使用的原因。

## 异步组件

Vue 也原生支持了异步组件的能力。有 3 种异步组件创建方式。

```js
Vue.component('async-example', function (resolve, reject) {
  // 利用 webpack 自动拆分异步代码的能力
  require(['./my-async-component'], resolve);
});
```

```js
Vue.component(
  'async-webpack-example',
  // 该 `import` 函数返回一个 `Promise` 对象
  () => import('./my-async-component')
);
```

```js
const AsyncComp = () => ({
  // 异步加载一个组件
  component: import('./my-component.vue'),
  // 加载中应当渲染的组件
  loading: LoadingComp,
  // 出错时渲染的组件
  error: ErrorComp,
  // 渲染加载中组件前的等待时间。默认：200ms
  delay: 200,
  // 最长等待时间，超出此时间则渲染错误组件。默认：Infinity
  timeout: 3000,
});
Vue.component('async-example', AsyncComp);
```
