'use client';

import { createContext, useContext, useRef, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const timeoutRefs = useRef({});

  const addNotification = (message, type) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setNotifications(prev => [...prev, { id, message, type }]);
    
    timeoutRefs.current[id] = setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    clearTimeout(timeoutRefs.current[id]);
    delete timeoutRefs.current[id];
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);