interface DeviceHealth {
  deviceId: string;
  timestamp: number;
  temperature: number;
  powerUsage: number;
  memoryPressure: number;
  diskHealth: number;
  uptime: number;
}

interface Alert {
  id: string;
  deviceId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'temperature' | 'power' | 'memory' | 'disk' | 'predictive';
  message: string;
  timestamp: number;
  resolved: boolean;
}

interface Prediction {
  deviceId: string;
  component: string;
  failureProbability: number;
  estimatedFailureTime: number;
  recommendedAction: string;
  confidence: number;
}

const DEVICE_DATA: Record<string, DeviceHealth> = {
  "server-01": {
    deviceId: "server-01",
    timestamp: Date.now(),
    temperature: 65,
    powerUsage: 420,
    memoryPressure: 72,
    diskHealth: 88,
    uptime: 86400
  },
  "server-02": {
    deviceId: "server-02",
    timestamp: Date.now(),
    temperature: 72,
    powerUsage: 380,
    memoryPressure: 65,
    diskHealth: 92,
    uptime: 172800
  }
};

const ALERTS: Alert[] = [
  {
    id: "alert-001",
    deviceId: "server-01",
    severity: "medium",
    type: "temperature",
    message: "CPU temperature approaching threshold (65°C)",
    timestamp: Date.now() - 3600000,
    resolved: false
  },
  {
    id: "alert-002",
    deviceId: "server-02",
    severity: "low",
    type: "memory",
    message: "Memory pressure at 65%",
    timestamp: Date.now() - 7200000,
    resolved: true
  }
];

const PREDICTIONS: Prediction[] = [
  {
    deviceId: "server-01",
    component: "HDD-1",
    failureProbability: 0.78,
    estimatedFailureTime: Date.now() + 604800000,
    recommendedAction: "Schedule replacement within 7 days",
    confidence: 0.85
  }
];

