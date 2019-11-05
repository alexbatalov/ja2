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
        must fit on a single line non matter how long the string is.  All strings start with L" and end with ",
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

        Other examples are used multiple times, like the Esc key  or "|E|s|c" or Space -> (|S|p|a|c|e)

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
  "cal .38",
  "9mm",
  "cal .45",
  "cal .357",
  "cal 12",
  "CAWS",
  "5.45mm",
  "5.56mm",
  "7.62mm OTAN",
  "7.62mm PV",
  "4.7mm",
  "5.7mm",
  "Monster",
  "Roquette",
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
  "cal .38",
  "9mm",
  "cal .45",
  "cal .357",
  "cal 12",
  "CAWS",
  "5.45mm",
  "5.56mm",
  "7.62mm O.",
  "7.62mm PV",
  "4.7mm",
  "5.7mm",
  "Monster",
  "Roquette",
  "", // dart
];

export let WeaponType: string[] /* UINT16[][30] */ = [
  "Divers",
  "Pistolet",
  "Pistolet-mitrailleur",
  "Mitraillette",
  "Fusil",
  "Fusil de précision",
  "Fusil d'assaut",
  "Mitrailleuse légère",
  "Fusil à pompe",
];

export let TeamTurnString: string[] /* UINT16[][STRING_LENGTH] */ = [
  "Tour du joueur", // player's turn
  "Tour de l'adversaire",
  "Tour des créatures",
  "Tour de la milice",
  "Tour des civils",
  // planning turn
];

export let Message: string[] /* UINT16[][STRING_LENGTH] */ = [
  "",

  // In the following 8 strings, the %s is the merc's name, and the %d (if any) is a number.

  "%s est touché à la tête et perd un point de sagesse !",
  "%s est touché à l'épaule et perd un point de dextérité !",
  "%s est touché à la poitrine et perd un point de force !",
  "%s est touché à la jambe et perd un point d'agilité !",
  "%s est touché à la tête et perd %d points de sagesse !",
  "%s est touché à l'épaule et perd %d points de dextérité !",
  "%s est touché à la poitrine et perd %d points de force !",
  "%s est touché à la jambe et perd %d points d'agilité !",
  "Interruption !",

  // The first %s is a merc's name, the second is a string from pNoiseVolStr,
  // the third is a string from pNoiseTypeStr, and the last is a string from pDirectionStr

  "", // OBSOLETE
  "Les renforts sont arrivés !",

  // In the following four lines, all %s's are merc names

  "%s recharge.",
  "%s n'a pas assez de Points d'Action !",
  "%s applique les premiers soins (Appuyez sur une touche pour annuler).",
  "%s et %s appliquent les premiers soins (Appuyez sur une touche pour annuler).",
  // the following 17 strings are used to create lists of gun advantages and disadvantages
  // (separated by commas)
  "fiable",
  "peu fiable",
  "facile à entretenir",
  "difficile à entretenir",
  "puissant",
  "peu puissant",
  "cadence de tir élevée",
  "faible cadence de tir",
  "longue portée",
  "courte portée",
  "léger",
  "encombrant",
  "petit",
  "tir en rafale",
  "pas de tir en rafale",
  "grand chargeur",
  "petit chargeur",

  // In the following two lines, all %s's are merc names

  "Le camouflage de %s s'est effacé.",
  "Le camouflage de %s est parti.",

  // The first %s is a merc name and the second %s is an item name

  "La deuxième arme est vide !",
  "%s a volé le/la %s.",

  // The %s is a merc name

  "L'arme de %s ne peut pas tirer en rafale.",

  "Vous avez déjà ajouté cet accessoire.",
  "Combiner les objets ?",

  // Both %s's are item names

  "Vous ne pouvez combiner un(e) %s avec un(e) %s.",

  "Aucun",
  "Ejecter chargeur",
  "Accessoire",

  // You cannot use "item(s)" and your "other item" at the same time.
  // Ex:  You cannot use sun goggles and you gas mask at the same time.
  "Vous ne pouvez utiliser votre %s et votre %s simultanément.",

  "Vous pouvez combiner cet accessoire avec certains objets en le mettant dans l'un des quatre emplacements disponibles.",
  "Vous pouvez combiner cet accessoire avec certains objets en le mettant dans l'un des quatre emplacements disponibles (Ici, cet accessoire n'est pas compatible avec cet objet).",
  "Ce secteur n'a pas été sécurisé !",
  "Vous devez donner %s à %s", // inverted !! you still need to give the letter to X
  "%s a été touché à la tête !",
  "Rompre le combat ?",
  "Cet accessoire ne pourra plus être enlevé. Désirez-vous toujours le mettre ?",
  "%s se sent beaucoup mieux !",
  "%s a glissé sur des billes !",
  "%s n'est pas parvenu à ramasser le/la %s !",
  "%s a réparé le %s",
  "Interruption pour ",
  "Voulez-vous vous rendre ?",
  "Cette personne refuse votre aide.",
  "JE NE CROIS PAS !",
  "Pour utiliser l'hélicoptère de Skyrider, vous devez ASSIGNER vos mercenaires au VEHICULE.",
  "%s ne peut recharger qu'UNE arme",
  "Tour des chats sauvages",
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
  "Pause",
  "Normal",
  "5 min",
  "30 min",
  "60 min",
  "6 hrs",
];

// Assignment Strings: what assignment does the merc  have right now? For example, are they on a squad, training,
// administering medical aid (doctor) or training a town. All are abbreviated. 8 letters is the longest it can be.

export let pAssignmentStrings: string[] /* STR16[] */ = [
  "Esc. 1",
  "Esc. 2",
  "Esc. 3",
  "Esc. 4",
  "Esc. 5",
  "Esc. 6",
  "Esc. 7",
  "Esc. 8",
  "Esc. 9",
  "Esc. 10",
  "Esc. 11",
  "Esc. 12",
  "Esc. 13",
  "Esc. 14",
  "Esc. 15",
  "Esc. 16",
  "Esc. 17",
  "Esc. 18",
  "Esc. 19",
  "Esc. 20",
  "Service", // on active duty
  "Docteur", // administering medical aid
  "Patient", // getting medical aid
  "Transport", // in a vehicle
  "Transit", // in transit - abbreviated form
  "Réparation", // repairing
  "Formation", // training themselves
  "Milice", // training a town to revolt
  "Entraîneur", // training a teammate
  "Elève", // being trained by someone else
  "Mort", // dead
  "Incap.", // abbreviation for incapacitated
  "Capturé", // Prisoner of war - captured
  "Hôpital", // patient in a hospital
  "Vide", // Vehicle is empty
];

export let pMilitiaString: string[] /* STR16[] */ = [
  "Milice", // the title of the militia box
  "Disponibles", // the number of unassigned militia troops
  "Vous ne pouvez réorganiser la milice lors d'un combat !",
];

export let pMilitiaButtonString: string[] /* STR16[] */ = [
  "Auto", // auto place the militia troops for the player
  "OK", // done placing militia troops
];

export let pConditionStrings: string[] /* STR16[] */ = [
  "Excellent", // the state of a soldier .. excellent health
  "Bon", // good health
  "Satisfaisant", // fair health
  "Blessé", // wounded health
  "Fatigué", // tired
  "Epuisé", // bleeding to death
  "Inconscient", // knocked out
  "Mourant", // near death
  "Mort", // dead
];

export let pEpcMenuStrings: string[] /* STR16[] */ = [
  "Service", // set merc on active duty
  "Patient", // set as a patient to receive medical aid
  "Transport", // tell merc to enter vehicle
  "Laisser", // let the escorted character go off on their own
  "Annuler", // close this menu
];

// look at pAssignmentString above for comments

export let pPersonnelAssignmentStrings: string[] /* STR16[] */ = [
  "Esc. 1",
  "Esc. 2",
  "Esc. 3",
  "Esc. 4",
  "Esc. 5",
  "Esc. 6",
  "Esc. 7",
  "Esc. 8",
  "Esc. 9",
  "Esc. 10",
  "Esc. 11",
  "Esc. 12",
  "Esc. 13",
  "Esc. 14",
  "Esc. 15",
  "Esc. 16",
  "Esc. 17",
  "Esc. 18",
  "Esc. 19",
  "Esc. 20",
  "Service",
  "Docteur",
  "Patient",
  "Transport",
  "Transit",
  "Réparation",
  "Formation",
  "Milice",
  "Entraîneur",
  "Elève",
  "Mort",
  "Incap.",
  "Capturé",
  "Hôpital",
  "Vide", // Vehicle is empty
];

// refer to above for comments

export let pLongAssignmentStrings: string[] /* STR16[] */ = [
  "Esc. 1",
  "Esc. 2",
  "Esc. 3",
  "Esc. 4",
  "Esc. 5",
  "Esc. 6",
  "Esc. 7",
  "Esc. 8",
  "Esc. 9",
  "Esc. 10",
  "Esc. 11",
  "Esc. 12",
  "Esc. 13",
  "Esc. 14",
  "Esc. 15",
  "Esc. 16",
  "Esc. 17",
  "Esc. 18",
  "Esc. 19",
  "Esc. 20",
  "Service",
  "Docteur",
  "Patient",
  "Transport",
  "Transit",
  "Réparation",
  "Formation",
  "Milice",
  "Entraîneur",
  "Elève",
  "Mort",
  "Incap.",
  "Capturé",
  "Hôpital", // patient in a hospital
  "Vide", // Vehicle is empty
];

// the contract options

export let pContractStrings: string[] /* STR16[] */ = [
  "Options du contrat :",
  "", // a blank line, required
  "Extension 1 jour", // offer merc a one day contract extension
  "Extension 1 semaine", // 1 week
  "Extension 2 semaines", // 2 week
  "Renvoyer", // end merc's contract
  "Annuler", // stop showing this menu
];

export let pPOWStrings: string[] /* STR16[] */ = [
  "Capturé", // an acronym for Prisoner of War
  "??",
];

export let pLongAttributeStrings: string[] /* STR16[] */ = [
  "FORCE",
  "DEXTERITE",
  "AGILITE",
  "SAGESSE",
  "TIR",
  "MEDECINE",
  "TECHNIQUE",
  "COMMANDEMENT",
  "EXPLOSIFS",
  "NIVEAU",
];

export let pInvPanelTitleStrings: string[] /* STR16[] */ = [
  "Armure", // the armor rating of the merc
  "Poids", // the weight the merc is carrying
  "Cam.", // the merc's camouflage rating
];

export let pShortAttributeStrings: string[] /* STR16[] */ = [
  "Agi", // the abbreviated version of : agilité
  "Dex", // dextérité
  "For", // strength
  "Com", // leadership
  "Sag", // sagesse
  "Niv", // experience level
  "Tir", // marksmanship skill
  "Exp", // explosive skill
  "Tec", // mechanical skill
  "Méd", // medical skill
];

export let pUpperLeftMapScreenStrings: string[] /* STR16[] */ = [
  "Affectation", // the mercs current assignment
  "Contrat", // the contract info about the merc
  "Santé", // the health level of the current merc
  "Moral", // the morale of the current merc
  "Cond.", // the condition of the current vehicle
  "Carb.", // the fuel level of the current vehicle
];

export let pTrainingStrings: string[] /* STR16[] */ = [
  "Formation", // tell merc to train self
  "Milice", // tell merc to train town
  "Entraîneur", // tell merc to act as trainer
  "Elève", // tell merc to be train by other
];

export let pGuardMenuStrings: string[] /* STR16[] */ = [
  "Cadence de tir :", // the allowable rate of fire for a merc who is guarding
  " Feu à volonté", // the merc can be aggressive in their choice of fire rates
  " Economiser munitions", // conserve ammo
  " Tir restreint", // fire only when the merc needs to
  "Autres Options :", // other options available to merc
  " Retraite", // merc can retreat
  " Abri", // merc is allowed to seek cover
  " Assistance", // merc can assist teammates
  "OK", // done with this menu
  "Annuler", // cancel this menu
];

// This string has the same comments as above, however the * denotes the option has been selected by the player

export let pOtherGuardMenuStrings: string[] /* STR16[] */ = [
  "Cadence de tir :",
  " *Feu à volonté*",
  " *Economiser munitions*",
  " *Tir restreint*",
  "Autres Options :",
  " *Retraite*",
  " *Abri*",
  " *Assistance*",
  "OK",
  "Annuler",
];

export let pAssignMenuStrings: string[] /* STR16[] */ = [
  "Service", // merc is on active duty
  "Docteur", // the merc is acting as a doctor
  "Patient", // the merc is receiving medical attention
  "Transport", // the merc is in a vehicle
  "Réparation", // the merc is repairing items
  "Formation", // the merc is training
  "Annuler", // cancel this menu
];

export let pRemoveMercStrings: string[] /* STR16[] */ = [
  "Enlever Merc", // remove dead merc from current team
  "Annuler",
];

export let pAttributeMenuStrings: string[] /* STR16[] */ = [
  "Force",
  "Dextérité",
  "Agilité",
  "Santé",
  "Tir",
  "Médecine",
  "Technique",
  "Commandement",
  "Explosifs",
  "Annuler",
];

export let pTrainingMenuStrings: string[] /* STR16[] */ = [
  "Formation", // train yourself
  "Milice", // train the town
  "Entraîneur", // train your teammates
  "Elève", // be trained by an instructor
  "Annuler", // cancel this menu
];

export let pSquadMenuStrings: string[] /* STR16[] */ = [
  "Esc. 1",
  "Esc. 2",
  "Esc. 3",
  "Esc. 4",
  "Esc. 5",
  "Esc. 6",
  "Esc. 7",
  "Esc. 8",
  "Esc. 9",
  "Esc. 10",
  "Esc. 11",
  "Esc. 12",
  "Esc. 13",
  "Esc. 14",
  "Esc. 15",
  "Esc. 16",
  "Esc. 17",
  "Esc. 18",
  "Esc. 19",
  "Esc. 20",
  "Annuler",
];

export let pPersonnelTitle: string[] /* STR16[] */ = [
  "Personnel", // the title for the personnel screen/program application
];

export let pPersonnelScreenStrings: string[] /* STR16[] */ = [
  "Santé : ", // health of merc
  "Agilité : ",
  "Dextérité : ",
  "Force : ",
  "Commandement : ",
  "Sagesse : ",
  "Niv. Exp. : ", // experience level
  "Tir : ",
  "Technique : ",
  "Explosifs : ",
  "Médecine : ",
  "Acompte méd. : ", // amount of medical deposit put down on the merc
  "Contrat : ", // cost of current contract
  "Tués : ", // number of kills by merc
  "Participation : ", // number of assists on kills by merc
  "Coût/jour :", // daily cost of merc
  "Coût total :", // total cost of merc
  "Contrat :", // cost of current contract
  "Services rendus :", // total service rendered by merc
  "Salaires dus :", // amount left on MERC merc to be paid
  "Précision :", // percentage of shots that hit target
  "Combats :", // number of battles fought
  "Blessures :", // number of times merc has been wounded
  "Spécialités :",
  "Aucune spécialité",
];

