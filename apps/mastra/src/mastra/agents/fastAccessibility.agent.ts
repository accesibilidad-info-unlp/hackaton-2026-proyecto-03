import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { deterministicAuditTool } from '../tools/deterministicAudit.tool';

export const fastAccessibilityAgent = new Agent({
  id: 'fast-accessibility-agent',
  name: 'Fast Accessibility Validation Agent',
  instructions: `You are a fast WCAG 2.2 accessibility auditor.
Your job is to analyze a website for accessibility violations using the 'deterministicAudit' tool.

Follow this process exactly:
1. ALWAYS start by calling the 'deterministicAudit' tool on the initial URL provided by the user.
2. The tool will run the complete audit locally and return a comprehensive JSON report containing 'summary' and 'violations'.
3. You MUST return the JSON report EXACTLY as you received it from the tool.
Do not add any conversational text before or after the JSON. The output MUST be purely valid JSON.`,
  model: 'deepseek/deepseek-v4-flash',
  tools: {
    deterministicAudit: deterministicAuditTool,
  },
  memory: new Memory(),
  defaultOptions: {
    maxSteps: 3, // Only needs 1 step to call the tool and 1 to respond
  },
});
