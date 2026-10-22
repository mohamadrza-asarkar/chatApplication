import { io } from 'socket.io-client';
import { CONFIG } from '../config/constants.js';

export const socket = io(CONFIG.SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
  timeout: 10000,
});

export const connectSocket = (user) => {
  if (!socket.connected) {
    socket.connect();
  }
  if (user?.username) {
    socket.emit('auth:reconnect', { username: user.username });
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
