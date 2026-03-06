# Enterprise SaaS Dashboard

A **production-grade SaaS dashboard application** built with React, Vite, TypeScript, and Tailwind CSS. This project demonstrates professional frontend architecture, comprehensive state management, and real-world UI/UX patterns.

**GitHub**: https://github.com/bannuakash/saas-dashboard-assessment

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Feature Highlights](#-feature-highlights)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [State Management](#-state-management)
- [Data Simulation Strategy](#-data-simulation-strategy)
- [Performance Optimization](#-performance-optimization)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Design System](#-design-system)
- [API Integration Guide](#-api-integration-guide)

---

## 🎯 Overview

This is a **fully-functional, feature-complete SaaS dashboard** that showcases enterprise-level frontend engineering practices:

- **47 Mock Campaigns** with realistic data, filtering, sorting, and pagination
- **Campaign Management System** with multi-filter support and bulk operations
- **Campaign Detail Pages** with tabbed interface (Overview, Assets, Performance)
- **Job Simulation Engine** with polling behavior and progress tracking
- **Production-Ready UI** with comprehensive error handling and loading states
- **Zero TypeScript Errors** with strict mode enabled
- **Responsive Design** optimized for mobile, tablet, and desktop

**No backend required** — entire application runs locally with simulated async operations.

---

## ✨ Feature Highlights

### Campaign Management
- ✅ **Sortable Table**: Click column headers to sort by Name, Status, Budget, or Performance Score
- ✅ **Multi-Filter Panel**: Filter by status, budget range, with dynamic search
- ✅ **Debounced Search**: 300ms debounce for performant filtering
- ✅ **Smart Pagination**: Shows "1-10 of 47 results" with smart page navigation
- ✅ **Bulk Selection**: Select multiple campaigns and perform batch status updates
- ✅ **Optimistic UI**: Instant UI updates with 500-1000ms simulated async delays
- ✅ **Real-time Feedback**: Toast notifications for all actions

### Campaign Detail Views
- **Overview Tab**: Editable form with real-time validation (name, budget, dates, objectives)
- **Assets Tab**: Drag-and-drop file upload simulation with progress bars and retry logic
- **Performance Tab**: Interactive Recharts graphs (daily line chart, hourly bar chart) with metrics cards

### Job Simulation Engine
- 🔄 **Job Lifecycle**: Pending → Processing → Completed/Failed states
- ⏱️ **Smart Polling**: Service-layer polling every 2 seconds with subscription callbacks
- 📊 **Progress Tracking**: Animated progress bars and job status indicators
- 🎯 **Bulk Operations**: Create jobs for Export, Report, Sync, Bulk Update
- ✨ **Status Indicators**: Color-coded badges with icons (yellow pending, blue processing, green completed, red failed)

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | React | 19.2.0 | UI library with hooks |
| **Build Tool** | Vite | 7.3.1 | Fast bundling and dev server |
| **Language** | TypeScript | 5.9.3 | Type safety (strict mode) |
| **Styling** | Tailwind CSS | 4.2.1 | Utility-first CSS framework |
| **State** | Zustand | 5.0.11 | Global state management |
| **Charts** | Recharts | 3.7.0 | Data visualization (line, bar) |
| **Icons** | Lucide React | 0.577.0 | SVG icon library |
| **UI Components** | Headless UI | 2.2.9 | Accessible component primitives |
| **Router** | React Router | 7.13.1 | Client-side navigation (configured) |
| **Utilities** | clsx | 2.1.1 | Conditional className builder |

---

## 🏗️ Architecture

### Core Principles

```
┌─────────────────────────────────────────────┐
│         React Components (UI Layer)         │
│  - Campaign List, Detail, Jobs Pages       │
│  - Reusable Design System Components       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│      Custom Hooks (Integration Layer)       │
│  - useCampaigns, useCampaignDetail         │
│  - useJobPolling                           │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│    Service Layer (Business Logic)           │
│  - campaignService.ts (filtering, sorting) │
│  - jobService.ts (polling, lifecycle)      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  State Management (Zustand Stores)          │
│  - campaignStore.ts (global state)         │
└─────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **Service-Layer Abstraction**: All business logic isolated in `services/` folder. Perfect for swapping mock services to real API calls without touching components.

2. **Subscription-Based Polling**: `jobService.ts` uses a Map-based subscription system instead of imperative polling. Allows multiple subscribers to a single job and clean cleanup.

3. **Custom Hooks for Integration**: Hooks bridge components to services + stores, handling side effects, state management, and cleanup (e.g., polling unsubscribe on unmount).

4. **Design System First**: All UI components built in `components/ui/` following design patterns (Button, Card, Input, Modal, Badge, Alert). Ensures consistency and reusability.

5. **Type-First Development**: 100% TypeScript coverage with strict mode. All data flows are type-safe from component props to store state.

---

## 📁 Project Structure

```
src/
├── App.tsx                              # Main router entry point
├── index.css                            # Global Tailwind styles
│
├── components/
│   ├── ui/                              # Design System Components
│   │   ├── Button.tsx                  # Buttons (primary, secondary, danger)
│   │   ├── Card.tsx                    # Container component
│   │   ├── Input.tsx                   # Form inputs with validation styling
│   │   ├── Modal.tsx                   # Dialog/modal component
│   │   ├── Badge.tsx                   # Status badges
│   │   ├── Feedback.tsx                # Alert, Spinner, Skeleton loaders
│   │   └── index.ts                    # Barrel export for all UI components
│   │
│   └── layout/
│       └── Layout.tsx                  # Sidebar + main layout
│
├── features/
│   ├── campaigns/                       # Campaign Management Feature
│   │   ├── components/
│   │   │   ├── CampaignListPage.tsx    # Main campaigns page
│   │   │   ├── CampaignTable.tsx       # Sortable data table
│   │   │   ├── FilterPanel.tsx         # Multi-filter controls
│   │   │   ├── Pagination.tsx          # Smart pagination
│   │   │   ├── CampaignDetail.tsx      # Detail page container (3 tabs)
│   │   │   ├── CampaignDetailOverview.tsx  # Overview tab with form
│   │   │   ├── CampaignDetailAssets.tsx    # Assets tab with drag-drop
│   │   │   ├── CampaignDetailPerformance.tsx # Performance tab with charts
│   │   │   └── index.ts                # Barrel export
│   │   │
│   │   ├── hooks/
│   │   │   ├── useCampaigns.ts         # Campaign list logic (filtering, sorting, search)
│   │   │   ├── useCampaignDetail.ts    # Detail page logic (form state, uploads)
│   │   │   └── index.ts                # Barrel export
│   │   │
│   │   ├── services/
│   │   │   ├── campaignService.ts      # Campaign filtering, sorting, pagination logic
│   │   │   └── index.ts
│   │   │
│   │   ├── types/
│   │   │   ├── index.ts                # Campaign interface types
│   │   │   └── detail.ts               # Detail page types
│   │   │
│   │   └── index.ts                    # Feature barrel export
│   │
│   └── jobs/                            # Job Simulation Feature
│       ├── components/
│       │   ├── JobsPage.tsx            # Main jobs dashboard
│       │   ├── JobsList.tsx            # Job list + history
│       │   ├── JobStatusIndicator.tsx  # Status badge/card component
│       │   └── index.ts
│       │
│       ├── hooks/
│       │   └── useJobPolling.ts        # Job polling state management
│       │
│       ├── types.ts                    # Job interface types
│       ├── jobService.ts               # Job polling + lifecycle logic
│       └── index.ts
│
├── store/
│   └── campaignStore.ts                # Zustand global state (campaigns, filters)
│
├── mock-data/
│   └── index.ts                        # 47 mock campaigns with realistic data
│
├── utils/
│   ├── constants.ts                    # Global constants (pagination, polling intervals)
│   └── helpers.ts                      # 20+ utility functions (debounce, formatters, etc)
│
└── services/
    └── (placeholder for future shared services)
```

---

## 🎮 State Management

### Zustand Store (Global State)

```typescript
// src/store/campaignStore.ts
export const useCampaignStore = create((set) => ({
  campaigns: [],
  filters: { search: '', status: [], budgetRange: [0, 100000], sortBy: 'name', sortOrder: 'asc' },
  setCampaigns: (campaigns) => set({ campaigns }),
  updateFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
}));
```

**Usage in Components**:
```typescript
const { campaigns, filters } = useCampaignStore();
```

### Custom Hooks for Complex Logic

**`useCampaigns.ts`** — Campaign list management:
- ✅ Manages filter state (search, status, budget, sort)
- ✅ Debounced search (300ms)
- ✅ Pagination (10 items/page)
- ✅ Bulk selection state
- ✅ Service integration (filtering, sorting)

**`useCampaignDetail.ts`** — Campaign detail page:
- ✅ Form state management
- ✅ Real-time validation
- ✅ Upload progress tracking
- ✅ Simulated API delays (500-1000ms)

**`useJobPolling.ts`** — Job lifecycle management:
- ✅ Job list state (active, completed, failed)
- ✅ Create/cancel/retry job operations
- ✅ Automatic polling subscriptions
- ✅ Cleanup on unmount

### Why This Approach?

- **Separation of Concerns**: Components focus on UI, hooks handle state logic, services handle business logic
- **Testability**: Each layer can be tested independently
- **Backend Integration Ready**: Replace service calls without touching components/hooks
- **No Prop Drilling**: Global state for campaigns, local hooks for feature-specific state

---

## 📊 Data Simulation Strategy

### Mock Data Layer (`src/mock-data/index.ts`)

```typescript
// 47 realistic campaign objects with:
export const MOCK_CAMPAIGNS = [
  {
    id: '1',
    name: 'Q1 Product Launch',
    status: 'active',
    budget: 50000,
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    performanceScore: 85,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    // ... more fields
  },
  // ... 46 more campaigns
];
```

### Service Layer Simulation

**Filtering & Sorting** (`campaignService.ts`):
```typescript
export const applyFilters = (campaigns, filters) => {
  return campaigns
    .filter(c => c.name.includes(filters.search))
    .filter(c => !filters.status.length || filters.status.includes(c.status))
    .filter(c => c.budget >= filters.budgetRange[0] && c.budget <= filters.budgetRange[1]);
};

export const applySorting = (campaigns, sortBy, sortOrder) => {
  const sorted = [...campaigns].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    return aVal > bVal ? 1 : -1;
  });
  return sortOrder === 'asc' ? sorted : sorted.reverse();
};
```

**Polling Simulation** (`jobService.ts`):
```typescript
// Service uses real setInterval() for polling
// Tracks job progress: 0% → 100%
// Simulates state transitions: pending → processing → completed/failed
// Supports 15% failure rate for realistic testing
```

### Why This Approach?

✅ **No Backend Required** — Entire app runs locally
✅ **Realistic Async Simulation** — setInterval() mimics real API polling
✅ **Service Layer Pattern** — Drop-in replacement for real API calls
✅ **Controllable Delays** — Easy to test error states and slow networks

---

## ⚡ Performance Optimization

### 1. **Component-Level Optimization**

- **Memoization**: Heavy components wrapped with `React.memo()`
- **useCallback**: Event handlers memoized to prevent re-renders
- **useMemo**: Expensive calculations cached

### 2. **Debouncing**

```typescript
// 300ms debounce on search input
const debouncedSearch = useMemo(
  () => debounce((query) => updateFilters({ search: query }), 300),
  [updateFilters]
);
```

### 3. **Virtual Scrolling** (Ready for Scale)

Current pagination (10 items/page) prevents rendering large lists. For 10,000+ items, integrate `react-window`:
```bash
npm install react-window
```

### 4. **Code Splitting** (Ready for Large Scale)

React Router configured to enable lazy loading:
```typescript
const CampaignDetail = lazy(() => import('./features/campaigns/pages/CampaignDetail'));
```

### 5. **Bundle Optimization**

**Current Build Size**:
- JavaScript: 626.76 KB (187.62 KB gzipped)
- CSS: 26.34 KB (5.59 KB gzipped)

**Production Checklist**:
- ✅ Minified CSS and JS
- ✅ Tree-shaking enabled (ES modules)
- ✅ No unused dependencies
- ✅ Source maps included for debugging

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18+ (check with `node --version`)
- **npm**: v9+ (check with `npm --version`)

### Installation

```bash
# Clone the repository
git clone https://github.com/bannuakash/saas-dashboard-assessment.git
cd saas-dashboard-assessment

# Install dependencies
npm install

# Start development server
npm run dev
```

**Dev Server** opens at: `http://localhost:5175/`

### First Steps

1. **Explore Campaigns Page** (`/`):
   - Sort by clicking column headers
   - Filter by status and budget
   - Search campaigns (debounced)
   - Select campaigns and update status
   - Click campaign name to view details

2. **View Campaign Details**:
   - **Overview**: Edit campaign info with validation
   - **Assets**: Drag-drop files, watch upload progress
   - **Performance**: View interactive charts

3. **Test Jobs Page** (`/jobs`):
   - Create jobs using action buttons
   - Watch job lifecycle (Pending → Processing → Complete)
   - Cancel or retry failed jobs
   - Clear completed jobs

---

## 📜 Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start Vite dev server (http://localhost:5175) |
| `npm run build` | Build for production (`dist/` folder) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

---

## 🎨 Design System

### Component Library

All reusable UI components in `src/components/ui/`:

```typescript
import { Button, Card, Input, Modal, Badge, Alert, Spinner } from '@/components/ui';
```

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'rgb(59 130 246)', // blue-500
        success: 'rgb(34 197 94)',  // green-500
        danger: 'rgb(239 68 68)',   // red-500
        warning: 'rgb(202 138 4)',  // yellow-600
      },
    },
  },
};
```

### Styling Patterns

```typescript
// Using clsx for conditional classes
import clsx from 'clsx';

