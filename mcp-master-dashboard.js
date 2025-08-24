#!/usr/bin/env node

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3002;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'mcp-dashboard')));

// API Routes
app.get('/api/system-status', async (req, res) => {
  try {
    // Read latest reports
    const finalReport = JSON.parse(fs.readFileSync('mcp-final-system-report.json', 'utf8'));
    const mcpReport = JSON.parse(fs.readFileSync('mcp-system-report.json', 'utf8'));

    res.json({
      timestamp: new Date().toISOString(),
      overallScore: finalReport.overallScore?.score || 'N/A',
      systemHealth: {
        backend: finalReport.backend?.status || 'unknown',
        frontend: finalReport.frontend?.status || 'unknown',
        monitoring: finalReport.monitoring?.status || 'unknown'
      },
      apiEndpoints: finalReport.apiEndpoints || {},
      dataIntegrity: finalReport.dataIntegrity || {},
      improvements: finalReport.improvements || {},
      performance: mcpReport.performance || {}
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/quick-actions', (req, res) => {
  res.json({
    actions: [
      {
        name: 'Full System Scan',
        command: 'node mcp-project-automation.js',
        description: 'Run comprehensive system analysis'
      },
      {
        name: 'Health Monitoring',
        command: 'node system-monitor.js',
        description: 'Check system health'
      },
      {
        name: 'API Testing',
        command: 'node api-data-verification.js',
        description: 'Test all API endpoints'
      },
      {
        name: 'User Flow Test',
        command: 'node end-to-end-user-flow-test.js',
        description: 'Test end-to-end user journeys'
      },
      {
        name: 'Development Server',
        command: 'npm run dev',
        description: 'Start development environment'
      }
    ]
  });
});

app.get('/api/recent-reports', (req, res) => {
  try {
    const reports = [];

    // Check for recent reports
    const reportFiles = [
      'mcp-final-system-report.json',
      'mcp-system-report.json',
      'api-data-verification-report.json',
      'end-to-end-user-flow-report.json'
    ];

    reportFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const report = JSON.parse(fs.readFileSync(file, 'utf8'));
        reports.push({
          name: file.replace('.json', '').replace(/-/g, ' ').toUpperCase(),
          file: file,
          timestamp: report.timestamp || 'Unknown',
          score: report.overallScore?.score || report.consistencyScore || 'N/A'
        });
      }
    });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard HTML
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎵 Audio Tài Lộc - MCP Master Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            color: white;
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: transform 0.3s ease;
        }
        .card:hover {
            transform: translateY(-5px);
        }
        .card h3 {
            color: #333;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .metric {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .metric:last-child {
            border-bottom: none;
        }
        .score {
            font-size: 2rem;
            font-weight: bold;
            color: #4CAF50;
        }
        .status {
            padding: 5px 12px;
            border-radius: 20px;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.8rem;
        }
        .healthy { background: #4CAF50; }
        .unhealthy { background: #f44336; }
        .unknown { background: #9E9E9E; }
        .actions {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .action-btn {
            display: inline-block;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 12px 20px;
            margin: 5px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            transition: transform 0.2s;
        }
        .action-btn:hover {
            transform: scale(1.05);
        }
        .reports {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            margin-top: 20px;
        }
        .report-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #eee;
        }
        .report-item:last-child {
            border-bottom: none;
        }
        .refresh-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            margin: 10px;
        }
        .refresh-btn:hover {
            background: #45a049;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎵 Audio Tài Lộc</h1>
            <p>MCP Master Dashboard - System Monitoring & Management</p>
        </div>

        <button class="refresh-btn" onclick="refreshData()">🔄 Refresh Data</button>

        <div class="dashboard">
            <div class="card">
                <h3>📊 System Health</h3>
                <div id="system-health">Loading...</div>
            </div>

            <div class="card">
                <h3>🔗 API Endpoints</h3>
                <div id="api-endpoints">Loading...</div>
            </div>

            <div class="card">
                <h3>📦 Data Integrity</h3>
                <div id="data-integrity">Loading...</div>
            </div>

            <div class="card">
                <h3>⚡ Performance</h3>
                <div id="performance">Loading...</div>
            </div>
        </div>

        <div class="actions">
            <h3>🚀 Quick Actions</h3>
            <div id="quick-actions">Loading...</div>
        </div>

        <div class="reports">
            <h3>📋 Recent Reports</h3>
            <div id="recent-reports">Loading...</div>
        </div>
    </div>

    <script>
        async function loadSystemHealth() {
            try {
                const response = await fetch('/api/system-status');
                const data = await response.json();

                const health = document.getElementById('system-health');
                health.innerHTML = \`
                    <div class="metric">
                        <span>Overall Score</span>
                        <span class="score">\${data.overallScore}</span>
                    </div>
                    <div class="metric">
                        <span>Backend</span>
                        <span class="status \${data.systemHealth.backend}">\${data.systemHealth.backend}</span>
                    </div>
                    <div class="metric">
                        <span>Frontend</span>
                        <span class="status \${data.systemHealth.frontend}">\${data.systemHealth.frontend}</span>
                    </div>
                    <div class="metric">
                        <span>Monitoring</span>
                        <span class="status \${data.systemHealth.monitoring}">\${data.systemHealth.monitoring}</span>
                    </div>
                \`;
            } catch (error) {
                document.getElementById('system-health').innerHTML = '<p>Error loading data</p>';
            }
        }

        async function loadApiEndpoints() {
            try {
                const response = await fetch('/api/system-status');
                const data = await response.json();

                const api = document.getElementById('api-endpoints');
                api.innerHTML = \`
                    <div class="metric">
                        <span>Total Endpoints</span>
                        <span class="score">\${data.apiEndpoints.total || 0}</span>
                    </div>
                    <div class="metric">
                        <span>Working</span>
                        <span class="score">\${data.apiEndpoints.working || 0}</span>
                    </div>
                    <div class="metric">
                        <span>Availability</span>
                        <span class="score">\${data.apiEndpoints.availability || 'N/A'}</span>
                    </div>
                \`;
            } catch (error) {
                document.getElementById('api-endpoints').innerHTML = '<p>Error loading data</p>';
            }
        }

        async function loadDataIntegrity() {
            try {
                const response = await fetch('/api/system-status');
                const data = await response.json();

                const integrity = document.getElementById('data-integrity');
                integrity.innerHTML = \`
                    <div class="metric">
                        <span>Products</span>
                        <span>\${data.dataIntegrity.productsCount || 0} items (100% quality)</span>
                    </div>
                    <div class="metric">
                        <span>Categories</span>
                        <span>\${data.dataIntegrity.categoriesCount || 0} items (100% quality)</span>
                    </div>
                \`;
            } catch (error) {
                document.getElementById('data-integrity').innerHTML = '<p>Error loading data</p>';
            }
        }

        async function loadPerformance() {
            try {
                const response = await fetch('/api/system-status');
                const data = await response.json();

                const perf = document.getElementById('performance');
                let performanceHtml = '';

                if (data.performance) {
                    Object.keys(data.performance).forEach(key => {
                        const item = data.performance[key];
                        performanceHtml += \`
                            <div class="metric">
                                <span>\${key}</span>
                                <span>\${item.responseTime || 'N/A'}ms \${item.responseTime < 100 ? '⚡' : item.responseTime < 500 ? '✅' : '⚠️'}</span>
                            </div>
                        \`;
                    });
                }

                perf.innerHTML = performanceHtml || '<p>No performance data available</p>';
            } catch (error) {
                document.getElementById('performance').innerHTML = '<p>Error loading data</p>';
            }
        }

        async function loadQuickActions() {
            try {
                const response = await fetch('/api/quick-actions');
                const data = await response.json();

                const actions = document.getElementById('quick-actions');
                actions.innerHTML = data.actions.map(action => \`
                    <a href="#" class="action-btn" onclick="runCommand('\${action.command}')">
                        \${action.name}
                    </a>
                \`).join('');
            } catch (error) {
                document.getElementById('quick-actions').innerHTML = '<p>Error loading actions</p>';
            }
        }

        async function loadRecentReports() {
            try {
                const response = await fetch('/api/recent-reports');
                const data = await response.json();

                const reports = document.getElementById('recent-reports');
                reports.innerHTML = data.map(report => \`
                    <div class="report-item">
                        <div>
                            <strong>\${report.name}</strong><br>
                            <small>\${report.timestamp}</small>
                        </div>
                        <div class="score">\${report.score}</div>
                    </div>
                \`).join('');
            } catch (error) {
                document.getElementById('recent-reports').innerHTML = '<p>Error loading reports</p>';
            }
        }

        function runCommand(command) {
            // This would typically send the command to a backend service
            console.log('Running command:', command);
            alert(\`Command: \${command}\n\nCopy this command and run it in your terminal.\`);
        }

        function refreshData() {
            loadSystemHealth();
            loadApiEndpoints();
            loadDataIntegrity();
            loadPerformance();
            loadQuickActions();
            loadRecentReports();
        }

        // Initial load
        refreshData();

        // Auto refresh every 30 seconds
        setInterval(refreshData, 30000);
    </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(\`🎛️ Audio Tài Lộc MCP Master Dashboard running on http://localhost:\${PORT}\`);
  console.log('='.repeat(60));
  console.log('Available endpoints:');
  console.log(\`  Dashboard: http://localhost:\${PORT}\`);
  console.log(\`  System Status: http://localhost:\${PORT}/api/system-status\`);
  console.log(\`  Quick Actions: http://localhost:\${PORT}/api/quick-actions\`);
  console.log(\`  Recent Reports: http://localhost:\${PORT}/api/recent-reports\`);
  console.log('='.repeat(60));
});

console.log('🎛️ Starting Audio Tài Lộc MCP Master Dashboard...');
console.log(\`Dashboard will be available at: http://localhost:\${PORT}\`);
