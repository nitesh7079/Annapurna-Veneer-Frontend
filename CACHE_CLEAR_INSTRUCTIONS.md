# Clear Browser Cache Instructions

The frontend code has been updated to use the correct API endpoints without company ID in the URL path.

## How to Clear Cache and Test:

### Method 1: Hard Refresh (Recommended)
1. Open your browser
2. Press `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
3. This will force a hard refresh and reload all assets

### Method 2: Clear Browser Cache
1. Open browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Under **Storage**, click **Clear site data**
4. Check all boxes and click **Clear**
5. Refresh the page

### Method 3: Incognito/Private Window
1. Open a new Incognito/Private window
2. Navigate to your app URL
3. Test the login flow

### Method 4: Clear localStorage Manually
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Run these commands:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## Expected Behavior After Cache Clear:

### ✅ Correct API Calls:
```
POST https://annapurna-veneer-backend.onrender.com/api/v1/user/login
Headers:
  - Content-Type: application/json
  - x-company-id: company-2

Body:
  {
    "email": "niteshrajkumar66@gmail.com",
    "password": "****",
    "companyId": "company-2"
  }
```

### ❌ Wrong (Old Cached Version):
```
POST https://annapurna-veneer-backend.onrender.com/api/v1/company-2/user/login
```

## Verification Steps:

1. Open DevTools (F12)
2. Go to **Network** tab
3. Click **Login** button
4. Look at the request to `user/login`
5. Check the **Request URL** - it should be: `/api/v1/user/login` (NOT `/api/v1/company-2/user/login`)
6. Check **Request Headers** - should include `x-company-id: company-2`
7. Check **Request Payload** - should include `"companyId": "company-2"`

## If Still Not Working:

1. Close ALL browser tabs/windows
2. Restart your browser completely
3. Navigate to the app in a fresh window
4. Try the login flow again

---

**Note**: The dev server has been restarted with the corrected code. Make sure to do a hard refresh!
