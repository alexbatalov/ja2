namespace ja2 {

/*
******************************************************************************************************
**																	IMPORTANT TRANSLATION NOTES																			**
******************************************************************************************************

GENERAL TOPWARE INSTRUCTIONS
- Always be aware that German strings should be of equal or shorter length than the English equivalent.
        I know that this is difficult to do on many occasions due to the nature of the German language when
        compared to English. By doing so, this will greatly reduce the amount of work on both sides. In
        most cases (but not all), JA2 interfaces were designed with just enough space to fit the English word.
        The general rule is if the string is very short (less than 10 characters), then it's short because of
        interface limitations. On the other hand, full sentences commonly have little limitations for length.
        Strings in between are a little dicey.
- Never translate a string to appear on multiple lines. All strings L"This is a really long string...",
        must fit on a single line no matter how long the string is. All strings start with L" and end with ",
- Never remove any extra spaces in strings. In addition, all strings containing multiple sentences only
        have one space after a period, which is different than standard typing convention. Never modify sections
        of strings contain combinations of % characters. These are special format characters and are always
        used in conjunction with other characters. For example, %s means string, and is commonly used for names,
        locations, items, etc. %d is used for numbers. %c%d is a character and a number (such as A9).
        %% is how a single % character is built. There are countless types, but strings containing these
        special characters are usually commented to explain what they mean. If it isn't commented, then
        if you can't figure out the context, then feel free to ask SirTech.
- Comments are always started with // Anything following these two characters on the same line are
        considered to be comments. Do not translate comments. Comments are always applied to the following
        string(s) on the next line(s), unless the comment is on the same line as a string.
- All new comments made by SirTech will use "//@@@ comment" (without the quotes) notation. By searching
        for @@@ everytime you recieve a new version, it will simplify your task and identify special instructions.
        Commonly, these types of comments will be used to ask you to abbreviate a string. Please leave the
        comments intact, and SirTech will remove them once the translation for that particular area is resolved.
- If you have a problem or question with translating certain strings, please use "//!!! comment"
        (without the quotes). The syntax is important, and should be identical to the comments used with @@@
        symbols. SirTech will search for !!! to look for Topware problems and questions. This is a more
        efficient method than detailing questions in email, so try to do this whenever possible.



FAST HELP TEXT -- Explains how the syntax of fast help text works.
**************

1) BOLDED LETTERS
        The popup help text system supports special characters to specify the hot key(s) for a button.
        Anytime you see a '|' symbol within the help text string, that means the following key is assigned
        to activate the action which is usually a button.

        EX: L"|Map Screen"

        This means the 'M' is the hotkey. In the game, when somebody hits the 'M' key, it activates that
        button. When translating the text to another language, it is best to attempt to choose a word that
        uses 'M'. If you can't always find a match, then the best thing to do is append the 'M' at the end
        of the string in this format:

        EX: L"Ecran De Carte (|M)" (this is the French translation)

        Other examples are used multiple times, like the Esc key or "|E|s|c" or Space -> (|S|p|a|c|e)

2) NEWLINE
        Any place you see a \n within the string, you are looking at another string that is part of the fast help
        text system. \n notation doesn't need to be precisely placed within that string, but whereever you wish
        to start a new line.

        EX: L"Clears all the mercs' positions,\nand allows you to re-enter them manually."

        Would appear as:

                                Clears all the mercs' positions,
                                and allows you to re-enter them manually.

        NOTE: It is important that you don't pad the characters adjacent to the \n with spaces. If we did this
                                in the above example, we would see

        WRONG WAY -- spaces before and after the \n
        EX: L"Clears all the mercs' positions, \n and allows you to re-enter them manually."

        Would appear as: (the second line is moved in a character)

                                Clears all the mercs' positions,
                                 and allows you to re-enter them manually.


@@@ NOTATION
************

        Throughout the text files, you'll find an assortment of comments. Comments are used to describe the
        text to make translation easier, but comments don't need to be translated. A good thing is to search for
        "@@@" after receiving new version of the text file, and address the special notes in this manner.

!!! NOTATION
************

        As described above, the "!!!" notation should be used by Topware to ask questions and address problems as
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
  ".38 Kal",
  "9mm",
  ".45 Kal",
  ".357 Kal",
  "12 Kal",
  "CAWS",
  "5.45mm",
  "5.56mm",
  "7.62mm NATO",
  "7.62mm WP",
  "4.7mm",
  "5.7mm",
  "Monster",
  "Rakete",
  "",
  "",
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
  ".38 Kal",
  "9mm",
  ".45 Kal",
  ".357 Kal",
  "12 Kal",
  "CAWS",
  "5.45mm",
  "5.56mm",
  "7.62mm N.",
  "7.62mm WP",
  "4.7mm",
  "5.7mm",
  "Monster",
  "Rakete",
  "", // dart
];

export let WeaponType: string[] /* UINT16[][30] */ = [
  "Andere",
  "Pistole",
  "Maschinenpistole",
  "Schwere Maschinenpistole",
  "Gewehr",
  "Scharfschützengewehr",
  "Sturmgewehr",
  "Leichtes Maschinengewehr",
  "Schrotflinte",
];

export let TeamTurnString: string[] /* UINT16[][STRING_LENGTH] */ = [
  "Spielzug Spieler",
  "Spielzug Gegner",
  "Spielzug Monster",
  "Spielzug Miliz",
  "Spielzug Zivilisten",
  // planning turn
];

export let Message: string[] /* UINT16[][STRING_LENGTH] */ = [
  "",

  // In the following 8 strings, the %s is the merc's name, and the %d (if any) is a number.

  "%s am Kopf getroffen, verliert einen Weisheitspunkt!",
  "%s an der Schulter getroffen, verliert Geschicklichkeitspunkt!",
  "%s an der Brust getroffen, verliert einen Kraftpunkt!",
  "%s an den Beinen getroffen, verliert einen Beweglichkeitspunkt!",
  "%s am Kopf getroffen, verliert %d Weisheitspunkte!",
  "%s an der Schulter getroffen, verliert %d Geschicklichkeitspunkte!",
  "%s an der Brust getroffen, verliert %d Kraftpunkte!",
  "%s an den Beinen getroffen, verliert %d Beweglichkeitspunkte!",
  "Unterbrechung!",

  // The first %s is a merc's name, the second is a string from pNoiseVolStr,
  // the third is a string from pNoiseTypeStr, and the last is a string from pDirectionStr

  "", // obsolete
  "Verstärkung ist angekommen!",

  // In the following four lines, all %s's are merc names

  "%s lädt nach.",
  "%s hat nicht genug Action-Punkte!",
  "%s leistet Erste Hilfe. (Rückgängig mit beliebiger Taste.)",
  "%s und %s leisten Erste Hilfe. (Rückgängig mit beliebiger Taste.)",
  // the following 17 strings are used to create lists of gun advantages and disadvantages
  // (separated by commas)
  "zuverlässig",
  "unzuverlässig",
  "Reparatur leicht",
  "Reparatur schwer",
  "große Durchschlagskraft",
  "kleine Durchschlagskraft",
  "feuert schnell",
  "feuert langsam",
  "große Reichweite",
  "kurze Reichweite",
  "leicht",
  "schwer",
  "klein",
  "schneller Feuerstoß",
  "kein Feuerstoß",
  "großes Magazin",
  "kleines Magazin",

  // In the following two lines, all %s's are merc names

  "%ss Tarnung hat sich abgenutzt.",
  "%ss Tarnung ist weggewaschen.",

  // The first %s is a merc name and the second %s is an item name

  "Zweite Waffe hat keine Ammo!",
  "%s hat %s gestohlen.",

  // The %s is a merc name

  "%ss Waffe kann keinen Feuerstoß abgeben.",

  "Sie haben schon eines davon angebracht.",
  "Gegenstände zusammenfügen?",

  // Both %s's are item names

  "Sie können %s mit %s nicht zusammenfügen",

  "Keine",
  "Ammo entfernen",
  "Modifikationen",

  // You cannot use "item(s)" and your "other item" at the same time.
  // Ex: You cannot use sun goggles and you gas mask at the same time.
  "Sie können %s nicht zusammen mit %s benutzen.", //

  "Der Gegenstand in Ihrem Cursor kann mit anderen Gegenständen verbunden werden, indem Sie ihn in einem der vier Slots plazieren",
  "Der Gegenstand in Ihrem Cursor kann mit anderen Gegenständen verbunden werden, indem Sie ihn in einem der vier Attachment-Slots plazieren. (Aber in diesem Fall sind die Gegenstände nicht kompatibel.)",
  "Es sind noch Feinde im Sektor!",
  "Geben Sie %s %s",
  "%s am Kopf getroffen!",
  "Kampf abbrechen?",
  "Die Modifikation ist permanent. Weitermachen?",
  "%s fühlt sich frischer!",
  "%s ist auf Murmeln ausgerutscht!",
  "%s konnte %s nicht greifen!",
  "%s hat %s repariert",
  "Unterbrechung für ",
  "Ergeben?",
  "Diese Person will keine Hilfe.",
  "Lieber NICHT!",
  "Wenn Sie zu Skyriders Heli wollen, müssen Sie Söldner einem FAHRZEUG/HELIKOPTER ZUWEISEN.",
  "%s hat nur Zeit, EINE Waffe zu laden",
  "Spielzug Bloodcats",
];

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
  "Pause",
  "Normal",
  "5 Min",
  "30 Min",
  "60 Min",
  "6 Std",
];

// Assignment Strings: what assignment does the merc have right now? For example, are they on a squad, training,
// administering medical aid (doctor) or training a town. All are abbreviated. 8 letters is the longest it can be.
export let pAssignmentStrings: string[] /* STR16[] */ = [
  "Trupp 1",
  "Trupp 2",
  "Trupp 3",
  "Trupp 4",
  "Trupp 5",
  "Trupp 6",
  "Trupp 7",
  "Trupp 8",
  "Trupp 9",
  "Trupp 10",
  "Trupp 11",
  "Trupp 12",
  "Trupp 13",
  "Trupp 14",
  "Trupp 15",
  "Trupp 16",
  "Trupp 17",
  "Trupp 18",
  "Trupp 19",
  "Trupp 20",
  "Dienst", // on active duty
  "Doktor", // administering medical aid
  "Patient", // getting medical aid
  "Fahrzeug", // in a vehicle
  "Transit", // in transit - abbreviated form
  "Repar.", // repairing
  "Üben", // training themselves
  "Miliz", // training a town to revolt
  "Trainer", // training a teammate
  "Rekrut", // being trained by someone else
  "Tot", // dead
  "Unfähig", // abbreviation for incapacitated
  "Gefangen", // Prisoner of war - captured
  "Hospital", // patient in a hospital
  "Leer", // Vehicle is empty
];

export let pMilitiaString: string[] /* STR16[] */ = [
  "Miliz", // the title of the militia box
  "Ohne Aufgabe", // the number of unassigned militia troops
  "Mit Feinden im Sektor können Sie keine Miliz einsetzen!",
];

export let pMilitiaButtonString: string[] /* STR16[] */ = [
  "Autom.", // auto place the militia troops for the player
  "Fertig", // done placing militia troops
];

export let pConditionStrings: string[] /* STR16[] */ = [
  "Sehr gut", // the state of a soldier .. excellent health
  "Gut", // good health
  "Mittel", // fair health
  "Verwundet", // wounded health
  "Erschöpft", // tired
  "Verblutend", // bleeding to death
  "Bewußtlos", // knocked out
  "Stirbt", // near death
  "Tot", // dead
];

export let pEpcMenuStrings: string[] /* STR16[] */ = [
  "Dienst", // set merc on active duty
  "Patient", // set as a patient to receive medical aid
  "Fahrzeug", // tell merc to enter vehicle
  "Unbewacht", // let the escorted character go off on their own
  "Abbrechen", // close this menu
];

// look at pAssignmentString above for comments
export let pPersonnelAssignmentStrings: string[] /* STR16[] */ = [
  "Trupp 1",
  "Trupp 2",
  "Trupp 3",
  "Trupp 4",
  "Trupp 5",
  "Trupp 6",
  "Trupp 7",
  "Trupp 8",
  "Trupp 9",
  "Trupp 10",
  "Trupp 11",
  "Trupp 12",
  "Trupp 13",
  "Trupp 14",
  "Trupp 15",
  "Trupp 16",
  "Trupp 17",
  "Trupp 18",
  "Trupp 19",
  "Trupp 20",
  "Dienst",
  "Doktor",
  "Patient",
  "Fahrzeug",
  "Transit",
  "Repar.",
  "Üben",
  "Miliz",
  "Trainer",
  "Rekrut",
  "Tot",
  "Unfähig",
  "Gefangen",
  "Hospital",
  "Leer", // Vehicle is empty
];

// refer to above for comments
export let pLongAssignmentStrings: string[] /* STR16[] */ = [
  "Trupp 1",
  "Trupp 2",
  "Trupp 3",
  "Trupp 4",
  "Trupp 5",
  "Trupp 6",
  "Trupp 7",
  "Trupp 8",
  "Trupp 9",
  "Trupp 10",
  "Trupp 11",
  "Trupp 12",
  "Trupp 13",
  "Trupp 14",
  "Trupp 15",
  "Trupp 16",
  "Trupp 17",
  "Trupp 18",
  "Trupp 19",
  "Trupp 20",
  "Dienst",
  "Doktor",
  "Patient",
  "Fahrzeug",
  "Transit",
  "Repar.",
  "Üben",
  "Miliz",
  "Trainer",
  "Rekrut",
  "Tot",
  "Unfähig",
  "Gefangen",
  "Hospital", // patient in a hospital
  "Leer", // Vehicle is empty
];

// the contract options
export let pContractStrings: string[] /* STR16[] */ = [
  "Vertragsoptionen:",
  "", // a blank line, required
  "Einen Tag anbieten", // offer merc a one day contract extension
  "Eine Woche anbieten", // 1 week
  "Zwei Wochen anbieten", // 2 week
  "Entlassen", // end merc's contract (used to be "Terminate")
  "Abbrechen", // stop showing this menu
];

export let pPOWStrings: string[] /* STR16[] */ = [
  "gefangen", // an acronym for Prisoner of War
  "??",
];

export let pLongAttributeStrings: string[] /* STR16[] */ = [
  "KRAFT", // The merc's strength attribute. Others below represent the other attributes.
  "GESCHICKLICHKEIT",
  "BEWEGLICHKEIT",
  "WEISHEIT",
  "TREFFSICHERHEIT",
  "MEDIZIN",
  "TECHNIK",
  "FÜHRUNGSQUALITÄT",
  "SPRENGSTOFFE",
  "ERFAHRUNGSSTUFE",
];

export let pInvPanelTitleStrings: string[] /* STR16[] */ = [
  "Rüstung", // the armor rating of the merc
  "Gewicht", // the weight the merc is carrying
  "Tarnung", // the merc's camouflage rating
];

export let pShortAttributeStrings: string[] /* STR16[] */ = [
  "Bew", // the abbreviated version of : agility
  "Ges", // dexterity
  "Krf", // strength
  "Fhr", // leadership
  "Wsh", // wisdom
  "Erf", // experience level
  "Trf", // marksmanship skill
  "Spr", // explosive skill
  "Tec", // mechanical skill
  "Med", // medical skill
];

export let pUpperLeftMapScreenStrings: string[] /* STR16[] */ = [
  "Aufgabe", // the mercs current assignment
  "Vertrag", // the contract info about the merc
  "Gesundh.", // the health level of the current merc
  "Moral", // the morale of the current merc
  "Zust.", // the condition of the current vehicle
  "Tank", // the fuel level of the current vehicle
];

export let pTrainingStrings: string[] /* STR16[] */ = [
  "Üben", // tell merc to train self
  "Miliz", // tell merc to train town //
  "Trainer", // tell merc to act as trainer
  "Rekrut", // tell merc to be train by other
];

export let pGuardMenuStrings: string[] /* STR16[] */ = [
  "Schußrate:", // the allowable rate of fire for a merc who is guarding
  " Aggressiv feuern", // the merc can be aggressive in their choice of fire rates
  " Ammo sparen", // conserve ammo
  " Nur bei Bedarf feuern", // fire only when the merc needs to
  "Andere Optionen:", // other options available to merc
  " Rückzug möglich", // merc can retreat
  " Deckung möglich", // merc is allowed to seek cover
  " Kann Kameraden helfen", // merc can assist teammates
  "Fertig", // done with this menu
  "Abbruch", // cancel this menu
];

