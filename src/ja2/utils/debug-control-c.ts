function LiveMessage(strMessage: Pointer<CHAR8>): void {
  FILE *OutFile;

  if ((OutFile = fopen("Log.txt", "a+t")) != NULL) {
    fprintf(OutFile, "%s\n", strMessage);
    fclose(OutFile);
  }
}
