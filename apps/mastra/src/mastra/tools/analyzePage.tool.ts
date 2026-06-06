import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createRequire } from 'module';
import { getBrowserInstance } from './browser.manager';
import { getAuditState, initAuditState, getStopConfig, checkStopSignals } from './audit.state';
import { Finding } from '../../types/audit.types';
import { getAffectedDisabilities, translateRule } from '../utils/disabilityMapper';

export const analyzePageTool = createTool({
  id: 'analyzePage',
  description: 'Analyze a single page for WCAG 2.2 accessibility violations using axe-core.',
  inputSchema: z.object({
    url: z.string().url().describe('The URL of the webpage to analyze.'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    stopReason: z.string().nullable().describe('The stop reason if any limit has been reached, otherwise null.'),
    violationsCount: z.number().describe('Number of violations found on this page.'),
    currentDepth: z.number().describe('The depth level of the current page.'),
    visitedCount: z.number().describe('Total pages visited so far.'),
    queueCount: z.number().describe('Number of pages remaining in the queue.'),
    message: z.string(),
  }),
  execute: async ({ url }) => {
    let state;
    try {
      state = getAuditState();
      // If the URL is not in the queue, it's a new audit crawl session. Reset the state.
      if (!state.queue.some(item => item.url === url)) {
        state = initAuditState(url);
      }
    } catch (e) {
      // Initialize if not already initialized
      state = initAuditState(url);
    }

    const config = getStopConfig();

    // Check stop signals before starting navigation
    let stopReason = checkStopSignals(state, config);
    if (stopReason) {
      state.stopped = stopReason;
      return {
        success: false,
        stopReason,
        violationsCount: 0,
        currentDepth: state.currentDepth,
        visitedCount: state.visited.length,
        queueCount: state.queue.length,
        message: `Audit stopped due to limit: ${stopReason}`,
      };
    }

    // Resolve depth of this URL
    const queueItem = state.queue.find(item => item.url === url);
    const depth = queueItem ? queueItem.depth : state.currentDepth;
    state.currentDepth = depth;

    // Track visited and remove from queue
    if (!state.visited.includes(url)) {
      state.visited.push(url);
    }
    state.queue = state.queue.filter(item => item.url !== url);

    try {
      const stagehand = await getBrowserInstance();
      const page = stagehand.context.pages()[0] || await stagehand.context.newPage();

      // Navigate to the target URL
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeoutMs: 30000 });
        // Wait an extra 2 seconds to allow client-side hydration/rendering to settle
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (gotoErr: any) {
        console.warn(`[analyzePage] Navigation warning or timeout for ${url}, trying to analyze anyway:`, gotoErr?.message || gotoErr);
      }

      // Read axe-core source file
      const require = createRequire(import.meta.url);
      const axePath = require.resolve('axe-core/axe.min.js');
      const axeSource = fs.readFileSync(axePath, 'utf8');

      // Inject axe-core script source
      await page.evaluate((source) => {
        const script = document.createElement('script');
        script.text = source;
        document.head.appendChild(script);
      }, axeSource);

      // Run axe-core analysis inside the page context
      const axeResult = await page.evaluate(() => {
        // @ts-ignore
        if (typeof window.axe === 'undefined') {
          return null;
        }
        // @ts-ignore
        return window.axe.run();
      });

      if (!axeResult) {
        throw new Error('axe-core was not injected properly or failed to execute.');
      }

      let pageViolationsCount = 0;
      if (axeResult.violations && Array.isArray(axeResult.violations)) {
        for (const violation of axeResult.violations) {
          for (const node of violation.nodes) {
            const selector = node.target.join(' ');
            const html = node.html || '';

            // Generate stable hash ID for each finding
            const hashInput = `${violation.id}:${selector}:${url}`;
            const hash = crypto.createHash('sha256').update(hashInput).digest('hex').slice(0, 16);

            const translation = translateRule(violation.id, violation.description);

            const finding: Finding = {
              id: hash,
              ruleId: violation.id,
              impact: violation.impact,
              selector,
              html,
              url,
              description: violation.description,
              helpUrl: violation.helpUrl,
              tags: violation.tags || [],
              disabilities: getAffectedDisabilities(violation.id, violation.tags || []),
              translatedName: translation.name,
              translatedDescription: translation.description,
            };

            state.findings.push(finding);
            pageViolationsCount++;
          }
        }
      }

      // Check stop signals again after processing
      stopReason = checkStopSignals(state, config);
      if (stopReason) {
        state.stopped = stopReason;
      }

      return {
        success: true,
        stopReason: state.stopped,
        violationsCount: pageViolationsCount,
        currentDepth: state.currentDepth,
        visitedCount: state.visited.length,
        queueCount: state.queue.length,
        message: `Successfully analyzed ${url}. Found ${pageViolationsCount} violations.`,
      };

    } catch (err: any) {
      console.error(`[analyzePage] Error loading/evaluating page ${url}:`, err);
      state.stopped = 'browser_crash';
      return {
        success: false,
        stopReason: 'browser_crash',
        violationsCount: 0,
        currentDepth: state.currentDepth,
        visitedCount: state.visited.length,
        queueCount: state.queue.length,
        message: `Failed to analyze page ${url}: ${err?.message || err}`,
      };
    }
  },
});
