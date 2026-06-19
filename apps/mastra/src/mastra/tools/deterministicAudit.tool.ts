import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import fs from 'fs';
import crypto from 'crypto';
import { createRequire } from 'module';
import { getBrowserInstance, closeBrowserInstance } from './browser.manager';
import { Finding } from '../../types/audit.types';
import { getAffectedDisabilities, translateRule } from '../utils/disabilityMapper';

const ignoredExtensions = [
  '.pdf', '.jpg', '.jpeg', '.png', '.gif', '.zip', '.rar', 
  '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', 
  '.mp3', '.mp4', '.avi', '.svg', '.dmg', '.pkg', '.exe'
];

export const deterministicAuditTool = createTool({
  id: 'deterministicAudit',
  description: 'Performs a deterministic, fast local BFS crawl and accessibility audit up to maxPages limits without using LLM recursion.',
  inputSchema: z.object({
    url: z.string().url().describe('Initial URL to start crawling and auditing.'),
    maxPages: z.number().optional().default(3).describe('Maximum number of pages to visit in this audit session.'),
    maxDepth: z.number().optional().default(2).describe('Maximum depth for the BFS crawl.')
  }),
  outputSchema: z.any(),
  execute: async ({ url, maxPages = 3, maxDepth = 2 }) => {
    const queue = [{ url, depth: 0 }];
    const visited: string[] = [];
    const findings: Finding[] = [];
    const startTime = Date.now();
    let stoppedReason = 'completed';

    try {
      const stagehand = await getBrowserInstance();
      const page = stagehand.context.pages()[0] || await stagehand.context.newPage();

      // Ensure we have axe-core source ready
      const require = createRequire(import.meta.url);
      const axePath = require.resolve('axe-core/axe.min.js');
      const axeSource = fs.readFileSync(axePath, 'utf8');

      while (queue.length > 0 && visited.length < maxPages) {
        const currentItem = queue.shift();
        if (!currentItem) break;

        const currentUrl = currentItem.url;
        if (visited.includes(currentUrl)) continue;

        visited.push(currentUrl);

        try {
          await page.goto(currentUrl, { waitUntil: 'domcontentloaded', timeoutMs: 30000 });
          // Short wait for hydration/SPA
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Inject axe
          await page.evaluate((source) => {
            const script = document.createElement('script');
            script.text = source;
            document.head.appendChild(script);
          }, axeSource);

          // Run axe
          const axeResult = await page.evaluate(() => {
            // @ts-ignore
            if (typeof window.axe === 'undefined') return null;
            // @ts-ignore
            return window.axe.run();
          });

          if (axeResult && axeResult.violations) {
            for (const violation of axeResult.violations) {
              for (const node of violation.nodes) {
                const selector = node.target.join(' ');
                const html = node.html || '';

                const hashInput = `${violation.id}:${selector}:${currentUrl}`;
                const hash = crypto.createHash('sha256').update(hashInput).digest('hex').slice(0, 16);

                const translation = translateRule(violation.id, violation.description);

                findings.push({
                  id: hash,
                  ruleId: violation.id,
                  impact: violation.impact,
                  selector,
                  html,
                  url: currentUrl,
                  description: violation.description,
                  helpUrl: violation.helpUrl,
                  tags: violation.tags || [],
                  disabilities: getAffectedDisabilities(violation.id, violation.tags || []),
                  translatedName: translation.name,
                  translatedDescription: translation.description,
                });
              }
            }
          }

          // Discover links if depth allows
          if (currentItem.depth < maxDepth) {
            const hrefs = await page.evaluate(() => {
              const anchors = Array.from(document.querySelectorAll('a'));
              return anchors.map(a => a.href).filter(Boolean);
            });

            const currentOrigin = new URL(url).origin;
            for (const href of hrefs) {
              try {
                const parsed = new URL(href, currentUrl);
                parsed.hash = '';
                if (parsed.origin !== currentOrigin) continue;

                const cleanedUrl = parsed.toString();
                const hasIgnoredExtension = ignoredExtensions.some(ext => cleanedUrl.toLowerCase().endsWith(ext));
                if (hasIgnoredExtension) continue;

                const isVisited = visited.includes(cleanedUrl);
                const isQueued = queue.some(item => item.url === cleanedUrl);

                if (!isVisited && !isQueued) {
                  queue.push({ url: cleanedUrl, depth: currentItem.depth + 1 });
                }
              } catch (e) {
                // Ignore invalid urls
              }
            }
          }
        } catch (err) {
          console.error(`Error analyzing ${currentUrl}:`, err);
        }
      }

      if (visited.length >= maxPages && queue.length > 0) {
        stoppedReason = 'max_pages';
      }

    } catch (err: any) {
      stoppedReason = 'browser_crash';
      console.error('Audit crashed:', err);
    } finally {
      await closeBrowserInstance();
    }

    const durationMs = Date.now() - startTime;
    const severityBreakdown = { critical: 0, serious: 0, moderate: 0, minor: 0 };
    const byPage: Record<string, number> = {};
    const byRule: Record<string, number> = {};

    for (const finding of findings) {
      const impact = finding.impact;
      if (impact === 'critical' || impact === 'serious' || impact === 'moderate' || impact === 'minor') {
        severityBreakdown[impact]++;
      }
      byPage[finding.url] = (byPage[finding.url] || 0) + 1;
      byRule[finding.ruleId] = (byRule[finding.ruleId] || 0) + 1;
    }

    return {
      summary: {
        totalPagesVisited: visited.length,
        totalViolations: findings.length,
        severityBreakdown,
      },
      violations: findings,
      byPage,
      byRule,
      stopReason: stoppedReason,
      durationMs,
    };
  },
});
