# وضعیت پروژه چت‌اپلیکیشن (ChatApp)

## هدف و معرفی
یک فرانت‌اند پیام‌رسان و چت بلادرنگ (Real-time) تمیز با React 19، وایت (Vite)، جاوااسکریپت خالص (بدون تایپ‌اسکریپت) و استایل‌های مستقل با ماژول‌های CSS (`.module.css`)، طراحی‌شده برای ارتباط با بک‌اند خارجی Socket.io.

## ساختار لایه‌ای پوشه‌بندی (Folder Structure)
```
/
├── .env.example                               # نمونه متغیرهای محیطی شامل VITE_SOCKET_URL
├── index.html                                 # فایل اصلی HTML و متاتگ‌ها
├── metadata.json                              # متادیتای سیستم
├── package.json                               # پکیج‌ها و اسکریپت‌های اجرایی Vite
├── vite.config.js                             # تنظیمات Vite با جاوااسکریپت خالص
└── src/
    ├── main.jsx                               # نقطه ورود کلاینت
    ├── index.css                              # ریست سراسری استایل‌ها و فونت وزیرمتن
    ├── App.jsx                                # کامپوننت والد و کنترل جریان صفحه
    ├── App.module.css                         # استایل چیدمان اصلی برنامه
    ├── config/
    │   └── constants.js                       # آدرس سرور خارجی، کلیدهای حافظه و اتاق‌های پیش‌فرض
    ├── services/
    │   └── socket.js                          # کلاینت Socket.io و توابع کمکی اتصال/قطع اتصال
    ├── hooks/
    │   ├── useAuth.js                         # هوک مدیریت ورود، ثبت‌نام، ذخیره سشن و خروج
    │   └── useChat.js                         # هوک مدیریت پیام‌ها، اتاق‌ها، وضعیت آنلاین و تایپ
    └── components/
        ├── ConnectionStatus/
        │   ├── ConnectionStatus.jsx           # نشانگر وضعیت آنلاین/آفلاین اتصال به سرور خارجی
        │   └── ConnectionStatus.module.css    # استایل نشانگر اتصال
        ├── Auth/
        │   ├── Auth.jsx                       # فرم ورود و ثبت‌نام با رمز عبور
        │   └── Auth.module.css                # استایل فرم لاگین
        ├── Sidebar/
        │   ├── Sidebar.jsx                    # لیست اتاق‌ها، کاربران و جستجو
        │   └── Sidebar.module.css             # استایل سایدبار
        └── ChatArea/
            ├── ChatArea.jsx                   # هدر چت، استریم پیام‌ها و ارسال پیام
            └── ChatArea.module.css            # استایل محیط گفتگو
```

## نحوه اتصال به بک‌اند خارجی
- آدرس سرور وب‌سوکت از طریق متغیر محیطی `VITE_SOCKET_URL` (یا مقدار پیش‌فرض `http://localhost:5000`) در فایل `src/config/constants.js` بارگذاری می‌شود.
- هوک `useChat` وضعیت اتصال را به صورت زنده رصد کرده و در نشانگر `ConnectionStatus` نمایش می‌دهد.
- فرمت رویدادهای استاندارد Socket.io:
  - `auth:login` و `auth:register`
  - `chat:get-initial-data` و `chat:get-messages`
  - `chat:send-message` و `chat:new-message`
  - `chat:typing` و `chat:user-typing`
  - `users:updated`

## وضعیت فعلی
- ساختار کاملاً تمیز، تفکیک‌شده و ۱۰۰٪ جاوااسکریپت خالص است.
- بیلد کلاینت با دستور `vite build` موفقیت‌آمیز است.
