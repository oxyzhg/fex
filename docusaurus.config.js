const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'FEX',
  tagline: 'Help every front-end developer grow valuable.',
  url: 'https://oxyzhg.cn',
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
          path: 'series',
          routeBasePath: 'series',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/oxyzhg/fex/edit/main/',
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
            to: 'series/forward',
            activeBasePath: 'series/forward',
            label: '前端进阶',
            position: 'right',
          },
          {
            to: 'series/engineering',
            activeBasePath: 'series/engineering',
            label: '工程化',
            position: 'right',
          },
          {
            to: 'series/performance',
            activeBasePath: 'series/performance',
            label: '性能优化',
            position: 'right',
          },
          {
            to: '/series/practice',
            activeBasePath: 'series/practice',
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
                to: 'series/forward',
              },
              {
                label: '前端面试',
                to: 'series/interview',
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
