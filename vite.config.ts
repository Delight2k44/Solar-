import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Local API middleware for Vite development — executes real serverless endpoints
function localApiPlugin() {
  const env = loadEnv('development', process.cwd(), '');
  if (env.RESEND_API_KEY) {
    process.env.RESEND_API_KEY = env.RESEND_API_KEY;
  } else if (env.VITE_RESEND_API_KEY) {
    process.env.RESEND_API_KEY = env.VITE_RESEND_API_KEY;
  }

  return {
    name: 'local-api-endpoints',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url?.split('?')[0];
        if (!url || !url.startsWith('/api/')) {
          return next();
        }

        // Response helpers
        res.status = (code: number) => { res.statusCode = code; return res; };
        res.json = (data: any) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return res;
        };

        if (url === '/api/health') {
          return res.status(200).json({
            status: 'online',
            service: 'Kinetix Energy Platform API',
            environment: 'local-vite-dev',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            checks: {
              api_router: 'healthy',
              dev_server: 'healthy',
              mailer_service: Boolean(process.env.RESEND_API_KEY) ? 'active' : 'missing_key'
            }
          });
        }

        const routeMap: Record<string, string> = {
          '/api/send-email': './api/send-email.js',
          '/api/quotes/residential': './api/quotes/residential.js',
          '/api/quotes/commercial': './api/quotes/commercial.js',
          '/api/bookings/assessment': './api/bookings/assessment.js',
          '/api/support/contact': './api/support/contact.js',
          '/api/support/maintenance': './api/support/maintenance.js',
          '/api/orders/checkout': './api/orders/checkout.js',
        };

        const targetFile = routeMap[url];
        if (targetFile) {
          try {
            let bodyData: any = {};
            if (req.method === 'POST') {
              const buffers: Buffer[] = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const raw = Buffer.concat(buffers).toString();
              if (raw) {
                try {
                  bodyData = JSON.parse(raw);
                } catch {
                  bodyData = {};
                }
              }
            }
            req.body = bodyData;

            const mod = await server.ssrLoadModule(targetFile);
            if (mod && typeof mod.default === 'function') {
              await mod.default(req, res);
              return;
            }
          } catch (err: any) {
            console.error('Local API route error:', err);
            return res.status(500).json({ success: false, error: err.message });
          }
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), localApiPlugin()],
  server: {
    port: 3000,
    open: false,
  }
});
