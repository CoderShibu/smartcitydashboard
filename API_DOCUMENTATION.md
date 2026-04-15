# Smart City Dashboard API Documentation

## Overview
The Smart City Dashboard Backend provides real-time monitoring data for urban infrastructure including traffic, air quality, energy consumption, and water levels across multiple Indian cities.

## Base URL
```
http://localhost:3000
```

## Available Endpoints

### 1. Cities Listing
**GET** `/api/zones`

Returns list of all available cities.

**Response:**
```json
{
  "success": true,
  "cities": ["delhi", "mumbai", "bangalore", "hyderabad", "chennai", "kolkata", "pune", "ahmedabad"],
  "message": "8 cities available"
}
```

---

### 2. Get All Zones for a City
**GET** `/api/zones/:cityId`

Returns all zones (sub-regions) for a specific city with current metrics.

**Parameters:**
- `cityId` (string): City identifier (delhi, mumbai, bangalore, hyderabad, chennai, kolkata, pune, ahmedabad)

**Response:**
```json
{
  "success": true,
  "city": "New Delhi",
  "zones": [
    {
      "id": "north",
      "name": "North Zone",
      "lat": 28.7041,
      "lng": 77.1025,
      "traffic": 61.6,
      "aqi": 59.8,
      "aqiCategory": "Moderate",
      "temperature": 29.7,
      "humidity": 70.2,
      "windSpeed": 6.6,
      "energy": 426.8,
      "energyYesterday": 611,
      "waterLevel": 67.7,
      "waterLeakage": false,
      "lastUpdated": "2026-04-15T18:59:42.650Z"
    }
  ]
}
```

**Try It:**
```bash
curl http://localhost:3000/api/zones/delhi
```

---

### 3. Get Specific Zone Data
**GET** `/api/zones/:cityId/:zoneId`

Returns detailed metrics for a single zone.

**Parameters:**
- `cityId` (string): City identifier
- `zoneId` (string): Zone identifier (north, south, east, west, central)

**Response:**
```json
{
  "success": true,
  "zone": {
    "id": "north",
    "name": "North Zone",
    "lat": 28.7041,
    "lng": 77.1025,
    "traffic": 61.6,
    "aqi": 59.8,
    "aqiCategory": "Moderate",
    "temperature": 29.7,
    "humidity": 70.2,
    "windSpeed": 6.6,
    "energy": 426.8,
    "energyYesterday": 611,
    "waterLevel": 67.7,
    "waterLeakage": false,
    "lastUpdated": "2026-04-15T18:59:42.650Z"
  }
}
```

**Try It:**
```bash
curl http://localhost:3000/api/zones/delhi/north
```

---

### 4. Traffic History
**GET** `/api/zones/:cityId/history/traffic`

Returns 12-hour traffic trend data.

**Response:**
```json
{
  "success": true,
  "city": "delhi",
  "trafficHistory": [
    { "time": "03:29 PM", "value": 48 },
    { "time": "04:29 PM", "value": 56 },
    { "time": "05:29 PM", "value": 47 }
  ]
}
```

**Try It:**
```bash
curl http://localhost:3000/api/zones/delhi/history/traffic
```

---

### 5. AQI History
**GET** `/api/zones/:cityId/history/aqi`

Returns 12-hour air quality index trend data.

**Response:**
```json
{
  "success": true,
  "city": "delhi",
  "aqiHistory": [
    { "time": "03:29 PM", "value": 65 },
    { "time": "04:29 PM", "value": 72 },
    { "time": "05:29 PM", "value": 68 }
  ]
}
```

**Try It:**
```bash
curl http://localhost:3000/api/zones/delhi/history/aqi
```

---

### 6. Energy History
**GET** `/api/zones/:cityId/history/energy`

Returns 12-hour energy consumption comparison (today vs yesterday).

