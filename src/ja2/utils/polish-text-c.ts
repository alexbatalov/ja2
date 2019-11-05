/*

******************************************************************************************************
**                                  IMPORTANT TRANSLATION NOTES                                     **
******************************************************************************************************

GENERAL INSTRUCTIONS
- Always be aware that foreign strings should be of equal or shorter length than the English equivalent.
        I know that this is difficult to do on many occasions due to the nature of foreign languages when
        compared to English.  By doing so, this will greatly reduce the amount of work on both sides.  In
        most cases (but not all), JA2 interfaces were designed with just enough space to fit the English word.
        The general rule is if the string is very short (less than 10 characters), then it's short because of
        interface limitations.  On the other hand, full sentences commonly have little limitations for length.
        Strings in between are a little dicey.
- Never translate a string to appear on multiple lines.  All strings L"This is a really long string...",
        must fit on a single line no matter how long the string is.  All strings start with L" and end with ",
- Never remove any extra spaces in strings.  In addition, all strings containing multiple sentences only
        have one space after a period, which is different than standard typing convention.  Never modify sections
        of strings contain combinations of % characters.  These are special format characters and are always
        used in conjunction with other characters.  For example, %s means string, and is commonly used for names,
        locations, items, etc.  %d is used for numbers.  %c%d is a character and a number (such as A9).
        %% is how a single % character is built.  There are countless types, but strings containing these
        special characters are usually commented to explain what they mean.  If it isn't commented, then
        if you can't figure out the context, then feel free to ask SirTech.
- Comments are always started with // Anything following these two characters on the same line are
        considered to be comments.  Do not translate comments.  Comments are always applied to the following
        string(s) on the next line(s), unless the comment is on the same line as a string.
- All new comments made by SirTech will use "//@@@ comment" (without the quotes) notation.  By searching
        for @@@ everytime you recieve a new version, it will simplify your task and identify special instructions.
  Commonly, these types of comments will be used to ask you to abbreviate a string.  Please leave the
        comments intact, and SirTech will remove them once the translation for that particular area is resolved.
- If you have a problem or question with translating certain strings, please use "//!!! comment"
        (without the quotes).  The syntax is important, and should be identical to the comments used with @@@
        symbols.  SirTech will search for !!! to look for your problems and questions.  This is a more
        efficient method than detailing questions in email, so try to do this whenever possible.



FAST HELP TEXT -- Explains how the syntax of fast help text works.
**************

1) BOLDED LETTERS
        The popup help text system supports special characters to specify the hot key(s) for a button.
        Anytime you see a '|' symbol within the help text string, that means the following key is assigned
        to activate the action which is usually a button.

        EX:  L"|Map Screen"

        This means the 'M' is the hotkey.  In the game, when somebody hits the 'M' key, it activates that
        button.  When translating the text to another language, it is best to attempt to choose a word that
        uses 'M'.  If you can't always find a match, then the best thing to do is append the 'M' at the end
        of the string in this format:

        EX:  L"Ecran De Carte (|M)"  (this is the French translation)

        Other examples are used multiple times, like the Esc key  or "|E|s|c" or Space -> (|S|p|a|c|j|a)

2) NEWLINE
  Any place you see a \n within the string, you are looking at another string that is part of the fast help
        text system.  \n notation doesn't need to be precisely placed within that string, but whereever you wish
        to start a new line.

        EX:  L"Clears all the mercs' positions,\nand allows you to re-enter them manually."

        Would appear as:

                                Clears all the mercs' positions,
                                and allows you to re-enter them manually.

        NOTE:  It is important that you don't pad the characters adjacent to the \n with spaces.  If we did this
               in the above example, we would see

        WRONG WAY -- spaces before and after the \n
        EX:  L"Clears all the mercs' positions, \n and allows you to re-enter them manually."

        Would appear as: (the second line is moved in a character)

                                Clears all the mercs' positions,
                                 and allows you to re-enter them manually.


@@@ NOTATION
************

        Throughout the text files, you'll find an assortment of comments.  Comments are used to describe the
        text to make translation easier, but comments don't need to be translated.  A good thing is to search for
        "@@@" after receiving new version of the text file, and address the special notes in this manner.

!!! NOTATION
************

        As described above, the "!!!" notation should be used by you to ask questions and address problems as
        SirTech uses the "@@@" notation.

*/

export let ItemNames: string[] /* UINT16[MAXITEMS][80] */ = [ "" ];

export let ShortItemNames: string[] /* UINT16[MAXITEMS][80] */ = [ "" ];

// Different weapon calibres
// CAWS is Close Assault Weapon System and should probably be left as it is
// NATO is the North Atlantic Treaty Organization
// WP is Warsaw Pact
// cal is an abbreviation for calibre
export let AmmoCaliber: string[] /* UINT16[][20] */ = [
  "0",
  ".38 cal",
  "9mm",
  ".45 cal",
  ".357 cal",
  "12 gauge",
  "CAWS",
  "5.45mm",
  "5.56mm",
  "7.62mm NATO",
  "7.62mm WP",
  "4.7mm",
  "5.7mm",
  "Monstrum",
  "Rakiety",
  "", // dart
  "", // flame
];

// This BobbyRayAmmoCaliber is virtually the same as AmmoCaliber however the bobby version doesnt have as much room for the words.
//
// Different weapon calibres
// CAWS is Close Assault Weapon System and should probably be left as it is
// NATO is the North Atlantic Treaty Organization
// WP is Warsaw Pact
// cal is an abbreviation for calibre
export let BobbyRayAmmoCaliber: string[] /* UINT16[][20] */ = [
  "0",
  ".38 cal",
  "9mm",
  ".45 cal",
  ".357 cal",
  "12 gauge",
  "CAWS",
  "5.45mm",
  "5.56mm",
  "7.62mm N.",
  "7.62mm WP",
  "4.7mm",
  "5.7mm",
  "Monstrum",
  "Rakiety",
  "", // dart
];

export let WeaponType: string[] /* UINT16[][30] */ = [
  "Inny",
  "Pistolet",
  "Pistolet maszynowy",
  "Karabin maszynowy",
  "Karabin",
  "Karabin snajperski",
  "Karabin bojowy",
  "Lekki karabin maszynowy",
  "Strzelba",
];

export let TeamTurnString: string[] /* UINT16[][STRING_LENGTH] */ = [
  "Tura gracza", // player's turn
  "Tura przeciwnika",
  "Tura stworzeń",
  "Tura samoobrony",
  "Tura cywili",
  // planning turn
];

export let Message: string[] /* UINT16[][STRING_LENGTH] */ = [
  "",

  // In the following 8 strings, the %s is the merc's name, and the %d (if any) is a number.

  "%s dostał(a) w głowę i traci 1 punkt inteligencji!",
  "%s dostał(a) w ramię i traci 1 punkt zręcznoci!",
  "%s dostał(a) w klatkę piersiowš i traci 1 punkt siły!",
  "%s dostał(a) w nogi i traci 1 punkt zwinnoci!",
  "%s dostał(a) w głowę i traci %d pkt. inteligencji!",
  "%s dostał(a) w ramię i traci %d pkt. zręcznoci!",
  "%s dostał(a) w klatkę piersiowš i traci %d pkt. siły!",
  "%s dostał(a) w nogi i traci %d pkt. zwinnoci!",
  "Przerwanie!",

  // The first %s is a merc's name, the second is a string from pNoiseVolStr,
  // the third is a string from pNoiseTypeStr, and the last is a string from pDirectionStr

  "", // OBSOLETE
  "Dotarły twoje posiłki!",

  // In the following four lines, all %s's are merc names

  "%s przeładowuje.",
  "%s posiada za mało Punktów Akcji!",
  "%s udziela pierwszej pomocy. (Nacinij dowolny klawisz aby przerwać.)",
  "%s i %s udzielajš pierwszej pomocy. (Nacinij dowolny klawisz aby przerwać.)",
  // the following 17 strings are used to create lists of gun advantages and disadvantages
  // (separated by commas)
  "niezawodna",
  "zawodna",
  "łatwa w naprawie",
  "trudna do naprawy",
  "solidna",
  "niesolidna",
  "szybkostrzelna",
  "wolno strzelajšca",
  "daleki zasięg",
  "krótki zasięg",
  "mała waga",
  "duża waga",
  "niewielkie rozmiary",
  "szybki cišgły ogień",
  "brak cišgłego ognia",
  "duży magazynek",
  "mały magazynek",

  // In the following two lines, all %s's are merc names

  "%s: kamuflaż się starł.",
  "%s: kamuflaż się zmył.",

  // The first %s is a merc name and the second %s is an item name

  "Brak amunicji w dodatkowej broni!",
  "%s ukradł(a): %s.",

  // The %s is a merc name

  "%s ma broń bez funkcji cišgłego ognia.",

  "Już masz co takiego dołšczone.",
  "Połšczyć przedmioty?",

  // Both %s's are item names

  "%s i %s nie pasujš do siebie.",

  "Brak",
  "Wyjmij amunicję",
  "Dodatki",

  // You cannot use "item(s)" and your "other item" at the same time.
  // Ex:  You cannot use sun goggles and you gas mask at the same time.
  " %s i %s nie mogš być używane jednoczenie.",

  "Element, który masz na kursorze myszy może być dołšczony do pewnych przedmiotów, poprzez umieszczenie go w jednym z czterech slotów.",
  "Element, który masz na kursorze myszy może być dołšczony do pewnych przedmiotów, poprzez umieszczenie go w jednym z czterech slotów. (Jednak w tym przypadku, przedmioty do siebie nie pasujš.)",
  "Ten sektor nie został oczyszczony z wrogów!",
  "Wcišż musisz dać %s %s",
  "%s dostał(a) w głowę!",
  "Przerwać walkę?",
  "Ta zmiana będzie trwała. Kontynuować?",
  "%s ma więcej energii!",
  "%s polizgnšł(nęła) się na kulkach!",
  "%s nie chwycił(a) - %s!",
  "%s naprawił(a) %s",
  "Przerwanie dla: ",
  "Poddać się?",
  "Ta osoba nie chce twojej pomocy.",
  "NIE SĽDZĘ!",
  "Aby podróżować helikopterem Skyridera, musisz najpierw zmienić przydział najemników na POJAZD/HELIKOPTER.",
  "%s miał(a) czas by przeładować tylko jednš broń",
  "Tura dzikich kotów",
];

// the names of the towns in the game

export let pTownNames: string[] /* STR16[] */ = [
  "",
  "Omerta",
  "Drassen",
  "Alma",
  "Grumm",
  "Tixa",
  "Cambria",
  "San Mona",
  "Estoni",
  "Orta",
  "Balime",
  "Meduna",
  "Chitzena",
];

// the types of time compression. For example: is the timer paused? at normal speed, 5 minutes per second, etc.
// min is an abbreviation for minutes

export let sTimeStrings: string[] /* STR16[] */ = [
  "Pauza",
  "Normalna",
  "5 min.",
  "30 min.",
  "60 min.",
  "6 godz.", // NEW
];

// Assignment Strings: what assignment does the merc  have right now? For example, are they on a squad, training,
// administering medical aid (doctor) or training a town. All are abbreviated. 8 letters is the longest it can be.

export let pAssignmentStrings: string[] /* STR16[] */ = [
  "Oddz. 1",
  "Oddz. 2",
  "Oddz. 3",
  "Oddz. 4",
  "Oddz. 5",
  "Oddz. 6",
  "Oddz. 7",
  "Oddz. 8",
  "Oddz. 9",
  "Oddz. 10",
  "Oddz. 11",
  "Oddz. 12",
  "Oddz. 13",
  "Oddz. 14",
  "Oddz. 15",
  "Oddz. 16",
  "Oddz. 17",
  "Oddz. 18",
  "Oddz. 19",
  "Oddz. 20",
  "Służba", // on active duty
  "Lekarz", // administering medical aid
  "Pacjent", // getting medical aid
  "Pojazd", // sitting around resting
  "Podróż", // in transit - abbreviated form
  "Naprawa", // repairing
  "Praktyka", // training themselves  // ***************NEW******************** as of June 24. 1998
  "Samoobr.", // training a town to revolt // *************NEW******************** as of June 24, 1998
  "Instruk.", // training a teammate
  "Uczeń", // being trained by someone else // *******************NEW************** as of June 24, 1998
  "Nie żyje", // dead
  "Obezwł.", // abbreviation for incapacitated
  "Jeniec", // Prisoner of war - captured
  "Szpital", // patient in a hospital
  "Pusty", // Vehicle is empty
];

export let pMilitiaString: string[] /* STR16[] */ = [
  "Samoobrona", // the title of the militia box
  "Bez przydziału", // the number of unassigned militia troops
  "Nie możesz przemieszczać oddziałów samoobrony gdy nieprzyjaciel jest w sektorze!",
];

export let pMilitiaButtonString: string[] /* STR16[] */ = [
  "Auto", // auto place the militia troops for the player
  "OK", // done placing militia troops
];

export let pConditionStrings: string[] /* STR16[] */ = [
  "Doskonały", // the state of a soldier .. excellent health
  "Dobry", // good health
  "Doć dobry", // fair health
  "Ranny", // wounded health
  "Zmęczony", // L"Wyczerpany", // tired
  "Krwawi", // bleeding to death
  "Nieprzyt.", // knocked out
  "Umierajšcy", // near death
  "Nie żyje", // dead
];

export let pEpcMenuStrings: string[] /* STR16[] */ = [
  "Służba", // set merc on active duty
  "Pacjent", // set as a patient to receive medical aid
  "Pojazd", // tell merc to enter vehicle
  "Wypuć", // let the escorted character go off on their own
  "Anuluj", // close this menu
];

// look at pAssignmentString above for comments

export let pPersonnelAssignmentStrings: string[] /* STR16[] */ = [
  "Oddz. 1",
  "Oddz. 2",
  "Oddz. 3",
  "Oddz. 4",
  "Oddz. 5",
  "Oddz. 6",
  "Oddz. 7",
  "Oddz. 8",
  "Oddz. 9",
  "Oddz. 10",
  "Oddz. 11",
  "Oddz. 12",
  "Oddz. 13",
  "Oddz. 14",
  "Oddz. 15",
  "Oddz. 16",
  "Oddz. 17",
  "Oddz. 18",
  "Oddz. 19",
  "Oddz. 20",
  "Służba",
  "Lekarz",
  "Pacjent",
  "Pojazd",
  "Podróż",
  "Naprawa",
  "Praktyka",
  "Trenuje samoobronę",
  "Instruktor",
  "Uczeń",
  "Nie żyje",
  "Obezwładniony",
  "Jeniec",
  "Szpital",
  "Pusty", // Vehicle is empty
];

// refer to above for comments

export let pLongAssignmentStrings: string[] /* STR16[] */ = [
  "Oddział 1",
  "Oddział 2",
  "Oddział 3",
  "Oddział 4",
  "Oddział 5",
  "Oddział 6",
  "Oddział 7",
  "Oddział 8",
  "Oddział 9",
  "Oddział 10",
  "Oddział 11",
  "Oddział 12",
  "Oddział 13",
  "Oddział 14",
  "Oddział 15",
  "Oddział 16",
  "Oddział 17",
  "Oddział 18",
  "Oddział 19",
  "Oddział 20",
  "Służba",
  "Lekarz",
  "Pacjent",
  "Pojazd",
  "W podróży",
  "Naprawa",
  "Praktyka",
  "Trenuj samoobronę",
  "Trenuj oddział",
  "Uczeń",
  "Nie żyje",
  "Obezwładniony",
  "Jeniec",
  "W szpitalu",
  "Pusty", // Vehicle is empty
];

// the contract options

export let pContractStrings: string[] /* STR16[] */ = [
  "Opcje kontraktu:",
  "", // a blank line, required
  "Zaproponuj 1 dzień", // offer merc a one day contract extension
  "Zaproponuj 1 tydzień", // 1 week
  "Zaproponuj 2 tygodnie", // 2 week
  "Zwolnij", // end merc's contract
  "Anuluj", // stop showing this menu
];

export let pPOWStrings: string[] /* STR16[] */ = [
  "Jeniec", // an acronym for Prisoner of War
  "??",
];

export let pLongAttributeStrings: string[] /* STR16[] */ = [
  "SIŁA", // The merc's strength attribute. Others below represent the other attributes.
  "ZRĘCZNOĆ",
  "ZWINNOĆ",
  "INTELIGENCJA",
  "UMIEJĘTNOCI STRZELECKIE",
  "WIEDZA MEDYCZNA",
  "ZNAJOMOĆ MECHANIKI",
  "UMIEJĘTNOĆ DOWODZENIA",
  "ZNAJOMOĆ MATERIAŁÓW WYBUCHOWYCH",
  "POZIOM DOWIADCZENIA",
];

export let pInvPanelTitleStrings: string[] /* STR16[] */ = [
  "Osłona", // the armor rating of the merc
  "Ekwip.", // the weight the merc is carrying
  "Kamuf.", // the merc's camouflage rating
];

export let pShortAttributeStrings: string[] /* STR16[] */ = [
  "Zwn", // the abbreviated version of : agility
  "Zrc", // dexterity
  "Sił", // strength
  "Dow", // leadership
  "Int", // wisdom
  "Do", // experience level
  "Str", // marksmanship skill
  "Wyb", // explosive skill
  "Mec", // mechanical skill
  "Med", // medical skill
];

export let pUpperLeftMapScreenStrings: string[] /* STR16[] */ = [
  "Przydział", // the mercs current assignment // *********************NEW****************** as of June 24, 1998
  "Kontrakt", // the contract info about the merc
  "Zdrowie", // the health level of the current merc
  "Morale", // the morale of the current merc
  "Stan", // the condition of the current vehicle
  "Paliwo", // the fuel level of the current vehicle
];

