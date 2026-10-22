import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth.js';
import { useChat } from './hooks/useChat.js';
import { Auth } from './components/Auth/Auth.jsx';
import { Sidebar } from './components/Sidebar/Sidebar.jsx';
import { ChatArea } from './components/ChatArea/ChatArea.jsx';
import styles from './App.module.css';

export default function App() {
  const { currentUser, login, register, logout } = useAuth();
  const {
    isConnected,
    rooms,
    users,
    activeTarget,
    setActiveTarget,
    messages,
    typingNotice,
    sendMessage,
    sendTyping,
    serverUrl,
  } = useChat(currentUser);

  const [showMobileChat, setShowMobileChat] = useState(false);

  const handleSelectTarget = (target) => {
    setActiveTarget(target);
    setShowMobileChat(true);
  };

  if (!currentUser) {
    return (
      <Auth
        onLogin={login}
        onRegister={register}
        isConnected={isConnected}
        serverUrl={serverUrl}
      />
    );
  }

  return (
    <div className={styles.appContainer}>
      <div
        className={`${styles.sidebarWrapper} ${
          showMobileChat ? styles.sidebarWrapperMobileHidden : ''
        }`}
      >
        <Sidebar
          currentUser={currentUser}
          rooms={rooms}
          users={users}
          activeTarget={activeTarget}
          isConnected={isConnected}
          serverUrl={serverUrl}
          onSelectTarget={handleSelectTarget}
          onLogout={logout}
        />
      </div>

      <div
        className={`${styles.chatAreaWrapper} ${
          !showMobileChat ? styles.chatAreaWrapperMobileHidden : ''
        }`}
      >
        <ChatArea
          currentUser={currentUser}
          target={activeTarget}
          messages={messages}
          typingNotice={typingNotice}
          onSendMessage={sendMessage}
          onTyping={sendTyping}
          onBack={() => setShowMobileChat(false)}
        />
      </div>
    </div>
  );
}