**Response:**
```json
{
  "success": true,
  "city": "delhi",
  "energyHistory": [
    { "time": "03:29 PM", "today": 450, "yesterday": 420 },
    { "time": "04:29 PM", "today": 480, "yesterday": 450 },
    { "time": "05:29 PM", "today": 470, "yesterday": 440 }
  ]
}
```

**Try It:**
```bash
curl http://localhost:3000/api/zones/delhi/history/energy
```

---

## Data Metrics Explained

| Metric | Range | Unit | Description |
|--------|-------|------|-------------|
| **traffic** | 0-100 | % | Traffic congestion level (0 = clear, 100 = heavily congested) |
| **aqi** | 0-500 | Index | Air Quality Index (0-50=Good, 51-100=Moderate, 101-150=Unhealthy for Sensitive Groups, 151-200=Unhealthy, 201+=Hazardous) |
| **temperature** | -20 to 50 | °C | Ambient temperature |
| **humidity** | 0-100 | % | Relative humidity |
| **windSpeed** | 0-50 | km/h | Wind speed |
| **energy** | 100-1000 | MW | Current energy consumption |
| **energyYesterday** | 100-1000 | MW | Yesterday's energy consumption (same time) |
| **waterLevel** | 0-100 | % | Water body/infrastructure level |
| **waterLeakage** | true/false | Boolean | Water infrastructure leakage alert |

---

## Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 404 | City or zone not found |
| 500 | Server error |

---

## Error Response Example

```json
{
  "success": false,
  "error": "City not found",
  "availableCities": ["delhi", "mumbai", "bangalore", ...]
}
```

---

## Data Update Frequency

- **Zone Metrics**: Updated every 30 seconds
- **Traffic History**: Updated every 30 seconds
- **AQI History**: Updated every 30 seconds
- **Energy History**: Updated every 30 seconds

---

## Supported Cities

| City ID | City Name | State |
|---------|-----------|-------|
| delhi | New Delhi | Delhi |
| mumbai | Mumbai | Maharashtra |
| bangalore | Bengaluru | Karnataka |
| hyderabad | Hyderabad | Telangana |
| chennai | Chennai | Tamil Nadu |
| kolkata | Kolkata | West Bengal |
| pune | Pune | Maharashtra |
| ahmedabad | Ahmedabad | Gujarat |

---

## Example JavaScript Client

```javascript
// Fetch all zones for Delhi
const response = await fetch('http://localhost:3000/api/zones/delhi');
const data = await response.json();

if (data.success) {
  console.log(`City: ${data.city}`);
  data.zones.forEach(zone => {
    console.log(`${zone.name}: Traffic ${zone.traffic}%, AQI ${zone.aqi}`);
  });
}

// Fetch traffic history
const historyResponse = await fetch('http://localhost:3000/api/zones/delhi/history/traffic');
const history = await historyResponse.json();
console.log(history.trafficHistory);
```

---

## Frontend Integration

The frontend React app (`/frontend/SE_MINIPROJECT-main`) is configured to fetch data from these endpoints automatically:

```javascript
const API_BASE = 'http://localhost:3000';

// Fetches from: GET http://localhost:3000/api/zones/:cityId
const response = await fetch(`${API_BASE}/api/zones/${cityId}`);
```

---

## Troubleshooting

**404 - City not found:**
- Ensure city ID is lowercase (delhi, not Delhi)
- Use endpoint `/api/zones` to see available cities

**504 - Gateway timeout:**
- Backend may be starting up, wait 5-10 seconds
- Check if `node dist/app.js` is running on port 3000

**Empty data:**
- Zone data updates every 30 seconds
- Wait and retry the request

---

## Running Locally

```bash
# Start backend
cd smart-city-dashboard-backend-main
npm install
npm run build
node dist/app.js

# Start frontend (separate terminal)
cd frontend/SE_MINIPROJECT-main
npm install
npm run dev

# Access dashboard
open http://localhost:8080
```

---

**API Version:** 1.0.0  
**Last Updated:** April 2026
