# 🛡️ TrustWall — النسخة الثابتة (Static)

**منصة جمع وعرض الشهادات التفاعلية**

هذه النسخة تعمل على **GitHub Pages** + **Supabase** (مجاني 100%)

---

## ✅ لماذا هذه النسخة أفضل؟

| الميزة | التفاصيل |
|--------|---------|
| **الاستضافة** | GitHub Pages (مجاني + دائم) |
| **قاعدة البيانات** | Supabase (500MB مجاني) |
| **تسجيل الدخول** | Supabase Auth (مجاني) |
| **البطاقة** | ❌ لا يحتاجها أبداً |
| **النوم** | ❌ لا ينام أبداً |

---

## 🚀 خطوات الإعداد (15 دقيقة فقط)

### 1️⃣ أنشئ حساب Supabase

- ادخل على: https://supabase.com
- اضغط **Start your project**
- سجّل بـ **GitHub**
- أنشئ مشروعاً جديداً (اسمه `trustwall`)
- **انتظر** حتى يكتمل الإعداد (2 دقائق)

---

### 2️⃣ احصل على مفاتيح API

في مشروع Supabase:
```
Project Settings → API
```

انسخ هذين القيمتين:
- **Project URL** (مثال: `https://abcdefgh12345678.supabase.co`)
- **anon public** (مثال: `eyJhbGciOiJIUzI1NiIs...`)

---

### 3️⃣ أنشئ الجداول

في Supabase، اذهب إلى:
```
Table Editor → New Table
```

#### جدول الأول: `walls`

| Column | Type | Settings |
|--------|------|----------|
| id | uuid | Default: `gen_random_uuid()` ✅ PK |
| user_id | uuid | ✅ Not null |
| slug | text | ✅ Not null, Unique |
| title | text | ✅ Not null |
| description | text | — |
| color | text | Default: `#3b82f6` |
| welcome_message | text | Default: `شكراً لك...` |
| created_at | timestamptz | Default: `now()` |

**اضغط Save**

#### جدول الثاني: `testimonials`

| Column | Type | Settings |
|--------|------|----------|
| id | uuid | Default: `gen_random_uuid()` ✅ PK |
| wall_id | uuid | ✅ Not null |
| author_name | text | ✅ Not null |
| author_email | text | — |
| content | text | ✅ Not null |
| rating | int2 | Default: `5` |
| status | text | Default: `pending` |
| created_at | timestamptz | Default: `now()` |

**اضغط Save**

---

### 4️⃣ فعّل سياسات الأمان (RLS)

في كل جدول (`walls` و `testimonials`):

```
Click على الجدول → Policies → Enable RLS
```

ثم أضف هذه السياسات:

#### لـ `walls`:

**سياسة 1: القراءة العامة**
```
Name: Allow public read
Target: All
Operation: SELECT
Policy: true
```

**سياسة 2: الكتابة للمستخدمين**
```
Name: Allow user insert
Target: All
Operation: INSERT
Policy: auth.uid() = user_id
```

**سياسة 3: التعديل للمستخدمين**
```
Name: Allow user update
Target: All
Operation: UPDATE
Policy: auth.uid() = user_id
```

**سياسة 4: الحذف للمستخدمين**
```
Name: Allow user delete
Target: All
Operation: DELETE
Policy: auth.uid() = user_id
```

#### لـ `testimonials`:

**سياسة 1: القراءة العامة**
```
Name: Allow public read
Target: All
Operation: SELECT
Policy: true
```

**سياسة 2: الإرسال العام**
```
Name: Allow public insert
Target: All
Operation: INSERT
Policy: true
```

**سياسة 3: التعديل للمالك**
```
Name: Allow owner update
Target: All
Operation: UPDATE
Policy: EXISTS (SELECT 1 FROM walls WHERE walls.id = testimonials.wall_id AND walls.user_id = auth.uid())
```

**سياسة 4: الحذف للمالك**
```
Name: Allow owner delete
Target: All
Operation: DELETE
Policy: EXISTS (SELECT 1 FROM walls WHERE walls.id = testimonials.wall_id AND walls.user_id = auth.uid())
```

---

### 5️⃣ عدّل ملف الإعدادات

افتح `js/supabase-config.js` واستبدل القيم:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

بقيمك الحقيقية من الخطوة 2.

---

### 6️⃣ ارفع الملفات على GitHub Pages

1. أنشئ مستودع GitHub جديد (Public)
2. ارفع **كل الملفات** من هذا المجلد
3. اذهب إلى:
   ```
   Settings → Pages
   ```
4. في **Source**، اختر:
   ```
   Deploy from a branch → main → / (root)
   ```
5. اضغط **Save**

**انتظر 2-3 دقائق** — سيظهر رابط موقعك:
```
https://yourname.github.io/trustwall
```

---

## 🎉 جاهز!

موقعك الآن يعمل على:
```
https://yourname.github.io/trustwall
```

**مجاني — دائم — لا ينام — بدون بطاقة!** 🚀

---

## 📁 هيكل المشروع

```
TrustWall-Static/
├── index.html          # الصفحة الرئيسية
├── login.html          # تسجيل الدخول
├── register.html       # إنشاء حساب
├── dashboard.html      # لوحة التحكم
├── wall.html           # عرض الجدار العام
├── submit.html         # صفحة جمع الشهادات
├── css/
│   └── style.css       # التصميم
└── js/
    ├── supabase-config.js  # إعدادات Supabase
    ├── auth.js             # تسجيل الدخول/الخروج
    ├── dashboard.js        # لوحة التحكم
    ├── wall.js             # عرض الشهادات
    └── submit.js           # إرسال الشهادة
```

---

## 💰 نموذج الربح (Freemium)

| الخطة | المميزات | السعر |
|-------|---------|-------|
| **مجاني** | 1 جدار، 10 شهادات | 0$ |
| **برو** | جدران غير محدودة | 9$/شهر |

---

## 📝 ملاحظات

- Supabase Free Tier: 500MB DB + 2GB transfer
- GitHub Pages: مجاني + دائم
- لا يوجد Backend — كل شيء يعمل في المتصفح

---

**بني ب❤️ في المغرب**
