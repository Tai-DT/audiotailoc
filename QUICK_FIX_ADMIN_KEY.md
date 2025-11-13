# 🚀 QUICK FIX GUIDE - Orders & Users API Error

## ⚡ TL;DR

**Lỗi:** "Một số dữ liệu không tải được: Orders, Users"  
**Nguyên nhân:** Thiếu ADMIN_API_KEY  
**Fix:** Thêm key vào .env và restart servers

---

## ✅ FIX IN 3 STEPS

### Step 1: Backend .env

Add to `backend/.env`:
```bash
ADMIN_API_KEY="dev-admin-key-2024"
```

### Step 2: Dashboard .env.local

Add to `dashboard/.env.local`:
```bash
NEXT_PUBLIC_ADMIN_API_KEY="dev-admin-key-2024"
```

### Step 3: Restart Both Servers

```bash
# Terminal 1: Backend
cd backend
# Press Ctrl+C to stop
npm run start:dev

# Terminal 2: Dashboard  
cd dashboard
# Press Ctrl+C to stop
npm run dev
```

---

## ✅ VERIFY FIX

1. Open http://localhost:3001
2. Login to dashboard
3. Check console for: `🔑 Admin API Key added to headers`
4. Verify dashboard loads all data (no errors)

---

## 🧪 TEST API

```bash
./test-api-admin.sh
```

Expected: All endpoints return 200 OK

---

## 📄 Files Changed

- ✅ `backend/.env` - Added ADMIN_API_KEY
- ✅ `dashboard/.env.local` - Added NEXT_PUBLIC_ADMIN_API_KEY  
- ✅ `dashboard/lib/api-client.ts` - Better logging

---

## 🔍 Troubleshooting

**Still seeing errors?**

1. ✅ Check keys match exactly
2. ✅ Restart both servers
3. ✅ Clear browser cache (Ctrl+Shift+R)
4. ✅ Check console for key logs

**Console shows "⚠️ ADMIN_API_KEY not found"?**

- Restart dashboard server (env not loaded)
- Check `.env.local` file exists
- Verify `NEXT_PUBLIC_` prefix

---

📖 **Detailed Report:** See `ADMIN_KEY_FIX_REPORT.md`
