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
	YAHOO.Bubbling.fire("registerAction",
	    {
	        actionName: "onActionLibreOfficeEditOnline",
	        fn: function onActionLibreOfficeEditOnline(file) {
	        	
	        	if (!navigator.javaEnabled()) {
	        		//Do not go any further if Java is not enabled
	        		Alfresco.util.PopupManager.displayMessage(
                    {
                    	text: this.msg("actions.document.edit-online-libreoffice.nojava")
                    });
	        		return;
	        	} 
	        	
	        	var repositoryUrl;
	        	if (this.options.repositoryUrl === undefined) {
	        		if (typeof(RPLP_repositoryUrl) === 'undefined') {
	        			//If we do not have the repositoryUrl message return an error message
	        			Alfresco.util.PopupManager.displayMessage(
	                            {
	                            	text: this.msg("actions.document.edit-online-libreoffice.norepositoryUrl")
	                            });
	        	        		return;
	        		}
	        		repositoryUrl = RPLP_repositoryUrl;
	        	} else {
	        		repositoryUrl = this.options.repositoryUrl;
	        	}
	        	var alf_protocol = repositoryUrl.substring(0, repositoryUrl.indexOf("://"));
	        	var parse = repositoryUrl.substring(repositoryUrl.indexOf("://")+3);
	        	var hostnameEnd;
	        	var portStart = -1;
	        	if (parse.indexOf(":")>0) {
	        		//We have a port in the definition
	        		hostnameEnd = parse.indexOf(":");
	        		portStart = hostnameEnd + 1;
	        	} else {
	        		hostnameEnd = parse.indexOf("/");
	        	}
	        	
	        	var alf_hostname = parse.substring(0, hostnameEnd);
	        	var alf_port;
	        	if (portStart != -1) {
	        		//Port defined
	        		alf_port = parse.substring(portStart, parse.indexOf("/"));
	        	} else {
	        		//Default ports
	        		if (alf_protocol === "http") {
	        			alf_port = "80";
	        		} else if (alf_protocol === "https"){
	        			alf_port = "443"; 
	        		} else {
	        			//Unknown port
	        			alf_port = "0";
	        			
	        		}
	        	}
	        	
	        	var alf_context = parse.substring(parse.indexOf("/"))+"/cmisws/RepositoryService?wsdl";
	        	var alf_repository_id = file.location.repositoryId;
	        	var alf_file_path = file.webdavUrl.replace("/webdav","");
	        	if (alf_port!=="0") {
	        		window.open (Alfresco.constants.URL_RESCONTEXT+"rplp/components/libreoffice/popup.html?alf_protocol="+alf_protocol+"&alf_hostname="+alf_hostname+"&alf_port="+alf_port+"&alf_context="+alf_context+"&alf_repository_id="+alf_repository_id+"&alf_file_path="+alf_file_path, "_blank",'scrollbars=no,status=no,width=500,height=100,dependent=yes');
	        	}
	        }
	    });
})();