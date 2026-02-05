# 🔍 Why Sign-Up Redirects to Onboarding

## What's Happening

When you visit `/sign-up`, it immediately redirects to `/onboarding` because:

1. **You're already signed in** - Clerk detected an active session
2. **You don't have a role** - Your account exists but no role is assigned
3. **Middleware redirects** - The system automatically sends you to onboarding

This is actually **correct behavior**! ✅

---

## 🎯 Two Options

### Option 1: Complete Onboarding (Recommended)

Since you're already signed in, just complete the onboarding:

1. You're already on `/onboarding`
2. Select a role (e.g., "Student")
3. Click "Continue"
4. You'll be redirected to your dashboard

### Option 2: Sign Out & Test Fresh Sign-Up

If you want to test the full sign-up flow from scratch:

1. **Sign Out First**:
   - Go to: `http://localhost:3000`
   - Look for "Sign Out" button in navbar
   - Or manually go to: `http://localhost:3000/sign-in` and sign out

2. **Clear Browser Data**:
   - Press `Ctrl+Shift+Delete`
   - Clear cookies and cache
   - Close browser

3. **Test Sign-Up**:
   - Open browser again
   - Go to `http://localhost:3000/sign-up`
   - Now you should see the sign-up form

---

## 🚀 Quick Test (Easiest)

**Just complete onboarding now:**

1. Visit: `http://localhost:3000/onboarding`
2. Click on "Student" card
3. Click "Continue"
4. ✅ You should see Student Dashboard!

---

## 📝 Expected Flow

```
First Time User:
/sign-up → Create Account → /onboarding → Select Role → /student/dashboard

Already Signed In (You):
/sign-up → Detects Session → /onboarding → Select Role → /student/dashboard
```

---

## 🔐 To Sign Out

Visit any of these:

- `http://localhost:3000` (click Sign Out in navbar)
- Or clear all browser cookies for localhost

---

**Recommendation**: Just complete the onboarding now! The system is working correctly. 🎉
