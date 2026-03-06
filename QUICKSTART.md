# Quick Start Guide

## 🚀 Launch the Application

The development server is already running!

### Open in Browser
Navigate to: **http://localhost:5173/**

### What You'll See
- **Campaign Dashboard** with 47 mock campaigns
- **Sidebar Navigation** (mobile-responsive)
- **Top Header** with user profile
- **Campaign Management Interface**

---

## 📋 Try These Features

### 1. Search Campaigns
- Click the search box
- Type "Campaign" or any text
- Results filter automatically (300ms debounce)
- Clear to reset

### 2. Sort Columns
- Click any column header (Campaign, Status, Budget, Performance)
- Click again to reverse sort order
- Visual indicators show current sort

### 3. Filter by Status
- Check the Filter Panel on the left
- Select: Draft, Active, Paused, or Completed
- Filters apply instantly

### 4. Filter by Budget
- Move the Min/Max budget sliders
- Only campaigns in range are shown

### 5. Change Sort Order
- "Sort By" dropdown: Name, Budget, Performance, or Date
- "Order" dropdown: Ascending or Descending
- Changes apply instantly

### 6. Paginate Results
- View next/previous pages
- Jump to specific page numbers
- Shows which items are displayed

### 7. Change Campaign Status
- Click the status dropdown on any campaign row
- Select new status: Draft, Active, Paused, Completed
- UI updates optimistically (with simulated delay)

### 8. Select Multiple Campaigns
- Click checkboxes to select individual campaigns
- Or click header checkbox to select all visible
- "Update" button appears when items selected

### 9. Bulk Update
- Select 2+ campaigns
- Click "Update" button
- Choose new status in modal
- Click "Update" to apply to all

### 10. Click Campaign to View Details
- Click anywhere in campaign row
- See campaign detail (stub ready for implementation)
- Click "Back to campaigns" to return

---

## 🛠️ Development

### Start Dev Server
```bash
npm run dev
```
Server runs on `http://localhost:5173/` with hot reload

### Type Check
```bash
npm run build
```
Checks TypeScript - no errors!

### Production Build
```bash
npm run build
```
Creates optimized bundlenat `dist/` folder

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally

---

## 📁 File Structure Quick Reference

```
src/
├── App.tsx                                 # Main app component
├── main.tsx                               # Entry point
├── index.css                              # Tailwind CSS styles
│
├── components/
│   ├── ui/                                # Design system (8 components)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Feedback.tsx (Alert, Spinner, Skeleton)
│   └── layout/
│       └── Layout.tsx                     # Sidebar + Header
│
├── features/campaigns/
│   ├── components/                        # Campaign-specific UI
│   │   ├── CampaignListPage.tsx          # Main page
│   │   ├── CampaignTable.tsx             # Data table
│   │   ├── FilterPanel.tsx               # Filters
│   │   └── Pagination.tsx                # Pagination
│   ├── hooks/
│   │   └── useCampaigns.ts                # Custom hook
│   ├── services/
│   │   └── campaignService.ts             # Business logic
│   └── types/
│       └── index.ts                       # TypeScript types
│
├── features/jobs/
│   ├── types.ts                           # Job types
│   └── jobService.ts                      # Job polling
│
├── store/
│   └── campaignStore.ts                   # Zustand global state
│
├── utils/
│   ├── constants.ts                       # Global constants
│   └── helpers.ts                         # 20+ utility functions
│
└── mock-data/
    └── index.ts                           # Mock campaigns & data
```

---

## 🔧 How It Works

### Data Flow

```
User Interaction (Click, Type)
    ↓
Component (CampaignListPage)
    ↓
Custom Hook (useCampaigns)
    ↓
Zustand Store (useCampaignStore)
    ↓
Service Layer (campaignService)
    ↓
Mock Data (in-memory campaigns)
    ↓
Components Re-render
    ↓
UI Updates
```

### State Management Flow

```
User clicks status dropdown
    ↓
Component calls: handleStatusChange(id, status)
    ↓
Hook calls: store.updateCampaignStatus(id, status)
    ↓
Store calls: campaignService.updateCampaignStatus(id, status)
    ↓
Service:
  - Simulates 300-1000ms network delay
  - Updates mock data in memory
  - May fail (5% probability)
    ↓
Store updates: campaigns[index].status = newStatus
    ↓
Component receives update via Zustand subscription
    ↓
Component re-renders with new status
```

---

## 🎨 UI Components

All components are in `src/components/ui/`:

### Button
```typescript
<Button variant="primary" size="md" onClick={handler}>
  Click Me
</Button>
```

Options:
- **Variants**: primary, secondary, danger, ghost  
- **Sizes**: sm, md, lg
- **Props**: isLoading, disabled

### Card
```typescript
<Card header={<h2>Title</h2>} footer={<p>Footer</p>}>
  Content goes here
</Card>
```

### Input
```typescript
<Input
  label="Email"
  type="email"
  error="Invalid email"
  helperText="Enter your email"
/>
```

### Modal
```typescript
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirm"
  footer={<Button onClick={handleConfirm}>Confirm</Button>}
>
  Are you sure?
</Modal>
```

### Alert
```typescript
<Alert variant="success" title="Success!">
  Operation completed successfully
</Alert>
```

Options:
- **Variants**: success, error, warning, info

