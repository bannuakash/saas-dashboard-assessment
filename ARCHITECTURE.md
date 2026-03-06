# Enterprise SaaS Dashboard - Complete Architecture Guide

A production-grade Enterprise SaaS Dashboard application built with React, Vite, TypeScript, and Tailwind CSS. This application demonstrates best practices in frontend architecture, state management, and UI/UX patterns.

## 📋 Table of Contents

1. [Architecture Overview](#-architecture-overview)
2. [Project Structure](#-project-structure)
3. [State Management](#-state-management)
4. [Service Layer](#-service-layer)
5. [Components](#-components)
6. [Features Implemented](#-features-implemented)
7. [Getting Started](#-getting-started)
8. [Code Examples](#-code-examples)

## 🏗️ Architecture Overview

### Technology Stack

```
Frontend: React 18.x + Vite
Language: TypeScript (strict mode)
Styling: Tailwind CSS + PostCSS
State Management: Zustand
Charts: Recharts (ready to integrate)
UI Icons: Lucide React
Data Layer: Mock services with simulation
```

### Core Principles

1. **Separation of Concerns**: Components, services, and stores are clearly separated
2. **Type Safety**: 100% TypeScript coverage with strict mode enabled
3. **Reusability**: Design system components and custom hooks
4. **Scalability**: Structure ready for backend integration
5. **Performance**: Memoization, debouncing, and efficient state updates
6. **Testing Ready**: Service layer mockable, services easily replaceable

## 📁 Project Structure

```
src/
├── app/                                    # Application entry point (future)
├── components/
│   ├── ui/                                # Design system components
│   │   ├── Button.tsx                    # Button component (all variants)
│   │   ├── Badge.tsx                     # Status badges
│   │   ├── Card.tsx                      # Container component
│   │   ├── Input.tsx                     # Form input with validation
│   │   ├── Modal.tsx                     # Dialog component
│   │   ├── Feedback.tsx                  # Alert, Spinner, Skeleton
│   │   └── index.ts                      # Barrel export
│   └── layout/
│       └── Layout.tsx                    # Main app layout (Sidebar, Header)
├── features/
│   ├── campaigns/
│   │   ├── components/
│   │   │   ├── CampaignTable.tsx        # Sortable campaign table
│   │   │   ├── CampaignListPage.tsx     # Full campaign list page
│   │   │   ├── FilterPanel.tsx          # Multi-filter panel
│   │   │   ├── Pagination.tsx           # Smart pagination
│   │   │   └── index.ts                 # Barrel export
│   │   ├── hooks/
│   │   │   └── useCampaigns.ts          # Custom hook for campaign management
│   │   ├── services/
│   │   │   ├── campaignService.ts       # Campaign API simulation
│   │   │   └── index.ts                 # Service exports
│   │   ├── types/
│   │   │   └── index.ts                 # Campaign TypeScript types
│   │   └── index.ts                     # Feature barrel export
│   └── jobs/
│       ├── types.ts                      # Job TypeScript types
│       └── jobService.ts                 # Job polling simulation
├── store/
│   └── campaignStore.ts                  # Zustand global state
├── services/
│   └── (placeholder for shared services)
├── utils/
│   ├── constants.ts                      # Global constants & enums
│   └── helpers.ts                        # Utility functions
├── mock-data/
│   └── index.ts                          # Mock campaign & job data
├── App.tsx                               # Main app component
├── App.css                               # (empty, using Tailwind)
├── index.css                             # Tailwind directives
└── main.tsx                              # React entry point
```

## 🎯 State Management

### Zustand Store Architecture

**File**: `src/store/campaignStore.ts`

```typescript
interface CampaignState {
  // ---- Data ----
  campaigns: Campaign[]
  selectedCampaigns: Set<string>
  totalCampaigns: number
  
  // ---- Pagination ----
  page: number
  limit: number
  totalPages: number
  
  // ---- Filters ----
  filters: FilterOptions
  
  // ---- UI State ----
  isLoading: boolean
  error: string | null
  
  // ---- Jobs ----
  jobs: Job[]
  activeJobId: string | null
  
  // ---- Actions ----
  fetchCampaigns: () => Promise<void>
  setPage: (page: number) => void
  setFilters: (filters: Partial<FilterOptions>) => void
  updateCampaignStatus: (id: string, status: CampaignStatus) => Promise<void>
  toggleCampaignSelection: (id: string) => void
  selectAllCampaigns: () => void
  deselectAllCampaigns: () => void
  bulkUpdateCampaigns: (ids: string[], payload: Record<string, unknown>) => Promise<void>
  // ... more actions
}
```

### State Flow

```
User Interaction
    ↓
Component Hook (useCampaigns)
    ↓
Zustand Store (useCampaignStore)
    ↓
Service Layer (campaignService)
    ↓
Mock Data (in-memory)
    ↓
Store Updates
    ↓
Component Re-render
```

### Selection State Pattern

The store uses `Set<string>` for selected campaigns:

```typescript
// Add to selection
selectedCampaigns.add(id)

// Remove from selection
selectedCampaigns.delete(id)

// Check if selected
selectedCampaigns.has(id)

// Bulk selection
selectedCampaigns = new Set(campaigns.map(c => c.id))
```

## 🔧 Service Layer

### Campaign Service (`campaignService`)

All API calls are simulated with delays and random failures.

**Methods**:

```typescript
async fetchCampaigns(
  filters: Partial<FilterOptions>,
  pagination: PaginationParams
): Promise<CampaignListResponse>
```
- Filters by status, budget, search term
- Supports sorting and pagination
- Simulates 300-1000ms delay
- 5% failure probability

```typescript
async updateCampaignStatus(
  id: string,
  status: CampaignStatus
): Promise<Campaign>
```
- Updates single campaign status
- Optimistic UI update
- Simulated delay with failure chance

```typescript
async bulkUpdateCampaigns(
  ids: string[],
  payload: CampaignUpdatePayload
): Promise<Campaign[]>
```
- Update multiple campaigns
- Used for selecting and bulk updating

### Job Service (`jobService`)

Background job simulation with polling.

**Methods**:

```typescript
async createJob(
  type: Job['type'],
  config?: JobConfig
): Promise<Job>
```
- Create pending job
- Initialize progress tracking
- Return job object

```typescript
async pollJobStatus(id: string): Promise<Job>
```
- Simulate job progress
- Auto-advance from pending → processing → completed/failed
- 10% failure rate during completion

```typescript
startPolling(
  jobId: string,
  callback: (job: Job) => void,
  onError?: (error: Error) => void
): () => void
```
- Start background polling
- Auto-update job every 2 seconds
- Return unsubscribe function

### Mock Data Simulation

**File**: `src/mock-data/index.ts`

```typescript
// 47 mock campaigns with random properties
export const MOCK_CAMPAIGNS: Campaign[]

// Generate campaign detail with performance metrics
export const getCampaignDetail(id: string): CampaignDetail

// Mock completed jobs
export const MOCK_JOBS: Job[]
```

### Simulation Utilities

**File**: `src/utils/helpers.ts`

```typescript
simulateDelay(min?: number, max?: number): Promise<void>
  // Default: 300-1000ms

shouldFail(probability?: number): boolean
  // Default: 5% failure rate

debounce<T>(func: T, delay: number): (...args) => void
  // Debounce function calls
```

## 🎨 Components

### Design System Components

Located in `src/components/ui/`

#### Button Component

```typescript
<Button 
  variant="primary" | "secondary" | "danger" | "ghost"
  size="sm" | "md" | "lg"
  isLoading={boolean}
  onClick={handler}
>
  Button Label
</Button>
```

**Features**:
- 4 visual variants
- 3 size options
- Loading state with spinner
- Accessibility-ready

#### Card Component

```typescript
<Card 
  header={<h2>Title</h2>}
  footer={<div>Footer</div>}
>
  Content
</Card>
```

**Features**:
- Header, content, footer sections
- Border and shadow styling
- Flexible layout

#### Modal Component

```typescript
<Modal
  isOpen={boolean}
  onClose={handler}
  title="Modal Title"
  size="sm" | "md" | "lg"
  footer={<Button>Action</Button>}
>
  Modal Content
</Modal>
```

**Features**:
- Backdrop with click-to-close
- Header with close button
- Customizable footer
- 3 size options

#### Input Component

```typescript
<Input
  type="text"
  label="Field Label"
  error="Error message"
  helperText="Help text"
  value={state}
  onChange={handler}
/>
```

**Features**:
- Label support
- Error state styling
- Helper text
- Validation-ready

#### Alert Component

```typescript
<Alert 
  variant="success" | "error" | "warning" | "info"
  title="Alert Title"
  onClose={handler}
>
  Alert message
</Alert>
```

**Features**:
- 4 color variants
- Icons for each type
- Dismissible
- Accessible

#### Feedback Components

```typescript
<Spinner size="sm" | "md" | "lg" />
<Skeleton count={5} className="h-8" />
```

### Layout Components

#### Layout Wrapper

```typescript
<Layout>
  {children}
</Layout>
```

**Includes**:
- Responsive sidebar navigation
- Top header with user profile
- Main content area
- Mobile hamburger menu

#### Sidebar

- Fixed navigation (desktop)
- Mobile overlay
- Active state tracking
- Icon + label navigation

#### Header

- Logo and title
- Notification bell
- User profile avatar
- Hamburger menu toggle (mobile)

### Campaign Features Components

#### Campaign Table

```typescript
<CampaignTable
  campaigns={campaignList}
  selectedIds={selectedSet}
  onSelectAll={handler}
  onToggleSelect={handler}
  onStatusChange={handler}
  onRowClick={handler}
  sortBy="name"
  sortOrder="asc"
  onSort={handler}
/>
```

**Features**:
- Checkbox selection
- Sortable columns
- Status dropdown
- Performance progress bar
- Click to view details
- Campaign ID display

#### Filter Panel

```typescript
<FilterPanel
  filters={filterOptions}
  onFiltersChange={handler}
  onReset={handler}
/>
```

**Filters**:
- Search by name (text input)
- Status checkboxes (draft, active, paused, completed)
- Budget range (min/max inputs)
- Sort by dropdown
- Sort order (asc/desc)

#### Pagination

```typescript
<Pagination
  currentPage={number}
  totalPages={number}
  totalItems={number}
  itemsPerPage={number}
  onPageChange={handler}
/>
```

**Features**:
- Previous/Next buttons
- Page number buttons
- Smart ellipsis for large page counts
- Item count display
- Disabled states

#### Campaign List Page

Complete campaign management page combining:
- Search input with debounce
- Bulk action buttons (Update, Delete)
- Campaign table with all features
- Filter panel with live updates
- Pagination
- Bulk update modal
- Error alert display

## 🎯 Features Implemented

### Campaign Management

✅ **Sortable Table**
- Click headers to sort
- Multiple sort fields (name, budget, performance, date)
- Ascending/descending toggle
- Visual sort indicators

✅ **Multi-Filter Panel**
- Status filter (checkboxes)
- Budget range (min/max)
- Search by name
- Sort options
- Clear filters button

✅ **Pagination**
- Navigate pages
- Smart page number display
- Configurable items per page
- Total items display

✅ **Bulk Selection**
- Select/deselect individual campaigns
- Select all visible campaigns
- Toggle selection state
- Automatic clearing after operations
- Checkbox state management

✅ **Status Updates**
- Dropdown status change on each row
- Bulk status update modal
- Optimistic UI updates
- Loading states

✅ **Performance Metrics**
- Performance score (0-100%)
- Visual progress bar
- Color-coded performance level

### Global State

✅ **Zustand Store**
- Campaigns list state
- Pagination state
- Filter state
- Selection state
- Job tracking
- Error/loading states
- Easy subscription pattern

✅ **Custom Hooks**
- `useCampaigns()` hook
- Debounced search handling
- Memoized handlers
- Error management

### Service Layer

✅ **Campaign Service**
- Simulated API calls
- Realistic delays
- Random failures (5%)
- In-memory data updates
- Complete CRUD operations

✅ **Job Service**
- Background job creation
- Status polling
- Progress tracking
- Auto-completion detection
- Failure simulation
- Polling subscription pattern

### Mock Data

✅ **47 Mock Campaigns**
- Randomized properties
- All status types
- Varying budgets
- Performance scores
- Realistic dates

✅ **Campaign Details**
- Performance metrics
- Click-through rates
- Cost per acquisition
- Return on investment

### UX/Edge Cases

✅ **Loading States**
- Spinner during fetch
- Loading text
- Disabled buttons

✅ **Empty States**
- Helpful message when no data
- Suggest filter adjustments

✅ **Error Handling**
- Dismissible alert
- Error message display
- Retry capability
- Error logging ready

✅ **Debounced Search**
- 300ms debounce
- Prevents excessive filtering
- Smoother user experience

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Verify TypeScript
npm run build
```

### Development

```bash
# Start dev server (HMR enabled)
npm run dev

# Open in browser
# navigate to http://localhost:5173

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run type-check # Run TypeScript type check
npm run lint     # Run ESLint (if configured)
```

## 💡 Code Examples

### Using the Campaign Hook

```typescript
import { useCampaigns } from '@/features/campaigns/hooks/useCampaigns'

function MyCampaignComponent() {
  const {
    campaigns,
    isLoading,
    error,
    handleSearch,
    handleStatusChange,
    handleSelectAll,
  } = useCampaigns()

  return (
    <div>
      {error && <Alert variant="error">{error}</Alert>}
      {isLoading && <Spinner />}
      <CampaignTable 
        campaigns={campaigns}
        onStatusChange={handleStatusChange}
        onSelectAll={handleSelectAll}
      />
    </div>
  )
}
```

### Creating a Background Job

```typescript
import { useCampaignStore } from '@/store/campaignStore'

function ExportCampaigns() {
  const { createJob, jobs } = useCampaignStore()

  const handleExport = async () => {
    await createJob('campaign_export')
    // Job is now in jobs list with ID
  }

  return (
    <div>
      {jobs.map(job => (
        <JobProgressCard key={job.id} job={job} />
      ))}
      <Button onClick={handleExport}>Export</Button>
    </div>
  )
}
```

### Service Layer Usage

```typescript
import { campaignService } from '@/features/campaigns/services'

// Fetch with filters
const result = await campaignService.fetchCampaigns(
  {
    status: ['active', 'paused'],
    minBudget: 5000,
    search: 'Q4',
    sortBy: 'budget',
    sortOrder: 'desc',
  },
  { page: 1, limit: 10 }
)

// Update campaign
await campaignService.updateCampaignStatus(
  'campaign-id-123',
  'paused'
)

// Bulk operations
await campaignService.bulkUpdateCampaigns(
  ['id1', 'id2', 'id3'],
  { status: 'completed' }
)
```

### Polling for Jobs

```typescript
import { jobService } from '@/features/jobs/jobService'

async function watchJobCompletion() {
  const job = await jobService.createJob('campaign_report')
  
  const unsubscribe = jobService.startPolling(
    job.id,
    (updatedJob) => {
      console.log(`Job progress: ${updatedJob.progress}%`)
      
      if (updatedJob.status === 'completed') {
        console.log('Job completed!', updatedJob.result)
      }
    },
    (error) => {
      console.error('Polling error:', error)
    }
  )
  
  // Polling runs automatically and stops at completion
  // Call unsubscribe() to manually stop
}
```

## 📊 Data Types

### Campaign Type

```typescript
interface Campaign {
  id: string
  name: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  budget: number
  startDate: string // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD
  performanceScore: number // 0-100
  createdAt: string  // ISO timestamp
  updatedAt: string  // ISO timestamp
}
```

### Job Type

```typescript
interface Job {
  id: string
  type: 'campaign_export' | 'campaign_report' | 'bulk_update' | 'data_sync'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number // 0-100
  createdAt: string
  updatedAt: string
  startedAt?: string
  completedAt?: string
  error?: string
  result?: Record<string, unknown>
}
```

### Filter Options

```typescript
interface FilterOptions {
  status: CampaignStatus[]
  minBudget: number
  maxBudget: number
  search: string
  sortBy: 'name' | 'budget' | 'performance' | 'date'
  sortOrder: 'asc' | 'desc'
}
```

## 🔮 Future Enhancements

### Phase 2: Campaign Detail Page
- Overview tab with editable form
- Assets tab with drag-drop upload simulation
- Performance tab with Recharts charts
- Validation and unsaved changes warning

### Phase 3: Advanced Features
- Real-time updates with WebSocket
- Advanced filtering with date ranges
- Custom report builder
- Email notifications
- User role-based access control

### Phase 4: Backend Integration
- Replace mock services with real APIs
- Add authentication
- Add database persistence
- Add audit logging
- Scale to microservices

## 📚 Learning Resources

This project demonstrates:

✅ Clean Architecture for React apps
✅ TypeScript strict mode best practices
✅ Zustand state management pattern
✅ Custom hook design
✅ Service layer abstraction
✅ Mock data simulation strategies
✅ Component composition and reusability
✅ Tailwind CSS utility-first styling
✅ React performance optimization
✅ Error handling and UX patterns

## 📄 Configuration Files

- **tsconfig.json** - TypeScript root config
- **tsconfig.app.json** - App-specific TypeScript config (strict mode)
- **tsconfig.node.json** - Node/build tool config
- **tailwind.config.js** - Tailwind CSS customization
- **postcss.config.js** - PostCSS with Tailwind plugin
- **vite.config.ts** - Vite build tool config

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

*Last Updated: March 2026*