// These string correspond to enums used in by the SkillTrait enums in SoldierProfileType.h
export let gzMercSkillText: string[] /* STR16[] */ = [
  "Aucune spécialité",
  "Crochetage",
  "Combat à mains nues",
  "Electronique",
  "Opérations de nuit",
  "Lancer",
  "Enseigner",
  "Armes lourdes",
  "Armes automatiques",
  "Furtivité",
  "Ambidextre",
  "Voleur",
  "Arts martiaux",
  "Couteau",
  "Bonus toucher (sur le toit)",
  "Camouflage",
  "(Expert)",
];

// This is pop up help text for the options that are available to the merc

export let pTacticalPopupButtonStrings: string[] /* STR16[] */ = [
  "|Debout/Marcher",
  "|Accroupi/Avancer",
  "Debout/|Courir",
  "|A terre/Ramper",
  "|Regarder",
  "Action",
  "Parler",
  "Examiner (|C|t|r|l)",

  // Pop up door menu
  "Ouvrir à la main",
  "Examen poussé",
  "Crocheter",
  "Enfoncer",
  "Désamorcer",
  "Verrouiller",
  "Déverrouiller",
  "Utiliser explosif",
  "Utiliser pied de biche",
  "Annuler (|E|c|h|a|p)",
  "Fermer",
];

// Door Traps. When we examine a door, it could have a particular trap on it. These are the traps.

export let pDoorTrapStrings: string[] /* STR16[] */ = [
  "aucun piège",
  "un piège explosif",
  "un piège électrique",
  "une alarme sonore",
  "une alarme silencieuse",
];

// Contract Extension. These are used for the contract extension with AIM mercenaries.

export let pContractExtendStrings: string[] /* STR16[] */ = [
  "jour",
  "semaine",
  "2 semaines",
];

// On the map screen, there are four columns. This text is popup help text that identifies the individual columns.

export let pMapScreenMouseRegionHelpText: string[] /* STR16[] */ = [
  "Choix personnage",
  "Affectation",
  "Destination",
  "Merc |Contrat",
  "Enlever Merc",
  "Repos",
];

// volumes of noises

export let pNoiseVolStr: string[] /* STR16[] */ = [
  "FAIBLE",
  "MOYEN",
  "FORT",
  "TRES FORT",
];

// types of noises

// OBSOLETE
export let pNoiseTypeStr: string[] /* STR16[] */ = [
  "INCONNU",
  "MOUVEMENT",
  "GRINCEMENT",
  "CLAPOTEMENT",
  "IMPACT",
  "COUP DE FEU",
  "EXPLOSION",
  "CRI",
  "IMPACT",
  "IMPACT",
  "BRUIT",
  "COLLISION",
];

// Directions that are used to report noises

export let pDirectionStr: string[] /* STR16[] */ = [
  "au NORD-EST",
  "à l'EST",
  "au SUD-EST",
  "au SUD",
  "au SUD-OUEST",
  "à l'OUEST",
  "au NORD-OUEST",
  "au NORD",
];

// These are the different terrain types.

export let pLandTypeStrings: string[] /* STR16[] */ = [
  "Ville",
  "Route",
  "Plaine",
  "Désert",
  "Bois",
  "Forêt",
  "Marais",
  "Eau",
  "Collines",
  "Infranchissable",
  "Rivière", // river from north to south
  "Rivière", // river from east to west
  "Pays étranger",
  // NONE of the following are used for directional travel, just for the sector description.
  "Tropical",
  "Cultures",
  "Plaines, route",
  "Bois, route",
  "Ferme, route",
  "Tropical, route",
  "Forêt, route",
  "Route côtière",
  "Montagne, route",
  "Côte, route",
  "Désert, route",
  "Marais, route",
  "Bois, site SAM",
  "Désert, site SAM",
  "Tropical, site SAM",
  "Meduna, site SAM",

  // These are descriptions for special sectors
  "Hôpital de Cambria",
  "Aéroport de Drassen",
  "Aéroport de Meduna",
  "Site SAM",
  "Base rebelle", // The rebel base underground in sector A10
  "Prison de Tixa", // The basement of the Tixa Prison (J9)
  "Repaire de créatures", // Any mine sector with creatures in it
  "Sous-sols d'Orta", // The basement of Orta (K4)
  "Tunnel", // The tunnel access from the maze garden in Meduna
             // leading to the secret shelter underneath the palace
  "Abri", // The shelter underneath the queen's palace
  "", // Unused
];

export let gpStrategicString: string[] /* STR16[] */ = [
  "", // Unused
  "%s détecté dans le secteur %c%d et une autre escouade est en route.", // STR_DETECTED_SINGULAR
  "%s détecté dans le secteur %c%d et d'autres escouades sont en route.", // STR_DETECTED_PLURAL
  "Voulez-vous coordonner vos mouvements de troupe ?", // STR_COORDINATE

  // Dialog strings for enemies.

  "L'ennemi vous propose de vous rendre.", // STR_ENEMY_SURRENDER_OFFER
  "L'ennemi a capturé vos mercenaires inconscients.", // STR_ENEMY_CAPTURED

  // The text that goes on the autoresolve buttons

  "Retraite", // The retreat button				//STR_AR_RETREAT_BUTTON
  "OK", // The done button				//STR_AR_DONE_BUTTON

  // The headers are for the autoresolve type (MUST BE UPPERCASE)

  "DEFENSEURS", // STR_AR_DEFEND_HEADER
  "ATTAQUANTS", // STR_AR_ATTACK_HEADER
  "RENCONTRE", // STR_AR_ENCOUNTER_HEADER
  "Secteur", // The Sector A9 part of the header		//STR_AR_SECTOR_HEADER

  // The battle ending conditions

  "VICTOIRE !", // STR_AR_OVER_VICTORY
  "DEFAITE !", // STR_AR_OVER_DEFEAT
  "REDDITION !", // STR_AR_OVER_SURRENDERED
  "CAPTURE !", // STR_AR_OVER_CAPTURED
  "RETRAITE !", // STR_AR_OVER_RETREATED

  // These are the labels for the different types of enemies we fight in autoresolve.

  "Mort", // STR_AR_MILITIA_NAME,
  "Mort", // STR_AR_ELITE_NAME,
  "Mort", // STR_AR_TROOP_NAME,
  "Admin", // STR_AR_ADMINISTRATOR_NAME,
  "Créature", // STR_AR_CREATURE_NAME,

  // Label for the length of time the battle took

  "Temps écoulé", // STR_AR_TIME_ELAPSED,

  // Labels for status of merc if retreating.  (UPPERCASE)

  "SE RETIRE", // STR_AR_MERC_RETREATED,
  "EN RETRAITE", // STR_AR_MERC_RETREATING,
  "RETRAITE", // STR_AR_MERC_RETREAT,

  // PRE BATTLE INTERFACE STRINGS
  // Goes on the three buttons in the prebattle interface.  The Auto resolve button represents
  // a system that automatically resolves the combat for the player without having to do anything.
  // These strings must be short (two lines -- 6-8 chars per line)

  "Auto.", // STR_PB_AUTORESOLVE_BTN,
  "Combat", // STR_PB_GOTOSECTOR_BTN,
  "Retraite", // STR_PB_RETREATMERCS_BTN,

  // The different headers(titles) for the prebattle interface.
  "ENNEMI REPERE", // STR_PB_ENEMYENCOUNTER_HEADER,
  "ATTAQUE ENNEMIE", // STR_PB_ENEMYINVASION_HEADER, // 30
  "EMBUSCADE !", // STR_PB_ENEMYAMBUSH_HEADER
  "VOUS PENETREZ EN SECTEUR ENNEMI", // STR_PB_ENTERINGENEMYSECTOR_HEADER
  "ATTAQUE DE CREATURES", // STR_PB_CREATUREATTACK_HEADER
  "ATTAQUE DE CHATS SAUVAGES", // STR_PB_BLOODCATAMBUSH_HEADER
  "VOUS ENTREZ DANS LE REPAIRE DES CHATS SAUVAGES", // STR_PB_ENTERINGBLOODCATLAIR_HEADER

  // Various single words for direct translation.  The Civilians represent the civilian
  // militia occupying the sector being attacked.  Limited to 9-10 chars

  "Lieu",
  "Ennemis",
  "Mercs",
  "Milice",
  "Créatures",
  "Chats",
  "Secteur",
  "Aucun", // If there are non uninvolved mercs in this fight.
  "N/A", // Acronym of Not Applicable
  "j", // One letter abbreviation of day
  "h", // One letter abbreviation of hour

  // TACTICAL PLACEMENT USER INTERFACE STRINGS
  // The four buttons

  "Annuler",
  "Dispersé",
  "Groupé",
  "OK",

  // The help text for the four buttons.  Use \n to denote new line (just like enter).

  "|Annule le déploiement des mercenaires \net vous permet de les déployer vous-même.",
  "Disperse |aléatoirement vos mercenaires \nà chaque fois.",
  "Vous permet de placer votre groupe |de mercenaires.",
  "Cliquez sur ce bouton lorsque vous avez déployé \nvos mercenaires. (|E|n|t|r|é|e)",
  "Vous devez déployer vos mercenaires \navant d'engager le combat.",

  // Various strings (translate word for word)

  "Secteur",
  "Définissez les points d'entrée",

  // Strings used for various popup message boxes.  Can be as long as desired.

  "Il semblerait que l'endroit soit inaccessible...",
  "Déployez vos mercenaires dans la zone en surbrillance.",

  // This message is for mercs arriving in sectors.  Ex:  Red has arrived in sector A9.
  // Don't uppercase first character, or add spaces on either end.

  "est arrivé dans le secteur",

  // These entries are for button popup help text for the prebattle interface.  All popup help
  // text supports the use of \n to denote new line.  Do not use spaces before or after the \n.
  "|Résolution automatique du combat\nsans charger la carte.",
  "|Résolution automatique impossible lorsque\nvous attaquez.",
  "|Pénétrez dans le secteur pour engager le combat.",
  "|Faire retraite vers le secteur précédent.", // singular version
  "|Faire retraite vers les secteurs précédents.", // multiple groups with same previous sector

  // various popup messages for battle conditions.

  //%c%d is the sector -- ex:  A9
  "L'ennemi attaque votre milice dans le secteur %c%d.",
  //%c%d is the sector -- ex:  A9
  "Les créatures attaquent votre milice dans le secteur %c%d.",
  // 1st %d refers to the number of civilians eaten by monsters,  %c%d is the sector -- ex:  A9
  // Note:  the minimum number of civilians eaten will be two.
  "Les créatures ont tué %d civils dans le secteur %s.",
  //%s is the sector location -- ex:  A9: Omerta
  "L'ennemi attaque vos mercenaires dans le secteur %s. Aucun de vos hommes ne peut combattre !",
  //%s is the sector location -- ex:  A9: Omerta
  "Les créatures attaquent vos mercenaires dans le secteur %s. Aucun de vos hommes ne peut combattre !",
];

export let gpGameClockString: string[] /* STR16[] */ = [
  // This is the day represented in the game clock.  Must be very short, 4 characters max.
  "Jour",
];

// When the merc finds a key, they can get a description of it which
// tells them where and when they found it.
export let sKeyDescriptionStrings: string[] /* STR16[2] */ = [
  "Secteur :",
  "Jour :",
];

// The headers used to describe various weapon statistics.

export let gWeaponStatsDesc: string[] /* INT16[][14] */ = [
  "Poids (%s):",
  "Etat :",
  "Munitions :", // Number of bullets left in a magazine
  "Por. :", // Range
  "Dég. :", // Damage
  "PA :", // abbreviation for Action Points
  "",
  "=",
  "=",
];

// The headers used for the merc's money.

export let gMoneyStatsDesc: string[] /* INT16[][13] */ = [
  "Montant",
  "Restant :", // this is the overall balance
  "Montant",
  "Partager :", // the amount he wants to separate from the overall balance to get two piles of money

  "Actuel",
  "Solde",
  "Montant à",
  "Retirer",
];

// The health of various creatures, enemies, characters in the game. The numbers following each are for comment
// only, but represent the precentage of points remaining.

export let zHealthStr: string[] /* UINT16[][13] */ = [
  "MOURANT", //	>= 0
  "CRITIQUE", //	>= 15
  "FAIBLE", //	>= 30
  "BLESSE", //	>= 45
  "SATISFAISANT", //	>= 60
  "BON", // 	>= 75
  "EXCELLENT", // 	>= 90
];

export let gzMoneyAmounts: string[] /* STR16[6] */ = [
  "1000",
  "100",
  "10",
  "OK",
  "Partager",
  "Retirer",
];

// short words meaning "Advantages" for "Pros" and "Disadvantages" for "Cons."
export let gzProsLabel: string /* INT16[10] */ = "Plus :";

export let gzConsLabel: string /* INT16[10] */ = "Moins :";

// Conversation options a player has when encountering an NPC
export let zTalkMenuStrings: string[] /* UINT16[6][SMALL_STRING_LENGTH] */ = [
  "Pardon ?", // meaning "Repeat yourself"
  "Amical", // approach in a friendly
  "Direct", // approach directly - let's get down to business
  "Menaçant", // approach threateningly - talk now, or I'll blow your face off
  "Donner",
  "Recruter",
];

// Some NPCs buy, sell or repair items. These different options are available for those NPCs as well.
export let zDealerStrings: string[] /* UINT16[4][SMALL_STRING_LENGTH] */ = [
  "Acheter/Vendre",
  "Acheter",
  "Vendre",
  "Réparer",
];

export let zDialogActions: string[] /* UINT16[1][SMALL_STRING_LENGTH] */ = [
  "OK",
];

// These are vehicles in the game.

export let pVehicleStrings: string[] /* STR16[] */ = [
  "Eldorado",
  "Hummer", // a hummer jeep/truck -- military vehicle
  "Camion de glaces",
  "Jeep",
  "Char",
  "Hélicoptère",
];

export let pShortVehicleStrings: string[] /* STR16[] */ = [
  "Eldor.",
  "Hummer", // the HMVV
  "Camion",
  "Jeep",
  "Char",
  "Hélico", // the helicopter
];

export let zVehicleName: string[] /* STR16[] */ = [
  "Eldorado",
  "Hummer", // a military jeep. This is a brand name.
  "Camion", // Ice cream truck
  "Jeep",
  "Char",
  "Hélico", // an abbreviation for Helicopter
];

// These are messages Used in the Tactical Screen