function generateHTML(title: string, content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background-color: #0a0a0f;
            color: #f8fafc;
            font-family: monospace;
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        header {
            border-bottom: 2px solid #e11d48;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        h1 {
            color: #e11d48;
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #94a3b8;
            font-size: 1.1rem;
        }
        .content {
            background-color: #1e1e2e;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 30px;
            border-left: 4px solid #e11d48;
        }
        .endpoint {
            background-color: #0f172a;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
            border: 1px solid #334155;
        }
        .method {
            color: #e11d48;
            font-weight: bold;
            display: inline-block;
            margin-right: 10px;
        }
        .path {
            color: #60a5fa;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #334155;
            color: #64748b;
            font-size: 0.9rem;
        }
        .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            margin-left: 10px;
        }
        .status-operational { background-color: #065f46; color: #6ee7b7; }
        .status-warning { background-color: #92400e; color: #fbbf24; }
        .status-critical { background-color: #7f1d1d; color: #fca5a5; }
        pre {
            background-color: #0f172a;
            padding: 15px;
            border-radius: 6px;
            overflow-x: auto;
            margin: 15px 0;
            border: 1px solid #334155;
        }
        code {
            color: #cbd5e1;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Metal Sentinel</h1>
            <div class="subtitle">Hardware Health Monitoring & Predictive Maintenance</div>
        </header>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <div>Metal Sentinel v1.0</div>
            <div style="margin-top: 5px;">Hardware Health Monitoring System</div>
        </div>
    </div>
</body>
</html>`;
}

function generateHealthHTML(deviceId: string, health: DeviceHealth): string {
  const getTempStatus = (temp: number) => {
    if (temp > 80) return "<span class='status status-critical'>CRITICAL</span>";
    if (temp > 70) return "<span class='status status-warning'>WARNING</span>";
    return "<span class='status status-operational'>NORMAL</span>";
  };

  const getMemoryStatus = (pressure: number) => {
    if (pressure > 85) return "<span class='status status-critical'>CRITICAL</span>";
    if (pressure > 70) return "<span class='status status-warning'>WARNING</span>";
    return "<span class='status status-operational'>NORMAL</span>";
  };

  return `
<h2>Device Health: ${deviceId}</h2>
<div style="margin-top: 20px;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
        <div>
            <h3 style="color: #e11d48; margin-bottom: 10px;">Temperature</h3>
            <div style="font-size: 2rem; font-weight: bold;">${health.temperature}°C ${getTempStatus(health.temperature)}</div>
        </div>
        <div>
            <h3 style="color: #e11d48; margin-bottom: 10px;">Power Usage</h3>
            <div style="font-size: 2rem; font-weight: bold;">${health.powerUsage}W</div>
        </div>
        <div>
            <h3 style="color: #e11d48; margin-bottom: 10px;">Memory Pressure</h3>
            <div style="font-size: 2rem; font-weight: bold;">${health.memoryPressure}% ${getMemoryStatus(health.memoryPressure)}</div>
        </div>
        <div>
            <h3 style="color: #e11d48; margin-bottom: 10px;">Disk Health</h3>
            <div style="font-size: 2rem; font-weight: bold;">${health.diskHealth}%</div>
        </div>
    </div>
    <div style="margin-top: 30px;">
        <h3 style="color: #e11d48; margin-bottom: 10px;">Additional Information</h3>
        <div>Uptime: ${Math.floor(health.uptime / 3600)} hours</div>
        <div>Last Updated: ${new Date(health.timestamp).toLocaleString()}</div>
    </div>
</div>`;
}

function generateAlertsHTML(alerts: Alert[]): string {
  const severityColors = {
    low: "#3b82f6",
    medium: "#f59e0b",
    high: "#ef4444",
    critical: "#7f1d1d"
  };

  const alertItems = alerts.map(alert => `
<div style="padding: 15px; background-color: #0f172a; border-radius: 6px; margin-bottom: 10px; border-left: 4px solid ${severityColors[alert.severity]};">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
            <strong style="color: ${severityColors[alert.severity]};">${alert.severity.toUpperCase()}</strong>
            <span style="margin-left: 10px; color: #94a3b8;">${alert.type}</span>
        </div>
        <div style="color: #64748b; font-size: 0.9rem;">
            ${new Date(alert.timestamp).toLocaleString()}
            ${alert.resolved ? '<span style="margin-left: 10px; color: #10b981;">✓ RESOLVED</span>' : '<span style="margin-left: 10px; color: #e11d48;">● ACTIVE</span>'}
        </div>
    </div>
    <div style="margin-top: 10px; color: #cbd5e1;">
        <strong>Device:</strong> ${alert.deviceId}<br>
        <strong>Message:</strong> ${alert.message}
    </div>
</div>`).join('');

  return `
<h2>Active Alerts</h2>
<div style="margin-top: 20px;">
    ${alertItems || '<div style="color: #94a3b8; text-align: center; padding: 40px;">No active alerts</div>'}
</div>`;
}

function generatePredictionsHTML(predictions: Prediction[]): string {
  const predictionItems = predictions.map(pred => `
<div style="padding: 20px; background-color: #0f172a; border-radius: 6px; margin-bottom: 15px; border: 1px solid #334155;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <div>
            <h3 style="color: #e11d48; margin-bottom: 5px;">${pred.deviceId} - ${pred.component}</h3>
            <div style="color: #94a3b8;">Failure Probability: <strong style="color: ${pred.failureProbability > 0.7 ? '#ef4444' : '#f59e0b'};">${(pred.failureProbability * 100).toFixed(1)}%</strong></div>
        </div>
        <div style="color: #64748b; font-size: 0.9rem;">
            Confidence: ${(pred.confidence * 100).toFixed(0)}%
        </div>
    </div>
    <div style="background-color: #1e293b; padding: 10px; border-radius: 4px; margin: 10px 0;">
        <strong style="color: #cbd5e1;">Recommended Action:</strong><br>
        ${pred.recommendedAction}
    </div>
    <div style="color: #94a3b8; font-size: 0.9rem;">
        Estimated Failure: ${new Date(pred.estimatedFailureTime).toLocaleDateString()}
    </div>
</div>`).join('');

  return `
<h2>Predictive Failure Analysis</h2>
<div style="margin-top: 20px;">
    ${predictionItems || '<div style="color: #94a3b8; text-align: center; padding: 40px;">No predictive failures detected</div>'}
</div>`;
}

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === "/" || path === "/health") {
    const content = `
<h2>Metal Sentinel API</h2>
<p style="margin: 15px 0; color: #cbd5e1;">Hardware health monitoring and predictive maintenance system</p>
<div style="margin-top: 25px;">
    <h3 style="color: #e11d48; margin-bottom: 15px;">Available Endpoints</h3>
    <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/health/:device</span>
        <div style="margin-top: 8px; color: #94a3b8;">Get health metrics for specific device</div>
    </div>
    <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/alerts</span>
        <div style="margin-top: 8px; color: #94a3b8;">Get active and historical alerts</div>
    </div>
    <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/predictions</span>
        <div style="margin-top: 8px; color: #94a3b8;">Get predictive failure analysis</div>
    </div>
</div>
<div style="margin-top: 30px;">
    <h3 style="color: #e11d48; margin-bottom: 15px;">Example Usage</h3>
    <pre><code>// Get device health
fetch('/api/health/server-01')
  .then(res => res.json())
  .then(data => console.log(data))</code></pre>
</div>`;
    return new Response(generateHTML("Metal Sentinel - Dashboard", content), {
      headers: { "Content-Type": "text/html" }
    });
  }

  if (path.startsWith("/api/health/")) {
    const deviceId = path.split("/").pop();
    
    if (!deviceId || !DEVICE_DATA[deviceId]) {
      return new Response(JSON.stringify({ error: "Device not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(DEVICE_DATA[deviceId]), {
      headers: { 
        "Content-Type": "application/json",
        "Content-Security-Policy": "default-src 'self'",
        "X-Frame-Options": "DENY"
      }
    });
  }

  if (path === "/api/alerts") {
    const activeAlerts = ALERTS.filter(alert => !alert.resolved);
    const resolvedAlerts = ALERTS.filter(alert => alert.resolved);
    
    const response = {
      active: activeAlerts,
      resolved: resolvedAlerts,
      total: ALERTS.length,
      activeCount: activeAlerts.length,
      lastUpdated: Date.now()
    };

    return new Response(JSON.stringify(response), {
      headers: { 
        "Content-Type": "application/json",
        "Content-Security-Policy": "default-src 'self'",
        "X-Frame-Options": "DENY"
      }
    });
  }

  if (path === "/api/predictions") {
    const response = {
      predictions: PREDICTIONS,
      total: PREDICTIONS.length,
      highRisk: PREDICTIONS.filter(p => p.failureProbability > 0.7).length,
      lastUpdated: Date.now()
    };

    return new Response(JSON.stringify(response), {
      headers: { 
        "Content-Type": "application/json",
        "Content-Security-Policy": "default-src 'self'",
        "X-Frame-Options": "DENY"
      }
    });
  }

  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers: { 
      "Content-Type": "application/json",
      "Content-Security-Policy": "default-src 'self'",
      "X-Frame-Options": "DENY"
    }
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    return handleRequest(request);
  }
};
