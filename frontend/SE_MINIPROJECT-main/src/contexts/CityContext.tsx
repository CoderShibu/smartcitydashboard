import React, { createContext, useContext, useState } from 'react';

export interface CityConfig {
  id: string;
  name: string;
  state: string;
  center: [number, number];
  zones: { id: string; name: string; lat: number; lng: number }[];
}

const CITIES: CityConfig[] = [
  {
    id: 'delhi',
    name: 'New Delhi',
    state: 'Delhi',
    center: [28.6139, 77.2090],
    zones: [
      { id: 'north', name: 'North Zone', lat: 28.7041, lng: 77.1025 },
      { id: 'south', name: 'South Zone', lat: 28.5245, lng: 77.1855 },
      { id: 'east', name: 'East Zone', lat: 28.6280, lng: 77.2950 },
      { id: 'west', name: 'West Zone', lat: 28.6353, lng: 77.0700 },
      { id: 'central', name: 'Central Zone', lat: 28.6139, lng: 77.2090 },
    ],
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    center: [19.076, 72.8777],
    zones: [
      { id: 'north', name: 'North Mumbai', lat: 19.18, lng: 72.85 },
      { id: 'south', name: 'South Mumbai', lat: 18.93, lng: 72.83 },
      { id: 'east', name: 'East Suburbs', lat: 19.07, lng: 72.93 },
      { id: 'west', name: 'West Suburbs', lat: 19.10, lng: 72.83 },
      { id: 'central', name: 'Central Mumbai', lat: 19.02, lng: 72.85 },
    ],
  },
  {
    id: 'bangalore',
    name: 'Bengaluru',
    state: 'Karnataka',
    center: [12.9716, 77.5946],
    zones: [
      { id: 'north', name: 'North Bengaluru', lat: 13.04, lng: 77.59 },
      { id: 'south', name: 'South Bengaluru', lat: 12.90, lng: 77.58 },
      { id: 'east', name: 'East Bengaluru', lat: 12.97, lng: 77.67 },
      { id: 'west', name: 'West Bengaluru', lat: 12.97, lng: 77.52 },
      { id: 'central', name: 'Central Bengaluru', lat: 12.97, lng: 77.59 },
    ],
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    center: [17.385, 78.4867],
    zones: [
      { id: 'north', name: 'Secunderabad', lat: 17.44, lng: 78.50 },
      { id: 'south', name: 'South Hyderabad', lat: 17.33, lng: 78.47 },
      { id: 'east', name: 'East Hyderabad', lat: 17.39, lng: 78.55 },
      { id: 'west', name: 'HITEC City', lat: 17.45, lng: 78.38 },
      { id: 'central', name: 'Old City', lat: 17.36, lng: 78.48 },
    ],
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    center: [13.0827, 80.2707],
    zones: [
      { id: 'north', name: 'North Chennai', lat: 13.15, lng: 80.28 },
      { id: 'south', name: 'South Chennai', lat: 13.00, lng: 80.25 },
      { id: 'east', name: 'East Coast', lat: 13.05, lng: 80.30 },
      { id: 'west', name: 'West Chennai', lat: 13.05, lng: 80.18 },
      { id: 'central', name: 'Central Chennai', lat: 13.08, lng: 80.27 },
    ],
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    center: [22.5726, 88.3639],
    zones: [
      { id: 'north', name: 'North Kolkata', lat: 22.62, lng: 88.37 },
      { id: 'south', name: 'South Kolkata', lat: 22.51, lng: 88.35 },
      { id: 'east', name: 'Salt Lake', lat: 22.58, lng: 88.42 },
      { id: 'west', name: 'Howrah', lat: 22.59, lng: 88.31 },
      { id: 'central', name: 'Central Kolkata', lat: 22.57, lng: 88.36 },
    ],
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    center: [18.5204, 73.8567],
    zones: [
      { id: 'north', name: 'Pimpri-Chinchwad', lat: 18.63, lng: 73.80 },
      { id: 'south', name: 'South Pune', lat: 18.46, lng: 73.87 },
      { id: 'east', name: 'Hadapsar', lat: 18.50, lng: 73.94 },
      { id: 'west', name: 'Hinjewadi', lat: 18.59, lng: 73.74 },
      { id: 'central', name: 'Shivajinagar', lat: 18.53, lng: 73.85 },
    ],
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    center: [23.0225, 72.5714],
    zones: [
      { id: 'north', name: 'North Ahmedabad', lat: 23.08, lng: 72.58 },
      { id: 'south', name: 'South Bopal', lat: 22.96, lng: 72.56 },
      { id: 'east', name: 'East Naroda', lat: 23.06, lng: 72.66 },
      { id: 'west', name: 'SG Highway', lat: 23.03, lng: 72.50 },
      { id: 'central', name: 'Maninagar', lat: 23.00, lng: 72.60 },
    ],
  },
];

interface CityContextType {
  selectedCity: CityConfig | null;
  cities: CityConfig[];
  selectCity: (id: string) => void;
  clearCity: () => void;
}

const CityContext = createContext<CityContextType | null>(null);

export const useCity = () => {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error('useCity must be used within CityProvider');
  return ctx;
};

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState<CityConfig | null>(() => {
    const saved = sessionStorage.getItem('smartcity_city');
    if (saved) return CITIES.find(c => c.id === saved) || null;
    return null;
  });

  const selectCity = (id: string) => {
    const city = CITIES.find(c => c.id === id);
    if (city) {
      setSelectedCity(city);
      sessionStorage.setItem('smartcity_city', id);
    }
  };

  const clearCity = () => {
    setSelectedCity(null);
    sessionStorage.removeItem('smartcity_city');
  };

  return (
    <CityContext.Provider value={{ selectedCity, cities: CITIES, selectCity, clearCity }}>
      {children}
    </CityContext.Provider>
  );
};