export let TacticalStr: string[] /* UINT16[][MED_STRING_LENGTH] */ = [
  "Raid aérien",
  "Appliquer les premiers soins ?",

  // CAMFIELD NUKE THIS and add quote #66.

  "%s a remarqué qu'il manque des objets dans cet envoi.",

  // The %s is a string from pDoorTrapStrings

  "La serrure est piégée par %s.",
  "Pas de serrure.",
  "Réussite !",
  "Echec.",
  "Réussite !",
  "Echec.",
  "La serrure n'est pas piégée.",
  "Réussite !",
  // The %s is a merc name
  "%s ne possède pas la bonne clé.",
  "Le piège est désamorcé.",
  "La serrure n'est pas piégée.",
  "Verrouillée.",
  "PORTE",
  "PIEGEE",
  "VERROUILLEE",
  "OUVERTE",
  "ENFONCEE",
  "Un interrupteur. Voulez-vous l'actionner ?",
  "Désamorcer le piège ?",
  "Préc...",
  "Suiv...",
  "Plus...",

  // In the next 2 strings, %s is an item name

  "%s posé(e) à terre.",
  "%s donné(e) à %s.",

  // In the next 2 strings, %s is a name

  "%s a été payé.",
  "%d dus à %s.",
  "Choisissez la fréquence :", // in this case, frequency refers to a radio signal
  "Nombre de tours avant explosion :", // how much time, in turns, until the bomb blows
  "Définir fréquence :", // in this case, frequency refers to a radio signal
  "Désamorcer le piège ?",
  "Enlever le drapeau bleu ?",
  "Poser un drapeau bleu ?",
  "Fin du tour",

  // In the next string, %s is a name. Stance refers to way they are standing.

  "Voulez-vous vraiment attaquer %s ?",
  "Les véhicules ne peuvent changer de position.",
  "Le robot ne peut changer de position.",

  // In the next 3 strings, %s is a name

  "%s ne peut adopter cette position ici.",
  "%s ne peut recevoir de premiers soins ici.",
  "%s n'a pas besoin de premiers soins.",
  "Impossible d'aller ici.",
  "Votre escouade est au complet. Vous ne pouvez pas ajouter quelqu'un.", // there's non room for a recruit on the player's team

  // In the next string, %s is a name

  "%s a été recruté(e).",

  // Here %s is a name and %d is a number

  "Vous devez %d $ à %s.",

  // In the next string, %s is a name

  "Escorter %s?",

  // In the next string, the first %s is a name and the second %s is an amount of money (including $ sign)

  "Engager %s à %s la journée ?",

  // This line is used repeatedly to ask player if they wish to participate in a boxing match.

  "Voulez-vous engager le combat ?",

  // In the next string, the first %s is an item name and the
  // second %s is an amount of money (including $ sign)

  "Acheter %s pour %s ?",

  // In the next string, %s is a name

  "%s est escorté(e) par l'escouade %d.",

  // These messages are displayed during play to alert the player to a particular situation

  "ENRAYE", // weapon is jammed.
  "Le robot a besoin de munitions calibre %s.", // Robot is out of ammo
  "Lancer ici ? Aucune chance.", // Merc can't throw to the destination he selected

  // These are different buttons that the player can turn on and off.

  "Furtivité (|Z)",
  "|Carte",
  "|OK (Fin du tour)",
  "Parler à",
  "Muet",
  "Position haute (|P|g|U|p)",
  "Niveau du curseur (|T|a|b)",
  "Escalader / Sauter",
  "Position basse (|P|g|D|n)",
  "Examiner (|C|t|r|l)",
  "Mercenaire précédent",
  "Mercenaire suivant (E|s|p|a|c|e)",
  "|Options",
  "|Rafale",
  "|Regarder/Pivoter",
  "Santé : %d/%d\nEnergie : %d/%d\nMoral : %s",
  "Pardon ?", // this means "what?"
  "Suite", // an abbrieviation for "Continued"
  "Sourdine désactivée pour %s.",
  "Sourdine activée pour %s.",
  "Etat : %d/%d\nCarburant : %d/%d",
  "Sortir du véhicule",
  "Changer d'escouade ( |M|a|j| |E|s|p|a|c|e )",
  "Conduire",
  "N/A", // this is an acronym for "Not Applicable."
  "Utiliser (Mains nues)",
  "Utiliser (Arme à feu)",
  "Utiliser (Couteau)",
  "Utiliser (Explosifs)",
  "Utiliser (Trousse de soins)",
  "(Prendre)",
  "(Recharger)",
  "(Donner)",
  "%s part.",
  "%s arrive.",
  "%s n'a plus de Points d'Action.",
  "%s n'est pas disponible.",
  "%s est couvert de bandages.",
  "%s n'a plus de bandages.",
  "Ennemi dans le secteur !",
  "Pas d'ennemi en vue.",
  "Pas assez de Points d'Action.",
  "Télécommande inutilisée.",
  "La rafale a vidé le chargeur !",
  "SOLDAT",
  "CREPITUS",
  "Milice",
  "CIVIL",
  "Quitter Secteur",
  "OK",
  "Annuler",
  "Mercenaire",
  "Tous",
  "GO",
  "Carte",
  "Vous ne pouvez pas quitter ce secteur par ce côté.",
  "%s est trop loin.",
  "Effacer cime des arbres",
  "Afficher cime des arbres",
  "CORBEAU", // Crow, as in the large black bird
  "COU",
  "TETE",
  "TORSE",
  "JAMBES",
  "Donner informations à la Reine ?",
  "Acquisition de l'ID digitale",
  "ID digitale refusée. Arme désactivée.",
  "Cible acquise",
  "Chemin bloqué",
  "Dépôt/Retrait", // Help text over the $ button on the Single Merc Panel
  "Personne n'a besoin de premiers soins.",
  "Enr.", // Short form of JAMMED, for small inv slots
  "Impossible d'aller ici.", // used ( now ) for when we click on a cliff
  "Chemin bloqué. Voulez-vous changer de place avec cette personne ?",
  "La personne refuse de bouger.",
  // In the following message, '%s' would be replaced with a quantity of money (e.g. $200)
  "Etes-vous d'accord pour payer %s ?",
  "Acceptez-vous le traitement médical gratuit ?",
  "Voulez-vous épouser Daryl ?",
  "Trousseau de Clés",
  "Vous ne pouvez pas faire ça avec ce personnage.",
  "Epargner Krott ?",
  "Hors de portée",
  "Mineur",
  "Un véhicule ne peut rouler qu'entre des secteurs",
  "Impossible d'apposer des bandages maintenant",
  "Chemin bloqué pour %s",
  "Vos mercenaires capturés par l'armée de Deidranna sont emprisonnés ici !",
  "Verrou touché",
  "Verrou détruit",
  "Quelqu'un d'autre veut essayer sur cette porte.",
  "Etat : %d/%d\nCarburant : %d/%d",
  "%s ne peut pas voir %s.", // Cannot see person trying to talk to
];

// Varying helptext explains (for the "Go to Sector/Map" checkbox) what will happen given different circumstances in the "exiting sector" interface.
export let pExitingSectorHelpText: string[] /* STR16[] */ = [
  // Helptext for the "Go to Sector" checkbox button, that explains what will happen when the box is checked.
  "Si vous cochez ce bouton, le secteur adjacent sera immédiatement chargé.",
  "Si vous cochez ce bouton, vous arriverez directement dans l'écran de carte\nle temps que vos mercenaires arrivent.",

  // If you attempt to leave a sector when you have multiple squads in a hostile sector.
  "Vous ne pouvez laisser vos mercenaires ici.\nVous devez d'abord nettoyer ce secteur.",

  // Because you only have one squad in the sector, and the "move all" option is checked, the "go to sector" option is locked to on.
  // The helptext explains why it is locked.
  "Faites sortir vos derniers mercenaires du secteur\npour charger le secteur adjacent.",
  "Faites sortir vos derniers mercenaires du secteur\npour aller dans l'écran de carte le temps que vos mercenaires fassent le voyage.",

  // If an EPC is the selected merc, it won't allow the merc to leave alone as the merc is being escorted.  The "single" button is disabled.
  "%s doit être escorté(e) par vos mercenaires et ne peut quitter ce secteur tout seul.",

  // If only one conscious merc is left and is selected, and there are EPCs in the squad, the merc will be prohibited from leaving alone.
  // There are several strings depending on the gender of the merc and how many EPCs are in the squad.
  // DO NOT USE THE NEWLINE HERE AS IT IS USED FOR BOTH HELPTEXT AND SCREEN MESSAGES!
  "%s escorte %s, il ne peut quitter ce secteur seul.", // male singular
  "%s escorte %s, elle ne peut quitter ce secteur seule.", // female singular
  "%s escorte plusieurs personnages, il ne peut quitter ce secteur seul.", // male plural
  "%s escorte plusieurs personnages, elle ne peut quitter ce secteur seule.", // female plural

  // If one or more of your mercs in the selected squad aren't in range of the traversal area, then the  "move all" option is disabled,
  // and this helptext explains why.
  "Tous vos mercenaires doivent être dans les environs\npour que l'escouade avance.",

  "", // UNUSED

  // Standard helptext for single movement.  Explains what will happen (splitting the squad)
  "Si vous cochez ce bouton, %s voyagera seul et sera\nautomatiquement assigné à une nouvelle escouade.",

  // Standard helptext for all movement.  Explains what will happen (moving the squad)
  "Si vous cochez ce bouton, votre escouade\nquittera le secteur.",

  // This strings is used BEFORE the "exiting sector" interface is created.  If you have an EPC selected and you attempt to tactically
  // traverse the EPC while the escorting mercs aren't near enough (or dead, dying, or unconscious), this message will appear and the
  //"exiting sector" interface will not appear.  This is just like the situation where
  // This string is special, as it is not used as helptext.  Do not use the special newline character (\n) for this string.
  "%s est escorté par vos mercenaires et ne peut quitter ce secteur seul. Vos mercenaires doivent être à proximité.",
];

export let pRepairStrings: string[] /* STR16[] */ = [
  "Objets", // tell merc to repair items in inventory
  "Site SAM", // tell merc to repair SAM site - SAM is an acronym for Surface to Air Missile
  "Annuler", // cancel this menu
  "Robot", // repair the robot
];

// NOTE: combine prestatbuildstring with statgain to get a line like the example below.
// "John has gained 3 points of marksmanship skill."

export let sPreStatBuildString: string[] /* STR16[] */ = [
  "perd", // the merc has lost a statistic
  "gagne", // the merc has gained a statistic
  "point de", // singular
  "points de", // plural
  "niveau d'", // singular
  "niveaux d'", // plural
];

export let sStatGainStrings: string[] /* STR16[] */ = [
  "santé.",
  "agilité.",
  "dextérité.",
  "sagesse.",
  "compétence médicale.",
  "compétence en explosifs.",
  "compétence technique.",
  "tir",
  "expérience.",
  "force.",
  "commandement.",
];

export let pHelicopterEtaStrings: string[] /* STR16[] */ = [
  "Distance totale :  ", // total distance for helicopter to travel
  " Aller :  ", // distance to travel to destination
  " Retour : ", // distance to return from destination to airport
  "Coût : ", // total cost of trip by helicopter
  "AHP :  ", // ETA is an acronym for "estimated time of arrival"
  "L'hélicoptère n'a plus de carburant et doit se poser en terrain ennemi !", // warning that the sector the helicopter is going to use for refueling is under enemy control ->
  "Passagers : ",
  "Sélectionner Skyrider ou l'aire d'atterrissage ?",
  "Skyrider",
  "Arrivée",
];

export let sMapLevelString: string[] /* STR16[] */ = [
  "Niveau souterrain :", // what level below the ground is the player viewing in mapscreen
];

export let gsLoyalString: string[] /* STR16[] */ = [
  "Loyauté", // the loyalty rating of a town ie : Loyal 53%
];

// error message for when player is trying to give a merc a travel order while he's underground.

export let gsUndergroundString: string[] /* STR16[] */ = [
  "Impossible de donner des ordres.",
];

export let gsTimeStrings: string[] /* STR16[] */ = [
  "h", // hours abbreviation
  "m", // minutes abbreviation
  "s", // seconds abbreviation
  "j", // days abbreviation
];

// text for the various facilities in the sector

export let sFacilitiesStrings: string[] /* STR16[] */ = [
  "Aucun",
  "Hôpital",
  "Industrie",
  "Prison",
  "Militaire",
  "Aéroport",
  "Champ de tir", // a field for soldiers to practise their shooting skills
];

// text for inventory pop up button

export let pMapPopUpInventoryText: string[] /* STR16[] */ = [
  "Inventaire",
  "Quitter",
];

// town strings

export let pwTownInfoStrings: string[] /* STR16[] */ = [
  "Taille", // 0 // size of the town in sectors
  "", // blank line, required
  "Contrôle", // how much of town is controlled
  "Aucune", // none of this town
  "Mine associée", // mine associated with this town
  "Loyauté", // 5 // the loyalty level of this town
  "Forces entraînées", // the forces in the town trained by the player
  "",
  "Principales installations", // main facilities in this town
  "Niveau", // the training level of civilians in this town
  "Formation", // 10 // state of civilian training in town
  "Milice", // the state of the trained civilians in the town
];

// Mine strings

export let pwMineStrings: string[] /* STR16[] */ = [
  "Mine", // 0
  "Argent",
  "Or",
  "Production quotidienne",
  "Production estimée",
  "Abandonnée", // 5
  "Fermée",
  "Epuisée",
  "Production",
  "Etat",
  "Productivité",
  "Type de minerai", // 10
  "Contrôle de la ville",
  "Loyauté de la ville",
  //	L"Mineurs au travail",
];

// blank sector strings

export let pwMiscSectorStrings: string[] /* STR16[] */ = [
  "Forces ennemies",
  "Secteur",
  "# d'objets",
  "Inconnu",
  "Contrôlé",
  "Oui",
  "Non",
];

// error strings for inventory

export let pMapInventoryErrorString: string[] /* STR16[] */ = [
  "%s n'est pas assez près.", // Merc is in sector with item but not close enough
  "Sélection impossible.", // MARK CARTER
  "%s n'est pas dans le bon secteur.",
  "En combat, vous devez prendre les objets vous-même.",
  "En combat, vous devez abandonner les objets vous-même.",
  "%s n'est pas dans le bon secteur.",
];

export let pMapInventoryStrings: string[] /* STR16[] */ = [
  "Lieu", // sector these items are in
  "Objets", // total number of items in sector
];

// help text for the user

export let pMapScreenFastHelpTextList: string[] /* STR16[] */ = [
  "Cliquez sur la colonne Affectation pour assigner un mercenaire à une nouvelle tâche",
  "Cliquez sur la colonne Destination pour ordonner à un mercenaire de se rendre dans un secteur",
  "Utilisez la compression du temps pour que le voyage du mercenaire vous paraisse moins long.",
  "Cliquez sur un secteur pour le sélectionner. Cliquez à nouveau pour donner un ordre de mouvement à un mercenaire ou effectuez un clic droit pour obtenir des informations sur le secteur.",
  "Appuyez sur 'H' pour afficher l'aide en ligne.",
  "Test Text",
  "Test Text",
  "Test Text",
  "Test Text",
  "Cet écran ne vous est d'aucune utilité tant que vous n'êtes pas arrivé à Arulco. Une fois votre équipe constituée, cliquez sur le bouton de compression du temps en bas à droite. Le temps vous paraîtra moins long...",
];

// movement menu text

export let pMovementMenuStrings: string[] /* STR16[] */ = [
  "Déplacement", // title for movement box
  "Route", // done with movement menu, start plotting movement
  "Annuler", // cancel this menu
  "Autre", // title for group of mercs not on squads nor in vehicles
];

