# bouyout 个人网站

基于 Astro Bento 模板定制，展示 Java 后端、前端、全栈与 AI 应用集成服务。

## 运行

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

开发默认入口 `http://localhost:4321`，构建输出 `dist/`。

## 内容维护

### 内容与记录入口

- `src/content/profileData.ts`：个人信息、服务、流程、外链与模块开关。
- `src/components/sections/Services.astro`：服务与合作流程。
- `changes.md`：本地开发、内容、素材、构建和部署历史，不进入公开仓库。

头像是 AI 工作台插画。域名和对外邮箱待补充。未使用的模板示例内容和图片已清理，目前保留 PixPage 与首篇博客的中英文内容；只有显式设置 `published: true` 的内容才生成公开详情页。

独立公开仓库：[bouyoutt/personal-website](https://github.com/bouyoutt/personal-website)。

## 部署配置

通用基础设施模板位于 `infra/website.yaml` 和 `infra/edge-free.yaml`，校验脚本位于 `scripts/validate-infra.py`。实际部署需要按环境配置并核实服务资格、权限与费用；仓库内模板不代表网站已经上线。

实际环境信息、操作步骤与部署状态保存在本地 `DEPLOY.md`，验证报告保存在本地 `infra/validation/`，均不进入公开仓库。临时 EC2 账户验证模板同样仅本地保留，不属于网站部署必需文件。

## 主题色与明暗模式

右上角语言切换旁的色点按钮可展开主题色面板，支持暖橙（默认）、海蓝、森林绿、鸢尾紫和玫红。桌面显示“主题色”文字与展开箭头，窄屏保留当前色点。每项提供色样、名称和当前选中标记，支持键盘操作。

配色统一作用于按钮、强调文字、链接、焦点边框及标签图表。各配色分别提供浅色与深色模式值，选择保存在浏览器的 `accent-theme` 中；刷新、站内导航及中英文切换时会在页面绘制前恢复。明暗模式独立保存为 `theme`，未设置时跟随系统偏好。第三方品牌标识与状态色保留其语义。

- `src/lib/accent-themes.ts`：主题色名称与明暗配色。
- `src/components/react/AccentThemeToggle.tsx`：色板交互与选中状态。
- `src/components/ThemePreferences.astro`：全站变量生成与偏好恢复。

2026-10-21：本地开发功能，尚未部署到线上。

## 在线名言句库

名言组件直接通过 URL 加载 [一言官方句子包](https://sentences-bundle.hitokoto.cn/) 的 `sentences/d.json`（文学）、`h.json`（影视）、`k.json`（哲学），主站不可用时尝试官方说明提供的 jsDelivr 地址。没有使用随机语句 API，也未将第三方句库复制进项目。

每次页面加载重新验证文件（更新速度受上游发布与缓存影响），同一页面会话复用下载结果；按钮和 60 秒定时切换在浏览器中随机选句。只展示带出处的有效数据，不凭空补作者。中文页筛选含汉字的句子，英文页筛选无汉字的拉丁字母句子，不自动翻译。全部加载失败时显示重试按钮。

## 网站图标（2026-10-21）

浏览器图标使用白底加粗 Me，五种主题分别使用相应浅色模式的深色字色，确保白底可读性。浏览器只声明一个 64×64 PNG 图标入口；切换主题时先加载并解码新 PNG，成功后替换 link 节点；失败保留旧图标，忽略过期的切换请求，避免固定 ICO 与 SVG 竞争。各主题 PNG 随切换及站内导航更新；SVG 仍作为源素材保留，favicon.ico 与 favicon.png 是默认暖橙导出版本。修改配色后，在网站目录运行 `node scripts/generate-favicons.mjs` 重新生成全部图标，再构建。

## 本地清理约定

已替换且无运行用途的素材不作为历史备份长期堆积；开发过程截图默认放在 `output/` 并忽略提交，完成验证后可清理。需要长期保留的展示素材另行放入明确目录并在文档中说明用途。构建目录 `dist/`、缓存与依赖由工具维护，不作为作品或历史记录。

## 模板来源与许可

基于 [TechTim Astro Bento Portfolio](https://github.com/tim-hub/techtim-astro-bento-portfolio) 定制，该地址属于上游模板，并非个人仓库。

- 代码许可见 [LICENSE](LICENSE)（MIT），保留上游版权声明。
- 内容许可见 [src/content/LICENSE](src/content/LICENSE)（CC BY 4.0）。
- 当前图片与图标说明见 [public/LICENSE](public/LICENSE)，第三方配图的来源与许可保存在对应图片目录的 `SOURCES.md`。

## 独立仓库文件范围

提交网站源码、当前素材、包管理锁文件、构建配置、通用基础设施模板及校验/生成脚本。`DEPLOY.md`、`changes.md`、`infra/validation/` 和临时 EC2 验证模板仅保留本地；依赖、构建产物、截图、编辑器配置、运行环境与凭据文件均忽略。已进入 Git 历史的内容不会因新增忽略规则从历史中消失。
