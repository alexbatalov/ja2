namespace ja2 {

const EMPTY_SLOT = -1;
const TO_INIT = 0;

const ANIMPROFILEFILENAME = "BINARYDATA\\JA2PROF.DAT";

export let gpAnimProfiles: Pointer<ANIM_PROF> = null;
let gubNumAnimProfiles: UINT8 = 0;

let gbAnimUsageHistory: INT8[][] /* [NUMANIMATIONSURFACETYPES][MAX_NUM_SOLDIERS] */;

export let gAnimSurfaceDatabase: AnimationSurfaceType[] /* [NUMANIMATIONSURFACETYPES] */ = [
  createAnimationSurfaceTypeFrom(Enum195.RGMBASICWALKING, "ANIMS\\S_MERC\\S_R_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMSTANDING, "ANIMS\\S_MERC\\S_R_STD.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMCROUCHING, "ANIMS\\S_MERC\\S_R_C.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMSNEAKING, "ANIMS\\S_MERC\\S_R_SWAT.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMRUNNING, "ANIMS\\S_MERC\\S_R_RUN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMPRONE, "ANIMS\\S_MERC\\S_R_PRN.STI", Enum196.P_STRUCT, 0, 8, TO_INIT, null, null, 0, 0),
  createAnimationSurfaceTypeFrom(Enum195.RGMSTANDAIM, "ANIMS\\S_MERC\\S_SR_AIM.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMHITHARD, "ANIMS\\S_MERC\\S_DIEHD.STI", Enum196.FB_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMHITSTAND, "ANIMS\\S_MERC\\S_DIEFWD.STI", Enum196.F_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMHITHARDBLOOD, "ANIMS\\S_MERC\\S_DIEHDB.STI", Enum196.FB_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMCROUCHAIM, "ANIMS\\S_MERC\\S_CR_AIM.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMHITFALLBACK, "ANIMS\\S_MERC\\S_DIEBAC.STI", Enum196.FB_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMROLLOVER, "ANIMS\\S_MERC\\S_ROLL.STI", Enum196.P_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMCLIMBROOF, "ANIMS\\S_MERC\\S_CLIMB.STI", Enum196.S_STRUCT, 0, 4, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMFALL, "ANIMS\\S_MERC\\S_FALL.STI", Enum196.S_STRUCT, 0, 4, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMFALLF, "ANIMS\\S_MERC\\S_FALLF.STI", Enum196.S_STRUCT, 0, 4, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMHITCROUCH, "ANIMS\\S_MERC\\S_C_DIE.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMHITPRONE, "ANIMS\\S_MERC\\S_P_DIE.STI", Enum196.P_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMHOPFENCE, "ANIMS\\S_MERC\\S_HOP.STI", Enum196.NO_STRUCT, 0, 4, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMPUNCH, "ANIMS\\S_MERC\\S_PUNCH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMNOTHING_STD, "ANIMS\\S_MERC\\S_N_STD.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMNOTHING_WALK, "ANIMS\\S_MERC\\S_N_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMNOTHING_RUN, "ANIMS\\S_MERC\\S_N_RUN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMNOTHING_SWAT, "ANIMS\\S_MERC\\S_N_SWAT.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMNOTHING_CROUCH, "ANIMS\\S_MERC\\S_N_CRCH.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMHANDGUN_S_SHOT, "ANIMS\\S_MERC\\S_N_SHOT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMHANDGUN_C_SHOT, "ANIMS\\S_MERC\\S_N_C_AI.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMHANDGUN_PRONE, "ANIMS\\S_MERC\\S_N_PRNE.STI", Enum196.P_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMDIE_JFK, "ANIMS\\S_MERC\\S_DIEJFK.STI", Enum196.F_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMOPEN, "ANIMS\\S_MERC\\S_OPEN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMPICKUP, "ANIMS\\S_MERC\\S_PICKUP.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMSTAB, "ANIMS\\S_MERC\\S_STAB.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMSLICE, "ANIMS\\S_MERC\\S_SLICE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMCSTAB, "ANIMS\\S_MERC\\S_C_STB.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMMEDIC, "ANIMS\\S_MERC\\S_MEDIC.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMDODGE, "ANIMS\\S_MERC\\S_DODGE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMSTANDDWALAIM, "ANIMS\\S_MERC\\S_DBLSHT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMRAISE, "ANIMS\\S_MERC\\S_RAISE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMTHROW, "ANIMS\\S_MERC\\S_LOB.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMLOB, "ANIMS\\S_MERC\\S_THROW.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMKICKDOOR, "ANIMS\\S_MERC\\S_DR_KCK.STI", Enum196.S_STRUCT, 0, 4, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMRHIT, "ANIMS\\S_MERC\\S_R_HIT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGM_SQUISH, "ANIMS\\S_MERC\\A_SQUISH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGM_LOOK, "ANIMS\\S_MERC\\A_LOOK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGM_PULL, "ANIMS\\S_MERC\\A_PULL.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGM_SPIT, "ANIMS\\S_MERC\\A_SPIT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMWATER_R_WALK, "ANIMS\\S_MERC\\SW_R_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMWATER_R_STD, "ANIMS\\S_MERC\\SW_R_STD.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMWATER_N_WALK, "ANIMS\\S_MERC\\SW_N_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMWATER_N_STD, "ANIMS\\S_MERC\\SW_N_STD.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMWATER_DIE, "ANIMS\\S_MERC\\SW_DIE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMWATER_N_AIM, "ANIMS\\S_MERC\\SW_N_SHOT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMWATER_R_AIM, "ANIMS\\S_MERC\\SW_SR_AIM.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMWATER_DBLSHT, "ANIMS\\S_MERC\\SW_DBLSHT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMWATER_TRANS, "ANIMS\\S_MERC\\SW_FALL.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMDEEPWATER_TRED, "ANIMS\\S_MERC\\S_TRED.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMDEEPWATER_SWIM, "ANIMS\\S_MERC\\S_SWIM.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMDEEPWATER_DIE, "ANIMS\\S_MERC\\S_D_DIE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMMCLIMB, "ANIMS\\S_MERC\\S_MCLIMB.STI", Enum196.S_STRUCT, 0, 3, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMHELIDROP, "ANIMS\\S_MERC\\S_HELIDRP.STI", Enum196.S_STRUCT, 0, 1, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMLOWKICK, "ANIMS\\S_MERC\\K_LW_KICK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMPUNCH, "ANIMS\\S_MERC\\K_PUNCH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMSPINKICK, "ANIMS\\S_MERC\\S_SPNKCK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMSLEEP, "ANIMS\\S_MERC\\S_SLEEP.STI", Enum196.P_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMSHOOT_LOW, "ANIMS\\S_MERC\\S_SHTLO.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMCDBLSHOT, "ANIMS\\S_MERC\\SC_DBLSH.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMHURTSTANDINGN, "ANIMS\\S_MERC\\S_I_BR_N.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMHURTSTANDINGR, "ANIMS\\S_MERC\\S_I_BR_R.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMHURTWALKINGN, "ANIMS\\S_MERC\\S_I_WK_N.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMHURTWALKINGR, "ANIMS\\S_MERC\\S_I_WK_R.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMHURTTRANS, "ANIMS\\S_MERC\\S_I_TRAN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMTHROWKNIFE, "ANIMS\\S_MERC\\S_K_THRO.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMBREATHKNIFE, "ANIMS\\S_MERC\\S_KNF_BR.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMPISTOLBREATH, "ANIMS\\S_MERC\\S_P_BRTH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMCOWER, "ANIMS\\S_MERC\\S_COWER.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMROCKET, "ANIMS\\S_MERC\\S_LAW.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMMORTAR, "ANIMS\\S_MERC\\S_MORTAR.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMSIDESTEP, "ANIMS\\S_MERC\\S_R_SDSP.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMDBLBREATH, "ANIMS\\S_MERC\\S_DBL_BR.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMPUNCHLOW, "ANIMS\\S_MERC\\S_PCH_LO.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMPISTOLSHOOTLOW, "ANIMS\\S_MERC\\S_P_SHLO.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMWATERTHROW, "ANIMS\\S_MERC\\SW_LOB.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMRADIO, "ANIMS\\S_MERC\\S_RADIO.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMCRRADIO, "ANIMS\\S_MERC\\S_C_RADO.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMBURN, "ANIMS\\S_MERC\\S_FIRE.STI", Enum196.S_STRUCT, 0, 1, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMDWPRONE, "ANIMS\\S_MERC\\S_DB_PRN.STI", Enum196.P_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMDRUNK, "ANIMS\\S_MERC\\S_R_DRNK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMPISTOLDRUNK, "ANIMS\\S_MERC\\S_N_DRNK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMCROWBAR, "ANIMS\\S_MERC\\S_CROBAR.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMJUMPOVER, "ANIMS\\S_MERC\\S_N_RUN.STI", Enum196.NO_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.BGMWALKING, "ANIMS\\M_MERC\\M_R_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMSTANDING, "ANIMS\\M_MERC\\M_R_STD.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMCROUCHING, "ANIMS\\M_MERC\\M_R_C.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMSNEAKING, "ANIMS\\M_MERC\\M_R_SWAT.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMRUNNING, "ANIMS\\M_MERC\\M_R_RUN2.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMPRONE, "ANIMS\\M_MERC\\M_R_PRN.STI", Enum196.P_STRUCT, 0, 8, TO_INIT, null, null, 0, 0),
  createAnimationSurfaceTypeFrom(Enum195.BGMSTANDAIM, "ANIMS\\M_MERC\\M_SR_AIM.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMHITHARD, "ANIMS\\M_MERC\\M_DIEHD.STI", Enum196.FB_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMHITSTAND, "ANIMS\\M_MERC\\M_DIEFWD.STI", Enum196.F_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMHITHARDBLOOD, "ANIMS\\M_MERC\\M_DIEHDB.STI", Enum196.FB_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGMCROUCHAIM, "ANIMS\\M_MERC\\M_CR_AIM.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMHITFALLBACK, "ANIMS\\M_MERC\\M_DIEBAC.STI", Enum196.FB_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMROLLOVER, "ANIMS\\M_MERC\\M_ROLL.STI", Enum196.P_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMCLIMBROOF, "ANIMS\\M_MERC\\M_CLIMB.STI", Enum196.S_STRUCT, 0, 4, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMFALL, "ANIMS\\M_MERC\\M_FALL.STI", Enum196.S_STRUCT, 0, 4, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMFALLF, "ANIMS\\M_MERC\\M_FALLF.STI", Enum196.S_STRUCT, 0, 4, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMHITCROUCH, "ANIMS\\M_MERC\\M_C_DIE.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMHITPRONE, "ANIMS\\M_MERC\\M_P_DIE.STI", Enum196.P_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMHOPFENCE, "ANIMS\\M_MERC\\M_HOP.STI", Enum196.NO_STRUCT, 0, 4, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMPUNCH, "ANIMS\\M_MERC\\M_PUNCH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMNOTHING_STD, "ANIMS\\M_MERC\\M_N_STD.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMNOTHING_WALK, "ANIMS\\M_MERC\\M_N_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMNOTHING_RUN, "ANIMS\\M_MERC\\M_N_RUN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMNOTHING_SWAT, "ANIMS\\M_MERC\\M_N_SWAT.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMNOTHING_CROUCH, "ANIMS\\M_MERC\\M_N_CRCH.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMHANDGUN_S_SHOT, "ANIMS\\M_MERC\\M_N_SHOT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMHANDGUN_C_SHOT, "ANIMS\\M_MERC\\M_N_C_AI.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMHANDGUN_PRONE, "ANIMS\\M_MERC\\M_N_PRNE.STI", Enum196.P_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMDIE_JFK, "ANIMS\\M_MERC\\M_DIEJFK.STI", Enum196.F_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMOPEN, "ANIMS\\M_MERC\\M_OPEN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMPICKUP, "ANIMS\\M_MERC\\M_PICKUP.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMSTAB, "ANIMS\\M_MERC\\M_STAB.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMSLICE, "ANIMS\\M_MERC\\M_SLICE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMCSTAB, "ANIMS\\M_MERC\\M_C_STB.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMMEDIC, "ANIMS\\M_MERC\\M_MEDIC.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMDODGE, "ANIMS\\M_MERC\\M_DODGE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMSTANDDWALAIM, "ANIMS\\M_MERC\\M_DBLSHT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMRAISE, "ANIMS\\M_MERC\\M_RAISE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMTHROW, "ANIMS\\M_MERC\\M_THROW.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMLOB, "ANIMS\\M_MERC\\M_LOB.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMKICKDOOR, "ANIMS\\M_MERC\\M_DR_KCK.STI", Enum196.S_STRUCT, 0, 4, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMRHIT, "ANIMS\\M_MERC\\M_R_HIT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMSTANDAIM2, "ANIMS\\M_MERC\\M_SR_AM2.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMFLEX, "ANIMS\\M_MERC\\M_FLEX.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMSTRECH, "ANIMS\\M_MERC\\M_STRTCH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMSHOEDUST, "ANIMS\\M_MERC\\M_SHOEDUST.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMHEADTURN, "ANIMS\\M_MERC\\M_HEDTURN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMWATER_R_WALK, "ANIMS\\M_MERC\\MW_R_WAL.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMWATER_R_STD, "ANIMS\\M_MERC\\MW_R_STD.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMWATER_N_WALK, "ANIMS\\M_MERC\\MW_N_WAL.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMWATER_N_STD, "ANIMS\\M_MERC\\MW_N_STD.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMWATER_DIE, "ANIMS\\M_MERC\\MW_DIE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMWATER_N_AIM, "ANIMS\\M_MERC\\MW_N_SHT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMWATER_R_AIM, "ANIMS\\M_MERC\\MW_SR_AM.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMWATER_DBLSHT, "ANIMS\\M_MERC\\MW_DBL.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMWATER_TRANS, "ANIMS\\M_MERC\\MW_FALL.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMDEEPWATER_TRED, "ANIMS\\M_MERC\\MW_TRED.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMDEEPWATER_SWIM, "ANIMS\\M_MERC\\MW_SWIM.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMDEEPWATER_DIE, "ANIMS\\M_MERC\\MW_DIE2.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMHELIDROP, "ANIMS\\M_MERC\\M_HELIDRP.STI", Enum196.S_STRUCT, 0, 1, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMSLEEP, "ANIMS\\M_MERC\\M_SLEEP.STI", Enum196.P_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMSHOOT_LOW, "ANIMS\\M_MERC\\M_SHTLOW.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMTHREATENSTAND, "ANIMS\\M_MERC\\M_BRETH2.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMCDBLSHOT, "ANIMS\\M_MERC\\MC_DBLSH.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMHURTSTANDINGN, "ANIMS\\M_MERC\\M_I_BR_N.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMHURTSTANDINGR, "ANIMS\\M_MERC\\M_I_BR_R.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMHURTWALKINGN, "ANIMS\\M_MERC\\M_I_WK_N.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMHURTWALKINGR, "ANIMS\\M_MERC\\M_I_WK_R.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMHURTTRANS, "ANIMS\\M_MERC\\M_I_TRAN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMTHROWKNIFE, "ANIMS\\M_MERC\\M_K_THRO.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMBREATHKNIFE, "ANIMS\\M_MERC\\M_KNF_BR.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMPISTOLBREATH, "ANIMS\\M_MERC\\M_P_BRTH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMCOWER, "ANIMS\\M_MERC\\M_COWER.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMRAISE2, "ANIMS\\M_MERC\\M_RAISE2.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMROCKET, "ANIMS\\M_MERC\\M_LAW.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMMORTAR, "ANIMS\\M_MERC\\M_MORTAR.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMSIDESTEP, "ANIMS\\M_MERC\\M_R_SDSP.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMDBLBREATH, "ANIMS\\M_MERC\\M_DBL_BR.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMPUNCHLOW, "ANIMS\\M_MERC\\M_PCH_LO.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMPISTOLSHOOTLOW, "ANIMS\\M_MERC\\M_P_SHLO.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMWATERTHROW, "ANIMS\\M_MERC\\MW_THROW.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMWALK2, "ANIMS\\M_MERC\\M_WALK2.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMRUN2, "ANIMS\\M_MERC\\M_R_RUN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMIDLENECK, "ANIMS\\M_MERC\\M_NECK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMCROUCHTRANS, "ANIMS\\M_MERC\\M_C_TRAN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMRADIO, "ANIMS\\M_MERC\\M_RADIO.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMCRRADIO, "ANIMS\\M_MERC\\M_C_RADO.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMDWPRONE, "ANIMS\\M_MERC\\M_DB_PRN.STI", Enum196.P_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMDRUNK, "ANIMS\\M_MERC\\M_R_DRNK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMPISTOLDRUNK, "ANIMS\\M_MERC\\M_N_DRNK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMCROWBAR, "ANIMS\\M_MERC\\M_CROBAR.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.BGMJUMPOVER, "ANIMS\\M_MERC\\M_N_RUN.STI", Enum196.NO_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.RGFWALKING, "ANIMS\\F_MERC\\F_R_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFSTANDING, "ANIMS\\F_MERC\\F_BRETH2.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFCROUCHING, "ANIMS\\F_MERC\\F_R_C.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFSNEAKING, "ANIMS\\F_MERC\\F_R_SWAT.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFRUNNING, "ANIMS\\F_MERC\\F_R_RUN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFPRONE, "ANIMS\\F_MERC\\F_R_PRN.STI", Enum196.P_STRUCT, 0, 8, TO_INIT, null, null, 0, 0),
  createAnimationSurfaceTypeFrom(Enum195.RGFSTANDAIM, "ANIMS\\F_MERC\\F_SR_AIM.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFHITHARD, "ANIMS\\F_MERC\\F_DIEHD.STI", Enum196.FB_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFHITSTAND, "ANIMS\\F_MERC\\F_DIEFWD.STI", Enum196.F_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFHITHARDBLOOD, "ANIMS\\F_MERC\\F_DIEHDB.STI", Enum196.FB_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFCROUCHAIM, "ANIMS\\F_MERC\\F_CR_AIM.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFHITFALLBACK, "ANIMS\\F_MERC\\F_DIEBAC.STI", Enum196.F_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFROLLOVER, "ANIMS\\F_MERC\\F_ROLL.STI", Enum196.P_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFCLIMBROOF, "ANIMS\\F_MERC\\F_CLIMB.STI", Enum196.S_STRUCT, 0, 4, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFFALL, "ANIMS\\F_MERC\\F_FALL.STI", Enum196.S_STRUCT, 0, 4, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFFALLF, "ANIMS\\F_MERC\\F_FALLF.STI", Enum196.S_STRUCT, 0, 4, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFHITCROUCH, "ANIMS\\F_MERC\\F_C_DIE.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFHITPRONE, "ANIMS\\F_MERC\\F_P_DIE.STI", Enum196.P_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFHOPFENCE, "ANIMS\\F_MERC\\F_HOP.STI", Enum196.NO_STRUCT, 0, 4, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFPUNCH, "ANIMS\\F_MERC\\F_PUNCH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFNOTHING_STD, "ANIMS\\F_MERC\\N_BRETH2.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFNOTHING_WALK, "ANIMS\\F_MERC\\F_N_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFNOTHING_RUN, "ANIMS\\F_MERC\\F_N_RUN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFNOTHING_SWAT, "ANIMS\\F_MERC\\F_N_SWAT.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFNOTHING_CROUCH, "ANIMS\\F_MERC\\F_N_CRCH.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFHANDGUN_S_SHOT, "ANIMS\\F_MERC\\F_N_SHOT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFHANDGUN_C_SHOT, "ANIMS\\F_MERC\\F_N_C_AI.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFHANDGUN_PRONE, "ANIMS\\F_MERC\\F_N_PRNE.STI", Enum196.P_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFDIE_JFK, "ANIMS\\F_MERC\\F_DIEJFK.STI", Enum196.F_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFOPEN, "ANIMS\\F_MERC\\F_OPEN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFPICKUP, "ANIMS\\F_MERC\\F_PICKUP.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFSTAB, "ANIMS\\F_MERC\\F_STAB.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFSLICE, "ANIMS\\F_MERC\\F_SLICE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFCSTAB, "ANIMS\\F_MERC\\F_C_STB.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFMEDIC, "ANIMS\\F_MERC\\F_MEDIC.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFDODGE, "ANIMS\\F_MERC\\F_DODGE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFSTANDDWALAIM, "ANIMS\\F_MERC\\F_DBLSHT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFRAISE, "ANIMS\\F_MERC\\F_RAISE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFTHROW, "ANIMS\\F_MERC\\F_THROW.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFLOB, "ANIMS\\F_MERC\\F_LOB.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFKICKDOOR, "ANIMS\\F_MERC\\F_DR_KCK.STI", Enum196.S_STRUCT, 0, 4, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFRHIT, "ANIMS\\F_MERC\\F_R_HIT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFCLEAN, "ANIMS\\F_MERC\\A_CLEAN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFKICKSN, "ANIMS\\F_MERC\\A_KICKSN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFALOOK, "ANIMS\\F_MERC\\A_LOOK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFWIPE, "ANIMS\\F_MERC\\A_WIPE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFWATER_R_WALK, "ANIMS\\F_MERC\\FW_R_WLK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFWATER_R_STD, "ANIMS\\F_MERC\\FW_R_STD.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFWATER_N_WALK, "ANIMS\\F_MERC\\FW_N_WLK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFWATER_N_STD, "ANIMS\\F_MERC\\FW_N_STD.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFWATER_DIE, "ANIMS\\F_MERC\\FW_DIE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFWATER_N_AIM, "ANIMS\\F_MERC\\FW_N_SHT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFWATER_R_AIM, "ANIMS\\F_MERC\\FW_SR_AI.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFWATER_DBLSHT, "ANIMS\\F_MERC\\FW_DBL.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFWATER_TRANS, "ANIMS\\F_MERC\\FW_FALL.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFDEEPWATER_TRED, "ANIMS\\F_MERC\\FW_TRED.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFDEEPWATER_SWIM, "ANIMS\\F_MERC\\FW_SWIM.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFDEEPWATER_DIE, "ANIMS\\F_MERC\\FW_DIE2.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFHELIDROP, "ANIMS\\F_MERC\\F_HELIDRP.STI", Enum196.S_STRUCT, 0, 1, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFSLEEP, "ANIMS\\F_MERC\\F_SLEEP.STI", Enum196.P_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFSHOOT_LOW, "ANIMS\\F_MERC\\F_SHTLOW.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFCDBLSHOT, "ANIMS\\F_MERC\\FC_DBLSH.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFHURTSTANDINGN, "ANIMS\\F_MERC\\F_I_BR_N.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFHURTSTANDINGR, "ANIMS\\F_MERC\\F_I_BR_R.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFHURTWALKINGN, "ANIMS\\F_MERC\\F_I_WK_N.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFHURTWALKINGR, "ANIMS\\F_MERC\\F_I_WK_R.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFHURTTRANS, "ANIMS\\F_MERC\\F_I_TRAN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFTHROWKNIFE, "ANIMS\\F_MERC\\F_K_THRO.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFBREATHKNIFE, "ANIMS\\F_MERC\\F_KNF_BR.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFPISTOLBREATH, "ANIMS\\F_MERC\\F_P_BRTH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFCOWER, "ANIMS\\F_MERC\\F_COWER.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFROCKET, "ANIMS\\F_MERC\\F_LAW.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFMORTAR, "ANIMS\\F_MERC\\F_MORTAR.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFSIDESTEP, "ANIMS\\F_MERC\\F_R_SDSP.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFDBLBREATH, "ANIMS\\F_MERC\\F_DBL_BR.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFPUNCHLOW, "ANIMS\\F_MERC\\F_PCH_LO.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFPISTOLSHOOTLOW, "ANIMS\\F_MERC\\F_P_SHLO.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFWATERTHROW, "ANIMS\\F_MERC\\FW_THRW.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFRADIO, "ANIMS\\F_MERC\\F_RADIO.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFCRRADIO, "ANIMS\\F_MERC\\F_C_RADO.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFSLAP, "ANIMS\\F_MERC\\F_SLAP.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFDWPRONE, "ANIMS\\F_MERC\\F_DB_PRN.STI", Enum196.P_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFDRUNK, "ANIMS\\F_MERC\\F_R_DRNK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFPISTOLDRUNK, "ANIMS\\F_MERC\\F_N_DRNK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFCROWBAR, "ANIMS\\F_MERC\\F_CROBAR.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.RGFJUMPOVER, "ANIMS\\F_MERC\\F_N_RUN.STI", Enum196.NO_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.AFMONSTERSTANDING, "ANIMS\\MONSTERS\\MN_BREAT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.AFMONSTERWALKING, "ANIMS\\MONSTERS\\MN_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.AFMONSTERATTACK, "ANIMS\\MONSTERS\\MN_ATTAK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.AFMONSTERCLOSEATTACK, "ANIMS\\MONSTERS\\M_ATTK2.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.AFMONSTERSPITATTACK, "ANIMS\\MONSTERS\\M_SPIT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.AFMONSTEREATING, "ANIMS\\MONSTERS\\M_EAT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.AFMONSTERDIE, "ANIMS\\MONSTERS\\MN_DIE1.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.AFMUP, "ANIMS\\MONSTERS\\MN_UP.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.AFMJUMP, "ANIMS\\MONSTERS\\MN_JUMP.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.AFMMELT, "ANIMS\\MONSTERS\\MN_MELT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.LVBREATH, "ANIMS\\MONSTERS\\L_BREATH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.LVDIE, "ANIMS\\MONSTERS\\L_DIE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.LVWALK, "ANIMS\\MONSTERS\\L_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.IBREATH, "ANIMS\\MONSTERS\\I_BREATH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.IWALK, "ANIMS\\MONSTERS\\I_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.IDIE, "ANIMS\\MONSTERS\\I_DIE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.IEAT, "ANIMS\\MONSTERS\\I_EAT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.IATTACK, "ANIMS\\MONSTERS\\I_ATTACK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.QUEENMONSTERSTANDING, "ANIMS\\MONSTERS\\QMN_BREAT.STI", Enum196.S_STRUCT, 0, 1, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.QUEENMONSTERREADY, "ANIMS\\MONSTERS\\Q_READY.STI", Enum196.S_STRUCT, 0, 1, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.QUEENMONSTERSPIT_SW, "ANIMS\\MONSTERS\\Q_SPIT_SW.STI", Enum196.S_STRUCT, 0, 1, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.QUEENMONSTERSPIT_E, "ANIMS\\MONSTERS\\Q_SPIT_E.STI", Enum196.S_STRUCT, 0, 1, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.QUEENMONSTERSPIT_NE, "ANIMS\\MONSTERS\\Q_SPIT_NE.STI", Enum196.S_STRUCT, 0, 1, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.QUEENMONSTERSPIT_S, "ANIMS\\MONSTERS\\Q_SPIT_S.STI", Enum196.S_STRUCT, 0, 1, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.QUEENMONSTERSPIT_SE, "ANIMS\\MONSTERS\\Q_SPIT_SE.STI", Enum196.S_STRUCT, 0, 1, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.QUEENMONSTERDEATH, "ANIMS\\MONSTERS\\Q_DIE.STI", Enum196.S_STRUCT, 0, 1, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.QUEENMONSTERSWIPE, "ANIMS\\MONSTERS\\Q_SWIPE.STI", Enum196.S_STRUCT, 0, 1, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.FATMANSTANDING, "ANIMS\\CIVS\\FT_BRTH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.FATMANWALKING, "ANIMS\\CIVS\\FT_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.FATMANRUNNING, "ANIMS\\CIVS\\FT_RUN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.FATMANDIE, "ANIMS\\CIVS\\FT_DIE.STI", Enum196.F_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.FATMANASS, "ANIMS\\CIVS\\FT_SCRTC.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.FATMANACT, "ANIMS\\CIVS\\FT_ACT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.FATMANCOWER, "ANIMS\\CIVS\\FT_COWER.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.FATMANDIE2, "ANIMS\\CIVS\\FT_DIE2.STI", Enum196.F_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.FATMANCOWERHIT, "ANIMS\\CIVS\\F_CW_HIT.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.MANCIVSTANDING, "ANIMS\\CIVS\\M_BREATH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.MANCIVWALKING, "ANIMS\\CIVS\\M_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.MANCIVRUNNING, "ANIMS\\CIVS\\M_RUN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.MANCIVDIE, "ANIMS\\CIVS\\M_DIE.STI", Enum196.F_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.MANCIVACT, "ANIMS\\CIVS\\M_ACT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.MANCIVCOWER, "ANIMS\\CIVS\\M_COWER.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.MANCIVDIE2, "ANIMS\\CIVS\\M_DIE2.STI", Enum196.F_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.MANCIVSMACKED, "ANIMS\\CIVS\\M_SMCKED.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.MANCIVPUNCH, "ANIMS\\CIVS\\M_PUNCH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.MANCIVCOWERHIT, "ANIMS\\CIVS\\M_CW_HIT.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.MINICIVSTANDING, "ANIMS\\CIVS\\MI_BREATH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.MINICIVWALKING, "ANIMS\\CIVS\\MI_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.MINICIVRUNNING, "ANIMS\\CIVS\\MI_RUN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.MINICIVDIE, "ANIMS\\CIVS\\MI_DIE.STI", Enum196.F_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.MINISTOCKING, "ANIMS\\CIVS\\MI_STKNG.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.MINIACT, "ANIMS\\CIVS\\MI_ACT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.MINICOWER, "ANIMS\\CIVS\\MI_COWER.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.MINIDIE2, "ANIMS\\CIVS\\MI_DIE2.STI", Enum196.F_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.MINICOWERHIT, "ANIMS\\CIVS\\S_CW_HIT.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.DRESSCIVSTANDING, "ANIMS\\CIVS\\DS_BREATH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.DRESSCIVWALKING, "ANIMS\\CIVS\\DS_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.DRESSCIVRUNNING, "ANIMS\\CIVS\\DS_RUN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.DRESSCIVDIE, "ANIMS\\CIVS\\DS_DIE.STI", Enum196.F_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.DRESSCIVACT, "ANIMS\\CIVS\\DS_ACT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.DRESSCIVCOWER, "ANIMS\\CIVS\\DS_COWER.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.DRESSCIVDIE2, "ANIMS\\CIVS\\DS_DIE2.STI", Enum196.F_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.DRESSCIVCOWERHIT, "ANIMS\\CIVS\\W_CW_HIT.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.HATKIDCIVSTANDING, "ANIMS\\CIVS\\H_BREATH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.HATKIDCIVWALKING, "ANIMS\\CIVS\\H_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.HATKIDCIVRUNNING, "ANIMS\\CIVS\\H_RUN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.HATKIDCIVDIE, "ANIMS\\CIVS\\H_DIE2.STI", Enum196.F_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.HATKIDCIVJFK, "ANIMS\\CIVS\\H_DIEJFK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.HATKIDCIVYOYO, "ANIMS\\CIVS\\H_YOYO.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.HATKIDCIVACT, "ANIMS\\CIVS\\H_ACT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.HATKIDCIVCOWER, "ANIMS\\CIVS\\H_COWER.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.HATKIDCIVDIE2, "ANIMS\\CIVS\\H_DIE.STI", Enum196.F_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.HATKIDCIVCOWERHIT, "ANIMS\\CIVS\\H_CW_HIT.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.HATKIDCIVSKIP, "ANIMS\\CIVS\\H_SKIP.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.KIDCIVSTANDING, "ANIMS\\CIVS\\K_BREATH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.KIDCIVWALKING, "ANIMS\\CIVS\\K_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.KIDCIVRUNNING, "ANIMS\\CIVS\\K_RUN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.KIDCIVDIE, "ANIMS\\CIVS\\K_DIE2.STI", Enum196.F_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.KIDCIVJFK, "ANIMS\\CIVS\\K_DIEJFK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.KIDCIVARMPIT, "ANIMS\\CIVS\\K_ARMPIT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.KIDCIVACT, "ANIMS\\CIVS\\K_ACT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.KIDCIVCOWER, "ANIMS\\CIVS\\K_COWER.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.KIDCIVDIE2, "ANIMS\\CIVS\\K_DIE.STI", Enum196.F_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.KIDCIVCOWERHIT, "ANIMS\\CIVS\\K_CW_HIT.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.KIDCIVSKIP, "ANIMS\\CIVS\\K_SKIP.STI", Enum196.C_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.CRIPCIVSTANDING, "ANIMS\\CIVS\\CP_BRETH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.CRIPCIVWALKING, "ANIMS\\CIVS\\CP_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.CRIPCIVRUNNING, "ANIMS\\CIVS\\CP_RUN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.CRIPCIVBEG, "ANIMS\\CIVS\\CP_BEG.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.CRIPCIVDIE, "ANIMS\\CIVS\\CP_DIE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.CRIPCIVDIE2, "ANIMS\\CIVS\\CP_DIE2.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.CRIPCIVKICK, "ANIMS\\CIVS\\CP_KICK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.COWSTANDING, "ANIMS\\ANIMALS\\C_BREATH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.COWWALKING, "ANIMS\\ANIMALS\\C_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.COWDIE, "ANIMS\\ANIMALS\\C_DIE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.COWEAT, "ANIMS\\ANIMALS\\C_EAT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.CROWWALKING, "ANIMS\\ANIMALS\\CR_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.CROWFLYING, "ANIMS\\ANIMALS\\CR_FLY.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.CROWEATING, "ANIMS\\ANIMALS\\CR_EAT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.CROWDYING, "ANIMS\\ANIMALS\\CR_DIE.STI", Enum196.NO_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.CATBREATH, "ANIMS\\ANIMALS\\CT_BREATH.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.CATWALK, "ANIMS\\ANIMALS\\CT_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.CATRUN, "ANIMS\\ANIMALS\\CT_RUN.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.CATREADY, "ANIMS\\ANIMALS\\CT_READY.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.CATHIT, "ANIMS\\ANIMALS\\CT_HIT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.CATDIE, "ANIMS\\ANIMALS\\CT_DIE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.CATSWIPE, "ANIMS\\ANIMALS\\CT_SWIPE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.CATBITE, "ANIMS\\ANIMALS\\CT_BITE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.ROBOTNWBREATH, "ANIMS\\CIVS\\J_R_BRET.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.ROBOTNWWALK, "ANIMS\\CIVS\\J_R_WALK.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.ROBOTNWHIT, "ANIMS\\CIVS\\J_R_HIT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.ROBOTNWDIE, "ANIMS\\CIVS\\J_R_DIE.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.ROBOTNWSHOOT, "ANIMS\\CIVS\\J_R_SHOT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.HUMVEE_BASIC, "ANIMS\\VEHICLES\\HUMMER2.STI", Enum196.S_STRUCT, ANIM_DATA_FLAG_NOFRAMES, 32, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.HUMVEE_DIE, "ANIMS\\VEHICLES\\HM_WREK.STI", Enum196.S_STRUCT, 0, 2, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.TANKNW_READY, "ANIMS\\VEHICLES\\TANK_ROT.STI", Enum196.S_STRUCT, ANIM_DATA_FLAG_NOFRAMES, 32, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.TANKNW_SHOOT, "ANIMS\\VEHICLES\\TANK_SHT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.TANKNW_DIE, "ANIMS\\VEHICLES\\TK_WREK.STI", Enum196.S_STRUCT, 0, 1, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.TANKNE_READY, "ANIMS\\VEHICLES\\TNK2_ROT.STI", Enum196.S_STRUCT, ANIM_DATA_FLAG_NOFRAMES, 32, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.TANKNE_SHOOT, "ANIMS\\VEHICLES\\TNK2_SHT.STI", Enum196.S_STRUCT, 0, 8, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.TANKNE_DIE, "ANIMS\\VEHICLES\\TK2_WREK.STI", Enum196.S_STRUCT, 0, 1, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.ELDORADO_BASIC, "ANIMS\\VEHICLES\\HUMMER.STI", Enum196.S_STRUCT, ANIM_DATA_FLAG_NOFRAMES, 32, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.ELDORADO_DIE, "ANIMS\\VEHICLES\\HM_WREK.STI", Enum196.NO_STRUCT, 0, 2, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.ICECREAMTRUCK_BASIC, "ANIMS\\VEHICLES\\ICECRM.STI", Enum196.S_STRUCT, ANIM_DATA_FLAG_NOFRAMES, 32, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.ICECREAMTRUCK_DIE, "ANIMS\\VEHICLES\\HM_WREK.STI", Enum196.NO_STRUCT, 0, 2, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.JEEP_BASIC, "ANIMS\\VEHICLES\\HUMMER.STI", Enum196.S_STRUCT, ANIM_DATA_FLAG_NOFRAMES, 32, TO_INIT, null, null, 0, -1),
  createAnimationSurfaceTypeFrom(Enum195.JEEP_DIE, "ANIMS\\VEHICLES\\HM_WREK.STI", Enum196.NO_STRUCT, 0, 2, TO_INIT, null, null, 0, -1),

  createAnimationSurfaceTypeFrom(Enum195.BODYEXPLODE, "ANIMS\\S_MERC\\BOD_BLOW.STI", Enum196.NO_STRUCT, 0, 1, TO_INIT, null, null, 0, -1),
];

let gAnimStructureDatabase: AnimationStructureType[][] /* [TOTALBODYTYPES][NUM_STRUCT_IDS] */ = [
  // Normal Male
  [
    [ "ANIMS\\STRUCTDATA\\M_STAND.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_PRONE.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_FALL.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_FALLBACK.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // Big male
  [
    [ "ANIMS\\STRUCTDATA\\M_STAND.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_PRONE.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_FALL.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_FALLBACK.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // Stocky male
  [
    [ "ANIMS\\STRUCTDATA\\M_STAND.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_PRONE.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_FALL.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_FALLBACK.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // Reg Female
  [
    [ "ANIMS\\STRUCTDATA\\M_STAND.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_PRONE.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_FALL.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_FALLBACK.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // Adult female creature
  [
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // Adult male creature
  [
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // Young Adult female creature
  [
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // Young Adult male creature
  [
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\MN_BREAT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // larvea creature
  [
    [ "ANIMS\\STRUCTDATA\\L_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\L_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\L_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\L_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\L_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // infant creature
  [
    [ "ANIMS\\STRUCTDATA\\I_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\I_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\I_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\I_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\I_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\I_BREATH.JSD", null ], // default
  ],

  // Queen creature
  [
    [ "ANIMS\\STRUCTDATA\\Q_READY.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\Q_READY.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\Q_READY.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\Q_READY.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\Q_READY.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // Fat civ
  [
    [ "ANIMS\\STRUCTDATA\\M_STAND.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_PRONE.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_FALL.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_FALLBACK.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // man civ
  [
    [ "ANIMS\\STRUCTDATA\\M_STAND.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_PRONE.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_FALL.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_FALLBACK.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // miniskirt civ
  [
    [ "ANIMS\\STRUCTDATA\\M_STAND.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_PRONE.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_FALL.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_FALLBACK.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // dress civ
  [
    [ "ANIMS\\STRUCTDATA\\M_STAND.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_PRONE.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_FALL.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_FALLBACK.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // kid civ
  [
    [ "ANIMS\\STRUCTDATA\\K_STAND.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\K_CROUCH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\K_CROUCH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_PRONE.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_PRONE.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_PRONE.JSD", null ],
  ],

  // hat kid civ
  [
    [ "ANIMS\\STRUCTDATA\\K_STAND.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\K_CROUCH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\K_CROUCH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_PRONE.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_PRONE.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_PRONE.JSD", null ],
  ],

  // cripple civ
  [
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_FALL.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_FALLBACK.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // cow
  [
    [ "ANIMS\\STRUCTDATA\\CW_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\CW_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\CW_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\CW_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\CW_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // crow
  [
    [ "ANIMS\\STRUCTDATA\\CR_STAND.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\CR_CROUCH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\CR_PRONE.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\CR_PRONE.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\CR_PRONE.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // CAT
  [
    [ "ANIMS\\STRUCTDATA\\CT_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\CT_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\CT_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\CT_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\CT_BREATH.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // ROBOT1
  [
    [ "ANIMS\\STRUCTDATA\\J_R_BRET.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\J_R_BRET.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\J_R_BRET.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\J_R_BRET.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\J_R_BRET.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\J_R_BRET.JSD", null ], // default
  ],

  // vech 1
  [
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // tank 1
  [
    [ "ANIMS\\STRUCTDATA\\TNK_SHT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\TNK_SHT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\TNK_SHT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\TNK_SHT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\TNK_SHT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // tank 2
  [
    [ "ANIMS\\STRUCTDATA\\TNK2_ROT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\TNK2_ROT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\TNK2_ROT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\TNK2_ROT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\TNK2_ROT.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // ELDORADO
  [
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // ICECREAMTRUCK
  [
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],

  // JEEP
  [
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\HMMV.JSD", null ],
    [ "ANIMS\\STRUCTDATA\\M_CROUCH.JSD", null ], // default
  ],
];

export function InitAnimationSystem(): boolean {
  let cnt1: INT32;
  let cnt2: INT32;
  let sFilename: string /* CHAR8[50] */;
  let pStructureFileRef: Pointer<STRUCTURE_FILE_REF>;

  if (!LoadAnimationStateInstructions()) {
    return false;
  }

  InitAnimationSurfacesPerBodytype();

  if (!LoadAnimationProfiles()) {
    return SET_ERROR("Problems initializing Animation Profiles");
  }

  // OK, Load all animation structures.....
  for (cnt1 = 0; cnt1 < Enum194.TOTALBODYTYPES; cnt1++) {
    for (cnt2 = 0; cnt2 < Enum196.NUM_STRUCT_IDS; cnt2++) {
      sFilename = gAnimStructureDatabase[cnt1][cnt2].Filename;

      if (FileExists(sFilename)) {
        pStructureFileRef = LoadStructureFile(sFilename);
        if (pStructureFileRef == null) {
          SET_ERROR("Animation structure file load failed - %s", sFilename);
        }
        gAnimStructureDatabase[cnt1][cnt2].pStructureFileRef = pStructureFileRef;
      }
    }
  }

  return true;
}

export function DeInitAnimationSystem(): boolean {
  let cnt1: INT32;
  let cnt2: INT32;

  for (cnt1 = 0; cnt1 < Enum195.NUMANIMATIONSURFACETYPES; cnt1++) {
    if (gAnimSurfaceDatabase[cnt1].hVideoObject != null) {
      DeleteVideoObject(gAnimSurfaceDatabase[cnt1].hVideoObject);
      gAnimSurfaceDatabase[cnt1].hVideoObject = null;
    }
  }

  // OK, Delete all animation structures.....
  // ATE: OK, don't delete here.. we be deleted when the structure database is destoryed....
  for (cnt1 = 0; cnt1 < Enum194.TOTALBODYTYPES; cnt1++) {
    for (cnt2 = 0; cnt2 < 3; cnt2++) {
      if (gAnimStructureDatabase[cnt1][cnt2].pStructureFileRef != null) {
        //	FreeStructureFile( gAnimStructureDatabase[ cnt1 ][ cnt2 ].pStructureFileRef );
        //	gAnimStructureDatabase[ cnt1 ][ cnt2 ].pStructureFileRef = NULL;
      }
    }
  }

  DeleteAnimationProfiles();

  return true;
}

function InternalGetAnimationStructureRef(usSoldierID: UINT16, usSurfaceIndex: UINT16, usAnimState: UINT16, fUseAbsolute: boolean): Pointer<STRUCTURE_FILE_REF> {
  let bStructDataType: INT8;

  if (usSurfaceIndex == INVALID_ANIMATION_SURFACE) {
    return null;
  }

  bStructDataType = gAnimSurfaceDatabase[usSurfaceIndex].bStructDataType;

  if (bStructDataType == Enum196.NO_STRUCT) {
    return null;
  }

  // ATE: Alright - we all hate exception coding but ness here...
  // return STANDING struct for these - which start standing but end prone
  // CJC August 14 2002: added standing burst hit to this list
  if ((usAnimState == Enum193.FALLFORWARD_FROMHIT_STAND || usAnimState == Enum193.GENERIC_HIT_STAND || usAnimState == Enum193.FALLFORWARD_FROMHIT_CROUCH || usAnimState == Enum193.STANDING_BURST_HIT) && !fUseAbsolute) {
    return gAnimStructureDatabase[MercPtrs[usSoldierID].value.ubBodyType][Enum196.S_STRUCT].pStructureFileRef;
  }

  return gAnimStructureDatabase[MercPtrs[usSoldierID].value.ubBodyType][bStructDataType].pStructureFileRef;
}

export function GetAnimationStructureRef(usSoldierID: UINT16, usSurfaceIndex: UINT16, usAnimState: UINT16): Pointer<STRUCTURE_FILE_REF> {
  return InternalGetAnimationStructureRef(usSoldierID, usSurfaceIndex, usAnimState, false);
}

function GetDefaultStructureRef(usSoldierID: UINT16): Pointer<STRUCTURE_FILE_REF> {
  return gAnimStructureDatabase[MercPtrs[usSoldierID].value.ubBodyType][Enum196.DEFAULT_STRUCT].pStructureFileRef;
}

// Surface mamagement functions
export function LoadAnimationSurface(usSoldierID: UINT16, usSurfaceIndex: UINT16, usAnimState: UINT16): boolean {
  let pAuxData: Pointer<AuxObjectData>;

  // Check for valid surface
  if (usSurfaceIndex >= Enum195.NUMANIMATIONSURFACETYPES) {
    return false;
  }

  // Check if surface is loaded
  if (gAnimSurfaceDatabase[usSurfaceIndex].hVideoObject != null) {
    // just increment usage counter ( below )
    AnimDebugMsg(String("Surface Database: Hit %d", usSurfaceIndex));
  } else {
    // Load into memory
    let VObjectDesc: VOBJECT_DESC;
    let hVObject: HVOBJECT;
    let hImage: HIMAGE;
    let sFilename: string /* CHAR8[48] */;
    let pStructureFileRef: Pointer<STRUCTURE_FILE_REF>;

    AnimDebugMsg(String("Surface Database: Loading %d", usSurfaceIndex));

    gSystemDebugStr = "Cache Load";

    // Create video object
    FilenameForBPP(gAnimSurfaceDatabase[usSurfaceIndex].Filename, sFilename);
    hImage = CreateImage(/*gAnimSurfaceDatabase[ usSurfaceIndex ].Filename*/ sFilename, IMAGE_ALLDATA);

    if (hImage == null) {
      return SET_ERROR("Error: Could not load animation file %s", sFilename);
    }

    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMHIMAGE;
    VObjectDesc.hImage = hImage;

    hVObject = CreateVideoObject(addressof(VObjectDesc));

    if (hVObject == null) {
      // Report error
      SET_ERROR("Could not load animation file: %s", gAnimSurfaceDatabase[usSurfaceIndex].Filename);
      // Video Object will set error conition.]
      DestroyImage(hImage);
      return false;
    }

    // Get aux data
    if (hImage.value.uiAppDataSize == hVObject.value.usNumberOfObjects * sizeof(AuxObjectData)) {
      // Valid auxiliary data, so get # od frames from data
      pAuxData = hImage.value.pAppData;

      gAnimSurfaceDatabase[usSurfaceIndex].uiNumFramesPerDir = pAuxData.value.ubNumberOfFrames;
    } else {
      // Report error
      SET_ERROR("Invalid # of animations given");
      DestroyImage(hImage);
      return false;
    }

    // get structure data if any
    pStructureFileRef = InternalGetAnimationStructureRef(usSoldierID, usSurfaceIndex, usAnimState, true);

    if (pStructureFileRef != null) {
      let sStartFrame: INT16 = 0;

      if (usSurfaceIndex == Enum195.RGMPRONE) {
        sStartFrame = 5;
      } else if (usSurfaceIndex >= Enum195.QUEENMONSTERSTANDING && usSurfaceIndex <= Enum195.QUEENMONSTERSWIPE) {
        sStartFrame = -1;
      }

      if (AddZStripInfoToVObject(hVObject, pStructureFileRef, true, sStartFrame) == false) {
        DestroyImage(hImage);
        DeleteVideoObject(hVObject);
        SET_ERROR("Animation structure ZStrip creation error: %s", sFilename);
        return false;
      }
    }

    // the hImage is no longer needed
    DestroyImage(hImage);

    // Set video object index
    gAnimSurfaceDatabase[usSurfaceIndex].hVideoObject = hVObject;

    // Determine if we have a problem with #frames + directions ( ie mismatch )
    if ((gAnimSurfaceDatabase[usSurfaceIndex].uiNumDirections * gAnimSurfaceDatabase[usSurfaceIndex].uiNumFramesPerDir) != gAnimSurfaceDatabase[usSurfaceIndex].hVideoObject.value.usNumberOfObjects) {
      AnimDebugMsg(String("Surface Database: WARNING!!! Surface %d has #frames mismatch.", usSurfaceIndex));
    }
  }

  // Increment usage count only if history for soldier is not yet set
  if (gbAnimUsageHistory[usSurfaceIndex][usSoldierID] == 0) {
    AnimDebugMsg(String("Surface Database: Incrementing Usage %d ( Soldier %d )", usSurfaceIndex, usSoldierID));
    // Increment usage count
    gAnimSurfaceDatabase[usSurfaceIndex].bUsageCount++;
    // Set history for particular sodlier
    gbAnimUsageHistory[usSurfaceIndex][usSoldierID]++;
  }

  return true;
}

export function UnLoadAnimationSurface(usSoldierID: UINT16, usSurfaceIndex: UINT16): boolean {
  // Decrement usage flag, only if this soldier has it currently tagged
  if (gbAnimUsageHistory[usSurfaceIndex][usSoldierID] > 0) {
    // Decrement usage count
    AnimDebugMsg(String("Surface Database: Decrementing Usage %d ( Soldier %d )", usSurfaceIndex, usSoldierID));
    gAnimSurfaceDatabase[usSurfaceIndex].bUsageCount--;
    // Set history for particular sodlier
    gbAnimUsageHistory[usSurfaceIndex][usSoldierID] = 0;
  } else {
    // Return warning that we have not actually loaded the surface previously
    AnimDebugMsg(String("Surface Database: WARNING!!! Soldier has tried to unlock surface that he has not locked."));
    return false;
  }

  AnimDebugMsg(String("Surface Database: MercUsage: %d, Global Uasage: %d", gbAnimUsageHistory[usSurfaceIndex][usSoldierID], gAnimSurfaceDatabase[usSurfaceIndex].bUsageCount));

  // Check for < 0
  if (gAnimSurfaceDatabase[usSurfaceIndex].bUsageCount < 0) {
    gAnimSurfaceDatabase[usSurfaceIndex].bUsageCount = 0;
  }

  // Check if count has reached zero and delet if so
  if (gAnimSurfaceDatabase[usSurfaceIndex].bUsageCount == 0) {
    AnimDebugMsg(String("Surface Database: Unloading Surface: %d", usSurfaceIndex));

    if (gAnimSurfaceDatabase[usSurfaceIndex].hVideoObject == null) {
      return false;
    }
    DeleteVideoObject(gAnimSurfaceDatabase[usSurfaceIndex].hVideoObject);
    gAnimSurfaceDatabase[usSurfaceIndex].hVideoObject = null;
  }

  return true;
}

export function ClearAnimationSurfacesUsageHistory(usSoldierID: UINT16): void {
  let cnt: UINT32;

  for (cnt = 0; cnt < Enum195.NUMANIMATIONSURFACETYPES; cnt++) {
    gbAnimUsageHistory[cnt][usSoldierID] = 0;
  }
}

function LoadAnimationProfiles(): boolean {
  //	FILE *			pInput;
  let pInput: HWFILE;
  let iProfileCount: INT32;
  let iDirectionCount: INT32;
  let iTileCount: INT32;
  let pProfile: Pointer<ANIM_PROF>;
  let pProfileDirs: Pointer<ANIM_PROF_DIR>;
  let uiBytesRead: UINT32;

  //	pInput = fopen( ANIMPROFILEFILENAME, "rb" );
  pInput = FileOpen(ANIMPROFILEFILENAME, FILE_ACCESS_READ, false);

  if (!pInput) {
    return false;
  }

  // Writeout profile data!
  //	if ( fread( &gubNumAnimProfiles, sizeof( gubNumAnimProfiles ), 1, pInput ) != 1 )
  if (FileRead(pInput, addressof(gubNumAnimProfiles), sizeof(gubNumAnimProfiles), addressof(uiBytesRead)) != 1) {
    return false;
  }

  // Malloc profile data!
  gpAnimProfiles = MemAlloc(gubNumAnimProfiles * sizeof(ANIM_PROF));

  // Loop profiles
  for (iProfileCount = 0; iProfileCount < gubNumAnimProfiles; iProfileCount++) {
    // Get profile pointer
    pProfile = addressof(gpAnimProfiles[iProfileCount]);

    // Loop directions
    for (iDirectionCount = 0; iDirectionCount < 8; iDirectionCount++) {
      // Get prodile direction pointer
      pProfileDirs = addressof(gpAnimProfiles[iProfileCount].Dirs[iDirectionCount]);

      // Read # tiles
      //			if ( fread( &pProfileDirs->ubNumTiles, sizeof( UINT8 ), 1, pInput ) != 1 )
      if (FileRead(pInput, addressof(pProfileDirs.value.ubNumTiles), sizeof(UINT8), addressof(uiBytesRead)) != 1) {
        return false;
      }

      // Malloc space for tiles!
      pProfileDirs.value.pTiles = MemAlloc(sizeof(ANIM_PROF_TILE) * pProfileDirs.value.ubNumTiles);

      // Loop tiles
      for (iTileCount = 0; iTileCount < pProfileDirs.value.ubNumTiles; iTileCount++) {
        //				if ( fread( &pProfileDirs->pTiles[ iTileCount ].usTileFlags, sizeof( UINT16 ), 1, pInput ) != 1 )
        if (FileRead(pInput, addressof(pProfileDirs.value.pTiles[iTileCount].usTileFlags), sizeof(UINT16), addressof(uiBytesRead)) != 1) {
          return false;
        }

        //				if ( fread( &pProfileDirs->pTiles[ iTileCount ].bTileX, sizeof( INT8 ), 1, pInput ) != 1 )
        if (FileRead(pInput, addressof(pProfileDirs.value.pTiles[iTileCount].bTileX), sizeof(INT8), addressof(uiBytesRead)) != 1) {
          return false;
        }

        //				if ( fread( &pProfileDirs->pTiles[ iTileCount ].bTileY, sizeof( INT8 ), 1, pInput ) != 1 )
        if (FileRead(pInput, addressof(pProfileDirs.value.pTiles[iTileCount].bTileY), sizeof(INT8), addressof(uiBytesRead)) != 1) {
          return false;
        }
      }
    }
  }

  //	fclose( pInput );
  FileClose(pInput);

  return true;
}

function DeleteAnimationProfiles(): void {
  let iProfileCount: INT32;
  let iDirectionCount: INT32;
  let pProfile: Pointer<ANIM_PROF>;
  let pProfileDir: Pointer<ANIM_PROF_DIR>;

  // Loop profiles
  for (iProfileCount = 0; iProfileCount < gubNumAnimProfiles; iProfileCount++) {
    // Get profile pointer
    pProfile = addressof(gpAnimProfiles[iProfileCount]);

    // Loop directions
    for (iDirectionCount = 0; iDirectionCount < 8; iDirectionCount++) {
      // Get prodile direction pointer
      pProfileDir = addressof(gpAnimProfiles[iProfileCount].Dirs[iDirectionCount]);

      // Free tile
      MemFree(pProfileDir.value.pTiles);
    }
  }

  // Free profile data!
  MemFree(gpAnimProfiles);
}

export function ZeroAnimSurfaceCounts(): void {
  let cnt: INT32;

  for (cnt = 0; cnt < Enum195.NUMANIMATIONSURFACETYPES; cnt++) {
    gAnimSurfaceDatabase[cnt].bUsageCount = 0;
    gAnimSurfaceDatabase[cnt].hVideoObject = null;
  }

  memset(gbAnimUsageHistory, 0, sizeof(gbAnimUsageHistory));
}

}
