/**
 * Smart City Münster Dashboard
 * Copyright (C) 2022 Reedu GmbH & Co. KG
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import asyncRedis from "async-redis";

// checks if we are running in production mode
const isProduction =
  process.env.NODE_ENV !== undefined && process.env.NODE_ENV === "production";

const client = asyncRedis.createClient({
  host: isProduction ? "redis" : "127.0.0.1",
  retry_strategy: (options) => {
    if (options.error && options.error.code === "ECONNREFUSED") {
      console.warn("Redis connection refused - running without cache");
      return new Error("Redis unavailable");
    }
    return undefined;
  },
});

// Suppress error events for testing without Redis
client.on("error", (err) => {
  console.warn("Redis error (non-critical):", err.message);
});

export { client };
