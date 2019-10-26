// width of the slider bar region
const BAR_WIDTH = 423 - 197;

// width of the slider bar itself
const SLIDER_BAR_WIDTH = 37;

// the sizeof one skill unit on the sliding bar in pixels
const BASE_SKILL_PIXEL_UNIT_SIZE = ((423 - 230));

const enum Enum84 {
  HEALTH_ATTRIBUTE,
  DEXTERITY_ATTRIBUTE,
  AGILITY_ATTRIBUTE,
  STRENGTH_ATTRIBUTE,
  WISDOM_ATTRIBUTE,
  LEADERSHIP_ATTRIBUTE,
  MARKSMANSHIP_SKILL,
  EXPLOSIVE_SKILL,
  MEDICAL_SKILL,
  MECHANICAL_SKILL,
}

const enum Enum85 {
  SLIDER_ERROR,
  SLIDER_OK,
  SLIDER_OUT_OF_RANGE,
}

// the skills as they stand
let iCurrentStrength: INT32 = 55;
let iCurrentAgility: INT32 = 55;
let iCurrentDexterity: INT32 = 55;
let iCurrentHealth: INT32 = 55;
let iCurrentLeaderShip: INT32 = 55;
let iCurrentWisdom: INT32 = 55;
let iCurrentMarkmanship: INT32 = 55;
let iCurrentMechanical: INT32 = 55;
let iCurrentMedical: INT32 = 55;
let iCurrentExplosives: INT32 = 55;

// which stat is message about stat at zero about
let iCurrentStatAtZero: INT32 = 0;

// total number of bonus points
let iCurrentBonusPoints: INT32 = 40;

// diplsay the 0 skill point warning..if skill set to 0, warn character
let fSkillAtZeroWarning: boolean = false;

// is the sliding of the sliding bar active right now?
let fSlideIsActive: boolean = true;

// first time in game
export let fFirstIMPAttribTime: boolean = true;

// review mode
export let fReviewStats: boolean = false;

// buttons
let giIMPAttributeSelectionButton: UINT32[] /* [1] */;
let giIMPAttributeSelectionButtonImage: UINT32[] /* [1] */;

// slider buttons
let giIMPAttributeSelectionSliderButton: UINT32[] /* [20] */;
let giIMPAttributeSelectionSliderButtonImage: UINT32[] /* [20] */;

// mouse regions
let pSliderRegions: MOUSE_REGION[] /* [10] */;
let pSliderBarRegions: MOUSE_REGION[] /* [10] */;

// The currently "anchored scroll bar"
let gpCurrentScrollBox: Pointer<MOUSE_REGION> = null;
let giCurrentlySelectedStat: INT32 = -1;

// has any of the sliding bars moved?...for re-rendering puposes
let fHasAnySlidingBarMoved: boolean = false;

let uiBarToReRender: INT32 = -1;

// are we actually coming back to edit, or are we restarting?
export let fReturnStatus: boolean = false;

export function EnterIMPAttributeSelection(): void {
  // set attributes and skills
  if ((fReturnStatus == false) && (fFirstIMPAttribTime == true)) {
    // re starting
    SetAttributes();

    gpCurrentScrollBox = null;
    giCurrentlySelectedStat = -1;

    // does character have PROBLEMS!!?!?!
    /*
if( DoesCharacterHaveAnAttitude() )
    {
iCurrentBonusPoints+= 10;
    }
if( DoesCharacterHaveAPersoanlity( ) )
    {
      iCurrentBonusPoints += 10;
    }
    */
  }
  fReturnStatus = true;
  fFirstIMPAttribTime = false;

  // create done button
  CreateIMPAttributeSelectionButtons();
  // create clider buttons
  CreateAttributeSliderButtons();

  // the mouse regions
  CreateSlideRegionMouseRegions();
  // CreateSliderBarMouseRegions( );

  // render background
  RenderIMPAttributeSelection();

  return;
}

function RenderIMPAlteredAttribute(): void {
}
export function RenderIMPAttributeSelection(): void {
  // the background
  RenderProfileBackGround();

  // attribute frame
  RenderAttributeFrame(51, 87);

  // render attribute boxes
  RenderAttributeBoxes();

  RenderAttrib1IndentFrame(51, 30);

  if (fReviewStats != true) {
    RenderAttrib2IndentFrame(350, 42);
  }

  // reset rerender flag
  fHasAnySlidingBarMoved = false;

  // print text for screen
  PrintImpText();

  // amt of bonus pts
  DrawBonusPointsRemaining();

  return;
}

export function ExitIMPAttributeSelection(): void {
  // get rid of slider buttons
  DestroyAttributeSliderButtons();

  // the mouse regions
  DestroySlideRegionMouseRegions();
  // DestroySlideBarMouseRegions( );

  // get rid of done buttons
  DestroyIMPAttributeSelectionButtons();

  fReturnStatus = false;

  return;
}