export let pUpdateMercStrings: string[] /* STR16[] */ = [
  "Oups :", // an error has occured
  "Expiration du contrat :", // this pop up came up due to a merc contract ending
  "Tâches accomplies :", // this pop up....due to more than one merc finishing assignments
  "Mercenaires disponibles :", // this pop up ....due to more than one merc waking up and returing to work
  "Mercenaires au repos :", // this pop up ....due to more than one merc being tired and going to sleep
  "Contrats arrivant à échéance :", // this pop up came up due to a merc contract ending
];

// map screen map border buttons help text

export let pMapScreenBorderButtonHelpText: string[] /* STR16[] */ = [
  "Afficher |Villes",
  "Afficher |Mines",
  "Afficher |Escouades & Ennemis",
  "Afficher |Espace aérien",
  "Afficher |Objets",
  "Afficher Milice & Ennemis (|Z)",
];

export let pMapScreenBottomFastHelp: string[] /* STR16[] */ = [
  "|Poste de Travail",
  "Tactique (|E|c|h|a|p)",
  "|Options",
  "Compression du temps (|+)", // time compress more
  "Compression du temps (|-)", // time compress less
  "Message précédent (|U|p)\nPage précédente (|P|g|U|p)", // previous message in scrollable list
  "Message suivant (|D|o|w|n)\nPage suivante (|P|g|D|n)", // next message in the scrollable list
  "Interrompre/Reprendre (|S|p|a|c|e)", // start/stop time compression
];

export let pMapScreenBottomText: string[] /* STR16[] */ = [
  "Solde actuel", // current balance in player bank account
];

export let pMercDeadString: string[] /* STR16[] */ = [
  "%s est mort.",
];

export let pDayStrings: string[] /* STR16[] */ = [
  "Jour",
];

// the list of email sender names

export let pSenderNameList: string[] /* STR16[] */ = [
  "Enrico",
  "Psych Pro Inc",
  "Help Desk",
  "Psych Pro Inc",
  "Speck",
  "R.I.S.", // 5
  "Barry",
  "Blood",
  "Lynx",
  "Grizzly",
  "Vicki", // 10
  "Trevor",
  "Grunty",
  "Ivan",
  "Steroid",
  "Igor", // 15
  "Shadow",
  "Red",
  "Reaper",
  "Fidel",
  "Fox", // 20
  "Sidney",
  "Gus",
  "Buns",
  "Ice",
  "Spider", // 25
  "Cliff",
  "Bull",
  "Hitman",
  "Buzz",
  "Raider", // 30
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
  "M.I.S. Assurance",
  "Bobby Ray",
  "Kingpin",
  "John Kulba",
  "A.I.M.",
];

// next/prev strings

export let pTraverseStrings: string[] /* STR16[] */ = [
  "Précédent",
  "Suivant",
];

// new mail notify string

export let pNewMailStrings: string[] /* STR16[] */ = [
  "Vous avez des messages...",
];

// confirm player's intent to delete messages

export let pDeleteMailStrings: string[] /* STR16[] */ = [
  "Effacer message ?",
  "Effacer message NON CONSULTE ?",
];

// the sort header strings

export let pEmailHeaders: string[] /* STR16[] */ = [
  "De :",
  "Sujet :",
  "Date :",
];

// email titlebar text

export let pEmailTitleText: string[] /* STR16[] */ = [
  "Boîte aux lettres",
];

// the financial screen strings
export let pFinanceTitle: string[] /* STR16[] */ = [
  "Bookkeeper Plus", // the name we made up for the financial program in the game
];

export let pFinanceSummary: string[] /* STR16[] */ = [
  "Crédit :", // credit (subtract from) to player's account
  "Débit :", // debit (add to) to player's account
  "Revenus (hier) :",
  "Dépôts (hier) :",
  "Dépenses (hier) :",
  "Solde (fin de journée) :",
  "Revenus (aujourd'hui) :",
  "Dépôts (aujourd'hui) :",
  "Dépenses (aujourd'hui) :",
  "Solde actuel :",
  "Revenus (prévision) :",
  "Solde (prévision) :", // projected balance for player for tommorow
];

// headers to each list in financial screen

export let pFinanceHeaders: string[] /* STR16[] */ = [
  "Jour", // the day column
  "Crédit", // the credits column (to ADD money to your account)
  "Débit", // the debits column (to SUBTRACT money from your account)
  "Transaction", // transaction type - see TransactionText below
  "Solde", // balance at this point in time
  "Page", // page number
  "Jour(s)", // the day(s) of transactions this page displays
];

export let pTransactionText: string[] /* STR16[] */ = [
  "Intérêts cumulés", // interest the player has accumulated so far
  "Dépôt anonyme",
  "Commission",
  "Engagé", // Merc was hired
  "Achats Bobby Ray", // Bobby Ray is the name of an arms dealer
  "Règlement M.E.R.C.",
  "Acompte médical pour %s", // medical deposit for merc
  "Analyse IMP", // IMP is the acronym for International Mercenary Profiling
  "Assurance pour %s",
  "Réduction d'assurance pour %s",
  "Extension d'assurance pour %s", // johnny contract extended
  "Annulation d'assurance pour %s",
  "Indemnisation pour %s", // insurance claim for merc
  "1 jour", // merc's contract extended for a day
  "1 semaine", // merc's contract extended for a week
  "2 semaines", // ... for 2 weeks
  "Revenus des mines",
  "", // String nuked
  "Achat de fleurs",
  "Remboursement médical pour %s",
  "Remb. médical partiel pour %s",
  "Pas de remb. médical pour %s",
  "Paiement à %s", // %s is the name of the npc being paid
  "Transfert de fonds pour %s", // transfer funds to a merc
  "Transfert de fonds de %s", // transfer funds from a merc
  "Coût milice de %s", // initial cost to equip a town's militia
  "Achats à %s.", // is used for the Shop keeper interface.  The dealers name will be appended to the en d of the string.
  "Montant déposé par %s.",
];

export let pTransactionAlternateText: string[] /* STR16[] */ = [
  "Assurance pour", // insurance for a merc
  "Ext. contrat de %s (1 jour).", // entend mercs contract by a day
  "Ext. contrat de %s (1 semaine).",
  "Ext. contrat de %s (2 semaines).",
];

// helicopter pilot payment

export let pSkyriderText: string[] /* STR16[] */ = [
  "Skyrider a reçu %d $", // skyrider was paid an amount of money
  "Skyrider attend toujours ses %d $", // skyrider is still owed an amount of money
  "Skyrider a fait le plein", // skyrider has finished refueling
  "", // unused
  "", // unused
  "Skyrider est prêt à redécoller.", // Skyrider was grounded but has been freed
  "Skyrider n'a pas de passagers. Si vous voulez envoyer des mercenaires dans ce secteur, n'oubliez pas de les assigner à l'hélicoptère.",
];

// strings for different levels of merc morale

export let pMoralStrings: string[] /* STR16[] */ = [
  "Superbe",
  "Bon",
  "Stable",
  "Bas",
  "Paniqué",
  "Mauvais",
];

// Mercs equipment has now arrived and is now available in Omerta or Drassen.

export let pLeftEquipmentString: string[] /* STR16[] */ = [
  "L'équipement de %s est maintenant disponible à Omerta (A9).",
  "L'équipement de %s est maintenant disponible à Drassen (B13).",
];

// Status that appears on the Map Screen

export let pMapScreenStatusStrings: string[] /* STR16[] */ = [
  "Santé",
  "Energie",
  "Moral",
  "Etat", // the condition of the current vehicle (its "Santé")
  "Carburant", // the fuel level of the current vehicle (its "energy")
];

export let pMapScreenPrevNextCharButtonHelpText: string[] /* STR16[] */ = [
  "Mercenaire précédent (|G|a|u|c|h|e)", // previous merc in the list
  "Mercenaire suivant (|D|r|o|i|t|e)", // next merc in the list
];

export let pEtaString: string[] /* STR16[] */ = [
  "HPA :", // eta is an acronym for Estimated Time of Arrival
];

export let pTrashItemText: string[] /* STR16[] */ = [
  "Vous ne le reverrez jamais. Vous êtes sûr de vous ?", // do you want to continue and lose the item forever
  "Cet objet a l'air VRAIMENT important. Vous êtes bien sûr (mais alors BIEN SUR) de vouloir l'abandonner ?", // does the user REALLY want to trash this item
];

export let pMapErrorString: string[] /* STR16[] */ = [
  "L'escouade ne peut se déplacer si l'un de ses membres se repose.",

  // 1-5
  "Déplacez d'abord votre escouade.",
  "Des ordres de mouvement ? C'est un secteur hostile !",
  "Les mercenaires doivent d'abord être assignés à un véhicule.",
  "Vous n'avez plus aucun membre dans votre escouade.", // you have non members, can't do anything
  "Le mercenaire ne peut obéir.", // merc can't comply with your order
  // 6-10
  "doit être escorté. Mettez-le dans une escouade.", // merc can't move unescorted .. for a male
  "doit être escortée. Mettez-la dans une escouade.", // for a female
  "Ce mercenaire n'est pas encore arrivé !",
  "Il faudrait d'abord revoir les termes du contrat...",
  "",
  // 11-15
  "Des ordres de mouvement ? Vous êtes en plein combat !",
  "Vous êtes tombé dans une embuscade de chats sauvages dans le secteur %s !",
  "Vous venez d'entrer dans le repaire des chats sauvages (secteur I16) !",
  "",
  "Le site SAM en %s est sous contrôle ennemi.",
  // 16-20
  "La mine en %s est sous contrôle ennemi. Votre revenu journalier est réduit de %s.",
  "L'ennemi vient de prendre le contrôle du secteur %s.",
  "L'un au moins de vos mercenaires ne peut effectuer cette tâche.",
  "%s ne peut rejoindre %s (plein).",
  "%s ne peut rejoindre %s (éloignement).",
  // 21-25
  "La mine en %s a été reprise par les forces de Deidranna !",
  "Les forces de Deidranna viennent d'envahir le site SAM en %s",
  "Les forces de Deidranna viennent d'envahir %s",
  "Les forces de Deidranna ont été aperçues en %s.",
  "Les forces de Deidranna viennent de prendre %s.",
  // 26-30
  "L'un au moins de vos mercenaires ne peut se reposer.",
  "L'un au moins de vos mercenaires ne peut être réveillé.",
  "La milice n'apparaît sur l'écran qu'une fois son entraînement achevé.",
  "%s ne peut recevoir d'ordre de mouvement pour le moment.",
  "Les miliciens qui ne se trouvent pas dans les limites d'une ville ne peuvent être déplacés.",
  // 31-35
  "Vous ne pouvez pas entraîner de milice en %s.",
  "Un véhicule ne peut se déplacer s'il est vide !",
  "L'état de santé de %s ne lui permet pas de voyager !",
  "Vous devez d'abord quitter le musée !",
  "%s est mort !",
  // 36-40
  "%s ne peut passer à %s (en mouvement)",
  "%s ne peut pas pénétrer dans le véhicule de cette façon",
  "%s ne peut rejoindre %s",
  "Vous devez d'abord engager des mercenaires !",
  "Ce véhicule ne peut circuler que sur les routes !",
  // 41-45
  "Vous ne pouvez réaffecter des mercenaires qui sont en déplacement",
  "Plus d'essence !",
  "%s est trop fatigué(e) pour entreprendre ce voyage.",
  "Personne n'est capable de conduire ce véhicule.",
  "L'un au moins des membres de cette escouade ne peut se déplacer.",
  // 46-50
  "L'un au moins des AUTRES mercenaires ne peut se déplacer.",
  "Le véhicule est trop endommagé !",
  "Deux mercenaires au plus peuvent être assignés à l'entraînement de la milice dans chaque secteur.",
  "Le robot ne peut se déplacer sans son contrôleur. Mettez-les ensemble dans la même escouade.",
];

// help text used during strategic route plotting
export let pMapPlotStrings: string[] /* STR16[] */ = [
  "Cliquez à nouveau sur votre destination pour la confirmer ou cliquez sur d'autres secteurs pour définir de nouvelles étapes.",
  "Route confirmée.",
  "Destination inchangée.",
  "Route annulée.",
  "Route raccourcie.",
];

// help text used when moving the merc arrival sector
export let pBullseyeStrings: string[] /* STR16[] */ = [
  "Cliquez sur la nouvelle destination de vos mercenaires.",
  "OK. Les mercenaires arriveront en %s",
  "Les mercenaires ne peuvent être déployés ici, l'espace aérien n'est pas sécurisé !",
  "Annulé. Secteur d'arrivée inchangé.",
  "L'espace aérien en %s n'est plus sûr ! Le secteur d'arrivée est maintenant %s.",
];

// help text for mouse regions

export let pMiscMapScreenMouseRegionHelpText: string[] /* STR16[] */ = [
  "Inventaire (|E|n|t|r|é|e)",
  "Lancer objet",
  "Quitter Inventaire (|E|n|t|r|é|e)",
];

// male version of where equipment is left
export let pMercHeLeaveString: string[] /* STR16[] */ = [
  "%s doit-il abandonner son équipement sur place (%s) ou à Drassen (B13) avant de quitter Arulco ?",
  "%s doit-il abandonner son équipement sur place (%s) ou à Omerta (A9) avant de quitter Arulco ?",
  "est sur le point de partir et laissera son équipement à Omerta (A9).",
  "est sur le point de partir et laissera son équipement à Drassen (B13).",
  "%s est sur le point de partir et laissera son équipement en %s.",
];

// female version
export let pMercSheLeaveString: string[] /* STR16[] */ = [
  "%s doit-elle abandonner son équipement sur place (%s) ou à Drassen (B13) avant de quitter Arulco ?",
  "%s doit-elle abandonner son équipement sur place (%s) ou à Omerta (A9) avant de quitter Arulco ?",
  "est sur le point de partir et laissera son équipement à Omerta (A9).",
  "est sur le point de partir et laissera son équipement à Drassen (B13).",
  "%s est sur le point de partir et laissera son équipement en %s.",
];

export let pMercContractOverStrings: string[] /* STR16[] */ = [
  "a rempli son contrat, il est rentré chez lui.", // merc's contract is over and has departed
  "a rempli son contrat, elle est rentrée chez elle.", // merc's contract is over and has departed
  "est parti, son contrat ayant été annulé.", // merc's contract has been terminated
  "est partie, son contrat ayant été annulé.", // merc's contract has been terminated
  "Vous devez trop d'argent au M.E.R.C., %s quitte Arulco.", // Your M.E.R.C. account is invalid so merc left
];

// Text used on IMP Web Pages

export let pImpPopUpStrings: string[] /* STR16[] */ = [
  "Code Incorrect",
  "Vous allez établir un nouveau profil. Etes-vous sûr de vouloir recommencer ?",
  "Veuillez entrer votre nom et votre sexe.",
  "Vous n'avez pas les moyens de vous offrir une analyse de profil.",
  "Option inaccessible pour le moment.",
  "Pour que cette analyse soit efficace, il doit vous rester au moins une place dans votre escouade.",
  "Profil déjà établi.",
];

// button labels used on the IMP site

