import React from 'react';
import { Car, Wind, AlertTriangle } from 'lucide-react';
import { ZoneData } from '@/hooks/useSimulatedData';

interface KPICardsProps {
  zones: ZoneData[];
  selectedZone: string | null;
}

const KPICards: React.FC<KPICardsProps> = ({ zones, selectedZone }) => {
  const filtered = selectedZone ? zones.filter(z => z.id === selectedZone) : zones;
  const avg = (fn: (z: ZoneData) => number) =>
    Math.round(filtered.reduce((s, z) => s + fn(z), 0) / filtered.length);

  const avgTraffic = avg(z => z.traffic);
  const avgAqi = avg(z => z.aqi);
  const activeAlerts = filtered.reduce((count, zone) => {
    return count + (zone.aqi > 150 ? 1 : 0) + (zone.traffic > 75 ? 1 : 0);
  }, 0);

  const cards = [
    {
      label: 'Traffic',
      value: `${avgTraffic}%`,
      icon: Car,
      status: avgTraffic > 75 ? 'critical' : avgTraffic > 50 ? 'warning' : 'good',
    },
    {
      label: 'Air Quality',
      value: avgAqi.toString(),
      subtitle: avgAqi <= 50 ? 'Good' : avgAqi <= 100 ? 'Moderate' : avgAqi <= 150 ? 'Unhealthy (S)' : 'Unhealthy',
      icon: Wind,
      status: avgAqi > 150 ? 'critical' : avgAqi > 100 ? 'warning' : 'good',
    },
    {
      label: 'Active Alerts',
      value: activeAlerts.toString(),
      subtitle: activeAlerts === 0 ? 'All Clear' : activeAlerts === 1 ? '1 Alert' : `${activeAlerts} Alerts`,
      icon: AlertTriangle,
      status: activeAlerts > 2 ? 'critical' : activeAlerts > 0 ? 'warning' : 'good',
    },
  ];

  const statusStyles = {
    good: 'border-success/30 glow-success',
    warning: 'border-warning/30 glow-warning',
    critical: 'border-destructive/30 animate-pulse-glow',
  };

  const iconStyles = {
    good: 'text-success',
    warning: 'text-warning',
    critical: 'text-destructive',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {cards.map(card => (
        <div
          key={card.label}
          className={`glass-card rounded-xl p-4 transition-all animate-slide-up ${statusStyles[card.status as keyof typeof statusStyles]}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{card.label}</span>
            <card.icon className={`w-4 h-4 ${iconStyles[card.status as keyof typeof iconStyles]}`} />
          </div>
          <div className="text-2xl font-bold font-mono animate-count-up">{card.value}</div>
          {card.subtitle && (
            <div className="text-xs text-muted-foreground mt-1">{card.subtitle}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default KPICards;