export function HandleIMPAttributeSelection(): void {
  // review mode, do not allow changes
  if (fReviewStats) {
    return;
  }

  // set the currently selectd slider bar
  if (gfLeftButtonState && gpCurrentScrollBox != null) {
    // if theuser is holding down the mouse cursor to left of the start of the slider bars
    if (gusMouseXPos < (SKILL_SLIDE_START_X + LAPTOP_SCREEN_UL_X)) {
      DecrementStat(giCurrentlySelectedStat);
    }

    // else if the user is holding down the mouse button to the right of the scroll bars
    else if (gusMouseXPos > (LAPTOP_SCREEN_UL_X + SKILL_SLIDE_START_X + BAR_WIDTH)) {
      IncrementStat(giCurrentlySelectedStat);
    } else {
      let iCurrentAttributeValue: INT32;
      let sNewX: INT32 = gusMouseXPos;
      let iNewValue: INT32;
      let iCounter: INT32;

      // get old stat value
      iCurrentAttributeValue = GetCurrentAttributeValue(giCurrentlySelectedStat);
      sNewX = sNewX - (SKILL_SLIDE_START_X + LAPTOP_SCREEN_UL_X);
      iNewValue = (sNewX * 50) / BASE_SKILL_PIXEL_UNIT_SIZE + 35;

      // chenged, move mouse region if change large enough
      if (iCurrentAttributeValue != iNewValue) {
        // update screen
        fHasAnySlidingBarMoved = true;
      }

      // change is enough
      if (iNewValue - iCurrentAttributeValue > 0) {
        // positive, increment stat
        iCounter = iNewValue - iCurrentAttributeValue;
        for (iCounter; iCounter > 0; iCounter--) {
          IncrementStat(giCurrentlySelectedStat);
        }
      } else {
        // negative, decrement stat
        iCounter = iCurrentAttributeValue - iNewValue;
        for (iCounter; iCounter > 0; iCounter--) {
          DecrementStat(giCurrentlySelectedStat);
        }
      }
    }

    RenderIMPAttributeSelection();
  } else {
    gpCurrentScrollBox = null;
    giCurrentlySelectedStat = -1;
  }

  // prcoess current state of attributes
  ProcessAttributes();

  // has any bar moved?
  if (fHasAnySlidingBarMoved) {
    // render
    if (uiBarToReRender == -1) {
      RenderIMPAttributeSelection();
    } else {
      RenderAttributeFrameForIndex(51, 87, uiBarToReRender);
      /*
      // print text for screen
      PrintImpText( );

      // amt of bonus pts
      DrawBonusPointsRemaining( );

      RenderAttributeFrame( 51, 87 );

      // render attribute boxes
      RenderAttributeBoxes( );

      PrintImpText( );

      InvalidateRegion( LAPTOP_SCREEN_UL_X + 51, LAPTOP_SCREEN_WEB_UL_Y + 87, LAPTOP_SCREEN_UL_X + 51 + 400, LAPTOP_SCREEN_WEB_UL_Y + 87 + 220 );
*/
      uiBarToReRender = -1;
      MarkButtonsDirty();
    }

    fHasAnySlidingBarMoved = false;
  }
  if (fSkillAtZeroWarning == true) {
    DoLapTopMessageBox(Enum24.MSG_BOX_IMP_STYLE, pSkillAtZeroWarning[0], Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_YESNO, StatAtZeroBoxCallBack);
    fSkillAtZeroWarning = false;
  }
  return;
}

function ProcessAttributes(): void {
  // this function goes through and confirms thet state of attributes, ie not allowing attributes to
  // drop below 35 or skills to go below 0...and if skill is 34 set to 0

  // check any attribute below 35

  // strength
  if (iCurrentStrength <= 35) {
    iCurrentStrength = 35;
    // disable button too
  }

  // dex
  if (iCurrentDexterity <= 35) {
    iCurrentDexterity = 35;
    // disable button too
  }

  // agility
  if (iCurrentAgility <= 35) {
    iCurrentAgility = 35;
    // disable button too
  }

  // wisdom
  if (iCurrentWisdom <= 35) {
    iCurrentWisdom = 35;
    // disable button too
  }

  // leadership
  if (iCurrentLeaderShip <= 35) {
    iCurrentLeaderShip = 35;
    // disable button too
  }

  // health
  if (iCurrentHealth <= 35) {
    iCurrentHealth = 35;
    // disable button too
  }

  // now check for above 85
  // strength
  if (iCurrentStrength >= 85) {
    iCurrentStrength = 85;
    // disable button too
  }

  // dex
  if (iCurrentDexterity >= 85) {
    iCurrentDexterity = 85;
    // disable button too
  }

  // agility
  if (iCurrentAgility >= 85) {
    iCurrentAgility = 85;
    // disable button too
  }

  // wisdom
  if (iCurrentWisdom >= 85) {
    iCurrentWisdom = 85;
    // disable button too
  }

  // leadership
  if (iCurrentLeaderShip >= 85) {
    iCurrentLeaderShip = 85;
    // disable button too
  }

  // health
  if (iCurrentHealth >= 85) {
    iCurrentHealth = 85;
    // disable button too
  }

  return;
}

