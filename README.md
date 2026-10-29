# Mawaheb Web (`mawaheb-web`)

React + Vite single-page application for the **Mawaheb** platform. One build serves five
distinct experiences, each with its own layout shell, navigation and access rules:

| Area | Route prefix | Audience | Direction |
| --- | --- | --- | --- |
| **Public site** | `/`, `/about`, `/contact`, `/login`, … | Visitors | RTL (Arabic) |
| **Student / scholarship area** | `/student-dashboard`, `/student/*`, `/semester-*`, … | General & scholarship students | RTL |
| **Admin & employee console** | `/admin-dashboard/*`, `/employee-dashboard/*` | Platform admins, employees | RTL |
| **Institute Portal — staff** (بوابة معهد حضرموت للموهوبين) | `/institute-admin/*` | Super admins, supervisors, trainers, gate guards | RTL |
| **Institute Portal — student** (بوابة الطالب) | `/institute-portal/*` | Institute students | RTL |
| **Guardian Portal** (بوابة ولي الأمر) | `/guardian/*` | Parents — read-only, separate token | RTL |

Backend repo: [`mawaheb-api`](https://github.com/nhussein2026/Mawaheb-Backend) (sibling folder
`../mawaheb-backend`). Its README documents every endpoint this app calls.

**Companion documents in this repo:**

| File | What it is |
| --- | --- |
| `institiute-panel.md` | The original read-only capture of the legacy WordPress institute portal (`tm.mawaheb.org`) — 14 modules, every field, enum and screen. The functional source of truth. |
| `INSTITUTE_PORTAL_PLAN.md` | The implementation & merge plan derived from that spec: role model, unified data model, phased rollout (A–F), and the open decisions list. |

---

## Table of contents

