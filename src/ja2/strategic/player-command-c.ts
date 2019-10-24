function GetSectorFacilitiesFlags(sMapX: INT16, sMapY: INT16, sFacilitiesString: STR16): void {
  // will build a string stating current facilities present in sector

  if (SectorInfo[SECTOR(sMapX, sMapY)].uiFacilitiesFlags == 0) {
    // none
    swprintf(sFacilitiesString, "%s", sFacilitiesStrings[0]);
    return;
  }

  // hospital
  if (SectorInfo[SECTOR(sMapX, sMapY)].uiFacilitiesFlags & SFCF_HOSPITAL) {
    swprintf(sFacilitiesString, "%s", sFacilitiesStrings[1]);
  }

  // industry
  if (SectorInfo[SECTOR(sMapX, sMapY)].uiFacilitiesFlags & SFCF_INDUSTRY) {
    if (wcslen(sFacilitiesString) == 0) {
      swprintf(sFacilitiesString, "%s", sFacilitiesStrings[2]);
    } else {
      wcscat(sFacilitiesString, ",");
      wcscat(sFacilitiesString, sFacilitiesStrings[2]);
    }
  }

  // prison
  if (SectorInfo[SECTOR(sMapX, sMapY)].uiFacilitiesFlags & SFCF_PRISON) {
    if (wcslen(sFacilitiesString) == 0) {
      swprintf(sFacilitiesString, "%s", sFacilitiesStrings[3]);
    } else {
      wcscat(sFacilitiesString, ",");
      wcscat(sFacilitiesString, sFacilitiesStrings[3]);
    }
  }

  // airport
  if (SectorInfo[SECTOR(sMapX, sMapY)].uiFacilitiesFlags & SFCF_AIRPORT) {
    if (wcslen(sFacilitiesString) == 0) {
      swprintf(sFacilitiesString, "%s", sFacilitiesStrings[5]);
    } else {
      wcscat(sFacilitiesString, ",");
      wcscat(sFacilitiesString, sFacilitiesStrings[5]);
    }
  }

  // gun range
  if (SectorInfo[SECTOR(sMapX, sMapY)].uiFacilitiesFlags & SFCF_GUN_RANGE) {
    if (wcslen(sFacilitiesString) == 0) {
      swprintf(sFacilitiesString, "%s", sFacilitiesStrings[6]);
    } else {
      wcscat(sFacilitiesString, ",");
      wcscat(sFacilitiesString, sFacilitiesStrings[6]);
    }
  }

  sFacilitiesString[wcslen(sFacilitiesString)] = 0;

  return;
}

