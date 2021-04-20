namespace ja2 {
  export const JA2_DATA_DIR = process.env.JA2_DATA_DIR || process.cwd();

  document.addEventListener('DOMContentLoaded', () => {
    WinMain(<HTMLElement>document.getElementById('ja2'));
  });
}
