import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "recruiter", "marketing"]);
export const vacancyStatusEnum = pgEnum("vacancy_status", ["draft", "active", "paused", "closed", "filled"]);
export const candidateStatusEnum = pgEnum("candidate_status", ["new", "screening", "interview", "offer", "hired", "rejected", "pool"]);
export const campaignStatusEnum = pgEnum("campaign_status", ["draft", "scheduled", "running", "paused", "completed", "cancelled"]);
export const callOutcomeEnum = pgEnum("call_outcome", ["interested", "not_interested", "no_answer", "busy", "voicemail", "opt_out", "callback", "error"]);
export const consentStatusEnum = pgEnum("consent_status", ["pending", "granted", "revoked"]);
export const auditActionEnum = pgEnum("audit_action", ["create", "update", "delete", "view", "call", "sync", "login", "logout"]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull().default("recruiter"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Vacancies table
export const vacancies = pgTable("vacancies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  department: text("department").notNull(),
  location: text("location").notNull(),
  description: text("description"),
  requirements: text("requirements"),
  salary: text("salary"),
  status: vacancyStatusEnum("status").notNull().default("draft"),
  ghlPipelineId: text("ghl_pipeline_id"),
  ghlStageId: text("ghl_stage_id"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Candidates table
export const candidates = pgTable("candidates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  cvUrl: text("cv_url"),
  linkedinUrl: text("linkedin_url"),
  tags: text("tags").array(),
  customFields: jsonb("custom_fields").$type<Record<string, string>>(),
  status: candidateStatusEnum("status").notNull().default("new"),
  vacancyId: varchar("vacancy_id").references(() => vacancies.id),
  ghlContactId: text("ghl_contact_id"),
  consentStatus: consentStatusEnum("consent_status").notNull().default("pending"),
  consentTimestamp: timestamp("consent_timestamp"),
  consentSource: text("consent_source"),
  isDnc: boolean("is_dnc").notNull().default(false),
  dncTimestamp: timestamp("dnc_timestamp"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Campaigns table
export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  status: campaignStatusEnum("status").notNull().default("draft"),
  vacancyId: varchar("vacancy_id").references(() => vacancies.id),
  scriptTemplate: text("script_template").notNull(),
  callWindowStart: text("call_window_start").notNull().default("09:00"),
  callWindowEnd: text("call_window_end").notNull().default("18:00"),
  callWindowDays: text("call_window_days").array().default(sql`ARRAY['monday','tuesday','wednesday','thursday','friday']`),
  maxConcurrentCalls: integer("max_concurrent_calls").notNull().default(10),
  retryLimit: integer("retry_limit").notNull().default(2),
  retryDelayMinutes: integer("retry_delay_minutes").notNull().default(60),
  totalCandidates: integer("total_candidates").notNull().default(0),
  completedCalls: integer("completed_calls").notNull().default(0),
  successfulCalls: integer("successful_calls").notNull().default(0),
  failedCalls: integer("failed_calls").notNull().default(0),
  createdBy: varchar("created_by").references(() => users.id),
  scheduledAt: timestamp("scheduled_at"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Campaign Candidates junction table
export const campaignCandidates = pgTable("campaign_candidates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").notNull().references(() => campaigns.id),
  candidateId: varchar("candidate_id").notNull().references(() => candidates.id),
  status: text("status").notNull().default("pending"),
  attempts: integer("attempts").notNull().default(0),
  lastAttemptAt: timestamp("last_attempt_at"),
  nextAttemptAt: timestamp("next_attempt_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Calls table
export const calls = pgTable("calls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").references(() => campaigns.id),
  candidateId: varchar("candidate_id").notNull().references(() => candidates.id),
  vapiCallId: text("vapi_call_id"),
  twilioCallSid: text("twilio_call_sid"),
  outcome: callOutcomeEnum("outcome"),
  duration: integer("duration"),
  audioUrl: text("audio_url"),
  transcript: text("transcript"),
  summary: text("summary"),
  sentiment: text("sentiment"),
  confidence: integer("confidence"),
  extractedData: jsonb("extracted_data").$type<{
    intent?: string;
    availability?: string;
    salaryExpectation?: string;
    noticePeriod?: string;
    skills?: string[];
  }>(),
  recommendedAction: text("recommended_action"),
  scheduledInterviewAt: timestamp("scheduled_interview_at"),
  ghlSynced: boolean("ghl_synced").notNull().default(false),
  ghlSyncedAt: timestamp("ghl_synced_at"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Audit Logs table
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: auditActionEnum("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: varchar("entity_id"),
  details: jsonb("details").$type<Record<string, unknown>>(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Settings table (key-value store for app configuration)
export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: jsonb("value").$type<unknown>(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// DNC List table
export const dncList = pgTable("dnc_list", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: text("phone").notNull().unique(),
  reason: text("reason"),
  source: text("source"),
  addedBy: varchar("added_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Webhook Events table (for idempotency)
export const webhookEvents = pgTable("webhook_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: text("event_id").notNull().unique(),
  source: text("source").notNull(),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").$type<unknown>(),
  processed: boolean("processed").notNull().default(false),
  processedAt: timestamp("processed_at"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  vacancies: many(vacancies),
  campaigns: many(campaigns),
  auditLogs: many(auditLogs),
}));

export const vacanciesRelations = relations(vacancies, ({ one, many }) => ({
  createdBy: one(users, { fields: [vacancies.createdBy], references: [users.id] }),
  candidates: many(candidates),
  campaigns: many(campaigns),
}));

export const candidatesRelations = relations(candidates, ({ one, many }) => ({
  vacancy: one(vacancies, { fields: [candidates.vacancyId], references: [vacancies.id] }),
  calls: many(calls),
  campaignCandidates: many(campaignCandidates),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  createdBy: one(users, { fields: [campaigns.createdBy], references: [users.id] }),
  vacancy: one(vacancies, { fields: [campaigns.vacancyId], references: [vacancies.id] }),
  calls: many(calls),
  campaignCandidates: many(campaignCandidates),
}));

export const campaignCandidatesRelations = relations(campaignCandidates, ({ one }) => ({
  campaign: one(campaigns, { fields: [campaignCandidates.campaignId], references: [campaigns.id] }),
  candidate: one(candidates, { fields: [campaignCandidates.candidateId], references: [candidates.id] }),
}));

export const callsRelations = relations(calls, ({ one }) => ({
  campaign: one(campaigns, { fields: [calls.campaignId], references: [campaigns.id] }),
  candidate: one(candidates, { fields: [calls.candidateId], references: [candidates.id] }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertVacancySchema = createInsertSchema(vacancies).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCandidateSchema = createInsertSchema(candidates).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCampaignSchema = createInsertSchema(campaigns).omit({ id: true, createdAt: true, updatedAt: true, totalCandidates: true, completedCalls: true, successfulCalls: true, failedCalls: true });
export const insertCampaignCandidateSchema = createInsertSchema(campaignCandidates).omit({ id: true, createdAt: true });
export const insertCallSchema = createInsertSchema(calls).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });
export const insertSettingSchema = createInsertSchema(settings).omit({ id: true, updatedAt: true });
export const insertDncSchema = createInsertSchema(dncList).omit({ id: true, createdAt: true });
export const insertWebhookEventSchema = createInsertSchema(webhookEvents).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVacancy = z.infer<typeof insertVacancySchema>;
export type Vacancy = typeof vacancies.$inferSelect;
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidates.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaignCandidate = z.infer<typeof insertCampaignCandidateSchema>;
export type CampaignCandidate = typeof campaignCandidates.$inferSelect;
export type InsertCall = z.infer<typeof insertCallSchema>;
export type Call = typeof calls.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Setting = typeof settings.$inferSelect;
export type InsertDnc = z.infer<typeof insertDncSchema>;
export type Dnc = typeof dncList.$inferSelect;
export type InsertWebhookEvent = z.infer<typeof insertWebhookEventSchema>;
export type WebhookEvent = typeof webhookEvents.$inferSelect;

// Dashboard Stats type
export type DashboardStats = {
  totalApplications: number;
  interviewsScheduled: number;
  placements: number;
  activeCampaigns: number;
  callsToday: number;
  successRate: number;
};

// Campaign Progress type
export type CampaignProgress = {
  queued: number;
  inProgress: number;
  completed: number;
  failed: number;
};
