
# EFA • Post Tracking & Label (React + Vite + Express)

یک وب‌اپ سبک برای **ایجاد مرسوله پست**، دریافت **کد رهگیری** و **پرینت لیبل بارکدی (A6 / 100×150mm)**.

## اجرای سریع (Quick Start)
1) فایل `.env.local` را بر اساس `.env.example` بسازید و متغیرها را مقداردهی کنید.
2) نصب پکیج‌ها:
   ```bash
   npm install
   ```
3) اجرا (Backend + Frontend همزمان):
   ```bash
   npm run dev
   ```
   - فرانت: http://localhost:5173
   - سرور:  http://localhost:3001

> اولین صفحه **Login** است. بعد از ورود، فرم ایجاد مرسوله باز می‌شود.

## محل تغییر Username/Password
- **روش ۱ (پیشنهادی):** در فایل `.env.local` مقادیر زیر را تغییر دهید:
  ```env
  APP_USERNAME=admin
  APP_PASSWORD=admin123
  SESSION_SECRET=یک-رشته-تصادفی-ایمن
  ```
- **روش ۲:** اگر خواستید در کد هم ببینید، فایل `server/config.js` این متغیرها را می‌خواند.

## اتصال به API پست
- آدرس و کلید سرویس را در `.env.local` تنظیم کنید:
  ```env
  POST_API_BASE=https://api.post.example.com
  POST_API_KEY=
  ```
- مسیر پروکسی برای ایجاد مرسوله:
  - `POST /api/proxy/create-shipment`
  - در حالت **Test Mode** (چک‌باکس داخل فرم)، درخواست به سرویس واقعی ارسال نمی‌شود و یک کد جعلی برمی‌گردد.

### نگاشت بدنه درخواست
- فایل‌های تیپ و تایپ‌ها در `src/types/post.ts` قرار دارد (ShipmentRequest/Response).
- در صورت تفاوت با داکیومنت واقعی پست، **تنها همین تایپ‌ها و نگاشت در `server/index.js`** را به‌روزرسانی کنید:
  - Endpoint فعلی فرضی: `POST {POST_API_BASE}/shipments`
  - اگر داکیومنت شما مسیر/فیلد دیگری دارد، همین‌جا تغییر دهید.

## چاپ لیبل (A6 / 100×150mm)
- استایل چاپ در `src/styles/print.css` تعریف شده است:
  ```css
  @page { size: 100mm 150mm; margin: 0 }
  ```
- دکمه **«پرینت لیبل»** با `window.print()` همه اجزای غیرضروری را مخفی می‌کند.

## ولیدیشن و UX
- ولیدیشن فرم با **Zod + React Hook Form** انجام می‌شود (پیام خطا RTL).
- بارکد SVG با **JsBarcode** (فرمت CODE128) ساخته می‌شود.
- دکمه‌های **کپی کد رهگیری** و **فرم جدید** در صفحه وجود دارد.

## امنیت
- احراز هویت سبک: نام‌کاربری/گذرواژه و **کوکی HttpOnly سشن**.
- **Secrets واقعی** فقط در Backend نگهداری می‌شود (فایل `.env.local`).

## ساختار پوشه‌ها
```text
/project-root
  /server           ← Express proxy (/api/*), نگهداری secrets
  /src
    /components     ← Barcode و ...
    /pages          ← Login, CreateShipment
    /lib            ← fetcher
    /styles         ← global.css + print.css
    /types          ← تایپ‌های TypeScript
  .env.example
  README.md
```

## خطاهای رایج
- 401 هنگام ارسال: وارد نشده‌اید → ابتدا Login کنید.
- 502 از پروکسی: پاسخ سرویس پست **بدون** `trackingCode` است → نگاشت پاسخ را با داکیومنت چک کنید.
- CORS: همه تماس‌ها فقط به `/api/*` روی سرور داخلی می‌رود. فرانت نباید مستقیم به بیرون بزند.

---
**یادداشت:** چون داکیومنت رسمی پست ممکن است با فرضیات این پروژه متفاوت باشد، اگر `Ecommerce.Api.v.1.0.0.2.pdf`
یا Swagger دارید، فقط `server/index.js` (endpoint و header) و `src/types/post.ts` (فیلدها) را با آن تطبیق دهید.
