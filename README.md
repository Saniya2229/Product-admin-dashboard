# Product Admin Dashboard

A production-grade, responsive **Product Administration Dashboard** built with **Next.js (App Router)**, **React**, **Tailwind CSS**, and **Axios**, powered by the [DummyJSON](https://dummyjson.com) API.

Built strictly according to assignment requirements: **zero third-party table/pagination libraries**, **no React Query or SWR**, centralized Axios architecture, full URL state persistence, and custom debouncing with race-condition prevention.

---

## 🚀 Live Demo & Repository

- **Live URL**: *(Deploy to Vercel/Netlify with one click)*
- **GitHub Repository**: *(Your GitHub Repo Link)*

---

## 🛠️ Tech Stack & Architecture

| Technology | Purpose |
|---|---|
| **Next.js (App Router)** | Full-stack React framework, routing (`/products`, `/products/[id]`, `/login`) |
| **React** | Component lifecycle, custom hooks, and state synchronization |
| **Tailwind CSS** | Custom responsive UI (Desktop Table, Mobile Cards, Modal overlays) |
| **Axios** | Centralized HTTP client with JWT interceptor & normalized error handling |
| **Lucide React** | Clean iconography matching executive SaaS dashboards |
| **DummyJSON API** | Backend service for authentication and product catalog |

---

## 📦 Setup & Local Installation

### Prerequisites
- Node.js `v18.x` or higher (`v20+` recommended)
- npm `v9+`

### Installation Steps
```bash
# 1. Clone the repository
git clone <your-repo-url>
cd "Product dashboard (Nexgensis Technologies)"

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 🔑 Demo Credentials

| Role | Username | Password |
|---|---|---|
| Admin | `emilys` | `emilyspass` |

*(A convenient **"Auto-fill"** button is also built into the Login screen for instant testing).*

---

## ✨ Features Completed

- [x] **Authentication Flow**:
  - `POST /auth/login` with JWT token persistence in `localStorage` and `cookie`.
  - Protected routes: Unauthenticated visits to `/products` redirect to `/login`.
  - Authenticated visits to `/login` redirect to `/products`.
  - Dedicated Logout button in both sidebar and topbar.
  - Multi-click spam prevention (disabled state + loading indicator).
- [x] **Responsive Product Presentation**:
  - **Desktop (`md+`)**: Semantic, sortable HTML `<table>` showing Image, Title, Category, Price, Rating, Stock Status, and Actions.
  - **Mobile (`< md`)**: Responsive card grid with thumbnails, badges, and quick touch buttons.
- [x] **Pagination (Zero Ready-Made Libraries)**:
  - Custom limit & skip logic: `skip = (page - 1) * limit`.
  - Configurable page sizes: `10`, `20`, `50` rows per page.
  - Exact count label: `"Showing 21–40 of 194 products"`.
  - Smart ellipsis numbered pills with Previous / Next navigation.
- [x] **Debounced Search & Race Condition Prevention**:
  - Debounce timeout (450ms) to eliminate redundant keystroke requests.
  - Automatic reset to `page = 1` when search terms change.
  - Cancel prior in-flight requests using `AbortController` and monotonic request IDs.
  - **"Test Race Condition"** toggle button built-in to inject `&delay=2000` for live interviewer verification.
- [x] **Category Filtering & Multi-Criteria Sorting**:
  - Dynamic category list fetched from `/products/categories`.
  - Sorting: Price (Low to High, High to Low), Rating (High to Low, Low to High), Title (A to Z, Z to A).
  - Search + Category bridge: client-side refinement banner when searching within a specific category.
- [x] **Dynamic Product Details Page (`/products/[id]`)**:
  - Multi-image gallery with interactive thumbnail switcher.
  - Detailed pricing, discount percentages, stock availability, shipping, warranty, and authentic customer reviews.
  - **Graceful 404 Page**: Handled wrong IDs (e.g. `/products/999999`) with a custom "Product Not Found" screen.
- [x] **Full CRUD Operations**:
  - **Add Product Modal**: Strict field validations (Title, positive Price, Stock integer, Category, Description).
  - **Edit Product Modal**: Pre-populates existing data and saves updates.
  - **Delete Confirmation Modal**: Popup dialog warning user before deletion.
  - **Simulated Mutation Sync**: DummyJSON simulated responses immediately update frontend state with toast alerts.
- [x] **Loading, Empty & Error States**:
  - Zero-layout-shift pulse skeleton loaders.
  - Contextual empty states with one-click filter reset.
  - Prominent error banner with a dedicated **"Retry"** button.

---

## 🧪 Comprehensive Test Cases

| ID | Test Scenario | Expected Result | Status |
|---|---|---|:---:|
| **TC-01** | Direct URL to `/products` without login | Redirected immediately to `/login` | ✅ Pass |
| **TC-02** | Submit invalid credentials | Displays prominent error message | ✅ Pass |
| **TC-03** | Submit valid `emilys` / `emilyspass` | Stores token, shows toast, redirects to `/products` | ✅ Pass |
| **TC-04** | Fast repeated clicks on Login / Save | Button disabled with spinner, sends only 1 request | ✅ Pass |
| **TC-05** | Fast typing in search bar | Debounces 450ms; cancels old in-flight requests | ✅ Pass |
| **TC-06** | Fast search with `&delay=2000` toggle | Older slower requests never overwrite newer results | ✅ Pass |
| **TC-07** | Search term changes | Product list updates and page resets to `1` | ✅ Pass |
| **TC-08** | Change page size (10, 20, 50) | Displays correct row counts and recalculates bounds | ✅ Pass |
| **TC-09** | URL sharing & refresh | `/products?page=2&search=phone` restores exact state | ✅ Pass |
| **TC-10** | Malformed URL (`?page=abc`, `?page=999`) | Sanitized safely to valid page without crash | ✅ Pass |
| **TC-11** | Nonexistent product ID (`/products/999999`) | Shows graceful "Product Not Found" 404 screen | ✅ Pass |
| **TC-12** | Delete product trigger | Displays confirmation popup before deleting | ✅ Pass |

---

## 📝 Short Note: Architectural Choices & Interview Walkthrough

### 1. Key Architectural Choices
- **URL as the Single Source of Truth**: All pagination (`page`, `limit`), search (`search`), category (`category`), and sort (`sortBy`, `order`) parameters reside in URL search parameters. This guarantees that page refreshes, browser back/forward buttons, and shared links preserve the exact user state.
- **Separation of Concerns**: Kept UI components strictly presentation-focused. All API network requests reside in [`services/productApi.js`](services/productApi.js) and [`services/authApi.js`](services/authApi.js), while HTTP token attachment and centralized error normalization live in [`services/api.js`](services/api.js).
- **Zero Ready-Made Table/Pagination Libraries**: Hand-crafted all table rendering, mobile card adaptation, and skip/limit pagination logic from scratch.

### 2. Main Technical Problem Faced: Search Race Condition
- **The Challenge**: When a user types rapidly (e.g., searching `"iphone"`, then immediately changing to `"laptop"`), multiple asynchronous HTTP requests are triggered. If Network Request 1 experiences higher latency than Request 2, Request 1 could resolve *after* Request 2, accidentally overwriting the user's latest search with stale data.
- **The Fix**:
  1. Implemented a custom `useDebounce` hook (450ms) to reduce redundant requests.
  2. Integrated `AbortController` in Axios to automatically cancel any previous in-flight request when a new search starts.
  3. Maintained a monotonic request counter (`latestRequestIdRef`) to ensure only responses from the latest dispatched request can commit to React state.
  4. Added a test toggle (`&delay=2000`) so reviewers can verify that older delayed requests never overwrite newer search results.

### 3. Additional Assignment Edge Cases Handled
- **Search + Category Conflict**: DummyJSON does not support simultaneous search and category query parameters. Our application fetches search matches and applies precision client-side category filtering, displaying an informative badge explaining the combined filter.
- **Simulated Mutations**: Because DummyJSON does not persist mutations to a database, the app simulates the backend mutation via Axios and immediately reflects additions, updates, and deletions in the local React state with toast feedback.
- **Invalid Query Values**: Built a resilient query parser ([`utils/urlHelpers.js`](utils/urlHelpers.js)) that sanitizes `?page=abc`, negative numbers, or invalid page sizes to safe defaults.

### 4. Where AI Helped
AI was utilized as an intelligent pair programmer for scaffolding initial boilerplate, suggesting edge-case testing scenarios (such as artificial delay injection and request sequence tracking), and validating CSS layout responsiveness across desktop table and mobile card views. Every line of code was thoroughly reviewed, verified, and understood.

---

## 🎤 Natural Interview Talking Points

> *"The most technically engaging part of this assignment was solving the search race condition. When users type rapidly, older delayed API responses could finish after newer requests and overwrite fresh results. I solved this by combining debouncing with Axios `AbortController` cancellation and a monotonic request sequence counter. I tested this using an artificial 2-second delay to guarantee that stale responses can never update the UI. I also ensured that all pagination, search, and filter states are synchronized with URL query parameters so the view survives page reloads and can be shared effortlessly."*
