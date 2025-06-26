import '../styles/Notifications.css';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { registerNotificationHandlers } from './utils/notificationService';
import closeIcon from '../assets/img/close-icon.png';

function useNotification() {
  const [notification, setNotification] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const createNotification = useCallback((message: string, duration: number) => {
      // If there’s already a pending timeout, clear it
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Show the new notification
      setNotification(message);

      // Schedule its removal and keep the timeout ID
      timeoutRef.current = window.setTimeout(() => {
        setNotification(null);
        timeoutRef.current = null; // clean up the ref
      }, duration);
    },
    []
  );

  const dismissNotification = useCallback(() => {
    // Clear the pending removal timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // Immediately hide the notification
    setNotification(null);
  }, []);

  // On unmount, make sure we don’t leave any timers running
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { notification, createNotification, dismissNotification };
}

export interface AlertProps {
    message: string
    onConfirm: () => void
}

export function Notifications() {
    // notification and alerts
    const { notification, createNotification, dismissNotification } = useNotification();
    const [currentAlert, setCurrentAlert] = useState<AlertProps | null>(null)

    useEffect(() => {
        registerNotificationHandlers(createNotification, setCurrentAlert);
    }, [createNotification]);  

    return (
        <>
            {notification && (
                <Notification message={notification} onDismissMessage={dismissNotification} />
            )}

            {currentAlert && (
                <Alert 
                    message={currentAlert.message} 
                    onConfirm={() => {currentAlert.onConfirm(); setCurrentAlert(null)}} 
                    onDismiss={() => setCurrentAlert(null)}/>
            )}
        </>
    )
}

interface AlertTagProps {
    message: string
    onConfirm: () => void
    onDismiss: () => void
}

const Alert: React.FC<AlertTagProps> = ({ message, onConfirm, onDismiss }) => {
    const [isWiggling, setIsWiggling] = useState(false);
    const notificationRef = useRef<HTMLDivElement | null>(null);

    const handleBlockerClick = () => {
        if (isWiggling) return;
        setIsWiggling(true);

        // remove the class after the animation finishes
        const el = notificationRef.current;
        if (!el || el == undefined) return;

        const onAnimationEnd = () => {
            setIsWiggling(false);
            el.removeEventListener('animationend', onAnimationEnd);
        };
        el.addEventListener('animationend', onAnimationEnd);
    };

    return (
        <div className="alert-blocker" onClick={handleBlockerClick}>
            <div ref={notificationRef} className={`alert ${isWiggling ? 'wiggle' : ''}`}>

                <div className="alert-header">
                    <img
                        src={closeIcon}
                        alt="Refresh chatbot icon"
                        style={{ height: '1em', cursor: 'pointer' }}
                         onClick={onDismiss}
                    />
                </div>

                <div className="aleart-content">
                    <p className="alert-message">{message}</p>
                </div>

                <div className="alert-buttons">
                    <button onClick={onDismiss} id="AlertButton1">Abbrechen</button>
                    <button onClick={onConfirm} id="AlertButton2">Bestätigen</button>
                </div>

            </div>
        </div>
    )
}

interface NotificationProps {
    message: string
    onDismissMessage: () => void
}

const Notification: React.FC<NotificationProps> = ({ message, onDismissMessage }) => {
    return (
        <div className="notification">

            <p className="aleart-message">{message}</p>

            <img
                src={closeIcon}
                alt="Refresh chatbot icon"
                style={{ height: '1em', cursor: 'pointer' }}
                onClick={onDismissMessage}
            />

        </div>
    )
}