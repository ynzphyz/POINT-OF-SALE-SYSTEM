# Quick Start Guide

## Installation

1. Navigate to the project directory:
```bash
cd restro-pos
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and go to:
```
http://localhost:3000/login
```

## First Login

1. Select any employee from the grid (e.g., "Eko Prasetyo - Cashier")
2. Enter PIN: `333333`
3. Click "Start Shift"

## Using the POS System

### Creating an Order

1. After login, you'll be on the main POS/Cashier page
2. Browse menu items by category (tabs at top)
3. Click on any menu item to add it to the order (right panel)
4. Adjust quantity and discount in the order panel
5. Click "Proceed" to complete the order

### Managing Tables

1. Click "Tables" in the left sidebar
2. View all tables with their status
3. Filter by section (Section A, Section B, Terrace)
4. Click on a table to view/manage orders

### Viewing Customers

1. Click "Customers" in the left sidebar
2. Search customers by name or phone
3. View customer history and spending

### Checking Orders

1. Click "Orders" in the left sidebar
2. Filter by status (In Progress, Completed, etc.)
3. Search by order number or customer name
4. Click "View Details" to see full order info

### Reports

1. Click "Reports" in the left sidebar
2. View sales statistics and analytics
3. Filter by time period

### Settings

1. Click "Settings" in the left sidebar
2. Configure restaurant info, tax rates, and receipt settings

## Tips

- The system uses mock data, so all changes are temporary
- Refresh the page to reset data
- The POS page is optimized for tablet landscape (1024x768) but works on desktop too
- Orange color (#F97316) indicates primary actions throughout the app

## Keyboard Shortcuts

- Use Tab to navigate between fields
- Enter to submit forms
- Escape to close modals (when implemented)

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed: `npm install`
2. Clear Next.js cache: `rm -rf .next`
3. Restart the dev server: `npm run dev`

## Next Steps

- Explore all pages and features
- Customize colors in `tailwind.config.ts`
- Modify mock data in `lib/mock-data.ts`
- Add new features or pages as needed

Enjoy using Restro POS! 🍽️
