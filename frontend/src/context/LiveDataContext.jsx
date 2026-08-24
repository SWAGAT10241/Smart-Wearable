import {createContext,useContext,useEffect,useRef,useState,useCallback,} from "react";
const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000/live";
const LiveDataContext = createContext(null);

export function LiveDataProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [vitals, setVitals] = useState(null);
  const [environment, setEnvironment] = useState(null);
  const [location, setLocation] = useState(null);
  const [activeFall, setActiveFall] = useState(null);
  const listenersRef = useRef(new Set());
  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const stoppedRef = useRef(false);
  const onMessage = useCallback((event) => {
    let msg;
    try {
      msg = JSON.parse(event.data);
    } catch (error) {
      console.warn("Invalid WebSocket message:", event.data);
      return;
    }
    if (!msg?.type) {
      return;
    }
    switch (msg.type) {
      case "vitals":
        setVitals(msg.data);
        break;
      case "environment":
        setEnvironment(msg.data);
        break;
      case "location":
        setLocation(msg.data);
        break;
      case "fall_detected":
        setActiveFall(msg.data);
        break;
      case "fall_status_update":
        setActiveFall((prev) => {
          if (!prev || prev._id !== msg.data?._id) {
            return prev;
          }
          const resolved = [
            "confirmed_false_alarm",
            "resolved",
          ].includes(msg.data.status);
          return resolved ? null : msg.data;
        });
        break;
      default:break;
    }

    listenersRef.current.forEach((listener) => {
      try {
        listener(msg);
      } catch (error) {
        console.error("LiveData listener error:", error);
      }
    });
  }, []);

  const connect = useCallback(() => {
    if (stoppedRef.current) {
      return;
    }

    if (
      wsRef.current &&
      (
        wsRef.current.readyState === WebSocket.CONNECTING ||
        wsRef.current.readyState === WebSocket.OPEN
      )
    ) {
      return;
    }

    console.log("[LiveData] Connecting:", WS_URL);

    let ws;

    try {
      ws = new WebSocket(WS_URL);
    } catch (error) {
      console.error("[LiveData] Failed to create WebSocket:", error);
      setConnected(false);
      return;
    }
    wsRef.current = ws;

    ws.onopen = () => {
      if (stoppedRef.current) {
        ws.close();
        return;
      }
      console.log("[LiveData] WebSocket connected");
      setConnected(true);
    };

    ws.onmessage = onMessage;
    ws.onerror = (error) => {
      console.error("[LiveData] WebSocket error:", error);
    };
    ws.onclose = (event) => {
      console.warn(
        `[LiveData] WebSocket closed. code=${event.code} reason=${event.reason || "none"}`
      );
      if (wsRef.current === ws) {
        wsRef.current = null;
      }
      setConnected(false);
      if (stoppedRef.current) {
        return;
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      reconnectTimerRef.current = setTimeout(() => {
        reconnectTimerRef.current = null;
        connect();
      }, 3000);
    };
  }, [WS_URL, onMessage]);

  useEffect(() => {
    stoppedRef.current = false;
    connect();
    return () => {
      stoppedRef.current = true;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      const ws = wsRef.current;
      wsRef.current = null;
      if (ws) {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
        if (
          ws.readyState === WebSocket.CONNECTING ||
          ws.readyState === WebSocket.OPEN
        ) {
          ws.close();
        }
      }
      setConnected(false);
    };
  }, [connect]);

  const subscribe = useCallback((fn) => {
    listenersRef.current.add(fn);

    return () => {
      listenersRef.current.delete(fn);
    };
  }, []);

  const dismissFall = useCallback(() => {
    setActiveFall(null);
  }, []);

  const value = {
    connected,vitals,environment,location,activeFall,subscribe,dismissFall,
  };

  return (
    <LiveDataContext.Provider value={value}>
      {children}
    </LiveDataContext.Provider>
  );
}

export function useLiveData() {
  const ctx = useContext(LiveDataContext);

  if (!ctx) {
    throw new Error(
      "useLiveData must be used inside a LiveDataProvider"
    );
  }

  return ctx;
}