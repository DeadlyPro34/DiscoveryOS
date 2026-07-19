/**
 * Multi-Agent System Usage Examples.
 * Demonstrates how to use the multi-agent intelligence engine.
 */

import { AgentInput } from '@/types/ai/agent';
import {
  multiAgentOrchestrator,
  MultiAgentOrchestrator,
} from '@/services/ai/orchestrator';
import { agentRegistry } from '@/services/ai/agents';

/**
 * Example 1: Basic Pipeline Execution
 * Execute the complete 10-agent pipeline on user research content.
 */
export async function exampleBasicPipelineExecution() {
  console.log('📊 Example 1: Basic Pipeline Execution\n');

  // Create input from user research
  const input: AgentInput = {
    requestId: 'example-001',
    content: `
      "I've been using your product for 3 months. The authentication system is 
      confusing - I can never remember if I should use email or username. Also, 
      the performance when loading large datasets is really slow. On the positive 
      side, your API is excellent and well-documented. I wish there was a better 
      way to manage team permissions though."
    `,
    parameters: {
      documentType: 'feedback',
      language: 'en',
    },
  };

  // Execute pipeline
  try {
    console.log('🚀 Starting pipeline execution...\n');
    const context = await multiAgentOrchestrator.executePipeline(
      input,
      'workflow-example-001',
    );

    // Log results
    console.log(`✅ Pipeline Completed in ${context.totalExecutionTime}ms\n`);
    console.log('Agent Results:');
    context.results.forEach((result) => {
      console.log(
        `  ${result.agentName}: ${result.status} (${result.executionTimeMs}ms, confidence: ${(result.confidenceScore * 100).toFixed(1)}%)`,
      );
    });

    if (context.errors.length > 0) {
      console.log('\n⚠️ Errors:');
      context.errors.forEach((error) => {
        console.log(`  ${error.agentId}: ${error.error}`);
      });
    }

    return context;
  } catch (error) {
    console.error('❌ Pipeline execution failed:', error);
  }
}

/**
 * Example 2: Individual Agent Execution
 * Execute a single agent with custom input.
 */
export async function exampleIndividualAgentExecution() {
  console.log('\n📌 Example 2: Individual Agent Execution\n');

  // Get the Insight Agent
  const insightAgent = agentRegistry.getAgent('insight-agent');
  if (!insightAgent) {
    console.error('Agent not found');
    return;
  }

  const input: AgentInput = {
    requestId: 'example-002',
    content:
      'The dashboard is too cluttered. We need better filtering options. Performance is slow on mobile.',
  };

  try {
    console.log(`🎯 Executing ${insightAgent.name}...\n`);
    const result = await insightAgent.execute(input);

    console.log(`Status: ${result.status}`);
    console.log(`Confidence: ${(result.confidenceScore * 100).toFixed(1)}%`);
    console.log(`Output:`, JSON.stringify(result.output?.result, null, 2));
  } catch (error) {
    console.error('❌ Agent execution failed:', error);
  }
}

/**
 * Example 3: Pipeline with Retry Support
 * Execute pipeline with automatic retry on failure.
 */
export async function examplePipelineWithRetry() {
  console.log('\n🔄 Example 3: Pipeline with Retry Support\n');

  const input: AgentInput = {
    requestId: 'example-003',
    content:
      'Complex user research data requiring robust processing with potential retry...',
  };

  try {
    console.log('🚀 Starting pipeline with retry support (max 2 retries)...\n');
    const context = await multiAgentOrchestrator.executePipelineWithRetry(
      input,
      'workflow-example-003',
      2,
    );

    console.log(
      `Completed: ${context.results.length}/${multiAgentOrchestrator.getPipelineConfig().agents.length} agents`,
    );
    console.log(`Total time: ${context.totalExecutionTime}ms`);

    return context;
  } catch (error) {
    console.error('❌ Failed:', error);
  }
}

/**
 * Example 4: Accessing Agent Metadata
 * Get information about all registered agents.
 */
