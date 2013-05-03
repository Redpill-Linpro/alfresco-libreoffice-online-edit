A LibreOffice online edit module for Alfresco
=============================================

Building
--------

This module is based on the Alfresco Maven SDK and requires Maven >= 3.0.4, a Java 1.6 compatible compiler (eg. Oracle JDK or OpenJDK). You will also need git to clone the repository. The master branch will always hold the latest stable version of the module. 

Cloning the repository:
* git clone git://github.com/Redpill-Linpro/alfresco-libreoffice-online-edit.git

Building with maven:
* mvn clean package

Module is packaged as amp and the resulting amp will end up in ./libreoffice-online-edit-share/target/

Configuration
-------------

This module relies on that the Alfresco Share setting "repository-url" is set in the Alfresco Share configuration.

An example configuration:
Edit (or create the file if it does not exist) tomcat/shared/classes/alfresco/web-extension/share-config-custom.xml
```
<alfresco-config>
  <config evaluator="string-compare" condition="DocumentLibrary" replace="true">
    <repository-url>http://localhost:8080/alfresco</repository-url>
  </config>
</alfresco-config>
```

Installation
------------

To install this module in Alfresco use the Alfresco Module Management tool. *Note* The module is a share module and should only be installed in Alfresco Share. 

* Upload the amp file to your amps_share directory in your Alfresco installation.
* Stop Alfresco Share
* Run java -jar bin/alfresco-mmt.jar install amps_share/libreoffice-online-edit-share-x.x.x.amp tomcat/webapps/share.war 
* Clean out temporary share files and old unpackaded share war (remove tomcat/webapps/share and tomcat/work/Catalina)
* Start Alfresco Share
* Activate the module from the Share Module Deployment page: http://localhost:8080/share/page/modules/deploy

Usage
-----

After the module has been activated, you should have a new action available to you in the document library and in the document details page. Click it to open the document with LibreOffice.

License
-------

This application is licensed under the LGPLv3 License. See the [LICENSE file](LICENSE) for details.

Authors
-------

Redpill Linpro AB
Marcus Svensson marcus.svensson (at) redpill-linpro.com
