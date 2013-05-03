/*
 * Copyright (C) 2013 Redpill Linpro AB
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

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import javax.swing.JOptionPane;

/**
 * Helper class for LibreOffice launcher
 * @author Marcus Svensson <marcus.svensson (at) redpill-linpro.com>
 *
 */
public class LibreOfficeLauncherHelper {
	
	public static final String OS_WINDOWS = "Windows";
	
	public static final String OS_LINUX = "Linux";
	
	public static final String OS_MACOSX = "MacOSX";
	
	public static final String OS_UNSUPPORTED = "Unsupported";
	
	protected static final String LIBREOFFICE_HANDLER = "vnd.libreoffice.cmis";
	
	/**
	 * Return the detected operating system
	 * @param operatingSystemIndentifier
	 * @return
	 */
	public static String getOperatingSystem(String operatingSystemIndentifier) {
		//JOptionPane.showMessageDialog(null, operatingSystemIndentifier, "Info", JOptionPane.ERROR_MESSAGE);
		if ("linux".equalsIgnoreCase(operatingSystemIndentifier)) {
			return OS_LINUX;
		} if (operatingSystemIndentifier!=null && operatingSystemIndentifier.toLowerCase().contains("windows")) {
			return OS_WINDOWS;
		} else if (operatingSystemIndentifier!=null && operatingSystemIndentifier.toLowerCase().contains("mac os x")) {
			return OS_MACOSX;
		}else {
			return OS_UNSUPPORTED;
		}
	}
	
	/**
	 * Generates the open url for libre office, should be the same on all operating systems
	 * @param protocol The protocol to use usually http or https
	 * @param hostname The hostname of the CMIS server
	 * @param port The port used on the CMIS server
	 * @param cmisContext The url context which should point to the CMIS endpoint
	 * @param repositoryId The repository id of the content reposiotory on the CMIS server
	 * @param filePath The path to the file to open on the CMIS server
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	public static String generateLibreOfficeOpenUrl(String protocol, String hostname,
			String port, String cmisContext, String repositoryId, String filePath) throws UnsupportedEncodingException {
		StringBuilder openUrlSb = new StringBuilder();		
		openUrlSb.append(LibreOfficeLauncherHelper.LIBREOFFICE_HANDLER);
		openUrlSb.append("://");
		
		StringBuilder cmisUrlSb = new StringBuilder();
		cmisUrlSb.append(protocol);
		cmisUrlSb.append("://");
		cmisUrlSb.append(hostname);
		cmisUrlSb.append(":");
		cmisUrlSb.append(port);
		cmisUrlSb.append(cmisContext);
		cmisUrlSb.append("#");
		cmisUrlSb.append(repositoryId);
		
		String urlEncodedString = URLEncoder.encode(cmisUrlSb.toString(), "UTF-8").replaceAll("\\+", "%20");
		
		openUrlSb.append(urlEncodedString+filePath);
		return openUrlSb.toString();

	}
}
