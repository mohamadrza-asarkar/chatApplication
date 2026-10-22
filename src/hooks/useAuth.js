import { useState, useEffect } from 'react';
import { CONFIG } from '../config/constants.js';
import { socket } from '../services/socket.js';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(CONFIG.AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Re-sync user session with socket server on load
  useEffect(() => {
    if (currentUser?.username) {
      socket.emit('auth:reconnect', { username: currentUser.username });
    }
  }, [currentUser?.username]);

  const login = (username, password, callback) => {
    socket.emit('auth:login', { username, password }, (res) => {
      if (res?.success) {
        setCurrentUser(res.user);
        try {
          localStorage.setItem(CONFIG.AUTH_STORAGE_KEY, JSON.stringify(res.user));
        } catch {}
      }
      callback?.(res);
    });
  };

  const register = (username, password, name, callback) => {
    socket.emit('auth:register', { username, password, name }, (res) => {
      if (res?.success) {
        setCurrentUser(res.user);
        try {
          localStorage.setItem(CONFIG.AUTH_STORAGE_KEY, JSON.stringify(res.user));
        } catch {}
      }
      callback?.(res);
    });
  };

  const logout = () => {
    socket.emit('user:logout');
    localStorage.removeItem(CONFIG.AUTH_STORAGE_KEY);
    setCurrentUser(null);
  };

  return {
    currentUser,
    login,
    register,
    logout,
  };
}
