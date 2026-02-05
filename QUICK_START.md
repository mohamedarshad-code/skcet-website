# 🚀 Quick Start - Authentication Testing

## ⚡ 3-Step Quick Test

### 1️⃣ Restart Server

```bash
# Press Ctrl+C in terminal
npm run dev
```

### 2️⃣ Sign Up

- Open: `http://localhost:3000/sign-up`
- Email: `test@skcet.ac.in`
- Password: `Test123!`

### 3️⃣ Select Role

- Choose "Student" on onboarding page
- Click "Continue"
- ✅ You should see Student Dashboard!

---

## 🎯 Test URLs

| Page              | URL                                       |
| ----------------- | ----------------------------------------- |
| Sign Up           | `http://localhost:3000/sign-up`           |
| Sign In           | `http://localhost:3000/sign-in`           |
| Onboarding        | `http://localhost:3000/onboarding`        |
| Student Dashboard | `http://localhost:3000/student/dashboard` |
| Faculty Dashboard | `http://localhost:3000/faculty/dashboard` |
| Admin Dashboard   | `http://localhost:3000/admin/dashboard`   |

---

## 🔑 Test Accounts to Create

| Email              | Role        | Expected Dashboard   |
| ------------------ | ----------- | -------------------- |
| `student@test.com` | Student     | `/student/dashboard` |
| `faculty@test.com` | Faculty     | `/faculty/dashboard` |
| `admin@test.com`   | Super Admin | `/admin/dashboard`   |

---

## ✅ What Should Work

- ✅ Sign-up with email/password
- ✅ Redirect to onboarding
- ✅ Role selection
- ✅ Redirect to correct dashboard
- ✅ Route protection (try `/admin` as student)
- ✅ Session persistence

---

## 🐛 Quick Fixes

**Problem**: Environment not loading  
**Fix**: Restart dev server

**Problem**: Blank page  
**Fix**: Check browser console (F12)

**Problem**: Not redirected  
**Fix**: Verify role was saved (check Clerk Dashboard)

---

## 📚 Full Docs

See `docs/TESTING_GUIDE.md` for complete instructions.

---

**Status**: 🟢 Ready to Test!