export let pTrainingStrings: string[] /* STR16[] */ = [
  "Praktyka", // tell merc to train self // ****************************NEW******************* as of June 24, 1998
  "Samoobrona", // tell merc to train town // *****************************NEW ****************** as of June 24, 1998
  "Instruktor", // tell merc to act as trainer
  "Uczeń", // tell merc to be train by other // **********************NEW******************* as of June 24, 1998
];

export let pGuardMenuStrings: string[] /* STR16[] */ = [
  "Limit ognia:", // the allowable rate of fire for a merc who is guarding
  " Agresywny ogień", // the merc can be aggressive in their choice of fire rates
  " Oszczędzaj amunicję", // conserve ammo
  " Strzelaj w ostatecznoci", // fire only when the merc needs to
  "Inne opcje:", // other options available to merc
  " Może się wycofać", // merc can retreat
  " Może szukać schronienia", // merc is allowed to seek cover
  " Może pomagać partnerom", // merc can assist teammates
  "OK", // done with this menu
  "Anuluj", // cancel this menu
];

// This string has the same comments as above, however the * denotes the option has been selected by the player

export let pOtherGuardMenuStrings: string[] /* STR16[] */ = [
  "Limit ognia:",
  " *Agresywny ogień*",
  " *Oszczędzaj amunicję*",
  " *Strzelaj w ostatecznoci*",
  "Inne opcje:",
  " *Może się wycofać*",
  " *Może szukać schronienia*",
  " *Może pomagać partnerom*",
  "OK",
  "Anuluj",
];

export let pAssignMenuStrings: string[] /* STR16[] */ = [
  "Służba", // merc is on active duty
  "Lekarz", // the merc is acting as a doctor
  "Pacjent", // the merc is receiving medical attention
  "Pojazd", // the merc is in a vehicle
  "Naprawa", // the merc is repairing items
  "Szkolenie", // the merc is training
  "Anuluj", // cancel this menu
];

export let pRemoveMercStrings: string[] /* STR16[] */ = [
  "Usuń najemnika", // remove dead merc from current team
  "Anuluj",
];

export let pAttributeMenuStrings: string[] /* STR16[] */ = [
  "Siła",
  "Zręcznoć",
  "Zwinnoć",
  "Zdrowie",
  "Um. strzeleckie",
  "Wiedza med.",
  "Zn. mechaniki",
  "Um. dowodzenia",
  "Zn. mat. wyb.",
  "Anuluj",
];

export let pTrainingMenuStrings: string[] /* STR16[] */ = [
  "Praktyka", // train yourself //****************************NEW************************** as of June 24, 1998
  "Samoobrona", // train the town // ****************************NEW ************************* as of June 24, 1998
  "Instruktor", // train your teammates // *******************NEW************************** as of June 24, 1998
  "Uczeń", // be trained by an instructor //***************NEW************************** as of June 24, 1998
  "Anuluj", // cancel this menu
];

export let pSquadMenuStrings: string[] /* STR16[] */ = [
  "Oddział  1",
  "Oddział  2",
  "Oddział  3",
  "Oddział  4",
  "Oddział  5",
  "Oddział  6",
  "Oddział  7",
  "Oddział  8",
  "Oddział  9",
  "Oddział 10",
  "Oddział 11",
  "Oddział 12",
  "Oddział 13",
  "Oddział 14",
  "Oddział 15",
  "Oddział 16",
  "Oddział 17",
  "Oddział 18",
  "Oddział 19",
  "Oddział 20",
  "Anuluj",
];

export let pPersonnelTitle: string[] /* STR16[] */ = [
  "Personel", // the title for the personnel screen/program application
];

export let pPersonnelScreenStrings: string[] /* STR16[] */ = [
  "Zdrowie: ", // health of merc
  "Zwinnoć: ",
  "Zręcznoć: ",
  "Siła: ",
  "Um. dowodzenia: ",
  "Inteligencja: ",
  "Poziom dow.: ", // experience level
  "Um. strzeleckie: ",
  "Zn. mechaniki: ",
  "Zn. mat. wybuchowych: ",
  "Wiedza medyczna: ",
  "Zastaw na życie: ", // amount of medical deposit put down on the merc
  "Bieżšcy kontrakt: ", // cost of current contract
  "Liczba zabójstw: ", // number of kills by merc
  "Liczba asyst: ", // number of assists on kills by merc
  "Dzienny koszt:", // daily cost of merc
  "Ogólny koszt:", // total cost of merc
  "Wartoć kontraktu:", // cost of current contract
  "Usługi ogółem", // total service rendered by merc
  "Zaległa kwota", // amount left on MERC merc to be paid
  "Celnoć:", // percentage of shots that hit target
  "Iloć walk:", // number of battles fought
  "Ranny(a):", // number of times merc has been wounded
  "Umiejętnoci:",
  "Brak umięjętnoci",
];

// These string correspond to enums used in by the SkillTrait enums in SoldierProfileType.h
export let gzMercSkillText: string[] /* STR16[] */ = [
  "Brak umiejętnoci",
  "Otwieranie zamków",
  "Walka wręcz",
  "Elektronika",
  "Nocne operacje",
  "Rzucanie",
  "Szkolenie",
  "Ciężka broń",
  "Broń automatyczna",
  "Skradanie się",
  "Oburęcznoć",
  "Kradzieże",
  "Sztuki walki",
  "Broń biała",
  "Snajper",
  "Kamuflaż",
  "(Eksp.)",
];

// This is pop up help text for the options that are available to the merc

export let pTacticalPopupButtonStrings: string[] /* STR16[] */ = [
  "W|stań/Id",
  "S|chyl się/Id",
  "Wstań/Biegnij (|R)",
  "|Padnij/Czołgaj się",
  "Patrz (|L)",
  "Akcja",
  "Rozmawiaj",
  "Zbadaj (|C|t|r|l)",

  // Pop up door menu
  "Otwórz",
  "Poszukaj pułapek",
  "Użyj wytrychów",
  "Wyważ",
  "Usuń pułapki",
  "Zamknij na klucz",
  "Otwórz kluczem",
  "Użyj ładunku wybuchowego",
  "Użyj łomu",
  "Anuluj (|E|s|c)",
  "Zamknij",
];

// Door Traps. When we examine a door, it could have a particular trap on it. These are the traps.

export let pDoorTrapStrings: string[] /* STR16[] */ = [
  "nie posiada żadnych pułapek",
  "ma założony ładunek wybuchowy",
  "jest pod napięciem",
  "posiada syrenę alarmowš",
  "posiada dyskretny alarm",
];

// Contract Extension. These are used for the contract extension with AIM mercenaries.

export let pContractExtendStrings: string[] /* STR16[] */ = [
  "dzień",
  "tydzień",
  "dwa tygodnie",
];

// On the map screen, there are four columns. This text is popup help text that identifies the individual columns.

export let pMapScreenMouseRegionHelpText: string[] /* STR16[] */ = [
  "Wybór postaci",
  "Przydział najemnika",
  "Nanie trasę podróży",
  "Kontrakt najemnika",
  "Usuń najemnika",
  "pij", // *****************************NEW********************* as of June 29, 1998
];

// volumes of noises

export let pNoiseVolStr: string[] /* STR16[] */ = [
  "CICHY",
  "WYRANY",
  "GŁONY",
  "BARDZO GŁONY",
];

// types of noises

// OBSOLETE
export let pNoiseTypeStr: string[] /* STR16[] */ = [
  "NIEOKRELONY DWIĘK",
  "ODGŁOS RUCHU",
  "ODGŁOS SKRZYPNIĘCIA",
  "PLUSK",
  "ODGŁOS UDERZENIA",
  "STRZAŁ",
  "WYBUCH",
  "KRZYK",
  "ODGŁOS UDERZENIA",
  "ODGŁOS UDERZENIA",
  "ŁOMOT",
  "TRZASK",
];

// Directions that are used to report noises

export let pDirectionStr: string[] /* STR16[] */ = [
  "PŁN-WSCH",
  "WSCH",
  "PŁD-WSCH",
  "PŁD",
  "PŁD-ZACH",
  "ZACH",
  "PŁN-ZACH",
  "PŁN",
];

// These are the different terrain types.

export let pLandTypeStrings: string[] /* STR16[] */ = [
  "Miasto",
  "Droga",
  "Otwarty teren",
  "Pustynia",
  "Las",
  "Las",
  "Bagno",
  "Woda",
  "Wzgórza",
  "Teren nieprzejezdny",
  "Rzeka", // river from north to south
  "Rzeka", // river from east to west
  "Terytorium innego kraju",
  // NONE of the following are used for directional travel, just for the sector description.
  "Tropiki",
  "Pola uprawne",
  "Otwarty teren, droga",
  "Las, droga",
  "Las, droga",
  "Tropiki, droga",
  "Las, droga",
  "Wybrzeże",
  "Góry, droga",
  "Wybrzeże, droga",
  "Pustynia, droga",
  "Bagno, droga",
  "Las, Rakiety Z-P",
  "Pustynia, Rakiety Z-P",
  "Tropiki, Rakiety Z-P",
  "Meduna, Rakiety Z-P",

  // These are descriptions for special sectors
  "Szpital w Cambrii",
  "Lotnisko w Drassen",
  "Lotnisko w Medunie",
  "Rakiety Z-P",
  "Kryjówka rebeliantów", // The rebel base underground in sector A10
  "Tixa - Lochy", // The basement of the Tixa Prison (J9)
  "Gniazdo stworzeń", // Any mine sector with creatures in it
  "Orta - Piwnica", // The basement of Orta (K4)
  "Tunel", // The tunnel access from the maze garden in Meduna
            // leading to the secret shelter underneath the palace
  "Schron", // The shelter underneath the queen's palace
  "", // Unused
];

export let gpStrategicString: string[] /* STR16[] */ = [
  "", // Unused
  "%s wykryto w sektorze %c%d, a inny oddział jest w drodze.", // STR_DETECTED_SINGULAR
  "%s wykryto w sektorze %c%d, a inne oddziały sš w drodze.", // STR_DETECTED_PLURAL
  "Chcesz skoordynować jednoczesne przybycie?", // STR_COORDINATE

  // Dialog strings for enemies.

  "Wróg daje ci szansę się poddać.", // STR_ENEMY_SURRENDER_OFFER
  "Wróg schwytał resztę twoich nieprzytomnych najemników.", // STR_ENEMY_CAPTURED

  // The text that goes on the autoresolve buttons

  "Odwrót", // The retreat button				//STR_AR_RETREAT_BUTTON
  "OK", // The done button				//STR_AR_DONE_BUTTON

  // The headers are for the autoresolve type (MUST BE UPPERCASE)

  "OBRONA", // STR_AR_DEFEND_HEADER
  "ATAK", // STR_AR_ATTACK_HEADER
  "STARCIE", // STR_AR_ENCOUNTER_HEADER
  "Sektor", // The Sector A9 part of the header		//STR_AR_SECTOR_HEADER

  // The battle ending conditions

  "ZWYCIĘSTWO!", // STR_AR_OVER_VICTORY
  "PORAŻKA!", // STR_AR_OVER_DEFEAT
  "KAPITULACJA!", // STR_AR_OVER_SURRENDERED
  "NIEWOLA!", // STR_AR_OVER_CAPTURED
  "ODWRÓT!", // STR_AR_OVER_RETREATED

  // These are the labels for the different types of enemies we fight in autoresolve.

  "Samoobrona", // STR_AR_MILITIA_NAME,
  "Elity", // STR_AR_ELITE_NAME,
  "Żołnierze", // STR_AR_TROOP_NAME,
  "Administrator", // STR_AR_ADMINISTRATOR_NAME,
  "Stworzenie", // STR_AR_CREATURE_NAME,

  // Label for the length of time the battle took

  "Czas trwania", // STR_AR_TIME_ELAPSED,

  // Labels for status of merc if retreating.  (UPPERCASE)

  "WYCOFAŁ(A) SIĘ", // STR_AR_MERC_RETREATED,
  "WYCOFUJE SIĘ", // STR_AR_MERC_RETREATING,
  "WYCOFAJ SIĘ", // STR_AR_MERC_RETREAT,

  // PRE BATTLE INTERFACE STRINGS
  // Goes on the three buttons in the prebattle interface.  The Auto resolve button represents
  // a system that automatically resolves the combat for the player without having to do anything.
  // These strings must be short (two lines -- 6-8 chars per line)

  "Rozst. autom.", // STR_PB_AUTORESOLVE_BTN,
  "Id do sektora", // STR_PB_GOTOSECTOR_BTN,
  "Wycof. ludzi", // STR_PB_RETREATMERCS_BTN,

  // The different headers(titles) for the prebattle interface.
  "STARCIE Z WROGIEM", // STR_PB_ENEMYENCOUNTER_HEADER,
  "INWAZJA WROGA", // STR_PB_ENEMYINVASION_HEADER, // 30
  "ZASADZKA WROGA",
  "WEJCIE DO WROGIEGO SEKTORA",
  "ATAK STWORÓW",
  "ATAK DZIKICH KOTÓW", // STR_PB_BLOODCATAMBUSH_HEADER
  "WEJCIE DO LEGOWISKA DZIKICH KOTÓW", // STR_PB_ENTERINGBLOODCATLAIR_HEADER

  // Various single words for direct translation.  The Civilians represent the civilian
  // militia occupying the sector being attacked.  Limited to 9-10 chars

  "Położenie",
  "Wrogowie",
  "Najemnicy",
  "Samoobrona",
  "Stwory",
  "Dzikie koty",
  "Sektor",
  "Brak", // If there are no uninvolved mercs in this fight.
  "N/D", // Acronym of Not Applicable N/A
  "d", // One letter abbreviation of day
  "g", // One letter abbreviation of hour

  // TACTICAL PLACEMENT USER INTERFACE STRINGS
  // The four buttons

  "Wyczyć",
  "Rozprosz",
  "Zgrupuj",
  "OK",

  // The help text for the four buttons.  Use \n to denote new line (just like enter).

  "Kasuje wszystkie pozy|cje najemników, \ni pozwala ponownie je wprowadzić.",
  "Po każdym nacinięciu rozmie|szcza\nlosowo twoich najemników.",
  "|Grupuje najemników w wybranym miejscu.",
  "Kliknij ten klawisz gdy już rozmiecisz \nswoich najemników. (|E|n|t|e|r)",
  "Musisz rozmiecić wszystkich najemników \nzanim rozpoczniesz walkę.",

  // Various strings (translate word for word)

  "Sektor",
  "Wybierz poczštkowe pozycje",

  // Strings used for various popup message boxes.  Can be as long as desired.

  "To miejsce nie jest zbyt dobre. Jest niedostępne. Spróbuj gdzie indziej.",
  "Rozmieć swoich najemników na podwietlonej częci mapy.",

  // This message is for mercs arriving in sectors.  Ex:  Red has arrived in sector A9.
  // Don't uppercase first character, or add spaces on either end.

  "przybył(a) do sektora",

  // These entries are for button popup help text for the prebattle interface.  All popup help
  // text supports the use of \n to denote new line.  Do not use spaces before or after the \n.
  "|Automatycznie prowadzi walkę za ciebie,\nnie ładujšc planszy.",
  "Atakujšc sektor wroga nie można automatycznie rozstrzygnšć walki.",
  "Wejcie do s|ektora by nawišzać walkę z wrogiem.",
  "Wycofuje oddział do sšsiedniego sekto|ra.", // singular version
  "Wycofuje wszystkie oddziały do sšsiedniego sekto|ra.", // multiple groups with same previous sector

  // various popup messages for battle conditions.

  //%c%d is the sector -- ex:  A9
  "Nieprzyjaciel zatakował oddziały samoobrony w sektorze %c%d.",
  //%c%d is the sector -- ex:  A9
  "Stworzenia zaatakowały oddziały samoobrony w sektorze %c%d.",
  // 1st %d refers to the number of civilians eaten by monsters,  %c%d is the sector -- ex:  A9
  // Note:  the minimum number of civilians eaten will be two.
  "Stworzenia zatakowały i zabiły %d cywili w sektorze %s.",
  //%c%d is the sector -- ex:  A9
  "Nieprzyjaciel zatakował twoich najemników w sektorze %s.  Żaden z twoich najemników nie może walczyć!",
  //%c%d is the sector -- ex:  A9
  "Stworzenia zatakowały twoich najemników w sektorze %s.  Żaden z twoich najemników nie może walczyć!",
];

export let gpGameClockString: string[] /* STR16[] */ = [
  // This is the day represented in the game clock.  Must be very short, 4 characters max.
  "Dzień",
];

// When the merc finds a key, they can get a description of it which
// tells them where and when they found it.
export let sKeyDescriptionStrings: string[] /* STR16[2] */ = [
  "Zn. w sektorze:",
  "Zn. w dniu:",
];

// The headers used to describe various weapon statistics.

export let gWeaponStatsDesc: string[] /* INT16[][14] */ = [
  "Waga (%s):", // change kg to another weight unit if your standard is not kilograms, and TELL SIR-TECH!
  "Stan:",
  "Iloć:", // Number of bullets left in a magazine
  "Zas.:", // Range
  "Siła:", // Damage
  "PA:", // abbreviation for Action Points
  "",
  "=",
  "=",
];

// The headers used for the merc's money.