// ALL changes of control to player must be funneled through here!
function SetThisSectorAsPlayerControlled(sMapX: INT16, sMapY: INT16, bMapZ: INT8, fContested: BOOLEAN): BOOLEAN {
  // NOTE: MapSector must be 16-bit, cause MAX_WORLD_X is actually 18, so the sector numbers exceed 256 although we use only 16x16
  let usMapSector: UINT16 = 0;
  let fWasEnemyControlled: BOOLEAN = FALSE;
  let bTownId: INT8 = 0;
  let ubSectorID: UINT8;

  if (AreInMeanwhile()) {
    return FALSE;
  }

  if (bMapZ == 0) {
    usMapSector = sMapX + (sMapY * MAP_WORLD_X);

    /*
                    // if enemies formerly controlled this sector
                    if (StrategicMap[ usMapSector ].fEnemyControlled)
                    {
                            // remember that the enemies have lost it
                            StrategicMap[ usMapSector ].fLostControlAtSomeTime = TRUE;
                    }
    */
    if (NumHostilesInSector(sMapX, sMapY, bMapZ)) {
      // too premature:  enemies still in sector.
      return FALSE;
    }

    // check if we ever grabbed drassen airport, if so, set fact we can go to BR's
    if ((sMapX == BOBBYR_SHIPPING_DEST_SECTOR_X) && (sMapY == BOBBYR_SHIPPING_DEST_SECTOR_Y)) {
      LaptopSaveInfo.fBobbyRSiteCanBeAccessed = TRUE;

      // If the player has been to Bobbyr when it was down, and we havent already sent email, send him an email
      if (LaptopSaveInfo.ubHaveBeenToBobbyRaysAtLeastOnceWhileUnderConstruction == Enum99.BOBBYR_BEEN_TO_SITE_ONCE && LaptopSaveInfo.ubHaveBeenToBobbyRaysAtLeastOnceWhileUnderConstruction != Enum99.BOBBYR_ALREADY_SENT_EMAIL) {
        AddEmail(BOBBYR_NOW_OPEN, BOBBYR_NOW_OPEN_LENGTH, Enum75.BOBBY_R, GetWorldTotalMin());
        LaptopSaveInfo.ubHaveBeenToBobbyRaysAtLeastOnceWhileUnderConstruction = Enum99.BOBBYR_ALREADY_SENT_EMAIL;
      }
    }

    fWasEnemyControlled = StrategicMap[usMapSector].fEnemyControlled;

    StrategicMap[usMapSector].fEnemyControlled = FALSE;
    SectorInfo[SECTOR(sMapX, sMapY)].fPlayer[bMapZ] = TRUE;

    bTownId = StrategicMap[usMapSector].bNameId;

    // check if there's a town in the sector
    if ((bTownId >= FIRST_TOWN) && (bTownId < Enum135.NUM_TOWNS)) {
      // yes, start tracking (& displaying) this town's loyalty if not already doing so
      StartTownLoyaltyIfFirstTime(bTownId);
    }

    // if player took control away from enemy
    if (fWasEnemyControlled && fContested) {
      // and it's a town
      if ((bTownId >= FIRST_TOWN) && (bTownId < Enum135.NUM_TOWNS)) {
        // don't do these for takeovers of Omerta sectors at the beginning of the game
        if ((bTownId != Enum135.OMERTA) || (GetWorldDay() != 1)) {
          ubSectorID = SECTOR(sMapX, sMapY);
          if (!bMapZ && ubSectorID != Enum123.SEC_J9 && ubSectorID != Enum123.SEC_K4) {
            HandleMoraleEvent(NULL, Enum234.MORALE_TOWN_LIBERATED, sMapX, sMapY, bMapZ);
            HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_GAIN_TOWN_SECTOR, sMapX, sMapY, bMapZ);

            // liberation by definition requires that the place was enemy controlled in the first place
            CheckIfEntireTownHasBeenLiberated(bTownId, sMapX, sMapY);
          }
        }
      }

      // if it's a mine that's still worth something
      if (IsThereAMineInThisSector(sMapX, sMapY)) {
        if (GetTotalLeftInMine(GetMineIndexForSector(sMapX, sMapY)) > 0) {
          HandleMoraleEvent(NULL, Enum234.MORALE_MINE_LIBERATED, sMapX, sMapY, bMapZ);
          HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_GAIN_MINE, sMapX, sMapY, bMapZ);
        }
      }

      // if it's a SAM site sector
      if (IsThisSectorASAMSector(sMapX, sMapY, bMapZ)) {
        if (1 /*!GetSectorFlagStatus( sMapX, sMapY, bMapZ, SF_SECTOR_HAS_BEEN_LIBERATED_ONCE ) */) {
          // SAM site liberated for first time, schedule meanwhile
          HandleMeanWhileEventPostingForSAMLiberation(GetSAMIdFromSector(sMapX, sMapY, bMapZ));
        }

        HandleMoraleEvent(NULL, Enum234.MORALE_SAM_SITE_LIBERATED, sMapX, sMapY, bMapZ);
        HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_GAIN_SAM, sMapX, sMapY, bMapZ);

        // if Skyrider has been delivered to chopper, and already mentioned Drassen SAM site, but not used this quote yet
        if (IsHelicopterPilotAvailable() && (guiHelicopterSkyriderTalkState >= 1) && (!gfSkyriderSaidCongratsOnTakingSAM)) {
          SkyRiderTalk(SAM_SITE_TAKEN);
          gfSkyriderSaidCongratsOnTakingSAM = TRUE;
        }

        if (!SectorInfo[SECTOR(sMapX, sMapY)].fSurfaceWasEverPlayerControlled) {
          // grant grace period
          if (gGameOptions.ubDifficultyLevel >= Enum9.DIF_LEVEL_HARD) {
            UpdateLastDayOfPlayerActivity((GetWorldDay() + 2));
          } else {
            UpdateLastDayOfPlayerActivity((GetWorldDay() + 1));
          }
        }
      }

      // if it's a helicopter refueling site sector
      if (IsRefuelSiteInSector(sMapX, sMapY)) {
        UpdateRefuelSiteAvailability();
      }

      //			SetSectorFlag( sMapX, sMapY, bMapZ, SF_SECTOR_HAS_BEEN_LIBERATED_ONCE );
      if (bMapZ == 0 && ((sMapY == MAP_ROW_M && (sMapX >= 2 && sMapX <= 6)) || sMapY == MAP_ROW_N && sMapX == 6)) {
        HandleOutskirtsOfMedunaMeanwhileScene();
      }
    }

    if (fContested) {
      StrategicHandleQueenLosingControlOfSector(sMapX, sMapY, bMapZ);
    }
  } else {
    if (sMapX == 3 && sMapY == 16 && bMapZ == 1) {
      // Basement sector (P3_b1)
      gfUseAlternateQueenPosition = TRUE;
    }
  }

  // also set fact the player knows they own it
  SectorInfo[SECTOR(sMapX, sMapY)].fPlayer[bMapZ] = TRUE;

  if (bMapZ == 0) {
    SectorInfo[SECTOR(sMapX, sMapY)].fSurfaceWasEverPlayerControlled = TRUE;
  }

  // KM : Aug 11, 1999 -- Patch fix:  Relocated this check so it gets called everytime a sector changes hands,
  //     even if the sector isn't a SAM site.  There is a bug _somewhere_ that fails to update the airspace,
  //     even though the player controls it.
  UpdateAirspaceControl();

  // redraw map/income if in mapscreen
  fMapPanelDirty = TRUE;
  fMapScreenBottomDirty = TRUE;

  return fWasEnemyControlled;
}