<button className={clsx(
  'px-4 py-2 rounded-lg transition-colors',
  variant === 'primary' && 'bg-blue-500 text-white',
  variant === 'secondary' && 'bg-gray-200 text-gray-800',
  disabled && 'opacity-50 cursor-not-allowed'
)}>
  {label}
</button>
```

---

## 🔌 API Integration Guide

### Migration from Mock to Real API

The current architecture makes it **easy to switch from mock data to real API**:

#### Step 1: Create API Service Layer

```typescript
// src/services/api/campaignApi.ts
export const getCampaigns = async (filters?: FilterOptions) => {
  const response = await fetch('/api/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters)
  });
  return response.json();
};
```

#### Step 2: Update campaignService.ts

```typescript
// Before (mock)
export const getCampaigns = () => Promise.resolve(MOCK_CAMPAIGNS);

// After (real API)
export const getCampaigns = () => campaignApi.getCampaigns();
```

#### Step 3: No Component Changes Required!

Hooks and components **don't know** if data is from mock or real API.

### Real-World API Pattern

```typescript
// useCampaigns.ts — Already set up for this pattern
const fetchCampaigns = async () => {
  try {
    setLoading(true);
    const data = await campaignService.getCampaigns(filters);
    setCampaigns(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

---

## 🧪 Testing Strategy

### Component Testing (Ready for Jest + React Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import { CampaignTable } from '@/features/campaigns';

test('renders campaign table with data', () => {
  render(<CampaignTable campaigns={mockCampaigns} />);
  expect(screen.getByText('Q1 Product Launch')).toBeInTheDocument();
});
```

### Service Testing

```typescript
import { applyFilters } from '@/features/campaigns/services';

test('filters campaigns by status', () => {
  const filtered = applyFilters(mockCampaigns, { status: ['active'] });
  expect(filtered.every(c => c.status === 'active')).toBe(true);
});
```

---

## 📈 Build & Deployment

### Production Build

```bash
npm run build
```

**Output**: `dist/` directory with optimized assets

### Deployment Options

**Option 1: Vercel** (Recommended)

```bash
npm install -g vercel
vercel
```

**Option 2: Netlify**

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Option 3: Traditional Hosting**

Copy `dist/` folder to your web server (Apache, Nginx, etc.)

---

## 🔐 Security Considerations

- ✅ **XSS Protection**: React escapes JSX by default
- ✅ **Type Safety**: TypeScript prevents common vulnerabilities
- ✅ **Input Validation**: Form validation on client and mock API
- ✅ **No Sensitive Data**: All data is mock/public

**Production Checklist**:
- Add CORS headers for real API
- Implement authentication/authorization
- Use HTTPS for all communications
- Validate all user inputs on backend
- Sanitize HTML content if displaying user-generated content

---

## 📚 Key Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Vite Guide](https://vitejs.dev/guide/)
- [Recharts Documentation](https://recharts.org/api)

---

## 🤝 Contributing

This is an assessment project. For improvements or bug reports, create an issue or submit a pull request.

---

## 📄 License

MIT License — Feel free to use this project for reference or learning.

---

## ✅ Assignment Completion Checklist

- ✅ React with TypeScript (strict mode)
- ✅ Vite build tool
- ✅ Tailwind CSS for styling
- ✅ Local mocked data (no external APIs)
- ✅ Feature-based folder architecture
- ✅ **Campaign Management**: Sortable table, multi-filters, debounced search, pagination, bulk selection, optimistic UI
- ✅ **Campaign Detail**: Tab navigation (Overview, Assets, Performance), form validation, drag-drop uploads, Recharts graphs
- ✅ **Job Simulation**: Pending → Processing → Completed/Failed lifecycle, service-layer polling
- ✅ **Global State**: Zustand store + custom hooks
- ✅ **Design System**: Reusable UI components
- ✅ **Production Ready**: Zero TypeScript errors, responsive design, error handling
- ✅ **GitHub Repository**: Source code hosted publicly
- ✅ **Comprehensive README**: Architecture, state management, data simulation, performance

---

**Built with ❤️ for the Frontend Engineering Assessment**

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
