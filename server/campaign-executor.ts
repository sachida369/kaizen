import { storage } from "./storage";
import type { Campaign, Call, InsertCall } from "@shared/schema";
import { log } from "./index";

/**
 * Campaign Executor - Orchestrates campaign execution with mock and real modes
 */

interface ExecutionContext {
  campaignId: string;
  mockMode: boolean;
  timestamp: Date;
}

/**
 * Get mock mode enabled status
 */
export async function isMockModeEnabled(): Promise<boolean> {
  try {
    const setting = await storage.getSetting("mock_mode");
    return setting?.value === true;
  } catch {
    return false;
  }
}

/**
 * Launch a campaign - either mock or real
 */
export async function launchCampaign(campaignId: string): Promise<{
  success: boolean;
  callsCreated: number;
  mockMode: boolean;
  message: string;
}> {
  try {
    const campaign = await storage.getCampaign(campaignId);
    if (!campaign) {
      return { success: false, callsCreated: 0, mockMode: false, message: "Campaign not found" };
    }

    const mockMode = await isMockModeEnabled();
    const context: ExecutionContext = {
      campaignId,
      mockMode,
      timestamp: new Date(),
    };

    if (mockMode) {
      return await executeMockCampaign(campaign, context);
    } else {
      return await executeRealCampaign(campaign, context);
    }
  } catch (error) {
    log(`Campaign execution error: ${error}`, "campaign-executor");
    return {
      success: false,
      callsCreated: 0,
      mockMode: false,
      message: "Campaign execution failed",
    };
  }
}

/**
 * Execute campaign in mock mode (simulated calls)
 */
async function executeMockCampaign(
  campaign: Campaign,
  context: ExecutionContext
): Promise<{
  success: boolean;
  callsCreated: number;
  mockMode: boolean;
  message: string;
}> {
  try {
    const candidates = campaign.totalCandidates || 0;
    const callsCreated: InsertCall[] = [];

    // Create mock calls for each candidate (simulated outcomes)
    const mockOutcomes: Array<"interested" | "not_interested" | "no_answer"> = [
      "interested",
      "not_interested",
      "no_answer",
    ];

    for (let i = 0; i < candidates; i++) {
      const outcome = mockOutcomes[i % mockOutcomes.length];
      const mockCall: InsertCall = {
        campaignId: campaign.id,
        candidateId: "", // Would be populated from campaign candidates
        outcome,
        duration: Math.floor(Math.random() * 600) + 30, // 30-630 seconds
        transcript: generateMockTranscript(outcome),
        summary: generateMockSummary(outcome),
        sentiment: outcome === "interested" ? "positive" : outcome === "not_interested" ? "negative" : "neutral",
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
        audioUrl: null,
        vapiCallId: `mock-${campaign.id}-${i}`,
        errorMessage: null,
      };
      callsCreated.push(mockCall);
    }

    // Update campaign stats
    const successfulCalls = callsCreated.filter((c) => c.outcome === "interested").length;
    await storage.updateCampaign(campaign.id, {
      status: "completed",
      completedCalls: candidates,
      successfulCalls,
      failedCalls: candidates - successfulCalls,
      completedAt: new Date(),
    });

    log(
      `Mock campaign executed: ${campaign.id} - ${candidates} calls created`,
      "campaign-executor"
    );

    return {
      success: true,
      callsCreated: candidates,
      mockMode: true,
      message: `Mock campaign executed: ${candidates} calls created (${successfulCalls} interested)`,
    };
  } catch (error) {
    log(`Mock campaign execution error: ${error}`, "campaign-executor");
    return { success: false, callsCreated: 0, mockMode: true, message: "Mock campaign execution failed" };
  }
}

/**
 * Execute campaign in real mode (actual voice calls via Vapi/Twilio)
 */
async function executeRealCampaign(
  campaign: Campaign,
  context: ExecutionContext
): Promise<{
  success: boolean;
  callsCreated: number;
  mockMode: boolean;
  message: string;
}> {
  try {
    // TODO: Implement real campaign execution with Vapi.io
    // 1. Get campaign candidates
    // 2. Create Vapi session
    // 3. Queue calls for processing
    // 4. Handle webhooks for call outcomes
    // 5. Update campaign and call records

    log(`Real campaign execution not yet implemented: ${campaign.id}`, "campaign-executor");

    return {
      success: false,
      callsCreated: 0,
      mockMode: false,
      message: "Real campaign execution not yet implemented - use mock mode for testing",
    };
  } catch (error) {
    log(`Real campaign execution error: ${error}`, "campaign-executor");
    return { success: false, callsCreated: 0, mockMode: false, message: "Real campaign execution failed" };
  }
}

/**
 * Generate mock transcript
 */
function generateMockTranscript(outcome: string): string {
  const transcripts: Record<string, string> = {
    interested: `Agent: Hello, this is AI calling from Acme Corp regarding the Senior Engineer role.\nCandidate: Hi, yes I'm interested.\nAgent: Great! Can you tell me about your experience?\nCandidate: I have 5 years of backend development experience.\nAgent: Perfect, we'll have a recruiter contact you soon.`,
    not_interested: `Agent: Hello, this is AI calling from Acme Corp regarding the Senior Engineer role.\nCandidate: Sorry, I'm not looking to change jobs right now.\nAgent: I understand, thanks for your time.`,
    no_answer: `Agent: Hello, this is AI calling from Acme Corp regarding the Senior Engineer role.\n[No response - voicemail recorded]`,
  };
  return transcripts[outcome] || transcripts.no_answer;
}

/**
 * Generate mock summary
 */
function generateMockSummary(outcome: string): string {
  const summaries: Record<string, string> = {
    interested: "Candidate expressed strong interest in the position and is open to next steps.",
    not_interested: "Candidate is not actively looking for a new role at this time.",
    no_answer: "Call went to voicemail - candidate did not answer.",
  };
  return summaries[outcome] || summaries.no_answer;
}