export let gMoneyStatsDesc: string[] /* INT16[][13] */ = [
  "Kwota",
  "Pozostało:", // this is the overall balance
  "Kwota",
  "Wydzielić:", // the amount he wants to separate from the overall balance to get two piles of money

  "Bieżšce",
  "Saldo",
  "Kwota do",
  "podjęcia",
];

// The health of various creatures, enemies, characters in the game. The numbers following each are for comment
// only, but represent the precentage of points remaining.

export let zHealthStr: string[] /* UINT16[][13] */ = [
  "UMIERAJĽCY", //	>= 0
  "KRYTYCZNY", //	>= 15
  "KIEPSKI", //	>= 30
  "RANNY", //	>= 45
  "ZDROWY", //	>= 60
  "SILNY", // 	>= 75
  "DOSKONAŁY", // 	>= 90
];

export let gzMoneyAmounts: string[] /* STR16[6] */ = [
  "$1000",
  "$100",
  "$10",
  "OK",
  "Wydziel",
  "Podejmij",
];

// short words meaning "Advantages" for "Pros" and "Disadvantages" for "Cons."
export let gzProsLabel: string /* INT16[10] */ = "Zalety:";

export let gzConsLabel: string /* INT16[10] */ = "Wady:";

// Conversation options a player has when encountering an NPC
export let zTalkMenuStrings: string[] /* UINT16[6][SMALL_STRING_LENGTH] */ = [
  "Powtórz", // meaning "Repeat yourself"
  "Przyjanie", // approach in a friendly
  "Bezporednio", // approach directly - let's get down to business
  "Gronie", // approach threateningly - talk now, or I'll blow your face off
  "Daj",
  "Rekrutuj",
];

// Some NPCs buy, sell or repair items. These different options are available for those NPCs as well.
export let zDealerStrings: string[] /* UINT16[4][SMALL_STRING_LENGTH] */ = [
  "Kup/Sprzedaj",
  "Kup",
  "Sprzedaj",
  "Napraw",
];

export let zDialogActions: string[] /* UINT16[1][SMALL_STRING_LENGTH] */ = [
  "OK",
];

// These are vehicles in the game.

export let pVehicleStrings: string[] /* STR16[] */ = [
  "Eldorado",
  "Hummer", // a hummer jeep/truck -- military vehicle
  "Furgonetka z lodami",
  "Jeep",
  "Czołg",
  "Helikopter",
];

export let pShortVehicleStrings: string[] /* STR16[] */ = [
  "Eldor.",
  "Hummer", // the HMVV
  "Furg.",
  "Jeep",
  "Czołg",
  "Heli.", // the helicopter
];

export let zVehicleName: string[] /* STR16[] */ = [
  "Eldorado",
  "Hummer", // a military jeep. This is a brand name.
  "Furg.", // Ice cream truck
  "Jeep",
  "Czołg",
  "Heli.", // an abbreviation for Helicopter
];

// These are messages Used in the Tactical Screen

export let TacticalStr: string[] /* UINT16[][MED_STRING_LENGTH] */ = [
  "Nalot",
  "Udzielić automatycznie pierwszej pomocy?",

  // CAMFIELD NUKE THIS and add quote #66.

  "%s zauważył(a) że dostawa jest niekompletna.",

  // The %s is a string from pDoorTrapStrings

  "Zamek %s.",
  "Brak zamka.",
  "Sukces!",
  "Niepowodzenie.",
  "Sukces!",
  "Niepowodzenie.",
  "Zamek nie ma pułapek.",
  "Sukces!",
  // The %s is a merc name
  "%s nie posiada odpowiedniego klucza.",
  "Zamek został rozbrojony.",
  "Zamek nie ma pułapek.",
  "Zamknięte.",
  "DRZWI",
  "ZABEZP.",
  "ZAMKNIĘTE",
  "OTWARTE",
  "ROZWALONE",
  "Tu jest przełšcznik. Włšczyć go?",
  "Rozbroić pułapkę?",
  "Poprz...",
  "Nast...",
  "Więcej...",

  // In the next 2 strings, %s is an item name

  "%s - położono na ziemi.",
  "%s - przekazano do - %s.",

  // In the next 2 strings, %s is a name

  "%s otrzymał(a) całš zapłatę.",
  "%s - należnoć wobec niej/niego wynosi jeszcze %d.",
  "Wybierz częstotliwoć sygnału detonujšcego:", // in this case, frequency refers to a radio signal
  "Ile tur do eksplozji:", // how much time, in turns, until the bomb blows
  "Ustaw częstotliwoć zdalnego detonatora:", // in this case, frequency refers to a radio signal
  "Rozbroić pułapkę?",
  "Usunšć niebieskš flagę?",
  "Umiecić tutaj niebieskš flagę?",
  "Kończšca tura",

  // In the next string, %s is a name. Stance refers to way they are standing.

  "Na pewno chcesz zaatakować - %s?",
  "Pojazdy nie mogš zmieniać pozycji.",
  "Robot nie może zmieniać pozycji.",

  // In the next 3 strings, %s is a name

  "%s nie może zmienić pozycji w tym miejscu.",
  "%s nie może tu otrzymać pierwszej pomocy.",
  "%s nie potrzebuje pierwszej pomocy.",
  "Nie można ruszyć w to miejsce.",
  "Oddział jest już kompletny. Nie ma miejsca dla nowych rekrutów.", // there's no room for a recruit on the player's team

  // In the next string, %s is a name

  "%s pracuje już dla ciebie.",

  // Here %s is a name and %d is a number

  "%s - należnoć wobec niej/niego wynosi %d$.",

  // In the next string, %s is a name

  "%s - Eskortować tš osobę?",

  // In the next string, the first %s is a name and the second %s is an amount of money (including $ sign)

  "%s - Zatrudnić tš osobę za %s dziennie?",

  // This line is used repeatedly to ask player if they wish to participate in a boxing match.

  "Chcesz walczyć?",

  // In the next string, the first %s is an item name and the
  // second %s is an amount of money (including $ sign)

  "%s - Kupić to za %s?",

  // In the next string, %s is a name

  "%s jest pod eskortš oddziału %d.",

  // These messages are displayed during play to alert the player to a particular situation

  "ZACIĘTA", // weapon is jammed.
  "Robot potrzebuje amunicji kaliber %s.", // Robot is out of ammo
  "Rzucić tam? To niemożliwe.", // Merc can't throw to the destination he selected

  // These are different buttons that the player can turn on and off.

  "Skradanie się (|Z)",
  "Ekran |Mapy",
  "Koniec tury (|D)",
  "Rozmowa",
  "Wycisz",
  "Pozycja do góry (|P|g|U|p)",
  "Poziom kursora (|T|a|b)",
  "Wspinaj się / Zeskocz",
  "Pozycja w dół (|P|g|D|n)",
  "Badać (|C|t|r|l)",
  "Poprzedni najemnik",
  "Następny najemnik (|S|p|a|c|j|a)",
  "|Opcje",
  "Cišgły ogień (|B)",
  "Spójrz/Obróć się (|L)",
  "Zdrowie: %d/%d\nEnergia: %d/%d\nMorale: %s",
  "Co?", // this means "what?"
  "Kont", // an abbrieviation for "Continued"
  "%s ma włšczone potwierdzenia głosowe.",
  "%s ma wyłšczone potwierdzenia głosowe.",
  "Stan: %d/%d\nPaliwo: %d/%d",
  "Wysišd z pojazdu",
  "Zmień oddział ( |S|h|i|f|t |S|p|a|c|j|a )",
  "Prowad",
  "N/D", // this is an acronym for "Not Applicable."
  "Użyj ( Walka wręcz )",
  "Użyj ( Broni palnej )",
  "Użyj ( Broni białej )",
  "Użyj ( Mat. wybuchowych )",
  "Użyj ( Apteczki )",
  "(Łap)",
  "(Przeładuj)",
  "(Daj)",
  "%s - pułapka została uruchomiona.",
  "%s przybył(a) na miejsce.",
  "%s stracił(a) wszystkie Punkty Akcji.",
  "%s jest nieosišgalny(na).",
  "%s ma już założone opatrunki.",
  "%s nie ma bandaży.",
  "Wróg w sektorze!",
  "Nie ma wroga w zasięgu wzroku.",
  "Zbyt mało Punktów Akcji.",
  "Nikt nie używa zdalnego sterowania.",
  "Cišgły ogień opróżnił magazynek!",
  "ŻOŁNIERZ",
  "STWÓR",
  "SAMOOBRONA",
  "CYWIL",
  "Wyjcie z sektora",
  "OK",
  "Anuluj",
  "Wybrany najemnik",
  "Wszyscy najemnicy w oddziale",
  "Id do sektora",
  "Otwórz mapę",
  "Nie można opucić sektora z tej strony.",
  "%s jest zbyt daleko.",
  "Usuń korony drzew",
  "Pokaż korony drzew",
  "WRONA", // Crow, as in the large black bird
  "SZYJA",
  "GŁOWA",
  "TUŁÓW",
  "NOGI",
  "Powiedzieć królowej to, co chce wiedzieć?",
  "Wzór odcisku palca pobrany",
  "Niewłaciwy wzór odcisku palca. Broń bezużyteczna.",
  "Cel osišgnięty",
  "Droga zablokowana",
  "Wpłata/Podjęcie pieniędzy", // Help text over the $ button on the Single Merc Panel
  "Nikt nie potrzebuje pierwszej pomocy.",
  "Zac.", // Short form of JAMMED, for small inv slots
  "Nie można się tam dostać.", // used ( now ) for when we click on a cliff
  "Przejcie zablokowane. Czy chcesz zamienić się miejscami z tš osobš?",
  "Osoba nie chce się przesunšć.",
  // In the following message, '%s' would be replaced with a quantity of money (e.g. $200)
  "Zgadzasz się zapłacić %s?",
  "Zgadzasz się na darmowe leczenie?",
  "Zgadasz się na małżeństwo z Darylem?",
  "Kółko na klucze",
  "Nie możesz tego zrobić z eskortowanš osobš.",
  "Oszczędzić Krotta?",
  "Poza zasięgiem broni",
  "Górnik",
  "Pojazdem można podróżować tylko pomiędzy sektorami",
  "Teraz nie można automatycznie udzielić pierwszej pomocy",
  "Przejcie zablokowane dla - %s",
  "Twoi najemnicy, schwytani przez żołnierzy Deidranny, sš tutaj uwięzieni!",
  "Zamek został trafiony",
  "Zamek został zniszczony",
  "Kto inny majstruje przy tych drzwiach.",
  "Stan: %d/%d\nPaliwo: %d/%d",
  "%s nie widzi - %s.", // Cannot see person trying to talk to
];

// Varying helptext explains (for the "Go to Sector/Map" checkbox) what will happen given different circumstances in the "exiting sector" interface.
export let pExitingSectorHelpText: string[] /* STR16[] */ = [
  // Helptext for the "Go to Sector" checkbox button, that explains what will happen when the box is checked.
  "Jeli zaznaczysz tę opcję, to sšsiedni sektor zostanie natychmiast załadowany.",
  "Jeli zaznaczysz tę opcję, to na czas podróży pojawi się automatycznie ekran mapy.",

  // If you attempt to leave a sector when you have multiple squads in a hostile sector.
  "Ten sektor jest okupowany przez wroga i nie możesz tu zostawić najemników.\nMusisz uporać się z tš sytuacjš zanim załadujesz inny sektor.",

  // Because you only have one squad in the sector, and the "move all" option is checked, the "go to sector" option is locked to on.
  // The helptext explains why it is locked.
  "Gdy wyprowadzisz swoich pozostałych najemników z tego sektora,\nsšsiedni sektor zostanie automatycznie załadowany.",
  "Gdy wyprowadzisz swoich pozostałych najemników z tego sektora,\nto na czas podróży pojawi się automatycznie ekran mapy.",

  // If an EPC is the selected merc, it won't allow the merc to leave alone as the merc is being escorted.  The "single" button is disabled.
  "%s jest pod eskortš twoich najemników i nie może bez nich opucić tego sektora.",

  // If only one conscious merc is left and is selected, and there are EPCs in the squad, the merc will be prohibited from leaving alone.
  // There are several strings depending on the gender of the merc and how many EPCs are in the squad.
  // DO NOT USE THE NEWLINE HERE AS IT IS USED FOR BOTH HELPTEXT AND SCREEN MESSAGES!
  "%s nie może sam opucić tego sektora, gdyż %s jest pod jego eskortš.", // male singular
  "%s nie może sama opucić tego sektora, gdyż %s jest pod jej eskortš.", // female singular
  "%s nie może sam opucić tego sektora, gdyż eskortuje inne osoby.", // male plural
  "%s nie może sama opucić tego sektora, gdyż eskortuje inne osoby.", // female plural

  // If one or more of your mercs in the selected squad aren't in range of the traversal area, then the  "move all" option is disabled,
  // and this helptext explains why.
  "Wszyscy twoi najemnicy muszš być w pobliżu,\naby oddział mógł się przemieszczać.",

  "", // UNUSED

  // Standard helptext for single movement.  Explains what will happen (splitting the squad)
  "Jeli zaznaczysz tę opcję, %s będzie podróżować w pojedynkę\ni automatycznie znajdzie się w osobnym oddziale.",

  // Standard helptext for all movement.  Explains what will happen (moving the squad)
  "Jeli zaznaczysz tę opcję, aktualnie\nwybrany oddział opuci ten sektor.",

  // This strings is used BEFORE the "exiting sector" interface is created.  If you have an EPC selected and you attempt to tactically
  // traverse the EPC while the escorting mercs aren't near enough (or dead, dying, or unconscious), this message will appear and the
  //"exiting sector" interface will not appear.  This is just like the situation where
  // This string is special, as it is not used as helptext.  Do not use the special newline character (\n) for this string.
  "%s jest pod eskortš twoich najemników i nie może bez nich opucić tego sektora. Aby opucić sektor twoi najemnicy muszš być w pobliżu.",
];

export let pRepairStrings: string[] /* STR16[] */ = [
  "Wyposażenie", // tell merc to repair items in inventory
  "Baza rakiet Z-P", // tell merc to repair SAM site - SAM is an acronym for Surface to Air Missile
  "Anuluj", // cancel this menu
  "Robot", // repair the robot
];

// NOTE: combine prestatbuildstring with statgain to get a line like the example below.
// "John has gained 3 points of marksmanship skill."

export let sPreStatBuildString: string[] /* STR16[] */ = [
  "traci", // the merc has lost a statistic
  "zyskuje", // the merc has gained a statistic
  "pkt.", // singular
  "pkt.", // plural
  "pkt.", // singular
  "pkt.", // plural
];

export let sStatGainStrings: string[] /* STR16[] */ = [
  "zdrowia.",
  "zwinnoci.",
  "zręcznoci.",
  "inteligencji.",
  "umiejętnoci medycznych.",
  "umiejętnoci w dziedzinie materiałów wybuchowych.",
  "umiejętnoci w dziedzinie mechaniki.",
  "umiejętnoci strzeleckich.",
  "dowiadczenia.",
  "siły.",
  "umiejętnoci dowodzenia.",
];

export let pHelicopterEtaStrings: string[] /* STR16[] */ = [
  "Całkowita trasa:  ", // total distance for helicopter to travel
  " Bezp.:   ", // distance to travel to destination
  " Niebezp.:", // distance to return from destination to airport
  "Całkowity koszt: ", // total cost of trip by helicopter
  "PCP:  ", // ETA is an acronym for "estimated time of arrival"
  "Helikopter ma mało paliwa i musi wylšdować na terenie wroga.", // warning that the sector the helicopter is going to use for refueling is under enemy control ->
  "Pasażerowie: ",
  "Wybór Skyridera lub pasażerów?",
  "Skyrider",
  "Pasażerowie",
];

export let sMapLevelString: string[] /* STR16[] */ = [
  "Poziom:", // what level below the ground is the player viewing in mapscreen
];

export let gsLoyalString: string[] /* STR16[] */ = [
  "Lojalnoci", // the loyalty rating of a town ie : Loyal 53%
];

// error message for when player is trying to give a merc a travel order while he's underground.

export let gsUndergroundString: string[] /* STR16[] */ = [
  "nie można wydawać rozkazów podróży pod ziemiš.",
];

export let gsTimeStrings: string[] /* STR16[] */ = [
  "g", // hours abbreviation
  "m", // minutes abbreviation
  "s", // seconds abbreviation
  "d", // days abbreviation
];

// text for the various facilities in the sector

export let sFacilitiesStrings: string[] /* STR16[] */ = [
  "Brak",
  "Szpital",
  "Przemysł",
  "Więzienie",
  "Baza wojskowa",
  "Lotnisko",
  "Strzelnica", // a field for soldiers to practise their shooting skills
];

// text for inventory pop up button

export let pMapPopUpInventoryText: string[] /* STR16[] */ = [
  "Inwentarz",
  "Zamknij",
];

// town strings

export let pwTownInfoStrings: string[] /* STR16[] */ = [
  "Rozmiar", // 0 // size of the town in sectors
  "", // blank line, required
  "Pod kontrolš", // how much of town is controlled
  "Brak", // none of this town
  "Przynależna kopalnia", // mine associated with this town
  "Lojalnoć", // 5 // the loyalty level of this town
  "Wyszkolonych", // the forces in the town trained by the player
  "",
  "Główne obiekty", // main facilities in this town
  "Poziom", // the training level of civilians in this town
  "Szkolenie cywili", // 10 // state of civilian training in town
  "Samoobrona", // the state of the trained civilians in the town
];

// Mine strings