---

## 🔌 Integrating with Real Backend

### Before (Mock)
```typescript
// src/features/campaigns/services/campaignService.ts
async fetchCampaigns(filters, pagination) {
  await simulateDelay()
  const filtered = MOCK_CAMPAIGNS.filter(...)
  return filtered
}
```

### After (Real API)
```typescript
// src/features/campaigns/services/campaignService.ts
async fetchCampaigns(filters, pagination) {
  const response = await fetch('/api/campaigns', {
    method: 'POST',
    body: JSON.stringify({ filters, pagination })
  })
  return response.json()
}
```

The rest of the application works unchanged! Just replace service functions.

---

## 📊 Data Model

### Campaign
```typescript
{
  id: string              // Unique ID
  name: string            // Campaign name
  status: CampaignStatus  // draft | active | paused | completed
  budget: number          // In dollars
  startDate: string       // YYYY-MM-DD
  endDate: string         // YYYY-MM-DD
  performanceScore: number // 0-100
  createdAt: string       // ISO timestamp
  updatedAt: string       // ISO timestamp
}
```

### Job
```typescript
{
  id: string              // Unique ID
  type: JobType           // campaign_export, campaign_report, etc.
  status: JobStatus       // pending | processing | completed | failed
  progress: number        // 0-100
  createdAt: string       // ISO timestamp
  updatedAt: string       // ISO timestamp
  startedAt?: string      // When job started
  completedAt?: string    // When job finished
  error?: string          // Error message if failed
  result?: object         // Job result data
}
```

---

## ⚙️ Configuration

### Simulation Settings
Edit `src/utils/constants.ts`:

```typescript
export const SIMULATION = {
  MIN_DELAY: 300,              // Min network delay (ms)
  MAX_DELAY: 1000,             // Max network delay (ms)
  FAILURE_PROBABILITY: 0.05,   // 5% chance of failure
  POLL_INTERVAL: 2000,         // Job poll every 2 seconds
} as const;
```

### Tailwind Theme
Edit `tailwind.config.js`:

```typescript
theme: {
  extend: {
    colors: {
      brand: {
        50: '#f0f9ff',
        // ... custom colors
      }
    }
  }
}
```

### Pagination
Edit `src/utils/constants.ts`:

```typescript
export const PAGINATION = {
  DEFAULT_LIMIT: 10,    // Items per page
  MAX_LIMIT: 100,       // Maximum allowed
} as const;
```

---

## 🐛 Debugging

### Check Browser Console
- Open DevTools (F12)
- Console tab shows any errors
- Network tab shows simulated API calls

### Enable React DevTools
- Install [React DevTools](https://chrome.google.com/webstore) extension
- Inspect component state and props
- Track re-renders with "Highlight updates"

### Check Zustand State
In browser console:
```javascript
// Open any component and find exported store
import { useCampaignStore } from '@/store/campaignStore'
const state = useCampaignStore.getState()
console.log(state)
```

---

## 📦 Building for Production

### Create Production Build
```bash
npm run build
```

### Output
- **dist/index.html** - Main HTML file
- **dist/assets/index-*.css** - Compiled CSS (4.99 KB gzipped)
- **dist/assets/index-*.js** - Bundled JavaScript (70.52 KB gzipped)

### Deploy
- Upload `dist/` folder to any static host
- Netlify, Vercel, AWS S3, GitHub Pages, etc.

### Preview Locally
```bash
npm run preview
```

---

## ✅ Checklist

- [x] Dev server running at http://localhost:5173/
- [x] Campaign list displays 10 campaigns per page
- [x] Search filters campaigns in real-time
- [x] Sorting works on all columns
- [x] Filters work (status, budget)
- [x] Pagination navigates between pages
- [x] Status dropdown changes campaign status
- [x] Bulk select and update works
- [x] TypeScript strict mode enabled
- [x] Production build succeeds
- [x] All features documented

---

## 🎯 Common Tasks

### Add a New Feature
1. Create types in `features/my-feature/types/`
2. Create service in `features/my-feature/services/`
3. Add store actions in `store/`
4. Create components in `features/my-feature/components/`
5. Use custom hook in components

### Change Styling
- All components use Tailwind CSS
- Edit `src/components/ui/*.tsx` for component styles
- Edit `tailwind.config.js` for theme
- Edit `src/index.css` for global styles

### Cache Mock Data
- All data loads instantly (in-memory)
- No database network calls
- "Performance" is great for development

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### TypeScript Errors
```bash
# Check all files
npm run build

# Install any missing types
npm install -D @types/node
```

### Dev Server Not Responding
```bash
# Kill old process and restart
npm run dev
# Press 'q' then restart
```

### CSS Not Loading
- Check `tailwind.config.js`
- Verify `src/index.css` has `@import "tailwindcss"`
- Clear browser cache (Ctrl+Shift+Delete)

---

## 📞 Next Steps

1. **Explore the Code**: Browse `src/` folder
2. **Try Features**: Test search, filter, sort, select, update
3. **Read Architecture**: See `ARCHITECTURE.md` for detailed guide
4. **Customize**: Update colors, layout, add features
5. **Deploy**: Build and deploy to production

---

**Happy Building! 🚀**

For detailed architecture information, see [ARCHITECTURE.md](./ARCHITECTURE.md)
