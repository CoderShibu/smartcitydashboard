/**
 * Zone Data Service
 * Maintains realistic, evolving zone data with proper state management
 */

interface ZoneMetrics {
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
  lastUpdated: Date;
}

interface TimeSeriesPoint {
  time: string;
  value: number;
}

interface EnergyPoint {
  time: string;
  today: number;
  yesterday: number;
}

const ZONE_CONFIGS: Record<string, any> = {
  delhi: {
    name: "New Delhi",
    zones: [
      { id: "north", name: "North Zone", lat: 28.7041, lng: 77.1025 },
      { id: "south", name: "South Zone", lat: 28.5245, lng: 77.1855 },
      { id: "east", name: "East Zone", lat: 28.628, lng: 77.295 },
      { id: "west", name: "West Zone", lat: 28.6353, lng: 77.07 },
      { id: "central", name: "Central Zone", lat: 28.6139, lng: 77.209 },
    ],
  },
  mumbai: {
    name: "Mumbai",
    zones: [
      { id: "north", name: "North Mumbai", lat: 19.18, lng: 72.85 },
      { id: "south", name: "South Mumbai", lat: 18.93, lng: 72.83 },
      { id: "east", name: "East Suburbs", lat: 19.07, lng: 72.93 },
      { id: "west", name: "West Suburbs", lat: 19.1, lng: 72.83 },
      { id: "central", name: "Central Mumbai", lat: 19.02, lng: 72.85 },
    ],
  },
  bangalore: {
    name: "Bengaluru",
    zones: [
      { id: "north", name: "North Bengaluru", lat: 13.04, lng: 77.59 },
      { id: "south", name: "South Bengaluru", lat: 12.9, lng: 77.58 },
      { id: "east", name: "East Bengaluru", lat: 12.97, lng: 77.67 },
      { id: "west", name: "West Bengaluru", lat: 12.97, lng: 77.52 },
      { id: "central", name: "Central Bengaluru", lat: 12.97, lng: 77.59 },
    ],
  },
  hyderabad: {
    name: "Hyderabad",
    zones: [
      { id: "north", name: "Secunderabad", lat: 17.44, lng: 78.5 },
      { id: "south", name: "South Hyderabad", lat: 17.33, lng: 78.47 },
      { id: "east", name: "East Hyderabad", lat: 17.39, lng: 78.55 },
      { id: "west", name: "HITEC City", lat: 17.45, lng: 78.38 },
      { id: "central", name: "Old City", lat: 17.36, lng: 78.48 },
    ],
  },
  chennai: {
    name: "Chennai",
    zones: [
      { id: "north", name: "North Chennai", lat: 13.15, lng: 80.28 },
      { id: "south", name: "South Chennai", lat: 13.0, lng: 80.25 },
      { id: "east", name: "East Coast", lat: 13.05, lng: 80.3 },
      { id: "west", name: "West Chennai", lat: 13.05, lng: 80.18 },
      { id: "central", name: "Central Chennai", lat: 13.08, lng: 80.27 },
    ],
  },
  kolkata: {
    name: "Kolkata",
    zones: [
      { id: "north", name: "North Kolkata", lat: 22.62, lng: 88.37 },
      { id: "south", name: "South Kolkata", lat: 22.51, lng: 88.35 },
      { id: "east", name: "Salt Lake", lat: 22.58, lng: 88.42 },
      { id: "west", name: "Howrah", lat: 22.59, lng: 88.31 },
      { id: "central", name: "Central Kolkata", lat: 22.57, lng: 88.36 },
    ],
  },
  pune: {
    name: "Pune",
    zones: [
      { id: "north", name: "Pimpri-Chinchwad", lat: 18.63, lng: 73.8 },
      { id: "south", name: "South Pune", lat: 18.46, lng: 73.87 },
      { id: "east", name: "Hadapsar", lat: 18.5, lng: 73.94 },
      { id: "west", name: "Hinjewadi", lat: 18.59, lng: 73.74 },
      { id: "central", name: "Shivajinagar", lat: 18.53, lng: 73.85 },
    ],
  },
  ahmedabad: {
    name: "Ahmedabad",
    zones: [
      { id: "north", name: "North Ahmedabad", lat: 23.08, lng: 72.58 },
      { id: "south", name: "South Bopal", lat: 22.96, lng: 72.56 },
      { id: "east", name: "East Naroda", lat: 23.06, lng: 72.66 },
      { id: "west", name: "SG Highway", lat: 23.03, lng: 72.5 },
      { id: "central", name: "Maninagar", lat: 23.0, lng: 72.6 },
    ],
  },
};

