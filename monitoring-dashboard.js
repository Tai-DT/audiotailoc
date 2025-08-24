#!/usr/bin/env node

const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dashboard')));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const backendHealth = await axios.get('http://localhost:3010/api/v1/health', { timeout: 5000 });
    const frontendHealth = await axios.get('http://localhost:3000', { timeout: 10000 });

    res.json({
      status: 'healthy',
      backend: backendHealth.status,
      frontend: frontendHealth.status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// System metrics endpoint
app.get('/api/metrics', async (req, res) => {
  try {
    const [products, categories] = await Promise.all([
      axios.get('http://localhost:3010/api/v1/catalog/products'),
      axios.get('http://localhost:3010/api/v1/catalog/categories')
    ]);

    res.json({
      productsCount: products.data.data?.items?.length || 0,
      categoriesCount: categories.data.data?.items?.length || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Dashboard HTML
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Audio Tài Lộc - System Monitor</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .dashboard { max-width: 1200px; margin: 0 auto; }
        .card { background: white; padding: 20px; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .status { padding: 5px 10px; border-radius: 4px; color: white; font-weight: bold; }
        .healthy { background: #4CAF50; }
        .unhealthy { background: #f44336; }
        .metric { font-size: 24px; font-weight: bold; color: #333; }
        .refresh { background: #2196F3; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="dashboard">
        <h1>🎵 Audio Tài Lộc - System Monitor</h1>

        <div class="card">
            <h2>System Health</h2>
            <div id="health-status">Loading...</div>
        </div>

        <div class="card">
            <h2>System Metrics</h2>
            <div id="metrics">Loading...</div>
        </div>

        <button class="refresh" onclick="refreshData()">🔄 Refresh</button>
    </div>

    <script>
        async function loadHealth() {
            try {
                const response = await fetch('/api/health');
                const data = await response.json();

                const status = document.getElementById('health-status');
                status.innerHTML = `
                    <p><strong>Backend:</strong> <span class="status ${data.backend === 200 ? 'healthy' : 'unhealthy'}">${data.backend}</span></p>
                    <p><strong>Frontend:</strong> <span class="status ${data.frontend === 200 ? 'healthy' : 'unhealthy'}">${data.frontend}</span></p>
                    <p><strong>Last Check:</strong> ${data.timestamp}</p>
                `;
            } catch (error) {
                document.getElementById('health-status').innerHTML = '<p class="status unhealthy">Unable to connect</p>';
            }
        }

        async function loadMetrics() {
            try {
                const response = await fetch('/api/metrics');
                const data = await response.json();

                const metrics = document.getElementById('metrics');
                metrics.innerHTML = `
                    <p class="metric">${data.productsCount} <small>Products</small></p>
                    <p class="metric">${data.categoriesCount} <small>Categories</small></p>
                    <p><strong>Last Updated:</strong> ${data.timestamp}</p>
                `;
            } catch (error) {
                document.getElementById('metrics').innerHTML = '<p class="status unhealthy">Unable to load metrics</p>';
            }
        }

        function refreshData() {
            loadHealth();
            loadMetrics();
        }

        // Auto refresh every 30 seconds
        setInterval(refreshData, 30000);

        // Initial load
        loadHealth();
        loadMetrics();
    </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`🎛️ Audio Tài Lộc Monitoring Dashboard running on http://localhost:${PORT}`);
});

console.log('🎛️ Starting Audio Tài Lộc Monitoring Dashboard...');
console.log(`Dashboard will be available at: http://localhost:${PORT}`);
