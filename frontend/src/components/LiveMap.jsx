import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";

const markerIcon = L.divIcon({
  className: "tg-leaflet-marker",
  html: `
    <div class="tg-map-marker">
      <div class="tg-map-marker-pulse"></div>
      <div class="tg-map-marker-dot"></div>
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

function MapViewport({ position, trailPositions }) {
  const map = useMap();
  const firstRender = useRef(true);

  useEffect(() => {
    if (!position) return;

    if (firstRender.current) {
      firstRender.current = false;

      if (trailPositions.length > 1) {
        map.fitBounds(L.latLngBounds(trailPositions), {
          padding: [40, 40],
          maxZoom: 15,
          animate: false,
        });
      } else {
        map.setView(position, 14, { animate: false });
      }

      return;
    }

    map.panTo(position, { animate: false });
  }, [map, position, trailPositions.length]);

  return null;
}

export default function LiveMap({ latitude, longitude, trail = [] }) {
  // Normalize incoming API/WebSocket values once.
  const lat = Number(latitude);
  const lng = Number(longitude);

  const hasLocation = Number.isFinite(lat) && Number.isFinite(lng);

  const position = useMemo(
    () => (hasLocation ? [lat, lng] : null),
    [lat, lng, hasLocation],
  );

  const trailPositions = useMemo(() => {
    const points = trail
      .filter(
        (point) =>
          Number.isFinite(Number(point.latitude)) &&
          Number.isFinite(Number(point.longitude)),
      )
      .map((point) => [Number(point.latitude), Number(point.longitude)]);

    if (points.length === 0 && hasLocation) {
      points.push([lat, lng]);
    }

    return points;
  }, [trail, lat, lng, hasLocation]);

  if (!hasLocation) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center bg-slate-100 text-sm text-slate-500">
        Live map will appear once a GPS point arrives.
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[320px] w-full overflow-hidden rounded-[16px]">
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomControl position="topleft" />

        <MapViewport position={position} trailPositions={trailPositions} />

        {trailPositions.length > 1 && (
          <Polyline
            positions={trailPositions}
            pathOptions={{
              color: "#16B890",
              weight: 5,
              opacity: 0.95,
              dashArray: "7 6",
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        )}

        <Marker position={position} icon={markerIcon} />
      </MapContainer>

      <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white/95 px-3 py-2 text-[11px] font-medium text-slate-600 shadow-md backdrop-blur-sm">
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
