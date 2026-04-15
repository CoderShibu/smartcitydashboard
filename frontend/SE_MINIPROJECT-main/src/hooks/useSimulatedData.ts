import { useState, useEffect, useCallback, useRef } from 'react';

export interface ZoneData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  traffic: number;
  aqi: number;
  aqiCategory: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  energy: number;
  energyYesterday: number;
  waterLevel: number;
  waterLeakage: boolean;
}

export interface DashboardData {
  zones: ZoneData[];
  trafficHistory: { time: string; value: number }[];
  aqiHistory: { time: string; value: number }[];
  energyHistory: { time: string; today: number; yesterday: number }[];
  alerts: Alert[];
}

export interface Alert {
  id: string;
  type: 'traffic' | 'aqi' | 'water' | 'energy';
  zone: string;
  message: string;
  severity: 'warning' | 'critical';
  timestamp: Date;
}

const API_BASE = 'http://localhost:3000';

function randomBetween(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function getAqiCategory(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy (Sensitive)';
  if (aqi <= 200) return 'Unhealthy';
  return 'Hazardous';
}


function generateZoneData(zones: { id: string; name: string; lat: number; lng: number }[]): ZoneData[] {
  return zones.map(z => {
    const aqi = Math.round(randomBetween(20, 220));
    return {
      ...z,
      traffic: Math.round(randomBetween(15, 95)),
      aqi,
      aqiCategory: getAqiCategory(aqi),
      temperature: randomBetween(22, 42),
      humidity: Math.round(randomBetween(30, 85)),
      windSpeed: randomBetween(2, 25),
      energy: Math.round(randomBetween(200, 900)),
      energyYesterday: Math.round(randomBetween(200, 900)),
      waterLevel: Math.round(randomBetween(10, 100)),
      waterLeakage: Math.random() > 0.8,
    };
  });
}

function generateTimeSeriesData(hours: number, min: number, max: number) {
  const now = new Date();
  return Array.from({ length: hours }, (_, i) => {
    const t = new Date(now.getTime() - (hours - 1 - i) * 3600000);
    return {
      time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: Math.round(randomBetween(min, max)),
    };
  });
}

function generateEnergyHistory() {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const t = new Date(now.getTime() - (11 - i) * 3600000);
    return {
      time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      today: Math.round(randomBetween(200, 800)),
      yesterday: Math.round(randomBetween(200, 800)),
    };
  });
}

function generateAlerts(zones: ZoneData[]): Alert[] {
  const alerts: Alert[] = [];
  zones.forEach(z => {
    if (z.traffic > 75) {
      alerts.push({
        id: `traffic-${z.id}-${Date.now()}`,
        type: 'traffic',
        zone: z.name,
        message: `High congestion at ${z.traffic}%`,
        severity: z.traffic > 90 ? 'critical' : 'warning',
        timestamp: new Date(),
      });
    }
    if (z.aqi > 150) {
      alerts.push({
        id: `aqi-${z.id}-${Date.now()}`,
        type: 'aqi',
        zone: z.name,
        message: `AQI at ${z.aqi} (${z.aqiCategory})`,
        severity: z.aqi > 200 ? 'critical' : 'warning',
        timestamp: new Date(),
      });
    }
    if (z.waterLeakage) {
      alerts.push({
        id: `water-${z.id}-${Date.now()}`,
        type: 'water',
        zone: z.name,
        message: `Water leakage detected (Level: ${z.waterLevel}%)`,
        severity: 'critical',
        timestamp: new Date(),
      });
    }
  });
  return alerts;
}

export function useSimulatedData(cityZones: { id: string; name: string; lat: number; lng: number }[], refreshInterval = 5000, cityId = 'delhi') {
  const [data, setData] = useState<DashboardData>({
    zones: cityZones.map(z => ({
      ...z,
      traffic: 0,
      aqi: 0,
      aqiCategory: 'Loading...',
      temperature: 0,
      humidity: 0,
      windSpeed: 0,
      energy: 0,
      energyYesterday: 0,
      waterLevel: 0,
      waterLeakage: false,
    })),
    trafficHistory: [],
    aqiHistory: [],
    energyHistory: [],
    alerts: [],
  });

  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  // Fetch real data from backend
  const fetchBackendData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/zones/${cityId}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      
      const result = await response.json();
      const zones: ZoneData[] = result.zones;

      // Generate time series data (same as before)
      const now = new Date();
      const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const avgTraffic = Math.round(zones.reduce((s, z) => s + z.traffic, 0) / zones.length);
      const avgAqi = Math.round(zones.reduce((s, z) => s + z.aqi, 0) / zones.length);
      const avgEnergy = Math.round(zones.reduce((s, z) => s + z.energy, 0) / zones.length);

      setData({
        zones,
        trafficHistory: generateTimeSeriesData(12, 20, 90),
        aqiHistory: generateTimeSeriesData(12, 30, 200),
        energyHistory: generateEnergyHistory(),
        alerts: generateAlerts(zones),
      });
    } catch (error) {
      console.error('Failed to fetch backend data:', error);
      // Fallback to simulated data on error
      const zones = cityZones.map(z => {
        const aqi = Math.round(randomBetween(20, 220));
        return {
          ...z,
          traffic: Math.round(randomBetween(15, 95)),
          aqi,
          aqiCategory: getAqiCategory(aqi),
          temperature: randomBetween(22, 42),
          humidity: Math.round(randomBetween(30, 85)),
          windSpeed: randomBetween(2, 25),
          energy: Math.round(randomBetween(200, 900)),
          energyYesterday: Math.round(randomBetween(200, 900)),
          waterLevel: Math.round(randomBetween(10, 100)),
          waterLeakage: Math.random() > 0.8,
        };
      });

      setData({
        zones,
        trafficHistory: generateTimeSeriesData(12, 20, 90),
        aqiHistory: generateTimeSeriesData(12, 30, 200),
        energyHistory: generateEnergyHistory(),
        alerts: generateAlerts(zones),
      });
    }
  }, [cityId, cityZones]);

  // Initial load
  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  // Refresh interval
  useEffect(() => {
    intervalRef.current = setInterval(fetchBackendData, refreshInterval);
    return () => clearInterval(intervalRef.current);
  }, [fetchBackendData, refreshInterval]);

  return data;
}