export let pImpButtonText: string[] /* STR16[] */ = [
  "Nous", // about the IMP site
  "COMMENCER", // begin profiling
  "Personnalité", // personality section
  "Caractéristiques", // personal stats/attributes section
  "Portrait", // the personal portrait selection
  "Voix %d", // the voice selection
  "OK", // done profiling
  "Recommencer", // start over profiling
  "Oui, la réponse en surbrillance me convient.",
  "Oui",
  "Non",
  "Terminé", // finished answering questions
  "Préc.", // previous question..abbreviated form
  "Suiv.", // next question
  "OUI, JE SUIS SUR.", // oui, I am certain
  "NON, JE VEUX RECOMMENCER.", // non, I want to start over the profiling process
  "OUI",
  "NON",
  "Retour", // back one page
  "Annuler", // cancel selection
  "Oui, je suis sûr.",
  "Non, je ne suis pas sûr.",
  "Registre", // the IMP site registry..when name and gender is selected
  "Analyse", // analyzing your profile results
  "OK",
  "Voix",
];

export let pExtraIMPStrings: string[] /* STR16[] */ = [
  "Pour lancer l'analyse, cliquez sur Personnalité.",
  "Cliquez maintenant sur Caractéristiques.",
  "Passons maintenant à la galerie de portraits.",
  "Pour que l'analyse soit complète, choisissez une voix.",
];

export let pFilesTitle: string[] /* STR16[] */ = [
  "Fichiers",
];

export let pFilesSenderList: string[] /* STR16[] */ = [
  "Rapport Arulco", // the recon report sent to the player. Recon is an abbreviation for reconissance
  "Intercept #1", // first intercept file .. Intercept is the title of the organization sending the file...similar in function to INTERPOL/CIA/KGB..refer to fist record in files.txt for the translated title
  "Intercept #2", // second intercept file
  "Intercept #3", // third intercept file
  "Intercept #4", // fourth intercept file
  "Intercept #5", // fifth intercept file
  "Intercept #6", // sixth intercept file
];

// Text having to do with the History Log

export let pHistoryTitle: string[] /* STR16[] */ = [
  "Historique",
];

export let pHistoryHeaders: string[] /* STR16[] */ = [
  "Jour", // the day the history event occurred
  "Page", // the current page in the history report we are in
  "Jour", // the days the history report occurs over
  "Lieu", // location (in sector) the event occurred
  "Evénement", // the event label
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
  "%s engagé(e) sur le site A.I.M.", // merc was hired from the aim site
  "%s engagé(e) sur le site M.E.R.C.", // merc was hired from the aim site
  "%s meurt.", // merc was killed
  "Versements M.E.R.C.", // paid outstanding bills at MERC
  "Ordre de mission d'Enrico Chivaldori accepté",
  // 6-10
  "Profil IMP",
  "Souscription d'un contrat d'assurance pour %s.", // insurance contract purchased
  "Annulation du contrat d'assurance de %s.", // insurance contract canceled
  "Indemnité pour %s.", // insurance claim payout for merc
  "Extension du contrat de %s (1 jour).", // Extented "mercs name"'s for a day
  // 11-15
  "Extension du contrat de %s (1 semaine).", // Extented "mercs name"'s for a week
  "Extension du contrat de %s (2 semaines).", // Extented "mercs name"'s 2 weeks
  "%s a été renvoyé(e).", // "merc's name" was dismissed.
  "%s a démissionné.", // "merc's name" quit.
  "quête commencée.", // a particular quest started
  // 16-20
  "quête achevée.",
  "Entretien avec le chef des mineurs de %s", // talked to head miner of town
  "Libération de %s",
  "Activation du mode triche",
  "Le ravitaillement devrait arriver demain à Omerta",
  // 21-25
  "%s a quitté l'escouade pour épouser Daryl Hick",
  "Expiration du contrat de %s.",
  "Recrutement de %s.",
  "Plainte d'Enrico pour manque de résultats",
  "Victoire",
  // 26-30
  "La mine de %s commence à s'épuiser",
  "La mine de %s est épuisée",
  "La mine de %s a été fermée",
  "La mine de %s a été réouverte",
  "Une prison du nom de Tixa a été découverte.",
  // 31-35
  "Rumeurs sur une usine d'armes secrètes : Orta.",
  "Les chercheurs d'Orta vous donnent des fusils à roquettes.",
  "Deidranna fait des expériences sur les cadavres.",
  "Frank parle de combats organisés à San Mona.",
  "Un témoin pense avoir aperçu quelque chose dans les mines.",
  // 36-40
  "Rencontre avec Devin - vend des explosifs.",
  "Rencontre avec Mike, le fameux ex-mercenaire de l'AIM !",
  "Rencontre avec Tony - vend des armes.",
  "Fusil à roquettes récupéré auprès du Sergent Krott.",
  "Acte de propriété du magasin d'Angel donné à Kyle.",
  // 41-45
  "Madlab propose de construire un robot.",
  "Gabby fait des décoctions rendant invisible aux créatures.",
  "Keith est hors-jeu.",
  "Howard fournit du cyanure à la Reine Deidranna.",
  "Rencontre avec Keith - vendeur à Cambria.",
  // 46-50
  "Rencontre avec Howard - pharmacien à Balime",
  "Rencontre avec Perko - réparateur en tous genres.",
  "Rencontre avec Sam de Balime - vendeur de matériel.",
  "Franz vend du matériel électronique.",
  "Arnold tient un magasin de réparations à Grumm.",
  // 51-55
  "Fredo répare le matériel électronique à Grumm.",
  "Don provenant d'un homme influent de Balime.",
  "Rencontre avec Jake, vendeur de pièces détachées.",
  "Clé électronique reçue.",
  "Corruption de Walter pour ouvrir l'accès aux sous-sols.",
  // 56-60
  "Dave refait gratuitement le plein s'il a du carburant.",
  "Pot-de-vin donné à Pablo.",
  "Kingpin cache un trésor dans la mine de San Mona.",
  "Victoire de %s dans l'Extreme Fighting",
  "Défaite de %s dans l'Extreme Fighting",
  // 61-65
  "Disqualification de %s dans l'Extreme Fighting",
  "Importante somme découverte dans la mine abandonnée.",
  "Rencontre avec un tueur engagé par Kingpin.",
  "Perte du secteur", // ENEMY_INVASION_CODE
  "Secteur défendu",
  // 66-70
  "Défaite", // ENEMY_ENCOUNTER_CODE
  "Embuscade", // ENEMY_AMBUSH_CODE
  "Embuscade ennemie déjouée",
  "Echec de l'attaque", // ENTERING_ENEMY_SECTOR_CODE
  "Réussite de l'attaque !",
  // 71-75
  "Attaque de créatures", // CREATURE_ATTACK_CODE
  "Attaque de chats sauvages", // BLOODCAT_AMBUSH_CODE
  "Elimination des chats sauvages",
  "%s a été tué(e)",
  "Tête de terroriste donnée à Carmen",
  "Reste Slay",
  "%s a été tué(e)",
];

export let pHistoryLocations: string[] /* STR16[] */ = [
  "N/A", // N/A is an acronym for Not Applicable
];

// icon text strings that appear on the laptop

export let pLaptopIcons: string[] /* STR16[] */ = [
  "E-mail",
  "Internet",
  "Finances",
  "Personnel",
  "Historique",
  "Fichiers",
  "Eteindre",
  "sir-FER 4.0", // our play on the company name (Sirtech) and web surFER
];

// bookmarks for different websites
// IMPORTANT make sure you move down the Cancel string as bookmarks are being added

export let pBookMarkStrings: string[] /* STR16[] */ = [
  "A.I.M.",
  "Bobby Ray",
  "I.M.P",
  "M.E.R.C.",
  "Morgue",
  "Fleuriste",
  "Assurance",
  "Annuler",
];

export let pBookmarkTitle: string[] /* STR16[] */ = [
  "Favoris",
  "Faites un clic droit pour accéder plus tard à ce menu.",
];

// When loading or download a web page

export let pDownloadString: string[] /* STR16[] */ = [
  "Téléchargement",
  "Chargement",
];

// This is the text used on the bank machines, here called ATMs for Automatic Teller Machine

export let gsAtmSideButtonText: string[] /* STR16[] */ = [
  "OK",
  "Prendre", // take money from merc
  "Donner", // give money to merc
  "Annuler", // cancel transaction
  "Effacer", // clear amount being displayed on the screen
];

export let gsAtmStartButtonText: string[] /* STR16[] */ = [
  "Transférer $", // transfer money to merc -- short form
  "Stats", // view stats of the merc
  "Inventaire", // view the inventory of the merc
  "Tâche",
];

export let sATMText: string[] /* STR16[] */ = [
  "Transférer les fonds ?", // transfer funds to merc?
  "Ok ?", // are we certain?
  "Entrer montant", // enter the amount you want to transfer to merc
  "Choix du type", // select the type of transfer to merc
  "Fonds insuffisants", // not enough money to transfer to merc
  "Le montant doit être un multiple de 10 $", // transfer amount must be a multiple of $10
];

// Web error messages. Please use foreign language equivilant for these messages.
// DNS is the acronym for Domain Name Server
// URL is the acronym for Uniform Resource Locator

export let pErrorStrings: string[] /* STR16[] */ = [
  "Erreur",
  "Le serveur ne trouve pas l'entrée DNS.",
  "Vérifiez l'adresse URL et essayez à nouveau.",
  "OK",
  "Connexion à l'hôte.",
];

export let pPersonnelString: string[] /* STR16[] */ = [
  "Mercs :", // mercs we have
];

export let pWebTitle: string[] /* STR16[] */ = [
  "sir-FER 4.0", // our name for the version of the browser, play on company name
];

// The titles for the web program title bar, for each page loaded

export let pWebPagesTitles: string[] /* STR16[] */ = [
  "A.I.M.",
  "Membres A.I.M.",
  "Galerie A.I.M.", // a mug shot is another name for a portrait
  "Tri A.I.M.",
  "A.I.M.",
  "Anciens A.I.M.",
  "Règlement A.I.M.",
  "Historique A.I.M.",
  "Liens A.I.M.",
  "M.E.R.C.",
  "Comptes M.E.R.C.",
  "Enregistrement M.E.R.C.",
  "Index M.E.R.C.",
  "Bobby Ray",
  "Bobby Ray - Armes",
  "Bobby Ray - Munitions",
  "Bobby Ray - Armures",
  "Bobby Ray - Divers", // misc is an abbreviation for miscellaneous
  "Bobby Ray - Occasions",
  "Bobby Ray - Commande",
  "I.M.P.",
  "I.M.P.",
  "Service des Fleuristes Associés",
  "Service des Fleuristes Associés - Exposition",
  "Service des Fleuristes Associés - Bon de commande",
  "Service des Fleuristes Associés - Cartes",
  "Malleus, Incus & Stapes Courtiers",
  "Information",
  "Contrat",
  "Commentaires",
  "Morgue McGillicutty",
  "",
  "URL introuvable.",
  "Bobby Ray - Dernières commandes",
  "",
  "",
];

export let pShowBookmarkString: string[] /* STR16[] */ = [
  "Sir-Help",
  "Cliquez à nouveau pour accéder aux Favoris.",
];

export let pLaptopTitles: string[] /* STR16[] */ = [
  "Boîte aux lettres",
  "Fichiers",
  "Personnel",
  "Bookkeeper Plus",
  "Historique",
];

export let pPersonnelDepartedStateStrings: string[] /* STR16[] */ = [
  // reasons why a merc has left.
  "Mort en mission",
  "Parti(e)",
  "Autre",
  "Mariage",
  "Contrat terminé",
  "Quitter",
];
// personnel strings appearing in the Personnel Manager on the laptop

export let pPersonelTeamStrings: string[] /* STR16[] */ = [
  "Equipe actuelle",
  "Départs",
  "Coût quotidien :",
  "Coût maximum :",
  "Coût minimum :",
  "Morts en mission :",
  "Partis :",
  "Autres :",
];

export let pPersonnelCurrentTeamStatsStrings: string[] /* STR16[] */ = [
  "Minimum",
  "Moyenne",
  "Maximum",
];

export let pPersonnelTeamStatsStrings: string[] /* STR16[] */ = [
  "SAN",
  "AGI",
  "DEX",
  "FOR",
  "COM",
  "SAG",
  "NIV",
  "TIR",
  "TECH",
  "EXPL",
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
  "Contrat",
];

// text that appears on the update panel buttons

export let pUpdatePanelButtons: string[] /* STR16[] */ = [
  "Continuer",
  "Stop",
];

// Text which appears when everyone on your team is incapacitated and incapable of battle

export let LargeTacticalStr: string[] /* UINT16[][LARGE_STRING_LENGTH] */ = [
  "Vous avez été vaincu dans ce secteur !",
  "L'ennemi, sans aucune compassion, ne fait pas de quartier !",
  "Vos mercenaires inconscients ont été capturés !",
  "Vos mercenaires ont été faits prisonniers.",
];

// Insurance Contract.c
// The text on the buttons at the bottom of the screen.

export let InsContractText: string[] /* STR16[] */ = [
  "Précédent",
  "Suivant",
  "Accepter",
  "Annuler",
];

// Insurance Info
// Text on the buttons on the bottom of the screen

export let InsInfoText: string[] /* STR16[] */ = [
  "Précédent",
  "Suivant",
];

// For use at the M.E.R.C. web site. Text relating to the player's account with MERC

export let MercAccountText: string[] /* STR16[] */ = [
  // Text on the buttons on the bottom of the screen
  "Autoriser",
  "Home",
  "Compte # :",
  "Merc",
  "Jours",
  "Taux", // 5
  "Montant",
  "Total :",
  "Désirez-vous autoriser le versement de %s ?", // the %s is a string that contains the dollar amount ( ex. "$150" )
];

// For use at the M.E.R.C. web site. Text relating a MERC mercenary

export let MercInfo: string[] /* STR16[] */ = [
  "Santé",
  "Agilité",
  "Dextérité",
  "Force",
  "Commandement",
  "Sagesse",
  "Niveau",
  "Tir",
  "Technique",
  "Explosifs",
  "Médecine",

  "Précédent",
  "Engager",
  "Suivant",
  "Infos complémentaires",
  "Home",
  "Engagé",
  "Salaire :",
  "Par jour",
  "Décédé(e)",

  "Vous ne pouvez engager plus de 18 mercenaires.",
  "Indisponible",
];

// For use at the M.E.R.C. web site. Text relating to opening an account with MERC

export let MercNoAccountText: string[] /* STR16[] */ = [
  // Text on the buttons at the bottom of the screen
  "Ouvrir compte",
  "Annuler",
  "Vous ne possédez pas de compte. Désirez-vous en ouvrir un ?",
];

// For use at the M.E.R.C. web site. MERC Homepage

export let MercHomePageText: string[] /* STR16[] */ = [
  // Description of various parts on the MERC page
  "Speck T. Kline, fondateur",
  "Cliquez ici pour ouvrir un compte",
  "Cliquez ici pour voir votre compte",
  "Cliquez ici pour consulter les fichiers",
  // The version number on the video conferencing system that pops up when Speck is talking
  "Speck Com v3.2",
];

