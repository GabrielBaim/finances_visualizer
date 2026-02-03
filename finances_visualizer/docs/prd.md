# Visualizador de Finanças - Product Requirements Document (PRD)

---

## Goals and Background Context

### Goals

- Ship a working MVP in **30 days** that generates WOW financial visualizations
- Enable CSV upload → 4 beautiful charts in **under 30 seconds**
- Support at least **Nubank and Inter** CSV formats at launch
- Achieve **70%+** categorization accuracy (acceptable for MVP, improved post-launch)
- Create a **share-worthy experience** users want to show off
- Deploy to production with real users by day 30

### Background Context

**Visualizador de Finanças** is a 30-day challenge project with a single focus: **make financial data look absolutely stunning**.

The problem: People export CSVs from banks (Nubank, Inter make this easy) but then stare at boring spreadsheets. They don't need another full-featured finance app—they need **instant visual gratification**.

**30-Day Reality Check:**
- No time for complex AI training → Use smart heuristics + simple NLP
- No time for multi-bank parsing → Start with Nubank + Inter only (community can add more)
- No time for accounts/auth → Stateless MVP, upload and view
- No time for advanced features → Focus on making 4 charts PERFECT instead

**The WOW Factor:**
Instead of "just another finance dashboard," we're building a **financial art generator**. Charts should be Instagram-worthy. Dark mode by default. Smooth animations. Colors that pop. Export in HD.

**Target User:** Digital-native Brazilian (25-40), uses Nubank/Inter, values aesthetics, has tried spreadsheets and given up.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-02-03 | 1.0 | Initial PRD - 30-day challenge edition | @pm (Morgan) |

---

## Requirements

### Functional Requirements

- **FR1:** User can upload a CSV file via drag-and-drop or file picker (max 10MB)
- **FR2:** System validates CSV format (Nubank/Inter structure) and shows clear error if unsupported
- **FR3:** System parses CSV extracting: date, description, amount, type (income/expense)
- **FR4:** System automatically categorizes transactions using keyword matching and simple NLP
- **FR5:** System displays 4 interactive charts: Categories (donut), Cash Flow (bar), Trends (line), Balance (area)
- **FR6:** Charts are responsive and work on mobile (320px+) and desktop (1920px+)
- **FR7:** User can filter transactions by date range and search by description text
- **FR8:** User can export any chart as PNG (1080p minimum) or PDF
- **FR9:** User can generate a shareable temporary link (valid 24h) to view their dashboard
- **FR10:** System shows loading states during processing (parse + categorize + render)
- **FR11:** System handles edge cases: empty CSV, malformed rows, duplicate transactions
- **FR12:** System displays transaction count, total income, total expense, net balance summary

### Non-Functional Requirements

- **NFR1:** Time from upload to first chart visible: < 30 seconds for 5,000 transactions
- **NFR2:** Application must work offline after initial load (PWA capabilities)
- **NFR3:** No user account required for MVP - stateless experience
- **NFR4:** CSV data is processed client-side or deleted from server after 1 hour (privacy-first)
- **NFR5:** Application must score 90+ on Lighthouse performance
- **NFR6:** Dark mode is the default and primary design theme
- **NFR7:** Charts must be exportable at minimum 1920x1080 resolution
- **NFR8:** Zero external dependencies requiring API keys for MVP
- **NFR9:** Code must be open-source (MIT license) from day 1
- **NFR10:** Application must be deployed to production URL by day 30

---

## User Interface Design Goals

### Overall UX Vision

**"Financial Data as Art"** - This isn't a boring finance tool. It's a visual experience. Think: dark themes, smooth animations, gradients, glassmorphism. Users should want to screenshot and share.

**First Impressions Matter:**
- Landing page: Large upload area, subtle animation, clear value prop
- After upload: Dramatic reveal of charts with staggered animations
- Hover effects: Tooltips, highlights, smooth transitions
- Export: One-click, instant download

**Key Interaction Paradigms:**

1. **Upload Flow:** Drag CSV anywhere on page → Visual feedback → Processing animation → Charts fade in sequentially
2. **Chart Interaction:** Hover shows details, click to focus/explode, legend toggles visibility
3. **Filter Flow:** Date range slider + search bar that filters in real-time
4. **Export Flow:** Hover chart → Export button appears → One click PNG/PDF

### Core Screens and Views

1. **Landing/Upload Screen**
   - Hero: "Minhas finanças nunca foram tão bonitas"
   - Large drag-drop zone with animated border
   - Sample CSV download link (for testing)
   - Bank logos (Nubank, Inter) showing supported formats

