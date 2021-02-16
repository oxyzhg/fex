// Add prefix
const prefixed = (prefix) => (item) => (typeof item === 'string' ? `${prefix}/${item}` : item);

module.exports = {
  /* 基础 */
  advanced: ['doc1', 'doc2', 'doc3', 'mdx'].map(prefixed('advanced')),

  /* 前端工程化 */
  engineering: [
    'readme',
    {
      type: 'category',
      label: 'Webpack',
      items: ['source-map'].map(prefixed('engineering/webpack')),
      collapsed: false,
    },
  ].map(prefixed('engineering')),
};