1. [Tech stack](#1-tech-stack)
2. [Quick start](#2-quick-start)
3. [Environment variables](#3-environment-variables)
4. [Scripts](#4-scripts)
5. [Project structure](#5-project-structure)
6. [Routing map](#6-routing-map)
7. [Authentication & route guards](#7-authentication--route-guards)
8. [State management](#8-state-management)
9. [API layer](#9-api-layer)
10. [Design system](#10-design-system)
11. [Shared components](#11-shared-components)
12. [Institute Portal module map](#12-institute-portal-module-map)
13. [Deployment](#13-deployment)
14. [Current state, known gaps & decision points](#14-current-state-known-gaps--decision-points)

---

## 1. Tech stack

| Concern | Choice | Notes |
| --- | --- | --- |
| Framework | **React 19** | Function components + hooks, JSX only (no TypeScript) |
| Build | **Vite 8** (`@vitejs/plugin-react`) | `optimizeDeps.include: ['react-is']` for Recharts |
| Routing | **react-router-dom 7** | Nested layout routes, `<Outlet />`, `<Navigate>` guards |
| State | **Redux Toolkit 2** + `react-redux 9` | Two slices only: `auth`, `academicYear` |
| HTTP | **axios 1** | Two clients — user session and guardian session |
| Styling | **Tailwind CSS 4** via `@tailwindcss/vite` | Design tokens declared in `@theme` (see §10) |
| Icons | `lucide-react` | One outline icon set |
| Toasts | `react-toastify` | Single `<ToastContainer />` mounted in `App.jsx` |
| Utilities | `clsx` + `tailwind-merge` → `src/utils/cn.js` | Standard `cn()` class merger |
| Lint | ESLint 9 flat config | `eslint.config.js`; not wired into CI |
| Tests | — | None |
| Node | **20** (`.nvmrc`, and what CI uses) | |

---

## 2. Quick start

```bash
# 1. Install (npm is what CI uses; a yarn.lock is also committed)
npm install

# 2. Point at your API
echo 'VITE_API_URL="http://localhost:3000"' > .env

# 3. Start the backend first (../mawaheb-backend → npm run dev, port 3000)

# 4. Run the dev server
npm run dev            # http://localhost:5173
```

To click through the institute, student and guardian portals with realistic data, run
`npm run seed` in `../mawaheb-backend` (⚠️ destructive — read that README's §12 first) and log
in with the demo accounts it prints. Password for all: `password123`; guardian PIN `1234` with
academic number `1101`.

---

## 3. Environment variables

Vite only exposes variables prefixed `VITE_`. There is exactly one:

| Variable | Where read | Value |
| --- | --- | --- |
| `VITE_API_URL` | `src/services/api/axiosClient.js`, `src/services/api/guardianApi.js`, `src/pages/Login.jsx` (and other direct `fetch` calls) | Base URL of the API, **no trailing slash** |

| File | Contents | Status |
| --- | --- | --- |
| `.env` | `VITE_API_URL="http://localhost:3000"` (production URL commented out) | Local, git-ignored |
| `.env.production` | `VITE_API_URL="https://mawaheb-api.azurewebsites.net"` | Used by `vite build` |
| `.env.example` | `REACT_APP_API_URL="http://localhost:3000"` | ⚠️ **Wrong prefix** — a Create-React-App leftover. Copying it produces an app with no API URL. See §14. |

---

## 4. Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR on port 5173 |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | ESLint across the repo |

There is no `start` script in this repo — `server.js` (the production static server) is copied
into `dist/` by CI along with a generated minimal `package.json`. See §13.

---

## 5. Project structure

```
src/
├── main.jsx                    # Entry: BrowserRouter → Redux Provider → App
├── App.jsx                     # The entire route table (all five areas) + ToastContainer
├── app/store.jsx               # configureStore({ auth, academicYear })
│
├── layouts/                    # One shell per area; each owns its own access guard
│   ├── PublicLayout.jsx            # Header + <Outlet>
│   ├── StudentLayout.jsx           # Header + Sidebar; gold tint for scholarship students
│   ├── AdminLayout.jsx             # Admin/employee shell; redirects employees off the admin root
│   ├── InstituteAdminLayout.jsx    # Institute staff shell (RTL, year switcher in header)
│   ├── InstituteStudentLayout.jsx  # Self-contained student shell (own sidebar + header + menu)
│   └── GuardianLayout.jsx          # Minimal read-only shell, tab nav, guardian token guard
│
├── pages/
│   ├── *.jsx                       # Public + legacy student pages
│   ├── adminDashboard/             # 12 admin console pages
│   ├── employeeDashboard/          # Employee dashboard + reports
│   ├── scholarshipStudentPages/    # Scholarship flows (semesters, reports)
│   ├── instituteAdmin/             # 14 institute staff modules (+ unused Placeholder.jsx)
│   ├── instituteStudent/           # 12 student-facing institute pages
│   ├── guardian/                   # Login + 5 read-only guardian pages
│   └── InstituteStudentDash/       # ⚠️ legacy, no longer routed
│
├── components/
│   ├── layout/                     # Public/student Header, Sidebar, Footer, Hero, Slider
│   ├── admin/                      # Admin Sidebar, Header, AdminPageHeader, adminCopy,
│   │                               #   adminRoleRequestEvents
│   ├── institute/                  # Sidebar, Header, AcademicYearSwitcher, StatCard, StatGrid,
│   │                               #   Modal, MemberFormModal, ThreadView, formStyles
│   ├── ui/                         # Button, Card, DataTable, Input, DropdownMenu, PopupModal, Loading
│   ├── common/                     # EditProfileModal (Button.jsx / Card.jsx are empty files)
│   └── profile/                    # Profile, CommonSection
│
├── features/
│   ├── user/authSlice.jsx          # login / logout, mirrored into localStorage
│   └── institute/academicYearSlice.jsx  # global year scope, persisted
│
├── services/api/
│   ├── axiosClient.js              # Shared instance + Bearer interceptor + 401 handler
│   ├── instituteApi.js             # ~90 institute endpoints (staff + student)
│   ├── guardianApi.js              # Separate axios instance + guardian session helpers
│   └── adminApi.js                 # 3 admin dashboard calls
│
├── constants/institute.js          # Arabic label maps for every backend enum + nav config
├── hooks/useAdminStats.js          # Parallel fetch for the admin dashboard tiles
├── styles/                         # tailwind.css (design tokens), index.css
├── utils/cn.js                     # clsx + tailwind-merge
└── assets/                         # logo, placeholder avatar
```

---

## 6. Routing map

All routes are declared in `src/App.jsx`. Every institute tab is a **real, deep-linkable route**
(a deliberate fix for the legacy WordPress portal's `?active_tab=` behaviour — see
`institiute-panel.md` §0).

### Public — `PublicLayout`

`/` · `/about` · `/contact` · `/login` · `/signup` · `/forgot-password` ·
`/reset-password/:token` · `/profile` · `/universityDetails` · `/pro` and `/test` (scratch routes)

### Student / scholarship — `StudentLayout`

`/student-dashboard` · `/student/courses` · `/student/events` · `/student/tickets` ·
`/student/achievements` · `/student/certificates` · `/student/difficulties` ·
`/student/financial-report` · `/student/scholarship-student-form` · `/notes` ·
`/semester-list` · `/semester-create` · `/student-report` · `/my-reports` ·
`/try-report` · `/try-report-list` · `/create-ticket` · `/ticket-list`

### Admin — `AdminLayout` at `/admin-dashboard`

`index` (overview) · `analytics` · `users` · `roles` · `role-requests` · `reports` ·
`tickets` · `programs` · `financial` · `scholarship`

### Employee — `AdminLayout` at `/employee-dashboard`

`index` · `reports` · `users` · `tickets` · `programs`

Plus `/student/details` (admin view of one student, wrapped in `AdminLayout`).

### Institute staff — `InstituteAdminLayout` at `/institute-admin`

`index` (dashboard) · `academic` · `members` · `notices` · `bugs` · `results` · `evaluations` ·
`courses` · `correspondence` · `behavior` · `leave` · `achievements` · `ideas` · `fees`

### Institute student — `InstituteStudentLayout` at `/institute-portal`

`index` (overview) · `announcements` · `results` · `evaluations` · `courses` · `achievements` ·
`ideas` · `leave` · `behavior` · `correspondence` · `bugs` · `fees`

### Guardian

`/guardian/login` (unwrapped) then `GuardianLayout` at `/guardian`:
`index` (overview) · `results` · `evaluations` · `behavior` · `fees`

### Catch-all

`*` renders `pages/404.jsx` inside `PublicLayout`.

---

## 7. Authentication & route guards

### Login and redirect

`src/pages/Login.jsx` posts directly to `${VITE_API_URL}/auth/login` with `fetch`, dispatches
`login({token, user})`, then routes by role — **institute identity wins over platform role**:

```js
if (instituteRole === "student" || role === "Institute Student") → /institute-portal
else if (instituteRole ∈ {super_admin, track_supervisor, trainer, gate_guard}) → /institute-admin
else if (role === "Admin") → /admin-dashboard
else → /
```

Because that order puts institute checks first, a user who is both a platform `Admin` and carries
an `instituteRole` lands in the institute portal, not the admin console.

### Guards — enforced in the layout components

| Layout | Guard | Redirect on failure |
| --- | --- | --- |
| `InstituteAdminLayout` | `isLoggedIn` **and** (`role === "Admin"` or `instituteRole ∈ INSTITUTE_STAFF_ROLES`) | `/login`, then `/` |
| `InstituteStudentLayout` | `isLoggedIn` **and** `isInstituteStudentUser(user)` | `/login`, then `/` |
| `GuardianLayout` | `isGuardianLoggedIn()` (guardian token in localStorage) | `/guardian/login` |
| `AdminLayout` | Redirects non-admins off `/admin-dashboard` → `/employee-dashboard` | — |
| `StudentLayout`, `PublicLayout` | **No guard** | — |

> The student area (`/student-dashboard`, `/student/*`) is reachable while logged out; the pages
> render empty because their API calls 401. See §14.

### Sidebar visibility

`navForUser(user)` in `src/constants/institute.js` filters `INSTITUTE_NAV` by
`instituteRole` (platform `Admin` sees all 14 tabs). This mirrors the backend's guard matrix but
is **presentation only** — the server is the enforcement point, and it currently guards fewer
routes than the sidebar hides (see the backend README §15.1).

---

## 8. State management

Redux Toolkit, two slices, both mirrored into `localStorage` so sessions survive reloads.

### `auth` — `src/features/user/authSlice.jsx`

| Key | localStorage key |
| --- | --- |
| `isLoggedIn` | `isLoggedIn` (`"true"`/`"false"`) |
| `token` | `token` |
| `user` | `user` (JSON: `{id, name, role, instituteRole, email}`) |

Actions: `login({token, user})`, `logout()`.

### `academicYear` — `src/features/institute/academicYearSlice.jsx`

Global academic-year scope for the whole institute portal.

| Key | Meaning |
| --- | --- |
| `years[]` | Loaded once by `AcademicYearSwitcher` |
| `selectedYearId` | An `AcademicYear._id`, or the string `"all"` (cumulative). Persisted under `mawaheb-institute-year`. |
| `loaded` | Whether the year list has been fetched |

On first load it defaults to the year with `isActive: true`. Every institute API call passes this
value as `?academicYear=`, so changing it in the header re-scopes every module at once.

### Guardian session — not in Redux

Handled by `src/services/api/guardianApi.js` with its own localStorage keys, deliberately kept
separate from the user session so the two can never mix:

| Key | Contents |
| --- | --- |
| `guardianToken` | 12-hour read-only JWT |
| `guardianStudent` | `{studentUserId, studentName, academicNumber, batch, level}` |

Everything else is component-local `useState` + `useEffect`. There is no RTK Query, no React
Query, and no global cache — a deliberate choice recorded in `INSTITUTE_PORTAL_PLAN.md` §9.7.

---

## 9. API layer

### `axiosClient.js` — the user session client

- `baseURL: import.meta.env.VITE_API_URL` (fallback `http://localhost:5000/api`, which matches
  nothing in this project — see §14)
- **Request interceptor** attaches `Authorization: Bearer <localStorage.token>`
- **Response interceptor** logs a warning on 401; the redirect to `/login` is commented out

### `instituteApi.js` — the institute surface (~90 methods)

Grouped to mirror the backend modules; every list method takes `(params, year)` and folds the
year into the query via a `withYear()` helper:

```js
instituteApi.listResults({ student, batch, term }, selectedYearId)
instituteApi.createResult(formData)               // multipart, field "image"
instituteApi.getMyResults()                        // student self-service, /institute/me/*
```

Sections: dashboard · academic years · promotion · members · announcements · behavior · leave ·
results · evaluations · courses · achievements · ideas · fees · correspondence · bugs ·
student self-service (`getMy*` / `submit*` / `createMy*`) · lookups (`listBatches`,
`listStudents`, `listStaff`).

Multipart calls set `Content-Type: multipart/form-data` explicitly and take a `FormData`.

### `guardianApi.js` — the guardian session client

A **separate axios instance** with its own interceptor reading `guardianToken`, plus session
helpers `getGuardianStudent()`, `isGuardianLoggedIn()`, `guardianLogout()`. `login()` stores the
token and student summary on success.

### `adminApi.js`

Three calls used by `useAdminStats`: `getStats()` (`/stats/admin`), `getRoleRequests()`,
`getFinancialReports()`.

### Direct `fetch` calls

Several older pages (starting with `Login.jsx`) call `fetch(\`${import.meta.env.VITE_API_URL}/…\`)`
directly instead of going through `axiosClient`. New code should use the api modules.

---

## 10. Design system

Tokens are declared as Tailwind 4 `@theme`
custom properties in `src/styles/tailwind.css` and consumed as normal utility classes
(`bg-surface-card`, `text-text-secondary`, `border-border-subtle`, …).

### Palettes

| Ramp | Role | Anchor values |
| --- | --- | --- |
| `brand-*` (50→900) | Forest Green — primary brand | `brand-600 #296E42`, `brand-800 #1A3A2A`, `brand-900 #0D2018` |
| `accent-*` | Golden Amber — achievement/award | `accent-400 #D4A843`, `accent-600 #B07A1A` |
| `neutral-*` | Warm Parchment | `neutral-50 #FAFAF7`, `neutral-200 #E8E4D8`, `neutral-900 #2E2C28` |

### Semantic sets

`success-*`, `warning-*`, `error-*`, `award-*`, each with `bg` / `border` / `text` / `dark`.

### Surfaces, text and borders

| Token | Value | Used for |
| --- | --- | --- |
| `surface-nav` | `#0D2018` | Sidebars |
| `surface-header` | `#1A3A2A` | Top bars |
| `surface-page` | `#F5F3EE` | Page background |
| `surface-card` | `#FAFAF7` | Cards, panels |
| `surface-overlay` | `rgba(13,32,24,.55)` | Modal backdrops |
| `text-primary` / `text-secondary` / `text-muted` / `text-inverse` / `text-brand` / `text-accent` | — | Text roles |
| `border-subtle` / `border-default` / `border-strong` / `border-brand` / `border-accent` / `border-error` | — | Border roles |

### RTL

Every authenticated shell sets `dir="rtl" lang="ar"` on its root element and uses logical
properties (`start`/`end`, `ps-`/`pe-`, `ms-`/`me-`) rather than left/right. UI copy is Arabic;
enum **values** stay English machine keys and are translated for display through
`src/constants/institute.js`.

### Visual differentiation between areas

A deliberate pattern — each audience gets a distinct background/chrome so the area is obvious at
a glance: admin gets parchment + darkest sidebar, employees a lighter sidebar and white page,
scholarship students a gold-tinted page (`bg-accent-50`), institute students the standard
parchment with their own compact shell.

---

## 11. Shared components

| Component | Path | Purpose |
| --- | --- | --- |
| `AcademicYearSwitcher` | `components/institute/` | Loads the year list once and drives the global `academicYear` scope |
| `StatCard` / `StatGrid` | `components/institute/` | The metric tiles at the top of every institute module (`{label, value, icon, tone}`) |
| `ThreadView` | `components/institute/` | Shared conversation view for correspondence, bug reports and tickets |
| `Modal` / `MemberFormModal` | `components/institute/` | Generic modal shell; the member create/edit form |
| `formStyles.js` | `components/institute/` | `selectCls`, `labelCls`, `textareaCls` — stop re-declaring the same Tailwind strings |
| `DataTable` | `components/ui/` | Column-config driven table |
| `Button`, `Card`, `Input`, `DropdownMenu`, `PopupModal` | `components/ui/` | Base primitives |
| `Loading` | `components/ui/` | Branded loading states (spinner, skeletons, overlays) |
| `AdminPageHeader` | `components/admin/` | Consistent page title/action bar for the admin console |
| `adminCopy.js` | `components/admin/` | `ROLE_LABEL_AR` + `formatRoleAr()` — Arabic role labels; API values stay English |
| `adminRoleRequestEvents.js` | `components/admin/` | Window `CustomEvent` used to refresh the header's role-request badge after an approve/reject |
| `cn()` | `utils/` | `twMerge(clsx(...))` |

`constants/institute.js` is the single place for Arabic display strings: label maps for every
backend enum, `INSTITUTE_NAV` (staff tabs + `roles[]`), `INSTITUTE_STUDENT_NAV`, `navForUser()`,
`isInstituteStudentUser()` and per-enum `*Label()` helpers.

---

## 12. Institute Portal module map

All 14 spec modules are built. Each staff page pairs with a student-facing page where the spec
calls for one, and with guardian read-only pages for the three parent-visible modules.

| § | Module | Staff page | Student page | Guardian |
| --- | --- | --- | --- | --- |
| 1 | Dashboard | `instituteAdmin/Dashboard` | `instituteStudent/Overview` | `guardian/GuardianOverview` |
| 2 | Years & students | `instituteAdmin/YearsStudents` | — | — |
| 3 | Members & trainers | `instituteAdmin/Members` | — | — |
| 4 | Announcements | `instituteAdmin/Announcements` | `instituteStudent/Announcements` | — |
| 5 | Issues & errors | `instituteAdmin/Bugs` | `instituteStudent/Bugs` | — |
| 6 | Academic results | `instituteAdmin/Results` | `instituteStudent/Results` | `guardian/GuardianResults` |
| 7 | Evaluation reports | `instituteAdmin/Evaluations` | `instituteStudent/Evaluations` | `guardian/GuardianEvaluations` |
| 8 | Courses & programs | `instituteAdmin/Courses` | `instituteStudent/Courses` | — |
| 9 | Correspondence | `instituteAdmin/Correspondence` | `instituteStudent/Correspondence` | — |
| 10 | Behavior log | `instituteAdmin/Behavior` | `instituteStudent/Behavior` | `guardian/GuardianBehavior` |
| 11 | Leave requests | `instituteAdmin/Leave` | `instituteStudent/Leave` | — |
| 12 | Achievements | `instituteAdmin/Achievements` | `instituteStudent/Achievements` | — |
| 13 | Ideas bank | `instituteAdmin/Ideas` | `instituteStudent/Ideas` | — |
| 14 | Fees & installments | `instituteAdmin/Fees` | `instituteStudent/Fees` | `guardian/GuardianFees` |

Against the plan's phases: **A–E are complete** (primitives, unification, admin modules, student
portal, guardian portal). **Phase F is partial** — per-rank menus exist client-side, but presence
badges and the deprecated-alias cleanup are not done. See §14.

---

## 13. Deployment

- **Target:** Azure Web App **`mawaheb-web`**
- **Trigger:** push to `main`, or manual `workflow_dispatch`
- **Workflow:** `.github/workflows/main_mawaheb-web.yml`

The build step does something unusual worth knowing about — it ships a **tiny Express server
inside `dist/`** to handle SPA deep links:

1. `npm install` → `npm run build` (uses `.env.production`, so `VITE_API_URL` is baked in at build time)
2. Copy `server.js` → `dist/server.js`
3. Generate a minimal `dist/package.json` (`type: module`, `start: node server.js`, dependency `express ^5.1.0`)
4. `cd dist && npm install --omit=dev`
5. Upload `dist/` as the artifact → `azure/webapps-deploy@v3`

`server.js` serves static files from its own directory and falls back to `index.html` for any
non-file route (`app.get('{*path}', …)` — Express 5 wildcard syntax, which is why the generated
package.json pins Express 5 even though this repo has no runtime Express dependency).

**To change the production API URL**, edit `.env.production` and redeploy — it is compiled into
the bundle, not read at runtime.

---

## 14. Current state, known gaps & decision points

Factual observations of the code as it stands, for the next planning round.

### 14.1 Configuration issues

| # | Finding | Location |
| --- | --- | --- |
| 1 | **`.env.example` uses the wrong prefix** — `REACT_APP_API_URL` (Create React App) instead of `VITE_API_URL`. A new contributor who copies it gets an app with an undefined API URL. | `.env.example` |
| 2 | **`axiosClient`'s fallback is wrong** — `http://localhost:5000/api` matches neither the local API (`:3000`) nor production. It silently masks a missing `VITE_API_URL` with confusing network errors instead of failing loudly. `guardianApi.js` repeats the same fallback. | `src/services/api/axiosClient.js:3`, `src/services/api/guardianApi.js:6` |
| 3 | `.nvmrc` says Node 20 and CI uses 20.x, but Vite 8 / React 19 are happiest on 22+. Worth confirming intentionally. | `.nvmrc`, workflow |

### 14.2 Access-control gaps

| # | Finding | Location |
| --- | --- | --- |
| 4 | **`StudentLayout` has no auth guard.** `/student-dashboard` and every `/student/*` route renders for logged-out visitors; only the API 401s. The institute and guardian layouts do guard correctly. | `src/layouts/StudentLayout.jsx` |
| 5 | **`AdminLayout` does not check `isLoggedIn`** — it only bounces non-admins from the admin root to `/employee-dashboard`. A logged-out visitor can open `/admin-dashboard/users`. | `src/layouts/AdminLayout.jsx` |
| 6 | **401 responses are not acted on.** The response interceptor logs a warning; the `window.location.href = '/login'` line is commented out. An expired token leaves the user on a silently empty screen. | `src/services/api/axiosClient.js:26-31` |
| 7 | The token lives in `localStorage`, readable by any script on the origin. Acceptable for this app's threat model, but it is a deliberate choice worth recording. | `authSlice.jsx` |

### 14.3 Dead and duplicated code

| # | Finding |
| --- | --- |
| 8 | **7 page components are unreferenced** by any route or import — ~1,150 lines of dead code: `pages/OldProfile.jsx` (282), `pages/scholarshipStudentPages/ScholarshipStudentDashboard.jsx` (248), `pages/InstituteStudentDash/InstituteStudentDash.jsx` (233), `pages/Waiting.jsx` (186), `pages/scholarshipStudentPages/AllReports.jsx` (171), `pages/instituteAdmin/Placeholder.jsx` (32), `pages/adminDashboard/AllStudentsReports.jsx` (empty) |
| 9 | **Three empty files:** `components/common/Button.jsx`, `components/common/Card.jsx` and `pages/adminDashboard/AllStudentsReports.jsx` are 0 bytes; the first two shadow the real `components/ui/` versions by name |
| 10 | **Duplicate component families** — `components/common/`, `components/ui/`, `components/layout/` and `components/institute/` each carry their own Button/Card/Sidebar/Header variants |
| 11 | **A filename with a trailing space:** `pages/scholarshipStudentPages/StudentReportList .jsx` — imported with the space intact; fragile on case/space-sensitive tooling |
| 12 | **Scratch routes shipped to production:** `/pro` and `/test` both render profile components; `/pro` and `/profile` render the same component |
| 13 | Resolved: only `lucide-react` remains; `@heroicons/react` and `react-icons` were removed |

### 14.4 Consistency & architecture

| # | Finding |
| --- | --- |
| 14 | **Mixed HTTP styles** — some pages use `axiosClient`/`instituteApi`, others call `fetch` directly with a hand-built URL and header (`Login.jsx` and several legacy student pages) |
| 15 | **No loading/error convention** — each page re-implements its own `loading`/`error` state; `components/ui/Loading.jsx` exists (396 lines) but is not used uniformly |
| 16 | **No shared `Pagination`, `FilterBar`, `JudgingModal` or `FileField`** — `INSTITUTE_PORTAL_PLAN.md` §5 called for these; only `DataTable`, `StatCard`/`StatGrid`, `Modal` and `ThreadView` were extracted |
| 17 | **Enum labels are duplicated by hand** between `src/constants/institute.js` and `../mawaheb-backend/utils/instituteEnums.js`. Adding a backend enum value silently renders as a raw machine key until the label map is updated |
| 18 | **No tests and no CI quality gate** — the workflow runs `npm install` + `npm run build` only; `npm run lint` is never executed in CI |
| 19 | **No code splitting** — every route is a static import in `App.jsx`, so the whole app (including Recharts and all five portals) is one bundle |
| 20 | `Placeholder.jsx` and `InstituteStudentDash.jsx` are leftovers from the scaffolding phase; the plan's Phase F cleanup of deprecated aliases has not run |

### 14.5 Known functional gaps

| # | Finding |
| --- | --- |
| 21 | **Presence indicators always show zero.** The institute dashboard renders `supervisorsOnline` / `studentsOnline`, but the backend never writes `User.lastSeenAt` — so the widget is permanently `0`. Requires a backend fix (see backend README §15.2 #8) |
| 22 | **Guardian PIN can only be set at member creation.** `MemberFormModal` sends `guardianPin` on create; there is no dedicated "reset guardian PIN" flow |
| 23 | **No error boundary** — an uncaught render error in any route blanks the whole app |
| 24 | Institute sidebar `roles[]` filtering is stricter than the server's guards; a rank that cannot *see* a tab can still reach its API. Aligning the two is a backend change |

### 14.6 Suggested next steps (in priority order)

1. Fix `.env.example` (`VITE_API_URL`) and make a missing API URL fail loudly instead of falling back to `localhost:5000/api`.
2. Add auth guards to `StudentLayout` and `AdminLayout`, and re-enable the 401 → `/login` redirect.
3. Ask the backend to tighten the institute route guards and to write `lastSeenAt`, so the sidebar's rank model is actually enforced and the dashboard's presence tiles work.
4. Delete the 7 unreferenced pages, the 2 empty files and the `/pro` + `/test` routes; rename `StudentReportList .jsx`.
5. Consolidate `components/common` + `components/ui` into one primitives directory and standardise on `lucide-react`.
6. Add route-level code splitting (`React.lazy`) — at minimum split the five portal areas.
7. Add `npm run lint` to CI, then a first smoke test (login → each portal's landing route renders).
