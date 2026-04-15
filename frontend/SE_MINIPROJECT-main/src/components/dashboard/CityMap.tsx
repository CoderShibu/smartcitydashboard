import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ZoneData } from '@/hooks/useSimulatedData';

interface CityMapProps {
  zones: ZoneData[];
  selectedZone: string | null;
  onZoneSelect: (id: string) => void;
  center?: [number, number];
}

function getMarkerColor(zone: ZoneData): string {
  const maxSeverity = Math.max(
    zone.traffic > 75 ? 2 : zone.traffic > 50 ? 1 : 0,
    zone.aqi > 150 ? 2 : zone.aqi > 100 ? 1 : 0,
    zone.waterLeakage ? 2 : 0
  );
  if (maxSeverity === 2) return '#ef4444';
  if (maxSeverity === 1) return '#f59e0b';
  return '#22c55e';
}

function createIcon(color: string, isSelected: boolean) {
  const size = isSelected ? 20 : 14;
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: ${size}px; height: ${size}px;
      background: ${color};
      border-radius: 50%;
      border: 3px solid rgba(255,255,255,0.8);
      box-shadow: 0 0 ${isSelected ? 20 : 10}px ${color};
      transition: all 0.3s ease;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const CityMap: React.FC<CityMapProps> = ({ zones, selectedZone, onZoneSelect, center = [28.6139, 77.2090] }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: center,
      zoom: 11,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    zones.forEach(zone => {
      const color = getMarkerColor(zone);
      const isSelected = selectedZone === zone.id;
      const marker = L.marker([zone.lat, zone.lng], {
        icon: createIcon(color, isSelected),
      })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: Inter, sans-serif; color: #1a202c; background: #f8fafc; padding: 12px; border-radius: 8px; min-width: 180px; border: 2px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h3 style="margin:0 0 8px; font-size: 14px; font-weight: 600; color: #0369a1;">${zone.name}</h3>
            <div style="font-size: 12px; line-height: 1.8; color: #334155;">
              <div>🚗 Traffic: <b>${zone.traffic}%</b></div>
              <div>💨 AQI: <b>${zone.aqi}</b> (${zone.aqiCategory})</div>
              <div>🌡️ Temp: <b>${zone.temperature}°C</b></div>
              <div>💧 Water: <b>${zone.waterLevel}%</b></div>
              <div>⚡ Energy: <b>${zone.energy} MW</b></div>
            </div>
          </div>
        `, { className: 'light-popup' })
        .on('click', () => onZoneSelect(zone.id));

      markersRef.current.push(marker);
    });
  }, [zones, selectedZone, onZoneSelect]);

  // Pan to selected zone
  useEffect(() => {
    if (!mapRef.current || !selectedZone) return;
    const zone = zones.find(z => z.id === selectedZone);
    if (zone) {
      mapRef.current.flyTo([zone.lat, zone.lng], 13, { duration: 1 });
    }
  }, [selectedZone, zones]);

  return <div ref={containerRef} className="w-full h-full rounded-lg" />;
};

export default CityMap;
