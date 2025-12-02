import { db } from "./db";
import { eq, desc, and, sql as drizzleSql } from "drizzle-orm";
import {
  users,
  vacancies,
  candidates,
  campaigns,
  calls,
  dncList,
  settings,
  webhookEvents,
  type User,
  type InsertUser,
  type Vacancy,
  type InsertVacancy,
  type Candidate,
  type InsertCandidate,
  type Campaign,
  type InsertCampaign,
  type Call,
  type InsertCall,
  type Dnc,
  type InsertDnc,
  type Setting,
  type DashboardStats,
  type WebhookEvent,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllVacancies(): Promise<Vacancy[]>;
  getVacancy(id: string): Promise<Vacancy | undefined>;
  createVacancy(vacancy: InsertVacancy): Promise<Vacancy>;
  updateVacancy(id: string, updates: Partial<Vacancy>): Promise<Vacancy | undefined>;
  deleteVacancy(id: string): Promise<void>;
  
  getAllCandidates(): Promise<Candidate[]>;
  getCandidate(id: string): Promise<Candidate | undefined>;
  getCandidatesByVacancy(vacancyId: string): Promise<Candidate[]>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate | undefined>;
  deleteCandidate(id: string): Promise<void>;
  
  getAllCampaigns(): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: string): Promise<void>;
  
  getAllCalls(limit?: number): Promise<Call[]>;
  getCall(id: string): Promise<Call | undefined>;
  getCallsByCandidate(candidateId: string): Promise<Call[]>;
  getCallsByCampaign(campaignId: string): Promise<Call[]>;
  createCall(call: InsertCall): Promise<Call>;
  updateCall(id: string, updates: Partial<Call>): Promise<Call | undefined>;
  
  getAllDnc(): Promise<Dnc[]>;
  addToDnc(dnc: InsertDnc): Promise<Dnc>;
  removeFromDnc(id: string): Promise<void>;
  checkDnc(phone: string): Promise<boolean>;
  
  getAllSettings(): Promise<Setting[]>;
  getSetting(key: string): Promise<Setting | undefined>;
  setSetting(key: string, value: unknown): Promise<Setting>;
  
  hasWebhookEvent(eventId: string): Promise<boolean>;
  insertWebhookEvent(eventId: string, source: string, eventType: string, payload: unknown): Promise<WebhookEvent>;
  
  getDashboardStats(): Promise<DashboardStats>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getAllVacancies(): Promise<Vacancy[]> {
    return db.select().from(vacancies).orderBy(desc(vacancies.createdAt));
  }

  async getVacancy(id: string): Promise<Vacancy | undefined> {
    const result = await db.select().from(vacancies).where(eq(vacancies.id, id));
    return result[0];
  }

  async createVacancy(vacancy: InsertVacancy): Promise<Vacancy> {
    const result = await db.insert(vacancies).values(vacancy).returning();
    return result[0];
  }

  async updateVacancy(id: string, updates: Partial<Vacancy>): Promise<Vacancy | undefined> {
    const result = await db
      .update(vacancies)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(vacancies.id, id))
      .returning();
    return result[0];
  }

  async deleteVacancy(id: string): Promise<void> {
    await db.delete(vacancies).where(eq(vacancies.id, id));
  }

  async getAllCandidates(): Promise<Candidate[]> {
    return db.select().from(candidates).orderBy(desc(candidates.createdAt));
  }

  async getCandidate(id: string): Promise<Candidate | undefined> {
    const result = await db.select().from(candidates).where(eq(candidates.id, id));
    return result[0];
  }

  async getCandidatesByVacancy(vacancyId: string): Promise<Candidate[]> {
    return db.select().from(candidates).where(eq(candidates.vacancyId, vacancyId)).orderBy(desc(candidates.createdAt));
  }

  async createCandidate(candidate: InsertCandidate): Promise<Candidate> {
    const result = await db.insert(candidates).values(candidate).returning();
    return result[0];
  }

  async updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate | undefined> {
    const result = await db
      .update(candidates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(candidates.id, id))
      .returning();
    return result[0];
  }

  async deleteCandidate(id: string): Promise<void> {
    await db.delete(candidates).where(eq(candidates.id, id));
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return db.select().from(campaigns).orderBy(desc(campaigns.createdAt));
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    const result = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return result[0];
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const result = await db.insert(campaigns).values(campaign).returning();
    return result[0];
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const result = await db
      .update(campaigns)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(campaigns.id, id))
      .returning();
    return result[0];
  }

  async deleteCampaign(id: string): Promise<void> {
    await db.delete(campaigns).where(eq(campaigns.id, id));
  }

  async getAllCalls(limit?: number): Promise<Call[]> {
    let query = db.select().from(calls).orderBy(desc(calls.createdAt));
    if (limit) {
      query = query.limit(limit) as typeof query;
    }
    return query;
  }

  async getCall(id: string): Promise<Call | undefined> {
    const result = await db.select().from(calls).where(eq(calls.id, id));
    return result[0];
  }

  async getCallsByCandidate(candidateId: string): Promise<Call[]> {
    return db.select().from(calls).where(eq(calls.candidateId, candidateId)).orderBy(desc(calls.createdAt));
  }

  async getCallsByCampaign(campaignId: string): Promise<Call[]> {
    return db.select().from(calls).where(eq(calls.campaignId, campaignId)).orderBy(desc(calls.createdAt));
  }

  async createCall(call: InsertCall): Promise<Call> {
    const result = await db.insert(calls).values(call).returning();
    return result[0];
  }

  async updateCall(id: string, updates: Partial<Call>): Promise<Call | undefined> {
    const result = await db
      .update(calls)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(calls.id, id))
      .returning();
    return result[0];
  }

  async getAllDnc(): Promise<Dnc[]> {
    return db.select().from(dncList).orderBy(desc(dncList.createdAt));
  }

  async addToDnc(dnc: InsertDnc): Promise<Dnc> {
    const result = await db.insert(dncList).values(dnc).returning();
    return result[0];
  }

  async removeFromDnc(id: string): Promise<void> {
    await db.delete(dncList).where(eq(dncList.id, id));
  }

  async checkDnc(phone: string): Promise<boolean> {
    const result = await db.select().from(dncList).where(eq(dncList.phone, phone));
    return result.length > 0;
  }

  async getAllSettings(): Promise<Setting[]> {
    return db.select().from(settings);
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    const result = await db.select().from(settings).where(eq(settings.key, key));
    return result[0];
  }

  async setSetting(key: string, value: unknown): Promise<Setting> {
    const existing = await this.getSetting(key);
    if (existing) {
      const result = await db
        .update(settings)
        .set({ value, updatedAt: new Date() })
        .where(eq(settings.key, key))
        .returning();
      return result[0];
    }
    const result = await db.insert(settings).values({ key, value }).returning();
    return result[0];
  }

  async hasWebhookEvent(eventId: string): Promise<boolean> {
    const result = await db.select().from(webhookEvents).where(eq(webhookEvents.eventId, eventId));
    return result.length > 0;
  }

  async insertWebhookEvent(eventId: string, source: string, eventType: string, payload: unknown): Promise<WebhookEvent> {
    const result = await db
      .insert(webhookEvents)
      .values({ eventId, source, eventType, payload, processed: false })
      .returning();
    return result[0];
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const [candidateCount] = await db
      .select({ count: drizzleSql<number>`count(*)::int` })
      .from(candidates);
    
    const [interviewCount] = await db
      .select({ count: drizzleSql<number>`count(*)::int` })
      .from(candidates)
      .where(eq(candidates.status, "interview"));
    
    const [hiredCount] = await db
      .select({ count: drizzleSql<number>`count(*)::int` })
      .from(candidates)
      .where(eq(candidates.status, "hired"));
    
    const [activeCampaignCount] = await db
      .select({ count: drizzleSql<number>`count(*)::int` })
      .from(campaigns)
      .where(eq(campaigns.status, "running"));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [callsTodayCount] = await db
      .select({ count: drizzleSql<number>`count(*)::int` })
      .from(calls)
      .where(drizzleSql`${calls.createdAt} >= ${today}`);
    
    const [callStats] = await db
      .select({
        total: drizzleSql<number>`count(*)::int`,
        successful: drizzleSql<number>`count(*) filter (where outcome = 'interested')::int`,
      })
      .from(calls);

    const successRate = callStats.total > 0 
      ? Math.round((callStats.successful / callStats.total) * 100) 
      : 0;

    return {
      totalApplications: candidateCount?.count || 0,
      interviewsScheduled: interviewCount?.count || 0,
      placements: hiredCount?.count || 0,
      activeCampaigns: activeCampaignCount?.count || 0,
      callsToday: callsTodayCount?.count || 0,
      successRate,
    };
  }
}

export const storage = new DatabaseStorage();