// This string has the same comments as above, however the * denotes the option has been selected by the player
export let pOtherGuardMenuStrings: string[] /* STR16[] */ = [
  "Schußrate:",
  " *Aggressiv feuern*",
  " *Ammo sparen*",
  " *Nur bei Bedarf feuern*",
  "Andere Optionen:",
  " *Rückzug möglich*",
  " *Deckung möglich*",
  " *Kann Kameraden helfen*",
  "Fertig",
  "Abbruch",
];

export let pAssignMenuStrings: string[] /* STR16[] */ = [
  "Dienst", // merc is on active duty
  "Doktor", // the merc is acting as a doctor
  "Patient", // the merc is receiving medical attention
  "Fahrzeug", // the merc is in a vehicle
  "Repar.", // the merc is repairing items
  "Training", // the merc is training
  "Abbrechen", // cancel this menu
];

export let pRemoveMercStrings: string[] /* STR16[] */ = [
  "Söldner entfernen", // remove dead merc from current team
  "Abbrechen",
];

export let pAttributeMenuStrings: string[] /* STR16[] */ = [
  "Kraft",
  "Geschicklichkeit",
  "Beweglichkeit",
  "Gesundheit",
  "Treffsicherheit",
  "Medizin",
  "Technik",
  "Führungsqualität",
  "Sprengstoffe",
  "Abbrechen",
];

export let pTrainingMenuStrings: string[] /* STR16[] */ = [
  "Üben", // train yourself
  "Miliz", // train the town
  "Trainer", // train your teammates
  "Rekrut", // be trained by an instructor
  "Abbrechen", // cancel this menu
];

export let pSquadMenuStrings: string[] /* STR16[] */ = [
  "Trupp  1",
  "Trupp  2",
  "Trupp  3",
  "Trupp  4",
  "Trupp  5",
  "Trupp  6",
  "Trupp  7",
  "Trupp  8",
  "Trupp  9",
  "Trupp 10",
  "Trupp 11",
  "Trupp 12",
  "Trupp 13",
  "Trupp 14",
  "Trupp 15",
  "Trupp 16",
  "Trupp 17",
  "Trupp 18",
  "Trupp 19",
  "Trupp 20",
  "Abbrechen",
];

export let pPersonnelTitle: string[] /* STR16[] */ = [
  "Personal", // the title for the personnel screen/program application
];

export let pPersonnelScreenStrings: string[] /* STR16[] */ = [
  "Gesundheit: ", // health of merc
  "Beweglichkeit: ",
  "Geschicklichkeit: ",
  "Kraft: ",
  "Führungsqualität: ",
  "Weisheit: ",
  "Erf. Stufe: ", // experience level
  "Treffsicherheit: ",
  "Technik: ",
  "Sprengstoffe: ",
  "Medizin: ",
  "Med. Versorgung: ", // amount of medical deposit put down on the merc
  "Laufzeit: ", // time remaining on current contract
  "Getötet: ", // number of kills by merc
  "Mithilfe: ", // number of assists on kills by merc
  "Tgl. Kosten:", // daily cost of merc
  "Gesamtkosten:", // total cost of merc
  "Vertrag:", // cost of current contract
  "Diensttage:", // total service rendered by merc
  "Schulden:", // amount left on MERC merc to be paid
  "Prozentzahl Treffer:", // percentage of shots that hit target
  "Einsätze:", // number of battles fought
  "Verwundungen:", // number of times merc has been wounded
  "Fähigkeiten:",
  "Keine Fähigkeiten:",
];

// These string correspond to enums used in by the SkillTrait enums in SoldierProfileType.h
export let gzMercSkillText: string[] /* STR16[] */ = [
  "Keine Fähigkeiten",
  "Schlösser knacken",
  "Nahkampf",
  "Elektronik",
  "Nachteinsatz",
  "Werfen",
  "Lehren",
  "Schwere Waffen",
  "Autom. Waffen",
  "Schleichen",
  "Geschickt",
  "Dieb",
  "Kampfsport",
  "Messer",
  "Dach-Treffer-Bonus",
  "Getarnt",
  "(Experte)",
];

// This is pop up help text for the options that are available to the merc
export let pTacticalPopupButtonStrings: string[] /* STR16[] */ = [
  "|Stehen/Gehen",
  "Kauern/Kauernd bewegen (|C)",
  "Stehen/|Rennen",
  "Hinlegen/Kriechen (|P)",
  "Schauen (|L)",
  "Action",
  "Reden",
  "Untersuchen (|C|t|r|l)",

  // Pop up door menu
  "Manuell öffnen",
  "Auf Fallen untersuchen",
  "Dietrich",
  "Mit Gewalt öffnen",
  "Falle entschärfen",
  "Abschließen",
  "Aufschließen",
  "Sprengstoff an Tür benutzen",
  "Brecheisen benutzen",
  "Rückgängig (|E|s|c)",
  "Schließen",
];

// Door Traps. When we examine a door, it could have a particular trap on it. These are the traps.
export let pDoorTrapStrings: string[] /* STR16[] */ = [
  "keine Falle",
  "eine Sprengstoffalle",
  "eine elektrische Falle",
  "eine Falle mit Sirene",
  "eine Falle mit stummem Alarm",
];

// Contract Extension. These are used for the contract extension with AIM mercenaries.
export let pContractExtendStrings: string[] /* STR16[] */ = [
  "1 Tag",
  "1 Woche",
  "2 Wochen", //
];

// On the map screen, there are four columns. This text is popup help text that identifies the individual columns.
export let pMapScreenMouseRegionHelpText: string[] /* STR16[] */ = [
  "Charakter auswählen",
  "Söldner einteilen",
  "Marschroute",

  // The new 'c' key activates this option. Either reword this string to include a 'c' in it, or leave as is.
  "Vertrag für Söldner (|c)",

  "Söldner entfernen",
  "Schlafen",
];

// volumes of noises
export let pNoiseVolStr: string[] /* STR16[] */ = [
  "LEISE",
  "DEUTLICH",
  "LAUT",
  "SEHR LAUT",
];

// types of noises
export let pNoiseTypeStr: string[] /* STR16[] */ = [
  "EIN UNBEKANNTES GERÄUSCH",
  "EINE BEWEGUNG",
  "EIN KNARREN",
  "EIN KLATSCHEN",
  "EINEN AUFSCHLAG",
  "EINEN SCHUSS",
  "EINE EXPLOSION",
  "EINEN SCHREI",
  "EINEN AUFSCHLAG",
  "EINEN AUFSCHLAG",
  "EIN ZERBRECHEN",
  "EIN ZERSCHMETTERN",
];

// Directions that are used throughout the code for identification.
export let pDirectionStr: string[] /* STR16[] */ = [
  "NORDOSTEN",
  "OSTEN",
  "SÜDOSTEN",
  "SÜDEN",
  "SÜDWESTEN",
  "WESTEN",
  "NORDWESTEN",
  "NORDEN",
];

// These are the different terrain types.
export let pLandTypeStrings: string[] /* STR16[] */ = [
  "Stadt",
  "Straße",
  "Ebene",
  "Wüste",
  "Lichter Wald",
  "Dichter Wald",
  "Sumpf",
  "See/Ozean",
  "Hügel",
  "Unpassierbar",
  "Fluß", // river from north to south
  "Fluß", // river from east to west
  "Fremdes Land",
  // NONE of the following are used for directional travel, just for the sector description.
  "Tropen",
  "Farmland",
  "Ebene, Straße",
  "Wald, Straße",
  "Farm, Straße",
  "Tropen, Straße",
  "Wald, Straße",
  "Küste",
  "Berge, Straße",
  "Küste, Straße",
  "Wüste, Straße",
  "Sumpf, Straße",
  "Wald, Raketen",
  "Wüste, Raketen",
  "Tropen, Raketen",
  "Meduna, Raketen",

  // These are descriptions for special sectors
  "Cambria Hospital",
  "Drassen Flugplatz",
  "Meduna Flugplatz",
  "Raketen",
  "Rebellenlager", // The rebel base underground in sector A10
  "Tixa, Keller", // The basement of the Tixa Prison (J9)
  "Monsterhöhle", // Any mine sector with creatures in it
  "Orta, Keller", // The basement of Orta (K4)
  "Tunnel", // The tunnel access from the maze garden in Meduna
             // leading to the secret shelter underneath the palace
  "Bunker", // The shelter underneath the queen's palace
  "", // Unused
];

export let gpStrategicString: string[] /* STR16[] */ = [
  //     The first %s can either be bloodcats or enemies.
  "", // Unused
  "%s wurden entdeckt in Sektor %c%d und ein weiterer Trupp wird gleich ankommen.", // STR_DETECTED_SINGULAR
  "%s wurden entdeckt in Sektor %c%d und weitere Trupps werden gleich ankommen.", // STR_DETECTED_PLURAL
  "Gleichzeitige Ankunft koordinieren?", // STR_COORDINATE

  // Dialog strings for enemies.

  "Feind bietet die Chance zum Aufgeben an.", // STR_ENEMY_SURRENDER_OFFER
  "Feind hat restliche bewußtlose Söldner gefangengenommen.", // STR_ENEMY_CAPTURED

  // The text that goes on the autoresolve buttons

  "Rückzug", // The retreat button				//STR_AR_RETREAT_BUTTON
  "Fertig", // The done button				//STR_AR_DONE_BUTTON

  // The headers are for the autoresolve type (MUST BE UPPERCASE)

  "VERTEIDIGUNG", // STR_AR_DEFEND_HEADER
  "ANGRIFF", // STR_AR_ATTACK_HEADER
  "BEGEGNUNG", // STR_AR_ENCOUNTER_HEADER
  "Sektor", // The Sector A9 part of the header		//STR_AR_SECTOR_HEADER

  // The battle ending conditions

  "SIEG!", // STR_AR_OVER_VICTORY
  "NIEDERLAGE!", // STR_AR_OVER_DEFEAT
  "AUFGEGEBEN!", // STR_AR_OVER_SURRENDERED
  "GEFANGENGENOMMEN!", // STR_AR_OVER_CAPTURED
  "ZURÜCKGEZOGEN!", // STR_AR_OVER_RETREATED

  // These are the labels for the different types of enemies we fight in autoresolve.

  "Miliz", // STR_AR_MILITIA_NAME,
  "Elite", // STR_AR_ELITE_NAME,
  "Trupp", // STR_AR_TROOP_NAME,
  "Verwal", // STR_AR_ADMINISTRATOR_NAME,
  "Monster", // STR_AR_CREATURE_NAME,

  // Label for the length of time the battle took

  "Zeit verstrichen", // STR_AR_TIME_ELAPSED,

  // Labels for status of merc if retreating. (UPPERCASE)

  "HAT SICH ZURÜCKGEZOGEN", // STR_AR_MERC_RETREATED,
  "ZIEHT SICH ZURÜCK", // STR_AR_MERC_RETREATING,
  "RÜCKZUG", // STR_AR_MERC_RETREAT,

  // PRE BATTLE INTERFACE STRINGS
  // Goes on the three buttons in the prebattle interface. The Auto resolve button represents
  // a system that automatically resolves the combat for the player without having to do anything.
  // These strings must be short (two lines -- 6-8 chars per line)

  "PC Kampf", // STR_PB_AUTORESOLVE_BTN,
  "Gehe zu Sektor", // STR_PB_GOTOSECTOR_BTN,
  "Rückzug", // STR_PB_RETREATMERCS_BTN,

  // The different headers(titles) for the prebattle interface.
  "FEINDBEGEGNUNG",
  "FEINDLICHE INVASION",
  "FEINDLICHER HINTERHALT",
  "FEINDLICHEN SEKTOR BETRETEN",
  "MONSTERANGRIFF",
  "BLOODCAT-HINTERHALT",
  "BLOODCAT-HÖHLE BETRETEN",

  // Various single words for direct translation. The Civilians represent the civilian
  // militia occupying the sector being attacked. Limited to 9-10 chars

  "Ort",
  "Feinde",
  "Söldner",
  "Miliz",
  "Monster",
  "Bloodcats",
  "Sektor",
  "Keine", // If there are no uninvolved mercs in this fight.
  "n.a.", // Acronym of Not Applicable
  "T", // One letter abbreviation of day
  "h", // One letter abbreviation of hour

  // TACTICAL PLACEMENT USER INTERFACE STRINGS
  // The four buttons

  "Räumen",
  "Verteilen",
  "Gruppieren",
  "Fertig",

  // The help text for the four buttons. Use \n to denote new line (just like enter).

  "Söldner räumen ihre Positionen\n und können manuell neu plaziert werden. (|C)",
  "Söldner |schwärmen in alle Richtungen aus\n wenn der Button gedrückt wird.",
  "Mit diesem Button können Sie wählen, wo die Söldner |gruppiert werden sollen.",
  "Klicken Sie auf diesen Button, wenn Sie die\n Positionen der Söldner gewählt haben. (|E|n|t|e|r)",
  "Sie müssen alle Söldner positionieren\n bevor die Schlacht beginnt.",

  // Various strings (translate word for word)

  "Sektor",
  "Eintrittspunkte wählen",

  // Strings used for various popup message boxes. Can be as long as desired.

  "Das sieht nicht gut aus. Gelände ist unzugänglich. Versuchen Sie es an einer anderen Stelle.",
  "Plazieren Sie Ihre Söldner in den markierten Sektor auf der Karte.",

  // This message is for mercs arriving in sectors. Ex: Red has arrived in sector A9.
  // Don't uppercase first character, or add spaces on either end.

  "ist angekommen im Sektor",

  // These entries are for button popup help text for the prebattle interface. All popup help
  // text supports the use of \n to denote new line. Do not use spaces before or after the \n.
  "Entscheidet Schlacht |automatisch für Sie\nohne Karte zu laden.",
  "Sie können den PC-Kampf-Modus nicht benutzen, während Sie\neinen vom Feind verteidigten Ort angreifen.",
  "Sektor b|etreten und Feind in Kampf verwickeln.",
  "Gruppe zum vorigen Sektor zu|rückziehen.", // singular version
  "Alle Gruppen zum vorigen Sektor zu|rückziehen.", // multiple groups with same previous sector

  // various popup messages for battle conditions.

  //%c%d is the sector -- ex: A9
  "Feinde attackieren Ihre Miliz im Sektor %c%d.",
  //%c%d is the sector -- ex: A9
  "Monster attackieren Ihre Miliz im Sektor %c%d.",
  // 1st %d refers to the number of civilians eaten by monsters, %c%d is the sector -- ex: A9
  // Note: the minimum number of civilians eaten will be two.
  "Monster attackieren und töten %d Zivilisten im Sektor %s.",
  //%s is the sector -- ex: A9
  "Feinde attackieren Ihre Söldner im Sektor %s. Alle Söldner sind bewußtlos!",
  //%s is the sector -- ex: A9
  "Monster attackieren Ihre Söldner im Sektor %s. Alle Söldner sind bewußtlos!",
];

export let gpGameClockString: string[] /* STR16[] */ = [
  // This is the day represented in the game clock. Must be very short, 4 characters max.
  "Tag",
];

// When the merc finds a key, they can get a description of it which
// tells them where and when they found it.
export let sKeyDescriptionStrings: string[] /* STR16[2] */ = [
  "gefunden im Sektor:",
  "gefunden am:",
];

// The headers used to describe various weapon statistics.
// USED TO BE 13
export let gWeaponStatsDesc: string[] /* INT16[][14] */ = [
  "Gew. (%s):", // weight
  "Status:",
  "Anzahl:", // Number of bullets left in a magazine
  "Reichw.:", // Range
  "Schaden:",
  "AP:", // abbreviation for Action Points
  "",
  "=",
  "=",
];

// The headers used for the merc's money.
export let gMoneyStatsDesc: string[] /* INT16[][13] */ = [
  "Betrag",
  "Verbleibend:", // this is the overall balance
  "Betrag",
  "Abteilen:", // the amount he wants to separate from the overall balance to get two piles of money
  "Konto",
  "Saldo",
  "Betrag",
  "abheben",
];

// The health of various creatures, enemies, characters in the game. The numbers following each are for comment
// only, but represent the precentage of points remaining.
// used to be 10
export let zHealthStr: string[] /* UINT16[][13] */ = [
  "STIRBT", //	>= 0
  "KRITISCH", //	>= 15
  "SCHLECHT", //	>= 30
  "VERWUNDET", //	>= 45
  "GESUND", //	>= 60
  "STARK", // 	>= 75
  "SEHR GUT", // 	>= 90
];

