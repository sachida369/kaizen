# Kaizen Recruitment Platform

## Overview

Kaizen Recruitment is an AI-powered recruitment platform that combines voice agents, CRM integration, and intelligent campaign management. The system enables recruiters to automate candidate screening through AI voice calls, manage job vacancies, track candidates through recruitment pipelines, and orchestrate multi-channel outreach campaigns.

**Core Purpose**: Streamline recruitment workflows by automating initial candidate screening via AI voice agents (Vapi.io), synchronizing with GoHighLevel CRM, and providing a comprehensive dashboard for campaign management and analytics.

**Key Capabilities**:
- AI voice agent integration for automated candidate screening calls
- Multi-channel campaign management (voice, email, WhatsApp)
- Candidate and vacancy lifecycle management
- Real-time call analytics and transcript analysis
- CRM synchronization (GoHighLevel)
- DNC (Do Not Call) compliance management
- Dashboard analytics with conversion metrics

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Wouter for routing instead of React Router.

**UI Component System**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling. Design follows Linear-inspired enterprise dashboard principles with Carbon Design system influences.

**State Management**: TanStack Query (React Query) for server state management. No global state management library (Redux/Zustand) - relies on React Query's caching and URL-based routing state.

**Design System**:
- Typography: Inter (primary UI), JetBrains Mono (technical data like phone numbers)
- Color scheme: Neutral-based palette with HSL CSS variables for theme support
- Layout: Fixed 16rem left sidebar navigation with responsive mobile drawer
- Spacing: Tailwind utility classes with consistent 2/4/6/8/12/16 unit primitives

**Form Handling**: React Hook Form with Zod schema validation via @hookform/resolvers.

**Build Tool**: Vite with custom development setup including hot module replacement and middleware mode for Express integration.

### Backend Architecture

**Runtime**: Node.js with Express.js server.

**API Pattern**: RESTful API with functional route handlers, no controller classes. Routes defined in `server/routes.ts` with storage abstraction layer.

**Data Access Layer**: Storage interface pattern (`IStorage` in `server/storage.ts`) abstracts database operations, enabling future database swapping without changing business logic.

**Database**: Drizzle ORM with Neon Serverless PostgreSQL. Schema-driven with type-safe queries and migrations managed via drizzle-kit.

**Session Management**: Uses connect-pg-simple for PostgreSQL-backed sessions (referenced in package.json), though authentication implementation is not visible in provided files.

**Error Handling**: Zod validation errors converted to user-friendly messages via zod-validation-error. HTTP error responses use standard status codes with JSON error messages.

**Build Process**: esbuild bundles server code with selective dependency bundling (allowlist approach) to reduce cold start times. Client built separately via Vite.

### Database Schema Design

**Core Entities**:
- **Users**: Role-based access (admin, recruiter, marketing) with active status flag
- **Vacancies**: Job positions with status workflow (draft → active → paused → closed → filled), optional GHL pipeline/stage mapping
- **Candidates**: Contact information with consent tracking, DNC flags, status pipeline (new → screening → interview → offer → hired/rejected/pool)
- **Campaigns**: Multi-stage outreach orchestration with scheduling, audience targeting, retry logic, and channel configuration
- **Calls**: Voice interaction records with outcome classification, transcript storage, sentiment analysis, AI metadata
- **DNC List**: Compliance management with phone numbers, reasons, and expiration dates
- **Settings**: Key-value configuration store for API credentials and system preferences

**Enum Types**: Leverages PostgreSQL enums for constrained status fields (user roles, vacancy status, candidate status, campaign status, call outcomes, consent status).

**Relationships**: Foreign keys connect campaigns to vacancies, candidates to vacancies, calls to campaigns/candidates. No explicit junction tables visible - uses direct foreign key references.

**Audit Trail**: Candidates and vacancies track creator (`createdBy` references users) and timestamps (`createdAt`, `updatedAt`).

### External Dependencies

**Voice AI Platform**:
- **Vapi.io**: Primary voice agent provider for real-time TTS/STT and conversational AI sessions
- Configuration: `VAPI_API_KEY`, `VAPI_PROJECT_ID`, `VAPI_BASE_URL`

**Telephony (Optional Fallback)**:
- **Twilio**: Voice call infrastructure, programmable messaging
- Configuration: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`

**CRM Integration**:
- **GoHighLevel (GHL)**: Marketing automation and CRM synchronization
- Configuration: `GHL_API_KEY`, `GHL_ACCOUNT_ID`, `GHL_BASE_URL`
- Purpose: Sync candidates to pipelines, trigger automations, track conversions

**LLM & Speech Services**:
- **OpenAI**: GPT-4o-mini for language understanding, Whisper for fallback speech-to-text
- Configuration: `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_STT_MODEL`

**Database**:
- **Neon Serverless PostgreSQL**: Managed PostgreSQL with WebSocket connections
- Configuration: `DATABASE_URL`
- Driver: @neondatabase/serverless with WebSocket constructor override (ws library)

**Email & Calendar** (Referenced, not fully implemented):
- SMTP configuration for transactional emails
- Google Calendar OAuth for interview scheduling

**Optional Integrations** (Referenced in prompt, not in code):
- Xero (invoicing)
- Zoom (meeting creation)
- 360dialog (WhatsApp Business API)

**Development Tools**:
- Replit-specific: vite-plugin-runtime-error-modal, vite-plugin-cartographer, vite-plugin-dev-banner
- ngrok for local webhook tunneling (optional)

**Security & Compliance**:
- Environment flags: `CALL_CONSENT_ACCEPTED`, `GLOBAL_DNC_LIST`, `LOG_TRANSCRIPTS`, `MAX_CONCURRENT_CALLS`, `CALL_RETRY_LIMIT`
- Implements consent management and DNC compliance at application level

**Key Architectural Decisions**:
1. **Modular integration approach**: All external services accessed via environment variables, enabling swapping providers without code changes
2. **Webhook-driven**: System expects `WEBHOOK_BASE_URL` for receiving callbacks from Vapi, Twilio, and GHL
3. **Database-first design**: Schema drives TypeScript types via Drizzle ORM's type inference
4. **Serverless-ready**: Neon connection pooling and esbuild bundling optimize for serverless deployment
5. **Compliance by design**: DNC list and consent status tracked at database level with enforcement in campaign logic