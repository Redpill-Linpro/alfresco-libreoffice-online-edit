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

(function () {
  YAHOO.Bubbling.fire("registerAction", {
    actionName: "onActionLibreOfficeEditOnlineApplet",
    fn: function onActionLibreOfficeEditOnlineApplet(file) {

      var libreOfficeLauncherAppletHandler = function (alf_cmis_url, alf_repository_id, alf_file_path) {
        if (!navigator.javaEnabled()) {
          // Do not go any further if Java is not enabled
          Alfresco.util.PopupManager.displayMessage({
            text: Alfresco.util.message("actions.document.edit-online-libreoffice.nojava")
          });
          return;
        }

        window.open(Alfresco.constants.URL_RESCONTEXT + "rplp/components/libreoffice/popup.html?alf_cmis_url=" + alf_cmis_url + "&alf_repository_id=" + alf_repository_id + "&alf_file_path=" + alf_file_path, "_blank", 'scrollbars=no,status=no,width=500,height=100,dependent=yes');

      };

      var libreOfficeLauncherFfPluginHandler = function (alf_cmis_url, alf_repository_id, alf_file_path) {

        var filePath = "vnd.libreoffice.cmis://";

        var cmisSubPath = alf_cmis_url + "#";
        cmisSubPath += alf_repository_id;

        filePath = filePath + encodeURIComponent(cmisSubPath) + alf_file_path;

        if (!("createEvent" in document)) {
          // Old browser or not Firefox
          return false;
        }
        try {
          // Check version
          var LATEST_VERSION = "${project.version}";
          var SLEEP_TIME = 5;
          var element = document.createElement("CheckLibreOfficeVersionData");
          element.setAttribute("latestVersion", LATEST_VERSION);
          document.documentElement.appendChild(element);
          var ev = document.createEvent("Events");
          ev.initEvent("CheckLibreOfficeVersionEvt", true, false);
          element.dispatchEvent(ev);
          if (!element.hasAttribute("clientVersion")) {
            // Could not find libreoffice plugin module, or this is not firefox
            document.documentElement.removeChild(element);
            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
              Alfresco.util.PopupManager.displayMessage({
                text: Alfresco.util.message("actions.document.edit-online-libreoffice.ff.noplugin", null, Alfresco.constants.URL_RESCONTEXT
                        + "rplp/components/libreoffice/libreoffice-launcher-${project.version}.xpi"),
                noEscape: true,
                displayTime: SLEEP_TIME
              });

              // Special handling to fall back to applet if firefox is used and
              // addon could not be launched.
              setTimeout(function () {
                libreOfficeLauncherAppletHandler(alf_cmis_url, alf_repository_id, alf_file_path);
              }, SLEEP_TIME * 1000);
              return true;
            }
            return false;
          } else {
            var clientVersion = element.getAttribute("clientVersion");
            //Todo add proper version check so that we compare the numbers
            var sleep = 1;
            if (LATEST_VERSION != clientVersion) {
              Alfresco.util.PopupManager.displayMessage({
                text: Alfresco.util.message("actions.document.edit-online-libreoffice.ff.update", null, Alfresco.constants.URL_RESCONTEXT
                        + "rplp/components/libreoffice/libreoffice-launcher-${project.version}.xpi"),
                noEscape: true,
                displayTime: SLEEP_TIME
              });
              sleep = SLEEP_TIME * 1000;
            }
            document.documentElement.removeChild(element);

            setTimeout(function () {
              var element = document.createElement("LaunchLibreOfficeData");
              element.setAttribute("filePath", filePath);
              document.documentElement.appendChild(element);
              var ev = document.createEvent("Events");
              ev.initEvent("LaunchLibreOfficeEvt", true, false);
              element.dispatchEvent(ev);
              if (!element.hasAttribute("handled")) {
                document.documentElement.removeChild(element);
                libreOfficeLauncherAppletHandler(alf_cmis_url, alf_repository_id, alf_file_path);
              } else {
                document.documentElement.removeChild(element);
              }
            }, sleep);
            return true;
          }
        } catch (e) {
          return false;
        }
      };

      var libreOfficeUrl;
      if (typeof (RPLP_libreOfficeUrl) === 'undefined') {
        // If we do not have the libreOfficeUrl message return an error
        // message
        Alfresco.util.PopupManager.displayMessage({
          text: Alfresco.util.message("actions.document.edit-online-libreoffice.norepositoryUrl")
        });
        return;
      }
      libreOfficeUrl = RPLP_libreOfficeUrl;


      var alf_cmis_url = libreOfficeUrl;
      var alf_repository_id;
      if (alf_cmis_url.indexOf("-default-/public/cmis/versions/1.0/atom") !== -1 || alf_cmis_url.indexOf("-default-/public/cmis/versions/1.1/atom") !== -1) {
        alf_repository_id = "-default-";
      } else {
        alf_repository_id = file.location.repositoryId;
      }
      var alf_file_path = file.webdavUrl.replace("/webdav", "");

      if (libreOfficeLauncherFfPluginHandler(alf_cmis_url, alf_repository_id, alf_file_path)) {
        return;
      } else {
        // Fall back to applet handling
        libreOfficeLauncherAppletHandler(alf_cmis_url, alf_repository_id, alf_file_path);
      }
    }
  });

  YAHOO.Bubbling.fire("registerAction", {
    actionName: "onActionLibreOfficeEditOnlineUrlHandler",
    fn: function onActionLibreOfficeEditOnlineUrlHandler(file) {

      var libreOfficeLauncherUrlHandler = function (alf_cmis_url, alf_repository_id, alf_file_path) {
        var filePath = "locmis:vnd.libreoffice.cmis://";

        var cmisSubPath = alf_cmis_url + "#";
        cmisSubPath += alf_repository_id;

        if (YAHOO.env.ua.ie > 0) {
          //For IE encode the cmis path twice. For some reason IE removes the encoding before sending the command to the url handler
          filePath = filePath + encodeURIComponent(encodeURIComponent(cmisSubPath)) + alf_file_path;
        } else {
          filePath = filePath + encodeURIComponent(cmisSubPath) + alf_file_path;
        }

        window.location.href = filePath;
      };

      var libreOfficeUrl;
      if (typeof (RPLP_libreOfficeUrl) === 'undefined') {
        // If we do not have the libreOfficeUrl message return an error
        // message
        Alfresco.util.PopupManager.displayMessage({
          text: Alfresco.util.message("actions.document.edit-online-libreoffice.norepositoryUrl")
        });
        return;
      }
      libreOfficeUrl = RPLP_libreOfficeUrl;


      var alf_cmis_url = libreOfficeUrl;
      var alf_repository_id;
      if (alf_cmis_url.indexOf("-default-/public/cmis/versions/1.0/atom") !== -1 || alf_cmis_url.indexOf("-default-/public/cmis/versions/1.1/atom") !== -1) {
        alf_repository_id = "-default-";
      } else {
        alf_repository_id = file.location.repositoryId;
      }
      var alf_file_path = file.webdavUrl.replace("/webdav", "");
      libreOfficeLauncherUrlHandler(alf_cmis_url, alf_repository_id, alf_file_path)

    }
  });
})();