export let gzMoneyAmounts: string[] /* STR16[6] */ = [
  "$1000",
  "$100",
  "$10",
  "OK",
  "Abteilen",
  "Abheben",
];

// short words meaning "Advantages" for "Pros" and "Disadvantages" for "Cons."
export let gzProsLabel: string /* INT16[10] */ = "Pro:";

export let gzConsLabel: string /* INT16[10] */ = "Kontra:";

// Conversation options a player has when encountering an NPC
export let zTalkMenuStrings: string[] /* UINT16[6][SMALL_STRING_LENGTH] */ = [
  "Wie bitte?", // meaning "Repeat yourself"
  "Freundlich", // approach in a friendly
  "Direkt", // approach directly - let's get down to business
  "Drohen", // approach threateningly - talk now, or I'll blow your face off
  "Geben",
  "Rekrutieren",
];

// Some NPCs buy, sell or repair items. These different options are available for those NPCs as well.
export let zDealerStrings: string[] /* UINT16[4][SMALL_STRING_LENGTH] */ = [
  "Handeln",
  "Kaufen",
  "Verkaufen",
  "Reparieren",
];

export let zDialogActions: string[] /* UINT16[1][SMALL_STRING_LENGTH] */ = [
  "Fertig",
];

export let pVehicleStrings: string[] /* STR16[] */ = [
  "Eldorado",
  "Hummer", // a hummer jeep/truck -- military vehicle
  "Ice Cream Truck",
  "Jeep",
  "Tank",
  "Helikopter",
];

export let pShortVehicleStrings: string[] /* STR16[] */ = [
  "Eldor.",
  "Hummer", // the HMVV
  "Truck",
  "Jeep",
  "Tank",
  "Heli", // the helicopter
];

export let zVehicleName: string[] /* STR16[] */ = [
  "Eldorado",
  "Hummer", // a military jeep. This is a brand name.
  "Truck", // Ice cream truck
  "Jeep",
  "Tank",
  "Heli", // an abbreviation for Helicopter
];

// These are messages Used in the Tactical Screen
export let TacticalStr: string[] /* UINT16[][MED_STRING_LENGTH] */ = [
  "Luftangriff",
  "Automatisch Erste Hilfe leisten?",

  // CAMFIELD NUKE THIS and add quote #66.

  "%s bemerkt, daß Teile aus der Lieferung fehlen.",

  // The %s is a string from pDoorTrapStrings

  "Das Schloß hat %s.",
  "Es gibt kein Schloß.",
  "Erfolg!",
  "Fehlschlag.",
  "Erfolg!",
  "Fehlschlag.",
  "Das Schloß hat keine Falle.",
  "Erfolg!",
  // The %s is a merc name
  "%s hat nicht den richtigen Schlüssel.",
  "Die Falle am Schloß ist entschärft.",
  "Das Schloß hat keine Falle.",
  "Geschl.",
  "TÜR",
  "FALLE AN",
  "Geschl.",
  "GEÖFFNET",
  "EINGETRETEN",
  "Hier ist ein Schalter. Betätigen?",
  "Falle entschärfen?",
  "Zurück...",
  "Weiter...",
  "Mehr...",

  // In the next 2 strings, %s is an item name

  "%s liegt jetzt auf dem Boden.",
  "%s ist jetzt bei %s.",

  // In the next 2 strings, %s is a name

  "%s hat den vollen Betrag erhalten.",
  "%s bekommt noch %d.",
  "Detonationsfrequenz auswählen:", // in this case, frequency refers to a radio signal
  "Wie viele Züge bis zur Explosion:", // how much time, in turns, until the bomb blows
  "Ferngesteuerte Zündung einstellen:", // in this case, frequency refers to a radio signal
  "Falle entschärfen?",
  "Blaue Flagge wegnehmen?",
  "Blaue Flagge hier aufstellen?",
  "Zug beenden",

  // In the next string, %s is a name. Stance refers to way they are standing.

  "Wollen Sie %s wirklich angreifen?",
  "Fahrzeuge können ihre Position nicht ändern.",
  "Der Roboter kann seine Position nicht ändern.",

  // In the next 3 strings, %s is a name

  //%s can't change to that stance here
  "%s kann die Haltung hier nicht ändern.",

  "%s kann hier nicht versorgt werden.",
  "%s braucht keine Erste Hilfe.",
  "Kann nicht dorthin gehen.",
  "Ihr Team ist komplett. Kein Platz mehr für Rekruten.", // there's no room for a recruit on the player's team

  // In the next string, %s is a name

  "%s wird eskortiert von Trupp %d.",

  // Here %s is a name and %d is a number

  "%s bekommt noch %d $.",

  // In the next string, %s is a name

  "%s eskortieren?",

  // In the next string, the first %s is a name and the second %s is an amount of money (including $ sign)

  "%s für %s pro Tag anheuern?",

  // This line is used repeatedly to ask player if they wish to participate in a boxing match.

  "Kämpfen?",

  // In the next string, the first %s is an item name and the
  // second %s is an amount of money (including $ sign)

  "%s für %s kaufen?",

  // In the next string, %s is a name

  "%s wird von Trupp %d eskortiert.",

  // These messages are displayed during play to alert the player to a particular situation

  "KLEMMT", // weapon is jammed.
  "Roboter braucht %s Kaliber Ammo.", // Robot is out of ammo
  "Dorthin werfen? Unmöglich.", // Merc can't throw to the destination he selected

  // These are different buttons that the player can turn on and off.

  "Stealth Mode (|Z)",
  "Kartenbildschir|m",
  "Spielzug been|den",
  "Sprechen",
  "Stumm",
  "Aufrichten (|P|g|U|p)",
  "Cursor Level (|T|a|b)",
  "Klettern / Springen",
  "Ducken (|P|g|D|n)",
  "Untersuchen (|C|t|r|l)",
  "Voriger Söldner",
  "Nächster Söldner (|S|p|a|c|e)",
  "|Optionen",
  "Feuerstoß (|B)",
  "B|lickrichtung",
  "Gesundheit: %d/%d\nEnergie: %d/%d\nMoral: %s",
  "Was?", // this means "what?"
  "Forts.", // an abbrieviation for "Continued"
  "Stumm aus für %s.",
  "Stumm für %s.", //
  "Fahrer",
  "Fahrzeug verlassen",
  "Trupp wechseln",
  "Fahren",
  "n.a.", // this is an acronym for "Not Applicable."
  "Benutzen ( Faustkampf )",
  "Benutzen ( Feuerwaffe )",
  "Benutzen ( Hieb-/Stichwaffe )",
  "Benutzen ( Sprengstoff )",
  "Benutzen ( Verbandskasten )",
  "(Fangen)",
  "(Nachladen)",
  "(Geben)",
  "%s Falle wurde ausgelöst.",
  "%s ist angekommen.",
  "%s hat keine Action-Punkte mehr.",
  "%s ist nicht verfügbar.",
  "%s ist fertig verbunden.",
  "%s sind die Verbände ausgegangen.",
  "Feind im Sektor!",
  "Keine Feinde in Sicht.",
  "Nicht genug Action-Punkte.",
  "Niemand bedient die Fernbedienung.",
  "Feuerstoß hat Magazin geleert!",
  "SOLDAT",
  "MONSTER",
  "MILIZ",
  "ZIVILIST",
  "Sektor verlassen",
  "OK",
  "Abbruch",
  "Gewählter Söldner",
  "Ganzer Trupp",
  "Gehe zu Sektor",

  "Gehe zu Karte",

  "Sie können den Sektor von dieser Seite aus nicht verlassen.",
  "%s ist zu weit weg.",
  "Baumkronen entfernen",
  "Baumkronen zeigen",
  "KRÄHE", // Crow, as in the large black bird
  "NACKEN",
  "KOPF",
  "TORSO",
  "BEINE",
  "Der Herrin sagen, was sie wissen will?",
  "Fingerabdruck-ID gespeichert",
  "Falsche Fingerabdruck-ID. Waffe außer Betrieb",
  "Ziel erfaßt",
  "Weg blockiert",
  "Geld einzahlen/abheben", // Help text over the $ button on the Single Merc Panel
  "Niemand braucht Erste Hilfe.",
  "Klemmt.", // Short form of JAMMED, for small inv slots
  "Kann da nicht hin.", // used ( now ) for when we click on a cliff
  "Weg ist blockiert. Mit dieser Person den Platz tauschen?",
  "Person will sich nicht bewegen",
  // In the following message, '%s' would be replaced with a quantity of money (e.g. $200)
  "Mit der Zahlung von %s einverstanden?",
  "Gratisbehandlung akzeptieren?",
  "Daryl heiraten?",
  "Schlüsselring",
  "Das ist mit einem EPC nicht möglich.",
  "Krott verschonen?",
  "Außer Reichweite",
  "Arbeiter", // People that work in mines to extract precious metals
  "Fahrzeug kann nur zwischen Sektoren fahren",
  "Automatische Erste Hilfe nicht möglich",
  "Weg blockiert für %s",
  "Ihre von Deidrannas Truppe gefangenen Soldaten sind hier inhaftiert",
  "Schloß getroffen",
  "Schloß zerstört",
  "Noch jemand an der Tür.",
  "Gesundh.: %d/%d\nTank: %d/%d",
  "%s kann %s nicht sehen.", // Cannot see person trying to talk to
];

// Varying helptext explains (for the "Go to Sector/Map" checkbox) what will happen given different circumstances in the "exiting sector" interface.
export let pExitingSectorHelpText: string[] /* STR16[] */ = [
  // Helptext for the "Go to Sector" checkbox button, that explains what will happen when the box is checked.
  "Der nächste Sektor wird sofort geladen, wenn Sie das Kästchen aktivieren.",
  "Sie kommen sofort zum Kartenbildschirm, wenn Sie das Kästchen aktivieren\nweil die Reise Zeit braucht.",

  // If you attempt to leave a sector when you have multiple squads in a hostile sector.
  "Der Sektor ist von Feinden besetzt. Sie können keine Söldner hierlassen.\nRegeln Sie das, bevor Sie neue Sektoren laden.",

  // Because you only have one squad in the sector, and the "move all" option is checked, the "go to sector" option is locked to on.
  // The helptext explains why it is locked.
  "Wenn die restlichen Söldner den Sektor verlassen,\nwird sofort der nächste Sektor geladen.",
  "Wenn die restlichen Söldner den Sektor verlassen,\nkommen Sie sofort zum Kartenbildschirm\nweil die Reise Zeit braucht.",

  // If an EPC is the selected merc, it won't allow the merc to leave alone as the merc is being escorted. The "single" button is disabled.
  "%s kann den Sektor nicht ohne Eskorte verlassen.",

  // If only one conscious merc is left and is selected, and there are EPCs in the squad, the merc will be prohibited from leaving alone.
  // There are several strings depending on the gender of the merc and how many EPCs are in the squad.
  // DO NOT USE THE NEWLINE HERE AS IT IS USED FOR BOTH HELPTEXT AND SCREEN MESSAGES!
  "%s kann den Sektor nicht verlassen, weil er %s eskortiert.", // male singular
  "%s kann den Sektor nicht verlassen, weil sie %s eskortiert.", // female singular
  "%s kann den Sektor nicht verlassen, weil er mehrere Personen eskortiert.", // male plural
  "%s kann den Sektor nicht verlassen, weil sie mehrere Personen eskortiert.", // female plural

  // If one or more of your mercs in the selected squad aren't in range of the traversal area, then the "move all" option is disabled,
  // and this helptext explains why.
  "Alle Söldner müssen in der Nähe sein\ndamit der Trupp weiterreisen kann.",

  "", // UNUSED

  // Standard helptext for single movement. Explains what will happen (splitting the squad)
  "Bei aktiviertem Kästchen reist %s alleine und\nbildet automatisch wieder einen Trupp.",

  // Standard helptext for all movement. Explains what will happen (moving the squad)
  "Bei aktiviertem Kästchen reist der ausgewählte Trupp\nweiter und verläßt den Sektor.",

  // This strings is used BEFORE the "exiting sector" interface is created. If you have an EPC selected and you attempt to tactically
  // traverse the EPC while the escorting mercs aren't near enough (or dead, dying, or unconscious), this message will appear and the
  //"exiting sector" interface will not appear. This is just like the situation where
  // This string is special, as it is not used as helptext. Do not use the special newline character (\n) for this string.
  "%s wird von Söldnern eskortiert und kann den Sektor nicht alleine verlassen. Die anderen Söldner müssen in der Nähe sein.",
];

export let pRepairStrings: string[] /* STR16[] */ = [
  "Gegenstände", // tell merc to repair items in inventory
  "Raketenstützpunkt", // tell merc to repair SAM site - SAM is an acronym for Surface to Air Missile
  "Abbruch", // cancel this menu
  "Roboter", // repair the robot
];

// NOTE: combine prestatbuildstring with statgain to get a line like the example below.
// "John has gained 3 points of marksmanship skill."
export let sPreStatBuildString: string[] /* STR16[] */ = [
  "verliert", // the merc has lost a statistic
  "gewinnt", // the merc has gained a statistic
  "Punkt", // singular
  "Punkte", // plural
  "Level", // singular
  "Level", // plural
];

export let sStatGainStrings: string[] /* STR16[] */ = [
  "Gesundheit.",
  "Beweglichkeit",
  "Geschicklichkeit",
  "Weisheit.",
  "an Medizin.",
  "an Sprengstoff.",
  "an Technik.",
  "an Treffsicherheit.",
  "Erfahrungsstufe(n).",
  "Kraft.",
  "Führungsqualität.",
];

export let pHelicopterEtaStrings: string[] /* STR16[] */ = [
  "Gesamt: ", // total distance for helicopter to travel
  " Sicher: ", // Number of safe sectors
  " Unsicher:", // Number of unsafe sectors
  "Gesamtkosten: ", // total cost of trip by helicopter
  "Ank.: ", // ETA is an acronym for "estimated time of arrival"

  // warning that the sector the helicopter is going to use for refueling is under enemy control
  "Helikopter hat fast keinen Sprit mehr und muß im feindlichen Gebiet landen.",
  "Passagiere: ",
  "Skyrider oder Absprungsort auswählen?",
  "Skyrider",
  "Absprung", // make sure length doesn't exceed 8 characters (used to be "Absprungsort")
];

export let sMapLevelString: string[] /* STR16[] */ = [
  "Ebene:", // what level below the ground is the player viewing in mapscreen
];

export let gsLoyalString: string[] /* STR16[] */ = [
  "Loyalität ", // the loyalty rating of a town ie : Loyal 53%
];

// error message for when player is trying to give a merc a travel order while he's underground.
export let gsUndergroundString: string[] /* STR16[] */ = [
  "Ich kann unter der Erde keinen Marschbefehl empfangen.",
];

export let gsTimeStrings: string[] /* STR16[] */ = [
  "h", // hours abbreviation
  "m", // minutes abbreviation
  "s", // seconds abbreviation
  "T", // days abbreviation
];

// text for the various facilities in the sector
export let sFacilitiesStrings: string[] /* STR16[] */ = [
  "Keine",
  "Hospital",
  "Fabrik",
  "Gefängnis",
  "Militär",
  "Flughafen",
  "Reichweite", // a field for soldiers to practise their shooting skills
];

// text for inventory pop up button
export let pMapPopUpInventoryText: string[] /* STR16[] */ = [
  "Inventar",
  "Exit",
];

// town strings
export let pwTownInfoStrings: string[] /* STR16[] */ = [
  "Größe", // 0 // size of the town in sectors
  "", // blank line, required
  "unter Kontrolle", // how much of town is controlled
  "Keine", // none of this town
  "Mine", // mine associated with this town
  "Loyalität", // 5 // the loyalty level of this town
  "Trainiert", // the forces in the town trained by the player
  "",
  "Wichtigste Gebäude", // main facilities in this town
  "Level", // the training level of civilians in this town
  "Zivilistentraining", // 10 // state of civilian training in town
  "Miliz", // the state of the trained civilians in the town
];

// Mine strings
export let pwMineStrings: string[] /* STR16[] */ = [
  "Mine", // 0
  "Silber",
  "Gold",
  "Tagesproduktion",
  "Maximale Produktion",
  "Aufgegeben", // 5
  "Geschlossen",
  "Fast erschöpft",
  "Produziert",
  "Status",
  "Produktionsrate",
  "Erzart", // 10
  "Kontrolle über Stadt",
  "Loyalität der Stadt",
  //	L"Minenarbeiter",
];

