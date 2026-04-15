import React, { useState } from 'react';
import { Bell, X, AlertTriangle, Car, Wind, Droplets } from 'lucide-react';
import type { Alert } from '@/hooks/useSimulatedData';

interface AlertSystemProps {
  alerts: Alert[];
}

const iconMap = {
  traffic: Car,
  aqi: Wind,
  water: Droplets,
  energy: AlertTriangle,
};

const AlertSystem: React.FC<AlertSystemProps> = ({ alerts }) => {
  const [open, setOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;

  return (
    <>
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg bg-secondary hover:bg-muted transition-colors"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {alerts.length > 0 && (
          <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
            criticalCount > 0 ? 'bg-destructive text-destructive-foreground animate-pulse' : 'bg-warning text-warning-foreground'
          }`}>
            {alerts.length}
          </span>
        )}
      </button>

      {/* Alert panel */}
      {open && (
        <div className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto glass-card rounded-xl border border-border shadow-2xl z-50 animate-slide-up">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h3 className="text-sm font-semibold">Active Alerts ({alerts.length})</h3>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          {alerts.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">No active alerts</p>
          ) : (
            <div className="divide-y divide-border">
              {alerts.map(alert => {
                const Icon = iconMap[alert.type];
                return (
                  <button
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className="w-full p-3 text-left hover:bg-muted/50 transition-colors flex items-start gap-3"
                  >
                    <div className={`mt-0.5 p-1.5 rounded-lg ${
                      alert.severity === 'critical' ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{alert.zone}</p>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Alert detail modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setSelectedAlert(null)}>
          <div className="glass-card rounded-2xl p-6 max-w-md w-full border border-border animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Alert Details</h2>
              <button onClick={() => setSelectedAlert(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  selectedAlert.severity === 'critical' ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'
                }`}>
                  {selectedAlert.severity.toUpperCase()}
                </span>
                <span className="text-sm text-muted-foreground capitalize">{selectedAlert.type}</span>
              </div>
              <p className="text-foreground"><span className="text-muted-foreground">Zone:</span> {selectedAlert.zone}</p>
              <p className="text-foreground"><span className="text-muted-foreground">Details:</span> {selectedAlert.message}</p>
              <p className="text-sm text-muted-foreground">
                {selectedAlert.timestamp.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertSystem;
