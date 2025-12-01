# Multi-Company Management System

## Overview
This system has been enhanced to support multiple companies with complete data isolation. Each company has its own separate database and user accounts.

## Features

### 1. Company Selection Page
- Displays all 5 companies as interactive cards
- Each company has a unique:
  - Logo/Icon (emoji)
  - Name
  - Description
  - Color scheme
  - Unique ID for backend routing

### 2. Company Isolation
- **Complete Data Separation**: Each company's data is completely isolated from others
- **Separate User Accounts**: Login credentials are company-specific
- **Company-Specific API Routes**: All API calls include the company ID in the URL path
- **Persistent Selection**: Selected company is stored in localStorage

### 3. User Experience
1. **First Visit**: User sees company selection page
2. **Company Selection**: Click on a company card to proceed
3. **Login/Register**: Standard authentication for that specific company
4. **Access**: Full access to that company's data only
5. **Switch Company**: Use "Switch Company" button to logout and select another company

## Company Configuration

### Default Companies
The system is pre-configured with 5 companies. You can customize them in:
- **File**: `src/pages/CompanySelection.jsx`
- **Location**: `companies` array

```javascript
const companies = [
  {
    id: 'annapurna-veneer',              // Unique ID (used in API URLs)
    name: 'Annapurna Veneer',            // Display name
    description: 'Premium Plywood & Veneer Supplier',
    logo: '🏢',                          // Emoji or icon
    color: 'from-teal-600 to-emerald-600' // Tailwind gradient
  },
  // ... add more companies
];
```

### Adding New Companies
1. Add company object to the `companies` array
2. Choose a unique `id` (lowercase, hyphenated)
3. Select an emoji for the `logo`
4. Pick a Tailwind gradient for `color`
5. Backend will automatically create company-specific routes

## Technical Implementation

### API Structure
All API requests include the company ID:
```
Before: /api/v1/buy
After:  /api/v1/{companyId}/buy

Example: /api/v1/annapurna-veneer/buy
         /api/v1/company-2/buy
```

### Context Providers
1. **CompanyContext**: Manages selected company
   - Stores company selection
   - Provides company info to all components
   - Generates company-specific API URLs

2. **AuthContext**: Manages authentication
   - Company-aware login/register
   - Separate user accounts per company

### Header Updates
- Displays selected company logo and name
- **Switch Company** button: Logs out and returns to company selection
- Available in both desktop and mobile views

### Routing
- `/company-selection` - Always accessible
- `/login` - Redirects to company selection if no company selected
- All other routes - Require both company selection and authentication

## Backend Requirements

### Expected Structure
Your backend should support company-specific routes:

```
/api/v1/{companyId}/user/login
/api/v1/{companyId}/user/register
/api/v1/{companyId}/buy
/api/v1/{companyId}/sell
/api/v1/{companyId}/otherCredit
/api/v1/{companyId}/otherDebit
/api/v1/{companyId}/banks
/api/v1/{companyId}/accounts
/api/v1/{companyId}/notifications
```

### Headers Sent
Each request includes:
- `Authorization`: Bearer token (if logged in)
- `x-user-id`: Current user ID
- `x-company-id`: Selected company ID
- `Content-Type`: application/json

## File Changes Summary

### New Files
1. `src/pages/CompanySelection.jsx` - Company selection page
2. `src/contexts/CompanyContext.jsx` - Company state management
3. `MULTI_COMPANY_GUIDE.md` - This documentation

### Modified Files
1. `src/App.jsx` - Added CompanyProvider and company selection route
2. `src/pages/Login.jsx` - Company-aware authentication
3. `src/services/api.js` - Dynamic API URLs based on company
4. `src/components/Header.jsx` - Shows company info and switch button

## Usage Instructions

### For Users
1. Open the website
2. Select your company from the cards
3. Login with your company-specific credentials
4. Access your company's data
5. Use "Switch Company" to access another company

### For Developers
1. **Add New Company**: Edit `CompanySelection.jsx` companies array
2. **Customize Styling**: Modify Tailwind colors in company objects
3. **Backend Setup**: Ensure backend supports `/api/v1/{companyId}/*` routes
4. **Database**: Each company should have isolated database/schema

## Security Notes

- User accounts are company-specific
- No cross-company data access
- Company ID is validated in backend
- JWT tokens are company-scoped
- Switching companies requires re-authentication

## Troubleshooting

### Issue: "Failed to create" error
**Solution**: Ensure backend is configured with company-specific routes

### Issue: Can't see company data after login
**Solution**: Check that backend validates `x-company-id` header

### Issue: Switch Company not working
**Solution**: Verify CompanyContext is properly clearing selection and AuthContext is logging out

## Future Enhancements

- [ ] Company admin dashboard
- [ ] Cross-company reporting (with permissions)
- [ ] Company-specific themes and branding
- [ ] Multi-company user accounts (access multiple companies with one login)
- [ ] Company invitation system

---

**Created By**: Nitesh Raj  
**Date**: December 2, 2025  
**Version**: 1.0
