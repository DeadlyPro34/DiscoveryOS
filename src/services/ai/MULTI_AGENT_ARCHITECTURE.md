/**
 * MULTI-AGENT INTELLIGENCE ENGINE - COMPREHENSIVE DOCUMENTATION
 * 
 * DiscoveryOS Multi-Agent System Architecture
 * 
 * ============================================================================
 * 1. SYSTEM OVERVIEW
 * ============================================================================
 * 
 * The Multi-Agent Intelligence Engine is a 10-agent orchestrated system that
 * transforms raw user research into actionable product intelligence.
 * 
 * Pipeline Flow:
 * 1. CollectorAgent   → Normalize documents, extract metadata, assess quality
 * 2. InsightAgent     → Extract pain points, features, bugs, praise
 * 3. ThemeAgent       → Cluster insights into themes (Auth, Billing, etc)
 * 4. PersonaAgent     → Identify user types (Developer, Enterprise, etc)
 * 5. SentimentAgent   → Classify sentiment (Positive, Negative, Mixed, Neutral)
 * 6. FrequencyAgent   → Count occurrences and identify patterns
 * 7. ImpactAgent      → Score business impact (0-10 scale)
 * 8. OpportunityAgent → Generate strategic opportunities
 * 9. PrioritizationAgent → RICE scoring and ranking
 * 10. PRDAgent        → Generate Product Requirements Document
 * 
 * ============================================================================
 * 2. ARCHITECTURE
 * ============================================================================
 * 
 * Directory Structure:
 * 
 * src/
 * ├── config/ai/prompts/
 * │   ├── promptTypes.ts          - Prompt template interfaces
 * │   ├── promptManager.ts         - Template rendering and substitution
 * │   ├── collectorPrompts.ts      - Collector agent prompts
 * │   ├── insightPrompts.ts        - Insight agent prompts
 * │   ├── agentPrompts.ts          - All other agent prompts
 * │   └── index.ts                 - Central export and initialization
 * │
 * ├── services/ai/
 * │   ├── agents/
 * │   │   ├── base/
 * │   │   │   └── baseAgent.ts     - Abstract base class with common logic
 * │   │   ├── implementations/
 * │   │   │   ├── collectorAgent.ts
 * │   │   │   ├── insightAgent.ts
 * │   │   │   ├── themeAgent.ts
 * │   │   │   ├── personaAgent.ts
 * │   │   │   ├── sentimentAgent.ts
 * │   │   │   ├── frequencyAgent.ts
 * │   │   │   ├── impactAgent.ts
 * │   │   │   ├── opportunityAgent.ts
 * │   │   │   ├── prioritizationAgent.ts
 * │   │   │   ├── prdAgent.ts
 * │   │   │   └── index.ts         - Export all agents
 * │   │   ├── registry/
 * │   │   │   └── agentRegistry.ts - Agent registration and discovery
 * │   │   └── index.ts             - Central export
 * │   │
 * │   └── orchestrator/
 * │       ├── orchestrator.ts      - Multi-agent pipeline orchestration
 * │       └── index.ts             - Export orchestrator
 * │
 * ├── lib/
 * │   ├── stores/
 * │   │   ├── agentMonitorStore.ts  - Zustand agent metrics store
 * │   │   ├── workflowResultsStore.ts - Zustand workflow results store
 * │   │   └── index.ts              - Central export
 * │   └── utils/ai/                 - AI utilities
 * │
 * ├── hooks/
 * │   ├── useAgentMonitor.ts        - Agent monitoring hooks
 * │   └── useWorkflowExecution.ts   - Workflow execution hooks
 * │
 * ├── types/ai/
 * │   ├── agent.ts                  - Core agent types
 * │   ├── agents.ts                 - Extended agent types
 * │   └── workflow.ts               - Workflow types
 * │
 * └── components/ai/                - React components (UI)
 *     ├── AgentMonitorPage.tsx
 *     ├── AgentCard.tsx
 *     └── ...
 * 
 * ============================================================================
 * 3. AGENT SPECIFICATIONS
 * ============================================================================
 * 
 * Each agent follows a standard interface (IAgent):
 * - id: Unique identifier
 * - name: Display name
 * - description: Human-readable description
 * - category: One of 'data-collection', 'analysis', 'insight', 'generation'
 * - icon: Emoji identifier
 * - version: Semantic version
 * - inputSchema: Zod validation schema for inputs
 * - outputSchema: Zod validation schema for outputs
 * - execute(input): Main execution method
 * - validate(input): Input validation
 * - computeConfidence(input): Confidence score calculation (0-1)
 * 
 * ============================================================================
 * 4. COLLECTOR AGENT
 * ============================================================================
 * 
 * Normalizes and prepares context from raw documents.
 * 
 * Input: Raw document content
 * Output:
 * {
 *   normalized_text: string,
 *   metadata: { characterCount, wordCount, sentenceCount, ... },
 *   entities: [ { type, value, confidence }, ... ],
 *   sensitive_data: [ "potential_ssn", ... ],
 *   quality_score: number (0-1),
 *   issues: [ "content_too_short", ... ]
 * }
 * 
 * Mock Implementation Features:
 * - Text normalization (remove artifacts, standardize formatting)
 * - Entity extraction (emails, dates, phones, URLs, names)
 * - Sensitive data detection (SSN, credit cards, API keys)
 * - Quality assessment (content length, completeness)
 * 
 * Confidence Factors:
 * - Content length > 500 chars: +0.2
 * - Content length > 100 chars: +0.1
 * - Context chunks available: +0.15
 * - Metadata provided: +0.05
 * - Base: 0.6
 * 
 * ============================================================================
 * 5. INSIGHT AGENT
 * ============================================================================
 * 
 * Extracts pain points, features, bugs, and other key insights.
 * 
 * Categories:
 * - PAIN_POINT: User frustration or problem
 * - FEATURE_REQUEST: Desired functionality
 * - BUG: Technical issue or defect
 * - PRAISE: Positive feedback
 * - WORKFLOW: Process or usage pattern
 * - OTHER: Other observations
 * 
 * Output:
 * {
 *   insights: [
 *     {
 *       category: string,
 *       quote: string,
 *       paraphrased: string,
 *       strength: 'strong' | 'medium' | 'weak',
 *       context?: string
 *     },
 *     ...
 *   ],
 *   summary: string,
 *   statistics: { total_insights, by_category, by_strength }
 * }
 * 
 * ============================================================================
 * 6. THEME AGENT
 * ============================================================================
 * 
 * Clusters insights into coherent themes.
 * 
 * Default Themes:
 * - Authentication (login, password, auth)
 * - Billing & Pricing (price, payment, subscription)
 * - Performance (speed, latency, load time)
 * - User Experience (UI, interface, design)
 * - Onboarding (setup, tutorial, first time)
 * - Integration (API, webhook, third party)
 * - Documentation (docs, guides, help)
 * - Support (help, contact, response time)
 * - Analytics (metrics, reporting, dashboard)
 * - Security (encrypt, compliance, audit)
 * 
 * ============================================================================
 * 7. PERSONA AGENT
 * ============================================================================
 * 
 * Identifies and characterizes user personas.
 * 
 * Built-in Personas:
 * - Developer: Technical, integration-focused
 * - Enterprise: Security-conscious, large team
 * - Student: Budget-conscious, learning-focused
 * - SMB Owner: Resource-constrained, growth-focused
 * - Product Manager: Data-driven, strategic
 * 
 * ============================================================================
 * 8. SENTIMENT AGENT
 * ============================================================================
 * 
 * Classifies sentiment as POSITIVE, NEGATIVE, NEUTRAL, or MIXED.
 * 
 * Output:
 * {
 *   overall_sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED',
 *   overall_score: number (-1 to 1),
 *   segments: [
 *     {
 *       text: string,
 *       sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL',
 *       score: number,
 *       indicators: [ "emotional_words", ... ]
 *     },
 *     ...
 *   ],
 *   distribution: { POSITIVE: ratio, NEGATIVE: ratio, NEUTRAL: ratio }
 * }
 * 
 * ============================================================================
 * 9. FREQUENCY AGENT
 * ============================================================================
 * 
 * Analyzes occurrence patterns and frequencies.
 * 
 * Output:
 * {
 *   frequency_analysis: { term: count, ... },
 *   top_topics: [ { term, count }, ... ],
 *   statistics: {
 *     total_mentions: number,
 *     unique_terms: number,
 *     average_frequency: number
 *   }
 * }
 * 
 * ============================================================================
 * 10. IMPACT AGENT
 * ============================================================================
 * 
 * Scores business impact on 0-10 scale using multi-factor analysis.
 * 
 * Scoring Factors (each 0-10):
 * - Urgency: How critical is this?
 * - Frequency: How often is it mentioned?
 * - User Count: How many users affected?
 * - Business Value: Strategic importance?
 * - Revenue Potential: Can we monetize?
 * - Risk Mitigation: Security/compliance value?
 * 
 * Weighted Score = (urgency*2 + frequency*2 + userCount*1.5 + value*2 + 
 *                    revenue*1 + risk*1) / 10
 * 
 * ============================================================================
 * 11. OPPORTUNITY AGENT
 * ============================================================================
 * 
 * Identifies and recommends actionable opportunities.
 * 
 * Output:
 * {
 *   opportunities: [
 *     {
 *       name: string,
 *       description: string,
 *       problems_solved: [ string, ... ],
 *       expected_impact: string,
 *       implementation_complexity: 'low' | 'medium' | 'high',
 *       recommended_priority: 'high' | 'medium' | 'low',
 *       potential_personas: [ string, ... ]
 *     },
 *     ...
 *   ],
 *   top_opportunities: [ string, ... ]
 * }
 * 
 * ============================================================================
 * 12. PRIORITIZATION AGENT
 * ============================================================================
 * 
 * Implements RICE scoring framework for prioritization.
 * 
 * RICE = (Reach × Impact × Confidence) / Effort
 * 
 * Where:
 * - Reach: Number of users affected per quarter
 * - Impact: User impact level (0.25-3)
 * - Confidence: Confidence in estimates (0-1)
 * - Effort: Person-months to implement
 * 
 * Higher RICE score = Higher priority
 * 
 * ============================================================================
 * 13. PRD AGENT
 * ============================================================================
 * 
 * Generates comprehensive Product Requirements Documents.
 * 
 * PRD Structure:
 * {
 *   title: string,
 *   version: string,
 *   executive_summary: string,
 *   problem_statement: string,
 *   goals: [ string, ... ],
 *   personas: [ string, ... ],
 *   requirements: {
 *     functional: [ string, ... ],
 *     non_functional: [ string, ... ],
 *     user_stories: [
 *       {
 *         title: string,
 *         description: string,
 *         acceptance_criteria: [ string, ... ]
 *       },
 *       ...
 *     ]
 *   },
 *   success_criteria: [ string, ... ],
 *   timeline_estimate: string,
 *   risks: [ string, ... ],
 *   dependencies: [ string, ... ]
 * }
 * 
 * ============================================================================
 * 14. ORCHESTRATOR
 * ============================================================================
 * 
 * Manages sequential execution of the 10-agent pipeline.
 * 
 * Features:
 * - Sequential agent execution
 * - Output passing to next agent as context
 * - Error handling and recovery
 * - Audit trail tracking
 * - Retry support
 * 
 * Usage:
 * 
 * const orchestrator = new MultiAgentOrchestrator();
 * const context = await orchestrator.executePipeline(input, workflowId);
 * 
 * Returns:
 * {
 *   pipelineId: string,
 *   workflowId: string,
 *   startedAt: Date,
 *   completedAt: Date,
 *   results: [ AgentExecutionResult, ... ],
 *   errors: [ { agentId, error, timestamp }, ... ],
 *   totalExecutionTime: number (ms)
 * }
 * 
 * ============================================================================
 * 15. STATE MANAGEMENT
 * ============================================================================
 * 
 * Using Zustand for lightweight, performant state management.
 * 
 * Agent Monitor Store:
 * - Tracks agent execution metrics
 * - Records real-time agent status
 * - Maintains execution history
 * - Provides filtering and statistics
 * 
 * Workflow Results Store:
 * - Stores workflow execution records
 * - Tracks workflow history
 * - Maintains execution statistics
 * - Provides filtering capabilities
 * 
 * ============================================================================
 * 16. HOOKS
 * ============================================================================
 * 
 * useAgentMonitor_Hook():
 * - Access all agent metrics
 * - Track active agents
 * - Record executions
 * 
 * useWorkflowExecution():
 * - Execute workflows
 * - Track progress
 * - Handle errors
 * 
 * useExecutionHistory():
 * - Access workflow history
 * - Get execution statistics
 * - Clear history
 * 
 * ============================================================================
 * 17. MOCK DATA GENERATION
 * ============================================================================
 * 
 * All agents produce realistic mock outputs based on:
 * 
 * - Keyword-based intelligence extraction
 * - Pattern matching for personas
 * - Sentiment from keyword analysis
 * - Frequency from counting occurrences
 * - Impact from multi-factor scoring
 * - RICE calculations from collected metrics
 * 
 * This allows the system to function without a real LLM while still
 * producing meaningful, realistic outputs for UI/UX development.
 * 
 * ============================================================================
 * 18. EXTENSIBILITY FOR REAL LLMs
 * ============================================================================
 * 
 * The system is designed for easy integration with real LLMs:
 * 
 * 1. Prompt System:
 *    - All prompts in config files (src/config/ai/prompts/)
 *    - Prompt templates with variable substitution
 *    - PromptManager handles rendering
 * 
 * 2. To integrate LLMs:
 *    - Replace mock logic in executeAgent() with LLM calls
 *    - Use PromptManager.renderTemplate() to get prompts
 *    - Parse LLM response and map to output schema
 *    - Validate with Zod schema
 * 
 * Example:
 * 
 * protected async executeAgent(input: AgentInput) {
 *   const prompt = promptManager.renderTemplate('insight-extract', {
 *     content: input.content
 *   });
 *   
 *   const response = await llm.generate({
 *     systemPrompt: prompt.systemPrompt,
 *     userPrompt: prompt.userPrompt
 *   });
 *   
 *   const parsed = JSON.parse(response);
 *   const validated = InsightOutputSchema.parse(parsed);
 *   
 *   return this.createOutput(validated);
 * }
 * 
 * ============================================================================
 * 19. ERROR HANDLING & LOGGING
 * ============================================================================
 * 
 * Comprehensive error handling:
 * - Agent execution errors caught and logged
 * - Pipeline continues even if agent fails
 * - Full audit trail of all events
 * - Error recovery with retry support
 * 
 * Audit Trail:
 * - Timestamp of each event
 * - Event type (validation, execution, error, etc)
 * - Associated details and metadata
 * - Complete execution history
 * 
 * ============================================================================
 * 20. CONFIDENCE SCORING
 * ============================================================================
 * 
 * Each agent produces confidence scores (0-1) based on:
 * 
 * - Data quality and completeness
 * - Input length and detail
 * - Presence of context and metadata
 * - Consistency of results
 * - Historical accuracy
 * 
 * Base confidence increases with:
 * - More detailed input
 * - Better data quality
 * - Presence of context
 * - Multiple mentions of same topic
 * 
 * ============================================================================
 * 21. USAGE EXAMPLE
 * ============================================================================
 * 
 * // Initialize prompts
 * import { initializePrompts } from '@/config/ai/prompts';
 * initializePrompts();
 * 
 * // Create input
 * const input: AgentInput = {
 *   requestId: 'req-001',
 *   content: 'User feedback text here...',
 *   context: { chunks: [...] },
 *   parameters: { documentType: 'transcript' }
 * };
 * 
 * // Execute workflow
 * const orchestrator = new MultiAgentOrchestrator();
 * const result = await orchestrator.executePipeline(input, 'workflow-001');
 * 
 * // Access results
 * result.results.forEach(agentResult => {
 *   console.log(`${agentResult.agentName}: ${agentResult.status}`);
 *   console.log(`Confidence: ${agentResult.confidenceScore}`);
 *   console.log(`Output:`, agentResult.output?.result);
 * });
 * 
 * ============================================================================
 * 22. PERFORMANCE CHARACTERISTICS
 * ============================================================================
 * 
 * With mock implementations:
 * - Each agent: 10-200ms
 * - Complete pipeline: 100-2000ms depending on input size
 * - Memory efficient: <50MB for full execution
 * - No external dependencies required
 * 
 * With real LLMs:
 * - Each agent: 500ms-5s (depending on model)
 * - Complete pipeline: 5-50s
 * - Memory: 100MB-1GB (model dependent)
 * - External API calls required
 * 
 * ============================================================================
 * 23. MONITORING & OBSERVABILITY
 * ============================================================================
 * 
 * Agent Monitor provides:
 * - Real-time agent status
 * - Execution metrics (time, confidence, success rate)
 * - Performance tracking
 * - Health checks
 * - Error tracking and analysis
 * 
 * Workflow Results provides:
 * - Execution history
 * - Success/failure rates
 * - Performance statistics
 * - Trend analysis
 * 
 * ============================================================================
 */

export const MULTI_AGENT_DOCUMENTATION = true;
