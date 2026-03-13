# ZuluGshop — Frontend (React + Vite + Tailwind CSS)

Customer storefront + Admin dashboard for ZuluGshop.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| React Router v6 | Client-side routing |
| TanStack Query v5 | Server state / caching |
| Zustand | Client state (auth, cart) |
| Axios | HTTP client |
| React Hook Form + Zod | Forms & validation |
| Tailwind CSS | Utility-first styling |
| Shadcn/ui patterns | Component design system |
| Lucide React | Icons |
| React Hot Toast | Notifications |

---

## Project Structure

```
src/
├── api/
│   └── index.js              ← Axios instance + all API calls
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   └── LoadingSpinner.jsx
│   └── layout/
│       ├── CustomerLayout.jsx
│       └── AdminLayout.jsx
├── pages/
│   ├── customer/
│   │   ├── HomePage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── AdminProducts.jsx   ← Full CRUD with modal form
│       ├── AdminOrders.jsx     ← Status management
│       ├── AdminUsers.jsx
│       └── AdminCategories.jsx ← Full CRUD
├── store/
│   ├── authStore.js            ← Zustand + localStorage persist
│   └── cartStore.js            ← Zustand + localStorage persist
├── utils/
│   └── helpers.js              ← formatPrice, formatDate, cn()
├── App.jsx                     ← Routes + guards
├── main.jsx
└── index.css                   ← Tailwind + CSS variables
```

---

## Run Locally

```bash
# Install dependencies
npm install

# Set backend URL
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:8080

# Start dev server
npm run dev
# → http://localhost:5173

# Build for production
npm run build
# Output in ./dist/
```

---

## Routes

### Customer Routes
| Path | Component | Access |
|------|-----------|--------|
| `/` | HomePage | Public |
| `/products` | ProductsPage | Public |
| `/products/:id` | ProductDetailPage | Public |
| `/cart` | CartPage | Public |
| `/checkout` | CheckoutPage | Auth |
| `/orders` | OrdersPage | Auth |
| `/login` | LoginPage | Guest |
| `/register` | RegisterPage | Guest |

### Admin Routes
| Path | Component | Access |
|------|-----------|--------|
| `/admin` | AdminDashboard | Admin |
| `/admin/products` | AdminProducts | Admin |
| `/admin/orders` | AdminOrders | Admin |
| `/admin/users` | AdminUsers | Admin |
| `/admin/categories` | AdminCategories | Admin |

---

## Default Admin Login

```
Email:    admin@zulugshop.com
Password: admin123
```

---

## Deploy on Render (Static Site)

1. Push this folder to GitHub
2. Render → **New Static Site** → connect repo
3. Configure:
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`
4. Environment Variables:
   ```
   VITE_API_URL = https://your-backend.onrender.com
   ```
5. Rewrite rule: `/* → /index.html` (for React Router)
