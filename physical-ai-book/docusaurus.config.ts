import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical AI and Humanoid Robots',
  tagline: 'Exploring Embodied Intelligence and Robotics',
  favicon: 'img/home.png',

  future: {
    v4: true,
  },

url: 'https://hackathon-i-physical-ai-book-chatbo.vercel.app',
baseUrl: '/',

  organizationName: 'jasmineshamim',
  projectName: 'hackathon-I-physical-ai-book',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },

        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    // Add the floating chatbot as a global client module
    async function chatbotPlugin(context, options) {
      return {
        name: 'floating-chatbot-plugin',
        getClientModules() {
          return [require.resolve('./src/modules/ClientModule.jsx')];
        },
      };
    },
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',

    // ✅ Correct colorMode for automatic theme toggle
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false, // toggle enabled
      respectPrefersColorScheme: true,
    },

    navbar: {
  title: 'Physical AI and Humanoid Robots',
  logo: {
    alt: 'Physical AI Logo',
    src: 'img/home.png',
    width: 32,
    height: 32,
  },
  items: [
    {
      type: 'dropdown',
      label: 'Book',
      position: 'left',
      items: [
        { label: 'Module 1: Introduction to Physical AI', to: '/docs/module1-intro' },
        { label: 'Module 2: Core Robotics Programming with ROS 2', to: '/docs/module2-ros2' },
        { label: 'Module 3: Simulating Robots in a Virtual World', to: '/docs/module3-digital-twin' },
        { label: 'Module 4: Building the Robot\'s Brain: AI and Navigation', to: '/docs/module4-ai-robot-brain' },
        { label: 'Module 5: Advanced Topics in Humanoid Robotics', to: '/docs/module5-advanced-topics' },
        { label: 'Module 6: Hardware & Lab Setup', to: '/docs/hardware-lab-setup' },
      ],
    },
    {
      href: 'https://github.com/facebook/docusaurus',
      label: 'GitHub',
      position: 'right',
      className: 'navbar-github-link', // ✅ this is allowed
    },
  ],
},


    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Introduction', to: '/docs/intro' },
            { label: 'Module 1: Introduction', to: '/docs/module1-intro' },
            { label: 'Module 2: ROS2', to: '/docs/module2-ros2' },
            { label: 'Module 3: Digital Twin', to: '/docs/module3-digital-twin' },
          ],
        },
        {
          title: 'Resources',
          items: [
            { label: 'Hardware Lab Setup', to: '/docs/hardware-lab-setup' },
            { label: 'AI Robot Brain', to: '/docs/module4-ai-robot-brain' },
            { label: 'Advanced Topics', to: '/docs/module5-advanced-topics' },
            { label: 'GitHub Repository', href: 'https://github.com/facebook/docusaurus' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub Discussions', href: 'https://github.com/facebook/docusaurus/discussions' },
            { label: 'Discord', href: 'https://discordapp.com/invite/docusaurus' },
            { label: 'Twitter/X', href: 'https://twitter.com/docusaurus' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/company/docusaurus' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'GitHub', href: 'https://github.com/facebook/docusaurus' },
            { label: 'Blog', to: '/blog' },
            { label: 'GitHub Org', href: 'https://github.com/facebook' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI and Humanoid Robots Project. Built with Docusaurus.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
