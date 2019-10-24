function LiveMessage(strMessage: Pointer<CHAR8>): void {
  let OutFile: Pointer<FILE>;

  if ((OutFile = fopen("Log.txt", "a+t")) != null) {
    fprintf(OutFile, "%s\n", strMessage);
    fclose(OutFile);
  }
}
