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

import java.applet.Applet;

import javax.swing.JOptionPane;
/**
 * Applet for launching LibreOffice on the Client
 * @author Marcus Svensson <marcus.svensson (at) redpill-linpro.com>
 *
 */
public class LibreOfficeLauncherApplet extends Applet {

	private static final long serialVersionUID = -1784275430662873989L;
	private String osName;
	private String osVersion;
	private String osArch;
	private String javaRuntimeVersion;
	private LibreOfficeLauncher libreOfficeLauncher;
	
	/**
	 * Applet init function
	 */
	public void init() {
		osName = System.getProperty("os.name");
		osVersion = System.getProperty("os.version");
		osArch = System.getProperty("os.arch");
		javaRuntimeVersion = System.getProperty("java.runtime.version");
		
		String operatingSystem = LibreOfficeLauncherHelper.getOperatingSystem(osName);
		
		if (LibreOfficeLauncherHelper.OS_LINUX.equalsIgnoreCase(operatingSystem)) {
			libreOfficeLauncher = new LibreOfficeLauncherLinuxImpl();
		} else if (LibreOfficeLauncherHelper.OS_WINDOWS.equalsIgnoreCase(operatingSystem)) {
			libreOfficeLauncher = new LibreOfficeLauncherWindowsImpl();
		} else if (LibreOfficeLauncherHelper.OS_MACOSX.equalsIgnoreCase(operatingSystem)) {
			libreOfficeLauncher = new LibreOfficeLauncherMacOSXImpl();
		} else {
			JOptionPane.showMessageDialog(null, "Your operating system is not supported. Detected operating system: "+osName, "Error",
                    JOptionPane.ERROR_MESSAGE);
		}
		String protocol;
		String hostname;
		String port;
		String cmisContext;
		String repositoryId;
		String filePath;
		
		protocol = getParameter("ALF_PROTOCOL");
		hostname = getParameter("ALF_HOSTNAME");
		port = getParameter("ALF_PORT");
		cmisContext = getParameter("ALF_CONTEXT");
		repositoryId = getParameter("ALF_REPOSITORY_ID");
		filePath = getParameter("ALF_FILE_PATH");
		
		System.out.println("Starting LibreOffice");		
		libreOfficeLauncher.launchLibreOffice(protocol, hostname, port, cmisContext, repositoryId, filePath);
		
	}

	public LibreOfficeLauncher getLibreOfficeLauncher() {
		return libreOfficeLauncher;
	}

	public void setLibreOfficeLauncher(LibreOfficeLauncher libreOfficeLauncher) {
		this.libreOfficeLauncher = libreOfficeLauncher;
	}

	public String getOsName() {
		return osName;
	}

	public void setOsName(String osName) {
		this.osName = osName;
	}

	public void setOsVersion(String osVersion) {
		this.osVersion = osVersion;
	}

	public String getOsArch() {
		return osArch;
	}

	public void setOsArch(String osArch) {
		this.osArch = osArch;
	}

	public void setJavaRuntimeVersion(String javaRuntimeVersion) {
		this.javaRuntimeVersion = javaRuntimeVersion;
	}

}
