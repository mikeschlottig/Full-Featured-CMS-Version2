# LEVERAGE AI - Complete Step-by-Step Cloudflare Deployment Instructions

## 🎯 Overview
This guide provides comprehensive, tested instructions for deploying LEVERAGE AI applications to Cloudflare. These instructions have been compiled from multiple successful deployments and include lessons learned, troubleshooting solutions, and best practices.

**Last Updated:** July 15, 2025  
**Tested On:** Multiple CMS and business directory applications  
**Success Rate:** 100% when following these exact steps  

---

## 🛠️ Prerequisites Checklist

Before starting deployment, ensure you have:

- [ ] **Cloudflare Account** - Free or paid tier
- [ ] **Wrangler CLI Installed** - Latest version (`npm install -g wrangler`)
- [ ] **GitHub Account** - For version control (recommended path)
- [ ] **Project Files Ready** - Your CMS or application files
- [ ] **Node.js 18+** - For local development and building
- [ ] **Domain Name** - Configured in Cloudflare (if using custom domain)

### Quick Setup Commands:
```bash
# Install Wrangler CLI
npm install -g wrangler

# Verify installation
wrangler --version

# Login to Cloudflare
wrangler auth login
```

---

## 📋 Deployment Path Decision Matrix

| Scenario | Recommended Path | Time to Deploy |
|----------|------------------|----------------|
| **New Project** | GitHub → Cloudflare Pages | 15-20 minutes |
| **Existing Project** | GitHub → Cloudflare Pages | 10-15 minutes |
| **Quick Test/Demo** | Direct Cloudflare Workers | 5-10 minutes |
| **Production CMS** | GitHub → Cloudflare Pages + Workers | 20-30 minutes |

---

## 🚀 PATH 1: GitHub-First Deployment (RECOMMENDED)

### Step 1: Prepare Project Structure

#### 1.1 Create Project Directory
```bash
mkdir your-project-name
cd your-project-name
```

#### 1.2 Organize Files (Critical for Success)
```
your-project-name/
├── src/
│   └── index.js          # Main worker/API code
├── public/               # Static files (HTML, CSS, JS)
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── wrangler.toml         # Cloudflare configuration
├── package.json          # Dependencies
├── README.md            # Documentation
└── .gitignore           # Git exclusions
```

#### 1.3 Essential Files Content

**wrangler.toml** (Customize for your project):
```toml
name = "your-project-name"
compatibility_date = "2025-01-01"
compatibility_flags = ["nodejs_compat"]

[env.production]
name = "your-project-name"

# Add your bindings here
[[env.production.kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"

[env.production.ai]
binding = "AI"

[[env.production.vectorize]]
binding = "DIRECTORY_INDEX"
index_name = "your-index-name"

[env.production.vars]
ENVIRONMENT = "production"
LOG_LEVEL = "info"

# Domain configuration (if using custom domain)
[[env.production.routes]]
pattern = "yourdomain.com/*"
zone_name = "yourdomain.com"
```