export interface ProfileData {
  site: {
    SEO: {
      title: string;
      description: string;
    };
  };
  sections: {
    intro: boolean;
    recommendations: boolean;
    about: boolean;
    projects: boolean;
    blog: boolean;
    contact: boolean;
    timezones: boolean;
    quote: boolean;
    experiences: boolean;
    studies: boolean;
    books: boolean;
  };
  timezone: string;
  language: string;
  firstName: string;
  name: string;
  headLine: string;
  headLine2: string;
  website: string;
  repo: string;
  avatarUrl: string;
  shortIntros: string[];
  words: string[];
  skills: string[];
  recommendations: {
    category: string;
    title: string;
    description: string;
    badge?: string;
  }[];
  links: {
    github: string;
    email: string;
    twitter: string;
    x: string;
    telegram: string;
    wechat: string;
    wechatQrCode?: string;
    linkedin: string;
    blog: string;
    fiverr: string;
    chromeExtension: string;
  };
  studies: any[];
}

export const PROFILE_ZH: ProfileData = {
  site: {
    SEO: {
      title: "bouyout | 独立开发者 · Java 后端与全栈实践",
      description:
        "bouyout 的个人独立主页与数字花园。专注于 Java 后端体系、高可靠服务开发，涉猎现代前端交互、Chrome 浏览器扩展与实用 AI 工具实践。",
    },
  },
  sections: {
    intro: true, // 个人介绍卡片 (Hero)
    recommendations: false, // 隐藏整行推荐与开发利器 (保持页面紧凑对称)
    about: true, // 关于我 & 技能栈 (About & Skills)
    projects: true, // 精选作品与 Chrome 插件 (Projects)
    blog: true, // 个人独立博客 (Blog)
    contact: false, // 沟通方式与外链 (已整合至 Hero 个人介绍卡片社交栏)
    timezones: true, // 双时区 / 本地时间卡片
    quote: true, // 个人格言 / 开发者哲学
    experiences: false, // 经历（按需开启）
    studies: false, // 学历与认证（按需开启）
    books: false, // 书单（按需开启）
  },
  timezone: "Asia/Shanghai",
  language: "zh-CN",
  firstName: "bouyout",
  name: "bouyout",
  headLine: "独立开发者 · Java 后端与全栈实践",
  headLine2:
    "热衷于构建扎实、稳定且有实际使用价值的软件。以 Java 后端工程体系为核心，兼顾现代前端与全栈开发，探索浏览器扩展与 AI 工具在真实场景中的应用。",
  website: "",
  repo: "",
  avatarUrl: "/developer-workstation.png",
  shortIntros: [
    "以 Java 后端为主，深耕可靠的 API 与工程架构",
    "涉猎现代 Web 前端与全栈开发，注重用户交互体验",
    "独立开发 PixPage 智能元素拾取助手并上架 Chrome 商店",
    "积极探索 AI API 接口集成、聊天交互与自动化实践",
    "崇尚极简高效：做真正有价值的软件，让技术扎实落地",
  ],
  words: ["做真正有价值的软件，让技术在实际场景中扎实落地。"],
  skills: [
    "Java",
    "RESTful API",
    "Database Integration",
    "TypeScript",
    "React",
    "Tailwind CSS",
    "Chrome Extension Dev",
    "AI API Integration",
  ],
  recommendations: [
    {
      category: "主力利器与工作流",
      title: "IntelliJ IDEA & VS Code & Chrome DevTools",
      description: "后端架构重构与高效编码首选，配合现代浏览器 DevTools 快速排查页面性能与网络请求。",
      badge: "核心工具",
    },
    {
      category: "自研工具与独立探索",
      title: "PixPage - 智能元素拾取助手 (Chrome 扩展)",
      description: "专为前端开发、自动化测试及 AI 协同打造的 Chrome 插件，智能生成抗脆弱选择器与结构化 Prompt。",
      badge: "已上架应用店",
    },
    {
      category: "阅读与技术审美",
      title: "《Effective Java》与现代 Web 规范",
      description: "坚信代码质量胜过数量。保持对系统底层的敬畏，同时拥抱轻量化、高性能的现代前端标准。",
      badge: "思维源泉",
    },
  ],
  links: {
    github: "https://github.com/bouyoutt",
    email: "",
    twitter: "https://x.com/bouyoutt",
    x: "https://x.com/bouyoutt",
    telegram: "https://t.me/bouyoutt",
    wechat: "",
    linkedin: "",
    blog: "/posts",
    fiverr: "https://www.fiverr.com/bouyout",
    chromeExtension: "https://chromewebstore.google.com/detail/pixpage-%E6%99%BA%E8%83%BD%E5%85%83%E7%B4%A0%E6%8B%BE%E5%8F%96%E5%8A%A9%E6%89%8B/dfoocadjojfjdopgjjdjobgldkffopnm",
  },
  studies: [],
};

