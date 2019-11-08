namespace ja2 {

export type TIMER = UINT32;

export const MAIN_TIMER_ID = 1;

const MILLISECONDS = (a: number) => (a);
const SECONDS = (a: number) => ((a) / 1000);
const MINUTES = (a: number) => (SECOND((a)) / 60);
const HOURS = (a: number) => (MINUTES((a)) / 60);
const DAYS = (a: number) => (HOURS((a)) / 24);

}