// blank sector strings
export let pwMiscSectorStrings: string[] /* STR16[] */ = [
  "Feindliche Verbände",
  "Sektor",
  "# der Gegenstände",
  "Unbekannt",
  "Kontrolliert",
  "Ja",
  "Nein",
];

// error strings for inventory
export let pMapInventoryErrorString: string[] /* STR16[] */ = [
  "%s ist nicht nah genug.", // Merc is in sector with item but not close enough
  "Diesen Söldner können Sie nicht auswählen.",
  "%s ist nicht im Sektor.",
  "Während einer Schlacht müssen Sie Gegenstände manuell nehmen.",
  "Während einer Schlacht müssen Sie Gegenstände manuell fallenlassen.",
  "%s ist nicht im Sektor und kann Gegenstand nicht fallen lassen.",
];

export let pMapInventoryStrings: string[] /* STR16[] */ = [
  "Ort", // sector these items are in
  "Zahl der Gegenstände", // total number of items in sector
];

// help text for the user
export let pMapScreenFastHelpTextList: string[] /* STR16[] */ = [
  "Um die Aufgabe eines Söldners zu ändern und ihn einem anderen Trupp, einem Reparatur- oder Ärzteteam zuzuweisen, klicken Sie in die 'Aufträge'-Spalte.",
  "Um einen Söldner an einen anderen Bestimmungsort zu versetzen, klicken Sie in die 'Aufträge'-Spalte.",
  "Wenn ein Söldner seinen Marschbefehl erhalten hat, kann er sich mit dem Zeitraffer schneller bewegen.",
  "Die linke Maustaste wählt den Sektor aus. Zweiter Klick auf die linke Maustaste erteilt Marschbefehl an Söldner. Mit der rechten Maustaste erhalten Sie Kurzinfos über den Sektor.",
  "Hilfe aufrufen mit Taste 'h'.",
  "Test-Text",
  "Test-Text",
  "Test-Text",
  "Test-Text",
  "In diesem Bildschirm können Sie nicht viel machen, bevor Sie in Arulco ankommen. Wenn Sie Ihr Team fertiggestellt haben, klicken Sie auf den Zeitraffer-Button unten links. Dadurch vergeht die Zeit schneller, bis Ihr Team in Arulco ankommt.",
];

// movement menu text
export let pMovementMenuStrings: string[] /* STR16[] */ = [
  "Söldner in Sektor bewegen", // title for movement box
  "Route planen", // done with movement menu, start plotting movement
  "Abbruch", // cancel this menu
  "Andere", // title for group of mercs not on squads nor in vehicles
];

export let pUpdateMercStrings: string[] /* STR16[] */ = [
  "Ups:", // an error has occured
  "Vertrag ist abgelaufen:", // this pop up came up due to a merc contract ending
  "Auftrag wurde ausgeführt:", // this pop up....due to more than one merc finishing assignments
  "Diese Söldner arbeiten wieder:", // this pop up ....due to more than one merc waking up and returing to work
  "Diese Söldner schlafen:", // this pop up ....due to more than one merc being tired and going to sleep
  "Vertrag bald abgelaufen:", // this pop up came up due to a merc contract ending
];

// map screen map border buttons help text
export let pMapScreenBorderButtonHelpText: string[] /* STR16[] */ = [
  "Städte zeigen (|W)",
  "|Minen zeigen",
  "|Teams & Feinde zeigen",
  "Luftr|aum zeigen",
  "Gegenstände zeigen (|I)",
  "Miliz & Feinde zeigen (|Z)",
];

export let pMapScreenBottomFastHelp: string[] /* STR16[] */ = [
  "|Laptop",
  "Taktik (|E|s|c)",
  "|Optionen",
  "Zeitraffer (|+)", // time compress more
  "Zeitraffer (|-)", // time compress less
  "Vorige Nachricht (|U|p)\nSeite zurück (|P|g|U|p)", // previous message in scrollable list
  "Nächste Nachricht (|D|o|w|n)\nNächste Seite (|P|g|D|n)", // next message in the scrollable list
  "Zeit Start/Stop (|S|p|a|c|e)", // start/stop time compression
];

export let pMapScreenBottomText: string[] /* STR16[] */ = [
  "Kontostand", // current balance in player bank account
];

export let pMercDeadString: string[] /* STR16[] */ = [
  "%s ist tot.",
];

export let pDayStrings: string[] /* STR16[] */ = [
  "Tag",
];

// the list of email sender names
export let pSenderNameList: string[] /* STR16[] */ = [
  "Enrico",
  "Psych Pro Inc.",
  "Online-Hilfe",
  "Psych Pro Inc.",
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
  "H, A & S Versicherung",
  "Bobby Rays",
  "Kingpin",
  "John Kulba",
  "A.I.M.",
];

// next/prev strings
export let pTraverseStrings: string[] /* STR16[] */ = [
  "Vorige",
  "Nächste",
];

// new mail notify string
export let pNewMailStrings: string[] /* STR16[] */ = [
  "Sie haben neue Mails...",
];

// confirm player's intent to delete messages
export let pDeleteMailStrings: string[] /* STR16[] */ = [
  "Mail löschen?",
  "UNGELESENE Mail löschen?",
];

// the sort header strings
export let pEmailHeaders: string[] /* STR16[] */ = [
  "Absender:",
  "Betreff:",
  "Datum:",
];

// email titlebar text
export let pEmailTitleText: string[] /* STR16[] */ = [
  "Mailbox",
];

// the financial screen strings
export let pFinanceTitle: string[] /* STR16[] */ = [
  "Buchhalter Plus", // the name we made up for the financial program in the game
];

export let pFinanceSummary: string[] /* STR16[] */ = [
  "Haben:", // the credits column (to ADD money to your account)
  "Soll:", // the debits column (to SUBTRACT money from your account)
  "Einkünfte vom Vortag:",
  "Sonstige Einzahlungen vom Vortag:",
  "Haben vom Vortag:",
  "Kontostand Ende des Tages:",
  "Tagessatz:",
  "Sonstige Einzahlungen von heute:",
  "Haben von heute:",
  "Kontostand:",
  "Voraussichtliche Einkünfte:",
  "Prognostizierter Kontostand:", // projected balance for player for tommorow
];

// headers to each list in financial screen
export let pFinanceHeaders: string[] /* STR16[] */ = [
  "Tag", // the day column
  "Haben", // the credits column (to ADD money to your account)
  "Soll", // the debits column (to SUBTRACT money from your account)
  "Kontobewegungen", // transaction type - see TransactionText below
  "Kontostand", // balance at this point in time
  "Seite", // page number
  "Tag(e)", // the day(s) of transactions this page displays
];

export let pTransactionText: string[] /* STR16[] */ = [
  "Aufgelaufene Zinsen", // interest the player has accumulated so far
  "Anonyme Einzahlung",
  "Bearbeitungsgebühr",
  "Angeheuert", // Merc was hired
  "Kauf bei Bobby Rays", // Bobby Ray is the name of an arms dealer
  "Ausgeglichene Konten bei M.E.R.C.",
  "Krankenversicherung für %s", // medical deposit for merc
  "BSE-Profilanalyse", // IMP is the acronym for International Mercenary Profiling
  "Versicherung für %s abgeschlossen",
  "Versicherung für %s verringert",
  "Versicherung für %s verlängert", // johnny contract extended
  "Versicherung für %s gekündigt",
  "Versicherungsanspruch für %s", // insurance claim for merc
  "1 Tag", // merc's contract extended for a day
  "1 Woche", // merc's contract extended for a week
  "2 Wochen", // ... for 2 weeks
  "Minenertrag",
  "",
  "Blumen kaufen",
  "Volle Rückzahlung für %s",
  "Teilw. Rückzahlung für %s",
  "Keine Rückzahlung für %s",
  "Zahlung an %s", // %s is the name of the npc being paid
  "Überweisen an %s", // transfer funds to a merc
  "Überweisen von %s", // transfer funds from a merc
  "Miliz in %s ausbilden", // initial cost to equip a town's militia
  "Gegenstände von %s gekauft.", // is used for the Shop keeper interface. The dealers name will be appended to the end of the string.
  "%s hat Geld angelegt.",
];

export let pTransactionAlternateText: string[] /* STR16[] */ = [
  "Versicherung für", // insurance for a merc
  "%ss Vertrag verl. um 1 Tag", // entend mercs contract by a day
  "%ss Vertrag verl. um 1 Woche",
  "%ss Vertrag verl. um 2 Wochen",
];

// helicopter pilot payment
export let pSkyriderText: string[] /* STR16[] */ = [
  "Skyrider wurden $%d gezahlt", // skyrider was paid an amount of money
  "Skyrider bekommt noch $%d", // skyrider is still owed an amount of money
  "Skyrider hat aufgetankt", // skyrider has finished refueling
  "", // unused
  "", // unused
  "Skyrider ist bereit für weiteren Flug.", // Skyrider was grounded but has been freed
  "Skyrider hat keine Passagiere. Wenn Sie Söldner in den Sektor transportieren wollen, weisen Sie sie einem Fahrzeug/Helikopter zu.",
];

// strings for different levels of merc morale
export let pMoralStrings: string[] /* STR16[] */ = [
  "Super",
  "Gut",
  "Stabil",
  "Schlecht",
  "Panik",
  "Mies",
];

// Mercs equipment has now arrived and is now available in Omerta or Drassen.
export let pLeftEquipmentString: string[] /* STR16[] */ = [
  "%ss Ausrüstung ist in Omerta angekommen (A9).",
  "%ss Ausrüstung ist in Drassen angekommen (B13).",
];

// Status that appears on the Map Screen
export let pMapScreenStatusStrings: string[] /* STR16[] */ = [
  "Gesundheit",
  "Energie",
  "Moral",
  "Zustand", // the condition of the current vehicle (its "health")
  "Tank", // the fuel level of the current vehicle (its "energy")
];

export let pMapScreenPrevNextCharButtonHelpText: string[] /* STR16[] */ = [
  "Voriger Söldner (|L|e|f|t)", // previous merc in the list
  "Nächster Söldner (|R|i|g|h|t)", // next merc in the list
];

export let pEtaString: string[] /* STR16[] */ = [
  "Ank.:", // eta is an acronym for Estimated Time of Arrival
];

export let pTrashItemText: string[] /* STR16[] */ = [
  "Sie werden das Ding nie wiedersehen. Trotzdem wegwerfen?", // do you want to continue and lose the item forever
  "Dieser Gegenstand sieht SEHR wichtig aus. Sie sie GANZ SICHER, daß Sie ihn wegwerfen wollen?", // does the user REALLY want to trash this item
];

export let pMapErrorString: string[] /* STR16[] */ = [
  "Trupp kann nicht reisen, wenn einer schläft.",

  // 1-5
  "Wir müssen erst an die Oberfläche.",
  "Marschbefehl? Wir sind in einem feindlichen Sektor!",
  "Wenn Söldner reisen sollen, müssen sie einem Trupp oder Fahrzeug zugewiesen werden.",
  "Sie haben noch keine Teammitglieder.", // you have no members, can't do anything
  "Söldner kann nicht gehorchen.", // merc can't comply with your order
  // 6-10
  "braucht eine Eskorte. Plazieren Sie ihn in einem Trupp mit Eskorte.", // merc can't move unescorted .. for a male
  "braucht eine Eskorte. Plazieren Sie sie in einem Trupp mit Eskorte.", // for a female
  "Söldner ist noch nicht in Arulco!",
  "Erst mal Vertrag aushandeln!",
  "",
  // 11-15
  "Marschbefehl? Hier tobt ein Kampf!",
  "Sie sind von Bloodcats umstellt in Sektor %s!",
  "Sie haben gerade eine Bloodcat-Höhle betreten in Sektor I16!",
  "",
  "Raketenstützpunkt in %s wurde erobert.",
  // 16-20
  "Mine in %s wurde erobert. Ihre Tageseinnahmen wurden reduziert auf %s.",
  "Gegner hat Sektor %s ohne Gegenwehr erobert.",
  "Mindestens ein Söldner konnte nicht eingeteilt werden.",
  "%s konnte sich nicht anschließen, weil %s voll ist",
  "%s konnte sich %s nicht anschließen, weil er zu weit weg ist.",
  // 21-25
  "Die Mine in %s ist von Deidrannas Truppen erobert worden!",
  "Deidrannas Truppen sind gerade in den Raketenstützpunkt in %s eingedrungen",
  "Deidrannas Truppen sind gerade in %s eingedrungen",
  "Deidrannas Truppen wurden gerade in %s gesichtet.",
  "Deidrannas Truppen haben gerade %s erobert.",
  // 26-30
  "Mindestens ein Söldner kann nicht schlafen.",
  "Mindestens ein Söldner ist noch nicht wach.",
  "Die Miliz kommt erst, wenn das Training beendet ist.",
  "%s kann im Moment keine Marschbefehle erhalten.",
  "Milizen außerhalb der Stadtgrenzen können nicht in andere Sektoren reisen.",
  // 31-35
  "Sie können keine Milizen in %s haben.",
  "Leere Fahrzeuge fahren nicht!",
  "%s ist nicht transportfähig!",
  "Sie müssen erst das Museum verlassen!",
  "%s ist tot!",
  // 36-40
  "%s kann nicht zu %s wechseln, weil der sich bewegt",
  "%s kann so nicht einsteigen",
  "%s kann sich nicht %s anschließen",
  "Sie können den Zeitraffer erst mit neuen Söldner benutzen!",
  "Dieses Fahrzeug kann nur auf Straßen fahren!",
  // 41-45
  "Reisenden Söldnern können Sie keine Aufträge erteilen.",
  "Kein Benzin mehr!",
  "%s ist zu müde.",
  "Keiner kann das Fahrzeug steuern.",
  "Ein oder mehrere Söldner dieses Trupps können sich jetzt nicht bewegen.",
  // 46-50
  "Ein oder mehrere Söldner des ANDEREN Trupps kann sich gerade nicht bewegen.",
  "Fahrzeug zu stark beschädigt!",
  "Nur zwei Söldner pro Sektor können Milizen trainieren.",
  "Roboter muß von jemandem bedient werden. Beide im selben Trupp plazieren.",
];

// help text used during strategic route plotting
export let pMapPlotStrings: string[] /* STR16[] */ = [
  "Klicken Sie noch einmal auf das Ziel, um die Route zu bestätigen. Klicken Sie auf andere Sektoren, um die Route zu ändern.",
  "Route bestätigt.",
  "Ziel unverändert.",
  "Route geändert.",
  "Route verkürzt.",
];

// help text used when moving the merc arrival sector
export let pBullseyeStrings: string[] /* STR16[] */ = [
  "Klicken Sie auf den Sektor, in dem die Söldner statt dessen ankommen sollen.",
  "OK. Söldner werden in %s abgesetzt",
  "Söldner können nicht dorthin fliegen. Luftraum nicht gesichert!",
  "Abbruch. Ankunftssektor unverändert,",
  "Luftraum über %s ist nicht mehr sicher! Ankunftssektor jetzt in %s.",
];

// help text for mouse regions
export let pMiscMapScreenMouseRegionHelpText: string[] /* STR16[] */ = [
  "Ins Inventar gehen (|E|n|t|e|r)",
  "Gegenstand wegwerfen",
  "Inventar verlassen (|E|n|t|e|r)",
];

// male version of where equipment is left
export let pMercHeLeaveString: string[] /* STR16[] */ = [
  "Soll %s seine Ausrüstung hier lassen (%s) oder in Drassen (B13), wenn er Arulco verläßt?",
  "Soll %s seine Ausrüstung hier lassen (%s) oder in Omerta (A9), wenn er Arulco verläßt?",
  "geht bald und läßt seine Ausrüstung in Omerta (A9).",
  "geht bald und läßt seine Ausrüstung in Drassen (B13).",
  "%s geht bald und läßt seine Ausrüstung in %s.",
];

// female version
export let pMercSheLeaveString: string[] /* STR16[] */ = [
  "Soll %s ihre Ausrüstung hier lassen (%s) oder in Drassen (B13), bevor sie Arulco verläßt?",
  "Soll %s ihre Ausrüstung hier lassen (%s) oder in Omerta (A9), bevor sie Arulco verläßt?",
  "geht bald und läßt ihre Ausrüstung in Omerta (A9).",
  "geht bald und läßt ihre Ausrüstung in Drassen (B13).",
  "%s geht bald und läßt ihre Ausrüstung in %s.",
];