function IncrementStat(iStatToIncrement: INT32): UINT8 {
  // this function is responsable for incrementing a stat

  // review mode, do not allow changes
  if (fReviewStats) {
    return Enum85.SLIDER_ERROR;
  }

  // make sure we have enough bonus points
  if (iCurrentBonusPoints < 1) {
    // nope...GO GET SOME BONUS POINTS, IDIOT!
    return Enum85.SLIDER_ERROR;
  }

  // check to make sure stat isn't maxed out already
  switch (iStatToIncrement) {
    case (Enum84.STRENGTH_ATTRIBUTE):
      if (iCurrentStrength > 84) {
        // too high, leave
        return Enum85.SLIDER_OUT_OF_RANGE;
      } else {
        iCurrentStrength++;
        iCurrentBonusPoints--;
      }
      break;
    case (Enum84.DEXTERITY_ATTRIBUTE):
      if (iCurrentDexterity > 84) {
        // too high, leave
        return Enum85.SLIDER_OUT_OF_RANGE;
      } else {
        iCurrentDexterity++;
        iCurrentBonusPoints--;
      }
      break;
    case (Enum84.AGILITY_ATTRIBUTE):
      if (iCurrentAgility > 84) {
        // too high, leave
        return Enum85.SLIDER_OUT_OF_RANGE;
      } else {
        iCurrentAgility++;
        iCurrentBonusPoints--;
      }
      break;
    case (Enum84.LEADERSHIP_ATTRIBUTE):
      if (iCurrentLeaderShip > 84) {
        // too high, leave
        return Enum85.SLIDER_OUT_OF_RANGE;
      } else {
        iCurrentLeaderShip++;
        iCurrentBonusPoints--;
      }
      break;
    case (Enum84.WISDOM_ATTRIBUTE):
      if (iCurrentWisdom > 84) {
        // too high, leave
        return Enum85.SLIDER_OUT_OF_RANGE;
      } else {
        iCurrentWisdom++;
        iCurrentBonusPoints--;
      }
      break;
    case (Enum84.HEALTH_ATTRIBUTE):
      if (iCurrentHealth > 84) {
        // too high, leave
        return Enum85.SLIDER_OUT_OF_RANGE;
      } else {
        iCurrentHealth++;
        iCurrentBonusPoints--;
      }
      break;
    case (Enum84.MARKSMANSHIP_SKILL):
      if (iCurrentMarkmanship > 84) {
        // too high, leave
        return Enum85.SLIDER_OUT_OF_RANGE;
      } else {
        if (iCurrentMarkmanship == 0) {
          if (DoWeHaveThisManyBonusPoints(15) == true) {
            iCurrentMarkmanship += 35;
            iCurrentBonusPoints -= 15;
            fSkillAtZeroWarning = false;
          } else {
            return Enum85.SLIDER_OK;
          }
        } else {
          iCurrentMarkmanship++;
          iCurrentBonusPoints--;
        }
      }
      break;
    case (Enum84.MECHANICAL_SKILL):
      if (iCurrentMechanical > 84) {
        // too high, leave
        return Enum85.SLIDER_OUT_OF_RANGE;
      } else {
        if (iCurrentMechanical == 0) {
          if (DoWeHaveThisManyBonusPoints(15) == true) {
            iCurrentMechanical += 35;
            iCurrentBonusPoints -= 15;
            fSkillAtZeroWarning = false;
          } else {
            return Enum85.SLIDER_OK;
          }
        } else {
          iCurrentMechanical++;
          iCurrentBonusPoints--;
        }
      }
      break;
    case (Enum84.MEDICAL_SKILL):
      if (iCurrentMedical > 84) {
        // too high, leave
        return Enum85.SLIDER_OUT_OF_RANGE;
      } else {
        if (iCurrentMedical == 0) {
          if (DoWeHaveThisManyBonusPoints(15) == true) {
            iCurrentMedical += 35;
            iCurrentBonusPoints -= 15;
            fSkillAtZeroWarning = false;
          } else {
            return Enum85.SLIDER_OK;
          }
        } else {
          iCurrentMedical++;
          iCurrentBonusPoints--;
        }
      }
      break;
    case (Enum84.EXPLOSIVE_SKILL):
      if (iCurrentExplosives > 84) {
        // too high, leave
        return Enum85.SLIDER_OUT_OF_RANGE;
      } else {
        if (iCurrentExplosives == 0) {
          if (DoWeHaveThisManyBonusPoints(15) == true) {
            iCurrentExplosives += 35;
            iCurrentBonusPoints -= 15;
            fSkillAtZeroWarning = false;
          } else {
            return Enum85.SLIDER_OK;
          }
        } else {
          iCurrentExplosives++;
          iCurrentBonusPoints--;
        }
      }
      break;
  }

  return Enum85.SLIDER_OK;
}

function DecrementStat(iStatToDecrement: INT32): UINT8 {
  // review mode, do not allow changes
  if (fReviewStats) {
    return Enum85.SLIDER_ERROR;
  }

  // decrement a stat
  // check to make sure stat isn't maxed out already
  switch (iStatToDecrement) {
    case (Enum84.STRENGTH_ATTRIBUTE):
      if (iCurrentStrength > 35) {
        // ok to decrement
        iCurrentStrength--;
        iCurrentBonusPoints++;
      } else {
        return Enum85.SLIDER_OUT_OF_RANGE;
      }
      break;
    case (Enum84.DEXTERITY_ATTRIBUTE):
      if (iCurrentDexterity > 35) {
        // ok to decrement
        iCurrentDexterity--;
        iCurrentBonusPoints++;
      } else {
        return Enum85.SLIDER_OUT_OF_RANGE;
      }
      break;
    case (Enum84.AGILITY_ATTRIBUTE):
      if (iCurrentAgility > 35) {
        // ok to decrement
        iCurrentAgility--;
        iCurrentBonusPoints++;
      } else {
        return Enum85.SLIDER_OUT_OF_RANGE;
      }
      break;
    case (Enum84.WISDOM_ATTRIBUTE):
      if (iCurrentWisdom > 35) {
        // ok to decrement
        iCurrentWisdom--;
        iCurrentBonusPoints++;
      } else {
        return Enum85.SLIDER_OUT_OF_RANGE;
      }
      break;
    case (Enum84.LEADERSHIP_ATTRIBUTE):
      if (iCurrentLeaderShip > 35) {
        // ok to decrement
        iCurrentLeaderShip--;
        iCurrentBonusPoints++;
      } else {
        return Enum85.SLIDER_OUT_OF_RANGE;
      }
      break;
    case (Enum84.HEALTH_ATTRIBUTE):
      if (iCurrentHealth > 35) {
        // ok to decrement
        iCurrentHealth--;
        iCurrentBonusPoints++;
      } else {
        return Enum85.SLIDER_OUT_OF_RANGE;
      }
      break;
    case (Enum84.MARKSMANSHIP_SKILL):
      if (iCurrentMarkmanship > 35) {
        // ok to decrement
        iCurrentMarkmanship--;
        iCurrentBonusPoints++;
      } else if (iCurrentMarkmanship == 35) {
        // ok to decrement
        iCurrentMarkmanship -= 35;
        iCurrentBonusPoints += 15;
        fSkillAtZeroWarning = true;
      }
      break;
    case (Enum84.MEDICAL_SKILL):
      if (iCurrentMedical > 35) {
        // ok to decrement
        iCurrentMedical--;
        iCurrentBonusPoints++;
      } else if (iCurrentMedical == 35) {
        // ok to decrement
        iCurrentMedical -= 35;
        iCurrentBonusPoints += 15;
        fSkillAtZeroWarning = true;
      }
      break;
    case (Enum84.MECHANICAL_SKILL):
      if (iCurrentMechanical > 35) {
        // ok to decrement
        iCurrentMechanical--;
        iCurrentBonusPoints++;
      } else if (iCurrentMechanical == 35) {
        // ok to decrement
        iCurrentMechanical -= 35;
        iCurrentBonusPoints += 15;
        fSkillAtZeroWarning = true;
      }
      break;
    case (Enum84.EXPLOSIVE_SKILL):
      if (iCurrentExplosives > 35) {
        // ok to decrement
        iCurrentExplosives--;
        iCurrentBonusPoints++;
      } else if (iCurrentExplosives == 35) {
        // ok to decrement
        iCurrentExplosives -= 35;
        iCurrentBonusPoints += 15;
        fSkillAtZeroWarning = true;
      }
      break;
  }

  if (fSkillAtZeroWarning == true) {
    // current stat at zero
    iCurrentStatAtZero = iStatToDecrement;
  }

  return Enum85.SLIDER_OK;
}