// For use at MiGillicutty's Web Page.

export let sFuneralString: string[] /* STR16[] */ = [
  "Morgue McGillicutty : A votre écoute depuis 1983.",
  "Murray \"Pops\" McGillicutty, notre directeur bien aimé, est un ancien mercenaire de l'AIM. Sa spécialité : la mort des autres.",
  "Pops l'a côtoyée pendant si longtemps qu'il est un expert de la mort, à tous points de vue.",
  "La morgue McGillicutty vous offre un large éventail de services funéraires, depuis une écoute compréhensive jusqu'à la reconstitution des corps... dispersés.",
  "Laissez donc la morgue McGillicutty vous aider, pour que votre compagnon repose enfin en paix.",

  // Text for the various links available at the bottom of the page
  "ENVOYER FLEURS",
  "CERCUEILS & URNES",
  "CREMATION",
  "SERVICES FUNERAIRES",
  "NOTRE ETIQUETTE",

  // The text that comes up when you click on any of the links ( except for send flowers ).
  "Le concepteur de ce site s'est malheureusement absenté pour cause de décès familial. Il reviendra dès que possible pour rendre ce service encore plus efficace.",
  "Veuillez croire en nos sentiments les plus respectueux dans cette période qui doit vous être douloureuse.",
];

// Text for the florist Home page

export let sFloristText: string[] /* STR16[] */ = [
  // Text on the button on the bottom of the page

  "Vitrine",

  // Address of United Florist

  "\"Nous livrons partout dans le monde\"",
  "0-800-SENTMOI",
  "333 NoseGay Dr, Seedy City, CA USA 90210",
  "http://www.sentmoi.com",

  // detail of the florist page

  "Rapides et efficaces !",
  "Livraison en 24 heures partout dans le monde (ou presque).",
  "Les prix les plus bas (ou presque) !",
  "Si vous trouvez moins cher, nous vous livrons gratuitement une douzaine de roses !",
  "Flore, Faune & Fleurs depuis 1981.",
  "Nos bombardiers (recyclés) vous livrent votre bouquet dans un rayon de 20 km (ou presque). N'importe quand - N'importe où !",
  "Nous répondons à tous vos besoins (ou presque) !",
  "Bruce, notre expert fleuriste-conseil, trouvera pour vous les plus belles fleurs et vous composera le plus beau bouquet que vous ayez vu !",
  "Et n'oubliez pas que si nous ne l'avons pas, nous pouvons le faire pousser - et vite !",
];

// Florist OrderForm

export let sOrderFormText: string[] /* STR16[] */ = [
  // Text on the buttons

  "Retour",
  "Envoi",
  "Annuler",
  "Galerie",

  "Nom du bouquet :",
  "Prix :", // 5
  "Référence :",
  "Date de livraison",
  "jour suivant",
  "dès que possible",
  "Lieu de livraison", // 10
  "Autres services",
  "Pot Pourri (10$)",
  "Roses Noires (20$)",
  "Nature Morte (10$)",
  "Gâteau (si dispo)(10$)", // 15
  "Carte personnelle :",
  "Veuillez écrire votre message en 75 caractères maximum...",
  "...ou utiliser l'une de nos",

  "CARTES STANDARDS",
  "Informations", // 20

  // The text that goes beside the area where the user can enter their name

  "Nom :",
];

// Florist Gallery.c

export let sFloristGalleryText: string[] /* STR16[] */ = [
  // text on the buttons

  "Préc.", // abbreviation for previous
  "Suiv.", // abbreviation for next

  "Cliquez sur le bouquet que vous désirez commander.",
  "Note : les bouquets \"pot pourri\" et \"nature morte\" vous seront facturés 10$ supplémentaires.",

  // text on the button

  "Home",
];

// Florist Cards

export let sFloristCards: string[] /* STR16[] */ = [
  "Faites votre choix",
  "Retour",
];

// Text for Bobby Ray's Mail Order Site

export let BobbyROrderFormText: string[] /* STR16[] */ = [
  "Commande", // Title of the page
  "Qté", // The number of items ordered
  "Poids (%s)", // The weight of the item
  "Description", // The name of the item
  "Prix unitaire", // the item's weight
  "Total", // 5	// The total price of all of items of the same type
  "Sous-total", // The sub total of all the item totals added
  "Transport", // S&H is an acronym for Shipping and Handling
  "Total", // The grand total of all item totals + the shipping and handling
  "Lieu de livraison",
  "Type d'envoi", // 10	// See below
  "Coût (par %s.)", // The cost to ship the items
  "Du jour au lendemain", // Gets deliverd the next day
  "2 c'est mieux qu'un", // Gets delivered in 2 days
  "Jamais 2 sans 3", // Gets delivered in 3 days
  "Effacer commande", // 15			// Clears the order page
  "Confirmer commande", // Accept the order
  "Retour", // text on the button that returns to the previous page
  "Home", // Text on the button that returns to the home page
  "* Matériel d'occasion", // Disclaimer stating that the item is used
  "Vous n'avez pas les moyens.", // 20	// A popup message that to warn of not enough money
  "<AUCUNE>", // Gets displayed when there is non valid city selected
  "Etes-vous sûr de vouloir envoyer cette commande à %s ?", // A popup that asks if the city selected is the correct one
  "Poids total **", // Displays the weight of the package
  "** Pds Min.", // Disclaimer states that there is a minimum weight for the package
  "Envois",
];

// This text is used when on the various Bobby Ray Web site pages that sell items

export let BobbyRText: string[] /* STR16[] */ = [
  "Pour commander", // Title
  // instructions on how to order
  "Cliquez sur les objets désirés. Cliquez à nouveau pour sélectionner plusieurs exemplaires d'un même objet. Effectuez un clic droit pour désélectionner un objet. Il ne vous reste plus qu'à passer commande.",

  // Text on the buttons to go the various links

  "Objets précédents", //
  "Armes", // 3
  "Munitions", // 4
  "Armures", // 5
  "Divers", // 6	//misc is an abbreviation for miscellaneous
  "Occasion", // 7
  "Autres objets",
  "BON DE COMMANDE",
  "Home", // 10

  // The following 2 lines are used on the Ammunition page.
  // They are used for help text to display how many items the player's merc has
  // that can use this type of ammo

  "Votre équipe possède", // 11
  "arme(s) qui utilise(nt) ce type de munitions", // 12

  // The following lines provide information on the items

  "Poids :", // Weight of all the items of the same type
  "Cal :", // the caliber of the gun
  "Chrg :", // number of rounds of ammo the Magazine can hold
  "Por :", // The range of the gun
  "Dgt :", // Damage of the weapon
  "CDT :", // Weapon's Rate Of Fire, acronym ROF
  "Prix :", // Cost of the item
  "En réserve :", // The number of items still in the store's inventory
  "Qté commandée :", // The number of items on order
  "Endommagé", // If the item is damaged
  "Poids :", // the Weight of the item
  "Sous-total :", // The total cost of all items on order
  "* %% efficacité", // if the item is damaged, displays the percent function of the item

  // Popup that tells the player that they can only order 10 items at a time

  "Pas de chance ! Vous ne pouvez commander que 10 objets à la fois. Si vous désirez passer une commande plus importante, il vous faudra remplir un nouveau bon de commande.",

  // A popup that tells the user that they are trying to order more items then the store has in stock

  "Nous sommes navrés, mais nos stocks sont vides. N'hésitez pas à revenir plus tard !",

  // A popup that tells the user that the store is temporarily sold out

  "Nous sommes navrés, mais nous n'en avons plus en rayon.",
];

// Text for Bobby Ray's Home Page

export let BobbyRaysFrontText: string[] /* STR16[] */ = [
  // Details on the web site

  "Vous cherchez des armes et du matériel militaire ? Vous avez frappé à la bonne porte",
  "Un seul credo : force de frappe !",
  "Occasions et secondes mains",

  // Text for the various links to the sub pages

  "Divers",
  "ARMES",
  "MUNITIONS", // 5
  "ARMURES",

  // Details on the web site

  "Si nous n'en vendons pas, c'est que ça n'existe pas !",
  "En Construction",
];

// Text for the AIM page.
// This is the text used when the user selects the way to sort the aim mercanaries on the AIM mug shot page

export let AimSortText: string[] /* STR16[] */ = [
  "Membres A.I.M.", // Title
  // Title for the way to sort
  "Tri par :",

  // sort by...

  "Prix",
  "Expérience",
  "Tir",
  "Médecine",
  "Explosifs",
  "Technique",

  // Text of the links to other AIM pages

  "Afficher l'index de la galerie de portraits",
  "Consulter le fichier individuel",
  "Consulter la galerie des anciens de l'A.I.M.",

  // text to display how the entries will be sorted

  "Ascendant",
  "Descendant",
];

// Aim Policies.c
// The page in which the AIM policies and regulations are displayed

export let AimPolicyText: string[] /* STR16[] */ = [
  // The text on the buttons at the bottom of the page

  "Précédent",
  "Home AIM",
  "Index",
  "Suivant",
  "Je refuse",
  "J'accepte",
];

// Aim Member.c
// The page in which the players hires AIM mercenaries

// Instructions to the user to either start video conferencing with the merc, or to go the mug shot index

export let AimMemberText: string[] /* STR16[] */ = [
  "Cliquez pour",
  "contacter le mercenaire.",
  "Clic droit pour",
  "afficher l'index.",
];

// Aim Member.c
// The page in which the players hires AIM mercenaries

export let CharacterInfo: string[] /* STR16[] */ = [
  // The various attributes of the merc

  "Santé",
  "Agilité",
  "Dextérité",
  "Force",
  "Commandement",
  "Sagesse",
  "Niveau",
  "Tir",
  "Technique",
  "Explosifs",
  "Médecine", // 10

  // the contract expenses' area

  "Paie",
  "Contrat",
  "1 jour",
  "1 semaine",
  "2 semaines",

  // text for the buttons that either go to the previous merc,
  // start talking to the merc, or go to the next merc

  "Précédent",
  "Contacter",
  "Suivant",

  "Info. complémentaires", // Title for the additional info for the merc's bio
  "Membres actifs", // 20		// Title of the page
  "Matériel optionnel :", // Displays the optional gear cost
  "Dépôt Médical", // If the merc required a medical deposit, this is displayed
];

// Aim Member.c
// The page in which the player's hires AIM mercenaries

// The following text is used with the video conference popup

export let VideoConfercingText: string[] /* STR16[] */ = [
  "Contrat :", // Title beside the cost of hiring the merc

  // Text on the buttons to select the length of time the merc can be hired

  "1 jour",
  "1 semaine",
  "2 semaines",

  // Text on the buttons to determine if you want the merc to come with the equipment

  "Pas d'équipement",
  "Acheter équipement",

  // Text on the Buttons

  "TRANSFERT", // to actually hire the merc
  "Annuler", // go back to the previous menu
  "ENGAGER", // go to menu in which you can hire the merc
  "RACCROCHER", // stops talking with the merc
  "OK",
  "MESSAGE", // if the merc is not there, you can leave a message

  // Text on the top of the video conference popup

  "Conférence vidéo avec",
  "Connexion. . .",

  "dépôt compris" // Displays if you are hiring the merc with the medical deposit
];

// Aim Member.c
// The page in which the player hires AIM mercenaries

// The text that pops up when you select the TRANSFER FUNDS button

export let AimPopUpText: string[] /* STR16[] */ = [
  "TRANSFERT ACCEPTE", // You hired the merc
  "TRANSFERT REFUSE", // Player doesn't have enough money, message 1
  "FONDS INSUFFISANTS", // Player doesn't have enough money, message 2

  // if the merc is not available, one of the following is displayed over the merc's face

  "En mission",
  "Veuillez laisser un message",
  "Décédé",

  // If you try to hire more mercs than game can support

  "Votre équipe contient déjà 18 mercenaires.",

  "Message pré-enregistré",
  "Message enregistré",
];

// AIM Link.c

export let AimLinkText: string[] /* STR16[] */ = [
  "Liens A.I.M.", // The title of the AIM links page
];

// Aim History

// This page displays the history of AIM

export let AimHistoryText: string[] /* STR16[] */ = [
  "Historique A.I.M.", // Title

  // Text on the buttons at the bottom of the page

  "Précédent",
  "Home",
  "Anciens",
  "Suivant",
];

// Aim Mug Shot Index

// The page in which all the AIM members' portraits are displayed in the order selected by the AIM sort page.

export let AimFiText: string[] /* STR16[] */ = [
  // displays the way in which the mercs were sorted

  "Prix",
  "Expérience",
  "Tir",
  "Médecine",
  "Explosifs",
  "Technique",

  // The title of the page, the above text gets added at the end of this text

  "Tri ascendant des membres de l'A.I.M. par %s",
  "Tri descendant des membres de l'A.I.M. par %s",

  // Instructions to the players on what to do

  "Cliquez pour",
  "sélectionner le mercenaire", // 10
  "Clic droit pour",
  "les options de tri",

  // Gets displayed on top of the merc's portrait if they are...

  "Absent",
  "Décédé", // 14
  "En mission",
];

// AimArchives.
// The page that displays information about the older AIM alumni merc... mercs who are non longer with AIM

export let AimAlumniText: string[] /* STR16[] */ = [
  // Text of the buttons

  "PAGE 1",
  "PAGE 2",
  "PAGE 3",

  "Anciens", // Title of the page

  "OK" // Stops displaying information on selected merc
];

// AIM Home Page

export let AimScreenText: string[] /* STR16[] */ = [
  // AIM disclaimers

  "A.I.M. et le logo A.I.M. sont des marques déposées dans la plupart des pays.",
  "N'espérez même pas nous copier !",
  "Copyright 1998-1999 A.I.M., Ltd. Tous droits réservés.",

  // Text for an advertisement that gets displayed on the AIM page

  "Service des Fleuristes Associés",
  "\"Nous livrons partout dans le monde\"", // 10
  "Faites-le dans les règles de l'art",
  "... la première fois",
  "Si nous ne l'avons pas, c'est que vous n'en avez pas besoin.",
];

// Aim Home Page

export let AimBottomMenuText: string[] /* STR16[] */ = [
  // Text for the links at the bottom of all AIM pages
  "Home",
  "Membres",
  "Anciens",
  "Règlement",
  "Historique",
  "Liens",
];

// ShopKeeper Interface
// The shopkeeper interface is displayed when the merc wants to interact with
// the various store clerks scattered through out the game.

export let SKI_Text: string[] /* STR16[] */ = [
  "MARCHANDISE EN STOCK", // Header for the merchandise available
  "PAGE", // The current store inventory page being displayed
  "COUT TOTAL", // The total cost of the the items in the Dealer inventory area
  "VALEUR TOTALE", // The total value of items player wishes to sell
  "EVALUATION", // Button text for dealer to evaluate items the player wants to sell
  "TRANSACTION", // Button text which completes the deal. Makes the transaction.
  "OK", // Text for the button which will leave the shopkeeper interface.
  "COUT REPARATION", // The amount the dealer will charge to repair the merc's goods
  "1 HEURE", // SINGULAR! The text underneath the inventory slot when an item is given to the dealer to be repaired
  "%d HEURES", // PLURAL!   The text underneath the inventory slot when an item is given to the dealer to be repaired
  "REPARE", // Text appearing over an item that has just been repaired by a NPC repairman dealer
  "Plus d'emplacements libres.", // Message box that tells the user there is non more room to put there stuff
  "%d MINUTES", // The text underneath the inventory slot when an item is given to the dealer to be repaired
  "Objet lâché à terre.",
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
  "Prendre", // Take money from the player
  "Donner", // Give money to the player
  "Annuler", // Cancel the transfer
  "Effacer", // Clear the money display
];

