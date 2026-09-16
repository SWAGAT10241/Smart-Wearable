import React, { createContext, useContext, useEffect, useState } from "react";

import {
  vitalsApi,
  environmentApi,
  locationApi,
  fallsApi,
  WS_URL,
} from "../lib/apiClient";

import { useDevices } from "./DeviceContext";

const LiveDataContext = createContext(null);

export function LiveDataProvider({ children }) {
  const { selectedDeviceId } = useDevices();

  const [vitals, setVitals] = useState(null);
  const [environment, setEnvironment] = useState(null);
  const [location, setLocation] = useState(null);
  const [falls, setFalls] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadData() {
    if (!selectedDeviceId) {
      setVitals(null);
      setEnvironment(null);
      setLocation(null);
      setFalls([]);
      return;
    }

    try {
      setLoading(true);

      const [
        vitalsResponse,
        environmentResponse,
        locationResponse,
        fallsResponse,
      ] = await Promise.all([
        vitalsApi.latest(selectedDeviceId),
        environmentApi.latest(selectedDeviceId),
        locationApi.latest(selectedDeviceId),
        fallsApi.all(selectedDeviceId),
      ]);

      setVitals(vitalsResponse?.vitals || vitalsResponse || null);
      setEnvironment(environmentResponse?.environment || environmentResponse || null,);
      setLocation(locationResponse?.location || locationResponse || null);

      setFalls(
        Array.isArray(fallsResponse)
          ? fallsResponse
          : fallsResponse?.falls || [],
      );
    } catch (error) {
      console.log("Live data error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();

    if (!selectedDeviceId) {
      return;
    }

    let socket;

    try {
      socket = new WebSocket(WS_URL);

      socket.onopen = () => {
        setConnected(true);

        try {
          socket.send(
            JSON.stringify({
              deviceId: selectedDeviceId,
            }),
          );
        } catch {}
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.vitals) {
            setVitals(data.vitals);
          }

          if (data.environment) {
            setEnvironment(data.environment);
          }

          if (data.location) {
            setLocation(data.location);
          }

          if (data.fall) {
            setFalls((current) => [data.fall, ...current]);
          }
        } catch {}
      };

      socket.onerror = () => {
        setConnected(false);
      };

      socket.onclose = () => {
        setConnected(false);
      };
    } catch {
      setConnected(false);
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [selectedDeviceId]);

  return (
    <LiveDataContext.Provider
      value={{
        vitals,
        environment,
        location,
        falls,
        connected,
        loading,
        refresh: loadData,
      }}
    >
      {children}
    </LiveDataContext.Provider>
  );
}

export function useLiveData() {
  return useContext(LiveDataContext);
}