export let pMercContractOverStrings: string[] /* STR16[] */ = [
  "s Vertrag war abgelaufen, und er ist nach Hause gegangen.", // merc's contract is over and has departed
  "s Vertrag war abgelaufen, und sie ist nach Hause gegangen.", // merc's contract is over and has departed
  "s Vertrag wurde gekündigt, und er ist weggegangen.", // merc's contract has been terminated
  "s Vertrag wurde gekündigt, und sie ist weggegangen.", // merc's contract has been terminated
  "Sie schulden M.E.R.C. zuviel, also ist %s gegangen.", // Your M.E.R.C. account is invalid so merc left
];

// Text used on IMP Web Pages
export let pImpPopUpStrings: string[] /* STR16[] */ = [
  "Ungültiger Code",
  "Sie wollen gerade den ganzen Evaluierungsprozeß von vorn beginnen. Sind Sie sicher?",
  "Bitte Ihren vollen Namen und Ihr Geschlecht eingeben",
  "Die Überprüfung Ihrer finanziellen Mittel hat ergeben, daß Sie sich keine Evaluierung leisten können.",
  "Option zur Zeit nicht gültig.",
  "Um eine genaue Evaluierung durchzuführen, müssen Sie mindestens noch ein Teammitglied aufnehmen können.",
  "Evaluierung bereits durchgeführt.",
];

// button labels used on the IMP site
export let pImpButtonText: string[] /* STR16[] */ = [
  "Wir über uns", // about the IMP site
  "BEGINNEN", // begin profiling
  "Persönlichkeit", // personality section
  "Eigenschaften", // personal stats/attributes section
  "Porträt", // the personal portrait selection
  "Stimme %d", // the voice selection
  "Fertig", // done profiling
  "Von vorne anfangen", // start over profiling
  "Ja, die Antwort paßt!",
  "Ja",
  "Nein",
  "Fertig", // finished answering questions
  "Zurück", // previous question..abbreviated form
  "Weiter", // next question
  "JA", // yes, I am certain
  "NEIN, ICH MÖCHTE VON VORNE ANFANGEN.", // no, I want to start over the profiling process
  "JA",
  "NEIN",
  "Zurück", // back one page
  "Abbruch", // cancel selection
  "Ja",
  "Nein, ich möchte es mir nochmal ansehen.",
  "Registrieren", // the IMP site registry..when name and gender is selected
  "Analyse wird durchgeführt", // analyzing your profile results
  "OK",
  "Stimme",
];

export let pExtraIMPStrings: string[] /* STR16[] */ = [
  "Um mit der Evaluierung zu beginnen, Persönlichkeit auswählen.",
  "Da Sie nun mit der Persönlichkeit fertig sind, wählen Sie Ihre Eigenschaften aus.",
  "Nach Festlegung der Eigenschaften können Sie nun mit der Porträtauswahl fortfahren.",
  "Wählen Sie abschließend die Stimmprobe aus, die Ihrer eigenen Stimme am nächsten kommt.",
];

export let pFilesTitle: string[] /* STR16[] */ = [
  "Akten einsehen",
];

export let pFilesSenderList: string[] /* STR16[] */ = [
  "Aufklärungsbericht", // the recon report sent to the player. Recon is an abbreviation for reconissance
  "Intercept #1", // first intercept file .. Intercept is the title of the organization sending the file...similar in function to INTERPOL/CIA/KGB..refer to fist record in files.txt for the translated title
  "Intercept #2", // second intercept file
  "Intercept #3", // third intercept file
  "Intercept #4", // fourth intercept file
  "Intercept #5", // fifth intercept file
  "Intercept #6", // sixth intercept file
];

// Text having to do with the History Log
export let pHistoryTitle: string[] /* STR16[] */ = [
  "Logbuch",
];

export let pHistoryHeaders: string[] /* STR16[] */ = [
  "Tag", // the day the history event occurred
  "Seite", // the current page in the history report we are in
  "Tag", // the days the history report occurs over
  "Ort", // location (in sector) the event occurred
  "Ereignis", // the event label
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
  "%s von A.I.M angeheuert.", // merc was hired from the aim site
  "%s von M.E.R.C. angeheuert.", // merc was hired from the aim site
  "%s ist tot.", // merc was killed
  "Rechnung an M.E.R.C. bezahlt", // paid outstanding bills at MERC
  "Enrico Chivaldoris Auftrag akzeptiert",
  // 6-10
  "BSE-Profil erstellt",
  "Versicherung abgeschlossen für %s.", // insurance contract purchased
  "Versicherung gekündigt für %s.", // insurance contract canceled
  "Versicherung ausgezahlt für %s.", // insurance claim payout for merc
  "%ss Vertrag um 1 Tag verlängert.", // Extented "mercs name"'s for a day
  // 11-15
  "%ss Vertrag um 1 Woche verlängert.", // Extented "mercs name"'s for a week
  "%ss Vertrag um 2 Wochen verlängert.", // Extented "mercs name"'s 2 weeks
  "%s entlassen.", // "merc's name" was dismissed.
  "%s geht.", // "merc's name" quit.
  "Quest begonnen.", // a particular quest started
  // 16-20
  "Quest gelöst.",
  "Mit Vorarbeiter in %s geredet", // talked to head miner of town
  "%s befreit",
  "Cheat benutzt",
  "Essen ist morgen in Omerta",
  // 21-25
  "%s heiratet Daryl Hick",
  "%ss Vertrag abgelaufen.",
  "%s rekrutiert.",
  "Enrico sieht kaum Fortschritte",
  "Schlacht gewonnen",
  // 26-30
  "Mine in %s produziert weniger",
  "Mine in %s leer",
  "Mine in %s geschlossen",
  "Mine in %s wieder offen",
  "Etwas über Gefängnis in Tixa erfahren.",
  // 31-35
  "Von Waffenfabrik in Orta gehört.",
  "Forscher in Orta gab uns viele Raketengewehre.",
  "Deidranna verfüttert Leichen.",
  "Frank erzählte von Kämpfen in San Mona.",
  "Patient denkt, er hat in den Minen etwas gesehen.",
  // 36-40
  "Devin getroffen - verkauft Sprengstoff",
  "Berühmten Ex-AIM-Mann Mike getroffen!",
  "Tony getroffen - verkauft Waffen.",
  "Sergeant Krott gab mir Raketengewehr.",
  "Kyle die Urkunde für Angels Laden gegeben.",
  // 41-45
  "Madlab will Roboter bauen.",
  "Gabby kann Tinktur gegen Käfer machen.",
  "Keith nicht mehr im Geschäft.",
  "Howard lieferte Gift an Deidranna.",
  "Keith getroffen - verkauft alles in Cambria.",
  // 46-50
  "Howard getroffen - Apotheker in Balime",
  "Perko getroffen - hat kleinen Reparaturladen.",
  "Sam aus Balime getroffen - hat Computerladen.",
  "Franz hat Elektronik und andere Sachen.",
  "Arnold repariert Sachen in Grumm.",
  // 51-55
  "Fredo repariert Elektronik in Grumm.",
  "Spende von Reichem aus Balime bekommen.",
  "Schrotthändler Jake getroffen.",
  "Ein Depp hat uns eine Codekarte gegeben.",
  "Walter bestochen, damit er Keller öffnet.",
  // 56-60
  "Wenn Dave Sprit hat, bekommen wir's gratis.",
  "Pablo bestochen.",
  "Kingpin hat Geld in San Mona-Mine.",
  "%s gewinnt Extremkampf",
  "%s verliert Extremkampf",
  // 61-65
  "%s beim Extremkampf disqualifiziert",
  "Viel Geld in verlassener Mine gefunden.",
  "Von Kingpin geschickten Mörder getroffen",
  "Kontrolle über Sektor verloren",
  "Sektor verteidigt",
  // 66-70
  "Schlacht verloren", // ENEMY_ENCOUNTER_CODE
  "Tödlicher Hinterhalt", // ENEMY_AMBUSH_CODE
  "Hinterhalt ausgehoben",
  "Angriff fehlgeschlagen", // ENTERING_ENEMY_SECTOR_CODE
  "Angriff erfolgreich",
  // 71-75
  "Monster angegriffen", // CREATURE_ATTACK_CODE
  "Von Bloodcats getötet", // BLOODCAT_AMBUSH_CODE
  "Bloodcats getötet",
  "%s wurde getötet",
  "Carmen den Kopf eines Terroristen gegeben",
  "Slay ist gegangen", // Slay is a merc and has left the team
  "%s gekillt", // History log for when a merc kills an NPC or PC
];

export let pHistoryLocations: string[] /* STR16[] */ = [
  "n.a", // N/A is an acronym for Not Applicable
];

// icon text strings that appear on the laptop
export let pLaptopIcons: string[] /* STR16[] */ = [
  "E-mail",
  "Web",
  "Finanzen",
  "Personal",
  "Logbuch",
  "Dateien",
  "Schließen",
  "sir-FER 4.0", // our play on the company name (Sirtech) and web surFER
];

// bookmarks for different websites
// IMPORTANT make sure you move down the Cancel string as bookmarks are being added
export let pBookMarkStrings: string[] /* STR16[] */ = [
  "A.I.M.",
  "Bobby Rays",
  "B.S.E",
  "M.E.R.C.",
  "Bestattungsinst.",
  "Florist",
  "Versicherung",
  "Abbruch",
];

export let pBookmarkTitle: string[] /* STR16[] */ = [
  "Lesezeichen",
  "Rechts klicken, um in Zukunft in dieses Menü zu gelangen.",
];

// When loading or download a web page
export let pDownloadString: string[] /* STR16[] */ = [
  "Download läuft",
  "Neuladen läuft",
];

// This is the text used on the bank machines, here called ATMs for Automatic Teller Machine
export let gsAtmSideButtonText: string[] /* STR16[] */ = [
  "OK",
  "Nehmen", // take money from merc
  "Geben", // give money to merc
  "Rückgängig", // cancel transaction
  "Löschen", // clear amount being displayed on the screen
];

export let gsAtmStartButtonText: string[] /* STR16[] */ = [
  "Überw $", // transfer money to merc -- short form
  "Statistik", // view stats of the merc
  "Inventar", // view the inventory of the merc
  "Anstellung",
];

export let sATMText: string[] /* STR16[] */ = [
  "Geld überw.?", // transfer funds to merc?
  "Ok?", // are we certain?
  "Betrag eingeben", // enter the amount you want to transfer to merc
  "Art auswählen", // select the type of transfer to merc
  "Nicht genug Geld", // not enough money to transfer to merc
  "Betrag muß durch $10 teilbar sein", // transfer amount must be a multiple of $10
];

// Web error messages. Please use German equivilant for these messages.
// DNS is the acronym for Domain Name Server
// URL is the acronym for Uniform Resource Locator
export let pErrorStrings: string[] /* STR16[] */ = [
  "Fehler",
  "Server hat keinen DNS-Eintrag.",
  "URL-Adresse überprüfen und nochmal versuchen.",
  "OK",
  "Verbindung zum Host wird dauernd unterbrochen. Mit längeren Übertragungszeiten ist zu rechnen.",
];

export let pPersonnelString: string[] /* STR16[] */ = [
  "Söldner:", // mercs we have
];

export let pWebTitle: string[] /* STR16[] */ = [
  "sir-FER 4.0", // our name for the version of the browser, play on company name
];

// The titles for the web program title bar, for each page loaded
export let pWebPagesTitles: string[] /* STR16[] */ = [
  "A.I.M.",
  "A.I.M. Mitglieder",
  "A.I.M. Bilder", // a mug shot is another name for a portrait
  "A.I.M. Sortierfunktion",
  "A.I.M.",
  "A.I.M. Veteranen",
  "A.I.M. Politik",
  "A.I.M. Geschichte",
  "A.I.M. Links",
  "M.E.R.C.",
  "M.E.R.C. Konten",
  "M.E.R.C. Registrierung",
  "M.E.R.C. Index",
  "Bobby Rays",
  "Bobby Rays - Waffen",
  "Bobby Rays - Munition",
  "Bobby Rays - Rüstungen",
  "Bobby Rays - Sonst.", // misc is an abbreviation for miscellaneous
  "Bobby Rays - Gebraucht",
  "Bobby Rays - Mail Order",
  "B.S.E",
  "B.S.E",
  "Fleuropa",
  "Fleuropa - Gestecke",
  "Fleuropa - Bestellformular",
  "Fleuropa - Karten",
  "Hammer, Amboß & Steigbügel Versicherungsmakler",
  "Information",
  "Vertrag",
  "Bemerkungen",
  "McGillicuttys Bestattungen",
  "",
  "URL nicht gefunden.",
  "Bobby Rays - Letzte Lieferungen",
  "",
  "",
];

export let pShowBookmarkString: string[] /* STR16[] */ = [
  "Sir-Help",
  "Erneut auf Web klicken für Lesezeichen.",
];

export let pLaptopTitles: string[] /* STR16[] */ = [
  "E-Mail",
  "Dateien",
  "Söldner-Manager",
  "Buchhalter Plus",
  "Logbuch",
];

export let pPersonnelDepartedStateStrings: string[] /* STR16[] */ = [
  //(careful not to exceed 18 characters total including spaces)
  // reasons why a merc has left.
  "Getötet",
  "Entlassen",
  "Sonstiges",
  "Heirat",
  "Vertrag zu Ende",
  "Quit",
];

// personnel strings appearing in the Personnel Manager on the laptop
export let pPersonelTeamStrings: string[] /* STR16[] */ = [
  "Aktuelles Team",
  "Ausgeschieden",
  "Tgl. Kosten:",
  "Höchste Kosten:",
  "Niedrigste Kosten:",
  "Im Kampf getötet:",
  "Entlassen:",
  "Sonstiges:",
];

export let pPersonnelCurrentTeamStatsStrings: string[] /* STR16[] */ = [
  "Schlechteste",
  "Durchschn.",
  "Beste",
];

export let pPersonnelTeamStatsStrings: string[] /* STR16[] */ = [
  "GSND",
  "BEW",
  "GES",
  "KRF",
  "FHR",
  "WSH",
  "ERF",
  "TRF",
  "TEC",
  "SPR",
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
  "Vertrag",
];

// text that appears on the update panel buttons
export let pUpdatePanelButtons: string[] /* STR16[] */ = [
  "Weiter",
  "Stop",
];

// Text which appears when everyone on your team is incapacitated and incapable of battle
export let LargeTacticalStr: string[] /* UINT16[][LARGE_STRING_LENGTH] */ = [
  "Sie sind in diesem Sektor geschlagen worden!",
  "Der Feind hat kein Erbarmen mit den Seelen Ihrer Teammitglieder und verschlingt jeden einzelnen.",
  "Ihre bewußtlosen Teammitglieder wurden gefangengenommen!",
  "Ihre Teammitglieder wurden vom Feind gefangengenommen.",
];

// Insurance Contract.c
// The text on the buttons at the bottom of the screen.
export let InsContractText: string[] /* STR16[] */ = [
  "Zurück",
  "Vor",
  "OK",
  "Löschen",
];

// Insurance Info
// Text on the buttons on the bottom of the screen
export let InsInfoText: string[] /* STR16[] */ = [
  "Zurück",
  "Vor",
];

// For use at the M.E.R.C. web site. Text relating to the player's account with MERC
export let MercAccountText: string[] /* STR16[] */ = [
  // Text on the buttons on the bottom of the screen
  "Befugnis ert.",
  "Home",
  "Konto #:",
  "Söldner",
  "Tage",
  "Rate", // 5
  "Belasten",
  "Gesamt:",
  "Zahlung von %s wirklich genehmigen?", // the %s is a string that contains the dollar amount ( ex. "$150" )
];

// For use at the M.E.R.C. web site. Text relating a MERC mercenary
export let MercInfo: string[] /* STR16[] */ = [
  "Gesundheit",
  "Beweglichkeit",
  "Geschicklichkeit",
  "Kraft",
  "Führungsqualität",
  "Weisheit",
  "Erfahrungsstufe",
  "Treffsicherheit",
  "Technik",
  "Sprengstoffe",
  "Medizin",

  "Zurück",
  "Anheuern",
  "Weiter",
  "Zusatzinfo",
  "Home",
  "Abwesend",
  "Sold:",
  "Pro Tag",
  "Verstorben",

  "Sie versuchen, zuviele Söldner anzuheuern. 18 ist Maximum.",
  "nicht da",
];