// ALL changes of control to enemy must be funneled through here!
function SetThisSectorAsEnemyControlled(sMapX: INT16, sMapY: INT16, bMapZ: INT8, fContested: BOOLEAN): BOOLEAN {
  let usMapSector: UINT16 = 0;
  let fWasPlayerControlled: BOOLEAN = FALSE;
  let bTownId: INT8 = 0;
  let ubTheftChance: UINT8;
  let ubSectorID: UINT8;

  // KM : August 6, 1999 Patch fix
  //     This check was added because this function gets called when player mercs retreat from an unresolved
  //     battle between militia and enemies.  It will get called again AFTER autoresolve is finished.
  if (gfAutomaticallyStartAutoResolve) {
    return FALSE;
  }

  if (bMapZ == 0) {
    usMapSector = sMapX + (sMapY * MAP_WORLD_X);

    fWasPlayerControlled = !StrategicMap[usMapSector].fEnemyControlled;

    StrategicMap[usMapSector].fEnemyControlled = TRUE;

    // if player lost control to the enemy
    if (fWasPlayerControlled) {
      if (PlayerMercsInSector(sMapX, sMapY, bMapZ)) {
        // too premature:  Player mercs still in sector.
        return FALSE;
      }

      // check if there's a town in the sector
      bTownId = StrategicMap[usMapSector].bNameId;

      SectorInfo[SECTOR(sMapX, sMapY)].fPlayer[bMapZ] = FALSE;

      // and it's a town
      if ((bTownId >= FIRST_TOWN) && (bTownId < Enum135.NUM_TOWNS)) {
        ubSectorID = SECTOR(sMapX, sMapY);
        if (!bMapZ && ubSectorID != Enum123.SEC_J9 && ubSectorID != Enum123.SEC_K4) {
          HandleMoraleEvent(NULL, Enum234.MORALE_TOWN_LOST, sMapX, sMapY, bMapZ);
          HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_LOSE_TOWN_SECTOR, sMapX, sMapY, bMapZ);

          CheckIfEntireTownHasBeenLost(bTownId, sMapX, sMapY);
        }
      }

      // if the sector has a mine which is still worth something
      if (IsThereAMineInThisSector(sMapX, sMapY)) {
        // if it isn't empty
        if (GetTotalLeftInMine(GetMineIndexForSector(sMapX, sMapY)) > 0) {
          QueenHasRegainedMineSector(GetMineIndexForSector(sMapX, sMapY));
          HandleMoraleEvent(NULL, Enum234.MORALE_MINE_LOST, sMapX, sMapY, bMapZ);
          HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_LOSE_MINE, sMapX, sMapY, bMapZ);
        }
      }

      // if it's a SAM site sector
      if (IsThisSectorASAMSector(sMapX, sMapY, bMapZ)) {
        HandleMoraleEvent(NULL, Enum234.MORALE_SAM_SITE_LOST, sMapX, sMapY, bMapZ);
        HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_LOSE_SAM, sMapX, sMapY, bMapZ);
      }

      // if it's a helicopter refueling site sector
      if (IsRefuelSiteInSector(sMapX, sMapY)) {
        UpdateRefuelSiteAvailability();
      }

      // ARM: this must be AFTER all resulting loyalty effects are resolved, or reduced mine income shown won't be accurate
      NotifyPlayerWhenEnemyTakesControlOfImportantSector(sMapX, sMapY, 0, fContested);
    }

    // NOTE: Stealing is intentionally OUTSIDE the fWasPlayerControlled branch.  This function gets called if new
    // enemy reinforcements arrive, and they deserve another crack at stealing what the first group missed! :-)

    // stealing should fail anyway 'cause there shouldn't be a temp file for unvisited sectors, but let's check anyway
    if (GetSectorFlagStatus(sMapX, sMapY, bMapZ, SF_ALREADY_VISITED) == TRUE) {
      // enemies can steal items left lying about (random chance).  The more there are, the more they take!
      ubTheftChance = 5 * NumEnemiesInAnySector(sMapX, sMapY, bMapZ);
      // max 90%, some stuff may just simply not get found
      if (ubTheftChance > 90) {
        ubTheftChance = 90;
      }
      RemoveRandomItemsInSector(sMapX, sMapY, bMapZ, ubTheftChance);
    }

    // don't touch fPlayer flag for a surface sector lost to the enemies!
    // just because player has lost the sector doesn't mean he realizes it - that's up to our caller to decide!
  } else {
    // underground sector control is always up to date, because we don't track control down there
    SectorInfo[SECTOR(sMapX, sMapY)].fPlayer[bMapZ] = FALSE;
  }

  // KM : Aug 11, 1999 -- Patch fix:  Relocated this check so it gets called everytime a sector changes hands,
  //     even if the sector isn't a SAM site.  There is a bug _somewhere_ that fails to update the airspace,
  //     even though the player controls it.
  UpdateAirspaceControl();

  // redraw map/income if in mapscreen
  fMapPanelDirty = TRUE;
  fMapScreenBottomDirty = TRUE;

  return fWasPlayerControlled;
}

