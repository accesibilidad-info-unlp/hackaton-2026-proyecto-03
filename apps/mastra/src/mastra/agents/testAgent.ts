import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { deterministicAuditTool } from '../tools/deterministicAudit.tool';

export const testAgent = new Agent({
  id: 'test-agent',
  name: 'Test Agent',
  instructions: `You are a test agent for demonstration purposes.`,
  model: 'deepseek/deepseek-v4-flash',
  tools: {
  }
});