// For use at the M.E.R.C. web site. Text relating to opening an account with MERC
export let MercNoAccountText: string[] /* STR16[] */ = [
  // Text on the buttons at the bottom of the screen
  "Konto eröffnen",
  "Rückgängig",
  "Sie haben kein Konto. Möchten Sie eins eröffnen?",
];

// For use at the M.E.R.C. web site. MERC Homepage
export let MercHomePageText: string[] /* STR16[] */ = [
  // Description of various parts on the MERC page
  "Speck T. Kline, Gründer und Besitzer",
  "Hier klicken, um ein Konto zu eröffnen",
  "Hier klicken, um das Konto einzusehen",
  "Hier klicken, um Dateien einzusehen.",
  // The version number on the video conferencing system that pops up when Speck is talking
  "Speck Com v3.2",
];

// For use at MiGillicutty's Web Page.
export let sFuneralString: string[] /* STR16[] */ = [
  "McGillicuttys Bestattungen: Wir trösten trauernde Familien seit 1983.",
  "Der Bestattungsunternehmer und frühere A.I.M.-Söldner Murray \"Pops\" McGillicutty ist ein ebenso versierter wie erfahrener Bestatter.",
  "Pops hat sein ganzes Leben mit Todes- und Trauerfällen verbracht. Deshalb weiß er aus erster Hand, wie schwierig das sein kann.",
  "Das Bestattungsunternehmen McGillicutty bietet Ihnen einen umfassenden Service, angefangen bei der Schulter zum Ausweinen bis hin zur kosmetischen Aufbereitung entstellter Körperteile.",
  "McGillicuttys Bestattungen - und Ihre Lieben ruhen in Frieden.",

  // Text for the various links available at the bottom of the page
  "BLUMEN",
  "SÄRGE UND URNEN",
  "FEUERBEST.",
  "GRÄBER",
  "PIETÄT",

  // The text that comes up when you click on any of the links ( except for send flowers ).
  "Leider ist diese Site aufgrund eines Todesfalles in der Familie noch nicht fertiggestellt. Sobald das Testament eröffnet worden und die Verteilung des Erbes geklärt ist, wird diese Site fertiggestellt.",
  "Unser Mitgefühl gilt trotzdem all jenen, die es diesmal versucht haben. Bis später.",
];

// Text for the florist Home page
export let sFloristText: string[] /* STR16[] */ = [
  // Text on the button on the bottom of the page

  "Galerie",

  // Address of United Florist

  "\"Wir werfen überall per Fallschirm ab\"",
  "1-555-SCHNUPPER-MAL",
  "333 Duftmarke Dr, Aroma City, CA USA 90210",
  "http://www.schnupper-mal.com",

  // detail of the florist page

  "Wir arbeiten schnell und effizient",
  "Lieferung am darauffolgenden Tag, in fast jedes Land der Welt. Ausnahmen sind möglich. ",
  "Wir haben die garantiert niedrigsten Preise weltweit!",
  "Wenn Sie anderswo einen niedrigeren Preis für irgend ein Arrangement sehen, bekommen Sie von uns ein Dutzend Rosen umsonst!",
  "Fliegende Flora, Fauna & Blumen seit 1981.",
  "Unsere hochdekorierten Ex-Bomber-Piloten werfen das Bouquet in einem Radius von zehn Meilen rund um den Bestimmungsort ab. Jederzeit!",
  "Mit uns werden Ihre blumigsten Fantasien wahr",
  "Bruce, unser weltberühmter Designer-Florist, verwendet nur die frischesten handverlesenen Blumen aus unserem eigenen Gewächshaus.",
  "Und denken Sie daran: Was wir nicht haben, pflanzen wir für Sie - und zwar schnell!",
];

// Florist OrderForm
export let sOrderFormText: string[] /* STR16[] */ = [
  // Text on the buttons

  "Zurück",
  "Senden",
  "Löschen",
  "Galerie",

  "Name des Gestecks:",
  "Preis:", // 5
  "Bestellnr.:",
  "Liefertermin",
  "Morgen",
  "Egal",
  "Bestimmungsort", // 10
  "Extraservice",
  "Kaputtes Gesteck($10)",
  "Schwarze Rosen($20)",
  "Welkes Gesteck($10)",
  "Früchtekuchen (falls vorrätig)($10)", // 15
  "Persönliche Worte:",
  "Aufgrund der Kartengröße darf Ihre Botschaft nicht länger sein als 75 Zeichen.",
  "...oder wählen Sie eine unserer",

  "STANDARD-KARTEN",
  "Rechnung für", // 20

  // The text that goes beside the area where the user can enter their name

  "Name:",
];

// Florist Gallery.c
export let sFloristGalleryText: string[] /* STR16[] */ = [
  // text on the buttons
  "Zurück", // abbreviation for previous
  "Weiter", // abbreviation for next
  "Klicken Sie auf das Gesteck Ihrer Wahl",
  "Bitte beachten Sie, daß wir für jedes kaputte oder verwelkte Gesteck einen Aufpreis von $10 berechnen.",
  "Home",
];

export let sFloristCards: string[] /* STR16[] */ = [
  "Klicken Sie auf das Gesteck Ihrer Wahl",
  "Zurück",
];

// Text for Bobby Ray's Mail Order Site
export let BobbyROrderFormText: string[] /* STR16[] */ = [
  "Bestellformular", // Title of the page
  "St.", // The number of items ordered
  "Gew. (%s)", // The weight of the item
  "Artikel", // The name of the item
  "Preis", // the item's weight
  "Summe", // 5	// The total price of all of items of the same type
  "Zwischensumme", // The sub total of all the item totals added
  "Frachtk. (vgl. Bestimmungsort)", // S&H is an acronym for Shipping and Handling
  "Endbetrag", // The grand total of all item totals + the shipping and handling
  "Bestimmungsort",
  "Liefergeschwindigkeit", // 10	// See below
  "$ (pro %s)", // The cost to ship the items
  "Übernacht Express", // Gets deliverd the next day
  "2 Arbeitstage", // Gets delivered in 2 days
  "Standard-Service", // Gets delivered in 3 days
  "Löschen", // 15			// Clears the order page
  "Bestellen", // Accept the order
  "Zurück", // text on the button that returns to the previous page
  "Home", // Text on the button that returns to the home page
  "* Gebrauchte Gegenstände anzeigen", // Disclaimer stating that the item is used
  "Sie haben nicht genug Geld.", // 20	// A popup message that to warn of not enough money
  "<KEINER>", // Gets displayed when there is no valid city selected
  "Wollen Sie Ihre Bestellung wirklich nach %s schicken?", // A popup that asks if the city selected is the correct one
  "Packungs-Gew.**", // Displays the weight of the package
  "** Min. Gew.", // Disclaimer states that there is a minimum weight for the package
  "Lieferungen",
];

// This text is used when on the various Bobby Ray Web site pages that sell items
export let BobbyRText: string[] /* STR16[] */ = [
  "Bestellen", // Title
  "Klicken Sie auf den gewünschten Gegenstand. Weiteres Klicken erhöht die Stückzahl. Rechte Maustaste verringert Stückzahl. Wenn Sie fertig sind, weiter mit dem Bestellformular.", // instructions on how to order

  // Text on the buttons to go the various links

  "Zurück", //
  "Feuerwfn.", // 3
  "Munition", // 4
  "Rüstung", // 5
  "Sonstiges", // 6	//misc is an abbreviation for miscellaneous
  "Gebraucht", // 7
  "Vor",
  "BESTELLEN",
  "Home", // 10

  // The following 2 lines are used on the Ammunition page.
  // They are used for help text to display how many items the player's merc has
  // that can use this type of ammo

  "Ihr Team hat", // 11
  "Waffe(n), die dieses Kaliber benutzen", // 12

  // The following lines provide information on the items

  "Gew.:", // Weight of all the items of the same type
  "Kal:", // the caliber of the gun
  "Mag:", // number of rounds of ammo the Magazine can hold
  "Reichw.", // The range of the gun
  "Schaden", // Damage of the weapon
  "Freq.:", // Weapon's Rate Of Fire, acroymn ROF
  "Preis:", // Cost of the item
  "Vorrätig:", // The number of items still in the store's inventory
  "Bestellt:", // The number of items on order
  "Beschädigt", // If the item is damaged
  "Gew.:", // the Weight of the item
  "Summe:", // The total cost of all items on order
  "* %% Funktion", // if the item is damaged, displays the percent function of the item

  // Popup that tells the player that they can only order 10 items at a time
  "Mist! Mit diesem Formular können Sie nur 10 Sachen bestellen. Wenn Sie mehr wollen (was wir sehr hoffen), füllen Sie bitte noch ein Formular aus.",

  // A popup that tells the user that they are trying to order more items then the store has in stock

  "Sorry. Davon haben wir leider im Moment nichts mehr auf Lager. Versuchen Sie es später noch einmal.",

  // A popup that tells the user that the store is temporarily sold out

  "Es tut uns sehr leid, aber im Moment sind diese Sachen total ausverkauft.",
];

// Text for Bobby Ray's Home Page
export let BobbyRaysFrontText: string[] /* STR16[] */ = [
  // Details on the web site

  "Dies ist die heißeste Site für Waffen und militärische Ausrüstung aller Art",
  "Welchen Sprengstoff Sie auch immer brauchen - wir haben ihn.",
  "SECOND HAND",

  // Text for the various links to the sub pages

  "SONSTIGES",
  "FEUERWAFFEN",
  "MUNITION", // 5
  "RÜSTUNG",

  // Details on the web site

  "Was wir nicht haben, das hat auch kein anderer",
  "In Arbeit",
];

// Text for the AIM page.
// This is the text used when the user selects the way to sort the aim mercanaries on the AIM mug shot page
export let AimSortText: string[] /* STR16[] */ = [
  "A.I.M. Mitglieder", // Title
  "Sortieren:", // Title for the way to sort

  // sort by...

  "Preis",
  "Erfahrung",
  "Treffsicherheit",
  "Medizin",
  "Sprengstoff",
  "Technik",

  // Text of the links to other AIM pages

  "Den Söldner-Kurzindex ansehen",
  "Personalakte der Söldner ansehen",
  "Die AIM-Veteranengalerie ansehen",

  // text to display how the entries will be sorted

  "Aufsteigend",
  "Absteigend",
];

// Aim Policies.c
// The page in which the AIM policies and regulations are displayed
export let AimPolicyText: string[] /* STR16[] */ = [
  // The text on the buttons at the bottom of the page

  "Zurück",
  "AIM HomePage",
  "Regel-Index",
  "Nächste Seite",
  "Ablehnen",
  "Zustimmen",
];

// Aim Member.c
// The page in which the players hires AIM mercenaries
// Instructions to the user to either start video conferencing with the merc, or to go the mug shot index
export let AimMemberText: string[] /* STR16[] */ = [
  "Linksklick",
  "zum Kontaktieren.",
  "Rechtsklick",
  "zum Foto-Index.",
  //	L"Linksklick zum Kontaktieren. \nRechtsklick zum Foto-Index.",
];

// Aim Member.c
// The page in which the players hires AIM mercenaries
export let CharacterInfo: string[] /* STR16[] */ = [
  // The various attributes of the merc

  "Gesundh.",
  "Beweglichkeit",
  "Geschicklichkeit",
  "Kraft",
  "Führungsqualität",
  "Weisheit",
  "Erfahrungsstufe",
  "Treffsicherheit",
  "Technik",
  "Sprengstoff",
  "Medizin", // 10

  // the contract expenses' area

  "Preis",
  "Vertrag",
  "1 Tag",
  "1 Woche",
  "2 Wochen",

  // text for the buttons that either go to the previous merc,
  // start talking to the merc, or go to the next merc

  "Zurück",
  "Kontakt",
  "Weiter",
  "Zusatzinfo", // Title for the additional info for the merc's bio
  "Aktive Mitglieder", // 20		// Title of the page
  "Zusätzl. Ausrüst:", // Displays the optional gear cost
  "VERSICHERUNG erforderlich", // If the merc required a medical deposit, this is displayed
];

// Aim Member.c
// The page in which the player's hires AIM mercenaries
// The following text is used with the video conference popup
export let VideoConfercingText: string[] /* STR16[] */ = [
  "Vertragskosten:", // Title beside the cost of hiring the merc

  // Text on the buttons to select the length of time the merc can be hired

  "1 Tag",
  "1 Woche",
  "2 Wochen",

  // Text on the buttons to determine if you want the merc to come with the equipment

  "Keine Ausrüstung",
  "Ausrüstung kaufen",

  // Text on the Buttons

  "GELD ÜBERWEISEN", // to actually hire the merc
  "ABBRECHEN", // go back to the previous menu
  "ANHEUERN", // go to menu in which you can hire the merc
  "AUFLEGEN", // stops talking with the merc
  "OK",
  "NACHRICHT", // if the merc is not there, you can leave a message

  // Text on the top of the video conference popup

  "Videokonferenz mit",
  "Verbinde. . .",

  "versichert", // Displays if you are hiring the merc with the medical deposit
];

// Aim Member.c
// The page in which the player hires AIM mercenaries
// The text that pops up when you select the TRANSFER FUNDS button
export let AimPopUpText: string[] /* STR16[] */ = [
  "ELEKTRONISCHE ÜBERWEISUNG AUSGEFÜHRT", // You hired the merc
  "ÜBERWEISUNG KANN NICHT BEARBEITET WERDEN", // Player doesn't have enough money, message 1
  "NICHT GENUG GELD", // Player doesn't have enough money, message 2

  // if the merc is not available, one of the following is displayed over the merc's face

  "Im Einsatz",
  "Bitte Nachricht hinterlassen",
  "Verstorben",

  // If you try to hire more mercs than game can support

  "Sie haben bereits 18 Söldner in Ihrem Team.",

  "Mailbox",
  "Nachricht aufgenommen",
];

// AIM Link.c
export let AimLinkText: string[] /* STR16[] */ = [
  "A.I.M. Links", // The title of the AIM links page
];

// Aim History
// This page displays the history of AIM
export let AimHistoryText: string[] /* STR16[] */ = [
  "Die Geschichte von A.I.M.", // Title

  // Text on the buttons at the bottom of the page

  "Zurück",
  "Home",
  "Veteranen",
  "Weiter",
];

// Aim Mug Shot Index
// The page in which all the AIM members' portraits are displayed in the order selected by the AIM sort page.
export let AimFiText: string[] /* STR16[] */ = [
  // displays the way in which the mercs were sorted

  "Preis",
  "Erfahrung",
  "Treffsicherheit",
  "Medizin",
  "Sprengstoff",
  "Technik",

  // The title of the page, the above text gets added at the end of this text
  "A.I.M.-Mitglieder ansteigend sortiert nach %s",
  "A.I.M. Mitglieder absteigend sortiert nach %s",

  // Instructions to the players on what to do

  "Linke Maustaste",
  "um Söldner auszuwählen", // 10
  "Rechte Maustaste",
  "um Optionen einzustellen",

  // Gets displayed on top of the merc's portrait if they are...

  // Please be careful not to increase the size of strings for following three
  "Abwesend",
  "Verstorben", // 14
  "Im Dienst",
];

// AimArchives.
// The page that displays information about the older AIM alumni merc... mercs who are no longer with AIM
export let AimAlumniText: string[] /* STR16[] */ = [
  // Text of the buttons
  "SEITE 1",
  "SEITE 2",
  "SEITE 3",
  "A.I.M.-Veteranen", // Title of the page
  "ENDE", // Stops displaying information on selected merc
];

// AIM Home Page
export let AimScreenText: string[] /* STR16[] */ = [
  // AIM disclaimers

  "A.I.M. und das A.I.M.-Logo sind in den meisten Ländern eingetragene Warenzeichen.",
  "Also denken Sie nicht mal daran, uns nachzumachen.",
  "Copyright 1998-1999 A.I.M., Ltd. Alle Rechte vorbehalten.",

  // Text for an advertisement that gets displayed on the AIM page

  "Fleuropa",
  "\"Wir werfen überall per Fallschirm ab\"", // 10
  "Treffen Sie gleich zu Anfang",
  "... die richtige Wahl.",
  "Was wir nicht haben, das brauchen Sie auch nicht.",
];

// Aim Home Page
export let AimBottomMenuText: string[] /* STR16[] */ = [
  // Text for the links at the bottom of all AIM pages

  "Home",
  "Mitglieder",
  "Veteranen",
  "Regeln",
  "Geschichte",
  "Links",
];

