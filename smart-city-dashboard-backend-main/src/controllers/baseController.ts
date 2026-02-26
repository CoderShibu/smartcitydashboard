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

/**
 * @description BaseController defines an abstract controller
 * @abstract
 */
export default abstract class BaseController {
  /**
   * @description Creates new instance of a controller to fetch data
   * @param url url to request data from
   * @param key key to store response data in redisDB
   */
  constructor(public url: string, public key: string) {}

  /**
   * @abstract
   * @description Fetch new data and update redisDB
   * @returns Promise<boolean> whether update was successful
   */
  public abstract update(): Promise<boolean> | Promise<boolean[]>;
}
