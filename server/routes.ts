import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authMiddleware, createSession, validateCredentials, destroySession } from "./auth";
import { launchCampaign } from "./campaign-executor";
import {
  insertVacancySchema,
  insertCandidateSchema,
  insertCampaignSchema,
  insertCallSchema,
  insertDncSchema,
  insertSettingSchema,
} from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

function handleZodError(error: ZodError) {
  const validationError = fromZodError(error);
  return { message: validationError.message };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Public auth routes (no middleware)
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }
      if (!validateCredentials(email, password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const sessionId = createSession(email, email);
      res.json({ sessionId, user: { email } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Demo mode - instant access for testing
  app.post("/api/auth/demo", async (req: Request, res: Response) => {
    try {
      const demoEmail = "recruiter@kaizen.com";
      const sessionId = createSession(demoEmail, demoEmail);
      res.json({ sessionId, user: { email: demoEmail } });
    } catch (error) {
      console.error("Demo login error:", error);
      res.status(500).json({ message: "Demo login failed" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    try {
      const sessionId = req.headers.authorization?.replace("Bearer ", "");
      if (sessionId) {
        destroySession(sessionId);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Protected routes - apply auth middleware to all API routes below
  app.use("/api/", authMiddleware);

  app.get("/api/dashboard/stats", async (_req: Request, res: Response) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get("/api/vacancies", async (_req: Request, res: Response) => {
    try {
      const vacancies = await storage.getAllVacancies();
      res.json(vacancies);
    } catch (error) {
      console.error("Error fetching vacancies:", error);
      res.status(500).json({ message: "Failed to fetch vacancies" });
    }
  });

  app.get("/api/vacancies/:id", async (req: Request, res: Response) => {
    try {
      const vacancy = await storage.getVacancy(req.params.id);
      if (!vacancy) {
        return res.status(404).json({ message: "Vacancy not found" });
      }
      res.json(vacancy);
    } catch (error) {
      console.error("Error fetching vacancy:", error);
      res.status(500).json({ message: "Failed to fetch vacancy" });
    }
  });

  app.post("/api/vacancies", async (req: Request, res: Response) => {
    try {
      const data = insertVacancySchema.parse(req.body);
      const vacancy = await storage.createVacancy(data);
      res.status(201).json(vacancy);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(handleZodError(error));
      }
      console.error("Error creating vacancy:", error);
      res.status(500).json({ message: "Failed to create vacancy" });
    }
  });

  app.patch("/api/vacancies/:id", async (req: Request, res: Response) => {
    try {
      const vacancy = await storage.updateVacancy(req.params.id, req.body);
      if (!vacancy) {
        return res.status(404).json({ message: "Vacancy not found" });
      }
      res.json(vacancy);
    } catch (error) {
      console.error("Error updating vacancy:", error);
      res.status(500).json({ message: "Failed to update vacancy" });
    }
  });

  app.delete("/api/vacancies/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteVacancy(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting vacancy:", error);
      res.status(500).json({ message: "Failed to delete vacancy" });
    }
  });

  app.get("/api/candidates", async (_req: Request, res: Response) => {
    try {
      const candidates = await storage.getAllCandidates();
      res.json(candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ message: "Failed to fetch candidates" });
    }
  });

  app.get("/api/candidates/:id", async (req: Request, res: Response) => {
    try {
      const candidate = await storage.getCandidate(req.params.id);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      res.json(candidate);
    } catch (error) {
      console.error("Error fetching candidate:", error);
      res.status(500).json({ message: "Failed to fetch candidate" });
    }
  });

  app.post("/api/candidates", async (req: Request, res: Response) => {
    try {
      const data = insertCandidateSchema.parse(req.body);
      const candidate = await storage.createCandidate(data);
      res.status(201).json(candidate);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(handleZodError(error));
      }
      console.error("Error creating candidate:", error);
      res.status(500).json({ message: "Failed to create candidate" });
    }
  });

  app.patch("/api/candidates/:id", async (req: Request, res: Response) => {
    try {
      const candidate = await storage.updateCandidate(req.params.id, req.body);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      res.json(candidate);
    } catch (error) {
      console.error("Error updating candidate:", error);
      res.status(500).json({ message: "Failed to update candidate" });
    }
  });

  app.delete("/api/candidates/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteCandidate(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting candidate:", error);
      res.status(500).json({ message: "Failed to delete candidate" });
    }
  });

  app.get("/api/campaigns", async (_req: Request, res: Response) => {
    try {
      const campaigns = await storage.getAllCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.get("/api/campaigns/:id", async (req: Request, res: Response) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  app.post("/api/campaigns", async (req: Request, res: Response) => {
    try {
      const data = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(data);
      res.status(201).json(campaign);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(handleZodError(error));
      }
      console.error("Error creating campaign:", error);
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  app.patch("/api/campaigns/:id", async (req: Request, res: Response) => {
    try {
      const campaign = await storage.updateCampaign(req.params.id, req.body);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      console.error("Error updating campaign:", error);
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  app.delete("/api/campaigns/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteCampaign(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  });

  app.post("/api/campaigns/:id/launch", async (req: Request, res: Response) => {
    try {
      const result = await launchCampaign(req.params.id);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }
      res.json(result);
    } catch (error) {
      console.error("Error launching campaign:", error);
      res.status(500).json({ message: "Failed to launch campaign" });
    }
  });

  app.get("/api/calls", async (req: Request, res: Response) => {
    try {
      const candidateId = req.query.candidateId as string | undefined;
      const campaignId = req.query.campaignId as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      let calls;
      if (candidateId) {
        calls = await storage.getCallsByCandidate(candidateId);
      } else if (campaignId) {
        calls = await storage.getCallsByCampaign(campaignId);
      } else {
        calls = await storage.getAllCalls(limit);
      }
      res.json(calls);
    } catch (error) {
      console.error("Error fetching calls:", error);
      res.status(500).json({ message: "Failed to fetch calls" });
    }
  });

  app.get("/api/calls/:id", async (req: Request, res: Response) => {
    try {
      const call = await storage.getCall(req.params.id);
      if (!call) {
        return res.status(404).json({ message: "Call not found" });
      }
      res.json(call);
    } catch (error) {
      console.error("Error fetching call:", error);
      res.status(500).json({ message: "Failed to fetch call" });
    }
  });

  app.post("/api/calls", async (req: Request, res: Response) => {
    try {
      const data = insertCallSchema.parse(req.body);
      const call = await storage.createCall(data);
      res.status(201).json(call);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(handleZodError(error));
      }
      console.error("Error creating call:", error);
      res.status(500).json({ message: "Failed to create call" });
    }
  });

  app.patch("/api/calls/:id", async (req: Request, res: Response) => {
    try {
      const call = await storage.updateCall(req.params.id, req.body);
      if (!call) {
        return res.status(404).json({ message: "Call not found" });
      }
      res.json(call);
    } catch (error) {
      console.error("Error updating call:", error);
      res.status(500).json({ message: "Failed to update call" });
    }
  });

  app.get("/api/dnc", async (_req: Request, res: Response) => {
    try {
      const dncList = await storage.getAllDnc();
      res.json(dncList);
    } catch (error) {
      console.error("Error fetching DNC list:", error);
      res.status(500).json({ message: "Failed to fetch DNC list" });
    }
  });

  app.post("/api/dnc", async (req: Request, res: Response) => {
    try {
      const data = insertDncSchema.parse(req.body);
      const dnc = await storage.addToDnc(data);
      res.status(201).json(dnc);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(handleZodError(error));
      }
      console.error("Error adding to DNC:", error);
      res.status(500).json({ message: "Failed to add to DNC list" });
    }
  });

  app.delete("/api/dnc/:id", async (req: Request, res: Response) => {
    try {
      await storage.removeFromDnc(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing from DNC:", error);
      res.status(500).json({ message: "Failed to remove from DNC list" });
    }
  });

  app.get("/api/dnc/check/:phone", async (req: Request, res: Response) => {
    try {
      const isDnc = await storage.checkDnc(req.params.phone);
      res.json({ isDnc });
    } catch (error) {
      console.error("Error checking DNC:", error);
      res.status(500).json({ message: "Failed to check DNC status" });
    }
  });

  app.get("/api/settings", async (_req: Request, res: Response) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", async (req: Request, res: Response) => {
    try {
      const entries = Object.entries(req.body);
      for (const [key, value] of entries) {
        await storage.setSetting(key, value as string);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving settings:", error);
      res.status(500).json({ message: "Failed to save settings" });
    }
  });

  app.get("/api/health", async (_req: Request, res: Response) => {
    try {
      const health = {
        database: true,
        openai: !!process.env.OPENAI_API_KEY,
        vapi: !!process.env.VAPI_API_KEY,
        twilio: !!process.env.TWILIO_ACCOUNT_SID,
        ghl: !!process.env.GHL_API_KEY,
      };
      res.json(health);
    } catch (error) {
      console.error("Error checking health:", error);
      res.status(500).json({ message: "Failed to check health" });
    }
  });

  // Webhook handlers with idempotency
  app.post("/api/webhooks/vapi", async (req: Request, res: Response) => {
    try {
      const eventId = req.body.id || `vapi-${Date.now()}`;
      const exists = await storage.hasWebhookEvent(eventId);
      if (exists) {
        return res.status(200).json({ message: "Event already processed" });
      }
      await storage.insertWebhookEvent(eventId, "vapi", req.body.type || "call", req.body);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error processing Vapi webhook:", error);
      res.status(500).json({ message: "Failed to process webhook" });
    }
  });

  app.post("/api/webhooks/twilio", async (req: Request, res: Response) => {
    try {
      const eventId = req.body.CallSid || `twilio-${Date.now()}`;
      const exists = await storage.hasWebhookEvent(eventId);
      if (exists) {
        return res.status(200).json({ message: "Event already processed" });
      }
      await storage.insertWebhookEvent(eventId, "twilio", "call_status", req.body);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error processing Twilio webhook:", error);
      res.status(500).json({ message: "Failed to process webhook" });
    }
  });

  app.post("/api/webhooks/ghl", async (req: Request, res: Response) => {
    try {
      const eventId = req.body.id || `ghl-${Date.now()}`;
      const exists = await storage.hasWebhookEvent(eventId);
      if (exists) {
        return res.status(200).json({ message: "Event already processed" });
      }
      await storage.insertWebhookEvent(eventId, "ghl", req.body.type || "sync", req.body);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error processing GHL webhook:", error);
      res.status(500).json({ message: "Failed to process webhook" });
    }
  });

  // Settings endpoints for connectors/DNC/compliance
  app.get("/api/settings/mock-mode", async (_req: Request, res: Response) => {
    try {
      const mockMode = await storage.getSetting("mock_mode");
      res.json({ enabled: mockMode?.value === true });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mock mode" });
    }
  });

  app.post("/api/settings/mock-mode", async (req: Request, res: Response) => {
    try {
      await storage.setSetting("mock_mode", req.body.enabled === true);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update mock mode" });
    }
  });

  app.get("/api/connectors/test", async (_req: Request, res: Response) => {
    try {
      const results: Record<string, boolean> = {
        openai: !!process.env.OPENAI_API_KEY,
        vapi: !!process.env.VAPI_API_KEY,
        twilio: !!process.env.TWILIO_ACCOUNT_SID,
        ghl: !!process.env.GHL_API_KEY,
      };
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to test connectors" });
    }
  });

  return httpServer;
}
