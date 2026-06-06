import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getBrowserInstance } from './browser.manager';
import { getAuditState, getStopConfig, checkStopSignals } from './audit.state';

const ignoredExtensions = [
  '.pdf', '.jpg', '.jpeg', '.png', '.gif', '.zip', '.rar', 
  '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', 
  '.mp3', '.mp4', '.avi', '.svg', '.dmg', '.pkg', '.exe'
];

export const discoverLinksTool = createTool({
  id: 'discoverLinks',
  description: 'Discover and enqueue internal links from the current page belonging to the same origin.',
  inputSchema: z.object({
    url: z.string().url().describe('The URL of the webpage to scrape for links.'),
  }),
  outputSchema: z.object({
    newLinksCount: z.number().describe('Number of new internal links added to the queue.'),
    totalQueued: z.number().describe('Total number of items in the queue.'),
    newLinks: z.array(z.string()).describe('List of discovered and enqueued links.'),
    stopped: z.boolean().describe('Whether crawling has stopped.'),
  }),
  execute: async ({ url }) => {
    const state = getAuditState();
    const config = getStopConfig();

    // Check stop signals first
    const stopReason = checkStopSignals(state, config);
    if (stopReason) {
      state.stopped = stopReason;
      return {
        newLinksCount: 0,
        totalQueued: state.queue.length,
        newLinks: [],
        stopped: true,
      };
    }

    try {
      const stagehand = await getBrowserInstance();
      const page = stagehand.context.pages()[0];
      if (!page) {
        throw new Error('No page is currently open in the browser.');
      }

      // Extract all hrefs from anchors
      const hrefs = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a'));
        return anchors.map(a => a.href).filter(Boolean);
      });

      const currentOrigin = new URL(url).origin;
      const nextDepth = state.currentDepth + 1;
      const newlyEnqueued: string[] = [];

      // Only enqueue links if we are below or at max depth
      if (nextDepth <= config.maxDepth) {
        for (const href of hrefs) {
          try {
            const parsed = new URL(href, url); // resolve relative links
            
            // Canonicalize by removing the anchor/hash
            parsed.hash = '';
            
            // Only follow same origin links (avoid crawling external sites)
            if (parsed.origin !== currentOrigin) {
              continue;
            }

            const cleanedUrl = parsed.toString();

            // Ignore files with non-HTML extensions (like PDFs, images, etc.)
            const hasIgnoredExtension = ignoredExtensions.some(ext => cleanedUrl.toLowerCase().endsWith(ext));
            if (hasIgnoredExtension) {
              continue;
            }

            // Exclude already visited pages and pages already in the queue
            const isVisited = state.visited.includes(cleanedUrl);
            const isQueued = state.queue.some(item => item.url === cleanedUrl);

            if (!isVisited && !isQueued) {
              state.queue.push({ url: cleanedUrl, depth: nextDepth });
              newlyEnqueued.push(cleanedUrl);
            }
          } catch (e) {
            // Ignore invalid URLs
          }
        }
      }

      return {
        newLinksCount: newlyEnqueued.length,
        totalQueued: state.queue.length,
        newLinks: newlyEnqueued,
        stopped: false,
      };

    } catch (err) {
      console.error(`[discoverLinks] Error discovering links on page ${url}:`, err);
      return {
        newLinksCount: 0,
        totalQueued: state.queue.length,
        newLinks: [],
        stopped: false,
      };
    }
  },
});
