function getRepositoryUrl() {
  var value = null, theConfig = config.scoped["DocumentLibrary"]["repository-url"];

  if (theConfig !== null) {
    value = theConfig.value;
  }
  return value;
}
model.repositoryUrl = getRepositoryUrl();