export let pwMineStrings: string[] /* STR16[] */ = [
  "Kopalnia", // 0
  "Srebro",
  "Złoto",
  "Dzienna produkcja",
  "Możliwa produkcja",
  "Opuszczona", // 5
  "Zamknięta",
  "Na wyczerpaniu",
  "Produkuje",
  "Stan",
  "Tempo produkcji",
  "Typ złoża", // 10
  "Kontrola miasta",
  "Lojalnoć miasta",
  //	L"Górnicy",
];

// blank sector strings

export let pwMiscSectorStrings: string[] /* STR16[] */ = [
  "Siły wroga",
  "Sektor",
  "Przedmiotów",
  "Nieznane",
  "Pod kontrolš",
  "Tak",
  "Nie",
];

// error strings for inventory

export let pMapInventoryErrorString: string[] /* STR16[] */ = [
  "%s jest zbyt daleko.", // Merc is in sector with item but not close enough
  "Nie można wybrać tego najemnika.", // MARK CARTER
  "%s nie może stšd zabrać tego przedmiotu, gdyż nie jest w tym sektorze.",
  "Podczas walki nie można korzystać z tego panelu.",
  "Podczas walki nie można korzystać z tego panelu.",
  "%s nie może tu zostawić tego przedmiotu, gdyż nie jest w tym sektorze.",
];

export let pMapInventoryStrings: string[] /* STR16[] */ = [
  "Położenie", // sector these items are in
  "Razem przedmiotów", // total number of items in sector
];

// help text for the user

export let pMapScreenFastHelpTextList: string[] /* STR16[] */ = [
  "Kliknij w kolumnie 'Przydz.', aby przydzielić najemnika do innego oddziału lub wybranego zadania.",
  "Aby wyznaczyć najemnikowi cel w innym sektorze, kliknij pole w kolumnie 'Cel'.",
  "Gdy najemnicy otrzymajš już rozkaz przemieszczenia się, kompresja czasu pozwala im szybciej dotrzeć na miejsce.",
  "Kliknij lewym klawiszem aby wybrać sektor. Kliknij ponownie aby wydać najemnikom rozkazy przemieszczenia, lub kliknij prawym klawiszem by uzyskać informacje o sektorze.",
  "Nacinij w dowolnym momencie klawisz 'H' by wywietlić okienko pomocy.",
  "Próbny tekst",
  "Próbny tekst",
  "Próbny tekst",
  "Próbny tekst",
  "Niewiele możesz tu zrobić, dopóki najemnicy nie przylecš do Arulco. Gdy już zbierzesz swój oddział, kliknij przycisk Kompresji Czasu, w prawym dolnym rogu. W ten sposób twoi najemnicy szybciej dotrš na miejsce.",
];

// movement menu text

export let pMovementMenuStrings: string[] /* STR16[] */ = [
  "Przemieć najemników", // title for movement box
  "Nanie trasę podróży", // done with movement menu, start plotting movement
  "Anuluj", // cancel this menu
  "Inni", // title for group of mercs not on squads nor in vehicles
];

export let pUpdateMercStrings: string[] /* STR16[] */ = [
  "Oj:", // an error has occured
  "Wygasł kontrakt najemników:", // this pop up came up due to a merc contract ending
  "Najemnicy wypełnili zadanie:", // this pop up....due to more than one merc finishing assignments
  "Najemnicy wrócili do pracy:", // this pop up ....due to more than one merc waking up and returing to work
  "Odpoczywajšcy najemnicy:", // this pop up ....due to more than one merc being tired and going to sleep
  "Wkrótce wygasnš kontrakty:", // this pop up came up due to a merc contract ending
];

// map screen map border buttons help text

export let pMapScreenBorderButtonHelpText: string[] /* STR16[] */ = [
  "Pokaż miasta (|W)",
  "Pokaż kopalnie (|M)",
  "Pokaż oddziały i wrogów (|T)",
  "Pokaż przestrzeń powietrznš (|A)",
  "Pokaż przedmioty (|I)",
  "Pokaż samoobronę i wrogów (|Z)",
];

export let pMapScreenBottomFastHelp: string[] /* STR16[] */ = [
  "|Laptop",
  "Ekran taktyczny (|E|s|c)",
  "|Opcje",
  "Kompresja czasu (|+)", // time compress more
  "Kompresja czasu (|-)", // time compress less
  "Poprzedni komunikat (|S|t|r|z|a|ł|k|a |w |g|ó|r|ę)\nPoprzednia strona (|P|g|U|p)", // previous message in scrollable list
  "Następny komunikat (|S|t|r|z|a|ł|k|a |w |d|ó|ł)\nNastępna strona (|P|g|D|n)", // next message in the scrollable list
  "Włšcz/Wyłšcz kompresję czasu (|S|p|a|c|j|a)", // start/stop time compression
];

export let pMapScreenBottomText: string[] /* STR16[] */ = [
  "Saldo dostępne", // current balance in player bank account
];

export let pMercDeadString: string[] /* STR16[] */ = [
  "%s nie żyje.",
];

export let pDayStrings: string[] /* STR16[] */ = [
  "Dzień",
];

// the list of email sender names

export let pSenderNameList: string[] /* STR16[] */ = [
  "Enrico",
  "Psych Pro Inc",
  "Pomoc",
  "Psych Pro Inc",
  "Speck",
  "R.I.S.",
  "Barry",
  "Blood",
  "Lynx",
  "Grizzly",
  "Vicki",
  "Trevor",
  "Grunty",
  "Ivan",
  "Steroid",
  "Igor",
  "Shadow",
  "Red",
  "Reaper",
  "Fidel",
  "Fox",
  "Sidney",
  "Gus",
  "Buns",
  "Ice",
  "Spider",
  "Cliff",
  "Bull",
  "Hitman",
  "Buzz",
  "Raider",
  "Raven",
  "Static",
  "Len",
  "Danny",
  "Magic",
  "Stephan",
  "Scully",
  "Malice",
  "Dr.Q",
  "Nails",
  "Thor",
  "Scope",
  "Wolf",
  "MD",
  "Meltdown",
  //----------
  "M.I.S. Ubezpieczenia",
  "Bobby Ray",
  "Kingpin",
  "John Kulba",
  "A.I.M.",
];

// next/prev strings

export let pTraverseStrings: string[] /* STR16[] */ = [
  "Poprzedni",
  "Następny",
];

// new mail notify string

export let pNewMailStrings: string[] /* STR16[] */ = [
  "Masz nowš pocztę...",
];

// confirm player's intent to delete messages

export let pDeleteMailStrings: string[] /* STR16[] */ = [
  "Usunšć wiadomoć?",
  "Usunšć wiadomoć?",
];

// the sort header strings

export let pEmailHeaders: string[] /* STR16[] */ = [
  "Od:",
  "Temat:",
  "Dzień:",
];

// email titlebar text

export let pEmailTitleText: string[] /* STR16[] */ = [
  "Skrzynka odbiorcza",
];

// the financial screen strings
export let pFinanceTitle: string[] /* STR16[] */ = [
  "Księgowy Plus", // the name we made up for the financial program in the game
];

export let pFinanceSummary: string[] /* STR16[] */ = [
  "Wypłata:", // credit (subtract from) to player's account
  "Wpłata:", // debit (add to) to player's account
  "Wczorajsze wpływy:",
  "Wczorajsze dodatkowe wpływy:",
  "Wczorajsze wydatki:",
  "Saldo na koniec dnia:",
  "Dzisiejsze wpływy:",
  "Dzisiejsze dodatkowe wpływy:",
  "Dzisiejsze wydatki:",
  "Saldo dostępne:",
  "Przewidywane wpływy:",
  "Przewidywane saldo:", // projected balance for player for tommorow
];

// headers to each list in financial screen

export let pFinanceHeaders: string[] /* STR16[] */ = [
  "Dzień", // the day column
  "Ma", // the credits column
  "Winien", // the debits column
  "Transakcja", // transaction type - see TransactionText below
  "Saldo", // balance at this point in time
  "Strona", // page number
  "Dzień (dni)", // the day(s) of transactions this page displays
];

export let pTransactionText: string[] /* STR16[] */ = [
  "Narosłe odsetki", // interest the player has accumulated so far
  "Anonimowa wpłata",
  "Koszt transakcji",
  "Wynajęto -", // Merc was hired
  "Zakupy u Bobby'ego Ray'a", // Bobby Ray is the name of an arms dealer
  "Uregulowanie rachunków w M.E.R.C.",
  "Zastaw na życie dla - %s", // medical deposit for merc
  "Analiza profilu w IMP", // IMP is the acronym for International Mercenary Profiling
  "Ubezpieczneie dla - %s",
  "Redukcja ubezp. dla - %s",
  "Przedł. ubezp. dla - %s", // johnny contract extended
  "Anulowano ubezp. dla - %s",
  "Odszkodowanie za - %s", // insurance claim for merc
  "1 dzień", // merc's contract extended for a day
  "1 tydzień", // merc's contract extended for a week
  "2 tygodnie", // ... for 2 weeks
  "Przychód z kopalni",
  "", // String nuked
  "Zakup kwiatów",
  "Pełny zwrot zastawu za - %s",
  "Częciowy zwrot zastawu za - %s",
  "Brak zwrotu zastawu za - %s",
  "Zapłata dla - %s", // %s is the name of the npc being paid
  "Transfer funduszy do - %s", // transfer funds to a merc
  "Transfer funduszy od - %s", // transfer funds from a merc
  "Samoobrona w - %s", // initial cost to equip a town's militia
  "Zakupy u - %s.", // is used for the Shop keeper interface.  The dealers name will be appended to the end of the string.
  "%s wpłacił(a) pienišdze.",
];

export let pTransactionAlternateText: string[] /* STR16[] */ = [
  "Ubezpieczenie dla -", // insurance for a merc
  "Przedł. kontrakt z - %s o 1 dzień.", // entend mercs contract by a day
  "Przedł. kontrakt z - %s o 1 tydzień.",
  "Przedł. kontrakt z - %s o 2 tygodnie.",
];

// helicopter pilot payment

export let pSkyriderText: string[] /* STR16[] */ = [
  "Skyriderowi zapłacono %d$", // skyrider was paid an amount of money
  "Skyriderowi trzeba jeszcze zapłacić %d$", // skyrider is still owed an amount of money
  "Skyrider zatankował", // skyrider has finished refueling
  "", // unused
  "", // unused
  "Skyrider jest gotów do kolejnego lotu.", // Skyrider was grounded but has been freed
  "Skyrider nie ma pasażerów. Jeli chcesz przetransportować najemników, zmień ich przydział na POJAZD/HELIKOPTER.",
];

// strings for different levels of merc morale

export let pMoralStrings: string[] /* STR16[] */ = [
  "wietne",
  "Dobre",
  "Stabilne",
  "Słabe",
  "Panika",
  "Złe",
];

// Mercs equipment has now arrived and is now available in Omerta or Drassen.

export let pLeftEquipmentString: string[] /* STR16[] */ = [
  "%s - jego/jej sprzęt jest już w Omercie( A9 ).",
  "%s - jego/jej sprzęt jest już w Drassen( B13 ).",
];

// Status that appears on the Map Screen

export let pMapScreenStatusStrings: string[] /* STR16[] */ = [
  "Zdrowie",
  "Energia",
  "Morale",
  "Stan", // the condition of the current vehicle (its "health")
  "Paliwo", // the fuel level of the current vehicle (its "energy")
];

export let pMapScreenPrevNextCharButtonHelpText: string[] /* STR16[] */ = [
  "Poprzedni najemnik (|S|t|r|z|a|ł|k|a |w |l|e|w|o)", // previous merc in the list
  "Następny najemnik (|S|t|r|z|a|ł|k|a |w |p|r|a|w|o)", // next merc in the list
];

export let pEtaString: string[] /* STR16[] */ = [
  "PCP:", // eta is an acronym for Estimated Time of Arrival
];

export let pTrashItemText: string[] /* STR16[] */ = [
  "Więcej tego nie zobaczysz. Czy na pewno chcesz to zrobić?", // do you want to continue and lose the item forever
  "To wyglšda na co NAPRAWDĘ ważnego. Czy NA PEWNO chcesz to zniszczyć?", // does the user REALLY want to trash this item
];

export let pMapErrorString: string[] /* STR16[] */ = [
  "Oddział nie może się przemieszczać, jeli który z najemników pi.",

  // 1-5
  "Najpierw wyprowad oddział na powierzchnię.",
  "Rozkazy przemieszczenia? To jest sektor wroga!",
  "Aby podróżować najemnicy muszš być przydzieleni do oddziału lub pojazdu.",
  "Nie masz jeszcze ludzi.", // you have no members, can't do anything
  "Najemnik nie może wypełnić tego rozkazu.", // merc can't comply with your order
  // 6-10
  "musi mieć eskortę, aby się przemieszczać. Umieć go w oddziale z eskortš.", // merc can't move unescorted .. for a male
  "musi mieć eskortę, aby się przemieszczać. Umieć jš w oddziale z eskortš.", // for a female
  "Najemnik nie przybył jeszcze do Arulco!",
  "Wyglšda na to, że trzeba wpierw uregulować sprawy kontraktu.",
  "",
  // 11-15
  "Rozkazy przemieszczenia? Trwa walka!",
  "Zaatakowały cię dzikie koty, w sektorze %s!",
  "W sektorze I16 znajduje się co, co wyglšda na legowisko dzikich kotów!",
  "",
  "Baza rakiet Ziemia-Powietrze została przejęta.",
  // 16-20
  "%s - kopalnia została przejęta. Twój dzienny przychód został zredukowany do %s.",
  "Nieprzyjaciel bezkonfliktowo przejšł sektor %s.",
  "Przynajmniej jeden z twoich najemników nie został do tego przydzielony.",
  "%s nie może się przyłšczyć, ponieważ %s jest pełny",
  "%s nie może się przyłšczyć, ponieważ %s jest zbyt daleko.",
  // 21-25
  "%s - kopalnia została przejęta przez siły Deidranny!",
  "Siły Deidranny włanie zaatakowały bazę rakiet Ziemia-Powietrze w - %s.",
  "Siły Deidranny włanie zaatakowały - %s.",
  "Włanie zauważono siły Deidranny w - %s.",
  "Siły Deidranny włanie przejęły - %s.",
  // 26-30
  "Przynajmniej jeden z twoich najemników nie mógł się położyć spać.",
  "Przynajmniej jeden z twoich najemników nie mógł wstać.",
  "Oddziały samoobrony nie pojawiš się dopóki nie zostanš wyszkolone.",
  "%s nie może się w tej chwili przemieszczać.",
  "Żołnierze samoobrony, którzy znajdujš się poza granicami miasta, nie mogš być przeniesieni do innego sektora.",
  // 31-35
  "Nie możesz trenować samoobrony w - %s.",
  "Pusty pojazd nie może się poruszać!",
  "%s ma zbyt wiele ran by podróżować!",
  "Musisz wpierw opucić muzeum!",
  "%s nie żyje!",
  // 36-40
  "%s nie może się zamienić z - %s, ponieważ się porusza",
  "%s nie może w ten sposób wejc do pojazdu",
  "%s nie może się dołšczyć do - %s",
  "Nie możesz kompresować czasu dopóki nie zatrudnisz sobie kilku nowych najemników!",
  "Ten pojazd może się poruszać tylko po drodze!",
  // 41-45
  "Nie można zmieniać przydziału najemników, którzy sš w drodze",
  "Pojazd nie ma paliwa!",
  "%s jest zbyt zmęczony(na) by podróżować.",
  "Żaden z pasażerów nie jest w stanie kierować tym pojazdem.",
  "Jeden lub więcej członków tego oddziału nie może się w tej chwili przemieszczać.",
  // 46-50
  "Jeden lub więcej INNYCH członków tego oddziału nie może się w tej chwili przemieszczać.",
  "Pojazd jest uszkodzony!",
  "Pamiętaj, że w jednym sektorze tylko dwóch najemników może trenować żołnierzy samoobrony.",
  "Robot nie może się poruszać bez operatora. Umieć ich razem w jednym oddziale.",
];

// help text used during strategic route plotting
export let pMapPlotStrings: string[] /* STR16[] */ = [
  "Kliknij ponownie sektor docelowy, aby zatwierdzić trasę podróży, lub kliknij inny sektor, aby jš wydłużyć.",
  "Trasa podróży zatwierdzona.",
  "Cel podróży nie został zmieniony.",
  "Trasa podróży została anulowana.",
  "Trasa podróży została skrócona.",
];

// help text used when moving the merc arrival sector
export let pBullseyeStrings: string[] /* STR16[] */ = [
  "Kliknij sektor, do którego majš przylatywać najemnicy.",
  "Dobrze. Przylatujšcy najemnicy będš zrzucani w %s",
  "Najemnicy nie mogš tu przylatywać. Przestrzeń powietrzna nie jest zabezpieczona!",
  "Anulowano. Sektor zrzutu nie został zmieniony.",
  "Przestrzeń powietrzna nad %s nie jest już bezpieczna! Sektor zrzutu został przesunięty do %s.",
];

// help text for mouse regions

export let pMiscMapScreenMouseRegionHelpText: string[] /* STR16[] */ = [
  "Otwórz wyposażenie (|E|n|t|e|r)",
  "Zniszcz przedmiot",
  "Zamknij wyposażenie (|E|n|t|e|r)",
];

// male version of where equipment is left
export let pMercHeLeaveString: string[] /* STR16[] */ = [
  "Czy %s ma zostawić swój sprzęt w sektorze, w którym się obecnie znajduje (%s), czy w Dressen (B13), skšd odlatuje? ",
  "Czy %s ma zostawić swój sprzęt w sektorze, w którym się obecnie znajduje (%s), czy w Omercie (A9), skšd odlatuje?",
  "wkrótce odchodzi i zostawi swój sprzęt w Omercie (A9).",
  "wkrótce odchodzi i zostawi swój sprzęt w Drassen (B13).",
  "%s wkrótce odchodzi i zostawi swój sprzęt w %s.",
];