export const PROFILE_EN: ProfileData = {
  site: {
    SEO: {
      title: "bouyout | Software Engineer & Independent Builder",
      description:
        "Personal website & digital garden of bouyout. Focused on Java backend architecture, modern web development, Chrome extensions, and practical AI tooling.",
    },
  },
  sections: {
    ...PROFILE_ZH.sections,
  },
  timezone: "Asia/Shanghai",
  language: "en",
  firstName: "bouyout",
  name: "bouyout",
  headLine: "Software Engineer & Independent Builder",
  headLine2:
    "Dedicated to building dependable, well-crafted software with real utility. Rooted in Java backend engineering, while actively building modern web apps, browser extensions, and pragmatic AI integrations.",
  website: "",
  repo: "",
  avatarUrl: "/developer-workstation.png",
  shortIntros: [
    "Specializing in Java backend engineering, robust APIs & architectures",
    "Building responsive, clean web interfaces with modern frontend tech",
    "Creator of PixPage - Smart Element Picker Assistant on Chrome Web Store",
    "Pragmatic AI API integrations, automation workflows & intelligent helpers",
    "Guiding philosophy: Build software with real value and high reliability",
  ],
  words: ["Build software that delivers real value, ground tech in tangible solutions."],
  skills: [
    "Java",
    "RESTful API",
    "Database Integration",
    "TypeScript",
    "React",
    "Tailwind CSS",
    "Chrome Extension Dev",
    "AI API Integration",
  ],
  recommendations: [
    {
      category: "Core Workstation",
      title: "IntelliJ IDEA & VS Code & Chrome DevTools",
      description: "Primary powerhouse for backend refactoring and deep frontend network inspection.",
      badge: "Essential",
    },
    {
      category: "Self-Built Tooling",
      title: "PixPage - Smart Element Picker (Chrome Extension)",
      description: "A productivity Chrome extension for developers & QA, generating robust selectors and AI-ready prompts.",
      badge: "Chrome Store",
    },
    {
      category: "Recommended Reading",
      title: "Effective Java & Modern Web Standards",
      description: "Strong fundamentals and respect for specifications are prerequisites for robust systems.",
      badge: "Reading",
    },
  ],
  links: {
    github: "https://github.com/bouyoutt",
    email: "",
    twitter: "https://x.com/bouyoutt",
    x: "https://x.com/bouyoutt",
    telegram: "https://t.me/bouyoutt",
    wechat: "",
    linkedin: "",
    blog: "/en/posts",
    fiverr: "https://www.fiverr.com/bouyout",
    chromeExtension: "https://chromewebstore.google.com/detail/pixpage-%E6%99%BA%E8%83%BD%E5%85%83%E7%B4%A0%E6%8B%BE%E5%8F%96%E5%8A%A9%E6%89%8B/dfoocadjojfjdopgjjdjobgldkffopnm",
  },
  studies: [],
};

export function getProfile(lang: 'zh' | 'en' = 'zh'): ProfileData {
  return lang === 'en' ? PROFILE_EN : PROFILE_ZH;
}

// 保持向下兼容默认导出
export const PROFILE = PROFILE_ZH;
