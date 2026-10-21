export const languages = {
  zh: '中文',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'zh';

export const ui = {
  zh: {
    // 导航
    'nav.home': '首页',
    'nav.recommendations': '推荐与工具',
    'nav.projects': '作品',
    'nav.blog': '博客',
    'nav.contact': '联系',

    // 模块标题
    'section.about': '关于与技术栈',
    'section.recommendations': '开发利器与推荐',
    'section.projects': '精选作品与项目',
    'section.blog': '博客与随笔',
    'section.contact': '沟通与外链',
    'section.visitorTime': '你的时间 (Visitor)',
    'section.localTime': '我的时间 (Local)',
    'section.quote': '经典名句与灵感',
    'section.experiences': '经历履历',
    'section.studies': '学历与认证',
    'section.books': '阅读书单',

    // 操作与按钮
    'btn.viewAllPosts': '查看全部文章 →',
    'btn.viewAllProjects': '查看更多作品 →',
    'btn.viewChromeExtension': '查看 Chrome 插件 ↗',
    'btn.contactMe': '打个招呼 / 联系我',
    'btn.switchLang': '切换为英文',
    'btn.switchLangShort': 'EN',

    // 占位与说明
    'placeholder.noProjects': '作品集打磨整理中，敬请期待...',
    'placeholder.noPosts': '博客随笔撰写中，敬请期待...',
    'placeholder.projectsSub': '更多高质量的独立工具、全栈与 AI 项目即将上线展示。',
    'placeholder.postsSub': '记录技术踩坑、架构设计与工具折腾的心得。',

    // 通用
    'footer.builtWith': 'Built with Astro, React & Tailwind CSS.',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.recommendations': 'Toolbox & Stack',
    'nav.projects': 'Projects',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',

    // Section Titles
    'section.about': 'About & Stack',
    'section.recommendations': 'Toolbox & Recommendations',
    'section.projects': 'Featured Projects',
    'section.blog': 'Blog & Thoughts',
    'section.contact': 'Connect & Links',
    'section.visitorTime': 'Your Time (Visitor)',
    'section.localTime': 'My Time (Local)',
    'section.quote': 'Words & Inspiration',
    'section.experiences': 'Experience',
    'section.studies': 'Education & Certifications',
    'section.books': 'Reading List',

    // Actions & Buttons
    'btn.viewAllPosts': 'All Posts →',
    'btn.viewAllProjects': 'View All Projects →',
    'btn.viewChromeExtension': 'View Chrome Extension ↗',
    'btn.contactMe': 'Say Hello / Contact',
    'btn.switchLang': 'Switch to Chinese',
    'btn.switchLangShort': '中文',

    // Placeholders
    'placeholder.noProjects': 'Projects are being polished, stay tuned...',
    'placeholder.noPosts': 'Blog posts in progress, stay tuned...',
    'placeholder.projectsSub': 'More independent tools, full-stack apps, and AI experiments coming soon.',
    'placeholder.postsSub': 'Notes on engineering practices, architectures, and side project explorations.',

    // General
    'footer.builtWith': 'Built with Astro, React & Tailwind CSS.',
  },
} as const;
