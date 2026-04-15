/**
 * Smart City Dashboard - Zones API
 * Aggregates data from multiple sources into per-zone metrics
 */

const express = require("express");
const router = express.Router();
import zoneDataService from "../../services/zoneDataService";

// GET /api/zones - List all available cities
router.get("/", (req, res) => {
  const cities = zoneDataService.getAllCities();
  res.json({
    success: true,
    cities,
    message: `${cities.length} cities available`,
  });
});

// GET /api/zones/:cityId - Get all zones for a city
router.get("/:cityId", (req, res) => {
  const { cityId } = req.params;
  const cityData = zoneDataService.getCity(cityId);

  if (!cityData) {
    return res.status(404).json({
      success: false,
      error: "City not found",
      availableCities: zoneDataService.getAllCities(),
    });
  }

  res.json({
    success: true,
    city: cityData.name,
    zones: cityData.zones,
  });
});

// GET /api/zones/:cityId/:zoneId - Get specific zone data
router.get("/:cityId/:zoneId", (req, res) => {
  const { cityId, zoneId } = req.params;
  const zone = zoneDataService.getZone(cityId, zoneId);

  if (!zone) {
    return res.status(404).json({
      success: false,
      error: "Zone not found",
    });
  }

  res.json({
    success: true,
    zone,
  });
});

// GET /api/zones/:cityId/history/traffic - Traffic history
router.get("/:cityId/history/traffic", (req, res) => {
  const { cityId } = req.params;
  const cityData = zoneDataService.getCity(cityId);

  if (!cityData) {
    return res.status(404).json({ success: false, error: "City not found" });
  }

  const history = zoneDataService.getTrafficHistory(cityId);
  res.json({
    success: true,
    city: cityId,
    trafficHistory: history,
  });
});

// GET /api/zones/:cityId/history/aqi - AQI history
router.get("/:cityId/history/aqi", (req, res) => {
  const { cityId } = req.params;
  const cityData = zoneDataService.getCity(cityId);

  if (!cityData) {
    return res.status(404).json({ success: false, error: "City not found" });
  }

  const history = zoneDataService.getAqiHistory(cityId);
  res.json({
    success: true,
    city: cityId,
    aqiHistory: history,
  });
});

// GET /api/zones/:cityId/history/energy - Energy history
router.get("/:cityId/history/energy", (req, res) => {
  const { cityId } = req.params;
  const cityData = zoneDataService.getCity(cityId);

  if (!cityData) {
    return res.status(404).json({ success: false, error: "City not found" });
  }

  const history = zoneDataService.getEnergyHistory(cityId);
  res.json({
    success: true,
    city: cityId,
    energyHistory: history,
  });
});

export default router;
