import { useEffect, useMemo, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import maplibreWorker from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";

maplibregl.setWorkerUrl(maplibreWorker);

const MAP_STYLES = {
  bright: {
    label: "Bright",
    url: "https://tiles.openfreemap.org/styles/bright",
  },
  liberty: {
    label: "Liberty",
    url: "https://tiles.openfreemap.org/styles/liberty",
  },
  dark: {
    label: "Dark",
    url: "https://tiles.openfreemap.org/styles/dark",
  },
  fiord: {
    label: "Fiord",
    url: "https://tiles.openfreemap.org/styles/fiord",
  },
};

function useDarkMode() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const root = document.documentElement;

    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

function createMarkerElement() {
  const wrapper = document.createElement("div");

  wrapper.className = "tg-map-marker";

  wrapper.innerHTML = `
    <div class="tg-map-marker-pulse"></div>
    <div class="tg-map-marker-dot"></div>
  `;

  return wrapper;
}

export default function LiveMap({ latitude, longitude, trail = [] }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const trailSourceReady = useRef(false);

  const isDark = useDarkMode();
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);

  const [selectedStyle, setSelectedStyle] = useState(() => {
    const savedStyle = localStorage.getItem("trailguard-map-style");

    if (savedStyle && MAP_STYLES[savedStyle]) {
      return savedStyle;
    }

    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "bright";
  });

  const lat = Number(latitude);
  const lng = Number(longitude);

  const hasLocation = Number.isFinite(lat) && Number.isFinite(lng);

  const position = useMemo(
    () => (hasLocation ? [lng, lat] : null),
    [lat, lng, hasLocation],
  );

  const trailPositions = useMemo(() => {
    const points = trail
      .filter(
        (point) =>
          Number.isFinite(Number(point.latitude)) &&
          Number.isFinite(Number(point.longitude)),
      )
      .map((point) => [Number(point.longitude), Number(point.latitude)]);

    if (points.length === 0 && hasLocation) {
      points.push([lng, lat]);
    }

    return points;
  }, [trail, lat, lng, hasLocation]);

  /*
   * Persist the user's selected map style.
   * The preference survives page navigation and reloads.
   */
  useEffect(() => {
    localStorage.setItem("trailguard-map-style", selectedStyle);
  }, [selectedStyle]);
  /*
   * Initialize map.
   */
  useEffect(() => {
    if (!mapContainer.current || mapRef.current || !hasLocation) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLES[selectedStyle].url,
      center: position,
      zoom: 14,
      attributionControl: false,
    });

    mapRef.current = map;

    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true,
      }),
      "top-right",
    );

    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
      }),
      "bottom-right",
    );

    map.on("load", () => {
      /*
       * Trail source.
       */
      map.addSource("trail", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: trailPositions,
          },
        },
      });

      map.addLayer({
        id: "trail-line",
        type: "line",
        source: "trail",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#16B890",
          "line-width": 5,
          "line-opacity": 0.95,
          "line-dasharray": [2, 1.5],
        },
      });

      trailSourceReady.current = true;

      /*
       * Current location marker.
       */
      if (position) {
        const marker = new maplibregl.Marker({
          element: createMarkerElement(),
          anchor: "center",
        })
          .setLngLat(position)
          .addTo(map);

        markerRef.current = marker;
      }

      /*
       * Fit initial trail.
       */
      if (trailPositions.length > 1) {
        const bounds = new maplibregl.LngLatBounds();

        trailPositions.forEach((point) => {
          bounds.extend(point);
        });

        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
          duration: 0,
        });
      }
    });

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;

      map.remove();
      mapRef.current = null;
      trailSourceReady.current = false;
    };
  }, []);

  /*
   * Update marker position.
   */
  useEffect(() => {
    if (!mapRef.current || !position) return;

    if (markerRef.current) {
      markerRef.current.setLngLat(position);
    }
  }, [position]);

  /*
   * Update trail.
   */
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !trailSourceReady.current) return;

    const source = map.getSource("trail");

    if (!source) return;

    source.setData({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: trailPositions,
      },
    });
  }, [trailPositions]);

  /*
   * Change map style.
   */
  const changeMapStyle = (styleName) => {
    const map = mapRef.current;

    if (!map) return;

    const style = MAP_STYLES[styleName];

    if (!style) return;

    setSelectedStyle(styleName);
    setStyleMenuOpen(false);

    map.setStyle(style.url);

    map.once("style.load", () => {
      trailSourceReady.current = false;

      if (!map.getSource("trail")) {
        map.addSource("trail", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: trailPositions,
            },
          },
        });

        map.addLayer({
          id: "trail-line",
          type: "line",
          source: "trail",
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#16B890",
            "line-width": 5,
            "line-opacity": 0.95,
            "line-dasharray": [2, 1.5],
          },
        });
      }

      trailSourceReady.current = true;

      if (markerRef.current && position) {
        markerRef.current.remove();

        markerRef.current = new maplibregl.Marker({
          element: createMarkerElement(),
          anchor: "center",
        })
          .setLngLat(position)
          .addTo(map);
      }
    });
  };

  if (!hasLocation) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center bg-[var(--color-surface-alt)] text-sm text-[var(--color-text-secondary)]">
        Live map will appear once a GPS point arrives.
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[320px] w-full overflow-hidden rounded-[16px]">
      <div ref={mapContainer} className="h-full min-h-[320px] w-full" />

      {/* Map style selector */}
      <div className="absolute left-3 top-3 z-[1000]">
        <button
          type="button"
          onClick={() => setStyleMenuOpen((value) => !value)}
          className="
            flex items-center gap-2
            rounded-xl
            border border-[var(--color-border)]
            bg-[var(--color-surface)]/95
            px-3 py-2
            text-sm font-semibold
            text-[var(--color-text)]
            shadow-lg
            backdrop-blur-md
            transition-all
            hover:bg-[var(--color-surface-alt)]
          "
          aria-label="Change map style"
        >
          <span>🗺️</span>
          <span>{MAP_STYLES[selectedStyle].label}</span>
          <span className="text-xs opacity-60">
            {styleMenuOpen ? "▲" : "▼"}
          </span>
        </button>

        {styleMenuOpen && (
          <div
            className="
              mt-2
              w-[190px]
              overflow-hidden
              rounded-2xl
              border border-[var(--color-border)]
              bg-[var(--color-surface)]/98
              p-1.5
              shadow-xl
              backdrop-blur-md
            "
          >
            {Object.entries(MAP_STYLES).map(([key, style]) => (
              <button
                key={key}
                type="button"
                onClick={() => changeMapStyle(key)}
                className={`
                    flex w-full items-center
                    justify-between
                    rounded-xl
                    px-3 py-2.5
                    text-left text-sm
                    transition-colors
                    ${
                      selectedStyle === key
                        ? "bg-[var(--color-accent)]/15 text-[var(--color-text)]"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)]"
                    }
                  `}
              >
                <span>{style.label}</span>

                {selectedStyle === key && (
                  <span className="text-[var(--color-accent)]">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map legend */}
      <div
        className="
          absolute bottom-3 left-3 z-[1000]
          flex items-center gap-4
          rounded-xl
          border border-[var(--color-border)]/80
          bg-[var(--color-surface)]/95
          px-3 py-2
          text-[11px] font-medium
          text-[var(--color-text-secondary)]
          shadow-md
          backdrop-blur-sm
        "
      >
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#16B890]" />
          Trail
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2 w-5 border-t-2 border-dashed border-slate-400" />
          Path
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#1976D2]" />
          You
        </div>
      </div>
    </div>
  );
}
