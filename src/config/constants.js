export const CONFIG = {
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  AUTH_STORAGE_KEY: 'chatapp_auth_user',
  DEFAULT_ROOMS: [
    {
      id: 'room-general',
      name: 'اتاق عمومی',
      description: 'گفتگوی همگانی کاربران',
      isRoom: true,
    },
    {
      id: 'room-dev',
      name: 'توسعه‌دهندگان',
      description: 'بحث و تبادل نظر پیرامون کدنویسی و وب',
      isRoom: true,
    },
    {
      id: 'room-design',
      name: 'طراحی و UI/UX',
      description: 'ایده‌ها و تجارب رابط کاربری',
      isRoom: true,
    },
  ],
};
