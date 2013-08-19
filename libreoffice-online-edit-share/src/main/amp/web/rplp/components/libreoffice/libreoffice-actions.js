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

(function() {
  YAHOO.Bubbling.fire("registerAction", {
    actionName : "onActionLibreOfficeEditOnline",
    fn : function onActionLibreOfficeEditOnline(file) {

      var libreOfficeLauncherAppletHandler = function(alf_protocol, alf_hostname, alf_port, alf_context, alf_repository_id, alf_file_path) {
        if (!navigator.javaEnabled()) {
          // Do not go any further if Java is not enabled
          Alfresco.util.PopupManager.displayMessage({
            text : Alfresco.util.message("actions.document.edit-online-libreoffice.nojava")
          });
          return;
        }

        window.open(Alfresco.constants.URL_RESCONTEXT + "rplp/components/libreoffice/popup.html?alf_protocol=" + alf_protocol + "&alf_hostname=" + alf_hostname + "&alf_port=" + alf_port
            + "&alf_context=" + alf_context + "&alf_repository_id=" + alf_repository_id + "&alf_file_path=" + alf_file_path, "_blank", 'scrollbars=no,status=no,width=500,height=100,dependent=yes');

      };

      var libreOfficeLauncherFfPluginHandler = function(alf_protocol, alf_hostname, alf_port, alf_context, alf_repository_id, alf_file_path) {

        var filePath = "vnd.libreoffice.cmis://";

        var cmisSubPath = alf_protocol + "://";
        cmisSubPath += alf_hostname + ":" + alf_port;
        cmisSubPath += alf_context + "#";
        cmisSubPath += alf_repository_id;

        filePath = filePath + encodeURIComponent(cmisSubPath) + alf_file_path;

        if (!("createEvent" in document)) {
          // Old browser or not Firefox
          return false;
        }
        try {
          // Check version
          var LATEST_VERSION = "${project.version}";
          var SLEEP_TIME = 2.5;
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
                text : Alfresco.util.message("actions.document.edit-online-libreoffice.ff.noplugin", null, Alfresco.constants.URL_RESCONTEXT
                    + "rplp/components/libreoffice/libreoffice-launcher-${project.version}.xpi"),
                noEscape : true,
                displayTime : SLEEP_TIME
              });

              // Special handling to fall back to applet if firefox is used and
              // addon could not be launched.
              setTimeout(function() {
                libreOfficeLauncherAppletHandler(alf_protocol, alf_hostname, alf_port, alf_context, alf_repository_id, alf_file_path);
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
                text : Alfresco.util.message("actions.document.edit-online-libreoffice.ff.update", null, Alfresco.constants.URL_RESCONTEXT
                    + "rplp/components/libreoffice/libreoffice-launcher-${project.version}.xpi"),
                noEscape : true,
                displayTime : SLEEP_TIME
              });
              sleep = SLEEP_TIME * 1000;             
            }
            document.documentElement.removeChild(element);

            setTimeout(function() {
              var element = document.createElement("LaunchLibreOfficeData");
              element.setAttribute("filePath", filePath);
              document.documentElement.appendChild(element);
              var ev = document.createEvent("Events");
              ev.initEvent("LaunchLibreOfficeEvt", true, false);
              element.dispatchEvent(ev);
              if (!element.hasAttribute("handled")) {
                document.documentElement.removeChild(element);
                libreOfficeLauncherAppletHandler(alf_protocol, alf_hostname, alf_port, alf_context, alf_repository_id, alf_file_path);
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
          text : Alfresco.util.message("actions.document.edit-online-libreoffice.norepositoryUrl")
        });
        return;
      }
      libreOfficeUrl = RPLP_libreOfficeUrl;

      var alf_protocol = libreOfficeUrl.substring(0, libreOfficeUrl.indexOf("://"));
      var parse = libreOfficeUrl.substring(libreOfficeUrl.indexOf("://") + 3);
      var hostnameEnd;
      var portStart = -1;
      if (parse.indexOf(":") > 0) {
        // We have a port in the definition
        hostnameEnd = parse.indexOf(":");
        portStart = hostnameEnd + 1;
      } else {
        hostnameEnd = parse.indexOf("/");
      }
      var alf_hostname = parse.substring(0, hostnameEnd);
      var alf_port;
      if (portStart != -1) {
        // Port defined
        alf_port = parse.substring(portStart, parse.indexOf("/"));
      } else {
        // Default ports
        if (alf_protocol === "http") {
          alf_port = "80";
        } else if (alf_protocol === "https") {
          alf_port = "443";
        } else {
          // Unknown port
          alf_port = "0";
        }
      }

      var alf_context = parse.substring(parse.indexOf("/")) + "/cmisws/RepositoryService?wsdl";
      var alf_repository_id = file.location.repositoryId;
      var alf_file_path = file.webdavUrl.replace("/webdav", "");

      if (libreOfficeLauncherFfPluginHandler(alf_protocol, alf_hostname, alf_port, alf_context, alf_repository_id, alf_file_path)) {
        return;
      } else {
        // Fall back to applet handling
        libreOfficeLauncherAppletHandler(alf_protocol, alf_hostname, alf_port, alf_context, alf_repository_id, alf_file_path);
      }
    }
  });
})();