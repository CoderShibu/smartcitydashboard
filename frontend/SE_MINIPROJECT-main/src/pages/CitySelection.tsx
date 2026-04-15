import React, { useState } from 'react';
import { useCity } from '@/contexts/CityContext';
import { MapPin, Building2, Search, ChevronRight } from 'lucide-react';

const CitySelection: React.FC = () => {
  const { cities, selectCity } = useCity();
  const [search, setSearch] = useState('');

  const filtered = cities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="relative w-full max-w-2xl animate-slide-up">
        <div className="glass-card rounded-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center glow-primary">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Select Your City</h1>
            <p className="text-sm text-muted-foreground">Choose a city to monitor its smart infrastructure</p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search cities..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* City grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
            {filtered.map(city => (
              <button
                key={city.id}
                onClick={() => selectCity(city.id)}
                className="group flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 hover:bg-secondary transition-all text-left"
              >
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:glow-primary transition-all">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{city.name}</p>
                  <p className="text-xs text-muted-foreground">{city.state} · {city.zones.length} zones</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">No cities match your search</p>
          )}

          <p className="text-center text-xs text-muted-foreground">
            UrbanWatch — Traffic & Air Quality Monitoring System
          </p>
        </div>
      </div>
    </div>
  );
};

export default CitySelection;
