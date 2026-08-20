import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

// Connects to the backend's WebSocket channel (server.js: WebSocketServer at /live)
// and fans out incoming messages by type: 'vitals' | 'environment' | 'location' |
// 'fall_detected' | 'fall_status_update'. See Architecture.md §6.
//
// NOTE: the backend currently broadcasts to every connected client regardless of
// device/user (a documented gap — see rules.md §5). This context works fine against
// that today, and will keep working once the backend adds per-device scoping.

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/live';

const LiveDataContext = createContext(null);

export function LiveDataProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [vitals, setVitals] = useState(null);
  const [environment, setEnvironment] = useState(null);
  const [location, setLocation] = useState(null);
  const [activeFall, setActiveFall] = useState(null); // the current unresolved fall event, if any
  const listenersRef = useRef(new Set());
  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);

  const onMessage = useCallback((event) => {
    let msg;
    try {
      msg = JSON.parse(event.data);
    } catch {
      return;
    }
    switch (msg.type) {
      case 'vitals':
        setVitals(msg.data);
        break;
      case 'environment':
        setEnvironment(msg.data);
        break;
      case 'location':
        setLocation(msg.data);
        break;
      case 'fall_detected':
        setActiveFall(msg.data);
        break;
      case 'fall_status_update':
        setActiveFall((prev) => {
          if (!prev || prev._id !== msg.data._id) return prev;
          const resolved = ['confirmed_false_alarm', 'resolved'].includes(msg.data.status);
          return resolved ? null : msg.data;
        });
        break;
      default:
        break;
    }
    listenersRef.current.forEach((fn) => fn(msg));
  }, []);

  useEffect(() => {
    let cancelled = false;

    function connect() {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => !cancelled && setConnected(true);
      ws.onclose = () => {
        if (cancelled) return;
        setConnected(false);
        // simple reconnect with backoff
        reconnectTimerRef.current = setTimeout(connect, 3000);
      };
      ws.onerror = () => ws.close();
      ws.onmessage = onMessage;
    }

    connect();
    return () => {
      cancelled = true;
      clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
    };
  }, [onMessage]);

  // allow pages to subscribe to raw messages if they need something
  // beyond the four convenience states above (e.g. History page)
  const subscribe = useCallback((fn) => {
    listenersRef.current.add(fn);
    return () => listenersRef.current.delete(fn);
  }, []);

  const dismissFall = useCallback(() => setActiveFall(null), []);

  const value = { connected, vitals, environment, location, activeFall, subscribe, dismissFall };
  return <LiveDataContext.Provider value={value}>{children}</LiveDataContext.Provider>;
}

export function useLiveData() {
  const ctx = useContext(LiveDataContext);
  if (!ctx) throw new Error('useLiveData must be used inside a LiveDataProvider');
  return ctx;
}
