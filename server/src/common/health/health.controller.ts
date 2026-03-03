import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import type { Response } from 'express';

/**
 * Health Controller
 * Returns an HTML page with server and database status
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check', description: 'Returns an HTML page with server and database status' })
  @ApiResponse({ status: 200, description: 'Health check page' })
  async check(@Res() res: Response) {

    // Lightweight query to simply check if database is reachable
    let dbHealthy = false;
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbHealthy = true;
    } catch {}

    const uptime = Math.floor(process.uptime());
    const uptimeStr = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${uptime % 60}s`;
    const serverHealthy = true;
    const allHealthy = serverHealthy && dbHealthy;

    const badge = allHealthy
      ? `<span class="badge badge-ok">Healthy</span>`
      : `<span class="badge badge-err">Degraded</span>`;

    const dot = allHealthy
      ? `<div class="dot dot-ok"></div>`
      : `<div class="dot dot-err"></div>`;

    const statusCell = (ok: boolean) => ok
      ? `<span class="status-ok">OK</span>`
      : `<span class="status-err">Unavailable</span>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ExplAIner — Health</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: hsl(210 20% 99%);
      color: hsl(222.2 84% 4.9%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: hsl(0 0% 100%);
      border: 1px solid hsl(270 30% 90%);
      border-radius: 1rem;
      padding: 40px 48px;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 4px 24px hsla(250 83% 53% / 0.08);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 32px;
    }
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .dot-ok  { background: hsl(142 76% 36%); box-shadow: 0 0 0 4px hsla(142 76% 36% / 0.2); }
    .dot-err { background: hsl(0 84.2% 60.2%); box-shadow: 0 0 0 4px hsla(0 84.2% 60.2% / 0.2); }
    h1 { font-size: 1.4rem; font-weight: 700; }
    h1 span { color: hsl(250 83% 53%); }
    .badge {
      margin-left: auto;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 999px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .badge-ok  { background: hsla(142 76% 36% / 0.1);  color: hsl(142 76% 36%); }
    .badge-err { background: hsla(0 84.2% 60.2% / 0.1); color: hsl(0 84.2% 60.2%); }
    table { width: 100%; border-collapse: collapse; }
    tr:not(:last-child) td { border-bottom: 1px solid hsl(270 30% 90%); }
    td { padding: 12px 0; font-size: 0.9rem; }
    td:first-child { color: hsl(215.4 16.3% 46.9%); width: 45%; }
    td:last-child { font-weight: 500; }
    .status-ok  { color: hsl(142 76% 36%); }
    .status-err { color: hsl(0 84.2% 60.2%); }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      ${dot}
      <h1>Expl<span>AI</span>ner</h1>
      ${badge}
    </div>
    <table>
      <tr><td>Environment</td><td>${this.configService.get('nodeEnv')}</td></tr>
      <tr><td>Server Status</td><td>${statusCell(serverHealthy)}</td></tr>
      <tr><td>Server Uptime</td><td>${uptimeStr}</td></tr>
      <tr><td>Database Status</td><td>${statusCell(dbHealthy)}</td></tr>
    </table>
  </div>
</body>
</html>`);
  }
}
