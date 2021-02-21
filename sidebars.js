// Add prefix
const prefixed = (prefix) => (item) => (typeof item === 'string' ? `${prefix}/${item}` : item);

module.exports = {
  /* 前端进阶 */
  advanced: [
    'doc1',
    {
      type: 'category',
      label: 'Vue.js',
      items: [
        'readme',
        'data-driven',
        'componentization',
        'reactive',
        'compile'
      ].map(prefixed('advanced/vue')),
      collapsed: false,
    },
    {
      type: 'category',
      label: '浏览器',
      items: [
        'from-url-to-page-load',
        'browser-storage',
        'browser-cache',
      ].map(prefixed('advanced/browser'))
    },
    {
      type: 'category',
      label: '安全',
      items: [
        'readme',
        'xss',
        'csrf'
      ].map(prefixed('advanced/security'))
    }
  ].map(prefixed('advanced')),

  /* 前端工程化 */
  engineering: [
    'readme',
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
  ].map(prefixed('engineering')),

  /* 数据结构与算法 */
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
};
