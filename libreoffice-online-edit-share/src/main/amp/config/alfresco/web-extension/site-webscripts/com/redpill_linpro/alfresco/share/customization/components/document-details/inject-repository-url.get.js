function getLibreOfficeUrl() {
  var value = null, theConfig = config.scoped["DocumentLibrary"]["libreoffice-cmis-base-url"];

  if (theConfig !== null) {
    value = theConfig.value;
  } else {
    //Fallback to repositoryurl if libreoffice-cmis-base-url is not set
    theConfig = config.scoped["DocumentLibrary"]["repository-url"];
    if (theConfig !== null) {
      value = theConfig.value;
    } 
  }
  return value;
}
model.libreOfficeUrl = getLibreOfficeUrl();