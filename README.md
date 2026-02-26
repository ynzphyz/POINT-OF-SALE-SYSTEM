# Restro POS - Restaurant Point of Sale System

A professional, cashier-focused Restaurant POS system built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- **Login/Shift Management**: Employee selection with PIN authentication
- **POS/Cashier Page**: Main order entry interface with menu grid and live order panel
- **Tables Management**: Visual table layout with status indicators
- **Customer Management**: Customer database with visit history
- **Orders**: View and manage all orders with status tracking
- **Reports**: Sales analytics and insights
- **Settings**: Restaurant configuration

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide React icons
- Mock data (no backend required)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000/login](http://localhost:3000/login) in your browser

## Default Login Credentials

You can login with any of these employees:

| Name | Role | PIN |
|------|------|-----|
| Ahmad Rizki | Admin | 123456 |
| Siti Nurhaliza | Admin | 654321 |
| Budi Santoso | Manager | 111111 |
| Dewi Lestari | Manager | 222222 |
| Eko Prasetyo | Cashier | 333333 |
| Fitri Handayani | Cashier | 444444 |
| Gunawan Wijaya | Cashier | 555555 |
| Hendra Kusuma | Kitchen | 666666 |

## Project Structure

```
restro-pos/
├── app/
│   ├── (pos)/              # POS layout group
│   │   ├── layout.tsx      # Sidebar layout
│   │   ├── page.tsx        # Main cashier/POS page
│   │   ├── tables/         # Tables management
│   │   ├── customers/      # Customer management
│   │   ├── orders/         # Orders list
│   │   ├── reports/        # Sales reports
│   │   └── settings/       # Settings
│   ├── login/              # Login page
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/
│   ├── layout/             # Layout components
│   │   ├── sidebar.tsx
│   │   └── order-panel.tsx
│   ├── shared/             # Shared components
│   │   └── status-badge.tsx
│   └── ui/                 # UI components
│       ├── button.tsx
│       └── input.tsx
├── lib/
│   ├── types.ts            # TypeScript types
│   ├── mock-data.ts        # Mock data
│   ├── utils.ts            # Utility functions
│   └── constants.ts        # Constants
└── public/                 # Static assets
```

## Key Pages

### 1. Login Page (`/login`)
- Employee selection with avatar cards
- 6-digit PIN numpad entry
- Clean, minimal design

### 2. POS/Cashier Page (`/`)
- Left sidebar navigation
- Category tabs for menu filtering
- 4-column menu grid with gradient placeholders
- Right panel with live order summary
- Search functionality

### 3. Tables Page (`/tables`)
- Visual table grid with status indicators
- Section filtering
- Capacity and status display

### 4. Customers Page (`/customers`)
- Customer cards with contact info
- Visit history and spending stats
- Search functionality

### 5. Orders Page (`/orders`)
- Order list with status filters
- Order details preview
- Search by order number or customer

### 6. Reports Page (`/reports`)
- Sales statistics
- Period filtering
- Chart placeholders

### 7. Settings Page (`/settings`)
- Restaurant information
- Tax and service charge configuration
- Receipt customization

## Design System

### Colors
- Primary: `#F97316` (Orange)
- Secondary: `#1F2937` (Dark Gray)
- Background: `#F9FAFB`
- Success: `#22C55E`
- Danger: `#EF4444`

### Layout
- Fixed left sidebar: 80px width
- Right order panel: 350px width (on cashier page)
- Main content: Flexible center area

## Mock Data

The system includes realistic mock data for:
- 8 employees (various roles)
- 25 menu items (Indonesian restaurant)
- 8 tables (multiple sections)
- 10 customers with history
- Sample orders
- Discounts and promotions

## Future Enhancements

- Payment processing
- Kitchen display system
- Inventory management
- Shift reports
- User management
- Discount/promo system
- Receipt printing
- Real-time order updates

## License

MIT
# POINT-OF-SALE-SYSTEM