// female version
export let pMercSheLeaveString: string[] /* STR16[] */ = [
  "Czy %s ma zostawić swój sprzęt w sektorze, w którym się obecnie znajduje (%s), czy w Dressen (B13), skšd odlatuje? ",
  "Czy %s ma zostawić swój sprzęt w sektorze, w którym się obecnie znajduje (%s), czy w Omercie (A9), skšd odlatuje?",
  "wkrótce odchodzi i zostawi swój sprzęt w Omercie (A9).",
  "wkrótce odchodzi i zostawi swój sprzęt w Drassen (B13).",
  "%s wkrótce odchodzi i zostawi swój sprzęt w %s.",
];

export let pMercContractOverStrings: string[] /* STR16[] */ = [
  " zakończył kontrakt więc wyjechał.", // merc's contract is over and has departed
  " zakończyła kontrakt więc wyjechała.", // merc's contract is over and has departed
  " - jego kontrakt został zerwany więc odszedł.", // merc's contract has been terminated
  " - jej kontrakt został zerwany więc odeszła.", // merc's contract has been terminated
  "Masz za duży dług wobec M.E.R.C. więc %s odchodzi.", // Your M.E.R.C. account is invalid so merc left
];

// Text used on IMP Web Pages

export let pImpPopUpStrings: string[] /* STR16[] */ = [
  "Nieprawidłowy kod dostępu",
  "Czy na pewno chcesz wznowić proces okrelenia profilu?",
  "Wprowad nazwisko oraz płeć",
  "Wstępna kontrola stanu twoich finansów wykazała, że nie stać cię na analizę profilu.",
  "Opcja tym razem nieaktywna.",
  "Aby wykonać profil, musisz mieć miejsce dla przynajmniej jednego członka załogi.",
  "Profil został już wykonany.",
];

// button labels used on the IMP site

export let pImpButtonText: string[] /* STR16[] */ = [
  "O Nas", // about the IMP site
  "ZACZNIJ", // begin profiling
  "Osobowoć", // personality section
  "Atrybuty", // personal stats/attributes section
  "Portret", // the personal portrait selection
  "Głos %d", // the voice selection
  "Gotowe", // done profiling
  "Zacznij od poczštku", // start over profiling
  "Tak, wybieram tš odpowied.",
  "Tak",
  "Nie",
  "Skończone", // finished answering questions
  "Poprz.", // previous question..abbreviated form
  "Nast.", // next question
  "TAK, JESTEM.", // yes, I am certain
  "NIE, CHCĘ ZACZĽĆ OD NOWA.", // no, I want to start over the profiling process
  "TAK",
  "NIE",
  "Wstecz", // back one page
  "Anuluj", // cancel selection
  "Tak.",
  "Nie, Chcę spojrzeć jeszcze raz.",
  "Rejestr", // the IMP site registry..when name and gender is selected
  "Analizuję...", // analyzing your profile results
  "OK",
  "Głos",
];

export let pExtraIMPStrings: string[] /* STR16[] */ = [
  "Aby zaczšć analizę profilu, wybierz osobowoć.",
  "Teraz okrel swoje atrybuty.",
  "Teraz możesz przystšpić do wyboru portretu.",
  "Aby zakończyć proces, wybierz próbkę głosu, która ci najbardziej odpowiada.",
];

export let pFilesTitle: string[] /* STR16[] */ = [
  "Przeglšdarka plików",
];

export let pFilesSenderList: string[] /* STR16[] */ = [
  "Raport Rozp.", // the recon report sent to the player. Recon is an abbreviation for reconissance
  "Intercept #1", // first intercept file .. Intercept is the title of the organization sending the file...similar in function to INTERPOL/CIA/KGB..refer to fist record in files.txt for the translated title
  "Intercept #2", // second intercept file
  "Intercept #3", // third intercept file
  "Intercept #4", // fourth intercept file
  "Intercept #5", // fifth intercept file
  "Intercept #6", // sixth intercept file
];

// Text having to do with the History Log

export let pHistoryTitle: string[] /* STR16[] */ = [
  "Historia",
];

export let pHistoryHeaders: string[] /* STR16[] */ = [
  "Dzień", // the day the history event occurred
  "Strona", // the current page in the history report we are in
  "Dzień", // the days the history report occurs over
  "Położenie", // location (in sector) the event occurred
  "Zdarzenie", // the event label
];

// various history events
// THESE STRINGS ARE "HISTORY LOG" STRINGS AND THEIR LENGTH IS VERY LIMITED.
// PLEASE BE MINDFUL OF THE LENGTH OF THESE STRINGS. ONE WAY TO "TEST" THIS
// IS TO TURN "CHEAT MODE" ON AND USE CONTROL-R IN THE TACTICAL SCREEN, THEN
// GO INTO THE LAPTOP/HISTORY LOG AND CHECK OUT THE STRINGS. CONTROL-R INSERTS
// MANY (NOT ALL) OF THE STRINGS IN THE FOLLOWING LIST INTO THE GAME.
export let pHistoryStrings: string[] /* STR16[] */ = [
  "", // leave this line blank
  // 1-5
  "%s najęty(ta) w A.I.M.", // merc was hired from the aim site
  "%s najęty(ta) w M.E.R.C.", // merc was hired from the aim site
  "%s ginie.", // merc was killed
  "Uregulowano rachunki w M.E.R.C.", // paid outstanding bills at MERC
  "Przyjęto zlecenie od Enrico Chivaldori",
  // 6-10
  "Profil IMP wygenerowany",
  "Podpisano umowę ubezpieczeniowš dla %s.", // insurance contract purchased
  "Anulowano umowę ubezpieczeniowš dla %s.", // insurance contract canceled
  "Wypłata ubezpieczenia za %s.", // insurance claim payout for merc
  "Przedłużono kontrakt z: %s o 1 dzień.", // Extented "mercs name"'s for a day
  // 11-15
  "Przedłużono kontrakt z: %s o 1 tydzień.", // Extented "mercs name"'s for a week
  "Przedłużono kontrakt z: %s o 2 tygodnie.", // Extented "mercs name"'s 2 weeks
  "%s zwolniony(na).", // "merc's name" was dismissed.
  "%s odchodzi.", // "merc's name" quit.
  "przyjęto zadanie.", // a particular quest started
  // 16-20
  "zadanie wykonane.",
  "Rozmawiano szefem kopalni %s", // talked to head miner of town
  "Wyzwolono - %s",
  "Użyto kodu Cheat",
  "Żywnoć powinna być jutro w Omercie",
  // 21-25
  "%s odchodzi, aby wzišć lub z Darylem Hickiem",
  "Wygasł kontrakt z - %s.",
  "%s zrekrutowany(na).",
  "Enrico narzeka na brak postępów",
  "Walka wygrana",
  // 26-30
  "%s - w kopalni kończy się ruda",
  "%s - w kopalni skończyła się ruda",
  "%s - kopalnia została zamknięta",
  "%s - kopalnia została otwarta",
  "Informacja o więzieniu zwanym Tixa.",
  // 31-35
  "Informacja o tajnej fabryce broni zwanej Orta.",
  "Naukowiec w Orcie ofiarował kilka karabinów rakietowych.",
  "Królowa Deidranna robi użytek ze zwłok.",
  "Frank opowiedział o walkach w San Monie.",
  "Pewien pacjent twierdzi, że widział co w kopalni.",
  // 36-40
  "Goć o imieniu Devin sprzedaje materiały wybuchowe.",
  "Spotkanie ze sławynm eks-najemnikiem A.I.M. - Mike'iem!",
  "Tony handluje broniš.",
  "Otrzymano karabin rakietowy od sierżanta Krotta.",
  "Dano Kyle'owi akt własnoci sklepu Angela.",
  // 41-45
  "Madlab zaoferował się zbudować robota.",
  "Gabby potrafi zrobić miksturę chronišcš przed robakami.",
  "Keith wypadł z interesu.",
  "Howard dostarczał cyjanek królowej Deidrannie.",
  "Spotkanie z handlarzem Keithem w Cambrii.",
  // 46-50
  "Spotkanie z aptekarzem Howardem w Balime",
  "Spotkanie z Perko, prowadzšcym mały warsztat.",
  "Spotkanie z Samem z Balime - prowadzi sklep z narzędziami.",
  "Franz handluje sprzętem elektronicznym.",
  "Arnold prowadzi warsztat w Grumm.",
  // 51-55
  "Fredo naprawia sprzęt elektroniczny w Grumm.",
  "Otrzymano darowiznę od bogatego gocia w Balime.",
  "Spotkano Jake'a, który prowadzi złomowisko.",
  "Jaki włóczęga dał nam elektronicznš kartę dostępu.",
  "Przekupiono Waltera, aby otworzył drzwi do piwnicy.",
  // 56-60
  "Dave oferuje darmowe tankowania, jeli będzie miał paliwo.",
  "Greased Pablo's palms.",
  "Kingpin trzyma pienišdze w kopalni w San Mona.",
  "%s wygrał(a) walkę",
  "%s przegrał(a) walkę",
  // 61-65
  "%s zdyskwalifikowany(na) podczas walki",
  "Znaleziono dużo pieniędzy w opuszczonej kopalni.",
  "Spotkano zabójcę nasłanego przez Kingpina.",
  "Utrata kontroli nad sektorem", // ENEMY_INVASION_CODE
  "Sektor obroniony",
  // 66-70
  "Przegrana bitwa", // ENEMY_ENCOUNTER_CODE
  "Fatalna zasadzka", // ENEMY_AMBUSH_CODE
  "Usunieto zasadzkę wroga",
  "Nieudany atak", // ENTERING_ENEMY_SECTOR_CODE
  "Udany atak!",
  // 71-75
  "Stworzenia zaatakowały", // CREATURE_ATTACK_CODE
  "Zabity(ta) przez dzikie koty", // BLOODCAT_AMBUSH_CODE
  "Wyrżnięto dzikie koty",
  "%s zabity(ta)",
  "Przekazano Carmenowi głowę terrorysty",
  "Slay odszedł",
  "Zabito: %s",
];

export let pHistoryLocations: string[] /* STR16[] */ = [
  "N/D", // N/A is an acronym for Not Applicable
];

// icon text strings that appear on the laptop

export let pLaptopIcons: string[] /* STR16[] */ = [
  "E-mail",
  "Sieć",
  "Finanse",
  "Personel",
  "Historia",
  "Pliki",
  "Zamknij",
  "sir-FER 4.0", // our play on the company name (Sirtech) and web surFER
];

// bookmarks for different websites
// IMPORTANT make sure you move down the Cancel string as bookmarks are being added

export let pBookMarkStrings: string[] /* STR16[] */ = [
  "A.I.M.",
  "Bobby Ray's",
  "I.M.P",
  "M.E.R.C.",
  "Pogrzeby",
  "Kwiaty",
  "Ubezpieczenia",
  "Anuluj",
];

export let pBookmarkTitle: string[] /* STR16[] */ = [
  "Ulubione",
  "Aby w przyszłoci otworzyć to menu, kliknij prawym klawiszem myszy.",
];

// When loading or download a web page

export let pDownloadString: string[] /* STR16[] */ = [
  "Ładowanie strony...",
  "Otwieranie strony...",
];

// This is the text used on the bank machines, here called ATMs for Automatic Teller Machine

export let gsAtmSideButtonText: string[] /* STR16[] */ = [
  "OK",
  "We", // take money from merc
  "Daj", // give money to merc
  "Anuluj", // cancel transaction
  "Skasuj", // clear amount being displayed on the screen
];

export let gsAtmStartButtonText: string[] /* STR16[] */ = [
  "Transfer $", // transfer money to merc -- short form
  "Atrybuty", // view stats of the merc
  "Wyposażenie", // view the inventory of the merc
  "Zatrudnienie",
];

export let sATMText: string[] /* STR16[] */ = [
  "Przesłać fundusze?", // transfer funds to merc?
  "OK?", // are we certain?
  "Wprowad kwotę", // enter the amount you want to transfer to merc
  "Wybierz typ", // select the type of transfer to merc
  "Brak rodków", // not enough money to transfer to merc
  "Kwota musi być podzielna przez $10", // transfer amount must be a multiple of $10
];

// Web error messages. Please use foreign language equivilant for these messages.
// DNS is the acronym for Domain Name Server
// URL is the acronym for Uniform Resource Locator

export let pErrorStrings: string[] /* STR16[] */ = [
  "Błšd",
  "Serwer nie posiada DNS.",
  "Sprawd adres URL i spróbuj ponownie.",
  "OK",
  "Niestabilne połšczenie z Hostem. Transfer może trwać dłużej.",
];

export let pPersonnelString: string[] /* STR16[] */ = [
  "Najemnicy:", // mercs we have
];

export let pWebTitle: string[] /* STR16[] */ = [
  "sir-FER 4.0", // our name for thL"sir-FER 4.0",		// our name for the version of the browser, play on company name
];

// The titles for the web program title bar, for each page loaded

export let pWebPagesTitles: string[] /* STR16[] */ = [
  "A.I.M.",
  "A.I.M. Członkowie",
  "A.I.M. Portrety", // a mug shot is another name for a portrait
  "A.I.M. Lista",
  "A.I.M.",
  "A.I.M. Weterani",
  "A.I.M. Polisy",
  "A.I.M. Historia",
  "A.I.M. Linki",
  "M.E.R.C.",
  "M.E.R.C. Konta",
  "M.E.R.C. Rejestracja",
  "M.E.R.C. Indeks",
  "Bobby Ray's",
  "Bobby Ray's - Broń",
  "Bobby Ray's - Amunicja",
  "Bobby Ray's - Pancerz",
  "Bobby Ray's - Różne", // misc is an abbreviation for miscellaneous
  "Bobby Ray's - Używane",
  "Bobby Ray's - Zamówienie pocztowe",
  "I.M.P.",
  "I.M.P.",
  "United Floral Service",
  "United Floral Service - Galeria",
  "United Floral Service - Zamówienie",
  "United Floral Service - Galeria kartek",
  "Malleus, Incus & Stapes - Brokerzy ubezpieczeniowi",
  "Informacja",
  "Kontrakt",
  "Uwagi",
  "McGillicutty - Zakład pogrzebowy",
  "",
  "Nie odnaleziono URL.",
  "Bobby Ray's - Ostatnie dostawy",
  "",
  "",
];

export let pShowBookmarkString: string[] /* STR16[] */ = [
  "Sir-Pomoc",
  "Kliknij ponownie Sieć by otworzyć menu Ulubione.",
];

export let pLaptopTitles: string[] /* STR16[] */ = [
  "Poczta",
  "Przeglšdarka plików",
  "Personel",
  "Księgowy Plus",
  "Historia",
];

export let pPersonnelDepartedStateStrings: string[] /* STR16[] */ = [
  // reasons why a merc has left.
  "mierć w akcji",
  "Zwolnienie",
  "Inny",
  "Małżeństwo",
  "Koniec kontraktu",
  "Rezygnacja",
];
// personnel strings appearing in the Personnel Manager on the laptop

export let pPersonelTeamStrings: string[] /* STR16[] */ = [
  "Bieżšcy oddział",
  "Wyjazdy",
  "Koszt dzienny:",
  "Najwyższy koszt:",
  "Najniższy koszt:",
  "mierć w akcji:",
  "Zwolnienie:",
  "Inny:",
];

export let pPersonnelCurrentTeamStatsStrings: string[] /* STR16[] */ = [
  "Najniższy",
  "redni",
  "Najwyższy",
];

export let pPersonnelTeamStatsStrings: string[] /* STR16[] */ = [
  "ZDR",
  "ZWN",
  "ZRCZ",
  "SIŁA",
  "DOW",
  "INT",
  "DOW",
  "STRZ",
  "MECH",
  "WYB",
  "MED",
];

// horizontal and vertical indices on the map screen

export let pMapVertIndex: string[] /* STR16[] */ = [
  "X",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
];

export let pMapHortIndex: string[] /* STR16[] */ = [
  "X",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
];

export let pMapDepthIndex: string[] /* STR16[] */ = [
  "",
  "-1",
  "-2",
  "-3",
];

// text that appears on the contract button

export let pContractButtonString: string[] /* STR16[] */ = [
  "Kontrakt",
];

// text that appears on the update panel buttons

export let pUpdatePanelButtons: string[] /* STR16[] */ = [
  "Dalej",
  "Stop",
];

// Text which appears when everyone on your team is incapacitated and incapable of battle

export let LargeTacticalStr: string[] /* UINT16[][LARGE_STRING_LENGTH] */ = [
  "Pokonano cię w tym sektorze!",
  "Wróg nie zna litoci i pożera was wszystkich!",
  "Nieprzytomni członkowie twojego oddziału zostali pojmani!",
  "Członkowie twojego oddziału zostali uwięzieni.",
];

// Insurance Contract.c
// The text on the buttons at the bottom of the screen.

export let InsContractText: string[] /* STR16[] */ = [
  "Wstecz",
  "Dalej",
  // L"Akceptuję",
  "OK",
  "Skasuj",
];

// Insurance Info
// Text on the buttons on the bottom of the screen

export let InsInfoText: string[] /* STR16[] */ = [
  "Wstecz",
  "Dalej",
];

// For use at the M.E.R.C. web site. Text relating to the player's account with MERC