// ShopKeeper Interface
// The shopkeeper interface is displayed when the merc wants to interact with
// the various store clerks scattered through out the game.
export let SKI_Text: string[] /* STR16[] */ = [
  "WAREN VORRÄTIG", // Header for the merchandise available
  "SEITE", // The current store inventory page being displayed
  "KOSTEN", // The total cost of the the items in the Dealer inventory area
  "WERT", // The total value of items player wishes to sell
  "SCHÄTZUNG", // Button text for dealer to evaluate items the player wants to sell
  "TRANSAKTION", // Button text which completes the deal. Makes the transaction.
  "FERTIG", // Text for the button which will leave the shopkeeper interface.
  "KOSTEN", // The amount the dealer will charge to repair the merc's goods
  "1 STUNDE", // SINGULAR! The text underneath the inventory slot when an item is given to the dealer to be repaired
  "%d STUNDEN", // PLURAL! The text underneath the inventory slot when an item is given to the dealer to be repaired
  "REPARIERT", // Text appearing over an item that has just been repaired by a NPC repairman dealer
  "Es ist kein Platz mehr, um Sachen anzubieten.", // Message box that tells the user there is no more room to put there stuff
  "%d MINUTEN", // The text underneath the inventory slot when an item is given to the dealer to be repaired
  "Gegenstand fallenlassen.",
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
  "Nehmen", // Take money from the player
  "Geben", // Give money to the player
  "Abbruch", // Cancel the transfer
  "Löschen", // Clear the money display
];

// Shopkeeper Interface
export let gzSkiAtmText: string[] /* STR16[] */ = [
  // Text on the bank machine panel that....
  "Vorgang auswählen", // tells the user to select either to give or take from the merc
  "Betrag eingeben", // Enter the amount to transfer
  "Geld an Söldner überweisen", // Giving money to the merc
  "Geld von Söldner überweisen", // Taking money from the merc
  "Nicht genug Geld", // Not enough money to transfer
  "Kontostand", // Display the amount of money the player currently has
];

export let SkiMessageBoxText: string[] /* STR16[] */ = [
  "Möchten Sie %s von Ihrem Konto abbuchen, um die Differenz zu begleichen?",
  "Nicht genug Geld. Ihnen fehlen %s",
  "Möchten Sie %s von Ihrem Konto abbuchen, um die Kosten zu decken?",
  "Händler bitten, mit der Überweisung zu beginnen.",
  "Händler bitten, Gegenstände zu reparieren",
  "Unterhaltung beenden",
  "Kontostand",
];

// OptionScreen.c
export let zOptionsText: string[] /* STR16[] */ = [
  // button Text
  "Spiel sichern",
  "Spiel laden",
  "Spiel beenden",
  "Fertig",
  // Text above the slider bars
  "Effekte",
  "Sprache",
  "Musik",
  // Confirmation pop when the user selects..
  "Spiel verlassen und zurück zum Hauptmenü?",
  "Sprachoption oder Untertitel müssen aktiviert sein.",
];

// SaveLoadScreen
export let zSaveLoadText: string[] /* STR16[] */ = [
  "Spiel sichern",
  "Spiel laden",
  "Abbrechen",
  "Auswahl speichern",
  "Auswahl laden",

  "Spiel erfolgreich gespeichert",
  "FEHLER beim Speichern des Spiels!",
  "Spiel erfolgreich geladen",
  "FEHLER beim Laden des Spiels!",

  "Der gespeicherte Spielstand unterscheidet sich vom aktuellen Spielstand. Es kann wahrscheinlich nichts passieren. Weiter?",
  "Die gespeicherten Spielstände sind evtl. beschädigt Wollen Sie sie alle löschen?",

// Translators, the next two strings are for the same thing. The first one is for beta version releases and the second one
// is used for the final version. Please don't modify the "#ifdef JA2BETAVERSION" or the "#else" or the "#endif" as they are
// used by the compiler and will cause program errors if modified/removed. It's okay to translate the strings though.
  "Versuche, älteren Spielstand zu laden. Laden und automatisch aktualisieren?",

// Translators, the next two strings are for the same thing. The first one is for beta version releases and the second one
// is used for the final version. Please don't modify the "#ifdef JA2BETAVERSION" or the "#else" or the "#endif" as they are
// used by the compiler and will cause program errors if modified/removed. It's okay to translate the strings though.
  "Versuche, älteren Spielstand zu laden. Laden und automatisch aktualisieren?",

  "Gespeichertes Spiel in Slot #%d wirklich überschreiben?",
  "Wollen Sie das Spiel aus Slot # speichern?",

  // The first %d is a number that contains the amount of free space on the users hard drive,
  // the second is the recommended amount of free space.
  //
  "Sie haben zu wenig Festplattenspeicher. Sie haben nur %d MB frei und JA2 benötigt mindestens %d MB.",

  "Speichere...", // While the game is saving this message appears.

  "Normale Waffen",
  "Zusatzwaffen",
  "Real-Stil",
  "SciFi-Stil",
  "Schwierigkeit",
];

// MapScreen
export let zMarksMapScreenText: string[] /* STR16[] */ = [
  "Map-Level",
  "Sie haben gar keine Miliz. Sie müssen Bewohner der Stadt trainieren, wenn Sie dort eine Miliz aufstellen wollen.",
  "Tägl. Einkommen",
  "Söldner hat Lebensversicherung",
  "%s ist nicht müde.",
  "%s ist unterwegs und kann nicht schlafen.",
  "%s ist zu müde. Versuchen Sie es ein bißchen später nochmal.",
  "%s fährt.",
  "Der Trupp kann nicht weiter, wenn einer der Söldner pennt.",

  // stuff for contracts
  "Sie können zwar den Vertrag bezahlen, haben aber kein Geld für die Lebensversicherung.",
  "%s Lebensversicherungsprämien kosten %s pro %d Zusatztag(en). Wollen Sie das bezahlen?",
  "Inventar auswählen.",

  "Söldner hat Krankenversicherung.",

  // other items
  "Sanitäter", // people acting a field medics and bandaging wounded mercs
  "Patienten", // people who are being bandaged by a medic
  "Fertig", // Continue on with the game after autobandage is complete
  "Stop", // Stop autobandaging of patients by medics now
  "Sorry. Diese Option gibt es in der Demo nicht.", // informs player this option/button has been disabled in the demo

  "%s hat kein Werkzeug.",
  "%s hat kein Verbandszeug.",
  "Es sind nicht genug Leute zum Training bereit.",
  "%s ist voller Milizen.",
  "Söldner hat begrenzten Vertrag.",
  "Vertrag des Söldners ist nicht versichert",
];

export let pLandMarkInSectorString: string[] /* STR16[] */ = [
  "Trupp %d hat in Sektor %s jemanden bemerkt",
];

// confirm the player wants to pay X dollars to build a militia force in town
export let pMilitiaConfirmStrings: string[] /* STR16[] */ = [
  "Eine Milizeinheit für diese Stadt zu trainieren kostet $", // telling player how much it will cost
  "Ausgabe genehmigen?", // asking player if they wish to pay the amount requested
  "Sie haben nicht genug Geld.", // telling the player they can't afford to train this town
  "Miliz in %s (%s %d) weitertrainieren?", // continue training this town?
  "Preis $", // the cost in dollars to train militia
  "( J/N )", // abbreviated yes/no
  "Miliz auf der Raketenbasis im Sektor %s (%s %d) weitertrainieren?", // continue trainign militia in SAM site sector
  "Milizen in %d Sektoren zu trainieren kostet $ %d. %s", // cost to train sveral sectors at once
  "Sie können sich keine $%d für die Miliz hier leisten.",
  "%s benötigt eine Loyalität von %d Prozent, um mit dem Milizen-Training fortzufahren.",
  "Sie können die Miliz in %s nicht mehr trainieren.",
];

// Strings used in the popup box when withdrawing, or depositing money from the $ sign at the bottom of the single merc panel
export let gzMoneyWithdrawMessageText: string[] /* STR16[] */ = [
  "Sie können nur max. 20,000$ abheben.",
  "Wollen Sie wirklich %s auf Ihr Konto einzahlen?",
];

export let gzCopyrightText: string[] /* STR16[] */ = [
  "Copyright (C) 1999 Sir-tech Canada Ltd. Alle Rechte vorbehalten.", //
];

// option Text
export let zOptionsToggleText: string[] /* STR16[] */ = [
  "Sprache",
  "Stumme Bestätigungen",
  "Untertitel",
  "Dialoge Pause",
  "Rauch animieren",
  "Sichtbare Verletzungen",
  "Cursor nicht bewegen!",
  "Alte Auswahlmethode",
  "Weg vorzeichnen",
  "Fehlschüsse anzeigen",
  "Bestätigung bei Echtzeit",
  "Schlaf-/Wachmeldung anzeigen",
  "Metrisches System benutzen",
  "Boden beleuchten",
  "Cursor autom. auf Söldner",
  "Cursor autom. auf Türen",
  "Gegenstände leuchten",
  "Baumkronen zeigen",
  "Drahtgitter zeigen",
  "3D Cursor zeigen",
];

// This is the help text associated with the above toggles.
export let zOptionsScreenHelpText: string[] /* STR16[] */ = [
  // speech
  "Mit dieser Option hören Sie die Dialoge.",

  // Mute Confirmation
  "Schaltet die gesprochenen Bestätigungen an oder aus.",

  // Subtitles
  "Schaltet Untertitel für Dialoge ein oder aus.",

  // Key to advance speech
  "Wenn Untertitel AN sind, hat man durch diese Option Zeit, Dialoge von NPCs zu lesen.",

  // Toggle smoke animation
  "Schalten Sie diese Option ab, wenn animierter Rauch Ihre Bildwiederholrate verlangsamt.",

  // Blood n Gore
  "Diese Option abschalten, wenn Sie kein Blut sehen können. ",

  // Never move my mouse
  "Wenn Sie diese Option abstellen, wird der Mauszeiger nicht mehr von den Popup-Fenstern verdeckt.",

  // Old selection method
  "Mit dieser Option funktioniert die Auswahl der Söldner so wie in früheren JAGGED ALLIANCE-Spielen (also genau andersherum als jetzt).",

  // Show movement path
  "Diese Funktion ANschalten, um die geplanten Wege der Söldner in Echtzeit anzuzeigen\n(oder abgeschaltet lassen und bei gewünschter Anzeige die SHIFT-Taste drücken).",

  // show misses
  "Mit dieser Option zeigt Ihnen das Spiel, wo Ihre Kugeln hinfliegen, wenn Sie \"nicht treffen\".",

  // Real Time Confirmation
  "Durch diese Option wird vor der Rückkehr in den Echtzeit-Modus ein zusätzlicher \"Sicherheits\"-Klick verlangt.",

  // Sleep/Wake notification
  "Wenn ANgeschaltet werden Sie informiert, wann Ihre Söldner, die sich im \"Dienst\" befinden schlafen oder die Arbeit wieder aufnehmen.",

  // Use the metric system
  "Mit dieser Option wird im Spiel das metrische System verwendet.",

  // Merc Lighted movement
  "Diese Funktion ANschalten, wenn der Söldner beim Gehen den Boden beleuchten soll. AUSgeschaltet erhöht sich die Bildwiederholrate.",

  // Smart cursor
  "Wenn diese Funktion aktiviert ist, werden Söldner automatisch hervorgehoben, sobald der Cursor in ihrer Nähe ist.",

  // snap cursor to the door
  "Wenn diese Funktion aktiviert ist, springt der Cursor automatisch auf eine Tür, sobald eine in der Nähe ist.",

  // glow items
  "Angeschaltet bekommen Gegenstände einen pulsierenden Rahmen(|I)",

  // toggle tree tops
  "ANgeschaltet, werden die Baumkronen gezeigt (|T).",

  // toggle wireframe
  "ANgeschaltet, werden Drahtgitter für verborgene Wände gezeigt (|W).",

  "ANgeschaltet, wird der Bewegungs-Cursor in 3D angezeigt. ( |Home )",
];

export let gzGIOScreenText: string[] /* STR16[] */ = [
  "GRUNDEINSTELLUNGEN",
  "Spielmodus",
  "Realistisch",
  "SciFi",
  "Waffen",
  "Zusätzliche Waffen",
  "Normal",
  "Schwierigkeitsgrad",
  "Einsteiger",
  "Profi",
  "Alter Hase",
  "Ok",
  "Abbrechen",
  "Extraschwer",
  "Ohne Zeitlimit",
  "Mit Zeitlimit",
  "Option nicht verfügbar",
];

export let pDeliveryLocationStrings: string[] /* STR16[] */ = [
  "Austin", // Austin, Texas, USA
  "Bagdad", // Baghdad, Iraq (Suddam Hussein's home)
  "Drassen", // The main place in JA2 that you can receive items. The other towns are dummy names...
  "Hong Kong", // Hong Kong, Hong Kong
  "Beirut", // Beirut, Lebanon	(Middle East)
  "London", // London, England
  "Los Angeles", // Los Angeles, California, USA (SW corner of USA)
  "Meduna", // Meduna -- the other airport in JA2 that you can receive items.
  "Metavira", // The island of Metavira was the fictional location used by JA1
  "Miami", // Miami, Florida, USA (SE corner of USA)
  "Moskau", // Moscow, USSR
  "New York", // New York, New York, USA
  "Ottawa", // Ottawa, Ontario, Canada -- where JA2 was made!
  "Paris", // Paris, France
  "Tripolis", // Tripoli, Libya (eastern Mediterranean)
  "Tokio", // Tokyo, Japan
  "Vancouver", // Vancouver, British Columbia, Canada (west coast near US border)
];

export let pSkillAtZeroWarning: string[] /* STR16[] */ = [
  // This string is used in the IMP character generation. It is possible to select 0 ability
  // in a skill meaning you can't use it. This text is confirmation to the player.
  "Sind Sie sicher? Ein Wert von 0 bedeutet, daß der Charakter diese Fähigkeit nicht nutzen kann.",
];

export let pIMPBeginScreenStrings: string[] /* STR16[] */ = [
  "(max. 8 Buchstaben)",
];

export let pIMPFinishButtonText: string[] /* STR16[] */ = [
  "Analyse wird durchgeführt",
];

export let pIMPFinishStrings: string[] /* STR16[] */ = [
  "Danke, %s", //%s is the name of the merc
];

// the strings for imp voices screen
export let pIMPVoicesStrings: string[] /* STR16[] */ = [
  "Stimme",
];

export let pDepartedMercPortraitStrings: string[] /* STR16[] */ = [
  "Im Einsatz getötet",
  "Entlassen",
  "Sonstiges",
];

// title for program
export let pPersTitleText: string[] /* STR16[] */ = [
  "Söldner-Manager",
];

// paused game strings
export let pPausedGameText: string[] /* STR16[] */ = [
  "Pause",
  "Zurück zum Spiel (|P|a|u|s|e)",
  "Pause (|P|a|u|s|e)",
];

