// ============================================================================
// LEVERAGE AI - CMS BACKEND API
// Cloudflare Workers with AI, Vectorize, and KV Storage
// ============================================================================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Enable CORS for all requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.CORS_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    };
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { 
        status: 200, 
        headers: corsHeaders 
      });
    }
    
    try {
      // API Routes for CMS
      if (path.startsWith('/api/content')) {
        return handleContent(request, env, corsHeaders);
      } else if (path.startsWith('/api/search')) {
        return handleSearch(request, env, corsHeaders);
      } else if (path.startsWith('/api/users')) {
        return handleUsers(request, env, corsHeaders);
      } else if (path.startsWith('/api/media')) {
        return handleMedia(request, env, corsHeaders);
      } else if (path.startsWith('/api/ai')) {
        return handleAI(request, env, corsHeaders);
      } else if (path.startsWith('/api/analytics')) {
        return handleAnalytics(request, env, corsHeaders);
      } else if (path === '/api/health') {
        return handleHealth(request, env, corsHeaders);
      }
    
      // Default response
      return new Response(JSON.stringify({ 
        message: 'LEVERAGE AI CMS API',
        version: env.CMS_VERSION || '1.0.0',
        environment: env.ENVIRONMENT || 'development',
        timestamp: new Date().toISOString()
      }), {        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        details: env.ENVIRONMENT === 'development' ? error.message : 'Server error'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// ============================================================================
// CONTENT MANAGEMENT ENDPOINTS
// ============================================================================

async function handleContent(request, env, corsHeaders) {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const method = request.method;

  try {
    if (method === 'GET' && pathSegments.length === 2) {
      // GET /api/content - List all content
      return listContent(request, env, corsHeaders);
    } else if (method === 'GET' && pathSegments.length === 3) {
      // GET /api/content/:id - Get specific content
      const contentId = pathSegments[2];
      return getContent(contentId, env, corsHeaders);
    } else if (method === 'POST' && pathSegments.length === 2) {
      // POST /api/content - Create new content
      return createContent(request, env, corsHeaders);
    } else if (method === 'PUT' && pathSegments.length === 3) {
      // PUT /api/content/:id - Update content
      const contentId = pathSegments[2];
      return updateContent(contentId, request, env, corsHeaders);
    } else if (method === 'DELETE' && pathSegments.length === 3) {
      // DELETE /api/content/:id - Delete content
      const contentId = pathSegments[2];
      return deleteContent(contentId, env, corsHeaders);
    }

    return new Response(JSON.stringify({ error: 'Invalid content endpoint' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Content error:', error);
    return new Response(JSON.stringify({ error: 'Content operation failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}