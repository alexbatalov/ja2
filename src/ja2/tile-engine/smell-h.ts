namespace ja2 {

export const HUMAN = 0;
export const CREATURE_ON_FLOOR = 0x01;
export const CREATURE_ON_ROOF = 0x02;

export const NORMAL_HUMAN_SMELL_STRENGTH = 10;
export const COW_SMELL_STRENGTH = 15;
export const NORMAL_CREATURE_SMELL_STRENGTH = 20;

export const SMELL_TYPE_NUM_BITS = 2;
export const SMELL_TYPE = (s: number) => (s & 0x01);
export const SMELL_STRENGTH = (s: number) => ((s & 0xFC) >> SMELL_TYPE_NUM_BITS);

export const MAXBLOODQUANTITY = 7;
export const BLOODDIVISOR = 10;

}
