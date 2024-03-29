// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'FEX',
  tagline: 'Help every front-end developer grow valuable.',
  url: 'https://fex.oxyzhg.cn',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'oxyzhg',
  projectName: 'oxyzhg.github.io',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
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
            to: 'series/practice',
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
                label: '浏览器工作原理与实践',
                to: 'series/browser-working-principle',
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
      metadata: [{name: 'keywords', content: 'cooking, blog'}],
    }),
};

module.exports = config;
