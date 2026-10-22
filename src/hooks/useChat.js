import { useState, useEffect, useCallback } from 'react';
import { socket } from '../services/socket.js';
import { CONFIG } from '../config/constants.js';

export function useChat(currentUser) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [rooms, setRooms] = useState(CONFIG.DEFAULT_ROOMS);
  const [users, setUsers] = useState([]);
  const [activeTarget, setActiveTarget] = useState(CONFIG.DEFAULT_ROOMS[0] || null);
  const [messages, setMessages] = useState([]);
  const [typingNotice, setTypingNotice] = useState('');

  // Track connection status
  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  // Fetch initial rooms and users when user logs in or reconnects
  useEffect(() => {
    if (!currentUser) return;

    socket.emit('chat:get-initial-data', (data) => {
      if (data?.rooms?.length) {
        setRooms(data.rooms);
      }
      if (data?.users) {
        setUsers(data.users);
      }
    });
  }, [currentUser, isConnected]);

  // Listen for incoming messages, user list updates, and typing events
  useEffect(() => {
    const handleUsersUpdated = (updatedUsers) => {
      setUsers(updatedUsers || []);
    };

    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        if (!activeTarget) return prev;

        const isCurrentRoom =
          activeTarget.isRoom && msg.isRoom && msg.targetId === activeTarget.id;

        const isCurrentPrivate =
          !activeTarget.isRoom &&
          !msg.isRoom &&
          (msg.senderUsername === activeTarget.username ||
            msg.targetId === activeTarget.username);

        if (isCurrentRoom || isCurrentPrivate) {
          return [...prev, msg];
        }
        return prev;
      });
    };

    const handleUserTyping = ({ targetId, username, name, isTyping }) => {
      if (!activeTarget) return;

      const isCurrentChat =
        (activeTarget.isRoom && activeTarget.id === targetId) ||
        (!activeTarget.isRoom && activeTarget.username === username);

      if (isCurrentChat) {
        setTypingNotice(isTyping ? `${name || username} در حال نوشتن است...` : '');
      }
    };

    socket.on('users:updated', handleUsersUpdated);
    socket.on('chat:new-message', handleNewMessage);
    socket.on('chat:user-typing', handleUserTyping);

    return () => {
      socket.off('users:updated', handleUsersUpdated);
      socket.off('chat:new-message', handleNewMessage);
      socket.off('chat:user-typing', handleUserTyping);
    };
  }, [activeTarget]);

  // Request message history when switching target room or user
  useEffect(() => {
    if (!activeTarget || !currentUser) {
      setMessages([]);
      return;
    }

    setTypingNotice('');

    socket.emit(
      'chat:get-messages',
      {
        targetId: activeTarget.id || activeTarget.username,
        isRoom: Boolean(activeTarget.isRoom),
      },
      (res) => {
        if (res?.messages) {
          setMessages(res.messages);
        } else {
          setMessages([]);
        }
      }
    );
  }, [activeTarget, currentUser]);

  const sendMessage = useCallback(
    (text) => {
      if (!activeTarget || !text?.trim()) return;

      const targetId = activeTarget.isRoom ? activeTarget.id : activeTarget.username;

      socket.emit('chat:send-message', {
        targetId,
        isRoom: Boolean(activeTarget.isRoom),
        text: text.trim(),
      });
    },
    [activeTarget]
  );

  const sendTyping = useCallback(
    (isTyping) => {
      if (!activeTarget) return;

      const targetId = activeTarget.isRoom ? activeTarget.id : activeTarget.username;

      socket.emit('chat:typing', {
        targetId,
        isRoom: Boolean(activeTarget.isRoom),
        isTyping,
      });
    },
    [activeTarget]
  );

  return {
    isConnected,
    rooms,
    users,
    activeTarget,
    setActiveTarget,
    messages,
    typingNotice,
    sendMessage,
    sendTyping,
    serverUrl: CONFIG.SOCKET_URL,
  };
}
