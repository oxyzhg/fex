module.exports = {
  title: 'FEX',
  tagline: 'Reading makes a full man, conference a ready man, and writing an exact man.',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/fex/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'oxyzhg',
  projectName: 'oxyzhg.github.io',
  themeConfig: {
    navbar: {
      title: 'FEX',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/advanced',
          activeBasePath: 'docs/advanced',
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
              to: 'docs/advanced',
            },
            {
              label: '前端工程化',
              to: 'docs/engineering',
            },
            {
              label: '数据结构与算法',
              to: 'docs/algorithms',
            },
              to: 'docs/algorithms'
            }
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: '掘金',
              href: 'https://juejin.cn/user/571401775099528',
            },
            {
              label: '语雀',
              href: 'https://www.yuque.com/oxyzhg',
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
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/oxyzhg/fex/edit/main/',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl: 'https://github.com/oxyzhg/fex/edit/main/blog/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
