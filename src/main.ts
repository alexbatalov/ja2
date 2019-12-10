namespace ja2 {
  export const JA2_DATA_DIR = process.env.JA2_DATA_DIR;

  document.addEventListener('DOMContentLoaded', () => {
    SoundEnableSound(false);

    WinMain(<HTMLElement>document.getElementById('ja2'));
  });
}