export let MercAccountText: string[] /* STR16[] */ = [
  // Text on the buttons on the bottom of the screen
  "Autoryzacja",
  "Strona główna",
  "Konto #:",
  "Najemnik",
  "Dni",
  "Stawka", // 5
  "Opłata",
  "Razem:",
  "Czy na pewno chcesz zatwierdzić płatnoć: %s?", // the %s is a string that contains the dollar amount ( ex. "$150" )
];

// For use at the M.E.R.C. web site. Text relating a MERC mercenary

export let MercInfo: string[] /* STR16[] */ = [
  "Zdrowie",
  "Zwinnoć",
  "Sprawnoć",
  "Siła",
  "Um. dowodz.",
  "Inteligencja",
  "Poz. dowiadczenia",
  "Um. strzeleckie",
  "Zn. mechaniki",
  "Mat. wybuchowe",
  "Wiedza medyczna",

  "Poprzedni",
  "Najmij",
  "Następny",
  "Dodatkowe informacje",
  "Strona główna",
  "Najęty",
  "Koszt:",
  "Dziennie",
  "Nie żyje",

  "Wyglšda na to, że chcesz wynajšć zbyt wielu najemników. Limit wynosi 18.",
  "Niedostępny",
];

// For use at the M.E.R.C. web site. Text relating to opening an account with MERC

export let MercNoAccountText: string[] /* STR16[] */ = [
  // Text on the buttons at the bottom of the screen
  "Otwórz konto",
  "Anuluj",
  "Nie posiadasz konta. Czy chcesz sobie założyć?",
];

// For use at the M.E.R.C. web site. MERC Homepage

export let MercHomePageText: string[] /* STR16[] */ = [
  // Description of various parts on the MERC page
  "Speck T. Kline, założyciel i właciciel",
  "Aby otworzyć konto nacinij tu",
  "Aby zobaczyć konto nacinij tu",
  "Aby obejrzeć akta nacinij tu",
  // The version number on the video conferencing system that pops up when Speck is talking
  "Speck Com v3.2",
];

// For use at MiGillicutty's Web Page.

export let sFuneralString: string[] /* STR16[] */ = [
  "Zakład pogrzebowy McGillicutty, pomaga rodzinom pogršżonym w smutku od 1983.",
  "Kierownik, były najemnik A.I.M. Murray \'Pops\' McGillicutty jest dowiadczonym pracownikiem zakładu pogrzebowego.",
  "Przez całe życie obcował ze mierciš, 'Pops' wie jak trudne sš te chwile.",
  "Zakład pogrzebowy McGillicutty oferuje szeroki zakres usług, od duchowego wsparcia po rekonstrukcję silnie zniekształconych zwłok.",
  "Pozwól by McGillicutty ci pomógł a twój ukochany będzie spoczywał w pokoju.",

  // Text for the various links available at the bottom of the page
  "WYLIJ KWIATY",
  "KOLEKCJA TRUMIEN I URN",
  "USŁUGI KREMA- CYJNE",
  "USŁUGI PLANOWANIA POGRZEBU",
  "KARTKI POGRZE- BOWE",

  // The text that comes up when you click on any of the links ( except for send flowers ).
  "Niestety, z powodu mierci w rodzinie, nie działajš jeszcze wszystkie elementy tej strony.",
  "Przepraszamy za powyższe uniedogodnienie.",
];

// Text for the florist Home page

export let sFloristText: string[] /* STR16[] */ = [
  // Text on the button on the bottom of the page

  "Galeria",

  // Address of United Florist

  "\"Zrzucamy z samolotu w dowolnym miejscu\"",
  "1-555-POCZUJ-MNIE",
  "Ul. Nosowska 333, Zapuszczone miasto, CA USA 90210",
  "http://www.poczuj-mnie.com",

  // detail of the florist page

  "Działamy szybko i sprawnie!",
  "Gwarantujemy dostawę w dowolny punkt na Ziemi, następnego dnia po złożeniu zamówienia!",
  "Oferujemy najniższe ceny na wiecie!",
  "Pokaż nam ofertę z niższš cenš, a dostaniesz w nagrodę tuzin róż, za darmo!",
  "Latajšca flora, fauna i kwiaty od 1981.",
  "Nasz ozdobiony bombowiec zrzuci twój bukiet w promieniu co najwyżej dziesięciu mil od żšdanego miejsca. Kiedy tylko zechcesz!",
  "Pozwól nam zaspokoić twoje kwieciste fantazje.",
  "Bruce, nasz wiatowej renomy projektant bukietów, zerwie dla ciebie najwieższe i najwspanialsze kwiaty z naszej szklarni.",
  "I pamiętaj, jeli czego nie mamy, możemy to szybko zasadzić!",
];

// Florist OrderForm

export let sOrderFormText: string[] /* STR16[] */ = [
  // Text on the buttons

  "Powrót",
  "Wylij",
  "Skasuj",
  "Galeria",

  "Nazwa bukietu:",
  "Cena:", // 5
  "Zamówienie numer:",
  "Czas dostawy",
  "nast. dnia",
  "dostawa gdy to będzie możliwe",
  "Miejsce dostawy", // 10
  "Dodatkowe usługi",
  "Zgnieciony bukiet($10)",
  "Czarne Róże($20)",
  "Zwiędnięty bukiet($10)",
  "Ciasto owocowe (jeżeli będzie)($10)", // 15
  "Osobiste kondolencje:",
  "Ze względu na rozmiar karteczek, tekst nie może zawierać więcej niż 75 znaków.",
  "...możesz też przejrzeć nasze",

  "STANDARDOWE KARTKI",
  "Informacja o rachunku", // 20

  // The text that goes beside the area where the user can enter their name

  "Nazwisko:",
];

// Florist Gallery.c

export let sFloristGalleryText: string[] /* STR16[] */ = [
  // text on the buttons

  "Poprz.", // abbreviation for previous
  "Nast.", // abbreviation for next

  "Kliknij wybranš pozycję aby złożyć zamówienie.",
  "Uwaga: $10 dodatkowej opłaty za zwiędnięty lub zgnieciony bukiet.",

  // text on the button

  "Główna",
];

// Florist Cards

export let sFloristCards: string[] /* STR16[] */ = [
  "Kliknij swój wybór",
  "Wstecz",
];

// Text for Bobby Ray's Mail Order Site

export let BobbyROrderFormText: string[] /* STR16[] */ = [
  "Formularz zamówienia", // Title of the page
  "Iloć", // The number of items ordered
  "Waga (%s)", // The weight of the item
  "Nazwa", // The name of the item
  "Cena", // the item's weight
  "Wartoć", // 5	// The total price of all of items of the same type
  "W sumie", // The sub total of all the item totals added
  "Transport", // S&H is an acronym for Shipping and Handling
  "Razem", // The grand total of all item totals + the shipping and handling
  "Miejsce dostawy",
  "Czas dostawy", // 10	// See below
  "Koszt (za %s.)", // The cost to ship the items
  "Ekspres - 24h", // Gets deliverd the next day
  "2 dni robocze", // Gets delivered in 2 days
  "Standardowa dostawa", // Gets delivered in 3 days
  " Wyczyć", // 15			// Clears the order page
  " Akceptuję", // Accept the order
  "Wstecz", // text on the button that returns to the previous page
  "Strona główna", // Text on the button that returns to the home page
  "* oznacza używane rzeczy", // Disclaimer stating that the item is used
  "Nie stać cię na to.", // 20	// A popup message that to warn of not enough money
  "<BRAK>", // Gets displayed when there is no valid city selected
  "Miejsce docelowe przesyłki: %s. Potwierdzasz?", // A popup that asks if the city selected is the correct one
  "Waga przesyłki*", // Displays the weight of the package
  "* Min. Waga", // Disclaimer states that there is a minimum weight for the package
  "Dostawy",
];

// This text is used when on the various Bobby Ray Web site pages that sell items

export let BobbyRText: string[] /* STR16[] */ = [
  "Zamów", // Title

  "Kliknij wybrane towary. Lewym klawiszem zwiększasz iloć towaru, a prawym zmniejszasz. Gdy już skompletujesz swoje zakupy przejd do formularza zamówienia.", // instructions on how to order

  // Text on the buttons to go the various links

  "Poprzednia", //
  "Broń", // 3
  "Amunicja", // 4
  "Ochraniacze", // 5
  "Różne", // 6	//misc is an abbreviation for miscellaneous
  "Używane", // 7
  "Następna",
  "FORMULARZ",
  "Strona główna", // 10

  // The following 2 lines are used on the Ammunition page.
  // They are used for help text to display how many items the player's merc has
  // that can use this type of ammo

  "Twój zespół posiada", // 11
  "szt. broni do której pasuje amunicja tego typu", // 12

  // The following lines provide information on the items

  "Waga:", // Weight of all the items of the same type
  "Kal:", // the caliber of the gun
  "Mag:", // number of rounds of ammo the Magazine can hold
  "Zas:", // The range of the gun
  "Siła:", // Damage of the weapon
  "CS:", // Weapon's Rate Of Fire, acroymn ROF
  "Koszt:", // Cost of the item
  "Na stanie:", // The number of items still in the store's inventory
  "Iloć na zamów.:", // The number of items on order
  "Uszkodz.", // If the item is damaged
  "Waga:", // the Weight of the item
  "Razem:", // The total cost of all items on order
  "* Stan: %%", // if the item is damaged, displays the percent function of the item

  // Popup that tells the player that they can only order 10 items at a time

  "Przepraszamy za to utrudnienie, ale na jednym zamówieniu może się znajdować tylko 10 pozycji! Jeli potrzebujesz więcej, złóż kolejne zamówienie.",

  // A popup that tells the user that they are trying to order more items then the store has in stock

  "Przykro nam. Chwilowo nie mamy tego więcej na magazynie. Proszę spróbować póniej.",

  // A popup that tells the user that the store is temporarily sold out

  "Przykro nam, ale chwilowo nie mamy tego towaru na magazynie",
];

// Text for Bobby Ray's Home Page

export let BobbyRaysFrontText: string[] /* STR16[] */ = [
  // Details on the web site

  "Tu znajdziesz nowoci z dziedziny broni i osprzętu wojskowego",
  "Zaspokoimy wszystkie twoje potrzeby w dziedzinie materiałów wybuchowych",
  "UŻYWANE RZECZY",

  // Text for the various links to the sub pages

  "RÓŻNE",
  "BROŃ",
  "AMUNICJA", // 5
  "OCHRANIACZE",

  // Details on the web site

  "Jeli MY tego nie mamy, to znaczy, że nigdzie tego nie dostaniesz!",
  "W trakcie budowy",
];

// Text for the AIM page.
// This is the text used when the user selects the way to sort the aim mercanaries on the AIM mug shot page

export let AimSortText: string[] /* STR16[] */ = [
  "Członkowie A.I.M.", // Title

  "Sortuj wg:", // Title for the way to sort

  // sort by...

  "Ceny",
  "Dowiadczenia",
  "Um. strzeleckich",
  "Um. med.",
  "Zn. mat. wyb.",
  "Zn. mechaniki",

  // Text of the links to other AIM pages

  "Portrety najemników",
  "Akta najemnika",
  "Pokaż galerię byłych członków A.I.M.",

  // text to display how the entries will be sorted

  "Rosnšco",
  "Malejšco",
];

// Aim Policies.c
// The page in which the AIM policies and regulations are displayed

export let AimPolicyText: string[] /* STR16[] */ = [
  // The text on the buttons at the bottom of the page

  "Poprzednia str.",
  "Strona główna",
  "Przepisy",
  "Następna str.",
  "Rezygnuję",
  "Akceptuję",
];

// Aim Member.c
// The page in which the players hires AIM mercenaries

// Instructions to the user to either start video conferencing with the merc, or to go the mug shot index

export let AimMemberText: string[] /* STR16[] */ = [
  "Lewy klawisz myszy",
  "kontakt z najemnikiem",
  "Prawy klawisz myszy",
  "lista portretów",
];

// Aim Member.c
// The page in which the players hires AIM mercenaries

export let CharacterInfo: string[] /* STR16[] */ = [
  // The various attributes of the merc

  "Zdrowie",
  "Zwinnoć",
  "Sprawnoć",
  "Siła",
  "Um. dowodzenia",
  "Inteligencja",
  "Poziom dow.",
  "Um. strzeleckie",
  "Zn. mechaniki",
  "Zn. mat. wyb.",
  "Wiedza med.", // 10

  // the contract expenses' area

  "Zapłata",
  "Czas",
  "1 dzień",
  "1 tydzień",
  "2 tygodnie",

  // text for the buttons that either go to the previous merc,
  // start talking to the merc, or go to the next merc

  "Poprzedni",
  "Kontakt",
  "Następny",

  "Dodatkowe informacje", // Title for the additional info for the merc's bio
  "Aktywni członkowie", // 20		// Title of the page
  "Opcjonalne wyposażenie:", // Displays the optional gear cost
  "Wymagany jest zastaw na życie", // If the merc required a medical deposit, this is displayed
];

// Aim Member.c
// The page in which the player's hires AIM mercenaries

// The following text is used with the video conference popup

export let VideoConfercingText: string[] /* STR16[] */ = [
  "Wartoć kontraktu:", // Title beside the cost of hiring the merc

  // Text on the buttons to select the length of time the merc can be hired

  "Jeden dzień",
  "Jeden tydzień",
  "Dwa tygodnie",

  // Text on the buttons to determine if you want the merc to come with the equipment

  "Bez sprzętu",
  "We sprzęt",

  // Text on the Buttons

  "TRANSFER", // to actually hire the merc
  "ANULUJ", // go back to the previous menu
  "WYNAJMIJ", // go to menu in which you can hire the merc
  "ROZŁĽCZ", // stops talking with the merc
  "OK",
  "NAGRAJ SIĘ", // if the merc is not there, you can leave a message

  // Text on the top of the video conference popup

  "Wideo konferencja z - ",
  "Łšczę. . .",

  "z zastawem" // Displays if you are hiring the merc with the medical deposit
];

// Aim Member.c
// The page in which the player hires AIM mercenaries

// The text that pops up when you select the TRANSFER FUNDS button

export let AimPopUpText: string[] /* STR16[] */ = [
  "TRANSFER ZAKOŃCZONY POMYLNIE", // You hired the merc
  "PRZEPROWADZENIE TRANSFERU NIE MOŻLIWE", // Player doesn't have enough money, message 1
  "BRAK RODKÓW", // Player doesn't have enough money, message 2

  // if the merc is not available, one of the following is displayed over the merc's face

  "Wynajęto",
  "Proszę zostaw wiadomoć",
  "Nie żyje",

  // If you try to hire more mercs than game can support

  "Masz już pełny zespół 18 najemników.",

  "Nagrana wiadomoć",
  "Wiadomoć zapisana",
];

// AIM Link.c

export let AimLinkText: string[] /* STR16[] */ = [
  "A.I.M. Linki", // The title of the AIM links page
];

// Aim History

// This page displays the history of AIM

export let AimHistoryText: string[] /* STR16[] */ = [
  "A.I.M. Historia", // Title

  // Text on the buttons at the bottom of the page

  "Poprzednia str.",
  "Strona główna",
  "Byli członkowie",
  "Następna str.",
];

// Aim Mug Shot Index

// The page in which all the AIM members' portraits are displayed in the order selected by the AIM sort page.

export let AimFiText: string[] /* STR16[] */ = [
  // displays the way in which the mercs were sorted

  "ceny",
  "dowiadczenia",
  "um. strzeleckich",
  "um. medycznych",
  "zn. materiałów wyb.",
  "zn. mechaniki",

  // The title of the page, the above text gets added at the end of this text

  "Członkowie A.I.M. posortowani rosnšco wg %s",
  "Członkowie A.I.M. posortowani malejšco wg %s",

  // Instructions to the players on what to do

  "Lewy klawisz",
  "Wybór najemnika", // 10
  "Prawy klawisz",
  "Opcje sortowania",

  // Gets displayed on top of the merc's portrait if they are...

  "Wyjechał(a)",
  "Nie żyje", // 14
  "Wynajęto",
];

// AimArchives.
// The page that displays information about the older AIM alumni merc... mercs who are no longer with AIM

export let AimAlumniText: string[] /* STR16[] */ = [
  "STRONA 1",
  "STRONA 2",
  "STRONA 3",

  "Byli członkowie A.I.M.", // Title of the page

  "OK" // Stops displaying information on selected merc
];

// AIM Home Page

export let AimScreenText: string[] /* STR16[] */ = [
  // AIM disclaimers

  "Znaki A.I.M. i logo A.I.M. sš prawnie chronione w większoci krajów.",
  "Więc nawet nie myl o próbie ich podrobienia.",
  "Copyright 1998-1999 A.I.M., Ltd. All rights reserved.",

  // Text for an advertisement that gets displayed on the AIM page

  "United Floral Service",
  "\"Zrzucamy gdziekolwiek\"", // 10
  "Zrób to jak należy...",
  "...za pierwszym razem",
  "Broń i akcesoria, jeli czego nie mamy, to tego nie potrzebujesz.",
];

// Aim Home Page

export let AimBottomMenuText: string[] /* STR16[] */ = [
  // Text for the links at the bottom of all AIM pages
  "Strona główna",
  "Członkowie",
  "Byli członkowie",
  "Przepisy",
  "Historia",
  "Linki",
];

// ShopKeeper Interface
// The shopkeeper interface is displayed when the merc wants to interact with
// the various store clerks scattered through out the game.

