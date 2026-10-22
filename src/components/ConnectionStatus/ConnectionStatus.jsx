import React from 'react';
import styles from './ConnectionStatus.module.css';

export function ConnectionStatus({ isConnected, serverUrl }) {
  return (
    <div
      className={`${styles.statusBadge} ${
        isConnected ? styles.connected : styles.disconnected
      }`}
      title={`آدرس سرور وب‌سوکت: ${serverUrl}`}
    >
      <span
        className={`${styles.dot} ${
          isConnected ? styles.dotConnected : styles.dotDisconnected
        }`}
      />
      <span>{isConnected ? 'متصل به سرور' : 'در انتظار اتصال'}</span>
      <span className={styles.serverAddress}>({serverUrl})</span>
    </div>
  );
}
