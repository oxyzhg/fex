const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'FEX',
  tagline: 'Reading makes a full man, conference a ready man, and writing an exact man.',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/fex/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'oxyzhg',
  projectName: 'oxyzhg.github.io',

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/edit/main/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'FEX',
        logo: {
          alt: 'Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: 'docs/forward',
            activeBasePath: 'docs/forward',
            label: '前端进阶',
            position: 'right',
          },
          {
            to: 'docs/engineering',
            activeBasePath: 'docs/engineering',
            label: '工程化',
            position: 'right',
          },
          {
            to: 'docs/performance',
            activeBasePath: 'docs/performance',
            label: '性能优化',
            position: 'right',
          },
          {
            to: '/docs/practice',
            activeBasePath: 'docs/practice',
            label: '开发实践',
            position: 'right',
          },
          {
            href: 'https://github.com/oxyzhg/fex',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: '前端进阶',
                to: 'docs/forward',
              },
              {
                label: '前端面试',
                to: 'docs/interview',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: '语雀',
                href: 'https://www.yuque.com/oxyzhg',
              },
              {
                label: '掘金',
                href: 'https://juejin.cn/user/571401775099528',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/oxyzhg',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Oxyzhg`,
      },
      prism: {
        defaultLanguage: 'javascript',
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
});
