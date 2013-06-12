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

var launchLibreOffice = {
  prefs: null,

  /**
   * Event handler
   */
  handleEvent: function(e) {
    if (e.type == "load") {
      Application.console.log("LibreOffice Launcher: Load event called");
      document.addEventListener("LaunchLibreOfficeEvt", this, false, true);
      this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
         .getService(Components.interfaces.nsIPrefService)
         .getBranch("extensions.libreoffice-launcher-ff.");
    } else if (e.type == "LaunchLibreOfficeEvt") {
      Application.console.log("LibreOffice Launcher: LibreOffice Launch event called");
      var data = e.target;    
      //Callback to notify the browser that the event was handeled
      data.setAttribute("handled", "true");
      var filePath = data.getAttribute("filePath");
      var result = this.launchLibreOfficeInternal(filePath);
      data.setAttribute("error", result);
    }
  },

  /**
   * Internal method used to lauch LibreOffice
   * @param filePath The file path to the file to open with LibreOffice. The file path should be formatted in a way which LibreOffice understands
   */
  launchLibreOfficeInternal: function(filePath) {
    //Setup arguments
    var args = new Array();
    args.push(filePath);

    //Locate the executable
    var cmd = "";
    if (navigator.platform.search(/win32/i) > -1) {      
      cmd = "C:\\Windows\\System32\\cmd.exe";      
      args.push(this.prefs.getCharPref("location.windows"));
      args.push("start")
      args.push("/c")
      args.reverse(); //Make soffice.exe to be the first argument
    } else if (navigator.platform.search(/linux/i) > -1) {
      cmd = this.prefs.getCharPref("location.linux");
    } else if (navigator.platform.search(/mac/i) > -1) {
      cmd = this.prefs.getCharPref("location.mac");
    } else {
      Application.console.log("LibreOffice Launcher: Unsupported platform");
      return false;
    }

    Application.console.log("LibreOffice Launcher: Launching LibreOffice using command: "+cmd + " "+ args.toString().replace(/,/g, " "));
    try {
      var file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
      file.initWithPath(cmd);
    
      //Start the process
      var process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
      process.init(file);
      process.run(false, args, args.length);
      return true;
    } catch(e) {
      Application.console.log("LibreOffice Launcher: Error while trying to launch LibreOffice using command: "+cmd + " "+ args.toString().replace(/,/g, " "));
      Components.utils.reportError(e);
      return false;
    } 
  }
};

window.addEventListener("load", launchLibreOffice, false);
Application.console.log("LibreOffice Launcher: Registered LibreOffice Launcher");