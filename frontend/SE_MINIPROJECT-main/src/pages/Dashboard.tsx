import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCity } from '@/contexts/CityContext';
import { useSimulatedData } from '@/hooks/useSimulatedData';
import CityMap from '@/components/dashboard/CityMap';
import ZoneSelector from '@/components/dashboard/ZoneSelector';
import KPICards from '@/components/dashboard/KPICards';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import AlertSystem from '@/components/dashboard/AlertSystem';
import { LogOut, Clock, MapPin, Activity, ArrowLeft, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const { selectedCity, clearCity } = useCity();
  const data = useSimulatedData(selectedCity?.zones || [], 5000, selectedCity?.id || 'delhi');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userLocation, setUserLocation] = useState<string>('Detecting...');

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation(`${pos.coords.latitude.toFixed(2)}°N, ${pos.coords.longitude.toFixed(2)}°E`);
        },
        () => setUserLocation(selectedCity?.name || 'India')
      );
    } else {
      setUserLocation(selectedCity?.name || 'India');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 md:px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={clearCity} className="w-8 h-8 rounded-lg bg-secondary hover:bg-muted flex items-center justify-center transition-colors" title="Change city">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground text-glow">Traffic & Air Quality Dashboard</h1>
            <p className="text-xs text-muted-foreground hidden md:block">{selectedCity?.name}, {selectedCity?.state} · Real-time Monitoring</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Date & Time */}
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-mono">
              {currentTime.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              {' · '}
              {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          {/* Location */}
          <div className="hidden lg:flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>{userLocation}</span>
          </div>

          {/* Alerts */}
          <div className="relative">
            <AlertSystem alerts={data.alerts} />
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Zone Selector */}
      <div className="px-4 md:px-6 py-3 border-b border-border">
        <ZoneSelector
          zones={data.zones.map(z => ({ id: z.id, name: z.name }))}
          selectedZone={selectedZone}
          onSelect={setSelectedZone}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto">
        {/* KPI Cards */}
        <KPICards zones={data.zones} selectedZone={selectedZone} />

        {/* Map + Traffic & AQI Focus */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Map */}
          <div className="glass-card rounded-xl overflow-hidden" style={{ minHeight: '400px' }}>
            <CityMap
              zones={data.zones}
              selectedZone={selectedZone}
              onZoneSelect={setSelectedZone}
              center={selectedCity?.center as [number, number]}
            />
          </div>

          {/* Zone Traffic & AQI Status */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary">Zone Status Monitor</h3>
            {(selectedZone ? data.zones.filter(z => z.id === selectedZone) : data.zones).map(zone => (
              <div key={zone.id} className="glass-card rounded-xl p-4 space-y-3 animate-slide-up">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-primary">{zone.name}</h4>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      zone.traffic > 75 ? 'bg-destructive/20 text-destructive' : 
                      zone.traffic > 50 ? 'bg-warning/20 text-warning' : 
                      'bg-success/20 text-success'
                    }`}>
                      Traffic: {zone.traffic}%
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      zone.aqi > 150 ? 'bg-destructive/20 text-destructive' : 
                      zone.aqi > 100 ? 'bg-warning/20 text-warning' : 
                      'bg-success/20 text-success'
                    }`}>
                      AQI: {zone.aqi}
                    </span>
                  </div>
                </div>
                
                {/* Alert indicators */}
                {(zone.traffic > 75 || zone.aqi > 150) && (
                  <div className="flex flex-wrap gap-2">
                    {zone.traffic > 75 && (
                      <div className="flex items-center gap-1 text-xs text-destructive">
                        <AlertTriangle className="w-3 h-3" />
                        High Traffic Congestion
                      </div>
                    )}
                    {zone.aqi > 150 && (
                      <div className="flex items-center gap-1 text-xs text-destructive">
                        <AlertTriangle className="w-3 h-3" />
                        Poor Air Quality
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <DashboardCharts data={data} zones={data.zones} selectedZone={selectedZone} />

        {/* Footer */}
        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground">
            UrbanWatch · Real-time data updates every 5 seconds · {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