// Shopkeeper Interface
export let gzSkiAtmText: string[] /* STR16[] */ = [
  // Text on the bank machine panel that....
  "Choix", // tells the user to select either to give or take from the merc
  "Montant", // Enter the amount to transfer
  "Transfert de fonds au mercenaire", // Giving money to the merc
  "Transfert de fonds du mercenaire", // Taking money from the merc
  "Fonds insuffisants", // Not enough money to transfer
  "Solde", // Display the amount of money the player currently has
];

export let SkiMessageBoxText: string[] /* STR16[] */ = [
  "Voulez-vous déduire %s de votre compte pour combler la différence ?",
  "Pas assez d'argent. Il vous manque %s",
  "Voulez-vous déduire %s de votre compte pour couvrir le coût ?",
  "Demander au vendeur de lancer la transaction",
  "Demander au vendeur de réparer les objets sélectionnés",
  "Terminer l'entretien",
  "Solde actuel",
];

// OptionScreen.c

export let zOptionsText: string[] /* STR16[] */ = [
  // button Text
  "Enregistrer",
  "Charger partie",
  "Quitter",
  "OK",

  // Text above the slider bars
  "Effets",
  "Dialogue",
  "Musique",

  // Confirmation pop when the user selects..
  "Quitter la partie et revenir au menu principal ?",

  "Activez le mode Dialogue ou Sous-titre.",
];

// SaveLoadScreen
export let zSaveLoadText: string[] /* STR16[] */ = [
  "Enregistrer",
  "Charger partie",
  "Annuler",
  "Enregistrement",
  "Chargement",

  "Enregistrement réussi",
  "ERREUR lors de la sauvegarde !",
  "Chargement réussi",
  "ERREUR lors du chargement !",

  "La version de la sauvegarde est différente de celle du jeu. Désirez-vous continuer ?",
  "Les fichiers de sauvegarde sont peut-être altérés. Voulez-vous les effacer ?",

// Translators, the next two strings are for the same thing.  The first one is for beta version releases and the second one
// is used for the final version.  Please don't modify the "#ifdef JA2BETAVERSION" or the "#else" or the "#endif" as they are
// used by the compiler and will cause program errors if modified/removed.  It's okay to translate the strings though.
  "Tentative de chargement d'une sauvegarde de version précédente. Voulez-vous effectuer une mise à jour ?",

// Translators, the next two strings are for the same thing.  The first one is for beta version releases and the second one
// is used for the final version.  Please don't modify the "#ifdef JA2BETAVERSION" or the "#else" or the "#endif" as they are
// used by the compiler and will cause program errors if modified/removed.  It's okay to translate the strings though.
  "Tentative de chargement d'une sauvegarde de version précédente. Voulez-vous effectuer une mise à jour ?",

  "Etes-vous sûr de vouloir écraser la sauvegarde #%d ?",
  "Voulez-vous charger la sauvegarde #%d ?",

  // The first %d is a number that contains the amount of free space on the users hard drive,
  // the second is the recommended amount of free space.
  "Votre risquez de manquer d'espace disque. Il ne vous reste que %d Mo de libre alors que le jeu nécessite %d Mo d'espace libre.",

  "Enregistrement...", // When saving a game, a message box with this string appears on the screen

  "Peu d'armes",
  "Beaucoup d'armes",
  "Style réaliste",
  "Style SF",

  "Difficulté",
];

// MapScreen
export let zMarksMapScreenText: string[] /* STR16[] */ = [
  "Niveau carte",
  "Vous n'avez pas de milice : vous devez entraîner les habitants de la ville.",
  "Revenu quotidien",
  "Assurance vie",
  "%s n'est pas fatigué.",
  "%s est en mouvement et ne peut dormir.",
  "%s est trop fatigué pour obéir.",
  "%s conduit.",
  "L'escouade ne peut progresser si l'un de ses membres se repose.",

  // stuff for contracts
  "Vous pouvez payer les honoraires de ce mercenaire, mais vous ne pouvez pas vous offrir son assurance.",
  "La prime d'assurance de %s coûte %s pour %d jour(s) supplémentaire(s). Voulez-vous les payer ?",
  "Inventaire du Secteur",
  "Le mercenaire a un dépôt médical.",

  // other items
  "Medics", // people acting a field medics and bandaging wounded mercs
  "Patients", // people who are being bandaged by a medic
  "OK", // Continue on with the game after autobandage is complete
  "Stop", // Stop autobandaging of patients by medics now
  "Désolé. Cette option n'est pas disponible.", // informs player this option/button has been disabled in the demo
  "%s n'a pas de trousse à outil.",
  "%s n'a pas de trousse de soins.",
  "Il y a trop peu de volontaires pour l'entraînement.",
  "%s ne peut pas former plus de miliciens.",
  "Le mercenaire a un contrat déterminé.",
  "Ce mercenaire n'est pas assuré.",
];

export let pLandMarkInSectorString: string[] /* STR16[] */ = [
  "L'escouade %d a remarqué quelque chose dans le secteur %s",
];

// confirm the player wants to pay X dollars to build a militia force in town
export let pMilitiaConfirmStrings: string[] /* STR16[] */ = [
  "L'entraînement de la milice vous coûtera $", // telling player how much it will cost
  "Etes-vous d'accord ?", // asking player if they wish to pay the amount requested
  "Vous n'en avez pas les moyens.", // telling the player they can't afford to train this town
  "Voulez-vous poursuivre l'entraînement de la milice à %s (%s %d) ?", // continue training this town?
  "Coût $", // the cost in dollars to train militia
  "(O/N)", // abbreviated oui/non
  "", // unused
  "L'entraînement des milices dans %d secteurs vous coûtera %d $. %s", // cost to train sveral sectors at once
  "Vous ne pouvez pas payer les %d $ nécessaires à l'entraînement.",
  "Vous ne pouvez poursuivre l'entraînement de la milice à %s que si cette ville est à niveau de loyauté de %d pour-cent.",
  "Vous ne pouvez plus entraîner de milice à %s.",
];

// Strings used in the popup box when withdrawing, or depositing money from the $ sign at the bottom of the single merc panel
export let gzMoneyWithdrawMessageText: string[] /* STR16[] */ = [
  "Vous ne pouvez retirer que 20 000 $ à la fois.",
  "Etes-vous sûr de vouloir déposer %s sur votre compte ?",
];

export let gzCopyrightText: string[] /* STR16[] */ = [
  "Copyright (C) 1999 Sir-tech Canada Ltd. Tous droits réservés.",
];

// option Text
export let zOptionsToggleText: string[] /* STR16[] */ = [
  "Dialogue",
  "Confirmations muettes",
  "Sous-titres",
  "Pause des dialogues",
  "Animation fumée",
  "Du sang et des tripes",
  "Ne pas toucher à ma souris !",
  "Ancienne méthode de sélection",
  "Afficher chemin",
  "Afficher tirs manqués",
  "Confirmation temps réel",
  "Afficher notifications sommeil/réveil",
  "Système métrique",
  "Mercenaire éclairé lors des mouvements",
  "Figer curseur sur les mercenaires",
  "Figer curseur sur les portes",
  "Objets en surbrillance",
  "Afficher cimes",
  "Affichage fil de fer",
  "Curseur 3D",
];

// This is the help text associated with the above toggles.
export let zOptionsScreenHelpText: string[] /* STR16[] */ = [
  // speech
  "Activez cette option pour entendre vos mercenaires lorsqu'ils parlent.",

  // Mute Confirmation
  "Active/désactive les confirmations des mercenaires.",

  // Subtitles
  "Affichage des sous-titres à l'écran.",

  // Key to advance speech
  "Si les sous-titres s'affichent à l'écran, cette option vous permet de prendre le temps de les lire.",

  // Toggle smoke animation
  "Désactivez cette option si votre machine n'est pas suffisamment puissante.",

  // Blood n Gore
  "Désactivez cette option si le jeu vous paraît trop violent.",

  // Never move my mouse
  "Activez cette option pour que le curseur ne se place pas automatiquement sur les boutons qui s'affichent.",

  // Old selection method
  "Activez cette option pour retrouver vos automatismes de la version précédente.",

  // Show movement path
  "Activez cette option pour afficher le chemin suivi par les mercenaires. Vous pouvez la désactiver et utiliser la touche MAJ en cours de jeu.",

  // show misses
  "Activez cette option pour voir où atterrissent tous vos tirs.",

  // Real Time Confirmation
  "Activez cette option pour afficher une confirmation de mouvement en temps réel.",

  // Sleep/Wake notification
  "Activez cette option pour être mis au courant de l'état de veille de vos mercenaires.",

  // Use the metric system
  "Activez cette option pour que le jeu utilise le système métrique.",

  // Merc Lighted movement
  "Activez cette option pour éclairer les environs des mercenaires. Désactivez-le si votre machine n'est pas suffisamment puissante.",

  // Smart cursor
  "Activez cette option pour que le curseur se positionne directement sur un mercenaire quand il est à proximité.",

  // snap cursor to the door
  "Activez cette option pour que le curseur se positionne directement sur une porte quand il est à proximité.",

  // glow items
  "Activez cette option pour mettre les objets en évidence",

  // toggle tree tops
  "Activez cette option pour afficher le cime des arbres.",

  // toggle wireframe
  "Activez cette option pour afficher les murs en fil de fer.",

  "Activez cette option pour afficher le curseur en 3D. ( |Home )",
];

export let gzGIOScreenText: string[] /* STR16[] */ = [
  "CONFIGURATION DU JEU",
  "Style de jeu",
  "Réaliste",
  "SF",
  "Armes",
  "Beaucoup",
  "Peu",
  "Difficulté",
  "Novice",
  "Expérimenté",
  "Expert",
  "Ok",
  "Annuler",
  "En combat",
  "Temps illimité",
  "Temps limité",
  "Désactivé pour la démo",
];

export let pDeliveryLocationStrings: string[] /* STR16[] */ = [
  "Austin", // Austin, Texas, USA
  "Bagdad", // Baghdad, Iraq (Suddam Hussein's home)
  "Drassen", // The main place in JA2 that you can receive items.  The other towns are dummy names...
  "Hong Kong", // Hong Kong, Hong Kong
  "Beyrouth", // Beirut, Lebanon	(Middle East)
  "Londres", // London, England
  "Los Angeles", // Los Angeles, California, USA (SW corner of USA)
  "Meduna", // Meduna -- the other airport in JA2 that you can receive items.
  "Metavira", // The island of Metavira was the fictional location used by JA1
  "Miami", // Miami, Florida, USA (SE corner of USA)
  "Moscou", // Moscow, USSR
  "New-York", // New York, New York, USA
  "Ottawa", // Ottawa, Ontario, Canada -- where JA2 was made!
  "Paris", // Paris, France
  "Tripoli", // Tripoli, Libya (eastern Mediterranean)
  "Tokyo", // Tokyo, Japan
  "Vancouver", // Vancouver, British Columbia, Canada (west coast near US border)
];

export let pSkillAtZeroWarning: string[] /* STR16[] */ = [
  // This string is used in the IMP character generation.  It is possible to select 0 ability
  // in a skill meaning you can't use it.  This text is confirmation to the player.
  "Etes-vous sûr de vous ? Une valeur de ZERO signifie que vous serez INCAPABLE d'utiliser cette compétence.",
];

export let pIMPBeginScreenStrings: string[] /* STR16[] */ = [
  "( 8 Caractères Max )",
];

export let pIMPFinishButtonText: string[] /* STR16[1] */ = [
  "Analyse",
];

export let pIMPFinishStrings: string[] /* STR16[] */ = [
  "Nous vous remercions, %s", //%s is the name of the merc
];

// the strings for imp voices screen
export let pIMPVoicesStrings: string[] /* STR16[] */ = [
  "Voix",
];

export let pDepartedMercPortraitStrings: string[] /* STR16[] */ = [
  "Mort",
  "Renvoyé",
  "Autre",
];

// title for program
export let pPersTitleText: string[] /* STR16[] */ = [
  "Personnel",
];

// paused game strings
export let pPausedGameText: string[] /* STR16[] */ = [
  "Pause",
  "Reprendre (|P|a|u|s|e)",
  "Pause (|P|a|u|s|e)",
];

export let pMessageStrings: string[] /* STR16[] */ = [
  "Quitter la partie ?",
  "OK",
  "OUI",
  "NON",
  "Annuler",
  "CONTRAT",
  "MENT",
  "Sans description", // Save slots that don't have a description.
  "Partie sauvegardée.",
  "Partie sauvegardée.",
  "Sauvegarde rapide", // The name of the quicksave file (filename, text reference)
  "Partie", // The name of the normal savegame file, such as SaveGame01, SaveGame02, etc.
  "sav", // The 3 character dos extension (represents sav)
  "..\\SavedGames", // The name of the directory where games are saved.
  "Jour",
  "Mercs",
  "Vide", // An empty save game slot
  "Démo", // Demo of JA2
  "Debug", // State of development of a project (JA2) that is a debug build
  "Version", // Release build for JA2
  "bpm", // Abbreviation for Rounds per minute -- the potential # of bullets fired in a minute.
  "min", // Abbreviation for minute.
  "m", // One character abbreviation for meter (metric distance measurement unit).
  "balles", // Abbreviation for rounds (# of bullets)
  "kg", // Abbreviation for kilogram (metric weight measurement unit)
  "lb", // Abbreviation for pounds (Imperial weight measurement unit)
  "Home", // Home as in homepage on the internet.
  "USD", // Abbreviation to US dollars
  "n/a", // Lowercase acronym for not applicable.
  "Entre-temps", // Meanwhile
  "%s est arrivé dans le secteur %s%s", // Name/Squad has arrived in sector A9.  Order must not change without notifying
                                         // SirTech
  "Version",
  "Emplacement de sauvegarde rapide vide",
  "Cet emplacement est réservé aux sauvegardes rapides effectuées depuis l'écran tactique (ALT+S).",
  "Ouverte",
  "Fermée",
  "Espace disque insuffisant. Il ne vous reste que %s Mo de libre et Jagged Alliance 2 nécessite %s Mo.",
  "%s embauché(e) sur le site AIM",
  "%s prend %s.", //'Merc name' has caught 'item' -- let SirTech know if name comes after item.
  "%s a pris la drogue.", //'Merc name' has taken the drug
  "%s n'a aucune compétence médicale.", //'Merc name' has non medical skill.

  // CDRom errors (such as ejecting CD while attempting to read the CD)
  "L'intégrité du jeu n'est plus assurée.",
  "ERREUR : CD-ROM manquant",

  // When firing heavier weapons in close quarters, you may not have enough room to do so.
  "Pas assez de place !",

  // Can't change stance due to objects in the way...
  "Impossible de changer de position ici.",

  // Simple text indications that appear in the game, when the merc can do one of these things.
  "Lâcher",
  "Lancer",
  "Donner",

  "%s donné à %s.", //"Item" passed to "merc".  Please try to keep the item %s before the merc %s, otherwise,
                     // must notify SirTech.
  "Impossible de donner %s à %s.", // pass "item" to "merc".  Same instructions as above.

  // A list of attachments appear after the items.  Ex:  Kevlar vest ( Ceramic Plate 'Attached )'
  " combiné )",

  // Cheat modes
  "Triche niveau 1",
  "Triche niveau 2",

  // Toggling various stealth modes
  "Escouade en mode furtif.",
  "Escouade en mode normal.",
  "%s en mode furtif.",
  "%s en mode normal.",

  // Wireframes are shown through buildings to reveal doors and windows that can't otherwise be seen in
  // an isometric engine.  You can toggle this mode freely in the game.
  "Fil de fer activé",
  "Fil de fer désactivé",

  // These are used in the cheat modes for changing levels in the game.  Going from a basement level to
  // an upper level, etc.
  "Impossible de remonter...",
  "Pas de niveau inférieur...",
  "Entrée dans le sous-sol %d...",
  "Sortie du sous-sol...",

  "'s", // used in the shop keeper inteface to mark the ownership of the item eg Red's gun
  "Mode poursuite désactivé.",
  "Mode poursuite activé.",
  "Curseur 3D désactivé.",
  "Curseur 3D activé.",
  "Escouade %d active.",
  "Vous ne pouvez pas payer le salaire de %s qui se monte à %s", // first %s is the mercs name, the seconds is a string containing the salary
  "Passer",
  "%s ne peut sortir seul.",
  "Une sauvegarde a été crée (Partie99.sav). Renommez-la (Partie01 - Partie10) pour pouvoir la charger ultérieurement.",
  "%s a bu %s",
  "Un colis vient d'arriver à Drassen.",
  "%s devrait arriver au point d'entrée (secteur %s) en jour %d vers %s.", // first %s is mercs name, next is the sector location and name where they will be arriving in, lastely is the day an the time of arrival
  "Historique mis à jour.",
];

