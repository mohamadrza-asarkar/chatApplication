import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { ConnectionStatus } from '../ConnectionStatus/ConnectionStatus.jsx';
import styles from './Auth.module.css';

export function Auth({ onLogin, onRegister, isConnected, serverUrl }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setError('لطفاً همه فیلدهای الزامی را پر کنید.');
      return;
    }

    setLoading(true);

    if (isLogin) {
      onLogin(cleanUser, cleanPass, (res) => {
        setLoading(false);
        if (!res?.success) {
          setError(res?.error || 'خطا در برقراری ارتباط با سرور.');
        }
      });
    } else {
      onRegister(cleanUser, cleanPass, name.trim(), (res) => {
        setLoading(false);
        if (!res?.success) {
          setError(res?.error || 'خطا در ثبت‌نام کاربر.');
        }
      });
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.topBadgeWrapper}>
          <ConnectionStatus isConnected={isConnected} serverUrl={serverUrl} />
        </div>

        <div className={styles.authHeader}>
          <div className={styles.authIcon}>
            <MessageSquare size={26} />
          </div>
          <h1 className={styles.authTitle}>ورود به پیام‌رسان</h1>
          <p className={styles.authSubtitle}>
            {isLogin
              ? 'برای شروع گفتگو وارد حساب خود شوید'
              : 'یک حساب کاربری جدید ایجاد کنید'}
          </p>
        </div>

        <div className={styles.tabSwitch}>
          <button
            type="button"
            className={`${styles.tabButton} ${isLogin ? styles.tabButtonActive : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
          >
            ورود به حساب
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${!isLogin ? styles.tabButtonActive : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
          >
            ثبت‌نام جدید
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label className={styles.label}>نام نمایشی</label>
              <input
                type="text"
                placeholder="مثال: علی احمدی"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>نام کاربری</label>
            <input
              type="text"
              required
              placeholder="مثال: ali"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>رمز عبور</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? 'در حال ارسال درخواست...' : isLogin ? 'ورود به چت' : 'ثبت‌نام و ورود'}
          </button>
        </form>
      </div>
    </div>
  );
}
