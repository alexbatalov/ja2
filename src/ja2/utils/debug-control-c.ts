void LiveMessage(CHAR8 *strMessage) {
  FILE *OutFile;

  if ((OutFile = fopen("Log.txt", "a+t")) != NULL) {
    fprintf(OutFile, "%s\n", strMessage);
    fclose(OutFile);
  }
}