export function exampleAgentMetadata() {
  console.log('\n📚 Example 4: Accessing Agent Metadata\n');

  const allAgents = agentRegistry.getAllAgents();
  const allMetadata = agentRegistry.getAllMetadata();

  console.log(`Total Agents: ${allAgents.length}\n`);

  allMetadata.forEach((metadata) => {
    console.log(`${metadata.icon} ${metadata.name}`);
    console.log(`  ID: ${metadata.id}`);
    console.log(`  Category: ${metadata.category}`);
    console.log(`  Description: ${metadata.description}`);
    console.log(`  Version: ${metadata.version}`);
    console.log();
  });
}

/**
 * Example 5: Custom Pipeline Configuration
 * Create a custom pipeline with specific agents in a different order.
 */
export async function exampleCustomPipeline() {
  console.log('\n🎨 Example 5: Custom Pipeline Configuration\n');

  // Create custom orchestrator with different agent order
  const customOrchestrator = new MultiAgentOrchestrator({
    name: 'Custom Analysis Pipeline',
    description: 'Focused on sentiment and opportunities',
    agents: [
      'collector-agent',
      'sentiment-agent',
      'frequency-agent',
      'impact-agent',
      'opportunity-agent',
    ],
    passOutputToNext: true,
  });

  const input: AgentInput = {
    requestId: 'example-005',
    content: 'User research content for custom pipeline...',
  };

  try {
    console.log('🚀 Executing custom pipeline...\n');
    const context = await customOrchestrator.executePipeline(
      input,
      'workflow-example-005',
    );

    console.log(
      `✅ Custom Pipeline Completed with ${context.results.length} agents`,
    );
    context.results.forEach((result) => {
      console.log(
        `  ✓ ${result.agentName} (${result.executionTimeMs}ms)`,
      );
    });

    return context;
  } catch (error) {
    console.error('❌ Custom pipeline failed:', error);
  }
}

/**
 * Example 6: Process Multiple Documents
 * Execute the pipeline on multiple documents in sequence.
 */
export async function exampleProcessMultipleDocuments() {
  console.log('\n📁 Example 6: Process Multiple Documents\n');

  const documents = [
    {
      id: 'doc-001',
      content: 'First user feedback...',
    },
    {
      id: 'doc-002',
      content: 'Second user feedback...',
    },
    {
      id: 'doc-003',
      content: 'Third user feedback...',
    },
  ];

  console.log(`🔄 Processing ${documents.length} documents...\n`);

  const results = [];

  for (const doc of documents) {
    try {
      const input: AgentInput = {
        requestId: doc.id,
        content: doc.content,
      };

      const context = await multiAgentOrchestrator.executePipeline(
        input,
        `workflow-${doc.id}`,
      );
      results.push({
        documentId: doc.id,
        success: context.errors.length === 0,
        agentsRun: context.results.length,
        totalTime: context.totalExecutionTime,
      });

      console.log(
        `✓ ${doc.id}: ${context.results.length} agents in ${context.totalExecutionTime}ms`,
      );
    } catch (error) {
      results.push({
        documentId: doc.id,
        success: false,
        error: String(error),
      });
      console.log(`✗ ${doc.id}: Failed`);
    }
  }

  console.log(`\n📊 Summary: ${results.filter((r) => r.success).length}/${documents.length} successful`);

  return results;
}

/**
 * Run all examples.
 */
export async function runAllExamples() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   Multi-Agent Intelligence Engine - Usage Examples');
  console.log('═══════════════════════════════════════════════════════════');

  try {
    // Example 4 (synchronous)
    exampleAgentMetadata();

    // Example 1
    await exampleBasicPipelineExecution();

    // Example 2
    await exampleIndividualAgentExecution();

    // Example 3
    await examplePipelineWithRetry();

    // Example 5
    await exampleCustomPipeline();

    // Example 6
    await exampleProcessMultipleDocuments();

    console.log(
      '\n═══════════════════════════════════════════════════════════',
    );
    console.log('   All Examples Completed');
    console.log('═══════════════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Example execution failed:', error);
  }
}
