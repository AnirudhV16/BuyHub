/** @format */

import React, { useState, useEffect, createContext, useContext } from "react";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };

    setNotifications((prev) => [...prev, notification]);

    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const showSuccess = (message, duration = 3000) =>
    addNotification(message, "success", duration);
  const showError = (message, duration = 4000) =>
    addNotification(message, "error", duration);
  const showInfo = (message, duration = 3000) =>
    addNotification(message, "info", duration);
  const showWarning = (message, duration = 3500) =>
    addNotification(message, "warning", duration);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const Notification = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(notification.id), 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      default:
        return "ℹ";
    }
  };

  const getTypeClass = () => {
    switch (notification.type) {
      case "success":
        return "notification-success";
      case "error":
        return "notification-error";
      case "warning":
        return "notification-warning";
      default:
        return "notification-info";
    }
  };

  return (
    <div
      className={`notification ${getTypeClass()} ${
        isVisible ? "notification-visible" : ""
      } ${isRemoving ? "notification-removing" : ""}`}
      onClick={handleRemove}
    >
      <div className="notification-icon">{getIcon()}</div>
      <div className="notification-message">{notification.message}</div>
      <button className="notification-close" onClick={handleRemove}>
        ×
      </button>
    </div>
  );
};

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};
