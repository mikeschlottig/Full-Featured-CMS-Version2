# CLAUDE.md - AI Assistant Guide for LEVERAGE AI CMS

## Project Overview

LEVERAGE AI is a full-featured Content Management System built on Cloudflare Workers. It provides a complete Markdown publishing pipeline with AI-powered search, vector embeddings, and dynamic website generation for local business directories (Oregon SMB Directory).

**Purpose**: Automated publishing platform that converts Markdown content into SEO-optimized directory pages with vector search capabilities.

## Tech Stack

- **Runtime**: Cloudflare Workers (JavaScript)
- **AI/ML**: Cloudflare Workers AI (@cf/baai/bge-small-en-v1.5 embeddings)
- **Vector Database**: Cloudflare Vectorize (768-dimension embeddings)
- **Storage**: Cloudflare KV (content cache, sitemaps)
- **Analytics**: Cloudflare Analytics Engine
- **CI/CD**: GitHub Actions (Node.js 18.x, 20.x, 22.x)

## Project Structure

```
Full-Featured-CMS-Version2/
├── index.js                    # Main Worker entry point
├── workers-backend             # Extended backend implementation
├── workers-schema              # Complete schema with HTML generation
├── .github/
│   └── workflows/
│       ├── node.js.yml         # Node.js CI workflow
│       └── nodejs.yml          # Alternative workflow
├── README.md                   # Project notes
├── Complete-Cloudflare-Deployment-Guide.md
├── session-2-deployment-success.md
├── consolidation-complete.md
├── Lessons-Learned-and-Best-Practices.md
├── Full-Featured-CMS-ClaudeXGeminiCMS-Final-Draft (1).md  # Full specs
├── Full_Featured-CMS.txt       # Complete code reference
└── LeverageAI Project Exporter+FrontandBackFULL.md
```

## Key Files

| File | Purpose |
|------|---------|
| `index.js` | Main Cloudflare Worker with API routing |
| `workers-backend` | Extended publishing pipeline with all handlers |
| `workers-schema` | Complete implementation with dynamic HTML generation |
| `Full_Featured-CMS.txt` | 6000+ lines - complete code reference |
| `Full-Featured-CMS-ClaudeXGeminiCMS-Final-Draft (1).md` | 260+ page engineering specification |

## API Endpoints

### Content Publishing
- `POST /api/publish` - Publish Markdown content to directory

### Search & Discovery
- `GET /api/search?q={query}&city={city}&category={category}` - Vector search

### Templates
- `GET /api/templates?type={type}` - Get content templates (roofers, lawyers)

### Analytics
- `GET /api/analytics?action=content-stats` - Content statistics

### Other Endpoints
- `GET /api/content` - List/get content
- `GET /api/business` - Business management
- `GET /api/admin` - Admin operations
- `GET /api/health` - Health check

## Development Setup

### Prerequisites
- Cloudflare account with Workers enabled
- Wrangler CLI (`npm install -g wrangler`)
- Node.js 18.x or higher

### Required Cloudflare Resources
- **KV Namespace**: `CACHE` - Content storage
- **Vectorize Index**: `DIRECTORY_INDEX` - 768-dimension embeddings
- **Workers AI**: Enabled for embeddings
- **Analytics Engine**: Optional

### Local Development

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create required resources
wrangler kv:namespace create CACHE
wrangler vectorize create DIRECTORY_INDEX --dimensions=768 --metric=cosine

# Run locally
wrangler dev index.js
```

### Deployment

```bash
# Deploy to Cloudflare
wrangler deploy index.js
```

## Common Commands

```bash
# Development
wrangler dev index.js              # Start local dev server
wrangler dev --remote              # Dev with remote resources

# Deployment
wrangler deploy index.js           # Deploy to production
wrangler tail                      # View live logs

# KV Management
wrangler kv:namespace list         # List KV namespaces
wrangler kv:key list --namespace-id=<id>  # List keys

# Vectorize
wrangler vectorize list            # List indexes
wrangler vectorize describe DIRECTORY_INDEX  # Index info
```

## Testing

### GitHub Actions CI
Tests run automatically on push/PR to `main` branch:
- Node.js versions: 18.x, 20.x, 22.x
- Commands: `npm ci`, `npm run build`, `npm test`

### Manual Testing

```bash
# Test health endpoint
curl http://localhost:8787/api/health

# Test publish
curl -X POST http://localhost:8787/api/publish \
  -H "Content-Type: application/json" \
  -d '{"frontMatter":{"title":"Test","city":"portland","category":"roofers"},"content":"# Test"}'

# Test search
curl "http://localhost:8787/api/search?q=roofing&city=portland"

# Get templates
curl "http://localhost:8787/api/templates?type=roofers"
```

## Code Conventions

### Worker Pattern
All handlers follow this structure:
```javascript
async function handleEndpoint(request, env, corsHeaders) {
  try {
    // Implementation
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
```

### CORS Headers
All responses include CORS headers:
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

### Content Structure
Published content uses frontMatter + content pattern:
```javascript
{
  frontMatter: {
    title: "Page Title",
    description: "SEO description",
    keywords: "keyword1, keyword2",
    city: "portland",
    category: "roofers",
    seo_priority: "high",
    vector_tags: ["tag1", "tag2"]
  },
  content: "# Markdown Content..."
}
```

### Vector Metadata
Embeddings include standardized metadata:
```javascript
{
  content_type: 'directory_page',
  title: string,
  city: string,
  category: string,
  description: string,
  published_at: ISO date,
  url_path: string
}
```

## Environment Variables

Required bindings in `wrangler.toml`:
```toml
[vars]
ENVIRONMENT = "production"
CMS_VERSION = "1.0.0"
CORS_ORIGIN = "*"

[[kv_namespaces]]
binding = "CACHE"
id = "<your-kv-id>"

[[vectorize]]
binding = "DIRECTORY_INDEX"
index_name = "<your-index-name>"

[ai]
binding = "AI"

[[analytics_engine_datasets]]
binding = "ANALYTICS"
```

## When Making Changes

1. **Follow existing patterns** - Check `index.js` or `workers-backend` for handler structure
2. **Maintain CORS support** - Include corsHeaders in all responses
3. **Handle errors gracefully** - Wrap handlers in try/catch
4. **Use 768-dimension embeddings** - Required for Vectorize compatibility
5. **Test locally first** - Use `wrangler dev` before deploying
6. **Check the spec** - Reference `Full_Featured-CMS.txt` for complete implementation details

## Architecture Notes

### Publishing Pipeline
1. Receive Markdown content with frontMatter
2. Generate 768-dim embedding via Workers AI
3. Upsert to Vectorize with metadata
4. Store full content in KV cache
5. Update sitemap
6. Track analytics
7. Return deployment URL

### Search Flow
1. Generate embedding for query
2. Query Vectorize with filters (city, category)
3. Return matched items with scores and metadata

### Website Serving
- Subdomains map to cities: `portland.oregonsmbdirectory.com`
- Path segments map to categories: `/roofers/`
- Content pulled from KV and rendered with SEO metadata

## Important Files Reference

- **Complete Code**: `Full_Featured-CMS.txt` (6000+ lines)
- **Full Specification**: `Full-Featured-CMS-ClaudeXGeminiCMS-Final-Draft (1).md` (260+ pages)
- **Deployment Guide**: `Complete-Cloudflare-Deployment-Guide.md`
- **Lessons Learned**: `Lessons-Learned-and-Best-Practices.md`