export let SKI_Text: string[] /* STR16[] */ = [
  "TOWARY NA STANIE", // Header for the merchandise available
  "STRONA", // The current store inventory page being displayed
  "KOSZT OGÓŁEM", // The total cost of the the items in the Dealer inventory area
  "WARTOĆ OGÓŁEM", // The total value of items player wishes to sell
  "WYCENA", // Button text for dealer to evaluate items the player wants to sell
  "TRANSAKCJA", // Button text which completes the deal. Makes the transaction.
  "OK", // Text for the button which will leave the shopkeeper interface.
  "KOSZT NAPRAWY", // The amount the dealer will charge to repair the merc's goods
  "1 GODZINA", // SINGULAR! The text underneath the inventory slot when an item is given to the dealer to be repaired
  "%d GODZIN(Y)", // PLURAL!   The text underneath the inventory slot when an item is given to the dealer to be repaired
  "NAPRAWIONO", // Text appearing over an item that has just been repaired by a NPC repairman dealer
  "Brak miejsca by zaoferować więcej rzeczy.", // Message box that tells the user there is no more room to put there stuff
  "%d MINUT(Y)", // The text underneath the inventory slot when an item is given to the dealer to be repaired
  "Upuć przedmiot na ziemię.",
];

// ShopKeeper Interface
// for the bank machine panels. Referenced here is the acronym ATM, which means Automatic Teller Machine

export let SkiAtmText: string[] /* STR16[] */ = [
  // Text on buttons on the banking machine, displayed at the bottom of the page
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "OK", // Transfer the money
  "We", // Take money from the player
  "Daj", // Give money to the player
  "Anuluj", // Cancel the transfer
  "Skasuj", // Clear the money display
];

// Shopkeeper Interface
export let gzSkiAtmText: string[] /* STR16[] */ = [
  // Text on the bank machine panel that....
  "Wybierz", // tells the user to select either to give or take from the merc
  "Wprowad kwotę", // Enter the amount to transfer
  "Transfer gotówki do najemnika", // Giving money to the merc
  "Transfer gotówki od najemnika", // Taking money from the merc
  "Brak rodków", // Not enough money to transfer
  "Saldo", // Display the amount of money the player currently has
];

export let SkiMessageBoxText: string[] /* STR16[] */ = [
  "Czy chcesz dołożyć %s ze swojego konta, aby pokryć różnicę?",
  "Brak rodków. Brakuje ci %s",
  "Czy chcesz przeznaczyć %s ze swojego konta, aby pokryć koszty?",
  "Popro o rozpoczęcie transakscji",
  "Popro o naprawę wybranych przedmiotów",
  "Zakończ rozmowę",
  "Saldo dostępne",
];

// OptionScreen.c

export let zOptionsText: string[] /* STR16[] */ = [
  // button Text
  "Zapisz grę",
  "Odczytaj grę",
  "Wyjcie",
  "OK",

  // Text above the slider bars
  "Efekty",
  "Dialogi",
  "Muzyka",

  // Confirmation pop when the user selects..
  "Zakończyć grę i wrócić do głównego menu?",

  "Musisz włšczyć opcję dialogów lub napisów.",
];

// SaveLoadScreen
export let zSaveLoadText: string[] /* STR16[] */ = [
  "Zapisz grę",
  "Odczytaj grę",
  "Anuluj",
  "Zapisz wybranš",
  "Odczytaj wybranš",

  "Gra została pomylnie zapisana",
  "BŁĽD podczas zapisu gry!",
  "Gra została pomylnie odczytana",
  "BŁĽD podczas odczytu gry!",

  "Wersja gry w zapisanym pliku różni się od bieżšcej. Prawdopodobnie można bezpiecznie kontynuować. Kontynuować?",
  "Zapisane pliki gier mogš być uszkodzone. Czy chcesz je usunšć?",

// Translators, the next two strings are for the same thing.  The first one is for beta version releases and the second one
// is used for the final version.  Please don't modify the "#ifdef JA2BETAVERSION" or the "#else" or the "#endif" as they are
// used by the compiler and will cause program errors if modified/removed.  It's okay to translate the strings though.
  "Próba odczytu starszej wersji zapisu gry.  Zaktualizować ten zapis i odczytać grę?",

// Translators, the next two strings are for the same thing.  The first one is for beta version releases and the second one
// is used for the final version.  Please don't modify the "#ifdef JA2BETAVERSION" or the "#else" or the "#endif" as they are
// used by the compiler and will cause program errors if modified/removed.  It's okay to translate the strings though.
  "Próba odczytu starszej wersji zapisu gry.  Zaktualizować ten zapis i odczytać grę?",

  "Czy na pewno chcesz nadpisać grę na pozycji %d?",
  "Chcesz odczytać grę z pozycji",

  // The first %d is a number that contains the amount of free space on the users hard drive,
  // the second is the recommended amount of free space.
  "Brak miejsca na dysku twardym.  Na dysku wolne jest %d MB, a wymagane jest przynajmniej %d MB.",

  "Zapisuję...", // When saving a game, a message box with this string appears on the screen

  "Standardowe uzbrojenie",
  "Całe mnóstwo broni",
  "Realistyczna gra",
  "Elementy S-F",

  "Stopień trudnoci",
];

// MapScreen
export let zMarksMapScreenText: string[] /* STR16[] */ = [
  "Poziom mapy",
  "Nie masz jeszcze żołnierzy samoobrony.  Musisz najpierw wytrenować mieszkańców miast.",
  "Dzienny przychód",
  "Najmemnik ma polisę ubezpieczeniowš",
  "%s nie potrzebuje snu.",
  "%s jest w drodze i nie może spać",
  "%s jest zbyt zmęczony(na), spróbuj trochę póniej.",
  "%s prowadzi.",
  "Oddział nie może się poruszać jeżeli jeden z najemników pi.",

  // stuff for contracts
  "Mimo, że możesz opłacić kontrakt, to jednak nie masz gotówki by opłacić składkę ubezpieczeniowš za najemnika.",
  "%s - składka ubezpieczeniowa najemnika będzie kosztować %s za %d dzień(dni). Czy chcesz jš opłacić?",
  "Inwentarz sektora",
  "Najemnik posiada zastaw na życie.",

  // other items
  "Lekarze", // people acting a field medics and bandaging wounded mercs // **************************************NEW******** as of July 09, 1998
  "Pacjenci", // people who are being bandaged by a medic // ****************************************************NEW******** as of July 10, 1998
  "Gotowe", // Continue on with the game after autobandage is complete
  "Przerwij", // Stop autobandaging of patients by medics now
  "Przykro nam, ale ta opcja jest wyłšczona w wersji demo.", // informs player this option/button has been disabled in the demo
  "%s nie ma zestawu narzędzi.",
  "%s nie ma apteczki.",
  "Brak chętnych ludzi do szkolenia, w tej chwili.",
  "%s posiada już maksymalnš liczbę oddziałów samoobrony.",
  "Najemnik ma kontrakt na okrelony czas.",
  "Kontrakt najemnika nie jest ubezpieczony",
];

export let pLandMarkInSectorString: string[] /* STR16[] */ = [
  "Oddział %d zauważył kogo w sektorze %s",
];

// confirm the player wants to pay X dollars to build a militia force in town
export let pMilitiaConfirmStrings: string[] /* STR16[] */ = [
  "Szkolenie oddziału samoobrony będzie kosztowało $", // telling player how much it will cost
  "Zatwierdzasz wydatek?", // asking player if they wish to pay the amount requested
  "Nie stać cię na to.", // telling the player they can't afford to train this town
  "Kontynuować szkolenie samoobrony w - %s (%s %d)?", // continue training this town?
  "Koszt $", // the cost in dollars to train militia
  "( T/N )", // abbreviated yes/no
  "", // unused
  "Szkolenie samoobrony w %d sektorach będzie kosztowało $ %d. %s", // cost to train sveral sectors at once
  "Nie masz %d$, aby wyszkolić samoobronę w tym miecie.",
  "%s musi mieć %d% lojalnoci, aby można było kontynuować szkolenie samoobrony.",
  "Nie możesz już dłużej szkolić samoobrony w miecie %s.",
];

// Strings used in the popup box when withdrawing, or depositing money from the $ sign at the bottom of the single merc panel
export let gzMoneyWithdrawMessageText: string[] /* STR16[] */ = [
  "Jednorazowo możesz wypłacić do 20,000$.",
  "Czy na pewno chcesz wpłacić %s na swoje konto?",
];

export let gzCopyrightText: string[] /* STR16[] */ = [
  "Copyright (C) 1999 Sir-tech Canada Ltd.  All rights reserved.",
];

// option Text
export let zOptionsToggleText: string[] /* STR16[] */ = [
  "Dialogi",
  "Wycisz potwierdzenia",
  "Napisy",
  "Wstrzymuj napisy",
  "Animowany dym",
  "Drastyczne sceny",
  "Nigdy nie ruszaj mojej myszki!",
  "Stara metoda wyboru",
  "Pokazuj trasę ruchu",
  "Pokazuj chybione strzały",
  "Potwierdzenia w trybie Real-Time",
  "Informacja, że najemnik pi/budzi się",
  "Używaj systemu metrycznego",
  "wiatło wokół najemników podczas ruchu",
  "Przycišgaj kursor do najemników",
  "Przycišgaj kursor do drzwi",
  "Pulsujšce przedmioty",
  "Pokazuj korony drzew",
  "Pokazuj siatkę",
  "Pokazuj kursor 3D",
];

// This is the help text associated with the above toggles.
export let zOptionsScreenHelpText: string[] /* STR16[] */ = [
  // speech
  "Włšcz tę opcję, jeli chcesz słuchać dialogów.",

  // Mute Confirmation
  "Włšcza lub wyłšcza głosowe potwierzenia postaci.",

  // Subtitles
  "Włšcza lub wyłšcza napisy podczas dialogów.",

  // Key to advance speech
  "Jeli napisy sš włšczone, opcja ta pozwoli ci spokojnie je przeczytać podczas dialogu.",

  // Toggle smoke animation
  "Wyłšcz tę opcję, aby poprawić płynnoć działania gry.",

  // Blood n Gore
  "Wyłšcz tę opcję, jeli nie lubisz widoku krwi.",

  // Never move my mouse
  "Wyłšcz tę opcję, aby kursor myszki automatycznie ustawiał się nad pojawiajšcymi się okienkami dialogowymi.",

  // Old selection method
  "Włšcz tę opcję, aby wybór postaci działał tak jak w poprzedniej wersji gry.",

  // Show movement path
  "Włšcz tę opcję jeli chcesz widzieć trasę ruchu w trybie Real-Time.",

  // show misses
  "Włšcz tę opcję, aby zobaczyć w co trafiajš twoje kule gdy pudłujesz.",

  // Real Time Confirmation
  "Gdy opcja ta jest włšczona, każdy ruch najemnika w trybie Real-Time będzie wymagał dodatkowego, potwierdzajšcego kliknięcia.",

  // Sleep/Wake notification
  "Gdy opcja ta jest włšczona, wywietlana będzie informacja, że najemnik położył się spać lub wstał i wrócił do pracy.",

  // Use the metric system
  "Gdy opcja ta jest włšczona, gra używa systemu metrycznego.",

  // Merc Lighted movement
  "Gdy opcja ta jest włšczona, teren wokół najemnika będzie owietlony podczas ruchu. Wyłšcz tę opcję, jeli obniża płynnoć gry.",

  // Smart cursor
  "Gdy opcja ta jest włšczona, kursor automatycznie ustawia się na najemnikach gdy znajdzie się w ich pobliżu.",

  // snap cursor to the door
  "Gdy opcja ta jest włšczona, kursor automatycznie ustawi się na drzwiach gdy znajdzie się w ich pobliżu.",

  // glow items
  "Gdy opcja ta jest włšczona, przedmioty pulsujš. ( |I )",

  // toggle tree tops
  "Gdy opcja ta jest włšczona, wywietlane sš korony drzew. ( |T )",

  // toggle wireframe
  "Gdy opcja ta jest włšczona, wywietlane sš zarysy niewidocznych cian. ( |W )",

  "Gdy opcja ta jest włšczona, kursor ruchu wywietlany jest w 3D. ( |Home )",
];

export let gzGIOScreenText: string[] /* STR16[] */ = [
  "POCZĽTKOWE USTAWIENIA GRY",
  "Styl gry",
  "Realistyczny",
  "S-F",
  "Opcje broni",
  "Mnóstwo broni",
  "Standardowe uzbrojenie",
  "Stopień trudnoci",
  "Nowicjusz",
  "Dowiadczony",
  "Ekspert",
  "Ok",
  "Anuluj",
  "Dodatkowe opcje",
  "Nielimitowany czas",
  "Tury limitowane czasowo",
  "Nie działa w wersji demo",
];

export let pDeliveryLocationStrings: string[] /* STR16[] */ = [
  "Austin", // Austin, Texas, USA
  "Bagdad", // Baghdad, Iraq (Suddam Hussein's home)
  "Drassen", // The main place in JA2 that you can receive items.  The other towns are dummy names...
  "Hong Kong", // Hong Kong, Hong Kong
  "Bejrut", // Beirut, Lebanon	(Middle East)
  "Londyn", // London, England
  "Los Angeles", // Los Angeles, California, USA (SW corner of USA)
  "Meduna", // Meduna -- the other airport in JA2 that you can receive items.
  "Metavira", // The island of Metavira was the fictional location used by JA1
  "Miami", // Miami, Florida, USA (SE corner of USA)
  "Moskwa", // Moscow, USSR
  "Nowy Jork", // New York, New York, USA
  "Ottawa", // Ottawa, Ontario, Canada -- where JA2 was made!
  "Paryż", // Paris, France
  "Trypolis", // Tripoli, Libya (eastern Mediterranean)
  "Tokio", // Tokyo, Japan
  "Vancouver", // Vancouver, British Columbia, Canada (west coast near US border)
];

export let pSkillAtZeroWarning: string[] /* STR16[] */ = [
  // This string is used in the IMP character generation.  It is possible to select 0 ability
  // in a skill meaning you can't use it.  This text is confirmation to the player.
  "Na pewno? Wartoć zero oznacza brak jakichkolwiek umiejętnoci w tej dziedzinie.",
];

export let pIMPBeginScreenStrings: string[] /* STR16[] */ = [
  "( Maks. 8 znaków )",
];

export let pIMPFinishButtonText: string[] /* STR16[1] */ = [
  "Analizuję",
];

export let pIMPFinishStrings: string[] /* STR16[] */ = [
  "Dziękujemy, %s", //%s is the name of the merc
];

// the strings for imp voices screen
export let pIMPVoicesStrings: string[] /* STR16[] */ = [
  "Głos",
];

export let pDepartedMercPortraitStrings: string[] /* STR16[] */ = [
  "mierć w akcji",
  "Zwolnienie",
  "Inny",
];

// title for program
export let pPersTitleText: string[] /* STR16[] */ = [
  "Personel",
];

// paused game strings
export let pPausedGameText: string[] /* STR16[] */ = [
  "Gra wstrzymana",
  "Wznów grę (|P|a|u|s|e)",
  "Wstrzymaj grę (|P|a|u|s|e)",
];

