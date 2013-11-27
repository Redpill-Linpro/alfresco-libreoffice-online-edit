package com.redpill_linpro.libreoffice;

import static org.junit.Assert.assertEquals;

import java.io.UnsupportedEncodingException;

import org.junit.Test;

public class LibreOfficeLauncherHelperTest {

  @Test
  public void testGetOperatingSystem() {
    assertEquals(LibreOfficeLauncherHelper.OS_LINUX, LibreOfficeLauncherHelper.getOperatingSystem("linux"));
    assertEquals(LibreOfficeLauncherHelper.OS_LINUX, LibreOfficeLauncherHelper.getOperatingSystem("Linux"));

    assertEquals(LibreOfficeLauncherHelper.OS_WINDOWS, LibreOfficeLauncherHelper.getOperatingSystem("Windows XP"));
    assertEquals(LibreOfficeLauncherHelper.OS_WINDOWS, LibreOfficeLauncherHelper.getOperatingSystem("windows 5.1"));

    assertEquals(LibreOfficeLauncherHelper.OS_MACOSX, LibreOfficeLauncherHelper.getOperatingSystem("mac os x"));
    assertEquals(LibreOfficeLauncherHelper.OS_MACOSX, LibreOfficeLauncherHelper.getOperatingSystem("Mac OS X"));

    assertEquals(LibreOfficeLauncherHelper.OS_UNSUPPORTED, LibreOfficeLauncherHelper.getOperatingSystem("Solaris"));
    assertEquals(LibreOfficeLauncherHelper.OS_UNSUPPORTED, LibreOfficeLauncherHelper.getOperatingSystem(""));

  }

  @Test
  public void testGenerateLibreOfficeOpenUrl() throws UnsupportedEncodingException {
    assertEquals("vnd.libreoffice.cmis://http%3A%2F%2Flocalhost%3A8080%2Falfresco%2Fcmisatom%23be392f77-bc41-4794-9367-f5b1cf00984b/Sites/libreoffice-test/documentLibrary/Testdocument.odt",
        LibreOfficeLauncherHelper.generateLibreOfficeOpenUrl("http://localhost:8080/alfresco/cmisatom", "be392f77-bc41-4794-9367-f5b1cf00984b",
            "/Sites/libreoffice-test/documentLibrary/Testdocument.odt"));
  
  
  }

}
