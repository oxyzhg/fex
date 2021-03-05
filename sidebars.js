// Add prefix
const prefixed = (prefix) => (item) => (typeof item === 'string' ? `${prefix}/${item}` : item);

module.exports = {
  /* Front-end Advanced */
  advanced: [
    'readme',
    {
      type: 'category',
      label: 'JavaScript',
      items: [
        'inheritance',
        'eventloop',
      ].map(prefixed('advanced/javascript')),
    },
    {
      type: 'category',
      label: 'Vue.js',
      items: [
        'readme',
        'data-driven',
        'componentization',
        'reactive',
        'compile',
        'lifecycle',
        'next-tick',
        'computed-vs-watch',
        'component-update',
        'v-model',
        'mvvm',
      ].map(prefixed('advanced/vue')),
      // collapsed: false,
    },
    {
      type: 'category',
      label: '浏览器',
      items: [
        'from-url-to-page-load',
        'browser-storage',
        'browser-cache',
        'browser-gc',
        'cross-origin',
      ].map(prefixed('advanced/browser')),
    },
    {
      type: 'category',
      label: '安全',
      items: [
        'readme',
        'xss',
        'csrf',
      ].map(prefixed('advanced/security')),
    },
    {
      type: 'category',
      label: '网络',
      items: [
        'http',
        'websocket',
      ].map(prefixed('advanced/network')),
    }
  ].map(prefixed('advanced')),

  /* Front-end Engineering */
  engineering: [
    'readme',
    'module',
    {
      type: 'category',
      label: 'Webpack',
      items: [
        'source-map',
        'hot-module-replacement',
        'optimization-analysis',
      ].map(prefixed('engineering/webpack')),
      collapsed: false,
    },
    'tree-shaking',
    'rollup-usage',
  ].map(prefixed('engineering')),

  /* Performance */
  performance: [
    'readme',
    {
      type: 'doc',
      id: 'engineering/webpack/optimization-analysis',
    },
    'vue',
  ].map(prefixed('performance')),

  /* Data structures and Algorithms */
  algorithms: [
    {
      type: 'category',
      label: '数据结构',
      items: [
        'stack',
        'queue',
        'deque',
        'linked-list',
        'doubly-linked-list',
        'binary-search-tree',
      ].map(prefixed('data-structures')),
    },
    {
      type: 'category',
      label: '算法',
      items: [
        'readme',
        'leetcode'
      ].map(prefixed('algorithms')),
    },
    {
      type: 'category',
      label: '排序算法',
      items: [
        'readme',
        'bubble-sort'
      ].map(prefixed('sorts')),
    },
    {
      type: 'category',
      label: '模拟实现',
      items: [
        'debunce-throttle',
        'clone-deep',
        'call-apply-bind',
        'new',
        'instanceof',
        'promise',
        'localstorage',
        'array-flat',
      ].map(prefixed('handwrittens')),
    },
  ],

  /* Front-end Interview */
  interview: [
    'javascript',
    'css',
    'vue',
    'webpack',
    'performance',
    'http',
    'others',
  ].map(prefixed('interview')),
};