function DoWeHaveThisManyBonusPoints(iBonusPoints: INT32): boolean {
  // returns if player has at least this many bonus points
  if (iCurrentBonusPoints >= iBonusPoints) {
    // yep, return true
    return true;
  } else {
    // nope, return false
    return false;
  }
}

function CreateIMPAttributeSelectionButtons(): void {
  // the finished button
  giIMPAttributeSelectionButtonImage[0] = LoadButtonImage("LAPTOP\\button_2.sti", -1, 0, -1, 1, -1);
  /*	giIMPAttributeSelectionButton[0] = QuickCreateButton( giIMPAttributeSelectionButtonImage[0], LAPTOP_SCREEN_UL_X +  ( 136 ), LAPTOP_SCREEN_WEB_UL_Y + ( 314 ),
                                                                                  BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                                  BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPAttributeFinishCallback );
    */
  giIMPAttributeSelectionButton[0] = CreateIconAndTextButton(giIMPAttributeSelectionButtonImage[0], pImpButtonText[11], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (136), LAPTOP_SCREEN_WEB_UL_Y + (314), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPAttributeFinishCallback);

  SetButtonCursor(giIMPAttributeSelectionButton[0], Enum317.CURSOR_WWW);
  return;
}

function DestroyIMPAttributeSelectionButtons(): void {
  // this function will destroy the buttons needed for the IMP attrib enter page

  // the begin  button
  RemoveButton(giIMPAttributeSelectionButton[0]);
  UnloadButtonImage(giIMPAttributeSelectionButtonImage[0]);

  return;
}

function BtnIMPAttributeFinishCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP attrbite begin button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      // are we done diting, or just reviewing the stats?
      if (fReviewStats == true) {
        iCurrentImpPage = Enum71.IMP_FINISH;
      } else {
        iCurrentImpPage = Enum71.IMP_ATTRIBUTE_FINISH;
      }
      fButtonPendingFlag = true;
    }
  }
}

