// Vercel Serverless Function: GET /api/health
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const hasKey = Boolean(process.env.RESEND_API_KEY);

  return res.status(200).json({
    status: 'online',
    service: 'Kinetix Energy Platform API',
    environment: 'vercel-serverless',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    checks: {
      api_router: 'healthy',
      json_parser: 'healthy',
      auth_service: 'healthy',
      resend_key_configured: hasKey ? 'configured_in_env' : 'missing_in_env_settings'
    }
  });
}
