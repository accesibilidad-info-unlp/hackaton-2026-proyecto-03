import { Stagehand } from '@browserbasehq/stagehand';
import fs from 'fs';
import { mastraEnv } from '../../shared/config/env';

let stagehandInstance: Stagehand | null = null;

export async function getBrowserInstance(): Promise<Stagehand> {
  if (!stagehandInstance) {
    const localChromePath = '/home/nehuen/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome';
    const hasLocalChrome = fs.existsSync(localChromePath);

    stagehandInstance = new Stagehand({
      env: 'LOCAL',
      verbose: 0,
      disablePino: true,
      model: {
        modelName: 'deepseek/deepseek-v4-flash',
        apiKey: mastraEnv.DEEPSEEK_API_KEY,
      },
      localBrowserLaunchOptions: {
        headless: true,
        ...(hasLocalChrome ? { executablePath: localChromePath } : {}),
      }
    });
    await stagehandInstance.init();
  }
  return stagehandInstance;
}

export async function closeBrowserInstance(): Promise<void> {
  if (stagehandInstance) {
    try {
      await stagehandInstance.close();
    } catch (err) {
      console.error('Error closing browser instance:', err);
    }
    stagehandInstance = null;
  }
}
