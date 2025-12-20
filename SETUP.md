# Frontend Setup and Installation Guide

## Quick Start

1. **Navigate to frontend directory:**
   ```bash
   cd "c:\Users\ashis\OneDrive\Desktop\Annapurna  Veneer\frontend"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Package.json Setup

If package.json doesn't exist, create it with:

```json
{
  "name": "annapurna-veneer-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "axios": "^1.6.0",
    "web-vitals": "^3.5.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

## Features Included

### 📊 Dashboard
- **Buy History**: View all confirmed buy transactions
- **Sell History**: View all confirmed sell transactions  
- **Buy Pending**: Manage pending buy transactions
- **Sell Pending**: Manage pending sell transactions
- **Analytics**: Business summary with profit/loss calculations

### 💰 Payment Management
- **Partial Payments**: Process payments across multiple transactions
- **Bulk Operations**: Select and confirm multiple payments
- **Individual Confirmations**: Confirm single transaction payments
- **Outstanding Tracking**: Monitor pending amounts

### ➕ Create Transactions
- **Buy/Sell Forms**: Create new transactions with validation
- **Payment Status**: Set as Confirmed or Pending
- **Multiple Payment Modes**: Cash, UPI, Bank Transfer, Cheque

### 🔍 Advanced Features
- **Filtering**: By item name, customer name, transaction type
- **Search**: Real-time search across all fields
- **Pagination**: Navigate through large datasets
- **Responsive Design**: Works on all devices

## API Endpoints Used

- `GET /api/v1/buySell/dashboard` - Dashboard summary
- `GET /api/v1/buySell/buy/history` - Buy history
- `GET /api/v1/buySell/sell/history` - Sell history
- `GET /api/v1/buySell/buy/pending` - Buy pending
- `GET /api/v1/buySell/sell/pending` - Sell pending
- `POST /api/v1/buySell/create` - Create transaction
- `PATCH /api/v1/buySell/confirm-payment/:id` - Confirm payment
- `POST /api/v1/buySell/partial-payment` - Process partial payments

## File Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── index.js
│   └── index.css
├── App.jsx
├── BuySellDashboard.jsx
├── CreateBuySell.jsx
├── PaymentManagement.jsx
└── README.md
```

## Usage Instructions

1. **Start your backend server** (port 3001)
2. **Start the frontend** with `npm start`
3. **Navigate between tabs**:
   - Dashboard: View all analytics
   - Create Transaction: Add new buy/sell entries
   - Payment Management: Handle pending payments

## Troubleshooting

### If you get CORS errors:
Make sure your backend has CORS enabled for `http://localhost:3000`

### If components don't load:
Check that the API_BASE_URL in each component matches your backend URL:
```javascript
const API_BASE_URL = 'https://annapurnaveneer.online/api/v1';
```

### If styles don't apply:
The components use Tailwind CSS classes. If you don't want to set up Tailwind, the components will still work with basic styling.

## Ready to Use!

Your frontend is now ready to work with the separate Buy/Sell endpoints:
- ✅ Buy History
- ✅ Sell History  
- ✅ Buy Pending
- ✅ Sell Pending
- ✅ Dashboard Analytics
- ✅ Payment Management
- ✅ Transaction Creation