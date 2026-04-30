'use strict';

const http = require('http');
const httpProxy = require('http-proxy');

const TARGET = 'http://10.85.151.94:3000';
const LISTEN_PORT = 5252;
const LISTEN_HOST = '0.0.0.0'; // bind all interfaces so LAN devices can reach it too

// ---------------------------------------------------------------------------
// Proxy instance
// ---------------------------------------------------------------------------
const proxy = httpProxy.createProxyServer({
  target: TARGET,

  // Keep the original host header so the upstream app behaves correctly.
  changeOrigin: true,

  // WebSocket support (used for WebRTC signaling, HMR, socket.io, etc.)
  ws: true,

  // Forward x-forwarded-* headers
  xfwd: true,

  // Do NOT follow redirects on the proxy level — pass them to the client.
  followRedirects: false,

  // Preserve cookies / headers as-is
  secure: false,

  // Increase proxy timeout (useful for long-polling / SSE)
  proxyTimeout: 0,   // no timeout
  timeout: 0,
});

// ---------------------------------------------------------------------------
// Error handler — log and close connection gracefully
// ---------------------------------------------------------------------------
proxy.on('error', (err, req, res) => {
  console.error(`[proxy error] ${req.method} ${req.url} →`, err.message);

  if (res && !res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end(`Proxy error: ${err.message}`);
  } else if (res && res.socket) {
    res.socket.destroy();
  }
});

// ---------------------------------------------------------------------------
// HTTP server
// ---------------------------------------------------------------------------
const server = http.createServer((req, res) => {
  // Pass EVERY request straight through to the target, unmodified.
  proxy.web(req, res, {}, (err) => {
    // Already handled by the error event above, but just in case.
    if (!res.headersSent) {
      res.writeHead(502);
      res.end('Bad Gateway');
    }
  });
});

// ---------------------------------------------------------------------------
// WebSocket upgrade (critical for WebRTC signaling & socket.io)
// ---------------------------------------------------------------------------
server.on('upgrade', (req, socket, head) => {
  console.log(`[ws upgrade] ${req.url}`);
  proxy.ws(req, socket, head, {}, (err) => {
    console.error(`[ws error] ${req.url} →`, err?.message);
    socket.destroy();
  });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
server.listen(LISTEN_PORT, LISTEN_HOST, () => {
  console.log(`✔  Reverse proxy listening on  http://localhost:${LISTEN_PORT}`);
  console.log(`   Forwarding all traffic  →   ${TARGET}`);
  console.log(`   WebSocket / WebRTC signaling upgrade: enabled`);
});

// Graceful shutdown
['SIGINT', 'SIGTERM'].forEach((sig) =>
  process.on(sig, () => {
    console.log(`\nReceived ${sig}, shutting down…`);
    server.close(() => process.exit(0));
  })
);
