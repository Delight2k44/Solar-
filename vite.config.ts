import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Local mock API middleware for Vite development
function localApiPlugin() {
  return {
    name: 'local-api-endpoints',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url === '/api/health') {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify({
            status: 'online',
            service: 'Kinetix Energy Platform API',
            environment: 'local-vite-dev',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            checks: {
              api_router: 'healthy',
              dev_server: 'healthy',
              mailer_service: 'local_ready'
            }
          }, null, 2));
          return;
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
