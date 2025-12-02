# Login Logic Test Report

## Test Environment
- Frontend: http://localhost:3000
- Backend: http://localhost:3010
- Login URL: `/auth/login`

## Test Cases

### 1. Login Page Access
**URL:** `http://localhost:3000/auth/login`

**Expected Behavior:**
- ✅ Page loads successfully
- ✅ Shows login form with email and password fields
- ✅ Shows "Tài khoản demo" button
- ✅ Shows "Đăng ký ngay" link
- ✅ If already authenticated, redirects to homepage or redirect parameter

**Code Flow:**
1. Component mounts → `LoginPageContent` renders
2. `useAuth()` hook checks authentication status
3. `useEffect` checks localStorage for token/user
4. If authenticated → redirect to `redirectTo` (default: `/`)
5. If not authenticated → show login form

### 2. Login with Valid Credentials
**Test Data:**
- Email: `demo@audiotailoc.com`
- Password: `demo123`

**Expected Behavior:**
1. User fills email and password
2. Clicks "Đăng nhập" button
3. `handleSubmit` is called
4. `loginMutation.mutateAsync()` is called
5. On success:
   - Token saved to localStorage
   - User data saved to localStorage
   - React Query cache updated
   - Wait 150ms
   - Redirect to `redirectTo` using `window.location.href`

**Code Flow:**
```tsx
handleSubmit → loginMutation.mutateAsync() 
  → onSuccess callback in useLogin hook
    → authStorage.setSession()
    → queryClient.setQueryData(['auth', 'profile'])
    → toast.success()
  → await Promise(resolve => setTimeout(resolve, 150))
  → window.location.href = redirectTo
```

### 3. Login with Redirect Parameter
**URL:** `http://localhost:3000/auth/login?redirect=%2Fprofile`

**Expected Behavior:**
- ✅ Reads `redirect` parameter from URL
- ✅ Decodes `%2Fprofile` → `/profile`
- ✅ After successful login, redirects to `/profile`
- ✅ If already authenticated, redirects immediately to `/profile`

**Code Flow:**
```tsx
const redirectParam = searchParams.get('redirect');
const redirectTo = redirectParam ? decodeURIComponent(redirectParam) : '/';
// After login → window.location.href = redirectTo
```

### 4. Demo Login Button
**Expected Behavior:**
- ✅ Click "Tài khoản demo" button
- ✅ Calls `handleDemoLogin()`
- ✅ Auto-fills credentials: `demo@audiotailoc.com` / `demo123`
- ✅ Calls `loginMutation.mutateAsync()`
- ✅ Same flow as regular login

### 5. Already Authenticated User
**Scenario:** User already has token in localStorage

**Expected Behavior:**
- ✅ `useEffect` detects token/user in localStorage
- ✅ Sets `hasRedirectedRef.current = true`
- ✅ Redirects immediately to `redirectTo`
- ✅ Does not show login form

**Code Flow:**
```tsx
useEffect(() => {
  const token = authStorage.getAccessToken();
  const storedUser = authStorage.getUser();
  
  if (!hasRedirectedRef.current && (isAuthenticated || (token && storedUser))) {
    hasRedirectedRef.current = true;
    window.location.href = redirectTo;
  }
}, [isAuthenticated, isAuthLoading, redirectTo]);
```

### 6. Loading States
**Expected Behavior:**
- ✅ Shows loading spinner while checking auth (`isCheckingAuth && isAuthLoading`)
- ✅ Shows "Đang xử lý..." while submitting login form
- ✅ Disables form inputs during loading

### 7. Error Handling
**Expected Behavior:**
- ✅ If login fails, shows error toast (handled by mutation)
- ✅ Form remains enabled after error
- ✅ User can retry login

**Code Flow:**
```tsx
try {
  await loginMutation.mutateAsync(...);
} catch (error) {
  // Error handled by mutation's onError callback
  // Shows toast.error() via useLogin hook
  setIsLoading(false);
}
```

## Key Components

### 1. LoginPageContent Component
- Manages form state (email, password, rememberMe)
- Handles form submission
- Handles demo login
- Checks authentication status
- Redirects if already authenticated

### 2. useLogin Hook
- Mutation function for login API call
- `onSuccess`: Saves session, updates cache, shows success toast
- `onError`: Shows error toast

### 3. authStorage
- `setSession()`: Saves token, refreshToken, user, rememberMe to localStorage
- `getAccessToken()`: Gets token from localStorage
- `getUser()`: Gets user data from localStorage

## Potential Issues to Check

### 1. Race Condition
- ✅ Fixed: Check localStorage immediately on mount
- ✅ Fixed: Use `hasRedirectedRef` to prevent multiple redirects
- ✅ Fixed: Wait 150ms before redirect after login

### 2. Redirect Loop
- ✅ Fixed: Check `hasRedirectedRef.current` before redirect
- ✅ Fixed: Check if already on target page before redirect

### 3. Authentication State Sync
- ✅ Fixed: Check both `useAuth()` hook and localStorage
- ✅ Fixed: Use `window.location.href` for reliable redirect

## Console Logs to Monitor

When testing, check browser console for:
- `[LoginPage] Auth check:` - Shows auth status check
- `[LoginPage] Already authenticated, redirecting to:` - Shows redirect action
- `[API Client] Request:` - Shows API calls
- `[API Client] Error:` - Shows API errors (if any)

## Manual Test Steps

1. **Clear localStorage and cookies**
   ```javascript
   localStorage.clear();
   document.cookie.split(";").forEach(c => {
     document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
   });
   ```

2. **Navigate to `/auth/login`**
   - Should show login form

3. **Try demo login**
   - Click "Tài khoản demo"
   - Should redirect to homepage

4. **Try login with redirect**
   - Navigate to `/auth/login?redirect=%2Fprofile`
   - Login with demo credentials
   - Should redirect to `/profile`

5. **Check if already authenticated**
   - After login, navigate to `/auth/login` again
   - Should redirect immediately to homepage

6. **Test error handling**
   - Try login with wrong credentials
   - Should show error toast
   - Form should remain enabled

## Backend API Endpoint

**POST** `/api/v1/auth/login`

**Request Body:**
```json
{
  "email": "demo@audiotailoc.com",
  "password": "demo123",
  "rememberMe": true
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "user_id",
    "email": "demo@audiotailoc.com",
    "name": "Demo User",
    "role": "USER"
  }
}
```

## Notes

- All redirects use `window.location.href` for full page reload
- Authentication state is checked from both React Query cache and localStorage
- Redirect parameter is properly decoded from URL
- Loading states prevent multiple submissions