export let pMessageStrings: string[] /* STR16[] */ = [
  "Spiel beenden?",
  "OK",
  "JA",
  "NEIN",
  "ABBRECHEN",
  "ZURÜCK",
  "LÜGEN",
  "Keine Beschreibung", // Save slots that don't have a description.
  "Spiel gespeichert",
  "Spiel gespeichert",
  "QuickSave", // The name of the quicksave file (filename, text reference)
  "Spielstand", // The name of the normal savegame file, such as SaveGame01, SaveGame02, etc.
  "sav", // The 3 character dos extension (represents sav)
  "..\\Spielstände", // The name of the directory where games are saved.
  "Tag",
  "Söldner",
  "Leerer Slot", // An empty save game slot
  "Demo", // Demo of JA2
  "Debug", // State of development of a project (JA2) that is a debug build
  "Veröffentlichung", // Release build for JA2
  "KpM", // Abbreviation for Rounds per minute -- the potential # of bullets fired in a minute.
  "min", // Abbreviation for minute.
  "m", // One character abbreviation for meter (metric distance measurement unit).
  "Kgln", // Abbreviation for rounds (# of bullets)
  "kg", // Abbreviation for kilogram (metric weight measurement unit)
  "Pfd", // Abbreviation for pounds (Imperial weight measurement unit)
  "Home", // Home as in homepage on the internet.
  "US$", // Abbreviation for US Dollars
  "n.a", // Lowercase acronym for not applicable.
  "Inzwischen", // Meanwhile
  "%s ist angekommen im Sektor %s%s", // Name/Squad has arrived in sector A9. Order must not change without notifying SirTech
  "Version",
  "Leerer Quick-Save-Slot",
  "Dieser Slot ist nur für Quick-Saves aus den Map Screens und dem Taktik-Bildschirm. Speichern mit ALT+S",
  "offen",
  "zu",
  "Ihr Festplattenspeicher ist knapp. Sie haben lediglich %sMB frei und Jagged Alliance 2 benötigt %sMB.",
  "%s von AIM angeheuert",
  "%s hat %s gefangen.", //'Merc name' has caught 'item' -- let SirTech know if name comes after item.

  "%s hat die Droge genommen.", //'Merc name' has taken the drug
  "%s hat keine medizinischen Fähigkeiten", //'Merc name' has no medical skill.

  // CDRom errors (such as ejecting CD while attempting to read the CD)
  "Die Integrität des Spieles wurde beschädigt.", // The integrity of the game has been compromised
  "FEHLER: CD-ROM-Laufwerk schließen",

  // When firing heavier weapons in close quarters, you may not have enough room to do so.
  "Kein Platz, um von hier aus zu feuern.",

  // Can't change stance due to objects in the way...
  "Kann seine Position jetzt nicht ändern.",

  // Simple text indications that appear in the game, when the merc can do one of these things.
  "Ablegen",
  "Werfen",
  "Weitergeben",

  "%s weitergegeben an %s.", //"Item" passed to "merc". Please try to keep the item %s before the merc %s, otherwise,
                              // must notify SirTech.
  "Kein Platz, um %s an %s weiterzugeben.", // pass "item" to "merc". Same instructions as above.

  // A list of attachments appear after the items. Ex: Kevlar vest ( Ceramic Plate 'Attached )'
  " angebracht )",

  // Cheat modes
  "Cheat-Level EINS erreicht",
  "Cheat-Level ZWEI erreicht",

  // Toggling various stealth modes
  "Stealth Mode für Trupp ein.",
  "Stealth Mode für Trupp aus.",
  "Stealth Mode für %s ein.",
  "Stealth Mode für %s aus.",

  // Wireframes are shown through buildings to reveal doors and windows that can't otherwise be seen in
  // an isometric engine. You can toggle this mode freely in the game.
  "Drahtgitter ein",
  "Drahtgitter aus",

  // These are used in the cheat modes for changing levels in the game. Going from a basement level to
  // an upper level, etc.
  "Von dieser Ebene geht es nicht nach oben...",
  "Noch tiefere Ebenen gibt es nicht...",
  "Gewölbeebene %d betreten...",
  "Gewölbe verlassen...",

  "s", // used in the shop keeper inteface to mark the ownership of the item eg Red's gun
  "Autoscrolling AUS.",
  "Autoscrolling AN.",
  "3D-Cursor AUS.",
  "3D-Cursor AN.",
  "Trupp %d aktiv.",
  "Sie können %ss Tagessold von %s nicht zahlen", // first %s is the mercs name, the second is a string containing the salary
  "Abbruch",
  "%s kann alleine nicht gehen.",
  "Spielstand namens Spielstand99.sav kreiert. Wenn nötig, in Spielstand01 - Spielstand10 umbennen und über die Option 'Laden' aufrufen.",
  "%s hat %s getrunken.",
  "Paket in Drassen angekommen.",
  "%s kommt am %d. um ca. %s am Zielort an (Sektor %s).", // first %s is mercs name(OK), next is the sector location and name where they will be arriving in, lastely is the day an the time of arrival       !!!7 It should be like this: first one is merc (OK), next is day of arrival (OK) , next is time of the day for ex. 07:00 (not OK, now it is still sector), next should be sector (not OK, now it is still time of the day)
  "Logbuch aktualisiert.",
];

export let ItemPickupHelpPopup: string[] /* UINT16[][40] */ = [
  "OK",
  "Hochscrollen",
  "Alle auswählen",
  "Runterscrollen",
  "Abbrechen",
];

export let pDoctorWarningString: string[] /* STR16[] */ = [
  "%s ist nicht nahe genug, um geheilt zu werden",
  "Ihre Mediziner haben noch nicht alle verbinden können.",
];

export let pMilitiaButtonsHelpText: string[] /* STR16[] */ = [
  "Grüne Miliz aufnehmen(Rechtsklick)/absetzen(Linksklick)", // button help text informing player they can pick up or drop militia with this button
  "Reguläre Milizen aufnehmen(Rechtsklick)/absetzen(Linksklick)",
  "Elitemilizen aufnehmen(Rechtsklick)/absetzen(Linksklick)",
  "Milizen gleichmäßig über alle Sektoren verteilen",
];

export let pMapScreenJustStartedHelpText: string[] /* STR16[] */ = [
  "Zu AIM gehen und Söldner anheuern ( *Tip*: Befindet sich im Laptop )", // to inform the player to hired some mercs to get things going
  "Sobald Sie für die Reise nach Arulco bereit sind, klicken Sie auf den Zeitraffer-Button unten rechts auf dem Bildschirm.", // to inform the player to hit time compression to get the game underway
];

export let pAntiHackerString: string[] /* STR16[] */ = [
  "Fehler. Fehlende oder fehlerhafte Datei(en). Spiel wird beendet.",
];

export let gzLaptopHelpText: string[] /* STR16[] */ = [
  // Buttons:
  "E-Mail einsehen",
  "Websites durchblättern",
  "Dateien und Anlagen einsehen",
  "Logbuch lesen",
  "Team-Info einsehen",
  "Finanzen und Notizen einsehen",

  "Laptop schließen",

  // Bottom task bar icons (if they exist):
  "Sie haben neue Mail",
  "Sie haben neue Dateien",

  // Bookmarks:
  "Association of International Mercenaries",
  "Bobby Rays Online-Waffenversand",
  "Bundesinstitut für Söldnerevaluierung",
  "More Economic Recruiting Center",
  "McGillicuttys Bestattungen",
  "Fleuropa",
  "Versicherungsmakler für A.I.M.-Verträge",
];

export let gzHelpScreenText: string[] /* STR16[] */ = [
  "Helpscreen verlassen",
];

export let gzNonPersistantPBIText: string[] /* STR16[] */ = [
  "Es tobt eine Schlacht. Sie können sich nur im Taktikbildschirm zurückziehen.",
  "Sektor betreten und Kampf fortsetzen (|E).",
  "Kampf durch PC entscheiden (|A).",
  "Sie können den Kampf nicht vom PC entscheiden lassen, wenn Sie angreifen.",
  "Sie können den Kampf nicht vom PC entscheiden lassen, wenn Sie in einem Hinterhalt sind.",
  "Sie können den Kampf nicht vom PC entscheiden lassen, wenn Sie gegen Monster kämpfen.",
  "Sie können den Kampf nicht vom PC entscheiden lassen, wenn feindliche Zivilisten da sind.",
  "Sie können einen Kampf nicht vom PC entscheiden lassen, wenn Bloodcats da sind.",
  "KAMPF IM GANGE",
  "Sie können sich nicht zurückziehen, wenn Sie in einem Hinterhalt sind.",
];

export let gzMiscString: string[] /* STR16[] */ = [
  "Ihre Milizen kämpfen ohne die Hilfe der Söldner weiter...",
  "Das Fahrzeug muß nicht mehr aufgetankt werden.",
  "Der Tank ist %d%% voll.",
  "Deidrannas Armee hat wieder volle Kontrolle über %s.",
  "Sie haben ein Tanklager verloren.",
];

export let gzIntroScreen: string[] /* STR16[] */ = [
  "Kann Introvideo nicht finden",
];

// These strings are combined with a merc name, a volume string (from pNoiseVolStr),
// and a direction (either "above", "below", or a string from pDirectionStr) to
// report a noise.
// e.g. "Sidney hears a loud sound of MOVEMENT coming from the SOUTH."
export let pNewNoiseStr: string[] /* STR16[] */ = [
  // There really isn't any difference between using "coming from" or "to".
  // For the explosion case the string in English could be either:
  //	L"Gus hears a loud EXPLOSION 'to' the north.",
  //	L"Gus hears a loud EXPLOSION 'coming from' the north.",
  // For certain idioms, it sounds better to use one over the other. It is a matter of preference.
  "%s hört %s aus dem %s.",
  "%s hört eine BEWEGUNG (%s) von %s.",
  "%s hört ein KNARREN (%s) von %s.",
  "%s hört ein KLATSCHEN (%s) von %s.",
  "%s hört einen AUFSCHLAG (%s) von %s.",
  "%s hört eine EXPLOSION (%s) von %s.",
  "%s hört einen SCHREI (%s) von %s.",
  "%s hört einen AUFSCHLAG (%s) von %s.",
  "%s hört einen AUFSCHLAG (%s) von %s.",
  "%s hört ein ZERBRECHEN (%s) von %s.",
  "%s hört ein ZERSCHMETTERN (%s) von %s.",
];

export let wMapScreenSortButtonHelpText: string[] /* STR16[] */ = [
  "Sort. nach Name (|F|1)",
  "Sort. nach Auftrag (|F|2)",
  "Sort. nach wach/schlafend (|F|3)",
  "Sort. nach Ort (|F|4)",
  "Sort. nach Ziel (|F|5)",
  "Sort. nach Vertragsende (|F|6)",
];

export let BrokenLinkText: string[] /* STR16[] */ = [
  "Error 404",
  "Site nicht gefunden.",
];

export let gzBobbyRShipmentText: string[] /* STR16[] */ = [
  "Letzte Lieferungen",
  "Bestellung #",
  "Artikelanzahl",
  "Bestellt am",
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
  "Strategic Systems & Editor Programmer", // Kris \"The Cow Rape Man\" Marnes
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
  "%s hat  seine eigenen Gegenstände repariert",
  "%s hat die Waffen und Rüstungen aller Teammitglieder repariert",
  "%s hat die aktivierten Gegenstände aller Teammitglieder repariert",
  "%s hat die mitgeführten Gegenstände aller Teammitglieder repariert",
];

export let zGioDifConfirmText: string[] /* STR16[] */ = [
  "Sie haben sich für den EINSTEIGER-Modus entschieden. Dies ist die passende Einstellung für Spieler, die noch nie zuvor Jagged Alliance oder ähnliche Spiele gespielt haben oder für Spieler, die sich ganz einfach kürzere Schlachten wünschen. Ihre Wahl wird den Verlauf des ganzen Spiels beeinflussen. Treffen Sie also eine sorgfältige Wahl. Sind Sie ganz sicher, daß Sie im Einsteiger-Modus spielen wollen?",
  "Sie haben sich für den FORTGESCHRITTENEN-Modus entschieden. Dies ist die passende Einstellung für Spieler, die bereits Erfahrung mit Jagged Alliance oder ähnlichen Spielen haben. Ihre Wahl wird den Verlauf des ganzen Spiels beeinflussen. Treffen Sie also eine sorgfältige Wahl. Sind Sie ganz sicher, daß Sie im Fortgeschrittenen-Modus spielen wollen?",
  "Sie haben sich für den PROFI-Modus entschieden. Na gut, wir haben Sie gewarnt. Machen Sie hinterher bloß nicht uns dafür verantwortlich, wenn Sie im Sarg nach Hause kommen. Ihre Wahl wird den Verlauf des ganzen Spiels beeinflussen. Treffen Sie also eine sorgfältige Wahl. Sind Sie ganz sicher, daß Sie im Profi-Modus spielen wollen?",
];

export let gzLateLocalizedString: string[] /* STR16[] */ = [
  "%S Loadscreen-Daten nicht gefunden...",

  // 1-5
  "Der Roboter kann diesen Sektor nicht verlassen, wenn niemand die Fernbedienung benutzt.",

  "Sie können den Zeitraffer jetzt nicht benutzen. Warten Sie das Feuerwerk ab!",
  "%s will sich nicht bewegen.",
  "%s hat nicht genug Energie, um die Position zu ändern.",
  "%s hat kein Benzin mehr und steckt in %c%d fest.",

  // 6-10

  // the following two strings are combined with the strings below to report noises
  // heard above or below the merc
  "oben",
  "unten",

  // The following strings are used in autoresolve for autobandaging related feedback.
  "Keiner der Söldner hat medizinische Fähigkeiten.",
  "Sie haben kein Verbandszeug.",
  "Sie haben nicht genug Verbandszeug, um alle zu verarzten.",
  "Keiner der Söldner muß verbunden werden.",
  "Söldner automatisch verbinden.",
  "Alle Söldner verarztet.",

  // 14-16
  "Arulco",
  "(Dach)",
  "Gesundheit: %d/%d",

  // 17
  // In autoresolve if there were 5 mercs fighting 8 enemies the text would be "5 vs. 8"
  //"vs." is the abbreviation of versus.
  "%d gegen %d",

  // 18-19
  "%s ist voll!", //(ex "The ice cream truck is full")
  "%s braucht nicht eine schnelle Erste Hilfe, sondern eine richtige medizinische Betreuung und/oder Erholung.",

  // 20
  // Happens when you get shot in the legs, and you fall down.
  "%s ist am Bein getroffen und hingefallen!",
  // Name can't speak right now.
  "%s kann gerade nicht sprechen.",

  // 22-24 plural versions
  "%d grüne Milizen wurden zu Elitemilizen befördert.",
  "%d grüne Milizen wurden zu regulären Milizen befördert.",
  "%d reguläre Milizen wurde zu Elitemilizen befördert.",

  // 25
  "Schalter",

  // 26
  // Name has gone psycho -- when the game forces the player into burstmode (certain unstable characters)
  "%s dreht durch!",

  // 27-28
  // Messages why a player can't time compress.
  "Es ist momentan gefährlich den Zeitraffer zu betätigen, da Sie noch Söldner in Sektor %s haben.",
  "Es ist gefährlich den Zeitraffer zu betätigen, wenn Sie noch Söldner in den von Monstern verseuchten Minen haben.",

  // 29-31 singular versions
  "1 grüne Miliz wurde zur Elitemiliz befördert.",
  "1 grüne Miliz wurde zur regulären Miliz befördert.",
  "1 reguläre Miliz wurde zur Elitemiliz befördert.",

  // 32-34
  "%s sagt überhaupt nichts.",
  "Zur Oberfläche gehen?",
  "(Trupp %d)",

  // 35
  "%s reparierte %ss %s",

  // 36
  "BLOODCAT",

  // 37-38 "Name trips and falls"
  "%s stolpert und stürzt",
  "Dieser Gegenstand kann von hier aus nicht aufgehoben werden.",

  // 39
  "Keiner Ihrer übrigen Söldner ist in der Lage zu kämpfen. Die Miliz wird die Monster alleine bekämpfen",

  // 40-43
  //%s is the name of merc.
  "%s hat keinen Erste-Hilfe-Kasten mehr!",
  "%s hat nicht das geringste Talent jemanden zu verarzten!",
  "%s hat keinen Werkzeugkasten mehr!",
  "%s ist absolut unfähig dazu, irgend etwas zu reparieren!",

  // 44
  "Repar. Zeit",
  "%s kann diese Person nicht sehen.",

  // 46-48
  "%ss Gewehrlauf-Verlängerung fällt ab!",
  "Pro Sektor sind nicht mehr als %d Milizausbilder erlaubt.",
  "Sind Sie sicher?", //

  // 49-50
  "Zeitraffer", // time compression
  "Der Fahrzeugtank ist jetzt voll.",

  // 51-52 Fast help text in mapscreen.
  "Zeitraffer fortsetzen (|S|p|a|c|e)",
  "Zeitraffer anhalten (|E|s|c)",

  // 53-54 "Magic has unjammed the Glock 18" or "Magic has unjammed Raven's H&K G11"
  "%s hat die Ladehemmung der %s behoben",
  "%s hat die Ladehemmung von %ss %s behoben",

  // 55
  "Die Zeit kann nicht komprimiert werden während das Sektorinventar eingesehen wird.",

  "Die Jagged Alliance 2 PLAY CD wurde nicht gefunden. Das Programm wird jetzt beendet.",

  // L"Im Sektor sind Feinde entdeckt worden",		//STR_DETECTED_SIMULTANEOUS_ARRIVAL

  "Die Gegenstände wurden erfolgreich miteinander kombiniert.",

  // 58
  // Displayed with the version information when cheats are enabled.
  "Aktueller/Max. Fortschritt: %d%%/%d%%",

  // 59
  "John und Mary eskortieren?",

  "Switch Activated.",
];

}
