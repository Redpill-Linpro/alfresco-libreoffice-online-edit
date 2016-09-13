/*
 * Copyright (C) 2016 Redpill Linpro AB
 *
 * This file is part of LibreOffice online edit module for Alfresco
 *
 * LibreOffice online edit module for Alfresco is free software: 
 * you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * LibreOffice online edit module for Alfresco is distributed in the 
 * hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with LibreOffice online edit module for Alfresco. 
 * If not, see <http://www.gnu.org/licenses/>.
 */

package com.redpill_linpro.libreoffice;

/**
 * Interface for LibreOffice Launcher
 * 
 * @author Marcus Svensson <marcus.svensson (at) redpill-linpro.com>
 * 
 */
public interface LibreOfficeLauncher {

  /**
   * Launch libre office, different implementations for every operating system
   * is required
   * 
   * @param cmisUrl
   * @param repositoryId
   * @param filePath
   */
  public void launchLibreOffice(String cmisUrl, String repositoryId, String filePath);
}
