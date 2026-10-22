import React, { useState } from 'react';
import { LogOut, Hash, User, Search } from 'lucide-react';
import { ConnectionStatus } from '../ConnectionStatus/ConnectionStatus.jsx';
import styles from './Sidebar.module.css';

export function Sidebar({
  currentUser,
  rooms,
  users,
  activeTarget,
  isConnected,
  serverUrl,
  onSelectTarget,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState('rooms');
  const [search, setSearch] = useState('');

  const otherUsers = (users || []).filter((u) => u.username !== currentUser?.username);

  const filteredRooms = (rooms || []).filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.description && r.description.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredUsers = otherUsers.filter((u) =>
    (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className={styles.sidebar}>
      {/* Current User Profile Bar */}
      <div className={styles.profileBar}>
        <div className={styles.userInfo}>
          <div className={styles.avatarWrapper}>
            <img
              src={currentUser?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser?.username}`}
              alt={currentUser?.name}
              className={styles.avatar}
            />
            <span
              className={styles.statusIndicator}
              style={{ background: isConnected ? '#10b981' : '#f59e0b' }}
            />
          </div>
          <div>
            <div className={styles.userName}>{currentUser?.name || currentUser?.username}</div>
            <div className={styles.userHandle}>@{currentUser?.username}</div>
          </div>
        </div>

        <button
          onClick={onLogout}
          title="خروج از حساب"
          className={styles.logoutBtn}
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Real-time server connection indicator */}
      <div className={styles.connectionRow}>
        <ConnectionStatus isConnected={isConnected} serverUrl={serverUrl} />
      </div>

      {/* Tabs Switcher: Rooms vs Direct Messages */}
      <div className={styles.tabSwitch}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'rooms' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          <Hash size={14} />
          اتاق‌ها ({rooms.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'direct' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('direct')}
        >
          <User size={14} />
          کاربران ({otherUsers.filter((u) => u.online).length} آنلاین)
        </button>
      </div>

      {/* Search Filter */}
      <div className={styles.searchBox}>
        <div className={styles.searchInputWrapper}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={activeTab === 'rooms' ? 'جستجوی اتاق...' : 'جستجوی کاربر...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* List Container */}
      <div className={styles.listContainer}>
        {activeTab === 'rooms' ? (
          filteredRooms.length === 0 ? (
            <div className={styles.emptyNotice}>اتاقی یافت نشد.</div>
          ) : (
            filteredRooms.map((room) => {
              const isActive = activeTarget?.id === room.id && activeTarget?.isRoom;
              return (
                <div
                  key={room.id}
                  onClick={() => onSelectTarget({ ...room, isRoom: true })}
                  className={`${styles.listItem} ${isActive ? styles.listItemActive : ''}`}
                >
                  <div className={styles.roomIconBadge}>
                    <Hash size={18} />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemTitle}>{room.name}</div>
                    <div className={styles.itemDesc}>{room.description}</div>
                  </div>
                </div>
              );
            })
          )
        ) : (
          filteredUsers.length === 0 ? (
            <div className={styles.emptyNotice}>کاربری در دسترس نیست.</div>
          ) : (
            filteredUsers.map((user) => {
              const isActive = activeTarget?.username === user.username && !activeTarget?.isRoom;
              return (
                <div
                  key={user.id || user.username}
                  onClick={() =>
                    onSelectTarget({
                      id: user.username,
                      username: user.username,
                      name: user.name || user.username,
                      avatar: user.avatar,
                      online: user.online,
                      isRoom: false,
                    })
                  }
                  className={`${styles.listItem} ${isActive ? styles.listItemActive : ''}`}
                >
                  <div className={styles.itemAvatarWrapper}>
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                      alt={user.name}
                      className={styles.itemAvatar}
                    />
                    <span
                      className={styles.statusIndicator}
                      style={{ background: user.online ? '#10b981' : '#cbd5e1' }}
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemTitle}>{user.name || user.username}</div>
                    <div className={styles.itemDesc}>
                      {user.online ? 'آنلاین' : 'آفلاین'} • @{user.username}
                    </div>
                  </div>
                </div>
              );
            })
          )
        )}
      </div>
    </aside>
  );
}
