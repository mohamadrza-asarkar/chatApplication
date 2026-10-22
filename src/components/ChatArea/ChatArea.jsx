import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Hash, ArrowRight, CheckCheck, MessageSquare } from 'lucide-react';
import styles from './ChatArea.module.css';

const QUICK_EMOJIS = ['👍', '❤️', '😂', '🔥', '🙏', '🎉', '👌', '👏', '✨'];

export function ChatArea({
  currentUser,
  target,
  messages,
  typingNotice,
  onSendMessage,
  onTyping,
  onBack,
}) {
  const [inputText, setInputText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [target?.id, target?.username]);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages?.length, typingNotice]);

  if (!target) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <MessageSquare size={30} />
        </div>
        <div className={styles.emptyTitle}>گفتگویی انتخاب نشده است</div>
        <p className={styles.emptySubtitle}>
          برای شروع چت، از منوی سمت راست یک اتاق گفتگو یا یکی از مخاطبین را انتخاب کنید.
        </p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (onTyping) {
      onTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1500);
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    onSendMessage(trimmed);
    setInputText('');
    setShowEmoji(false);

    if (onTyping) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      onTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji) => {
    setInputText((prev) => prev + emoji);
  };

  return (
    <main className={styles.chatArea}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          {onBack && (
            <button onClick={onBack} className={styles.backBtn} title="بازگشت">
              <ArrowRight size={20} />
            </button>
          )}

          {target.isRoom ? (
            <div className={styles.roomHeaderBadge}>
              <Hash size={20} />
            </div>
          ) : (
            <div className={styles.headerAvatarWrapper}>
              <img
                src={target.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${target.username}`}
                alt={target.name}
                className={styles.headerAvatar}
              />
            </div>
          )}

          <div>
            <div className={styles.headerTitle}>{target.name || target.username}</div>
            <div className={styles.headerSubtitle}>
              {target.isRoom
                ? target.description || 'اتاق گفتگوی عمومی'
                : target.online
                ? 'آنلاین در چت'
                : 'آفلاین'}
            </div>
          </div>
        </div>
      </header>

      {/* Messages Feed */}
      <div className={styles.messagesList}>
        {!messages || messages.length === 0 ? (
          <div className={styles.emptyChatNotice}>
            هنوز پیامی رد و بدل نشده است. اولین پیام را ارسال کنید!
          </div>
        ) : (
          messages.map((msg) => {
            const isOutgoing = msg.senderUsername === currentUser?.username;
            return (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${
                  isOutgoing ? styles.messageRowOutgoing : styles.messageRowIncoming
                }`}
              >
                <div
                  className={`${styles.bubble} ${
                    isOutgoing ? styles.bubbleOutgoing : styles.bubbleIncoming
                  }`}
                >
                  {!isOutgoing && target.isRoom && (
                    <span className={styles.senderBadge}>
                      {msg.senderName || msg.senderUsername}
                    </span>
                  )}
                  <div className={styles.messageText}>{msg.text}</div>
                  <div
                    className={`${styles.messageFooter} ${
                      isOutgoing ? styles.messageFooterOutgoing : styles.messageFooterIncoming
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isOutgoing && <CheckCheck size={13} />}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {typingNotice && (
        <div className={styles.typingNotice}>
          <span>{typingNotice}</span>
        </div>
      )}

      {/* Quick Emojis */}
      {showEmoji && (
        <div className={styles.emojiBar}>
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className={styles.emojiItem}
              onClick={() => addEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <footer className={styles.inputFooter}>
        <form onSubmit={handleSend} className={styles.inputForm}>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => setShowEmoji(!showEmoji)}
            title="ایموجی"
          >
            <Smile size={20} />
          </button>

          <input
            type="text"
            placeholder={
              target.isRoom
                ? `ارسال پیام در #${target.name}...`
                : `ارسال پیام به ${target.name || target.username}...`
            }
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={styles.textInput}
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className={styles.sendBtn}
            title="ارسال"
          >
            <Send size={16} style={{ transform: 'rotate(-90deg)' }} />
          </button>
        </form>
      </footer>
    </main>
  );
}
