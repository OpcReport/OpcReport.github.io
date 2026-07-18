# OPC Report

> AI-powered intelligence on One-Person Companies (OPC), solopreneurship, and the AI-driven solo-founder economy.

**Live site:** <https://opcreport.github.io>

---

## ☕ Support OPC Report

If these reports help your solo-founder journey, consider supporting us. All donations go toward hosting, data sources, and keeping the reports free.

### 💎 USDT (TRC20)

<p align="left">
  <img src="source/images/donation-usdt.jpg" alt="USDT TRC20 Donation QR Code" width="180" />
</p>

- **Network:** TRC20 (Tron)
- **Address:** `TSA1q55N3UZhztmFybchZXnNouqQSTcshp`

```text
TSA1q55N3UZhztmFybchZXnNouqQSTcshp
```

> ⚠️ **Important:** Only send **USDT** on the **TRC20 (Tron)** network. Sending tokens on other networks (ERC20, BEP20, etc.) or other tokens may result in permanent loss.

You can also scan the QR code above with any TRON-compatible wallet (TronLink, Trust Wallet, Binance, OKX, etc.) to send USDT directly.

Thank you for keeping OPC Report independent and ad-free. 🙏

---

## What is this?

OPC Report is a Hexo-powered blog that tracks the global rise of the One-Person Company model — solo founders using AI agents, micro-SaaS, and automation to build full-stack businesses without a team. Reports are published multiple times daily and curated from primary sources across China and the West.

## Content

- **Hourly OPC trend reports** — policy moves, funding rounds, tool launches, founder case studies
- **Coverage of 270+ English-language reports** (since June 2026)
- **Source mix:** China News Service, CSDN, Sohu, Tencent, GitHub, Indie Hackers, Y Combinator, OpenCSG, and more
- **Topics:** AI agents, digital employees, vertical SaaS, vibe coding, micro-SaaS, indie hacking, China AI policy, super-individual frameworks

## Tech Stack

| Layer | Choice |
|------|--------|
| Static site generator | [Hexo 8.x](https://hexo.io/) |
| Theme | hexo-theme-landscape (heavily customized) |
| Hosting | GitHub Pages (`gh-pages` branch) |
| Analytics | Google Analytics 4 |
| Visitor counter | [busuanzi](https://busuanzi.ibruce.info/) |
| SEO | JSON-LD structured data, Open Graph, canonical URLs, auto sitemap |
| Search | hexo-generator-search (client-side) |
| Feed | Atom (hexo-generator-feed) |

## Repository Layout

```
opcreport-blog-gh/
├── source/
│   ├── _posts/                 # Markdown reports (270+ English OPC reports)
│   ├── custom/style.css        # Custom dark editorial theme (cool black)
│   ├── css/theme-override.css  # (kept empty — consolidated into style.css)
│   ├── images/
│   │   ├── logo.png            # Site logo
│   │   └── donation-usdt.jpg   # USDT TRC20 donation QR code
│   ├── archives/index.md
│   └── tags/index.md
├── themes/landscape/
│   ├── _config.yml             # Theme config (menu, links, widgets)
│   ├── layout/
│   │   ├── _partial/
│   │   │   ├── head.ejs        # SEO meta, JSON-LD, GA4, busuanzi
│   │   │   ├── header.ejs      # Logo + nav + GitHub/RSS icons
│   │   │   ├── footer.ejs      # Visitor card + donation section
│   │   │   ├── article.ejs     # Article card with Read Full Report link
│   │   │   └── after-footer.ejs# jQuery + share box + fancybox
│   │   ├── tag.ejs             # Colorful tags page (8-color rotation)
│   │   ├── index.ejs
│   │   ├── post.ejs
│   │   ├── archive.ejs
│   │   └── layout.ejs
│   └── source/js/script.js     # 10-platform share box, mobile nav, fancybox
├── _config.yml                 # Site config (URL, deployment, plugins)
├── package.json
└── README.md                   # This file
```

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local server (default: http://localhost:4000)
npx hexo server

# 3. Generate static files to /public
npx hexo generate

# 4. Deploy to GitHub Pages (gh-pages branch)
npx hexo deploy
```

Requirements:
- Node.js 18+
- Hexo CLI: `npm install -g hexo-cli`

## Deployment

The site auto-deploys from the `gh-pages` branch to GitHub Pages at
<https://opcreport.github.io>. The deployment target is configured in
`_config.yml`:

```yaml
deploy:
  - type: git
    repo: https://github.com/OpcReport/OpcReport.github.io.git
    branch: gh-pages
    message: "deploy: %timestamp%"
```

GitHub Pages settings: **Deploy from a branch → `gh-pages` / `/ (root)**

## Features

### UI / UX
- **Cool black theme** with neon accents (blue / purple / cyan / pink / emerald / amber)
- **Colorful tags page** — 8-color rotation with neon glow on hover
- **Sticky blurred header** with logo image, nav, GitHub icon, RSS icon, search
- **Article cards** with gradient top border on hover
- **Mobile-first responsive layout** with slide-in nav
- **Dark-mode scrollbar** and selection styling

### SEO
- Canonical URLs on every page
- Auto-generated meta description from page content
- JSON-LD `BlogPosting` schema on post pages (headline, datePublished, author, keywords)
- JSON-LD `WebSite` schema with `SearchAction` on home
- Open Graph tags (`og:type`, `og:title`, `og:url`, `og:site_name`, `og:description`)
- Twitter card metadata
- Atom feed (`/atom.xml`) and XML sitemap (`/sitemap.xml`)
- Keywords tag with OPC-industry focus terms

### Visitor Stats
- Busuanzi-powered counter showing **Total Views**, **Visitors**, and **Articles** in the footer
- Graceful fallback to `—` if the busuanzi script fails to load after 5 seconds

### Share
10 social platforms per article:
X (Twitter) · Facebook · LinkedIn · Reddit · Telegram · WhatsApp · Hacker News · Mastodon · Email · Copy Link

### Donation
A donation card in the footer accepts **USDT on the TRC20 (Tron) network**.

- **Network:** TRC20 (Tron)
- **Address:** `TSA1q55N3UZhztmFybchZXnNouqQSTcshp`
- One-click "Copy Address" button
- Warning text reminds senders to use TRC20 only

> ⚠️ Sending tokens on other networks (ERC20, BEP20, etc.) may result in permanent loss.

## Adding a New Report

1. Drop a Markdown file into `source/_posts/` with the naming convention:
   `opc-report-YYYY-MM-DD-HHMM.md`
2. Front matter:
   ```yaml
   ---
   title: "Your Headline"
   date: 2026-07-18T10:00:00+08:00
   tags: [OPC, solopreneur, AI-startup]
   categories: [AI Trends]
   description: "One-line summary used for SEO meta and excerpts."
   ---
   ```
3. `npx hexo generate && npx hexo deploy`

## License

Content (report text) © OPC Report. Source code (theme customizations, templates) under MIT.

## Links

- **Live site:** <https://opcreport.github.io>
- **GitHub repo:** <https://github.com/OpcReport/OpcReport.github.io>
- **RSS feed:** <https://opcreport.github.io/atom.xml>
- **Sitemap:** <https://opcreport.github.io/sitemap.xml>

---

*If these reports help your solo-founder journey, consider supporting us with USDT (TRC20). See the donation card on the site footer.*