export function RenderAttributeBoxes(): void {
  // this function will render the boxes in the sliding attribute bar, based on position
  let iCnt: INT32 = Enum84.STRENGTH_ATTRIBUTE;
  let sX: INT16 = 0;
  let sY: INT16 = 0;
  let sTempY: INT16 = 0;
  let sTempX: INT16 = 0;
  let sString: CHAR16[] /* [3] */;

  // set last char to null
  sString[2] = 0;

  // font stuff
  SetFont(FONT10ARIAL());
  SetFontShadow(NO_SHADOW);
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);

  // run through and render each slider bar
  for (iCnt = Enum84.HEALTH_ATTRIBUTE; iCnt <= Enum84.MECHANICAL_SKILL; iCnt++) {
    // position is  ( width *  ( stat - 35 ) ) /50]
    // unless 0, then it is 0 - for skills

    // get y position
    sY = SKILL_SLIDE_START_Y + SKILL_SLIDE_HEIGHT * (iCnt);

    switch (iCnt) {
      case (Enum84.STRENGTH_ATTRIBUTE):
        // blt in strength slider
        sX = ((iCurrentStrength - 35) * BASE_SKILL_PIXEL_UNIT_SIZE) / 50;
        sX += SKILL_SLIDE_START_X;
        RenderSliderBar(sX, sY);

        // set sliderbar mouse region
        MSYS_MoveMouseRegionTo(addressof(pSliderBarRegions[iCnt]), (sX + LAPTOP_SCREEN_UL_X), (sY + LAPTOP_SCREEN_WEB_UL_Y));

        // the text
        swprintf(sString, "%d", iCurrentStrength);
        sX += LAPTOP_SCREEN_UL_X;
        sY += LAPTOP_SCREEN_WEB_UL_Y;
        mprintf(sX + 13, sY + 3, sString);
        break;
      case (Enum84.DEXTERITY_ATTRIBUTE):
        // blt in strength slider
        sX = ((iCurrentDexterity - 35) * BASE_SKILL_PIXEL_UNIT_SIZE) / 50;
        sX += SKILL_SLIDE_START_X;
        RenderSliderBar(sX, sY);

        // set sliderbar mouse region
        MSYS_MoveMouseRegionTo(addressof(pSliderBarRegions[iCnt]), (sX + LAPTOP_SCREEN_UL_X), (sY + LAPTOP_SCREEN_WEB_UL_Y));

        // the text
        swprintf(sString, "%d", iCurrentDexterity);
        sX += LAPTOP_SCREEN_UL_X;
        sY += LAPTOP_SCREEN_WEB_UL_Y;
        mprintf(sX + 13, sY + 3, sString);

        break;
      case (Enum84.AGILITY_ATTRIBUTE):
        // blt in strength slider
        sX = ((iCurrentAgility - 35) * BASE_SKILL_PIXEL_UNIT_SIZE) / 50;
        sX += SKILL_SLIDE_START_X;
        RenderSliderBar(sX, sY);

        // set sliderbar mouse region
        MSYS_MoveMouseRegionTo(addressof(pSliderBarRegions[iCnt]), (sX + LAPTOP_SCREEN_UL_X), (sY + LAPTOP_SCREEN_WEB_UL_Y));

        // the text
        swprintf(sString, "%d", iCurrentAgility);
        sX += LAPTOP_SCREEN_UL_X;
        sY += LAPTOP_SCREEN_WEB_UL_Y;
        mprintf(sX + 13, sY + 3, sString);

        break;
      case (Enum84.WISDOM_ATTRIBUTE):
        // blt in strength slider
        sX = ((iCurrentWisdom - 35) * BASE_SKILL_PIXEL_UNIT_SIZE) / 50;
        sX += SKILL_SLIDE_START_X;
        RenderSliderBar(sX, sY);

        // set sliderbar mouse region
        MSYS_MoveMouseRegionTo(addressof(pSliderBarRegions[iCnt]), (sX + LAPTOP_SCREEN_UL_X), (sY + LAPTOP_SCREEN_WEB_UL_Y));

        // the text
        swprintf(sString, "%d", iCurrentWisdom);
        sX += LAPTOP_SCREEN_UL_X;
        sY += LAPTOP_SCREEN_WEB_UL_Y;
        mprintf(sX + 13, sY + 3, sString);
        break;
      case (Enum84.LEADERSHIP_ATTRIBUTE):
        // blt in strength slider
        sX = ((iCurrentLeaderShip - 35) * BASE_SKILL_PIXEL_UNIT_SIZE) / 50;
        sX += SKILL_SLIDE_START_X;
        RenderSliderBar(sX, sY);
        // set sliderbar mouse region
        MSYS_MoveMouseRegionTo(addressof(pSliderBarRegions[iCnt]), (sX + LAPTOP_SCREEN_UL_X), (sY + LAPTOP_SCREEN_WEB_UL_Y));

        // the text
        swprintf(sString, "%d", iCurrentLeaderShip);
        sX += LAPTOP_SCREEN_UL_X;
        sY += LAPTOP_SCREEN_WEB_UL_Y;
        mprintf(sX + 13, sY + 3, sString);
        break;
      case (Enum84.HEALTH_ATTRIBUTE):
        // blt in health slider
        sX = ((iCurrentHealth - 35) * BASE_SKILL_PIXEL_UNIT_SIZE) / 50;
        sX += SKILL_SLIDE_START_X;
        RenderSliderBar(sX, sY);

        // set sliderbar mouse region
        MSYS_MoveMouseRegionTo(addressof(pSliderBarRegions[iCnt]), (sX + LAPTOP_SCREEN_UL_X), (sY + LAPTOP_SCREEN_WEB_UL_Y));

        // the text
        swprintf(sString, "%d", iCurrentHealth);
        sY += LAPTOP_SCREEN_WEB_UL_Y;
        sX += LAPTOP_SCREEN_UL_X;
        mprintf(sX + 13, sY + 3, sString);
        break;
      case (Enum84.MARKSMANSHIP_SKILL):
        // blt in marksmanship slider

        sX = ((iCurrentMarkmanship - 35) * BASE_SKILL_PIXEL_UNIT_SIZE) / 50;
        // if less than zero..a zero'ed skill...reset to zero
        if (sX < 0) {
          sX = 0;
        }

        sX += SKILL_SLIDE_START_X;
        RenderSliderBar(sX, sY);
        // set sliderbar mouse region
        MSYS_MoveMouseRegionTo(addressof(pSliderBarRegions[iCnt]), (sX + LAPTOP_SCREEN_UL_X), (sY + LAPTOP_SCREEN_WEB_UL_Y));

        // the text
        swprintf(sString, "%d", iCurrentMarkmanship);
        sY += LAPTOP_SCREEN_WEB_UL_Y;
        sX += LAPTOP_SCREEN_UL_X;
        mprintf(sX + 13, sY + 3, sString);
        break;
      case (Enum84.MEDICAL_SKILL):
        // blt in medical slider

        sX = ((iCurrentMedical - 35) * BASE_SKILL_PIXEL_UNIT_SIZE) / 50;
        // if less than zero..a zero'ed skill...reset to zero
        if (sX < 0) {
          sX = 0;
        }

        sX += SKILL_SLIDE_START_X;
        RenderSliderBar(sX, sY);

        // set sliderbar mouse region
        MSYS_MoveMouseRegionTo(addressof(pSliderBarRegions[iCnt]), (sX + LAPTOP_SCREEN_UL_X), (sY + LAPTOP_SCREEN_WEB_UL_Y));

        // the text
        swprintf(sString, "%d", iCurrentMedical);
        sY += LAPTOP_SCREEN_WEB_UL_Y;
        sX += LAPTOP_SCREEN_UL_X;
        mprintf(sX + 13, sY + 3, sString);
        break;
      case (Enum84.MECHANICAL_SKILL):
        // blt in mech slider

        sX = ((iCurrentMechanical - 35) * BASE_SKILL_PIXEL_UNIT_SIZE) / 50;
        // if less than zero..a zero'ed skill...reset to zero
        if (sX < 0) {
          sX = 0;
        }

        sX += SKILL_SLIDE_START_X;
        RenderSliderBar(sX, sY);

        // set sliderbar mouse region
        MSYS_MoveMouseRegionTo(addressof(pSliderBarRegions[iCnt]), (sX + LAPTOP_SCREEN_UL_X), (sY + LAPTOP_SCREEN_WEB_UL_Y));

        // the text
        swprintf(sString, "%d", iCurrentMechanical);
        sY += LAPTOP_SCREEN_WEB_UL_Y;
        sX += LAPTOP_SCREEN_UL_X;
        mprintf(sX + 13, sY + 3, sString);
        break;
      case (Enum84.EXPLOSIVE_SKILL):
        // blt in explosive slider

        sX = ((iCurrentExplosives - 35) * BASE_SKILL_PIXEL_UNIT_SIZE) / 50;
        // if less than zero..a zero'ed skill...reset to zero
        if (sX < 0) {
          sX = 0;
        }

        sX += SKILL_SLIDE_START_X;
        RenderSliderBar(sX, sY);

        // set sliderbar mouse region
        MSYS_MoveMouseRegionTo(addressof(pSliderBarRegions[iCnt]), (sX + LAPTOP_SCREEN_UL_X), (sY + LAPTOP_SCREEN_WEB_UL_Y));

        // the text
        swprintf(sString, "%d", iCurrentExplosives);
        sY += LAPTOP_SCREEN_WEB_UL_Y;
        sX += LAPTOP_SCREEN_UL_X;
        mprintf(sX + 13, sY + 3, sString);
        break;
    }
  }

  // reset shadow
  SetFontShadow(DEFAULT_SHADOW);

  return;
}

