# 📖 学习计划追踪器

一个简洁美观的学习计划管理网站，支持任务管理、进度追踪和名言收藏。

## 功能

- 📚 **学习任务** - 添加、编辑、删除学习任务，支持完成状态标记
- 📊 **进度统计** - 实时显示今日学习完成进度，查看最近 7 天历史记录
- 💡 **名言管理** - 收藏和管理激励名言，支持自定义添加

## 本地开发

```bash
npm install
npm run dev
```

## 部署到 Vercel

### 方法一：Vercel CLI

```bash
npm i -g vercel
vercel
```

### 方法二：GitHub + Vercel

1. 将代码推送到 GitHub 仓库
2. 登录 [Vercel](https://vercel.com)
3. 点击 "New Project"
4. 导入你的 GitHub 仓库
5. 点击 "Deploy"

### 方法三：直接上传

1. 运行 `npm run build` 生成 `dist` 文件夹
2. 在 Vercel 创建项目时选择手动上传 `dist` 文件夹

## 绑定自定义域名

1. 在 Vercel 项目设置中找到 "Domains"
2. 添加你的域名
3. 按照提示在域名注册商处配置 DNS 记录：
   - 类型: `CNAME`
   - 名称: `your-domain.com`
   - 值: `cname.vercel-dns.com`

## 技术栈

- React + Vite
- Tailwind CSS
- LocalStorage 数据持久化

## 数据存储

所有数据存储在浏览器 LocalStorage 中，无需后端服务器。