2. **Dashboard Screen**
   - Top: Summary cards (Income, Expense, Balance, Transaction count)
   - Middle: 4 charts in responsive grid (2x2 on desktop, stacked on mobile)
   - Bottom: Transaction table with scroll + search
   - Floating: Filter panel (collapsible)
   - Top-right: Export all / Share link buttons

3. **Chart Detail Modal** (clicking a chart)
   - Expanded chart view
   - Transaction list for that category/period
   - Export options (PNG, PDF, SVG)

4. **Share Page** (public link view)
   - Read-only dashboard view
   - "Create your own" CTA
   - Expires after 24h message

### Accessibility

**Target:** WCAG AA (reasonable for 30-day MVP)

- Keyboard navigation for all interactions
- Screen reader support for charts (data table alternative)
- Focus indicators visible
- Color contrast meets AA standards
- Touch targets minimum 44x44px

### Branding

**Visual Identity:**
- **Primary:** Deep purple gradient (#6366f1 → #8b5cf6)
- **Secondary:** Emerald green for income (#10b981), Rose red for expense (#f43f5e)
- **Background:** Dark (#0f172a) with subtle gradient
- **Surface:** Glassmorphism cards (backdrop-blur, semi-transparent)
- **Typography:** Inter or system-ui, clean and modern

**Animation Style:**
- Smooth, spring-based transitions (Framer Motion)
- Staggered chart reveals (donut → bar → line → area)
- Hover scales: 1.02x on cards, 1.05x on buttons
- Loading: Skeleton screens with shimmer effect

### Target Device and Platforms

**Web Responsive** - Single codebase, all screen sizes

- Mobile: 320px - 768px (stacked layout, touch-optimized)
- Tablet: 768px - 1024px (2x2 grid)
- Desktop: 1024px+ (optimal 2x2 with sidebar filters)
- Browsers: Chrome, Firefox, Safari, Edge (last 2 versions)

---

## Technical Assumptions

### Repository Structure

**Monorepo** - Single repository for simplicity (30-day constraint)

```
finances_visualizer/
├── packages/
│   ├── web/          # React + Vite frontend
│   └── csv-parser/   # Shared parsing logic (can be npm pkg later)
├── apps/
│   └── web/          # Main web application
└── package.json      # Turborepo or simple workspaces
```

**Rationale:** Monorepo keeps things simple for solo dev, easy to share types, single dep setup. Can split to polyrepo post-challenge if needed.

### Service Architecture

**Client-Side Processing** (Privacy-first, no server needed for MVP)

- **Frontend:** React + Vite + TypeScript
- **Charts:** Recharts (React-native, good DX, customizable)
- **CSV Parsing:** PapaParse (robust, handles edge cases)
- **Categorization:** Keyword matching + simple embeddings (no API calls)
- **Styling:** Tailwind CSS (fast prototyping, looks good out of box)
- **Animations:** Framer Motion (smooth, easy WOW effects)
- **Export:** html2canvas + jsPDF (client-side, no server)
- **Share:** Vercel Blob storage or temporary signed URLs

**Why Client-Side?**
- Zero infrastructure costs
- Privacy (data never leaves browser)
- Faster (no upload/download roundtrip)
- Simpler (no backend to maintain)
- Works offline (PWA)

**Post-MVP Server (if needed):**
- Vercel Serverless Functions for share link generation
- Vercel Blob for storing shared dashboards
- Supabase for user accounts (v2)

### Testing Requirements

**Unit + Integration** (Manual exploratory for 30-day speed)

- **Unit:** Vitest for categorization logic, parsing utilities
- **Integration:** Storybook for chart components
- **E2E:** Playwright for critical flows (upload → view → export)
- **Manual:** Real CSV testing (Nubank, Inter samples)

**Rationale:** Full testing pyramid is overkill for 30-day MVP. Focus on: (1) parsing works, (2) charts render, (3) export produces files.

### Additional Technical Assumptions

- **State Management:** Zustand (lightweight, better than Context for chart state)
- **Data Validation:** Zod for CSV schema validation
- **Routing:** React Router v6 (simple, well-known)
- **Date Handling:** date-fns (lighter than Moment, tree-shakeable)
- **Charts:** Recharts over D3 (faster to build, React-native)
- **Deployment:** Vercel (zero config, free tier, fast)
- **CI/CD:** GitHub Actions (lint, typecheck, test on PR)
- **Git Conventional Commits:** For clean changelog
- **No API Keys:** Everything client-side or free services only

---

## Epic List

**Note:** For 30-day challenge, consolidating into 3 focused epics.

| Epic | Goal |
|------|------|
| **Epic 1: Foundation & CSV Engine** | Project setup, CSV parsing for Nubank/Inter, keyword categorization, core data models |
| **Epic 2: Dashboard & Visualizations** | 4 chart components with Recharts, responsive layout, filter controls, summary cards |
| **Epic 3: Polish, Export & Launch** | Animations with Framer Motion, export functionality, share links, deployment, testing |

---

## Epic 1: Foundation & CSV Engine

**Goal:** Build the core data processing engine that transforms raw CSV files into structured, categorized transaction data ready for visualization. This epic establishes the project foundation,开发环境, and the "brain" that understands bank transaction formats.

### Story 1.1: Project Scaffold and开发环境 Setup

**As a** developer,
**I want** a modern React + Vite + TypeScript project with Tailwind CSS configured,
**so that** I can start building features immediately with a solid foundation.

**Acceptance Criteria:**
1. Vite + React 18 + TypeScript project created with ESLint + Prettier
2. Tailwind CSS configured with dark theme colors (purple/emerald/rose)
3. Folder structure: `src/components`, `src/lib`, `src/types`, `src/hooks`
4. Vitest configured with at least one passing test
5. Git repo initialized with conventional commits setup
6. README with project overview and dev commands
7. `.gitignore` excludes `node_modules`, `dist`, `.env`

### Story 1.2: CSV Parser for Nubank Format

**As a** user with a Nubank CSV export,
**I want** to upload my file and have it parsed correctly,
**so that** I can see my transaction data visualized.

**Acceptance Criteria:**
1. Drag-and-drop file upload zone accepts `.csv` files only
2. Nubank CSV format detected (columns: `data`, `descricao`, `valor`, `tipo`)
3. Parser extracts: date (YYYY-MM-DD), description, amount (float), type (income/expense)
4. Handles UTF-8 encoding, comma-separated values, quoted strings
5. Validates required columns exist, shows clear error if missing
6. Handles empty files, malformed rows gracefully (skip + log)
7. Returns normalized array: `Transaction[]` with proper TypeScript types
8. Parsing < 2 seconds for 5,000 rows

### Story 1.3: CSV Parser for Inter Format

**As a** user with an Inter CSV export,
**I want** to upload my file and have it parsed correctly,
**so that** I can see my transaction data visualized.

**Acceptance Criteria:**
1. Inter CSV format auto-detected (different column structure than Nubank)
2. Parser handles Inter's specific format (columns may differ)
3. Normalizes to same `Transaction[]` type as Nubank
4. Date parsing handles Inter's date format if different
5. Amount parsing handles Inter's format (positive/negative vs separate column)
6. Same validation and error handling as Story 1.2
7. Document Inter format in code comments for community contribution

### Story 1.4: Transaction Categorization Engine

**As a** user,
**I want** my transactions automatically categorized (Alimentação, Transporte, etc.),
**so that** I can see spending breakdown without manual work.

**Acceptance Criteria:**
1. Categorization function accepts `description: string` → returns `category: string`
2. Keyword matching: "uber eats", "ifood", "delivery" → "Alimentação"
3. At least 10 base categories: Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Compras, Serviços, Transferências, Outros
4. Fallback to "Outros" for unmatched transactions
5. Case-insensitive matching, handles accented characters
6. Simple confidence scoring (exact match > partial match)
7. Returns match confidence % (for future UI display)
8. Categorizes 5,000 transactions in < 3 seconds

### Story 1.5: Data Aggregation and Summary

**As a** user,
**I want** to see summary statistics (total income, expense, balance, count),
**so that** I can quickly understand my financial picture.

**Acceptance Criteria:**
1. Aggregation function accepts `Transaction[]` → returns `Summary` object
2. Summary includes: `totalIncome`, `totalExpense`, `netBalance`, `transactionCount`
3. Filters by date range (start, end dates)
4. Groups by category: `CategorySummary[]` (name, amount, percentage)
5. Groups by month: `MonthlySummary[]` for trends
6. Handles edge cases: empty array, single transaction, future dates
7. All calculations use proper float arithmetic (toFixed(2) for display)
8. Type-safe with TypeScript

---

## Epic 2: Dashboard & Visualizations

**Goal:** Create the visual heart of the application - 4 stunning, interactive charts that transform categorized transaction data into beautiful, insightful graphics. This epic delivers the "WOW" moment users see after uploading their CSV.

### Story 2.1: Dashboard Layout and Summary Cards

**As a** user,
**I want** to see a clean dashboard with summary statistics at the top,
**so that** I can immediately understand my financial health.

**Acceptance Criteria:**
1. Responsive grid layout: 4 summary cards on desktop, 2x2 on tablet, stacked on mobile
2. Each card shows: icon, label, value, mini-sparkline or trend indicator
3. Cards: Total Income (green), Total Expense (red), Net Balance (blue/gold), Transaction Count
4. Cards use glassmorphism effect (backdrop-blur, semi-transparent bg)
5. Hover effect: slight scale (1.02x) and glow
6. Values formatted as BRL (R$ 1.234,56)
7. Loading skeleton state while data processes
8. Empty state when no data uploaded

### Story 2.2: Categories Donut Chart

**As a** user,
**I want** to see a donut chart showing spending by category,
**so that** I can understand where my money goes.

**Acceptance Criteria:**
1. Donut chart using Recharts with 10 category colors
2. Center text: total expense value
3. Hover slice: highlights, shows tooltip (category, amount, %)
4. Click slice: filters transaction table below
5. Legend: color dots, category names, percentages
6. Animation: spins in on load, slices fade in sequentially
7. Handles "Outros" category (gray, always last)
8. Export button appears on hover (PNG/PDF)

### Story 2.3: Cash Flow Bar Chart

**As a** user,
**I want** to see income vs expenses per month as a bar chart,
**so that** I can compare my cash flow over time.

**Acceptance Criteria:**
1. Grouped bar chart (green = income, red = expense) by month
2. X-axis: Month labels (Jan, Fev, Mar...)
3. Y-axis: Currency values (BRL)
4. Hover bar: tooltip with exact amounts
5. Net line overlay: shows difference (income - expense)
6. Animation: bars grow up from zero
7. Handles months with no data (shows zero)
8. Zoomable (click/drag to select date range)

### Story 2.4: Trends Line Chart

**As a** user,
**I want** to see a line chart showing expense trends over time,
**so that** I can spot patterns and anomalies.

**Acceptance Criteria:**
1. Line chart with smooth curves (Catmull-Rom interpolation)
2. One line per category (top 5 categories, others grouped)
3. X-axis: Timeline (daily, weekly, or monthly based on range)
4. Y-axis: Currency values
5. Hover: crosshair with tooltip for all visible lines
6. Click legend item: toggle line visibility
7. Annotation dots for outliers (>2std from mean)
8. Gradient fill under lines for visual appeal

### Story 2.5: Balance Area Chart

**As a** user,
**I want** to see my accumulated balance over time as an area chart,
**so that** I can visualize my financial trajectory.

**Acceptance Criteria:**
1. Area chart showing cumulative balance (starting from first transaction)
2. Gradient fill (purple, semi-transparent)
3. X-axis: Timeline
4. Y-axis: Balance values (can be negative)
5. Zero line highlighted (when balance crosses)
6. Hover: tooltip with date and balance
7. Color coding: green when positive, red when negative
8. Animation: draws left-to-right

### Story 2.6: Transaction Table with Filters

**As a** user,
**I want** to see and search through my individual transactions,
**so that** I can verify the data and find specific items.

**Acceptance Criteria:**
1. Table with columns: Date, Description, Category, Amount, Type
2. Sortable by all columns (click header)
3. Search input filters by description text (real-time)
4. Date range picker filters transactions
5. Pagination: 50 rows per page
6. Color coding: income = green text, expense = red text
7. Click row: highlights corresponding slice/bar on charts
8. Export table as CSV button

---

## Epic 3: Polish, Export & Launch

**Goal:** Add the polish that makes the product feel premium, enable users to save and share their visualizations, and deploy to production for real users. This epic transforms a working prototype into a shipped product.

### Story 3.1: Animations and Micro-interactions

**As a** user,
**I want** smooth animations throughout the app,
**so that** it feels polished and delightful to use.

**Acceptance Criteria:**
1. Page load: Hero text fades in, upload zone slides up
2. Upload success: Confetti or checkmark animation
3. Charts reveal: Staggered fade-in (donut → bar → line → area, 200ms delay each)
4. Hover effects: All interactive elements scale 1.02x - 1.05x
5. Button clicks: Ripple or scale-down effect
6. Page transitions: Smooth fade when switching views
7. Loading: Skeleton shimmer with gradient
8. Export success: Toast notification + download animation

### Story 3.2: Export Charts as Image/PDF

**As a** user,
**I want** to export my charts as PNG or PDF,
**so that** I can share them on social media or save for reference.

**Acceptance Criteria:**
1. Export button on each chart (appears on hover)
2. PNG export at 1920x1080 minimum (2x for retina)
3. PDF export with chart title and date
4. "Export All" button creates combined PDF with all 4 charts
5. Export includes summary cards at top
6. File naming: `finances-YYYY-MM-DD.png/pdf`
7. Loading state during export generation
8. Success message with file size hint

### Story 3.3: Shareable Dashboard Links

**As a** user,
**I want** to generate a temporary link to share my dashboard,
**so that** others can view my visualizations.

**Acceptance Criteria:**
1. "Share" button generates unique URL
2. Link expires after 24 hours (shows countdown)
3. Share view is read-only (no filters, no export)
4. Share view shows "Create your own" CTA
5. URL is short and readable (e.g., `/share/abc123`)
6. Copy to clipboard button with success feedback
7. Shows preview image on social media (Open Graph tags)
8. Rate limit: max 5 share links per hour per IP

### Story 3.4: Error Handling and Edge Cases

**As a** user,
**I want** clear error messages when something goes wrong,
**so that** I understand what happened and how to fix it.

**Acceptance Criteria:**
1. Invalid CSV format: "Formato não suportado. Use Nubank ou Inter."
2. Empty CSV: "Arquivo vazio. Verifique e tente novamente."
3. Malformed rows: "X linhas com erro foram ignoradas."
4. File too large: "Arquivo muito grande. Máximo 10MB."
5. Network error (if using any API): "Erro de conexão. Tente novamente."
6. Fallback UI for JavaScript disabled
7. Export failed: "Erro ao exportar. Tente novamente."
8. All errors show appropriate icon + retry action

### Story 3.5: PWA Capabilities and Offline Support

**As a** user,
**I want** the app to work offline after first load,
**so that** I can use it without internet.

**Acceptance Criteria:**
1. Service worker registered and caches app shell
2. Manifest.json for "Add to Home Screen"
3. Offline page shows when network unavailable
4. Background sync for failed uploads (when online)
5. App icons in multiple sizes (72, 96, 128, 144, 152, 192, 384, 512)
6. Theme color matches brand (purple)
7. Works as installed app on iOS/Android
8. Cache invalidation strategy (update on new version)

### Story 3.6: Testing and Bug Fixes

**As a** developer,
**I want** comprehensive testing before launch,
**so that** users have a smooth experience.

**Acceptance Criteria:**
1. Test with real Nubank CSV (at least 5 different users' data)
2. Test with real Inter CSV (at least 3 different users' data)
3. Test edge cases: 1 transaction, 10k transactions, future dates, negative balances
4. Test on browsers: Chrome, Firefox, Safari, Edge
5. Test on mobile: iPhone Safari, Android Chrome
6. Test export: all charts download correctly
7. Test share: links work and expire properly
8. Fix all critical bugs found during testing
9. Document known issues for v1.1

### Story 3.7: Production Deployment and Launch

**As a** developer,
**I want** the app deployed to a public URL,
**so that** real users can access it.

**Acceptance Criteria:**
1. Vercel project connected to GitHub repo
2. Automatic deployment on push to `main`
3. Custom domain configured (if available)
4. Environment variables set (if any)
5. Analytics: Plausible or similar (privacy-first)
6. Meta tags for SEO and social sharing
7. Robots.txt and sitemap.xml
8. 404 page with "Return to home" link
9. Launch tweet/post with demo GIF
10. README with live link, features, how to use

---

## Next Steps

### For UX Design Expert

Create detailed UI mockups and design system based on the visual identity defined in this PRD. Focus on the dark theme, glassmorphism effects, and chart layouts. Design the upload flow as a key moment—it's the first interaction users have.

### For Architect

Validate the technical assumptions, particularly:
- Client-side only vs server-side for share links (Vercel Blob recommended)
- Categorization approach (keyword matching vs embeddings for MVP)
- Chart library choice (Recharts vs Chart.js vs D3)
- Deployment architecture for Vercel

Consider the 30-day timeline and recommend any shortcuts or trade-offs that maintain quality while shipping faster.

---

*PRD v1.0 - 30-Day Challenge Edition*
*Generated by AIOS Framework*
*Product Manager: @pm (Morgan)*
*Date: 2026-02-03*