/*
BOOLEAN IsTheSectorPerceivedToBeUnderEnemyControl( INT16 sMapX, INT16 sMapY, INT8 bMapZ )
{

        // are we in battle in this sector?
        if( ( sMapX == gWorldSectorX ) && ( sMapY == gWorldSectorY ) && ( bMapZ == gbWorldSectorZ ) && ( gTacticalStatus.uiFlags & INCOMBAT ) )
        {
                return( TRUE );
        }


        // does the player believe this sector is under enemy control?
        return( !( SectorInfo[ SECTOR( sMapX, sMapY ) ].fPlayer[ bMapZ ] ) );
}


void MakePlayerPerceptionOfSectorControlCorrect( INT16 sMapX, INT16 sMapY, INT8 bMapZ )
{
        if (bMapZ == 0)
        {
                SectorInfo[ SECTOR( sMapX, sMapY ) ].fPlayer[ bMapZ ] = !( StrategicMap[ CALCULATE_STRATEGIC_INDEX( sMapX, sMapY ) ].fEnemyControlled );
        }
        // else nothing, underground sector control is always up to date, because we don't track control down there

        fMapPanelDirty = TRUE;
}
*/

function ReplaceSoldierProfileInPlayerGroup(ubGroupID: UINT8, ubOldProfile: UINT8, ubNewProfile: UINT8): void {
  let pGroup: Pointer<GROUP>;
  let curr: Pointer<PLAYERGROUP>;

  pGroup = GetGroup(ubGroupID);

  if (!pGroup) {
    return;
  }

  curr = pGroup.value.pPlayerList;

  while (curr) {
    if (curr.value.ubProfileID == ubOldProfile) {
      // replace and return!
      curr.value.ubProfileID = ubNewProfile;
      return;
    }
    curr = curr.value.next;
  }
}
