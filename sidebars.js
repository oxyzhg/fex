// Add prefix
const prefixed = (prefix) => (item) => (typeof item === 'string' ? `${prefix}/${item}` : item);

module.exports = {
  /** Forward */
  forward: [
    'readme',
    {
      type: 'category',
      label: 'JavaScript',
      items: [
        'inheritance',
        'eventloop',
      ].map(prefixed('forward/javascript')),
    },
    {
      type: 'category',
      label: 'React',
      items: [
        'lifecycle',
      ].map(prefixed('forward/react')),
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
      ].map(prefixed('forward/vue')),
    },
    {
      type: 'category',
      label: 'Node.js',
      items: [
        'readme',
      ].map(prefixed('forward/nodejs')),
    },
    {
      type: 'category',
      label: '浏览器',
      items: [
        'from-url-to-page-load',
        'storage',
        'cache',
        'gc',
        'cross-origin',
      ].map(prefixed('forward/browser')),
    },
    {
      type: 'category',
      label: '设计模式',
      items: [
        'readme',
      ].map(prefixed('forward/design-pattern')),
    },
  ].map(prefixed('forward')),

  /** Engineering */
  engineering: [
    'readme',
    'module',
    {
      type: 'category',
      label: 'Webpack',
      collapsed: false,
      items: [
        'build-process',
        'optimization-analysis',
        'source-map',
        'hot-module-replacement',
        'webpack5',
      ].map(prefixed('engineering/webpack')),
    },
    'tree-shaking',
    'rollup-usage',
    'typescript',
    'web-framework-design',
    'microfrontend',
  ].map(prefixed('engineering')),

  /** Performance */
  performance: [
    'readme',
    {
      type: 'doc',
      id: 'engineering/webpack/optimization-analysis',
    },
    'project-practice',
  ].map(prefixed('performance')),

  /** Practice */
  practice: [
    'readme',
  ].map(prefixed('practice')),

  /** Interview */
  interview: [
    'readme',
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
        'binary-heap',
      ].map(prefixed('interview/data-structures')),
    },
    {
      type: 'category',
      label: '算法',
      items: [
        'readme',
        'template',
        'dynamic-programing',
        'backtrack',
        'leetcode',
      ].map(prefixed('interview/algorithms')),
    },
    {
      type: 'category',
      label: '排序算法',
      items: [
        'readme',
        'bubble',
        'selection',
        'insertion',
        'merge',
        'quick',
      ].map(prefixed('interview/sorts')),
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
        'curry',
        'jsonp',
        'merge-promise',
        'concurrent-poll',
      ].map(prefixed('interview/handwrittens')),
    },
    {
      type: 'category',
      label: '面试题目合辑',
      items: [
        'html',
        'css',
        'javascript',
        'vue',
        'webpack',
        'browser',
        'network',
        'performance',
        'others',
      ].map(prefixed('interview/questions')),
    },
  ].map(prefixed('interview')),
};
