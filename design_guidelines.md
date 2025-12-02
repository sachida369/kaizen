# Kaizen Recruitment Platform - Design Guidelines

## Design Approach

**System Selection**: Linear-inspired enterprise dashboard with Carbon Design system principles
- Justification: Data-heavy recruitment tool requiring clarity, efficiency, and professional polish
- Clean, modern aesthetic prioritizing usability and information density over visual flair
- References: Linear (navigation/typography), Asana (task management), Salesforce (CRM patterns)

## Core Design Elements

### A. Typography Hierarchy

**Font System** (Google Fonts):
- Primary: Inter (UI, body text, data tables)
- Monospace: JetBrains Mono (phone numbers, IDs, technical data)

**Scale**:
- H1: text-4xl font-bold (Dashboard titles)
- H2: text-2xl font-semibold (Section headers)
- H3: text-xl font-semibold (Card headers, modal titles)
- H4: text-lg font-medium (Subheadings, table headers)
- Body: text-base (Default content)
- Small: text-sm (Metadata, timestamps, helper text)
- Tiny: text-xs (Labels, badges, micro-copy)

### B. Layout System

**Spacing Primitives** (Tailwind units): 2, 4, 6, 8, 12, 16
- Micro spacing: p-2, gap-2 (tight elements, badges)
- Component spacing: p-4, gap-4 (cards, form fields)
- Section spacing: p-6, p-8 (panels, modals)
- Page margins: p-12, p-16 (main content areas)

**Grid Strategy**:
- Sidebar navigation: w-64 fixed left sidebar
- Main content: max-w-7xl with px-8 horizontal padding
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Data tables: full-width with horizontal scroll on mobile

### C. Component Library

**Navigation**:
- Fixed left sidebar (w-64) with logo, primary nav, user profile footer
- Top bar: breadcrumbs, page title, primary actions (right-aligned)
- Mobile: collapsible drawer with overlay

**Dashboard Cards**:
- Elevated cards with subtle border, rounded-lg corners
- Header: icon + title (left), action menu (right)
- Body: metric display with large numbers, trend indicators
- Footer: micro-copy with timestamps or comparative data

**Data Tables**:
- Sticky header row with sortable columns
- Row hover states with action buttons reveal
- Pagination controls (bottom-right)
- Empty states with clear CTAs
- Inline filters (top of table) with chip-based active filters display

**Forms**:
- Single-column layout (max-w-2xl) for creation/edit
- Label above input (text-sm font-medium)
- Helper text below (text-xs)
- Validation: inline error messages with icon
- Multi-step forms: stepper UI (horizontal dots/lines) at top

**Campaign Builder** (Stepper UI):
- Horizontal step indicator with 5 steps: Script → Recipients → Schedule → Retry Rules → Review
- Left panel: step content with forms
- Right panel: live preview/summary (sticky)
- Navigation: Previous/Next buttons (bottom-right), Save Draft (bottom-left)

**Call Logs Interface**:
- Three-column split layout:
  - Left (w-1/4): List of calls with metadata cards (scrollable)
  - Center (w-1/2): Transcript viewer with audio player (top), sentiment/confidence badges
  - Right (w-1/4): Actions panel (schedule interview, mark DNC, update GHL)
- Audio player: minimalist controls with waveform visualization
- Transcript: chat-bubble style alternating speakers

**Candidate Profile**:
- Modal/slide-over panel (max-w-4xl)
- Three-section layout:
  - Top: Header with photo, name, contact, status badge
  - Left column (1/3): Meta data (tags, consent status, GDPR controls)
  - Center (2/3): Tabbed interface (Overview, Call History, GHL Sync, Documents)

**Modals & Overlays**:
- Confirmation dialogs: centered, max-w-md, destructive actions with danger styling
- Settings panels: slide-over (w-1/2) from right
- Toast notifications: top-right, auto-dismiss, with action buttons where relevant

**Badges & Status Indicators**:
- Pill-shaped badges (rounded-full, px-3, py-1, text-xs)
- Status colors applied via text/background (not specified, engineer decides)
- Icons from Heroicons for status (check, x, clock, alert)

**Buttons**:
- Primary: font-semibold, px-4, py-2, rounded-lg
- Secondary: similar with border treatment
- Ghost/tertiary: text-only with hover background
- Icon buttons: p-2, rounded-lg (for table actions)

**Empty States**:
- Centered content (max-w-md mx-auto)
- Icon (large, 64px)
- Heading + description
- Primary CTA button

### D. Animations

**Minimal Usage**:
- Page transitions: simple fade (150ms)
- Dropdown/modal entry: slide + fade (200ms)
- Loading states: skeleton screens (no spinners unless for inline actions)
- Avoid scroll-based or decorative animations

## Page-Specific Layouts

**Dashboard** (Home):
- Top KPI cards: 4-column grid (applications, interviews, placements, active campaigns)
- Middle: 2-column layout (Recent Activity list | Campaign Progress chart)
- Bottom: Quick Actions card

**Vacancies List**:
- Table view with filters (status, department, location)
- Columns: Job Title, Department, Location, Status, Applications, Actions
- Bulk actions toolbar when rows selected

**Campaign Builder**:
- Full-width stepper interface
- Fixed header with step progress
- Content area with left form + right preview panel
- Sticky footer with navigation buttons

**Call Logs**:
- Full-width three-column split (as described above)
- Filters bar (top): date range, campaign, outcome, confidence score

**Settings**:
- Two-column layout: left sidebar nav (Connectors, Users, DNC, Compliance), right content panel
- Connector setup: card-based with status indicators and "Configure" buttons
- DNC management: table with search and bulk import

## Accessibility & Quality

- Keyboard navigation: all interactive elements focusable with visible focus rings
- ARIA labels: for icon-only buttons, status indicators
- Form labels: explicitly associated with inputs
- Contrast: ensure all text meets WCAG AA standards
- Touch targets: minimum 44x44px for mobile

## Images

**No Hero Image**: This is an enterprise dashboard application
**Icon Usage**: Heroicons via CDN for all UI icons (outline for navigation, solid for status/badges)
**Candidate Photos**: Circular avatars (w-10 h-10 for lists, w-24 h-24 for profiles)
**Empty State Illustrations**: Simple line-art style illustrations for empty tables/lists