export let pMessageStrings: string[] /* STR16[] */ = [
  "Zakończyć grę?",
  "OK",
  "TAK",
  "NIE",
  "ANULUJ",
  "NAJMIJ",
  "LIE",
  "Brak opisu", // Save slots that don't have a description.
  "Gra zapisana.",
  "Gra zapisana.",
  "Szybki zapis", // The name of the quicksave file (filename, text reference)
  "SaveGame", // The name of the normal savegame file, such as SaveGame01, SaveGame02, etc.
  "sav", // The 3 character dos extension (represents sav)
  "..\\SavedGames", // The name of the directory where games are saved.
  "Dzień",
  "Najemn.",
  "Wolna pozycja", // An empty save game slot
  "Demo", // Demo of JA2
  "Debug", // State of development of a project (JA2) that is a debug build
  "", // Release build for JA2
  "strz/min", // Abbreviation for Rounds per minute -- the potential # of bullets fired in a minute.
  "min", // Abbreviation for minute.
  "m", // One character abbreviation for meter (metric distance measurement unit).
  "kul", // Abbreviation for rounds (# of bullets)
  "kg", // Abbreviation for kilogram (metric weight measurement unit)
  "lb", // Abbreviation for pounds (Imperial weight measurement unit)
  "Strona główna", // Home as in homepage on the internet.
  "USD", // Abbreviation to US dollars
  "N/D", // Lowercase acronym for not applicable.
  "Tymczasem", // Meanwhile
  "%s przybył(a) do sektora %s%s", // Name/Squad has arrived in sector A9.  Order must not change without notifying
                                    // SirTech
  "Wersja",
  "Wolna pozycja na szybki zapis",
  "Ta pozycja zarezerwowana jest na szybkie zapisy wykonywane podczas gry kombinacjš klawiszy ALT+S.",
  "Otw.",
  "Zamkn.",
  "Brak miejsca na dysku twardym.  Na dysku wolne jest %s MB, a wymagane jest przynajmniej %s MB.",
  "Najęto - %s z A.I.M.",
  "%s złapał(a) %s", //'Merc name' has caught 'item' -- let SirTech know if name comes after item.
  "%s zaaplikował(a) sobie lekarstwo", //'Merc name' has taken the drug
  "%s nie posiada wiedzy medycznej", //'Merc name' has no medical skill.

  // CDRom errors (such as ejecting CD while attempting to read the CD)
  "Integralnoć gry została narażona na szwank.",
  "BŁĽD: Wyjęto płytę CD",

  // When firing heavier weapons in close quarters, you may not have enough room to do so.
  "Nie ma miejsca, żeby stšd oddać strzał.",

  // Can't change stance due to objects in the way...
  "Nie można zmienić pozycji w tej chwili.",

  // Simple text indications that appear in the game, when the merc can do one of these things.
  "Upuć",
  "Rzuć",
  "Podaj",

  "%s przekazano do - %s.", //"Item" passed to "merc".  Please try to keep the item %s before the merc %s, otherwise,
                             // must notify SirTech.
  "Brak wolnego miejsca, by przekazać %s do - %s.", // pass "item" to "merc".  Same instructions as above.

  // A list of attachments appear after the items.  Ex:  Kevlar vest ( Ceramic Plate 'Attached )'
  " dołšczono )",

  // Cheat modes
  "Pierwszy poziom lamerskich zagrywek osišgnięty",
  "Drugi poziom lamerskich zagrywek osišgnięty",

  // Toggling various stealth modes
  "Oddział ma włšczony tryb skradania się.",
  "Oddział ma wyłšczony tryb skradania się.",
  "%s ma włšczony tryb skradania się.",
  "%s ma wyłšczony tryb skradania się.",

  // Wireframes are shown through buildings to reveal doors and windows that can't otherwise be seen in
  // an isometric engine.  You can toggle this mode freely in the game.
  "Dodatkowe siatki włšczone.",
  "Dodatkowe siatki wyłšczone.",

  // These are used in the cheat modes for changing levels in the game.  Going from a basement level to
  // an upper level, etc.
  "Nie można wyjć do góry z tego poziomu...",
  "Nie ma już niższych poziomów...",
  "Wejcie na %d poziom pod ziemiš...",
  "Wyjcie z podziemii...",

  " - ", // used in the shop keeper inteface to mark the ownership of the item eg Red's gun
  "Automatyczne centrowanie ekranu wyłšczone.",
  "Automatyczne centrowanie ekranu włšczone.",
  "Kursor 3D wyłšczony.",
  "Kursor 3D włšczony.",
  "Oddział %d aktywny.",
  "%s - Nie stać cię by wypłacić jej/jemu dziennš pensję w wysokoci %s.", // first %s is the mercs name, the seconds is a string containing the salary
  "Pomiń",
  "%s nie może odejć sam(a).",
  "Utworzono zapis gry o nazwie SaveGame99.sav. W razie potrzeby zmień jego nazwę na SaveGame01..10. Wtedy będzie można go odczytać ze standardowego okna odczytu gry.",
  "%s wypił(a) trochę - %s",
  "Przesyłka dotarła do Drassen.",
  "%s przybędzie do wyznaczonego punktu zrzutu (sektor %s) w dniu %d, około godziny %s.", // first %s is mercs name, next is the sector location and name where they will be arriving in, lastely is the day an the time of arrival
  "Lista historii zaktualizowana.",
];

export let ItemPickupHelpPopup: string[] /* UINT16[][40] */ = [
  "OK",
  "W górę",
  "Wybierz wszystko",
  "W dół",
  "Anuluj",
];

export let pDoctorWarningString: string[] /* STR16[] */ = [
  "%s jest za daleko, aby poddać się leczeniu.",
  "Lekarze nie mogli opatrzyć wszystkich rannych.",
];

export let pMilitiaButtonsHelpText: string[] /* STR16[] */ = [
  "Podnie(Prawy klawisz myszy)/upuć(Lewy klawisz myszy) Zielonych żołnierzy", // button help text informing player they can pick up or drop militia with this button
  "Podnie(Prawy klawisz myszy)/upuć(Lewy klawisz myszy) Dowiadczonych żołnierzy",
  "Podnie(Prawy klawisz myszy)/upuć(Lewy klawisz myszy) Weteranów",
  "Umieszcza jednakowš iloć żołnierzy samoobrony w każdym sektorze.",
];

export let pMapScreenJustStartedHelpText: string[] /* STR16[] */ = [
  "Zajrzyj do A.I.M. i zatrudnij kilku najemników (*Wskazówka* musisz otworzyć laptopa)", // to inform the player to hired some mercs to get things going
  "Jeli chcesz już udać się do Arulco, kliknij przycisk kompresji czasu, w prawym dolnym rogu ekranu.", // to inform the player to hit time compression to get the game underway
];

export let pAntiHackerString: string[] /* STR16[] */ = [
  "Błšd. Brakuje pliku, lub jest on uszkodzony. Gra zostanie przerwana.",
];

export let gzLaptopHelpText: string[] /* STR16[] */ = [
  // Buttons:
  "Przeglšdanie poczty",
  "Przeglšdanie stron internetowych",
  "Przeglšdanie plików i załšczników pocztowych",
  "Rejestr zdarzeń",
  "Informacje o członkach oddziału",
  "Finanse i rejestr transakcji",
  "Koniec pracy z laptopem",

  // Bottom task bar icons (if they exist):
  "Masz nowš pocztę",
  "Masz nowe pliki",

  // Bookmarks:
  "Międzynarodowe Stowarzyszenie Najemników",
  "Bobby Ray's - Internetowy sklep z broniš",
  "Instytut Badań Najemników",
  "Bardziej Ekonomiczne Centrum Rekrutacyjne",
  "McGillicutty's - Zakład pogrzebowy",
  "United Floral Service",
  "Brokerzy ubezpieczeniowi",
];

export let gzHelpScreenText: string[] /* STR16[] */ = [
  "Zamknij okno pomocy",
];

export let gzNonPersistantPBIText: string[] /* STR16[] */ = [
  "Trwa walka. Najemników można wycofać tylko na ekranie taktycznym.",
  "W|ejd do sektora, aby kontynuować walkę.",
  "|Automatycznie rozstrzyga walkę.",
  "Nie można automatycznie rozstrzygnšć walki, gdy atakujesz.",
  "Nie można automatycznie rozstrzygnšć walki, gdy wpadasz w pułapkę.",
  "Nie można automatycznie rozstrzygnšć walki, gdy walczysz ze stworzeniami w kopalni.",
  "Nie można automatycznie rozstrzygnšć walki, gdy w sektorze sš wrodzy cywile.",
  "Nie można automatycznie rozstrzygnšć walki, gdy w sektorze sš dzikie koty.",
  "TRWA WALKA",
  "W tym momencie nie możesz się wycofać.",
];

export let gzMiscString: string[] /* STR16[] */ = [
  "Żołnierze samoobrony kontynuujš walkę bez pomocy twoich najemników...",
  "W tym momencie tankowanie nie jest konieczne.",
  "W baku jest %d%% paliwa.",
  "Żołnierze Deidranny przejęli całkowitš kontrolę nad - %s.",
  "Nie masz już gdzie zatankować.",
];

export let gzIntroScreen: string[] /* STR16[] */ = [
  "Nie odnaleziono filmu wprowadzajšcego",
];

// These strings are combined with a merc name, a volume string (from pNoiseVolStr),
// and a direction (either "above", "below", or a string from pDirectionStr) to
// report a noise.
// e.g. "Sidney hears a loud sound of MOVEMENT coming from the SOUTH."
export let pNewNoiseStr: string[] /* STR16[] */ = [
  "%s słyszy %s DWIĘK dochodzšcy z %s.",
  "%s słyszy %s ODGŁOS RUCHU dochodzšcy z %s.",
  "%s słyszy %s ODGŁOS SKRZYPNIĘCIA dochodzšcy z %s.",
  "%s słyszy %s PLUSK dochodzšcy z %s.",
  "%s słyszy %s ODGŁOS UDERZENIA dochodzšcy z %s.",
  "%s słyszy %s WYBUCH dochodzšcy z %s.",
  "%s słyszy %s KRZYK dochodzšcy z %s.",
  "%s słyszy %s ODGŁOS UDERZENIA dochodzšcy z %s.",
  "%s słyszy %s ODGŁOS UDERZENIA dochodzšcy z %s.",
  "%s słyszy %s ŁOMOT dochodzšcy z %s.",
  "%s słyszy %s TRZASK dochodzšcy z %s.",
];

export let wMapScreenSortButtonHelpText: string[] /* STR16[] */ = [
  "Sortuj według kolumny Imię (|F|1)",
  "Sortuj według kolumny Przydział (|F|2)",
  "Sortuj według kolumny Sen (|F|3)",
  "Sortuj według kolumny Lokalizacja (|F|4)",
  "Sortuj według kolumny Cel podróży (|F|5)",
  "Sortuj według kolumny Wyjazd (|F|6)",
];

export let BrokenLinkText: string[] /* STR16[] */ = [
  "Błšd 404",
  "Nie odnaleziono strony.",
];

export let gzBobbyRShipmentText: string[] /* STR16[] */ = [
  "Ostatnie dostawy",
  "Zamówienie nr ",
  "Iloć przedmiotów",
  "Zamówiono:",
];

export let gzCreditNames: string[] /* STR16[] */ = [
  "Chris Camfield",
  "Shaun Lyng",
  "Kris Märnes",
  "Ian Currie",
  "Linda Currie",
  "Eric \"WTF\" Cheng",
  "Lynn Holowka",
  "Norman \"NRG\" Olsen",
  "George Brooks",
  "Andrew Stacey",
  "Scot Loving",
  "Andrew \"Big Cheese\" Emmons",
  "Dave \"The Feral\" French",
  "Alex Meduna",
  "Joey \"Joeker\" Whelan",
];

export let gzCreditNameTitle: string[] /* STR16[] */ = [
  "Game Internals Programmer", // Chris Camfield
  "Co-designer/Writer", // Shaun Lyng
  "Strategic Systems & Editor Programmer", // Kris Marnes
  "Producer/Co-designer", // Ian Currie
  "Co-designer/Map Designer", // Linda Currie
  "Artist", // Eric \"WTF\" Cheng
  "Beta Coordinator, Support", // Lynn Holowka
  "Artist Extraordinaire", // Norman \"NRG\" Olsen
  "Sound Guru", // George Brooks
  "Screen Designer/Artist", // Andrew Stacey
  "Lead Artist/Animator", // Scot Loving
  "Lead Programmer", // Andrew \"Big Cheese Doddle\" Emmons
  "Programmer", // Dave French
  "Strategic Systems & Game Balance Programmer", // Alex Meduna
  "Portraits Artist", // Joey \"Joeker\" Whelan",
];

export let gzCreditNameFunny: string[] /* STR16[] */ = [
  "", // Chris Camfield
  "(still learning punctuation)", // Shaun Lyng
  "(\"It's done. I'm just fixing it\")", // Kris \"The Cow Rape Man\" Marnes
  "(getting much too old for this)", // Ian Currie
  "(and working on Wizardry 8)", // Linda Currie
  "(forced at gunpoint to also do QA)", // Eric \"WTF\" Cheng
  "(Left us for the CFSA - go figure...)", // Lynn Holowka
  "", // Norman \"NRG\" Olsen
  "", // George Brooks
  "(Dead Head and jazz lover)", // Andrew Stacey
  "(his real name is Robert)", // Scot Loving
  "(the only responsible person)", // Andrew \"Big Cheese Doddle\" Emmons
  "(can now get back to motocrossing)", // Dave French
  "(stolen from Wizardry 8)", // Alex Meduna
  "(did items and loading screens too!)", // Joey \"Joeker\" Whelan",
];

export let sRepairsDoneString: string[] /* STR16[] */ = [
  "%s skończył(a) naprawiać własne wyposażenie",
  "%s skończył(a) naprawiać broń i ochraniacze wszystkich członków oddziału",
  "%s skończył(a) naprawiać wyposażenie wszystkich członków oddziału",
  "%s skończył(a) naprawiać ekwipunek wszystkich członków oddziału",
];

export let zGioDifConfirmText: string[] /* STR16[] */ = [
  "Wybrano opcję Nowicjusz. Opcja ta jest przeznaczona dla niedowiadczonych graczy, lub dla tych, którzy nie majš ochoty na długie i ciężkie walki. Pamiętaj, że opcja ta ma wpływ na przebieg całej gry. Czy na pewno chcesz grać w trybie Nowicjusz?",
  "Wybrano opcję Dowiadczony. Opcja ta jest przenaczona dla graczy posiadajšcych już pewne dowiadczenie w grach tego typu. Pamiętaj, że opcja ta ma wpływ na przebieg całej gry. Czy na pewno chcesz grać w trybie Dowiadczony?",
  "Wybrano opcję Ekspert. Jakby co, to ostrzegalimy cię. Nie obwiniaj nas, jeli wrócisz w plastikowym worku. Pamiętaj, że opcja ta ma wpływ na przebieg całej gry. Czy na pewno chcesz grać w trybie Ekspert?",
];

export let gzLateLocalizedString: string[] /* STR16[] */ = [
  "%S - nie odnaleziono pliku...",

  // 1-5
  "Robot nie może opucić sektora bez operatora.",

  // This message comes up if you have pending bombs waiting to explode in tactical.
  "Nie można teraz kompresować czasu.  Poczekaj na fajerwerki!",

  //'Name' refuses to move.
  "%s nie chce się przesunšć.",

  //%s a merc name
  "%s ma zbyt mało energii, aby zmienić pozycję.",

  // A message that pops up when a vehicle runs out of gas.
  "%s nie ma paliwa i stoi w sektorze %c%d.",

  // 6-10

  // the following two strings are combined with the pNewNoise[] strings above to report noises
  // heard above or below the merc
  "GÓRY",
  "DOŁU",

  // The following strings are used in autoresolve for autobandaging related feedback.
  "Żaden z twoich najemników nie posiada wiedzy medycznej.",
  "Brak rodków medycznych, aby założyć rannym opatrunki.",
  "Zabrakło rodków medycznych, aby założyć wszystkim rannym opatrunki.",
  "Żaden z twoich najemników nie potrzebuje pomocy medycznej.",
  "Automatyczne zakładanie opatrunków rannym najemnikom.",
  "Wszystkim twoim najemnikom założono opatrunki.",

  // 14
  "Arulco",

  "(dach)",

  "Zdrowie: %d/%d",

  // In autoresolve if there were 5 mercs fighting 8 enemies the text would be "5 vs. 8"
  //"vs." is the abbreviation of versus.
  "%d vs. %d",

  "%s - brak wolnych miejsc!", //(ex "The ice cream truck is full")

  "%s nie potrzebuje pierwszej pomocy lecz opieki lekarza lub dłuższego odpoczynku.",

  // 20
  // Happens when you get shot in the legs, and you fall down.
  "%s dostał(a) w nogi i upadł(a)!",
  // Name can't speak right now.
  "%s nie może teraz mówić.",

  // 22-24 plural versions
  "%d zielonych żołnierzy samoobrony awansowało na weteranów.",
  "%d zielonych żołnierzy samoobrony awansowało na regularnych żołnierzy.",
  "%d regularnych żołnierzy samoobrony awansowało na weteranów.",

  // 25
  "Przełšcznik",

  // 26
  // Name has gone psycho -- when the game forces the player into burstmode (certain unstable characters)
  "%s dostaje wira!",

  // 27-28
  // Messages why a player can't time compress.
  "Niebezpiecznie jest kompresować teraz czas, gdyż masz najemników w sektorze %s.",
  "Niebezpiecznie jest kompresować teraz czas, gdyż masz najemników w kopalni zaatakowanej przez robale.",

  // 29-31 singular versions
  "1 zielony żołnierz samoobrony awansował na weterana.",
  "1 zielony żołnierz samoobrony awansował na regularnego żołnierza.",
  "1 regularny żołnierz samoobrony awansował na weterana.",

  // 32-34
  "%s nic nie mówi.",
  "Wyjć na powierzchnię?",
  "(Oddział %d)",

  // 35
  // Ex: "Red has repaired Scope's MP5K".  Careful to maintain the proper order (Red before Scope, Scope before MP5K)
  "%s naprawił(a) najemnikowi - %s, jego/jej - %s",

  // 36
  "DZIKI KOT",

  // 37-38 "Name trips and falls"
  "%s potyka się i upada",
  "Nie można stšd podnieć tego przedmiotu.",

  // 39
  "Żaden z twoich najemników nie jest w stanie walczyć.  Żołnierze samoobrony sami będš walczyć z robalami.",

  // 40-43
  //%s is the name of merc.
  "%s nie ma rodków medycznych!",
  "%s nie posiada odpowiedniej wiedzy, aby kogokolwiek wyleczyć!",
  "%s nie ma narzędzi!",
  "%s nie posiada odpowiedniej wiedzy, aby cokolwiek naprawić!",

  // 44-45
  "Czas naprawy",
  "%s nie widzi tej osoby.",

  // 46-48
  "%s - przedłużka lufy jego/jej broni odpada!",
  "W jednym sektorze, szkolenie samoobrony może prowadzić tylko %d instruktor(ów).",
  "Na pewno?",

  // 49-50
  "Kompresja czasu",
  "Pojazd ma pełny zbiornik paliwa.",

  // 51-52 Fast help text in mapscreen.
  "Kontynuuj kompresję czasu (|S|p|a|c|j|a)",
  "Zatrzymaj kompresję czasu (|E|s|c)",

  // 53-54 "Magic has unjammed the Glock 18" or "Magic has unjammed Raven's H&K G11"
  "%s odblokował(a) - %s",
  "%s odblokował(a) najemnikowi - %s, jego/jej - %s",

  // 55
  "Nie można kompresować czasu, gdy otwarty jest inwentarz sektora.",

  "Nie odnaleziono płyty nr 2 Jagged Alliance 2.",

  "Przedmioty zostały pomylnie połšczone.",

  // 58
  // Displayed with the version information when cheats are enabled.
  "Bieżšcy/Maks. postęp: %d%%/%d%%",

  // 59
  "Eskortować Johna i Mary?",

  "Przełšcznik aktywowany.",
];
