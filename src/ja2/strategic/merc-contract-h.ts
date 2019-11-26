namespace ja2 {

// enums used for extending contract, etc.
export const enum Enum161 {
  CONTRACT_EXTEND_1_DAY,
  CONTRACT_EXTEND_1_WEEK,
  CONTRACT_EXTEND_2_WEEK,
}

export interface CONTRACT_NEWAL_LIST_NODE {
  ubProfileID: UINT8;
  ubFiller: UINT8[] /* [3] */;
}

export function createContractRenewalListNode(): CONTRACT_NEWAL_LIST_NODE {
  return {
    ubProfileID: 0,
    ubFiller: createArray(3, 0),
  };
}

export const CONTRACT_RENEWAL_LIST_NODE_SIZE = 4;

export function readContractRenewalListNode(o: CONTRACT_NEWAL_LIST_NODE, buffer: Buffer, offset: number = 0): number {
  o.ubProfileID = buffer.readUInt8(offset++);
  offset = readUIntArray(o.ubFiller, buffer, offset, 1);
  return offset;
}

export function writeContractRenewalListNode(o: CONTRACT_NEWAL_LIST_NODE, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(o.ubProfileID, offset);
  offset = writeUIntArray(o.ubFiller, buffer, offset, 1);
  return offset;
}

/*

//list of quotes used in renewing a mercs contract
enum
{
        LAME_REFUSAL_DOING_SOMETHING_ELSE = 73,
        DEPARTING_COMMENT_AFTER_48_HOURS	= 75,
        CONTRACTS_OVER_U_EXTENDING = 79,
        ACCEPT_CONTRACT_RENEWAL = 80,
        REFUSAL_TO_RENEW_POOP_MORALE = 85,
        DEPARTING_COMMENT_BEFORE_48_HOURS=88,
        DEATH_RATE_REFUSAL=89,
        HATE_MERC_1_ON_TEAM,
        HATE_MERC_2_ON_TEAM,
        LEARNED_TO_HATE_MERC_ON_TEAM,
        JOING_CAUSE_BUDDY_1_ON_TEAM,
        JOING_CAUSE_BUDDY_2_ON_TEAM,
        JOING_CAUSE_LEARNED_TO_LIKE_BUDDY_ON_TEAM,
        PRECEDENT_TO_REPEATING_ONESELF,
        REFUSAL_DUE_TO_LACK_OF_FUNDS,
};
*/

}
