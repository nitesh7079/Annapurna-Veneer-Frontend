# Multi-Company System - Quick Reference

## User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  STEP 1: Visit Website (First Time or After Logout)           │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │         SELECT YOUR COMPANY                              │ │
│  │                                                           │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │ │
│  │  │   🏢     │  │   🏭     │  │   🏪     │              │ │
│  │  │Annapurna │  │Company 2 │  │Company 3 │              │ │
│  │  │  Veneer  │  │          │  │          │              │ │
│  │  └──────────┘  └──────────┘  └──────────┘              │ │
│  │                                                           │ │
│  │  ┌──────────┐  ┌──────────┐                             │ │
│  │  │   🏬     │  │   🏛️     │                             │ │
│  │  │Company 4 │  │Company 5 │                             │ │
│  │  │          │  │          │                             │ │
│  │  └──────────┘  └──────────┘                             │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  STEP 2: Login to Selected Company                            │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │         🏢 Annapurna Veneer                              │ │
│  │         Premium Plywood & Veneer Supplier                │ │
│  │                                                           │ │
│  │         Email:    [__________________]                   │ │
│  │         Password: [__________________]                   │ │
│  │                                                           │ │
│  │         [        LOGIN        ]                          │ │
│  │                                                           │ │
│  │         ← Change Company                                 │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  STEP 3: Access Company Dashboard                             │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 🏢 Annapurna Veneer | Premium Plywood & Veneer Supplier  │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ Home | Accounting | Banks | Notifications                │ │
│  │                                                           │ │
│  │ [Switch Company] [Logout]                  👤 John Doe   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Only THIS company's data is visible and accessible           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Isolation

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│  🏢 Annapurna       │     │  🏭 Company 2       │     │  🏪 Company 3       │
│     Veneer          │     │                     │     │                     │
├─────────────────────┤     ├─────────────────────┤     ├─────────────────────┤
│ Users:              │     │ Users:              │     │ Users:              │
│ - john@av.com       │     │ - alice@c2.com      │     │ - bob@c3.com        │
│ - sarah@av.com      │     │ - mark@c2.com       │     │ - emma@c3.com       │
│                     │     │                     │     │                     │
│ Transactions:       │     │ Transactions:       │     │ Transactions:       │
│ - Buy/Sell Orders   │     │ - Buy/Sell Orders   │     │ - Buy/Sell Orders   │
│ - Credit/Debit      │     │ - Credit/Debit      │     │ - Credit/Debit      │
│                     │     │                     │     │                     │
│ Banks:              │     │ Banks:              │     │ Banks:              │
│ - HDFC Bank         │     │ - SBI Bank          │     │ - ICICI Bank        │
│ - ICICI Bank        │     │ - Axis Bank         │     │ - PNB Bank          │
│                     │     │                     │     │                     │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
        ❌                           ❌                           ❌
   NO ACCESS               NO ACCESS TO                NO ACCESS
   TO OTHER              ANNAPURNA OR                 TO OTHER
   COMPANIES              COMPANY 3                   COMPANIES
```

## API Request Example

### Before Multi-Company:
```
POST /api/v1/buy
Body: { "name": "John", "amount": 5000 }
```

### After Multi-Company:
```
POST /api/v1/annapurna-veneer/buy
Headers: {
  "Authorization": "Bearer <token>",
  "x-company-id": "annapurna-veneer",
  "x-user-id": "user123"
}
Body: { "name": "John", "amount": 5000 }
```

## Key Components

```
src/
├── pages/
│   ├── CompanySelection.jsx    ← NEW: Company selection page
│   └── Login.jsx               ← UPDATED: Company-aware login
├── contexts/
│   ├── CompanyContext.jsx      ← NEW: Company state management
│   └── AuthContext.jsx         ← UPDATED: Company-aware auth
├── components/
│   └── Header.jsx              ← UPDATED: Shows company, switch button
├── services/
│   └── api.js                  ← UPDATED: Dynamic company URLs
└── App.jsx                     ← UPDATED: CompanyProvider added
```

## Features

✅ **5 Pre-configured Companies** with unique branding  
✅ **Complete Data Isolation** between companies  
✅ **Easy Company Switching** with one click  
✅ **Persistent Selection** stored in localStorage  
✅ **Company-Specific Authentication** - separate users per company  
✅ **Dynamic API Routing** - automatic company ID in URLs  
✅ **Responsive Design** - works on desktop and mobile  
✅ **Visual Company Branding** - logo, name, colors in header  

## Customization Guide

### Change Company Names/Logos
Edit `src/pages/CompanySelection.jsx`:
```javascript
{
  id: 'your-company-id',
  name: 'Your Company Name',
  description: 'Your Business Description',
  logo: '🏢', // Any emoji
  color: 'from-blue-600 to-indigo-600' // Tailwind gradient
}
```

### Change Colors
Default theme is teal/emerald. To change:
1. Edit `tailwind.config.js` for global colors
2. Edit company `color` property for card gradients
3. Edit `Header.jsx` for navigation bar colors

---

**Need Help?** Check `MULTI_COMPANY_GUIDE.md` for detailed documentation.