function CreateAttributeSliderButtons(): void {
  // this function will create the buttons for the attribute slider
  // the finished button
  let iCounter: INT32 = 0;

  giIMPAttributeSelectionSliderButtonImage[0] = LoadButtonImage("LAPTOP\\AttributeArrows.sti", -1, 0, -1, 1, -1);
  giIMPAttributeSelectionSliderButtonImage[1] = LoadButtonImage("LAPTOP\\AttributeArrows.sti", -1, 3, -1, 4, -1);

  for (iCounter = 0; iCounter < 20; iCounter += 2) {
    // left button - decrement stat
    giIMPAttributeSelectionSliderButton[iCounter] = QuickCreateButton(giIMPAttributeSelectionSliderButtonImage[0], LAPTOP_SCREEN_UL_X + (163), (LAPTOP_SCREEN_WEB_UL_Y + (99 + iCounter / 2 * 20)), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, BtnIMPAttributeSliderLeftCallback);

    // right button - increment stat
    giIMPAttributeSelectionSliderButton[iCounter + 1] = QuickCreateButton(giIMPAttributeSelectionSliderButtonImage[1], LAPTOP_SCREEN_UL_X + (419), (LAPTOP_SCREEN_WEB_UL_Y + (99 + iCounter / 2 * 20)), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, BtnIMPAttributeSliderRightCallback);

    SetButtonCursor(giIMPAttributeSelectionSliderButton[iCounter], Enum317.CURSOR_WWW);
    SetButtonCursor(giIMPAttributeSelectionSliderButton[iCounter + 1], Enum317.CURSOR_WWW);
    // set user data
    MSYS_SetBtnUserData(giIMPAttributeSelectionSliderButton[iCounter], 0, iCounter / 2);
    MSYS_SetBtnUserData(giIMPAttributeSelectionSliderButton[iCounter + 1], 0, iCounter / 2);
  }

  MarkButtonsDirty();
}

function DestroyAttributeSliderButtons(): void {
  // this function will destroy the buttons used for attribute manipulation
  let iCounter: INT32 = 0;

  // get rid of image
  UnloadButtonImage(giIMPAttributeSelectionSliderButtonImage[0]);
  UnloadButtonImage(giIMPAttributeSelectionSliderButtonImage[1]);

  for (iCounter = 0; iCounter < 20; iCounter++) {
    // get rid of button
    RemoveButton(giIMPAttributeSelectionSliderButton[iCounter]);
  }

  return;
}

function BtnIMPAttributeSliderLeftCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let iValue: INT32 = -1;

  // btn callback for IMP personality quiz answer button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  iValue = MSYS_GetBtnUserData(btn, 0);

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT) {
    DecrementStat(iValue);
    // stat has changed, rerender
    fHasAnySlidingBarMoved = true;
    uiBarToReRender = iValue;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    DecrementStat(iValue);
    fHasAnySlidingBarMoved = true;
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
    uiBarToReRender = iValue;
  }

  else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
    }
  }
}

function BtnIMPAttributeSliderRightCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let iValue: INT32 = -1;

  // btn callback for IMP personality quiz answer button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  iValue = MSYS_GetBtnUserData(btn, 0);

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT) {
    IncrementStat(iValue);
    // stat has changed, rerender
    fHasAnySlidingBarMoved = true;
    uiBarToReRender = iValue;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    IncrementStat(iValue);
    fHasAnySlidingBarMoved = true;
    uiBarToReRender = iValue;
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  }

  else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
    }
  }
}

function CreateSlideRegionMouseRegions(): void {
  // this function will create that mouse regions on the sliding area, that, if the player clicks on, the bar will automatically jump to
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < 10; iCounter++) {
    // define the region
    MSYS_DefineRegion(addressof(pSliderRegions[iCounter]), (SKILL_SLIDE_START_X + LAPTOP_SCREEN_UL_X), (LAPTOP_SCREEN_WEB_UL_Y + SKILL_SLIDE_START_Y + iCounter * SKILL_SLIDE_HEIGHT), (LAPTOP_SCREEN_UL_X + SKILL_SLIDE_START_X + BAR_WIDTH), (LAPTOP_SCREEN_WEB_UL_Y + SKILL_SLIDE_START_Y + iCounter * SKILL_SLIDE_HEIGHT + 15), MSYS_PRIORITY_HIGH + 2, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SliderRegionButtonCallback);

    // define user data
    MSYS_SetRegionUserData(addressof(pSliderRegions[iCounter]), 0, iCounter);
    // now add it
    MSYS_AddRegion(addressof(pSliderRegions[iCounter]));
  }

  return;
}