export let ItemPickupHelpPopup: string[] /* UINT16[][40] */ = [
  "OK",
  "Défilement haut",
  "Tout sélectionner",
  "Défilement bas",
  "Annuler",
];

export let pDoctorWarningString: string[] /* STR16[] */ = [
  "%s est trop loin pour être soigné.",
  "Impossible de soigner tout le monde.",
];

export let pMilitiaButtonsHelpText: string[] /* STR16[] */ = [
  "Prendre (Clic droit)/poser (Clic gauche) Miliciens", // button help text informing player they can pick up or drop militia with this button
  "Prendre (Clic droit)/poser (Clic gauche) Soldats",
  "Prendre (Clic droit)/poser (Clic gauche) Vétérans",
  "Répartition automatique",
];

export let pMapScreenJustStartedHelpText: string[] /* STR16[] */ = [
  "Allez sur le site de l'AIM et engagez des mercenaires ( *Truc* allez voir dans le Poste de travail)", // to inform the player to hired some mercs to get things going
  "Cliquez sur le bouton de Compression du temps pour faire avancer votre équipe sur le terrain.", // to inform the player to hit time compression to get the game underway
];

export let pAntiHackerString: string[] /* STR16[] */ = [
  "Erreur. Fichier manquant ou corrompu. L'application va s'arrêter.",
];

export let gzLaptopHelpText: string[] /* STR16[] */ = [
  // Buttons:
  "Voir messages",
  "Consulter les sites Internet",
  "Consulter les documents attachés",
  "Lire le compte-rendu",
  "Afficher les infos de l'équipe",
  "Afficher les états financiers",
  "Fermer le Poste de travail",

  // Bottom task bar icons (if they exist):
  "Vous avez de nouveaux messages",
  "Vous avez reçu de nouveaux fichiers",

  // Bookmarks:
  "Association Internationale des Mercenaires",
  "Bobby Ray : Petits et Gros Calibres",
  "Institut des Mercenaires Professionnels",
  "Mouvement pour l'Entraînement et le Recrutement des Commandos",
  "Morgue McGillicutty",
  "Service des Fleuristes Associés",
  "Courtiers d'Assurance des Mercenaires de l'A.I.M.",
];

export let gzHelpScreenText: string[] /* STR16[] */ = [
  "Quitter l'écran d'aide",
];

export let gzNonPersistantPBIText: string[] /* STR16[] */ = [
  "Vous êtes en plein combat. Vous pouvez donner l'ordre de retraite depuis l'écran tactique.",
  "|Pénétrez dans le secteur pour reprendre le cours du combat.",
  "|Résolution automatique du combat.",
  "Résolution automatique impossible lorsque vous êtes l'attaquant.",
  "Résolution automatique impossible lorsque vous êtes pris en embuscade.",
  "Résolution automatique impossible lorsque vous combattez des créatures dans les mines.",
  "Résolution automatique impossible en présence de civils hostiles.",
  "Résolution automatique impossible en présence de chats sauvages.",
  "COMBAT EN COURS",
  "Retraite impossible.",
];

export let gzMiscString: string[] /* STR16[] */ = [
  "Votre milice continue le combat sans vos mercenaires...",
  "Ce véhicule n'a plus besoin de carburant pour le moment.",
  "Le réservoir est plein à %d%%.",
  "L'armée de Deidranna a repris le contrôle de %s.",
  "Vous avez perdu un site de ravitaillement.",
];

export let gzIntroScreen: string[] /* STR16[] */ = [
  "Vidéo d'introduction introuvable",
];

// These strings are combined with a merc name, a volume string (from pNoiseVolStr),
// and a direction (either "above", "below", or a string from pDirectionStr) to
// report a noise.
// e.g. "Sidney hears a loud sound of MOVEMENT coming from the SOUTH."
export let pNewNoiseStr: string[] /* STR16[] */ = [
  "%s entend un bruit de %s %s.",
  "%s entend un bruit %s de MOUVEMENT %s.",
  "%s entend un GRINCEMENT %s %s.",
  "%s entend un CLAPOTIS %s %s.",
  "%s entend un IMPACT %s %s.",
  "%s entend une EXPLOSION %s %s.",
  "%s entend un CRI %s %s.",
  "%s entend un IMPACT %s %s.",
  "%s entend un IMPACT %s %s.",
  "%s entend un BRUIT %s %s.",
  "%s entend un BRUIT %s %s.",
];

export let wMapScreenSortButtonHelpText: string[] /* STR16[] */ = [
  "Tri par nom (|F|1)",
  "Tri par affectation (|F|2)",
  "Tri par état de veille (|F|3)",
  "Tri par lieu (|F|4)",
  "Tri par destination (|F|5)",
  "Tri par date de départ (|F|6)",
];

export let BrokenLinkText: string[] /* STR16[] */ = [
  "Erreur 404",
  "Site introuvable.",
];

export let gzBobbyRShipmentText: string[] /* STR16[] */ = [
  "Derniers envois",
  "Commande #",
  "Quantité d'objets",
  "Commandé",
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
  "Programmeur", // Chris Camfield
  "Co-designer/Ecrivain", // Shaun Lyng
  "Systèmes stratégiques & Programmeur", // Kris Marnes
  "Producteur/Co-designer", // Ian Currie
  "Co-designer/Conception des cartes", // Linda Currie
  "Artiste", // Eric \"WTF\" Cheng
  "Coordination, Assistance", // Lynn Holowka
  "Artiste Extraordinaire", // Norman \"NRG\" Olsen
  "Gourou du son", // George Brooks
  "Conception écrans/Artiste", // Andrew Stacey
  "Artiste en chef/Animateur", // Scot Loving
  "Programmeur en chef", // Andrew \"Big Cheese Doddle\" Emmons
  "Programmeur", // Dave French
  "Systèmes stratégiques & Programmeur", // Alex Meduna
  "Portraits", // Joey \"Joeker\" Whelan",
];

export let gzCreditNameFunny: string[] /* STR16[] */ = [
  "", // Chris Camfield
  "(ah, la ponctuation...)", // Shaun Lyng
  "(\"C'est bon, trois fois rien\")", // Kris \"The Cow Rape Man\" Marnes
  "(j'ai passé l'âge)", // Ian Currie
  "(et en plus je bosse sur Wizardry 8)", // Linda Currie
  "(on m'a forcé !)", // Eric \"WTF\" Cheng
  "(partie en cours de route...)", // Lynn Holowka
  "", // Norman \"NRG\" Olsen
  "", // George Brooks
  "(Tête de mort et fou de jazz)", // Andrew Stacey
  "(en fait il s'appelle Robert)", // Scot Loving
  "(la seule personne un peu responsable de l'équipe)", // Andrew \"Big Cheese Doddle\" Emmons
  "(bon, je vais pouvoir réparer ma moto)", // Dave French
  "(piqué à l'équipe de Wizardry 8)", // Alex Meduna
  "(conception des objets et des écrans de chargement !)", // Joey \"Joeker\" Whelan",
];

export let sRepairsDoneString: string[] /* STR16[] */ = [
  "%s a terminé la réparation de ses objets",
  "%s a terminé la réparation des armes & armures",
  "%s a terminé la réparation des objets portés",
  "%s a terminé la réparation des objets transportés",
];

export let zGioDifConfirmText: string[] /* STR16[] */ = [
  "Vous avez choisi le mode de difficulté NOVICE. Ce mode de jeu est conseillé pour les joueurs qui découvrent Jagged Alliance, qui n'ont pas l'habitude de jouer à des jeux de stratégie ou qui souhaitent que les combats ne durent pas trop longtemps. Ce choix influe sur de nombreux paramètres du jeu. Etes-vous certain de vouloir jouer en mode Novice ?",
  "Vous avez choisi le mode de difficulté EXPERIMENTE. Ce mode de jeu est conseillé pour les joueurs qui ont déjà joué à Jagged Alliance ou des jeux de stratégie. Ce choix influe sur de nombreux paramètres du jeu. Etes-vous certain de vouloir jouer en mode Expérimenté ?",
  "Vous avez choisi le mode de difficulté EXPERT. Vous aurez été prévenu. Ne venez pas vous plaindre si vos mercenaires quittent Arulco dans un cerceuil. Ce choix influe sur de nombreux paramètres du jeu. Etes-vous certain de vouloir jouer en mode Expert ?",
];

export let gzLateLocalizedString: string[] /* STR16[] */ = [
  "Données de l'écran de chargement de %S introuvables...",

  // 1-5
  "Le robot ne peut quitter ce secteur par lui-même.",

  // This message comes up if you have pending bombs waiting to explode in tactical.
  "Compression du temps impossible. C'est bientôt le feu d'artifice !",

  //'Name' refuses to move.
  "%s refuse d'avancer.",

  //%s a merc name
  "%s n'a pas assez d'énergie pour changer de position.",

  // A message that pops up when a vehicle runs out of gas.
  "Le %s n'a plus de carburant ; le véhicule est bloqué à %c%d.",

  // 6-10

  // the following two strings are combined with the pNewNoise[] strings above to report noises
  // heard above or below the merc
  "au-dessus",
  "en-dessous",

  // The following strings are used in autoresolve for autobandaging related feedback.
  "Aucun de vos mercenaires n'a de compétence médicale.",
  "Plus de bandages !",
  "Pas assez de bandages pour soigner tout le monde.",
  "Aucun de vos mercenaires n'a besoin de soins.",
  "Soins automatiques.",
  "Tous vos mercenaires ont été soignés.",

  // 14
  "Arulco",

  "(roof)",

  "Santé : %d/%d",

  // In autoresolve if there were 5 mercs fighting 8 enemies the text would be "5 vs. 8"
  //"vs." is the abbreviation of versus.
  "%d contre %d",

  "Plus de place dans le %s !", //(ex "The ice cream truck is full")

  "%s requiert des soins bien plus importants et/ou du repos.",

  // 20
  // Happens when you get shot in the legs, and you fall down.
  "%s a été touché aux jambes ! Il ne peut plus tenir debout !",
  // Name can't speak right now.
  "%s ne peut pas parler pour le moment.",

  // 22-24 plural versions
  "%d miliciens ont été promus vétérans.",
  "%d miliciens ont été promus soldats.",
  "%d soldats ont été promus vétérans.",

  // 25
  "Echanger",

  // 26
  // Name has gone psycho -- when the game forces the player into burstmode (certain unstable characters)
  "%s est devenu fou !",

  // 27-28
  // Messages why a player can't time compress.
  "Nous vous déconseillons d'utiliser la Compression du temps ; vous avez des mercenaires dans le secteur %s.",
  "Nous vous déconseillons d'utiliser la Compression du temps lorsque vos mercenaires se trouvent dans des mines infestées de créatures.",

  // 29-31 singular versions
  "1 milicien a été promu vétéran.",
  "1 milicien a été promu soldat.",
  "1 soldat a été promu vétéran.",

  // 32-34
  "%s ne dit rien.",
  "Revenir à la surface ?",
  "(Escouade %d)",

  // 35
  // Ex: "Red has repaired Scope's MP5K".  Careful to maintain the proper order (Red before Scope, Scope before MP5K)
  "%s a réparé pour %s : %s", // inverted order !!! Red has repaired the MP5 of Scope

  // 36
  "Chat Sauvage",

  // 37-38 "Name trips and falls"
  "%s trébuche et tombe",
  "Cet objet ne peut être pris d'ici.",

  // 39
  "Il ne vous reste aucun mercenaire en état de se battre. La milice combattra les créatures seule.",

  // 40-43
  //%s is the name of merc.
  "%s n'a plus de trousse de soins !",
  "%s n'a aucune compétence médicale !",
  "%s n'a plus de trousse à outils !",
  "%s n'a aucune compétence technique !",

  // 44-45
  "Temps de réparation",
  "%s ne peut pas voir cette personne.",

  // 46-48
  "Le prolongateur de %s est tombé !",
  "Seuls %d instructeurs de milice peuvent travailler par secteur.",
  "Etes-vous sûr ?",

  // 49-50
  "Compression du temps",
  "Le réservoir est plein.",

  // 51-52 Fast help text in mapscreen.
  "Compression du temps (|E|s|p|a|c|e)",
  "Arrêt de la Compression du temps (|E|c|h|a|p)",

  // 53-54 "Magic has unjammed the Glock 18" or "Magic has unjammed Raven's H&K G11"
  "%s a désenrayé le %s",
  "%s a désenrayé le %s de %s", // inverted !!! magic has unjammed the g11 of raven

  // 55
  "Compression du temps impossible dans l'écran d'inventaire.",

  "Le CD Play de Jagged Alliance 2 est introuvable. L'application va se terminer.",

  "Objets associés.",

  // 58
  // Displayed with the version information when cheats are enabled.
  "Actuel/Maximum : %d%%/%d%%",

  // 59
  "Escorter John et Mary ?",

  "Interrupteur activé.",
];
