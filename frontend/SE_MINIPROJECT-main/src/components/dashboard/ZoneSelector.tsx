import React from 'react';
import { MapPin } from 'lucide-react';

interface ZoneSelectorProps {
  zones: { id: string; name: string }[];
  selectedZone: string | null;
  onSelect: (id: string | null) => void;
}

const ZoneSelector: React.FC<ZoneSelectorProps> = ({ zones, selectedZone, onSelect }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          selectedZone === null
            ? 'bg-primary text-primary-foreground glow-primary'
            : 'bg-secondary text-secondary-foreground hover:bg-muted'
        }`}
      >
        All Zones
      </button>
      {zones.map(zone => (
        <button
          key={zone.id}
          onClick={() => onSelect(zone.id)}
          className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedZone === zone.id
              ? 'bg-primary text-primary-foreground glow-primary'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          {zone.name}
        </button>
      ))}
    </div>
  );
};

export default ZoneSelector;