function CreateSliderBarMouseRegions(): void {
  // this function will create that mouse regions on the sliding bars, that, if the player clicks on, the bar will automatically jump to
  let iCounter: INT32 = 0;
  let sX: INT16 = 0;

  // set the starting X
  sX = (((55 - 35) * BASE_SKILL_PIXEL_UNIT_SIZE) / 50) + SKILL_SLIDE_START_X + LAPTOP_SCREEN_UL_X;

  for (iCounter = 0; iCounter < 10; iCounter++) {
    // define the region
    MSYS_DefineRegion(addressof(pSliderBarRegions[iCounter]), (sX), (LAPTOP_SCREEN_WEB_UL_Y + SKILL_SLIDE_START_Y + iCounter * SKILL_SLIDE_HEIGHT), (sX + SLIDER_BAR_WIDTH), (LAPTOP_SCREEN_WEB_UL_Y + SKILL_SLIDE_START_Y + iCounter * SKILL_SLIDE_HEIGHT + 15), MSYS_PRIORITY_HIGH + 2, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SliderBarRegionButtonCallback);

    // define user data
    MSYS_SetRegionUserData(addressof(pSliderBarRegions[iCounter]), 0, iCounter);
    // now add it
    MSYS_AddRegion(addressof(pSliderBarRegions[iCounter]));
  }

  return;
}

function DestroySlideRegionMouseRegions(): void {
  // this function will destroy the regions user for the slider ' jumping'
  let iCounter: INT32 = 0;

  // delete the regions
  for (iCounter = 0; iCounter < 10; iCounter++) {
    MSYS_RemoveRegion(addressof(pSliderRegions[iCounter]));
  }

  return;
}

function DestroySlideBarMouseRegions(): void {
  // this function will destroy the regions user for the slider ' jumping'
  let iCounter: INT32 = 0;

  // delete the regions
  for (iCounter = 0; iCounter < 10; iCounter++) {
    MSYS_RemoveRegion(addressof(pSliderBarRegions[iCounter]));
  }

  return;
}

function SliderRegionButtonCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let iCurrentAttributeValue: INT32 = 0;
  let iNewAttributeValue: INT32 = 0;
  let iAttributeDelta: INT32 = 0;
  let iCounter: INT32 = 0;
  let sX: INT16 = 0;
  let sY: INT16 = 0;
  /* static */ let sOldX: INT16 = -1;
  /* static */ let sOldY: INT16 = -1;
  /* static */ let iAttribute: INT32 = -1;
  let iNewValue: INT32 = 0;
  let iCurrentValue: INT32 = 0;
  let sNewX: INT16 = -1;

  // if we already have an anchored slider bar
  if (gpCurrentScrollBox != pRegion && gpCurrentScrollBox != null)
    return;

  if (iReason & MSYS_CALLBACK_REASON_INIT) {
    return;
  }
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT) {
    if (fSlideIsActive == false) {
      // not active leave
      return;
    }

    // check to see if we have moved
    if (MSYS_GetRegionUserData(pRegion, 0) != iAttribute) {
      // different regions
      iAttribute = MSYS_GetRegionUserData(pRegion, 0);
      sOldX = -1;
      sOldY = -1;
      return;
    }

    uiBarToReRender = iAttribute;

    giCurrentlySelectedStat = iAttribute;
    gpCurrentScrollBox = pRegion;

    // get new attribute value x
    sNewX = pRegion.value.MouseXPos;

    // sOldX has been reset, set to sNewX
    if (sOldX == -1) {
      sOldX = sNewX;
      return;
    }
    // check against old x
    if (sNewX != sOldX) {
      // get old stat value
      iCurrentAttributeValue = GetCurrentAttributeValue(iAttribute);
      sNewX = sNewX - (SKILL_SLIDE_START_X + LAPTOP_SCREEN_UL_X);
      iNewValue = (sNewX * 50) / BASE_SKILL_PIXEL_UNIT_SIZE + 35;

      // chenged, move mouse region if change large enough
      if (iCurrentAttributeValue != iNewValue) {
        // update screen
        fHasAnySlidingBarMoved = true;
      }

      // change is enough
      if (iNewValue - iCurrentAttributeValue > 0) {
        // positive, increment stat
        iCounter = iNewValue - iCurrentAttributeValue;
        for (iCounter; iCounter > 0; iCounter--) {
          IncrementStat(iAttribute);
        }
      } else {
        // negative, decrement stat
        iCounter = iCurrentAttributeValue - iNewValue;
        for (iCounter; iCounter > 0; iCounter--) {
          DecrementStat(iAttribute);
        }
      }

      sOldX = sNewX;
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (fSlideIsActive) {
      // reset slide is active flag
      fSlideIsActive = false;
      return;
    }

    // get mouse XY

    sX = pRegion.value.MouseXPos;
    sY = pRegion.value.MouseYPos;

    // which region are we in?

    // get attribute
    iAttribute = MSYS_GetRegionUserData(pRegion, 0);
    uiBarToReRender = iAttribute;

    // get value of attribute
    iCurrentAttributeValue = GetCurrentAttributeValue(iAttribute);

    // set the new attribute value based on position of mouse click
    iNewAttributeValue = ((sX - SKILL_SLIDE_START_X) * 50) / BASE_SKILL_PIXEL_UNIT_SIZE;

    // too high, reset to 85
    if (iNewAttributeValue > 85) {
      iNewAttributeValue = 85;
    }

    // get the delta
    iAttributeDelta = iCurrentAttributeValue - iNewAttributeValue;

    // set Counter
    iCounter = iAttributeDelta;

    // check if increment or decrement
    if (iAttributeDelta > 0) {
      // decrement
      for (iCounter = 0; iCounter < iAttributeDelta; iCounter++) {
        DecrementStat(iAttribute);
      }
    } else {
      // increment attribute
      for (iCounter = iAttributeDelta; iCounter < 0; iCounter++) {
        if (iCurrentAttributeValue == 0) {
          iCounter = 0;
        }
        IncrementStat(iAttribute);
      }
    }

    // update screen
    fHasAnySlidingBarMoved = true;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    // get mouse positions
    sX = pRegion.value.MouseXPos;
    sY = pRegion.value.MouseYPos;

    // get attribute
    iAttribute = MSYS_GetRegionUserData(pRegion, 0);
    uiBarToReRender = iAttribute;

    // get value of attribute
    iCurrentAttributeValue = GetCurrentAttributeValue(iAttribute);

    // get the boxes bounding x
    sNewX = ((iCurrentAttributeValue - 35) * BASE_SKILL_PIXEL_UNIT_SIZE) / 50 + SKILL_SLIDE_START_X + LAPTOP_SCREEN_UL_X;

    // the sNewX is below 0, reset to zero
    if (sNewX < 0) {
      sNewX = 0;
    }

    if ((sX > sNewX) && (sX < sNewX + SLIDER_BAR_WIDTH)) {
      // we are within the slide bar, set fact we want to drag and draw
      fSlideIsActive = true;
    } else {
      // otherwise want to jump to position
      fSlideIsActive = false;
    }
  }
}

function SliderBarRegionButtonCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    fSlideIsActive = true;
    SliderRegionButtonCallback(addressof(pSliderRegions[MSYS_GetRegionUserData(pRegion, 0)]), MSYS_CALLBACK_REASON_LBUTTON_REPEAT);
  }
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    fSlideIsActive = false;
  }
}

function GetCurrentAttributeValue(iAttribute: INT32): INT32 {
  // this function will get the value of the attribute that was passed to this fucntion via iAttribute
  let iValue: INT32 = 0;

  switch (iAttribute) {
    case (Enum84.STRENGTH_ATTRIBUTE):
      iValue = iCurrentStrength;
      break;
    case (Enum84.DEXTERITY_ATTRIBUTE):
      iValue = iCurrentDexterity;
      break;
    case (Enum84.AGILITY_ATTRIBUTE):
      iValue = iCurrentAgility;
      break;
    case (Enum84.HEALTH_ATTRIBUTE):
      iValue = iCurrentHealth;
      break;
    case (Enum84.WISDOM_ATTRIBUTE):
      iValue = iCurrentWisdom;
      break;
    case (Enum84.LEADERSHIP_ATTRIBUTE):
      iValue = iCurrentLeaderShip;
      break;
    case (Enum84.MARKSMANSHIP_SKILL):
      iValue = iCurrentMarkmanship;
      break;
    case (Enum84.MEDICAL_SKILL):
      iValue = iCurrentMedical;
      break;
    case (Enum84.MECHANICAL_SKILL):
      iValue = iCurrentMechanical;
      break;
    case (Enum84.EXPLOSIVE_SKILL):
      iValue = iCurrentExplosives;
      break;
  }

  return iValue;
}

export function SetAttributes(): void {
  /*
    // set attributes and skills based on what is in charprofile.c

          // attributes
            iCurrentStrength = iStrength + iAddStrength;
                  iCurrentDexterity = iDexterity + iAddDexterity;
                  iCurrentHealth = iHealth + iAddHealth;
                  iCurrentLeaderShip = iLeadership + iAddLeadership;
                  iCurrentWisdom = iWisdom + iAddWisdom;
                  iCurrentAgility = iAgility + iAddAgility;

          // skills
      iCurrentMarkmanship = iMarksmanship + iAddMarksmanship;
                  iCurrentMechanical = iMechanical + iAddMechanical;
                  iCurrentMedical = iMedical + iAddMedical;
                  iCurrentExplosives = iExplosives + iAddExplosives;

                  // reset bonus pts
      iCurrentBonusPoints = 40;
  */

  iCurrentStrength = 55;
  iCurrentDexterity = 55;
  iCurrentHealth = 55;
  iCurrentLeaderShip = 55;
  iCurrentWisdom = 55;
  iCurrentAgility = 55;

  // skills
  iCurrentMarkmanship = 55;
  iCurrentMechanical = 55;
  iCurrentMedical = 55;
  iCurrentExplosives = 55;

  // reset bonus pts
  iCurrentBonusPoints = 40;

  ResetIncrementCharacterAttributes();

  return;
}

export function DrawBonusPointsRemaining(): void {
  // draws the amount of points remaining player has
  let sString: CHAR16[] /* [64] */;

  // just reviewing, don't blit stats
  if (fReviewStats == true) {
    return;
  }
  // parse amountof bns pts remaining
  swprintf(sString, "%d", iCurrentBonusPoints);

  // set font color
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);
  SetFont(FONT12ARIAL());
  // print string
  mprintf(LAPTOP_SCREEN_UL_X + 425, LAPTOP_SCREEN_WEB_UL_Y + 51, sString);

  InvalidateRegion(LAPTOP_SCREEN_UL_X + 425, LAPTOP_SCREEN_WEB_UL_Y + 51, LAPTOP_SCREEN_UL_X + 475, LAPTOP_SCREEN_WEB_UL_Y + 71);
  return;
}

export function SetGeneratedCharacterAttributes(): void {
  // copies over the attributes of the player generated character
  iStrength = iCurrentStrength;
  iDexterity = iCurrentDexterity;
  iHealth = iCurrentHealth;
  iLeadership = iCurrentLeaderShip;
  iWisdom = iCurrentWisdom;
  iAgility = iCurrentAgility;

  // skills
  iMarksmanship = iCurrentMarkmanship;
  iMechanical = iCurrentMechanical;
  iMedical = iCurrentMedical;
  iExplosives = iCurrentExplosives;

  return;
}

function StatAtZeroBoxCallBack(bExitValue: UINT8): void {
  // yes, so start over, else stay here and do nothing for now
  if (bExitValue == MSG_BOX_RETURN_YES) {
    MarkButtonsDirty();
  } else if (bExitValue == MSG_BOX_RETURN_NO) {
    IncrementStat(iCurrentStatAtZero);
    fHasAnySlidingBarMoved = true;
    MarkButtonsDirty();
  }

  return;
}