class ZoneDataService {
  private zoneData: Map<string, ZoneMetrics[]> = new Map();
  private trafficHistory: Map<string, TimeSeriesPoint[]> = new Map();
  private aqiHistory: Map<string, TimeSeriesPoint[]> = new Map();
  private energyHistory: Map<string, EnergyPoint[]> = new Map();

  constructor() {
    this.initializeCities();
  }

  private randomBetween(min: number, max: number): number {
    return Math.round((Math.random() * (max - min) + min) * 10) / 10;
  }

  private getAqiCategory(aqi: number): string {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy (Sensitive)";
    if (aqi <= 200) return "Unhealthy";
    return "Hazardous";
  }

  private getHourLabel(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  private initializeCities(): void {
    Object.keys(ZONE_CONFIGS).forEach((cityId) => {
      const config = ZONE_CONFIGS[cityId];
      const zones: ZoneMetrics[] = config.zones.map((z: any) => ({
        id: z.id,
        name: z.name,
        lat: z.lat,
        lng: z.lng,
        traffic: Math.round(this.randomBetween(20, 70)),
        aqi: Math.round(this.randomBetween(40, 150)),
        aqiCategory: "",
        temperature: this.randomBetween(25, 38),
        humidity: Math.round(this.randomBetween(40, 75)),
        windSpeed: this.randomBetween(5, 20),
        energy: Math.round(this.randomBetween(300, 750)),
        energyYesterday: Math.round(this.randomBetween(300, 750)),
        waterLevel: Math.round(this.randomBetween(50, 100)),
        waterLeakage: Math.random() > 0.95,
        lastUpdated: new Date(),
      }));

      zones.forEach((z) => (z.aqiCategory = this.getAqiCategory(z.aqi)));
      this.zoneData.set(cityId, zones);

      // Initialize time series data
      this.trafficHistory.set(
        cityId,
        this.generateInitialTimeSeries(12, 20, 85)
      );
      this.aqiHistory.set(cityId, this.generateInitialTimeSeries(12, 30, 180));
      this.energyHistory.set(cityId, this.generateInitialEnergyHistory());
    });
  }

  private generateInitialTimeSeries(
    hours: number,
    min: number,
    max: number
  ): TimeSeriesPoint[] {
    const now = new Date();
    return Array.from({ length: hours }, (_, i) => {
      const t = new Date(now.getTime() - (hours - 1 - i) * 3600000);
      return {
        time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        value: Math.round(this.randomBetween(min, max)),
      };
    });
  }

  private generateInitialEnergyHistory(): EnergyPoint[] {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const t = new Date(now.getTime() - (11 - i) * 3600000);
      return {
        time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        today: Math.round(this.randomBetween(250, 800)),
        yesterday: Math.round(this.randomBetween(250, 800)),
      };
    });
  }

  public updateAllZones(): void {
    Object.keys(ZONE_CONFIGS).forEach((cityId) => {
      this.updateCityZones(cityId);
    });
  }

  private updateCityZones(cityId: string): void {
    const zones = this.zoneData.get(cityId);
    if (!zones) return;

    const updatedZones = zones.map((z) => ({
      ...z,
      // Realistic traffic fluctuation (rush hour patterns)
      traffic: Math.max(
        5,
        Math.min(100, z.traffic + this.randomBetween(-6, 8))
      ),
      // AQI changes more slowly
      aqi: Math.max(10, Math.min(300, z.aqi + this.randomBetween(-12, 12))),
      // Temperature gradual change
      temperature: Math.max(
        15,
        Math.min(50, z.temperature + this.randomBetween(-0.5, 0.5))
      ),
      // Humidity variations
      humidity: Math.max(
        20,
        Math.min(100, z.humidity + this.randomBetween(-2, 2))
      ),
      // Wind speed
      windSpeed: Math.max(0, z.windSpeed + this.randomBetween(-1.5, 1.5)),
      // Energy consumption
      energy: Math.max(
        100,
        Math.min(1000, z.energy + this.randomBetween(-40, 40))
      ),
      // Water level changes slowly
      waterLevel: Math.max(
        5,
        Math.min(100, z.waterLevel + this.randomBetween(-1, 1))
      ),
      // Occasional water leakage
      waterLeakage: Math.random() > 0.92,
      lastUpdated: new Date(),
    }));

    updatedZones.forEach((z) => (z.aqiCategory = this.getAqiCategory(z.aqi)));
    this.zoneData.set(cityId, updatedZones);

    // Update time series
    const avgTraffic = Math.round(
      updatedZones.reduce((s, z) => s + z.traffic, 0) / updatedZones.length
    );
    const avgAqi = Math.round(
      updatedZones.reduce((s, z) => s + z.aqi, 0) / updatedZones.length
    );
    const avgEnergy = Math.round(
      updatedZones.reduce((s, z) => s + z.energy, 0) / updatedZones.length
    );

    const trafficDates = this.trafficHistory.get(cityId) || [];
    this.trafficHistory.set(cityId, [
      ...trafficDates.slice(1),
      { time: this.getHourLabel(), value: avgTraffic },
    ]);

    const aqiDates = this.aqiHistory.get(cityId) || [];
    this.aqiHistory.set(cityId, [
      ...aqiDates.slice(1),
      { time: this.getHourLabel(), value: avgAqi },
    ]);

    const energyDates = this.energyHistory.get(cityId) || [];
    this.energyHistory.set(cityId, [
      ...energyDates.slice(1),
      {
        time: this.getHourLabel(),
        today: avgEnergy,
        yesterday: Math.round(this.randomBetween(250, 750)),
      },
    ]);
  }

  public getCity(
    cityId: string
  ): { name: string; zones: ZoneMetrics[] } | null {
    const config = ZONE_CONFIGS[cityId];
    const zones = this.zoneData.get(cityId);
    if (!config || !zones) return null;

    return {
      name: config.name,
      zones: zones.map((z) => ({ ...z })), // Return copy
    };
  }

  public getZone(cityId: string, zoneId: string): ZoneMetrics | null {
    const zones = this.zoneData.get(cityId);
    if (!zones) return null;
    const zone = zones.find((z) => z.id === zoneId);
    return zone ? { ...zone } : null; // Return copy
  }

  public getTrafficHistory(cityId: string): TimeSeriesPoint[] {
    return this.trafficHistory.get(cityId) || [];
  }

  public getAqiHistory(cityId: string): TimeSeriesPoint[] {
    return this.aqiHistory.get(cityId) || [];
  }

  public getEnergyHistory(cityId: string): EnergyPoint[] {
    return this.energyHistory.get(cityId) || [];
  }

  public getAllCities(): string[] {
    return Object.keys(ZONE_CONFIGS);
  }
}

// Singleton instance
const zoneDataService = new ZoneDataService();

// Start periodic updates every 30 seconds
setInterval(() => {
  zoneDataService.updateAllZones();
}, 30000);

// Initial update
zoneDataService.updateAllZones();

export default zoneDataService;
