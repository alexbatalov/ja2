/*

******************************************************************************************************
**                                  IMPORTANT TRANSLATION NOTES                                     **
******************************************************************************************************

GENERAL TOPWARE INSTRUCTIONS
- Always be aware that German strings should be of equal or shorter length than the English equivalent.
        I know that this is difficult to do on many occasions due to the nature of the German language when
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
        symbols.  SirTech will search for !!! to look for Topware problems and questions.  This is a more
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
  ",38 кал",
  "9мм",
  ",45 кал",
  ",357 кал",
  "12 кал",
  "ОББ",
  "5,45мм",
  "5,56мм",
  "7,62мм НАТО",
  "7,62мм ВД",
  "4,7мм",
  "5,7мм",
  "Монстр",
  "Ракета",
  "", // дротик
  "", // пламя
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
  ",38 кал",
  "9мм",
  ",45 кал",
  ",357 кал",
  "12 кал",
  "ОББ",
  "5,45мм",
  "5,56мм",
  "7,62мм Н.",
  "7,62мм ВД",
  "4,7мм",
  "5.7мм",
  "Монстр",
  "Ракета",
  "", // дротик
];

export let WeaponType: string[] /* UINT16[][30] */ = [
  "Другое",
  "Пистолет",
  "Автопистолет",
  "Полуавтомат",
  "Винтовка",
  "Снайп.винтовка",
  "Базука",
  "Легкий автомат",
  "Револьвер",
];

export let TeamTurnString: string[] /* UINT16[][STRING_LENGTH] */ = [
  "Ход Игрока", // player's turn
  "Ход Оппонента",
  "Ход Существа",
  "Ход Ополчения",
  "Ход Жителей",
  // planning turn
];

export let Message: string[] /* UINT16[][STRING_LENGTH] */ = [
  "",

  // In the following 8 strings, the %s is the merc's name, and the %d (if any) is a number.

  "%s:попадание в голову. Теряет в мудрости!",
  "%s получает рану плеча и теряет в ловкости!",
  "%s получает рану в грудь и теряет в силе!",
  "%s получает рану ног и теряет в проворности!",
  "%s получает рану головы и теряет %d очков мудрости!",
  "%s получает рану в плечо теряет %d очков ловкости!",
  "%s получает рану в грудь и теряет %d очков силы!",
  "%s получает рану ног и теряет %d очков проворности!",
  "Перерыв!",

  // The first %s is a merc's name, the second is a string from pNoiseVolStr,
  // the third is a string from pNoiseTypeStr, and the last is a string from pDirectionStr

  "", // OBSOLETE
  "Подкрепление прибыло!",

  // In the following four lines, all %s's are merc names

  "%s заряжает",
  "%s недостаточно очков действия!",
  "%s оказывает перв.помощь.(люб.клавиша-отмена)",
  "%s и %s оказывают перв.помощь. (люб.клавиша-отмена.)",
  // the following 17 strings are used to create lists of gun advantages and disadvantages
  // (separated by commas)
  "надежен",
  "ненадежен",
  "легко починить",
  "трудно почин.",
  "сильн.поврежд.",
  "слаб.поврежд.",
  "быстр.огонь",
  "медл.огонь",
  "дальний бой",
  "ближний бой",
  "легкий",
  "тяжелый",
  "малый",
  "очередями",
  "не очередями",
  "бол.обойма",
  "мал.обойма",

  // In the following two lines, all %s's are merc names

  "%s:камуфляж изношен",
  "%s:окраска камуфляжа смыта",

  // The first %s is a merc name and the second %s is an item name

  "Втор.оружие:нет патронов!",
  "%s крадет %s.",

  // The %s is a merc name

  "%s:оружие не стрел.очеред.",

  "вы повторяетесь!",
  "Объединить?",

  // Both %s's are item names

  "Нельзя соединить %s и %s.",

  "Ничего",
  "Разрядить",
  "Приложения",

  // You cannot use "item(s)" and your "other item" at the same time.
  // Ex:  You cannot use sun goggles and you gas mask at the same time.
  "Нельзя использовать %s и %s одновр.",

  "Вещь,на к-рую указывает курсор,можно присоединить к другим вещам,поместив ее в одну из связных ячеек.",
  "Вещь,на к-рую указывает курсор,можно присоединить к другим вещам,поместив ее в одну из связных ячеек.(Однако эти вещи несовместимы.)",
  "В этом секторе еще остались враги!",
  "Тебе нужно дать %s %s",
  "%s:попадание в голову!",
  "Покинуть битву?",
  "Эта вещь останется у тебя.Оставить ее?",
  "%s чувствует прилив энергии!",
  "%s скользит по мрамору!",
  "%s не получает %s!",
  "%s чинит %s",
  "Прервать для ",
  "Сдаться?",
  "Человек отверг твою помощь",
  "Я так НЕ ДУМАЮ!",
  "Чтобы воспользоваться вертолетеом Всадника, выберите ПРИНАДЛЕЖНОСТЬ и МАШИНА.",
  "%s успевает зарядить только один пистолет",
  "ход Кошки-Убийцы",
];

// the names of the towns in the game

export let pTownNames: string[] /* STR16[] */ = [
  "",
  "Омерта",
  "Драссен",
  "Альма",
  "Грам",
  "Тикса",
  "Камбрия",
  "Сан Мона",
  "Эстони",
  "Орта",
  "Балайм",
  "Медуна",
  "Читзена",
];

// the types of time compression. For example: is the timer paused? at normal speed, 5 minutes per second, etc.
// min is an abbreviation for minutes

export let sTimeStrings: string[] /* STR16[] */ = [
  "Пауза",
  "Норма",
  "5 мин",
  "30 мин",
  "60 мин",
  "6 час",
];

// Assignment Strings: what assignment does the merc  have right now? For example, are they on a squad, training,
// administering medical aid (doctor) or training a town. All are abbreviated. 8 letters is the longest it can be.

export let pAssignmentStrings: string[] /* STR16[] */ = [
  "Отряд1",
  "Отряд2",
  "Отряд3",
  "Отряд4",
  "Отряд5",
  "Отряд6",
  "Отряд7",
  "Отряд8",
  "Отряд9",
  "Отряд10",
  "Отряд11",
  "Отряд12",
  "Отряд13",
  "Отряд14",
  "Отряд15",
  "Отряд16",
  "Отряд17",
  "Отряд18",
  "Отряд19",
  "Отряд20",
  "На службе", // on active duty
  "Доктор", // оказывает медпомощь
  "Пациент", //принимает медпомощь
  "Машина", // in a vehicle
  "В пути", //транзитом - сокращение
  "Ремонт", // ремонтируются
  "Практика", // тренируются
  "Ополчение", //готовят восстание среди горожан
  "Тренер", // training a teammate
  "Студент", // being trained by someone else
  "Мертв", // мертв
  "Беспом.", // abbreviation for incapacitated
  "ВП", // Prisoner of war - captured
  "Госпиталь", // patient in a hospital
  "Пусто", // Vehicle is empty
];

export let pMilitiaString: string[] /* STR16[] */ = [
  "Ополчение", // the title of the militia box
  "Не определен", // the number of unassigned militia troops
  "Ты не можешь перераспределять ополчение, когда кругом враги!",
];

export let pMilitiaButtonString: string[] /* STR16[] */ = [
  "Авто", // auto place the militia troops for the player
  "Готово", // done placing militia troops
];

export let pConditionStrings: string[] /* STR16[] */ = [
  "Отлично", //состояние солдата..отличное здоровье
  "Хорошо", //хорошее здоровье
  "Прилично", //нормальное здоровье
  "Ранен", //раны
  "Устал", // усталый
  "Кровоточит", // истекает кровью
  "Без сознания", // в обмороке
  "Умирает", //умирает
  "Мертв", // мертв
];

export let pEpcMenuStrings: string[] /* STR16[] */ = [
  "На службе", // set merc on active duty
  "Пациент", // set as a patient to receive medical aid
  "Машина", // tell merc to enter vehicle
  "Без эскорта", // охрана покидает героя
  "Отмена", // выход из этого меню
];

// look at pAssignmentString above for comments

export let pPersonnelAssignmentStrings: string[] /* STR16[] */ = [
  "Отряд1",
  "Отряд2",
  "Отряд3",
  "Отряд4",
  "Отряд5",
  "Отряд6",
  "Отряд7",
  "Отряд8",
  "Отряд9",
  "Отряд10",
  "Отряд11",
  "Отряд12",
  "Отряд13",
  "Отряд14",
  "Отряд15",
  "Отряд16",
  "Отряд17",
  "Отряд18",
  "Отряд19",
  "Отряд20",
  "На службе",
  "Доктор",
  "Пациент",
  "Машина",
  "В пути",
  "Ремонт",
  "Практика",
  "Тренировка ополч",
  "Тренер",
  "Ученик",
  "Мертв",
  "Беспом.",
  "ВП",
  "Госпиталь",
  "Пусто", // Vehicle is empty
];

// refer to above for comments

export let pLongAssignmentStrings: string[] /* STR16[] */ = [
  "Отряд1",
  "Отряд2",
  "Отряд3",
  "Отряд4",
  "Отряд5",
  "Отряд6",
  "Отряд7",
  "Отряд8",
  "Отряд9",
  "Отряд10",
  "Отряд11",
  "Отряд12",
  "Отряд13",
  "Отряд14",
  "Отряд15",
  "Отряд16",
  "Отряд17",
  "Отряд18",
  "Отряд19",
  "Отряд20",
  "На службе",
  "Доктор",
  "пациент",
  "Машина",
  "В пути",
  "Ремонт",
  "Практика",
  "Тренинг ополч",
  "Тренинг команды",
  "Ученик",
  "Мертв",
  "Беспом.",
  "ВП",
  "Госпиталь", // patient in a hospital
  "Пусто", // Vehicle is empty
];

// the contract options

export let pContractStrings: string[] /* STR16[] */ = [
  "Пункты контракта:",
  "", // a blank line, required
  "Предл.1 день", // offer merc a one day contract extension
  "Предложить 7дн", // 1 week
  "Предложить 14дн", // 2 week
  "Уволить", // end merc's contract
  "Отмена", // stop showing this menu
];

export let pPOWStrings: string[] /* STR16[] */ = [
  "ВП", // an acronym for Prisoner of War
  "??",
];

export let pLongAttributeStrings: string[] /* STR16[] */ = [
  "СИЛА",
  "ЛОВКОСТЬ",
  "ПОДВИЖНОСТЬ",
  "МУДРОСТЬ",
  "МЕТКОСТЬ",
  "МЕДИЦИНА",
  "МЕХАНИКА",
  "ЛИДЕРСТВО",
  "ВЗРЫВНИК",
  "УРОВЕНЬ",
];

export let pInvPanelTitleStrings: string[] /* STR16[] */ = [
  "Броня", // the armor rating of the merc
  "Вес", // the weight the merc is carrying
  "Камуфляж", // the merc's camouflage rating
];

export let pShortAttributeStrings: string[] /* STR16[] */ = [
  "Пдв", // the abbreviated version of : agility
  "Лов", // dexterity
  "Сил", // strength
  "Лид", // leadership
  "Мдр", // wisdom
  "Урв", // experience level
  "Мтк", // marksmanship skill
  "Взр", // explosive skill
  "Мех", // mechanical skill
  "Мед", // medical skill};
];

export let pUpperLeftMapScreenStrings: string[] /* STR16[] */ = [
  "Принадлежность", // the mercs current assignment
  "Контракт", // the contract info about the merc
  "Здоровье", // the health level of the current merc
  "Дух", // the morale of the current merc
  "Сост.", // the condition of the current vehicle
  "Горючее", // the fuel level of the current vehicle
];

export let pTrainingStrings: string[] /* STR16[] */ = [
  "Практика", // tell merc to train self
  "Ополчение", // tell merc to train town
  "Тренер", // tell merc to act as trainer
  "Ученик", // tell merc to be train by other
];

export let pGuardMenuStrings: string[] /* STR16[] */ = [
  "Возм.стрелять:", // the allowable rate of fire for a merc who is guarding
  " Агрессивный огонь", // the merc can be aggressive in their choice of fire rates
  " Беречь патроны", // conserve ammo
  " Пока не стрелять", // fire only when the merc needs to
  "Другие опции:", // other options available to merc
  " Отступить", // merc can retreat
  " Искать укрытие", // merc is allowed to seek cover
  " Можно помочь команде", // merc can assist teammates
  "Готово", // done with this menu
  "Отмена", // cancel this menu
];

// This string has the same comments as above, however the * denotes the option has been selected by the player

export let pOtherGuardMenuStrings: string[] /* STR16[] */ = [
  "Тип Огня:",
  " *Агрессивный огонь*",
  " *Беречь патроны*",
  " *Воздерж.от стрельбы*",
  "Другие опции:",
  " *Отступить*",
  " *Искать укрытие*",
  " *Помочь команде*",
  "Готово",
  "Отмена",
];

export let pAssignMenuStrings: string[] /* STR16[] */ = [
  "На службе", // merc is on active duty
  "Доктор", // the merc is acting as a doctor
  "Пациент", // the merc is receiving medical attention
  "Машина", // the merc is in a vehicle
  "Ремонт", // the merc is repairing items
  "Тренинг", // the merc is training
  "Отмена", // cancel this menu
];

export let pRemoveMercStrings: string[] /* STR16[] */ = [
  "Убрать мертвеца", // remove dead merc from current team
  "Отмена",
];

export let pAttributeMenuStrings: string[] /* STR16[] */ = [
  "Сила",
  "Ловкость",
  "Подвижность",
  "Здоровье",
  "Меткость",
  "Медицина",
  "Механика",
  "Лидерство",
  "Взрывник",
  "Отмена",
];

export let pTrainingMenuStrings: string[] /* STR16[] */ = [
  "Практика", // train yourself
  "Ополч.", // train the town
  "Тренер", // train your teammates
  "Ученик", // be trained by an instructor
  "Отмена", // cancel this menu
];

export let pSquadMenuStrings: string[] /* STR16[] */ = [
  "Отряд  1",
  "Отряд  2",
  "Отряд  3",
  "Отряд  4",
  "Отряд  5",
  "Отряд  6",
  "Отряд  7",
  "Отряд  8",
  "Отряд  9",
  "Отряд 10",
  "Отряд 11",
  "Отряд 12",
  "Отряд 13",
  "Отряд 14",
  "Отряд 15",
  "Отряд 16",
  "Отряд 17",
  "Отряд 18",
  "Отряд 19",
  "Отряд 20",
  "Отмена",
];

export let pPersonnelTitle: string[] /* STR16[] */ = [
  "Персонал", // the title for the personnel screen/program application
];

export let pPersonnelScreenStrings: string[] /* STR16[] */ = [
  "Здоровье: ", // health of merc
  "Подвижность: ",
  "Ловкость: ",
  "Сила: ",
  "Лидерство: ",
  "Мудрость: ",
  "Опытность: ", // experience level
  "Меткость: ",
  "Механика: ",
  "Взрывник.: ",
  "Медицина: ",
  "Мед.депозит: ", // amount of medical deposit put down on the merc
  "Контракт: ", // cost of current contract
  "Убийства: ", // number of kills by merc
  "Помощники: ", // number of assists on kills by merc
  "Цена в день:", // daily cost of merc
  "Общая стоимость:", // total cost of merc
  "Контракт:", // cost of current contract
  "Все услуги:", // total service rendered by merc
  "Долги по з/п:", // amount left on MERC merc to be paid
  "Проц.попаданий:", // percentage of shots that hit target
  "Битвы:", // number of battles fought
  "Кол-во ран:", // number of times merc has been wounded
  "Навыки:",
  "Нет навыков",
];

// These string correspond to enums used in by the SkillTrait enums in SoldierProfileType.h
export let gzMercSkillText: string[] /* STR16[] */ = [
  "Нет навыков",
  "Раб.с отмычкой",
  "Плечом к плечу",
  "Электроника",
  "Ночные опер.",
  "Броски",
  "Обучение",
  "Тяж.оружие",
  "Автом.оружие",
  "Скрытный",
  "Оч.проворный",
  "Вор",
  "Военное иск-во",
  "Метание ножа",
  "Стрельба с крыши",
  "Маскировка",
  "(Эксперт)",
];

// This is pop up help text for the options that are available to the merc

export let pTacticalPopupButtonStrings: string[] /* STR16[] */ = [
  "Стоять/Идти (|S)",
  "Cогнуться/Красться (|C)",
  "Стоять/Бежать (|R)",
  "Лечь/Ползти (|P)",
  "Смотреть (|L)",
  "Действие",
  "Разговор",
  "Проверить (|C|t|r|l)",

  // Pop up door menu
  "Открыть вручную",
  "Поиск ловушек",
  "Поиск ловушек",
  "Разрядить ловушки",
  "Силой",
  "Минировать",
  "Открыть",
  "Отмычкой",
  "Исп.взрывчатку",
  "Ломом",
  "Отмена(|E|s|c)",
];

// Door Traps. When we examine a door, it could have a particular trap on it. These are the traps.

export let pDoorTrapStrings: string[] /* STR16[] */ = [
  "Ловушек нет",
  "Бомба-Ловушка",
  "Электроловушка",
  "Ловушка-Сирена",
  "Тихая сигнализация",
];

// Contract Extension. These are used for the contract extension with AIM mercenaries.

export let pContractExtendStrings: string[] /* STR16[] */ = [
  "день",
  "7дн.",
  "14дн.",
];

// On the map screen, there are four columns. This text is popup help text that identifies the individual columns.

export let pMapScreenMouseRegionHelpText: string[] /* STR16[] */ = [
  "Выбрать наемника",
  "Назначить наемника",
  "Направить",
  "Наемн |Контракт (|C)",
  "Убрать наемн",
  "Спать",
];

// volumes of noises

export let pNoiseVolStr: string[] /* STR16[] */ = [
  "ТИХИЙ",
  "ЧЕТКИЙ",
  "ГРОМКИЙ",
  "ОЧ.ГРОМКИЙ",
];

// types of noises

// OBSOLETE
export let pNoiseTypeStr: string[] /* STR16[] */ = [
  "НЕЗНАКОМЫЙ",
  "звук ДВИЖЕНИЯ",
  "СКРИП",
  "ПЛЕСК",
  "УДАР",
  "ВЫСТРЕЛ",
  "ВЗРЫВ",
  "КРИК",
  "УДАР",
  "УДАР",
  "ЗВОН",
  "ГРОХОТ",
];

// Directions that are used to report noises

export let pDirectionStr: string[] /* STR16[] */ = [
  "СЕВ-ВОСТОК",
  "ВОСТОК",
  "ЮГО-ВОСТОК",
  "ЮГ",
  "ЮГО-ЗАПАД",
  "ЗАПАД",
  "СЕВ-ЗАПАД",
  "СЕВЕР",
];

// These are the different terrain types.

export let pLandTypeStrings: string[] /* STR16[] */ = [
  "Город",
  "Дорога",
  "Равнина",
  "Пустыня",
  "Леса",
  "Роща",
  "Болото",
  "Вода",
  "Холмы",
  "Непроходимо",
  "Река", // river from north to south
  "Река", // river from east to west
  "Чужая страна",
  // NONE of the following are used for directional travel, just for the sector description.
  "Тропики",
  "Фермы",
  "Поля, дорога",
  "Леса, дорога",
  "Фермы, дорога",
  "Тропики,дорога",
  "Роща, дорога",
  "Берег",
  "Гора, дорога",
  "Побережье,дорога",
  "Пустыня, дорога",
  "Болото, дорога",
  "Леса,ПВО",
  "Пустыня,ПВО",
  "Тропики,ПВО",
  "Медуна,ПВО",

  // These are descriptions for special sectors
  "Госпит.Камбрии",
  "Аэроп.Драссена",
  "Аэроп.Медуны",
  "ПВО",
  "База повстанц.", // The rebel base underground in sector A10
  "Подзем.Тиксы", // The basement of the Tixa Prison (J9)
  "Логово существ", // Any mine sector with creatures in it
  "Подвалы Орты", // The basement of Orta (K4)
  "Туннель", // The tunnel access from the maze garden in Meduna
              // leading to the secret shelter underneath the palace
  "Убежище", // The shelter underneath the queen's palace
  "", // Unused
];

export let gpStrategicString: string[] /* STR16[] */ = [
  "", // Unused
  "%s обнаружен в секторе %c%d и вот-вот прибудет еще один отряд.", // STR_DETECTED_SINGULAR
  "%s обнаружен в секторе %c%d и вот-вот прибудут еще отряды.", // STR_DETECTED_PLURAL
  "Вы хотите координировать одновременное прибытие?", // STR_COORDINATE

  // Dialog strings for enemies.

  "Враг дает шанс сдаться.", // STR_ENEMY_SURRENDER_OFFER
  "Враг захватил вашего наемника, который пребывает без сознания.", // STR_ENEMY_CAPTURED

  // The text that goes on the autoresolve buttons

  "Отступл.", // The retreat button				//STR_AR_RETREAT_BUTTON
  "Готово", // The done button				//STR_AR_DONE_BUTTON

  // The headers are for the autoresolve type (MUST BE UPPERCASE)

  "ЗАЩИТА", // STR_AR_DEFEND_HEADER
  "АТАКА", // STR_AR_ATTACK_HEADER
  "СТЫЧКА", // STR_AR_ENCOUNTER_HEADER
  "Сектор", // The Sector A9 part of the header		//STR_AR_SECTOR_HEADER

  // The battle ending conditions

  "ПОБЕДА!", // STR_AR_OVER_VICTORY
  "ЗАЩИТА!", // STR_AR_OVER_DEFEAT
  "СДАЛСЯ!", // STR_AR_OVER_SURRENDERED
  "ЗАХВАЧЕН!", // STR_AR_OVER_CAPTURED
  "ОТСТУПИЛ!", // STR_AR_OVER_RETREATED

  // These are the labels for the different types of enemies we fight in autoresolve.

  "Ополчен", // STR_AR_MILITIA_NAME,
  "Элита", // STR_AR_ELITE_NAME,
  "Войско", // STR_AR_TROOP_NAME,
  "Админ", // STR_AR_ADMINISTRATOR_NAME,
  "Существо", // STR_AR_CREATURE_NAME,

  // Label for the length of time the battle took

  "Время истекло", // STR_AR_TIME_ELAPSED,

  // Labels for status of merc if retreating.  (UPPERCASE)

  "ОТСТУПИЛ", // STR_AR_MERC_RETREATED,
  "ОТСТУПАЕТ", // STR_AR_MERC_RETREATING,
  "ОТСТУПЛЕНИЕ", // STR_AR_MERC_RETREAT,

  // PRE BATTLE INTERFACE STRINGS
  // Goes on the three buttons in the prebattle interface.  The Auto resolve button represents
  // a system that automatically resolves the combat for the player without having to do anything.
  // These strings must be short (two lines -- 6-8 chars per line)

  "Авто битва", // STR_PB_AUTORESOLVE_BTN,
  "Идти в Сектор", // STR_PB_GOTOSECTOR_BTN,
  "Отступить", // STR_PB_RETREATMERCS_BTN,

  // The different headers(titles) for the prebattle interface.
  "СТЫЧКА", // STR_PB_ENEMYENCOUNTER_HEADER,
  "ВРАЖЕСК. ЗАХВАТ", // STR_PB_ENEMYINVASION_HEADER, // 30
  "ВРАЖ. ЗАСАДА", // STR_PB_ENEMYAMBUSH_HEADER
  "ВСТУПИТЬ ВО ВРАЖ. СЕКТОР", // STR_PB_ENTERINGENEMYSECTOR_HEADER
  "АТАКА СУЩЕСТВ", // STR_PB_CREATUREATTACK_HEADER
  "ЗАСАДА КОШКИ", // STR_PB_BLOODCATAMBUSH_HEADER
  "ИДТИ В ЛОГОВО КОШКИ-УБИЙЦЫ", // STR_PB_ENTERINGBLOODCATLAIR_HEADER

  // Various single words for direct translation.  The Civilians represent the civilian
  // militia occupying the sector being attacked.  Limited to 9-10 chars

  "Место",
  "Враги",
  "Наемники",
  "Ополчение",
  "Существа",
  "Кошки-уб",
  "Сектор",
  "Никого", // If there are no uninvolved mercs in this fight.
  "Н/П", // Acronym of Not Applicable
  "д", // One letter abbreviation of day
  "ч", // One letter abbreviation of hour

  // TACTICAL PLACEMENT USER INTERFACE STRINGS
  // The four buttons

  "Очистить",
  "Вручную",
  "Группа",
  "Готово",

  // The help text for the four buttons.  Use \n to denote new line (just like enter).

  "Убрать позиции наемников \nдля повторного их ввода ( |C).",
  "Рассредоточить наемников вручную (|S).",
  "Выбрать место сбора наемников (|G).",
  "Нажмите эту кнопку, когда закончите \nвыбор позиций для наемников. (|E|n|t|e|r)",
  "Вы должны разместить всех наемн. \nперед началом битвы.",

  // Various strings (translate word for word)

  "Сектор",
  "Выбрать место входа",

  // Strings used for various popup message boxes.  Can be as long as desired.

  "Выглядит непривлекательно. Место недоступно. Выберите другое место.",
  "Поместите своих наемников в выделенное место на карте.",

  // This message is for mercs arriving in sectors.  Ex:  Red has arrived in sector A9.
  // Don't uppercase first character, or add spaces on either end.

  "прибыл в сектор",

  // These entries are for button popup help text for the prebattle interface.  All popup help
  // text supports the use of \n to denote new line.  Do not use spaces before or after the \n.
  "Битва разрешается автоматически\nбез загрузки карты(|A)",
  "Нельзя исп.авторазрешение когда\nигрок атакует.",
  "Войти в сектор:стычка с врагом (|E).",
  "Группа отступает в прежний сектор (|R).", // singular version
  "Все группы отступают в прежние сектора (|R)", // multiple groups with same previous sector
  //!!!What about repeated "R" as hotkey?
  // various popup messages for battle conditions.

  //%c%d is the sector -- ex:  A9
  "Враги атакуют ваше ополчение в секторе %c%d.",
  //%c%d сектор -- напр:  A9
  "Существа атакуют ваше ополч.в секторе %c%d.",
  // 1st %d refers to the number of civilians eaten by monsters,  %c%d is the sector -- ex:  A9
  // Note:  the minimum number of civilians eaten will be two.
  "Существа атакуют и убивают %d жителей в секторе %s.",
  //%s is the sector location -- ex:  A9: Omerta
  "Враги атакуют ваших наемн.в секторе %s. Никто из наемников не может драться!",
  //%s is the sector location -- ex:  A9: Omerta
  "Существа атакуют ваших наемн.в секторе%s. Никто из наемников не может драться!",
];

export let gpGameClockString: string[] /* STR16[] */ = [
  // This is the day represented in the game clock.  Must be very short, 4 characters max.
  "День",
];

// When the merc finds a key, they can get a description of it which
// tells them where and when they found it.
export let sKeyDescriptionStrings: string[] /* STR16[2] */ = [
  "Сект.находки:",
  "День находки:",
];

// The headers used to describe various weapon statistics.

export let gWeaponStatsDesc: string[] /* INT16[][14] */ = [
  "Вес (%s):",
  "Статус:",
  "Пули:", // Number of bullets left in a magazine
  "Дист:", // Range
  "Урон:", // Damage
  "ОД:", // abbreviation for Action Points
  "",
  "=",
  "=",
];

// The headers used for the merc's money.

export let gMoneyStatsDesc: string[] /* INT16[][13] */ = [
  "Кол-во",
  "Осталось:", // this is the overall balance
  "Кол-во",
  "Отделить:", // the amount he wants to separate from the overall balance to get two piles of money

  "Текущий",
  "Баланс",
  "Кол-во",
  "Взять",
];

// The health of various creatures, enemies, characters in the game. The numbers following each are for comment
// only, but represent the precentage of points remaining.

export let zHealthStr: string[] /* UINT16[][13] */ = [
  "УМИРАЕТ", //	>= 0
  "КРИТИЧЕН", //	>= 15
  "ПЛОХ", //	>= 30
  "РАНЕН", //	>= 45
  "ЗДОРОВ", //	>= 60
  "СИЛЕН", // 	>= 75
  "ОТЛИЧНО", // 	>= 90
];

export let gzMoneyAmounts: string[] /* STR16[6] */ = [
  "1000$",
  "100$",
  "10$",
  "Готово",
  "Отделить",
  "Взять",
];

// short words meaning "Advantages" for "Pros" and "Disadvantages" for "Cons."
export let gzProsLabel: string /* INT16[10] */ = "За:";

export let gzConsLabel: string /* INT16[10] */ = "Прот:";

// Conversation options a player has when encountering an NPC
export let zTalkMenuStrings: string[] /* UINT16[6][SMALL_STRING_LENGTH] */ = [
  "Еще раз?", // meaning "Repeat yourself"
  "Дружески", // approach in a friendly
  "Прямо", // approach directly - let's get down to business
  "Угрожать", // approach threateningly - talk now, or I'll blow your face off
  "Дать",
  "Нанять",
];

// Some NPCs buy, sell or repair items. These different options are available for those NPCs as well.
export let zDealerStrings: string[] /* UINT16[4][SMALL_STRING_LENGTH] */ = [
  "Куп/Прод",
  "Куп.",
  "Прод.",
  "Ремонт",
];

export let zDialogActions: string[] /* UINT16[1][SMALL_STRING_LENGTH] */ = [
  "Готово",
];

// These are vehicles in the game.

export let pVehicleStrings: string[] /* STR16[] */ = [
  "Эльдорадо",
  "Хаммер", // a hummer jeep/truck -- military vehicle
  "Трак с морож",
  "Джип",
  "Танк",
  "Вертолет",
];

export let pShortVehicleStrings: string[] /* STR16[] */ = [
  "Эльдор",
  "Хаммер", // the HMVV
  "Трак",
  "Джип",
  "Танк",
  "Верт", // the helicopter
];

export let zVehicleName: string[] /* STR16[] */ = [
  "Эльдорадо",
  "Хаммер", // a military jeep. This is a brand name.
  "Трак", // Ice cream truck
  "Джип",
  "Танк",
  "Верт", // an abbreviation for Helicopter
];

// These are messages Used in the Tactical Screen

export let TacticalStr: string[] /* UINT16[][MED_STRING_LENGTH] */ = [
  "Воздушный Рейд",
  "Оказывать перв.помощь сразу?",

  // CAMFIELD NUKE THIS and add quote #66.

  "%s замечает, что некоторые предметы не погрузили.",

  // The %s is a string from pDoorTrapStrings

  "Замок (%s).",
  "Тут нет замка.",
  "Успех!",
  "Провал.",
  "Успех!",
  "Провал",
  "Замок без ловушки",
  "Успех!",
  // The %s is a merc name
  "%s:нет нужного ключа",
  "Замок без ловушки",
  "Замок без ловушки",
  "Заперто",
  "ДВЕРЬ",
  "ЛОВУШКА",
  "ЗАПЕРТО",
  "НЕЗАПЕРТО",
  "РАЗГРОМЛЕНО",
  "Тут есть выключатель.Нажать?",
  "Разрядить ловушку?",
  "Пред...",
  "След...",
  "Еще...",

  // In the next 2 strings, %s is an item name

  "%s помещен(а) на землю.",
  "%s отдан(а) %s.",

  // In the next 2 strings, %s is a name

  "%s.Оплачено сполна.",
  "%s.Еще должен %d.",
  "Выбрать частоту детонатора:", // in this case, frequency refers to a radio signal
  "Кол-во ходов перед взрывом:", // how much time, in turns, until the bomb blows
  "Устан.частоту дистанц.взрывателя:", // in this case, frequency refers to a radio signal
  "Разрядить ловушку?",
  "Убрать голубой флаг?",
  "Установить голубой флаг?",
  "Завершающий ход",

  // In the next string, %s is a name. Stance refers to way they are standing.

  "Уверен,что хочешь напасть на %s ?",
  "Машина не может менять положения.",
  "Робот не может менять положения.",

  // In the next 3 strings, %s is a name

  "%s не может поменять положение здесь.",
  "%s не может получить перв.помощь.",
  "%s не нуждается в перв.помощи.",
  "Туда идти нельзя.",
  "Команда набрана.Мест нет.", // there's no room for a recruit on the player's team

  // In the next string, %s is a name

  "%s нанят.",

  // Here %s is a name and %d is a number

  "%s должен получить $%d.",

  // In the next string, %s is a name

  "Сопров. %s?",

  // In the next string, the first %s is a name and the second %s is an amount of money (including $ sign)

  "Нанять %s за %s в день?",

  // This line is used repeatedly to ask player if they wish to participate in a boxing match.

  "Хотите драться?",

  // In the next string, the first %s is an item name and the
  // second %s is an amount of money (including $ sign)

  "Купить %s за %s?",

  // In the next string, %s is a name

  "%s сопровожден в отряд %d.",

  // These messages are displayed during play to alert the player to a particular situation

  "ЗАКЛИНИЛО", // weapon is jammed.
  "Роботу нужно пули %s калибра.", // Robot is out of ammo
  "Бросить туда? Нет. Не выйдет.", // Merc can't throw to the destination he selected

  // These are different buttons that the player can turn on and off.

  "Скрытно (|Z)",
  "Окно карты (|M)",
  "Готово (|D)(Завершить ход)",
  "Говорить",
  "Без звука",
  "Подняться (|P|g|U|p)",
  "Поз.курсора(|T|a|b)",
  "Карабк./ Прыг.",
  "Опуститься (|P|g|D|n)",
  "Проверить (|C|t|r|l)",
  "Пред.наемник",
  "След.наемник (|S|p|a|c|e)",
  "Настройки (|O)",
  "Очередь (|B)",
  "Смотреть/Повернуться (|L)",
  "Здоровье: %d/%d\nЭнерг.: %d/%d\nДух: %s",
  "Чего?", // this means "what?"
  "Продолж.", // an abbrieviation for "Continued"
  "Вкл.звук для %s.",
  "Выкл.звук для %s.",
  "Здоровье: %d/%d\nБенз: %d/%d",
  "Выйти из машины",
  "Поменять отряд ( |S|h|i|f|t |S|p|a|c|e )",
  "Ехать",
  "Н/П", // this is an acronym for "Not Applicable."
  "Исп ( Рука в руке )",
  "Исп ( Огнестр.ор. )",
  "Исп ( Лезвие )",
  "Исп ( Взрывчатка )",
  "Исп ( Аптечка )",
  "(Поймать)",
  "(Перезарядить)",
  "(Дать)",
  "%s отправлен.",
  "%s прибыл.",
  "%s:нет очков действия.",
  "%s недоступен.",
  "%s весь в бинтах.",
  "%s:бинты сняты.",
  "Враг в секторе!",
  "Врага не видно.",
  "Не хватает очков действия.",
  "Никто не исп.дистанц.упр.",
  "Обойма опустела!",
  "СОЛДАТ",
  "РЕПТИОНЫ",
  "ОПОЛЧЕНИЕ",
  "ЖИТЕЛЬ",
  "Вход из сектора",
  "OK",
  "ОТМЕНА",
  "Выбранный наемник",
  "Все наемники в отряде",
  "Идти в сектор",
  "Идти на карту",
  "Этот сектор отсюда покинуть нельзя.",
  "%s слишком далеко.",
  "Короткие деревья",
  "Показать деревья",
  "ВОРОНА", // Crow, as in the large black bird
  "ШЕЯ",
  "ГОЛОВА",
  "ТОРС",
  "НОГИ",
  "Сказать королеве то,что она хочет знать?",
  "Отпечатки пальцев получены",
  "Отпечатки неверные. Оружие не действует",
  "Цель захвачена",
  "Путь блокирован",
  "Положить/Взять деньги со счета", // Help text over the $ button on the Single Merc Panel
  "Медпомощь никому не нужна.",
  "Слом.", // Short form of JAMMED, for small inv slots
  "Туда не добраться.", // used ( now ) for when we click on a cliff
  "Путь блокирован. Хотите поменяться местами с этим человеком?",
  "Человек отказывается двигаться.",
  // In the following message, '%s' would be replaced with a quantity of money (e.g. $200)
  "Вы согласны заплатить %s?",
  "Принять бесплатное лечение?",
  "Согласны женить Дэррела?",
  "Круглая панель управления",
  "С эскортируемыми этого сделать нельзя.",
  "Пощадить сержанта?",
  "Вне досягаемости для оружия",
  "Шахтер",
  "Машина ходит только между сектор.",
  "Автоперевязку сделать сейчас нельзя",
  "Путь для %s блокирован",
  "Наемники, захваченные армией Дейдранны, томятся здесь",
  "Замок поражен",
  "Замок разрушен",
  "Кто-то еще пытается воспользов.этой дверью.",
  "Здоровье: %d/%d\nБенз: %d/%d",
  "%s не видит %s.", // Cannot see person trying to talk to
];

// Varying helptext explains (for the "Go to Sector/Map" checkbox) what will happen given different circumstances in the "exiting sector" interface.
export let pExitingSectorHelpText: string[] /* STR16[] */ = [
  // Helptext for the "Go to Sector" checkbox button, that explains what will happen when the box is checked.
  "После проверки соседний сектор можно сразу занять.",
  "После проверки вы автоматически оказываетесь в окне карты а\nвашему наемнику понадобится время на дорогу.",

  // If you attempt to leave a sector when you have multiple squads in a hostile sector.
  "Этот сектор занят врагами и здесь оставлять наемников нельзя.\nНадо решить эту проблему перед тем как занимать другие сектора.",

  // Because you only have one squad in the sector, and the "move all" option is checked, the "go to sector" option is locked to on.
  // The helptext explains why it is locked.
  "Выводя оставшихся наемников из этого сектора,\nучти, что соседний сектор будет занят немедленно.",
  "Выведя оставшихся наемников из этого сектора,\nвы автоматически перемещаетесь в окно карты \nвашему наемнику понадобится время на дорогу.",

  // If an EPC is the selected merc, it won't allow the merc to leave alone as the merc is being escorted.  The "single" button is disabled.
  "%s не может покинуть этот сектор один, его надо сопроводить.",

  // If only one conscious merc is left and is selected, and there are EPCs in the squad, the merc will be prohibited from leaving alone.
  // There are several strings depending on the gender of the merc and how many EPCs are in the squad.
  // DO NOT USE THE NEWLINE HERE AS IT IS USED FOR BOTH HELPTEXT AND SCREEN MESSAGES!
  "%s не может покинуть сектор один-он сопровождает %s.", // male singular
  "%s не может покинуть сектор одна-она сопровождает %s.", // female singular
  "%s не может покинуть сектор один-он  сопровождает группу.", // male plural
  "%s не может покинуть сектор одна-она сопровождает группу.", // female plural

  // If one or more of your mercs in the selected squad aren't in range of the traversal area, then the  "move all" option is disabled,
  // and this helptext explains why.
  "Чтобы дать отряд мог пойти,\nвсе ваши наемники дожны быть в рядом.",

  "", // UNUSED

  // Standard helptext for single movement.  Explains what will happen (splitting the squad)
  "После проверки %s поедет один, и\nавтоматически попадет в уникальный отряд.",

  // Standard helptext for all movement.  Explains what will happen (moving the squad)
  "После проверки выбранный вами сейчас \nотряд покинет этот сектор.",

  // This strings is used BEFORE the "exiting sector" interface is created.  If you have an EPC selected and you attempt to tactically
  // traverse the EPC while the escorting mercs aren't near enough (or dead, dying, or unconscious), this message will appear and the
  //"exiting sector" interface will not appear.  This is just like the situation where
  // This string is special, as it is not used as helptext.  Do not use the special newline character (\n) for this string.
  "%s не может покинуть этот сектор один, его надо сопроводить. Остальные наемники остаются пока с вами.",
];

export let pRepairStrings: string[] /* STR16[] */ = [
  "Вещи", // tell merc to repair items in inventory
  "ПВО", // tell merc to repair SAM site - SAM is an acronym for Surface to Air Missile
  "Отмена", // cancel this menu
  "Робот", // repair the robot
];

// NOTE: combine prestatbuildstring with statgain to get a line like the example below.
// "John has gained 3 points of marksmanship skill."

export let sPreStatBuildString: string[] /* STR16[] */ = [
  "потерял", // the merc has lost a statistic
  "приобрел", // the merc has gained a statistic
  "очко", // singular
  "очки", // plural
  "уровень", // singular
  "уровня", // plural
];

export let sStatGainStrings: string[] /* STR16[] */ = [
  "здор.",
  "подвижн.",
  "проворн.",
  "мудрость.",
  "медицина",
  "взрывн.работы.",
  "механика.",
  "меткость.",
  "опытность.",
  "сила.",
  "лидерство.",
];

export let pHelicopterEtaStrings: string[] /* STR16[] */ = [
  "Общее расст.:  ", // total distance for helicopter to travel
  " Безопасно:  ", // distance to travel to destination
  " Опасно:", // distance to return from destination to airport
  "Общ.цена: ", // total cost of trip by helicopter
  "УВП:  ", // ETA is an acronym for "estimated time of arrival"
  "В вертолете мало топлива, он вынужд.сесть на враж.территории!", // warning that the sector the helicopter is going to use for refueling is under enemy control ->
  "Пассажиры: ",
  "Выбрать высадку Всадника или Прибывающих?",
  "Всадник",
  "Прибывающие",
];

export let sMapLevelString: string[] /* STR16[] */ = [
  "Подуровень ", // what level below the ground is the player viewing in mapscreen
];

export let gsLoyalString: string[] /* STR16[] */ = [
  "Отнош", // the loyalty rating of a town ie : Loyal 53%
];

// error message for when player is trying to give a merc a travel order while he's underground.

export let gsUndergroundString: string[] /* STR16[] */ = [
  "не приним.приказов идти под землей.",
];

export let gsTimeStrings: string[] /* STR16[] */ = [
  "ч", // hours abbreviation
  "м", // minutes abbreviation
  "с", // seconds abbreviation
  "д", // days abbreviation
];

// text for the various facilities in the sector

export let sFacilitiesStrings: string[] /* STR16[] */ = [
  "Ничего",
  "Госпит.",
  "Заводы",
  "Тюрьма",
  "Ополчен.",
  "Аэропорт",
  "Стрельбище", // a field for soldiers to practise their shooting skills
];

// text for inventory pop up button

export let pMapPopUpInventoryText: string[] /* STR16[] */ = [
  "Инвентарь",
  "Выход",
];

// town strings

export let pwTownInfoStrings: string[] /* STR16[] */ = [
  "Размер", // 0 // size of the town in sectors
  "", // blank line, required
  "Контроль", // how much of town is controlled
  "Ничего", // none of this town
  "Шахта города", // mine associated with this town
  "Верность", // 5 // the loyalty level of this town
  "Готовы", // the forces in the town trained by the player
  "",
  "Осн.оборуд.", // main facilities in this town
  "Уровень", // the training level of civilians in this town
  "Подготовка жителей", // 10 // state of civilian training in town
  "Ополчение", // the state of the trained civilians in the town
];

// Mine strings

export let pwMineStrings: string[] /* STR16[] */ = [
  "Шахта", // 0
  "Серебро",
  "Золото",
  "Производит/день",
  "Производств.возм-ти",
  "Брошено", // 5
  "Закрыто",
  "Выработана",
  "Работает",
  "Статус",
  "Производительность",
  "Тип руды", // 10
  "Город контроля",
  "Отношение города",
  //	L"Работ.шахтеры",
];

// blank sector strings

export let pwMiscSectorStrings: string[] /* STR16[] */ = [
  "Силы врага",
  "Сектор",
  "# вещей",
  "Неизв.",
  "Под контр.",
  "Да",
  "Нет",
];

// error strings for inventory

export let pMapInventoryErrorString: string[] /* STR16[] */ = [
  "%s недостаточно близко", // Merc is in sector with item but not close enough
  "Нельзя выбрать этого.", // MARK CARTER
  "%s не в секторе и не может взять эту вещь",
  "Во время битвы надо подбирать эти вещи вручную",
  "Во время битвы надо бросать вещи вручную.",
  "%s не в секторе,чтобы бросить вещи.",
];

export let pMapInventoryStrings: string[] /* STR16[] */ = [
  "Место", // sector these items are in
  "Всего вещей", // total number of items in sector
];

// help text for the user

export let pMapScreenFastHelpTextList: string[] /* STR16[] */ = [
  "Чтобы дать наемнику такие задания как идти в др.отряд, лечение или ремонт,выберите нужное в 'Принадлежность'",
  "чтобы направить наемника в другой сектор, выберите нужное в колонке 'Куда'",
  "Когда наемники получают приказ начать движение,компрессия позволит им это сделать.",
  "Левый щелчок-выбрать сектор. Еще раз левый щелчок-дать наемнику команду начать движение,правый щелчок-общая информация о секторе.",
  "Нажать'h' в любое время, чтобы вызвать подсказку.",
  "Проверка",
  "Проверка",
  "Проверка",
  "Проверка",
  "Пока команда не добралась до Арулько,в этом окне вам делать нечего.Когда вы укомплектуете свою команду,нажмите на кнопку Сжатие Времени в правом нижнем углу экрана.Команда доберется гораздо быстрее.",
];

// movement menu text

export let pMovementMenuStrings: string[] /* STR16[] */ = [
  "Преместить наемн.в сектор", // title for movement box
  "Путь", // done with movement menu, start plotting movement
  "Отмена", // cancel this menu
  "Другое", // title for group of mercs not on squads nor in vehicles
];

export let pUpdateMercStrings: string[] /* STR16[] */ = [
  "Ой!:", // an error has occured
  "Контракты закончились:", // this pop up came up due to a merc contract ending
  "Наемник выполнил задание:", // this pop up....due to more than one merc finishing assignments
  "Наемн.снова работает:", // this pop up ....due to more than one merc waking up and returing to work
  "Наемники идут спать:", // this pop up ....due to more than one merc being tired and going to sleep
  "Контракты скоро кончатся:", // this pop up came up due to a merc contract ending
];

// map screen map border buttons help text

export let pMapScreenBorderButtonHelpText: string[] /* STR16[] */ = [
  "Показать Города (|W)",
  "Показать Шахты (|M)",
  "Показ.Команды и Врагов(|T)",
  "Показать воздушное пространство(|A)",
  "Показать Вещи (|I)",
  "Показ.ополчен.и врагов(|Z)",
];

export let pMapScreenBottomFastHelp: string[] /* STR16[] */ = [
  "Лэптоп (|L)",
  "Тактика(|E|s|c)",
  "Настройки (|O)",
  "Сжатие врем.(|+)", // time compress more
  "Сжатие врем.(|-)", // time compress less
  "Предыдущ.сообщ (|U|p)\nПредыдущ.стр. (|P|g|U|p)", // previous message in scrollable list
  "След.сообщ. (|D|o|w|n)\nСлнд.стр. (|P|g|D|n)", // next message in the scrollable list
  "Пустить/Остановить время (|S|p|a|c|e)", // start/stop time compression
];

export let pMapScreenBottomText: string[] /* STR16[] */ = [
  "Текущий баланс", // current balance in player bank account
];

export let pMercDeadString: string[] /* STR16[] */ = [
  "%s мертв.",
];

export let pDayStrings: string[] /* STR16[] */ = [
  "День",
];

// the list of email sender names

export let pSenderNameList: string[] /* STR16[] */ = [
  "Энрико",
  "Псих Про Инк",
  "Помощь",
  "Псих.Про Инк",
  "Спек",
  "R.I.S.", // 5
  "Барри",
  "Блад",
  "Рысь",
  "Гризли",
  "Вики", // 10
  "Тревор",
  "Хряп",
  "Иван",
  "Анаболик",
  "Игорь", // 15
  "Тень",
  "Рыжий",
  "Потрошитель",
  "Фидель",
  "Лиска", // 20
  "Сидней",
  "Гас",
  "Сдоба",
  "Айс",
  "Паук", // 25
  "Скала",
  "Бык",
  "Стрелок",
  "Тоска",
  "Рейдер", // 30
  "Сова",
  "Статик",
  "Лен",
  "Данни",
  "Маг",
  "Стэфен",
  "Лысый",
  "Злобный",
  "Доктор Кью",
  "Гвоздь",
  "Тор",
  "Стрелка",
  "Волк",
  "ЭмДи",
  "Лава",
  //----------
  "M.I.S.Страх.",
  "Бобби Рэй",
  "Босс",
  "Джон Калба",
  "А.I.М.",
];

// next/prev strings

export let pTraverseStrings: string[] /* STR16[] */ = [
  "Предыд",
  "След",
];

// new mail notify string

export let pNewMailStrings: string[] /* STR16[] */ = [
  "Есть новые сообщения...",
];

// confirm player's intent to delete messages

export let pDeleteMailStrings: string[] /* STR16[] */ = [
  "Стереть сообщение?",
  "Стереть НЕПРОЧТЕННЫЕ?",
];

// the sort header strings

export let pEmailHeaders: string[] /* STR16[] */ = [
  "От:",
  "Тема:",
  "Дата:",
];

// email titlebar text

export let pEmailTitleText: string[] /* STR16[] */ = [
  "Почтовый ящик",
];

// the financial screen strings
export let pFinanceTitle: string[] /* STR16[] */ = [
  "Бухгалтер Плюс", // the name we made up for the financial program in the game
];

export let pFinanceSummary: string[] /* STR16[] */ = [
  "Кредит:", // credit (subtract from) to player's account
  "Дебет:", // debit (add to) to player's account
  "Приход за вчерашний день:",
  "Депозиты за вчерашн.день:",
  "Дебет за вчерашн. день:",
  "Баланс на конец дня:",
  "Приход за сегодня:",
  "Депозиты за сегодня:",
  "Дебет на сегодня:",
  "Текущий баланс:",
  "Предполагаемый приход:",
  "Предполагаемый баланс:", // projected balance for player for tommorow
];

// headers to each list in financial screen

export let pFinanceHeaders: string[] /* STR16[] */ = [
  "Day", // the day column
  "Кредит", // the credits column
  "Дебет", // the debits column
  "Перевод", // transaction type - see TransactionText below
  "Баланс", // balance at this point in time
  "Стр.", // page number
  "Дн.", // the day(s) of transactions this page displays
];

export let pTransactionText: string[] /* STR16[] */ = [
  "Интерес", // interest the player has accumulated so far
  "Анонимные вклады",
  "Пеня за перевод",
  "Нанят", // Merc was hired
  "Торговля Бобби Рэя", // Bobby Ray is the name of an arms dealer
  "Зарегистр.счета в M.E.R.C.",
  "Мед Депозит: %s", // medical deposit for merc
  "IMP анализ", // IMP is the acronym for International Mercenary Profiling
  "Куплена страховка:%s",
  "Понижена страховка: %s",
  "Расширена страховка: %s", // johnny contract extended
  "Отменена страховка: %s",
  "Страховой запрос: %s", // insurance claim for merc
  "в день", // merc's contract extended for a day
  "7 дней", // merc's contract extended for a week
  "14 дней", // ... for 2 weeks
  "Доход с шахт",
  "", // String nuked
  "Торговля цветами",
  "Полная оплата медуслуг.: %s",
  "Частичн.оплата медуслуг: %s",
  "Медуслуги не оплачены: %s",
  "Выплаты: %s", // %s is the name of the npc being paid
  "Перевод средств на имя %s", // transfer funds to a merc
  "Перевод средств от %s", // transfer funds from a merc
  "Стоим.экипировки ополч: %s", // initial cost to equip a town's militia
  "Покупки у %s.", // is used for the Shop keeper interface.  The dealers name will be appended to the end of the string.
  "%s положил деньги.",
];

export let pTransactionAlternateText: string[] /* STR16[] */ = [
  "Страховка", // insurance for a merc
  "%s:продлить контракт на 1 день", // entend mercs contract by a day
  "%s:продлить контракт на 7 дней",
  "%s:продлить контракт на 14 дней",
];

// helicopter pilot payment

export let pSkyriderText: string[] /* STR16[] */ = [
  "Всаднику заплачено $%d", // skyrider was paid an amount of money
  "Всаднику недоплачено $%d", // skyrider is still owed an amount of money
  "Всадник. Заправка завершена", // skyrider has finished refueling
  "", // unused
  "", // unused
  "Всадник готов к полету.", // Skyrider was grounded but has been freed
  "У Всадника нет пассажиров.Если вы хотите отправить наемников в этот сектор, выберите ПРИНАДЛ. и МАШИНА",
];

// strings for different levels of merc morale

export let pMoralStrings: string[] /* STR16[] */ = [
  "Отлично",
  "Хорошо",
  "Норм.",
  "НеОчень",
  "Паника",
  "Плох",
];

// Mercs equipment has now arrived and is now available in Omerta or Drassen.

export let pLeftEquipmentString: string[] /* STR16[] */ = [
  "%s:экипировку можно получить в Омерте( A9 ).",
  "%s:экипировку можно получить в Драссене( B13 ).",
];

// Status that appears on the Map Screen

export let pMapScreenStatusStrings: string[] /* STR16[] */ = [
  "Здоровье",
  "Энергия",
  "Дух",
  "Сост.", // the condition of the current vehicle (its "health")
  "Бензин", // the fuel level of the current vehicle (its "energy")
];

export let pMapScreenPrevNextCharButtonHelpText: string[] /* STR16[] */ = [
  "Пред.наемник (|L|e|f|t)", // previous merc in the list
  "След.наемник (|R|i|g|h|t)", // next merc in the list
];

export let pEtaString: string[] /* STR16[] */ = [
  "УВП:", // eta is an acronym for Estimated Time of Arrival
];

export let pTrashItemText: string[] /* STR16[] */ = [
  "Вы потеряете это навсегда.Выполнить?", // do you want to continue and lose the item forever
  "Это,кажется,и вправду ВАЖНАЯ вещь.Вы ВПОЛНЕ уверены, что хотите выбросить ее?", // does the user REALLY want to trash this item
];

export let pMapErrorString: string[] /* STR16[] */ = [
  "Отряд не может двигаться со спящим наемн.",

  // 1-5
  "Сперва выведите отряд на землю.",
  "Приказ двигаться? Тут же кругом враги!",
  "Наемн.должен быть назначен в сектор или машину,чтобы ехать.",
  "У вас в команде еще никого нет", // you have no members, can't do anything
  "Наемн.не может выполнить.", // merc can't comply with your order
  // 6-10
  "чтобы двигаться,нужен эскорт.Обеспечьте его эскортом", // merc can't move unescorted .. for a male
  "чтобы двигаться, нужен эскорт.Обеспечьте ее эскортом.", // for a female
  "Наемник еще не прибыл в Арулько!",
  "Кажется,сначала нужно уладить все проблемы с контрактом.",
  "",
  // 11-15
  "Приказ двигаться? Тут же битва идет!",
  "Вы наткнулись на засаду Кошки-Убийцы в секторе %s!",
  "Вы попали в логово Кошек-Убийц в секторе I16!",
  "",
  "ПВО в %s занята врагом.",
  // 16-20
  "Шахта в %s взята. Ваш ежедневный доход упал до %s в день.",
  "Противник взял сектор %s, не встретив сопротивления.",
  "Как минимум одного из ваших наемн.нельзя назн.на это задание.",
  "%s нельзя присоед.к %s. Уже полон",
  "%s нельзя присоед.к %s. Слишком далеко.",
  // 21-25
  "Шахта в %s захвачена войсками Дейдранны!",
  "Войска Дейдранны только что захватили ПВО в %s",
  "Войска Дейдранны только что захватили %s",
  "Войска Дейдранны только что были замечены в %s.",
  "Войска Дейдраннытолько что захватили %s.",
  // 26-30
  "Как минимум один из ваших наемников невозможно уложить спать.",
  "Как минимум одного из ваших наемников невозможно разбудить.",
  "Ополчение не придет, пока не закончится его обучение.",
  "%s сейчас не может принять приказ двигаться.",
  "Ополчение, которое находится вне города,нельзя переместить в другой сектор.",
  // 31-35
  "Нельзя держать ополчение в %s.",
  "Пустая машина не может двигаться!",
  "%s слишком изранен, чтобы идти!",
  "Сперва надо покинуть музей!",
  "%s мертв!",
  // 36-40
  "%s не может перейти к %s: он в движении",
  "%s не может сесть в машину так",
  "%s не может присоед. к %s",
  "Нельзя сжимать время пока нет наемников!",
  "Эта машина может ездить только по дорогам!",
  // 41-45
  "Нельзя переназначать движущихся наемников",
  "В машине кончился бензин!",
  "%s слишком устал,чтобы передвигаться.",
  "Никто из сидящих в машине не может управлять ею.",
  "Сейчас один/неск.наемн.этого отряда не могут двигаться.",
  // 46-50
  "Сейчас один/неск.ДРУГИХ наемн.не могут двигаться.",
  "Машина слишком побита!",
  "Тренировать ополчение могут только 2 наемн.в секторе",
  "Робот не может двигаться без управляющего.Поместите их в один отряд.",
];

// help text used during strategic route plotting
export let pMapPlotStrings: string[] /* STR16[] */ = [
  "Щелкните по месту,чтобы подтвердить конечное направление,или щелкните по другому сектору.",
  "Направление подтверждено.",
  "Место назн.не изменилось.",
  "Направление отменено.",
  "Путь укорочен.",
];

// help text used when moving the merc arrival sector
export let pBullseyeStrings: string[] /* STR16[] */ = [
  "Кликнуть на тот сектор, куда вы хотите отправить наемника.",
  "OK.Прибывающий наемник будет высажен в %s",
  "Наемнику нельзя туда лететь,воздушн.путь небезопасен!",
  "Отмена. Сектор прибытия тот же",
  "Возд.пространство над %s небезопасно!Сектор прибытия перемещен в %s.",
];

// help text for mouse regions

export let pMiscMapScreenMouseRegionHelpText: string[] /* STR16[] */ = [
  "Просмотр инвентаря(|E|n|t|e|r)",
  "Выкинуть вещь",
  "Выйти из инвентаря(|E|n|t|e|r)",
];

// male version of where equipment is left
export let pMercHeLeaveString: string[] /* STR16[] */ = [
  "%s должен оставить свое снаряжение здесь (%s) или позже в Драссене (B13)во время вылета из Арулько?",
  "%s должен оставить свое снаряжение здесь (%s) или позже в Омерте (А9) во время вылета из Арулько?",
  "отправляется и сбросит свое снаряжение в Омерте (A9).",
  "отправляется и сбросит свое снаряжение в Драссене (B13).",
  "%s отправляется и сбросит свое снаряжение в %s.",
];

// female version
export let pMercSheLeaveString: string[] /* STR16[] */ = [
  "%s должна оставить свое снаряжение здесь (%s) или позже в Драссене (B13)во время вылета из Арулько?",
  " должна оставить свое снаряжение здесь (%s) или позже в Омерте (А9)во время вылета из Арулько?",
  "отправляется и сбросит свое снаряжение в Омерте (A9).",
  "отправляется и сбросит свое снаряжение в Драссене (B13).",
  "%s отправляется и сбросит свое снаряжение в %s.",
];

export let pMercContractOverStrings: string[] /* STR16[] */ = [
  ":его контракт закончился,он уехал домой.", // merc's contract is over and has departed
  ":ее контракт закончился,она уехала домой.", // merc's contract is over and has departed
  ":контракт кончился,он уехал.", // merc's contract has been terminated
  ":контракт кончился она уехала.", // merc's contract has been terminated
  "Вы должны M.E.R.C. слишком много,%s уехал.", // Your M.E.R.C. account is invalid so merc left
];

// Text used on IMP Web Pages

export let pImpPopUpStrings: string[] /* STR16[] */ = [
  "Неверный код авторизации",
  "Вы уверены, что хотите начать процесс записи профайла заново?",
  "Введите полное имя и пол",
  "Предварит.анализ ваших финансов показал, что у вас недостаточно денег на анализ.",
  "Сейчас вы не можете выбрать это.",
  "Чтобы закончить анализ,нужно иметь место еще хотя бы для одного члена команды.",
  "Анализ уже завершен.",
];

// button labels used on the IMP site

export let pImpButtonText: string[] /* STR16[] */ = [
  "Подробнее", // about the IMP site
  "НАЧАТЬ", // begin profiling
  "Личность", // personality section
  "Свойства", // personal stats/attributes section
  "Портрет", // the personal portrait selection
  "Голос %d", // the voice selection
  "Готово", // done profiling
  "Заново", // start over profiling
  "Да,выбрать выделенный ответ.",
  "Да",
  "Нет",
  "Закончить", // finished answering questions
  "Пред", // previous question..abbreviated form
  "След", // next question
  "ДА.", // yes, I am certain
  "НЕТ, ХОЧУ НАЧАТЬ СНАЧАЛА.", // no, I want to start over the profiling process
  "ДА.",
  "НЕТ",
  "Назад", // back one page
  "Отменить", // cancel selection
  "Да,уверен.",
  "Нет,просмотреть еще раз.",
  "Зарегистр.", // the IMP site registry..when name and gender is selected
  "Анализ", // analyzing your profile results
  "OK",
  "Голос",
];

export let pExtraIMPStrings: string[] /* STR16[] */ = [
  "Чтобы начать профилирование, выберите Личность.",
  "Когда Личность завершена, выберите ваши Свойства.",
  "Свойства приписаны,переходите к Портрету.",
  "Чтобы завершить процесс,выберите голос,который вам подходит.",
];

export let pFilesTitle: string[] /* STR16[] */ = [
  "Просмотр файлов",
];

export let pFilesSenderList: string[] /* STR16[] */ = [
  "Отчет разведки", // the recon report sent to the player. Recon is an abbreviation for reconissance
  "Перехват #1", // first intercept file .. Intercept is the title of the organization sending the file...similar in function to INTERPOL/CIA/KGB..refer to fist record in files.txt for the translated title
  "Перехват #2", // second intercept file
  "Перехват #3", // third intercept file
  "Перехват #4", // fourth intercept file
  "Перехват #5", // fifth intercept file
  "Перехват #6", // sixth intercept file
];

// Text having to do with the History Log

export let pHistoryTitle: string[] /* STR16[] */ = [
  "История",
];

export let pHistoryHeaders: string[] /* STR16[] */ = [
  "День", // the day the history event occurred
  "Стр.", // the current page in the history report we are in
  "День", // the days the history report occurs over
  "Место", // location (in sector) the event occurred
  "Событие", // the event label
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
  "%s нанят из A.I.M.", // merc was hired from the aim site
  "%s нанят из M.E.R.C.", // merc was hired from the aim site
  "%s умер.", // merc was killed
  "Зарегистр.счета в M.E.R.C.", // paid outstanding bills at MERC
  "Принято назначение от Энрико Сальвадори",
  // 6-10
  "IMP профайл сгенерирован",
  "Подписан страховой контракт для %s.", // insurance contract purchased
  "Отменен страховой контракт для %s.", // insurance contract canceled
  "Страховая выплата для %s.", // insurance claim payout for merc
  "%s:контракт продлен на день.", // Extented "mercs name"'s for a day
  // 11-15
  "%s:контракт продлен на 7дн.", // Extented "mercs name"'s for a week
  "%s:контракт продлен на 14дн.", // Extented "mercs name"'s 2 weeks
  "%s уволен.", // "merc's name" was dismissed.
  "%s ушел.", // "merc's name" quit.
  "начало.", // a particular quest started
  // 16-20
  "завершен.",
  "Разговор с начальн.шахт в 						 s", // talked to head miner of town
  "Освобожден %s",
  "Был использован обман",
  "Пища должна быть в Омерте до завтра",
  // 21-25
  "%s покинула команду и вышла замуж за Дэрила Хика",
  "%s:срок контракта истек.",
  "%s нанят.",
  "Энрико жалуется на отсуствие прогресса",
  "Битва выиграна",
  // 26-30
  "%s:в шахте кончается руда",
  "%s: шахта выработана",
  "%s: шахта закрыта",
  "%s: шахта вновь открыта",
  "Получил сведения о тюрьме Тикса.",
  // 31-35
  "Услышал о секретном военном заводе Орта.",
  "Ученый с Орты помог с ракетным ружьем.",
  "Дейдранна нашла применение трупам.",
  "Франк говорил о боях в Сан Моне.",
  "Пациент думает,что он что-то видел в шахтах.",
  // 36-40
  "Встретил какого-то Девина - торгует взрывчаткой.",
  "Столкнулся со знаменитым Майком!",
  "Встретил Тони - он занимается оружием.",
  "Получил ракетное ружье от сержанта Кротта.",
  "Право собственности на магазин Энжела передано Кайлу.",
  // 41-45
  "Шиз предлагает сделать робота.",
  "Болтун может сделать тайное варево для жуков.",
  "Кейт больше не работает.",
  "Говард обеспечивает Дейдранну цианидом.",
  "Встретил Кейта - своего человека в Камбрии.",
  // 46-50
  "Встретил Говарда - фармацевта из Балимы.",
  "Встретил Перко - у него маленький ремонтный бизнес.",
  "Встретил Сэма из Балайма - у него компьютерный магазин.",
  "Фрэнс занимается электроникой и другими вещами.",
  "У Арнольда ремонтный магазин в Граме.",
  // 51-55
  "Фредо ремонтирует электронику в Граме.",
  "Получено пожертвование от богатого парня из Балайма.",
  "Встретил старьевщика по имени Джейк.",
  "Нам дали электронный ключ.",
  "Подкупил Вальтера, чтобы он открыл дверь в подвал.",
  // 56-60
  "Если у Дэвида есть бензин,он нам его даст бесплатно.",
  "Дал взятку Пабло.",
  "Босс хранит деньги в шахте Сан Моны.",
  "%s выиграл кулачный бой",
  "%s проиграл кулачный бой",
  // 61-65
  "%s дисквалифицирован в кулачном бою",
  "Нашел много денег в заброшенной шахте.",
  "Захватил убийцу, подосланного Боссом.",
  "Потерял контроль над сектором", // ENEMY_INVASION_CODE
  "Защитил сектор",
  // 66-70
  "Проиграл битву", // ENEMY_ENCOUNTER_CODE
  "Засада", // ENEMY_AMBUSH_CODE
  "Засада перебита",
  "Безуспешная атака", // ENTERING_ENEMY_SECTOR_CODE
  "Успешная атака!",
  // 71-75
  "Существа атаковали", // CREATURE_ATTACK_CODE
  "Убит кошкой-убийцей", // BLOODCAT_AMBUSH_CODE
  "Перебил кошек-убийц",
  "%s убит",
  "Отдал голову террориста Слаю",
  "Слай ушел",
  "Убил %s",
];

export let pHistoryLocations: string[] /* STR16[] */ = [
  "Н/П", // N/A is an acronym for Not Applicable
];

// icon text strings that appear on the laptop

export let pLaptopIcons: string[] /* STR16[] */ = [
  "Почта",
  "Сеть",
  "Финансы",
  "Кадры",
  "Журнал",
  "Файлы",
  "Выключить",
  "сир-ФЕР 4.0", // our play on the company name (Sirtech) and web surFER
];

// bookmarks for different websites
// IMPORTANT make sure you move down the Cancel string as bookmarks are being added

export let pBookMarkStrings: string[] /* STR16[] */ = [
  "А.I.M.",
  "Бобби Рэй",
  "I.M.P.",
  "М.Е.R.С.",
  "Морг",
  "Цветы",
  "Страховка",
  "Отмена",
];

export let pBookmarkTitle: string[] /* STR16[] */ = [
  "Закладки",
  "Чтобы попасть в это меню потом - правый щелчок.",
];

// When loading or download a web page

export let pDownloadString: string[] /* STR16[] */ = [
  "Загрузка",
  "Перезагрузка",
];

// This is the text used on the bank machines, here called ATMs for Automatic Teller Machine

export let gsAtmSideButtonText: string[] /* STR16[] */ = [
  "OK",
  "Взять", // take money from merc
  "Дать", // give money to merc
  "Отмена", // cancel transaction
  "Очист.", // clear amount being displayed on the screen
];

export let gsAtmStartButtonText: string[] /* STR16[] */ = [
  "Перевести $", // transfer money to merc -- short form
  "Стат.", // view stats of the merc
  "Инвентарь", // view the inventory of the merc
  "Занятость",
];

export let sATMText: string[] /* STR16[] */ = [
  "Перевести деньги?", // transfer funds to merc?
  "Ok?", // are we certain?
  "Введите сумму", // enter the amount you want to transfer to merc
  "Выберите тип", // select the type of transfer to merc
  "Недостаточно денег", // not enough money to transfer to merc
  "Сумма должна быть кратной $10", // transfer amount must be a multiple of $10
];

// Web error messages. Please use German equivilant for these messages.
// DNS is the acronym for Domain Name Server
// URL is the acronym for Uniform Resource Locator

export let pErrorStrings: string[] /* STR16[] */ = [
  "Ошибка",
  "Сервер не имеет DNS-входа.",
  "Проверьте URL адрес и попробуйте еще раз.",
  "OK",
  "Плохое соединение.Попробуйте позднее.",
];

export let pPersonnelString: string[] /* STR16[] */ = [
  "Наемн:", // mercs we have
];

export let pWebTitle: string[] /* STR16[] */ = [
  "сир-ФЕР 4.0", // our name for the version of the browser, play on company name
];

// The titles for the web program title bar, for each page loaded

export let pWebPagesTitles: string[] /* STR16[] */ = [
  "А.I.M.",
  "Члены A.I.M.",
  "Фото A.I.M.", // a mug shot is another name for a portrait
  "A.I.M. Сортировка",
  "A.I.M.",
  "A.I.M.-История", //$$
  "A.I.M.-Политика",
  "A.I.M.-Журнал",
  "A.I.M.-Ссылки",
  "M.E.R.C.",
  "M.E.R.C.-Счета",
  "M.E.R.C.-Регистрация",
  "M.E.R.C.-Индекс",
  "Бобби Рэй",
  "Бобби Рэй - Пист.",
  "Бобби Рэй - Оруж.",
  "Бобби Рэй - Броня",
  "Бобби Рэй - разное", // misc is an abbreviation for miscellaneous
  "Бобби Рэй - Б.У.",
  "Бобби Рэй - Бланк",
  "I.M.P.",
  "I.M.P.",
  "Объед.Служба Цветов",
  "Объед.Служба Цветов - Галерея",
  "Объед.Служба Цветов - Бланк Заказа",
  "Объед.Служба Цветов - Открытки",
  "Малеус,Инкус и Стэйпс:страховые агенты",
  "Информация",
  "Контракт",
  "Комментарии",
  "Морг Макгилликути",
  "",
  "URL не найден.",
  "Бобби Рэй - Последние поступл.", //@@@3 Translate new text
  "",
  "",
];

export let pShowBookmarkString: string[] /* STR16[] */ = [
  "Sir-Help",
  "Закладки:щелкните еще раз по Web.",
];

export let pLaptopTitles: string[] /* STR16[] */ = [
  "Почтовый ящик",
  "Просмотр файлов",
  "Персонал",
  "Бухгалтер Плюс",
  "Журнал",
];

export let pPersonnelDepartedStateStrings: string[] /* STR16[] */ = [
  // reasons why a merc has left.
  "Убит в бою",
  "Уволен",
  "Другое",
  "Женат",
  "Контракт окончен",
  "Выход",
];
// personnel strings appearing in the Personnel Manager on the laptop

export let pPersonelTeamStrings: string[] /* STR16[] */ = [
  "Текущий отряд",
  "Отправления",
  "Расходы/день:",
  "Наиб.расход:",
  "Наим.расход:",
  "Убит в бою:",
  "Уволен:",
  "Другое:",
];

export let pPersonnelCurrentTeamStatsStrings: string[] /* STR16[] */ = [
  "Низкий",
  "Средний",
  "Высокий",
];

export let pPersonnelTeamStatsStrings: string[] /* STR16[] */ = [
  "ЗДОР",
  "ПДВ",
  "ЛОВ",
  "СИЛ",
  "ЛДР",
  "МДР",
  "УРВ",
  "МТК",
  "МЕХ",
  "ВЗРВ",
  "МЕД",
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
  "Контракт",
];

// text that appears on the update panel buttons

export let pUpdatePanelButtons: string[] /* STR16[] */ = [
  "Продолжить",
  "Стоп",
];

// Text which appears when everyone on your team is incapacitated and incapable of battle

export let LargeTacticalStr: string[] /* UINT16[][LARGE_STRING_LENGTH] */ = [
  "В этом секторе вам нанесли поражение!",
  "Враг, не испытывая угрызений совести, пожрет всех до единого!",
  "Член вашей команды захвачен (он без сознания)!",
  "Член вашей команды захвачен в плен врагом.",
];

// Insurance Contract.c
// The text on the buttons at the bottom of the screen.

export let InsContractText: string[] /* STR16[] */ = [
  "Пред.",
  "След",
  "ОК",
  "Очистить",
];

// Insurance Info
// Text on the buttons on the bottom of the screen

export let InsInfoText: string[] /* STR16[] */ = [
  "Пред.",
  "След.",
];

// For use at the M.E.R.C. web site. Text relating to the player's account with MERC

export let MercAccountText: string[] /* STR16[] */ = [
  // Text on the buttons on the bottom of the screen
  "Подтвердить",
  "На гл.страницу",
  "Счет #:",
  "Наем.",
  "Дни",
  "Ставка", // 5
  "Стоимость",
  "Всего:",
  "Вы уверены, что хотите подтвердить выплату %s?", // the %s is a string that contains the dollar amount ( ex. "$150" )
];

// For use at the M.E.R.C. web site. Text relating a MERC mercenary

export let MercInfo: string[] /* STR16[] */ = [
  "Здоровье",
  "Подвижность",
  "Проворность",
  "Сила",
  "Лидерство",
  "Мудрость",
  "Опытность",
  "Меткость",
  "Механика",
  "Взрывн.раб.",
  "Медицина",

  "Пред.",
  "Нанять",
  "Далее",
  "Дополн.информ.",
  "На гл.страницу",
  "Нанят",
  "Зарплата:",
  "в день   .",
  "Мертвец",

  "Похоже,вы увлеклись набором наемников.Ваш предел-18 чел.",
  "Недоступно",
];

// For use at the M.E.R.C. web site. Text relating to opening an account with MERC

export let MercNoAccountText: string[] /* STR16[] */ = [
  // Text on the buttons at the bottom of the screen
  "Открыть счет",
  "Отмена",
  "У вас нет счета. Хотите открыть?",
];

// For use at the M.E.R.C. web site. MERC Homepage

export let MercHomePageText: string[] /* STR16[] */ = [
  // Description of various parts on the MERC page
  "Спек Т.Клайн,основатель",
  "Открытие счета",
  "Просмотр счета",
  "Просмотр файлов",
  // The version number on the video conferencing system that pops up when Speck is talking
  "Спек Ком.v3.2",
];

// For use at MiGillicutty's Web Page.

export let sFuneralString: string[] /* STR16[] */ = [
  "Морг Макгилликути:скорбим вместе с семьями усопших с 1983.",
  "Директор по похоронам и бывший наемник А.I.М Мюррэй \"Попс\" Макгилликати-специалист по части похорон.",
  "Всю жизнь Попса сопровождали смерть и утраты,поэтому он как никто познал их тяжесть.",
  "Морг Мак Гилликути предлагает широкий спектр похоронных услуг,от жилетки,в которую можно поплакать,до восстановления сильно поврежденных останков.",
  "Доверьтесь моргу Мак Гилликути, и ваши родственники почиют в мире.",

  // Text for the various links available at the bottom of the page
  "ПОСЛАТЬ ЦВЕТЫ",
  "КОЛЛЕКЦИЯ УРН И ГРОБОВ",
  "УСЛУГИ ПО КРЕМАЦИИ",
  "ПОДГОТОВКА ПОХОРОН",
  "ПОХОРОННЫЙ ЭТИКЕТ",

  // The text that comes up when you click on any of the links ( except for send flowers ).
  "Семья понесла тяжелую утрату.К сожалению, не все работы еще завершены.Приходите после прочтения завещания и выплат долгов умершего.",
  "Надеемся,что вы ощущаете наше сочувствие в это нелегкое время.",
];

// Text for the florist Home page

export let sFloristText: string[] /* STR16[] */ = [
  // Text on the button on the bottom of the page

  "Галерея",

  // Address of United Florist

  "\"Мы сбрасываем цветы везде\"",
  "1-555-SCENT-ME",
  "333 Др.Ноуз-Гей,Сиди Сити,КА США 90210",
  "http://www.scent-me.com",

  // detail of the florist page

  "Мы работаем быстро и эффективно!",
  "Гарантированная доставка в течение одного дня в любую точку земного шара.Есть ограничения.",
  "Самые низкие в мире цены!",
  "Покажите нам рекламу подобных услуг,которые стоят дешевле и получите 10роз бесплатно.",
  "Летающая Флора,Фауна&Цветы с 1981.",
  "Наши сотрудники-бывшие военные летчики-сбросят ваш букет в радиусе 10миль от нужного вам места.В любое время!Всегда!",
  "Позвольте нам воплотить ваши цветочные фантазии в жизнь.",
  "Пусть Брюс,известный во всем мире флорист,собственноручно соберет вам букет свежайших цветов из наших оранжерей.",
  "И помните-то,чего у нас нет,мы можем вырастить-быстро!",
];

// Florist OrderForm

export let sOrderFormText: string[] /* STR16[] */ = [
  // Text on the buttons

  "Назад",
  "Послать",
  "Очистить",
  "Галерея",

  "Назв.букета:",
  "Цена:", // 5
  "Номер заказа:",
  "День доставки",
  "след.день",
  "дойдет когда дойдет",
  "Место доставки", // 10
  "Дополнит.услуги",
  "Сломанные цветы($10)",
  "Черные розы($20)",
  "Увядший букет($10)",
  "Фруктовый пирог(если есть)($10)", // 15
  "Личные переживания:",
  "Ввиду небольшого размера карточек, 75 символов - максимум.",
  "...или посмотрите на наши",

  "СТАНДАРТНЫЕ КАРТЫ",
  "Информация о счете", // 20

  // The text that goes beside the area where the user can enter their name

  "Имя:",
];

// Florist Gallery.c

export let sFloristGalleryText: string[] /* STR16[] */ = [
  // text on the buttons

  "Пред", // abbreviation for previous
  "След", // abbreviation for next

  "Щелкните по тому,что хотите заказать.",
  "Примечание:за каждый увядший или сломанный букет дополн.плата $10.",

  // text on the button

  "На гл.стр.",
];

// Florist Cards

export let sFloristCards: string[] /* STR16[] */ = [
  "Щелкните по выбранному",
  "Назад",
];

// Text for Bobby Ray's Mail Order Site

export let BobbyROrderFormText: string[] /* STR16[] */ = [
  "Бланк заказа", // Title of the page
  "Ед.", // The number of items ordered
  "Вес (%s)", // The weight of the item
  "Название", // The name of the item
  "Цена", // the item's weight
  "Всего", // 5	// The total price of all of items of the same type
  "Стоимость", // The sub total of all the item totals added
  "ДиУ (см. Место Доставки)", // S&H is an acronym for Shipping and Handling
  "Общая стоим.", // The grand total of all item totals + the shipping and handling
  "Место доставки",
  "Скор.доставки", // 10	// See below
  "Стоим.(за %s.)", // The cost to ship the items
  "Доставка-1день", // Gets deliverd the next day
  "2 рабочих дня", // Gets delivered in 2 days
  "Стандартный срок", // Gets delivered in 3 days
  "Очистить", // 15			// Clears the order page
  "Принять заказ", // Accept the order
  "Назад", // text on the button that returns to the previous page
  "На гл.стр.", // Text on the button that returns to the home page
  "* Указывает БУвещи", // Disclaimer stating that the item is used
  "У вас нет на это средств.", // 20	// A popup message that to warn of not enough money
  "<НЕТ>", // Gets displayed when there is no valid city selected
  "Вы уверены,что надо послать этот заказ %s?", // A popup that asks if the city selected is the correct one
  "Вес упаковки**", // Displays the weight of the package
  "** Мин.вес", // Disclaimer states that there is a minimum weight for the package
  "Заказы",
];

// This text is used when on the various Bobby Ray Web site pages that sell items

export let BobbyRText: string[] /* STR16[] */ = [
  "Заказать", // Title
  // instructions on how to order
  "Щелкните на вещь.Если вам нужно больше одной,щелкните еще. Правый клик-умень. кол-во вещей.Когда выберете все,что хотите,заполняйте бланк заказа.",

  // Text on the buttons to go the various links

  "Пред.вещи", //
  "Пист.", // 3
  "Амуниция", // 4
  "Броня", // 5
  "Разн.", // 6	//misc is an abbreviation for miscellaneous
  "Б.У.", // 7
  "Еще",
  "БЛАНК",
  "На гл.стр.", // 10

  // The following 2 lines are used on the Ammunition page.
  // They are used for help text to display how many items the player's merc has
  // that can use this type of ammo

  "У вашей команды есть", // 11
  "Оруж.,где исп.этот тип боеприпасов", // 12

  // The following lines provide information on the items

  "Вес:", // Weight of all the items of the same type
  "Кал:", // the caliber of the gun
  "Маг:", // number of rounds of ammo the Magazine can hold
  "Рнг:", // The range of the gun
  "Пвр:", // Damage of the weapon
  "УС:", // Weapon's Rate Of Fire, acronym ROF
  "Цена:", // Cost of the item
  "На складе:", // The number of items still in the store's inventory
  "Заказ:кол-во:", // The number of items on order
  "Повреждение", // If the item is damaged
  "Вес:", // the Weight of the item
  "Итого:", // The total cost of all items on order
  "* %% действует", // if the item is damaged, displays the percent function of the item

  // Popup that tells the player that they can only order 10 items at a time

  "Дорогие клиенты!Заказ в режиме on-line позволяет заказать не более 10 вещей. Если вы хотите заказать больше,(а мы надемся,что так и есть),заполните еще один бланк и примите наши извинения.",

  // A popup that tells the user that they are trying to order more items then the store has in stock

  "Извините.Этот товар закончился.Попробуйте заказать его позже.",

  // A popup that tells the user that the store is temporarily sold out

  "Извините,но все товары этого типа закончились.",
];

// Text for Bobby Ray's Home Page

export let BobbyRaysFrontText: string[] /* STR16[] */ = [
  // Details on the web site

  "Здесь вы можете приобрести последние новинки производства оружия и сопутствующих товаров",
  "Мы можем предложить вам все,что нужно для взрывных работ",
  "Б.У.",

  // Text for the various links to the sub pages

  "Разное",
  "ПИСТОЛЕТЫ",
  "АМУНИЦИЯ", // 5
  "БРОНЯ",

  // Details on the web site

  "Если мы этого не продаем, вам это взять неоткуда!",
  "В разработке",
];

// Text for the AIM page.
// This is the text used when the user selects the way to sort the aim mercanaries on the AIM mug shot page

export let AimSortText: string[] /* STR16[] */ = [
  "Члены А.I.M.", // Title
  // Title for the way to sort
  "Сортировка:",

  // sort by...

  "Цена",
  "Опытность",
  "Меткость",
  "Медицина",
  "Взрывн.раб.",
  "Механика",

  // Text of the links to other AIM pages

  "Просмотреть Фото наемников",
  "Просмотреть Статистику наемников",
  "Просмотреть Историю А.I.M.",

  // text to display how the entries will be sorted

  "По возраст.",
  "По убыв.",
];

// Aim Policies.c
// The page in which the AIM policies and regulations are displayed

export let AimPolicyText: string[] /* STR16[] */ = [
  // The text on the buttons at the bottom of the page

  "Пред.стр.",
  "Гл. стр.AIM",
  "Правила",
  "След.стр.",
  "Отвергнуть",
  "Согл.",
];

// Aim Member.c
// The page in which the players hires AIM mercenaries

// Instructions to the user to either start video conferencing with the merc, or to go the mug shot index

export let AimMemberText: string[] /* STR16[] */ = [
  "Левый щелчок",
  "контакт с наемн.",
  "Правый щелчок",
  "индекс фото.",
];

// Aim Member.c
// The page in which the players hires AIM mercenaries

export let CharacterInfo: string[] /* STR16[] */ = [
  // The various attributes of the merc

  "Здоровье",
  "Подвижность",
  "Проворность",
  "Сила",
  "Лидерство",
  "Мудрость",
  "Опытность",
  "Меткость",
  "Механика",
  "Взрывн.раб.",
  "Медицина", // 10

  // the contract expenses' area

  "Плата",
  "Срок",
  "1 день",
  "7 дней",
  "14 дней",

  // text for the buttons that either go to the previous merc,
  // start talking to the merc, or go to the next merc

  "Пред.",
  "Контакт",
  "След.",

  "Дополнит.инф.", // Title for the additional info for the merc's bio
  "Действ.члены", // 20		// Title of the page
  "Стоим.оборудования:", // Displays the optional gear cost
  "Необходимый мед.депозит", // If the merc required a medical deposit, this is displayed
];

// Aim Member.c
// The page in which the player's hires AIM mercenaries

// The following text is used with the video conference popup

export let VideoConfercingText: string[] /* STR16[] */ = [
  "Цена контракта:", // Title beside the cost of hiring the merc

  // Text on the buttons to select the length of time the merc can be hired

  "1 день",
  "7 дней",
  "14 дней",

  // Text on the buttons to determine if you want the merc to come with the equipment

  "Нет экипировки",
  "Купить экипир.",

  // Text on the Buttons

  "ПЕРЕВЕСТИ ФОНДЫ", // to actually hire the merc
  "ОТМЕНА", // go back to the previous menu
  "НАНЯТЬ", // go to menu in which you can hire the merc
  "ПРЕКР.РАЗГОВОР", // stops talking with the merc
  "OK",
  "ОСТАВИТЬ СООБЩ.", // if the merc is not there, you can leave a message

  // Text on the top of the video conference popup

  "Видеоконференция с",
  "Соединение. . .",

  "с мед.депоз." // Displays if you are hiring the merc with the medical deposit
];

// Aim Member.c
// The page in which the player hires AIM mercenaries

// The text that pops up when you select the TRANSFER FUNDS button

export let AimPopUpText: string[] /* STR16[] */ = [
  "ПЕРЕВОД ФОНДОВ ЗАВЕРШЕН УСПЕШНО", // You hired the merc
  "НЕЛЬЗЯ ПЕРЕВЕСТИ ФОНДЫ", // Player doesn't have enough money, message 1
  "НЕДОСТАТОЧНО СРЕДСТВ", // Player doesn't have enough money, message 2

  // if the merc is not available, one of the following is displayed over the merc's face

  "На задании",
  "Оставьте сообщение",
  "Скончался",

  // If you try to hire more mercs than game can support

  "У вас уже набрано 18 наемников-полная команда.",

  "Сообщение",
  "Сообщ. оставлено",
];

// AIM Link.c

export let AimLinkText: string[] /* STR16[] */ = [
  "Линки A.I.M.", // The title of the AIM links page
];

// Aim History

// This page displays the history of AIM

export let AimHistoryText: string[] /* STR16[] */ = [
  "Журнал A.I.M.", // Title

  // Text on the buttons at the bottom of the page

  "Пред.стр.",
  "Гл.стр.",
  "История A.I.M.", //$$
  "След.стр.",
];

// Aim Mug Shot Index

// The page in which all the AIM members' portraits are displayed in the order selected by the AIM sort page.

export let AimFiText: string[] /* STR16[] */ = [
  // displays the way in which the mercs were sorted

  "Цена",
  "Опытность",
  "Меткость",
  "Медицина",
  "Взрывн.раб.",
  "Механика",

  // The title of the page, the above text gets added at the end of this text

  "Члены A.I.M.:сортировка по возраст. %s",
  "Члены A.I.M.:сортировка по убыв. %s",

  // Instructions to the players on what to do

  "Левый щелчок",
  "Выбрать наемн", // 10
  "Правый щелчок",
  "Упорядочить выбор",

  // Gets displayed on top of the merc's portrait if they are...

  "Отсутствует",
  "Скончался", // 14
  "На задании",
];

// AimArchives.
// The page that displays information about the older AIM alumni merc... mercs who are no longer with AIM

export let AimAlumniText: string[] /* STR16[] */ = [
  // Text of the buttons

  "СТР 1",
  "СТР 2",
  "СТР 3",

  "История A.I.M.", // Title of the page //$$

  "ОК" // Stops displaying information on selected merc
];

// AIM Home Page

export let AimScreenText: string[] /* STR16[] */ = [
  // AIM disclaimers

  "A.I.M. и логотип A.I.M.-зарегистрированные во многих странах торговые марки.",
  "Поэтому даже и не думайте нас копировать.",
  "Копирайт 1998-1999 A.I.M.,Ltd.Все права защищены.",

  // Text for an advertisement that gets displayed on the AIM page

  "Объединенные цветочные службы",
  "\"Мы сбрасываем в любои месте\"", // 10
  "Сделай как надо",
  "... первый раз",
  "Если у нас нет такого пистолета,он вам и не нужен.",
];

// Aim Home Page

export let AimBottomMenuText: string[] /* STR16[] */ = [
  // Text for the links at the bottom of all AIM pages
  "Гл.стр.",
  "Члены",
  "История", //$$
  "Принципы",
  "Журнал",
  "Ссылки",
];

// ShopKeeper Interface
// The shopkeeper interface is displayed when the merc wants to interact with
// the various store clerks scattered through out the game.

export let SKI_Text: string[] /* STR16[] */ = [
  "ИМЕЮЩИЕСЯ ТОВАРЫ", // Header for the merchandise available
  "СТР", // The current store inventory page being displayed
  "ОБЩАЯ СТОИМ", // The total cost of the the items in the Dealer inventory area
  "ОБЩАЯ ЦЕНА", // The total value of items player wishes to sell
  "ОЦЕНКА", // Button text for dealer to evaluate items the player wants to sell
  "ПЕРЕДАЧА", // Button text which completes the deal. Makes the transaction.
  "ГОТОВО", // Text for the button which will leave the shopkeeper interface.
  "СТОИМ.РЕМОНТА", // The amount the dealer will charge to repair the merc's goods
  "1 ЧАС", // SINGULAR! The text underneath the inventory slot when an item is given to the dealer to be repaired
  "%d ЧАСОВ", // PLURAL!   The text underneath the inventory slot when an item is given to the dealer to be repaired
  "ОТРЕМОНТИРОВАНО", // Text appearing over an item that has just been repaired by a NPC repairman dealer
  "Вам уже некуда класть вещи.", // Message box that tells the user there is no more room to put there stuff
  "%d МИНУТ", // The text underneath the inventory slot when an item is given to the dealer to be repaired
  "Бросьте вещи на землю.",
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
  "Взять", // Take money from the player
  "Дать", // Give money to the player
  "Отмена", // Cancel the transfer
  "Очистить", // Clear the money display
];

// Shopkeeper Interface
export let gzSkiAtmText: string[] /* STR16[] */ = [
  // Text on the bank machine panel that....
  "Select Type", // tells the user to select either to give or take from the merc
  "Введите сумму", // Enter the amount to transfer
  "Перевести деньги наемн", // Giving money to the merc
  "Забрать деньги у наемн", // Taking money from the merc
  "Недостаточно средств", // Not enough money to transfer
  "Баланс", // Display the amount of money the player currently has
];

export let SkiMessageBoxText: string[] /* STR16[] */ = [
  "Вы хотите снять %s со своего основного счета,чтобы покрыть разницу?",
  "Недостаточно денег.Не хватает %s",
  "Вы хотите снять %s со своего основного счета,чтобы покрыть стоимость?",
  "Попросить торговца начать перевод",
  "Попросить торговца починить выбр.вещи",
  "Закончить разговор",
  "Текущий баланс",
];

// OptionScreen.c

export let zOptionsText: string[] /* STR16[] */ = [
  // button Text
  "Сохранить",
  "Загрузить",
  "Выход",
  "Готово",

  // Text above the slider bars
  "Эффекты",
  "Речь",
  "Музыка",

  // Confirmation pop when the user selects..
  "Выйти из игры и вернуться в главное меню?",

  "Нужно выбрать либо РЕЧЬ, либо СУБТИТРЫ.",
];

// SaveLoadScreen
export let zSaveLoadText: string[] /* STR16[] */ = [
  "Сохранить",
  "Загрузить",
  "Отмена",
  "Сохр.выбр.",
  "Загр.выбр.",

  "Игра сохранена",
  "ОШИБКА при сохранении!",
  "Игра загружена",
  "ОШИБКА при загрузке!",

  "Сохраненная версия игры отличается от текущей.Надежнее всего продолжить.Продолжить?",
  "Файлы сохраненной игры могут быть с ошибкой.Уничтожить их все?",

// Translators, the next two strings are for the same thing.  The first one is for beta version releases and the second one
// is used for the final version.  Please don't modify the "#ifdef JA2BETAVERSION" or the "#else" or the "#endif" as they are
// used by the compiler and will cause program errors if modified/removed.  It's okay to translate the strings though.
  "Попытка загрузки старой версии. Обновить автоматически и загрузить?",

// Translators, the next two strings are for the same thing.  The first one is for beta version releases and the second one
// is used for the final version.  Please don't modify the "#ifdef JA2BETAVERSION" or the "#else" or the "#endif" as they are
// used by the compiler and will cause program errors if modified/removed.  It's okay to translate the strings though.
  "Попытка загрузки старой версии. Обновить автоматически и загрузить?",

  "Вы уверены,что хотите записать сох.игру поверх #%d?",
  "Вы хотите загрузить игру из ячейки #",

  // The first %d is a number that contains the amount of free space on the users hard drive,
  // the second is the recommended amount of free space.
  "У вас кончается дисковое пространство. Осталось всего %d Mбайт. Нужно как минимум %d свободных Mбайт.",

  "Сохранение...", // When saving a game, a message box with this string appears on the screen

  "Обычные пист.",
  "Тонны пист.",
  "Реалист.стиль",
  "Фантаст. стиль",

  "Сложн.",
];

// MapScreen
export let zMarksMapScreenText: string[] /* STR16[] */ = [
  "Уровень карты",
  "У вас нет ополчения.Надо подготовить горожан,и у вас будет городское ополчение.",
  "Доход в день",
  "У наемн.есть страховка",
  "%s не устал.",
  "%s движется и спать не может",
  "%s слишком устал,попробуйте позже.",
  "%s за рулем.",
  "Отряд не может двигаться,когда один наемн.спит.",

  // stuff for contracts
  "Вы можете платить по контракту,но у вас нет денег на страховые премии этому наемн.",
  "%s:страховая премия составит %s за %d дополн.дней.Хотите платить?",
  "Инвентарь Сектора",
  "У наемн.есть мед.депозит.",

  // other items
  "Медики", // people acting a field medics and bandaging wounded mercs
  "Пациенты", // people who are being bandaged by a medic
  "Готово", // Continue on with the game after autobandage is complete
  "Стоп", // Stop autobandaging of patients by medics now
  "Извините.Эта опция невозможна,т.к.это демо-версия.", // informs player this option/button has been disabled in the demo
  "%s:нет ремонтных принадл.",
  "%s:нет медицинских принадл.",
  "Недостаточно людей,желающих пройти подготовку.",
  "%s:много ополченцев.",
  "У наемн.конечн.контракт.",
  "Контракт наемн.не застрахован",
];

export let pLandMarkInSectorString: string[] /* STR16[] */ = [
  "Отряд %d заметил кого-то в секторе %s",
];

// confirm the player wants to pay X dollars to build a militia force in town
export let pMilitiaConfirmStrings: string[] /* STR16[] */ = [
  "Тренировка отряда город.ополч.будет стоить $", // telling player how much it will cost
  "Одобрить платеж?", // asking player if they wish to pay the amount requested
  "У вас нет денег на это.", // telling the player they can't afford to train this town
  "Продолжить тренировку ополчения в %s (%s %d)?", // continue training this town?
  "Стоит $", // the cost in dollars to train militia
  "( Д/Н )", // abbreviated yes/no
  "", // unused
  "Тренировка отряда город.ополч.в секторе %d будет стоить $ %d. %s", // cost to train sveral sectors at once
  "У вас нет $%d на тренировку город.ополчения здесь.",
  "%s:нужно %d процентов верности тебе,чтобы продолжить тренировку ополчения.",
  "В %s больше нельзя тренировать ополчение.",
];

// Strings used in the popup box when withdrawing, or depositing money from the $ sign at the bottom of the single merc panel
export let gzMoneyWithdrawMessageText: string[] /* STR16[] */ = [
  "За один раз можно брать не более $20,000.",
  "Вы уверены, что хотите положить %s на свой счет?",
];

export let gzCopyrightText: string[] /* STR16[] */ = [
  "Авторские права(C) 1999 Sir-Tech Canada Ltd. Все права защищены. Распространение на территории стран СНГ компания БУКА",
];

// option Text
export let zOptionsToggleText: string[] /* STR16[] */ = [
  "Речь",
  "Немое подтверждение", //$$
  "Субтитры",
  "Диалоги с паузами",
  "Анимированный дым",
  "Кровища",
  "Не трожь мою мышь!",
  "Старый способ выбора",
  "Показывать движения",
  "Показывать промахи",
  "Игра в реальном времени",
  "Показать индикатор врага",
  "Использовать метрич.систему",
  "Выделять наемн.во время движения",
  "Перевести курсор на наемн.",
  "Перевести курсор на двери",
  "Мерцание вещей",
  "Показать верхушки деревьев",
  "Показывать каркасы",
  "Показать трехмерный курсор",
];

// This is the help text associated with the above toggles.
export let zOptionsScreenHelpText: string[] /* STR16[] */ = [
  // speech
  "Если вы хотите услышать диалог персонажей,включите эту опцию.",

  // Mute Confirmation
  "Вкл/выкл вербальное подтверждение.",

  // Subtitles
  " whether on-screen text is displayed for dialogue.", //$$

  // Key to advance speech
  "Если субитры включены,включите также это,чтобы читать NPC диалог.",

  // Toggle smoke animation
  "Отключите эту опцию,если анимированный дым замедляет игру.",

  // Blood n Gore
  "Отключите эту опцию,если боитесь крови.",

  // Never move my mouse
  "Отключите эту опцию,чтобы курсор автоматически перемещался на всплывающее меню диалога",

  // Old selection method
  "Включите эту опцию,чтобы персонажи работали,как в предыдущей версии Jagged Alliance (иначе они будут работать по-другому).",

  // Show movement path
  "Включите эту опцию,чтобы действие происходило в реальном времени(или используйте SHIFT при отключенной опции).",

  // show misses
  "Включите эту опцию,чтобы видеть,куда попадают пули при \"промахе\".",

  // Real Time Confirmation
  "Когда опция вкл,дополн.\"безопасность\" щелчок нужен для перехода в реальное время.",

  // Display the enemy indicator
  "Когда опция вкл,количество врагов,видных наемнику,высвечивается над его портретом.",

  // Use the metric system
  "Когда опция вкл,исп.метрич.система,иначе-британская.",

  // Merc Lighted movement
  "Когда опция вкл,путь наемника обозн.светящейся линией.Отключите для быстроты.",

  // Smart cursor
  "Когда опция вкл,передвижение курсора на наемника будет его выделять.",

  // snap cursor to the door
  "Когда опция вкл,передвижение курсора на дверь будет автоматически передвигать его поверх двери.",

  // glow items
  "Когда опция вкл,вещи светятся( |I)",

  // toggle tree tops
  "Когда опция вкл,показываются верхушки деревьев.( |Е)",

  // toggle wireframe
  "Когда опция вкл,видны каркасы домов. ( |W)", //$$

  "Когда опция вкл,движущийся курсор-трехмерный.( |Home )",
];

export let gzGIOScreenText: string[] /* STR16[] */ = [
  "УСТАНОВКА НАЧАЛА ИГРЫ",
  "Стиль игры",
  "Реалистичный",
  "Фантастичный",
  "Выбор пистолетов",
  "Сотни пистолетов",
  "Нормальный",
  "Уровень сложности",
  "Легкий",
  "Нормальный",
  "Трудный",
  "Ok",
  "Отмена",
  "Дополнительная сложность",
  "Без ограничений времени",
  "Время хода ограничено",
  "Отключено в демо-версии",
];

export let pDeliveryLocationStrings: string[] /* STR16[] */ = [
  "Остен", // Austin, Texas, USA
  "Багдад", // Baghdad, Iraq (Suddam Hussein's home)
  "Драссен", // The main place in JA2 that you can receive items.  The other towns are dummy names...
  "Гон Конг", // Hong Kong, Hong Kong
  "Бейрут", // Beirut, Lebanon	(Middle East)
  "Лондон", // London, England
  "Лос Анджелес", // Los Angeles, California, USA (SW corner of USA)
  "Медуна", // Meduna -- the other airport in JA2 that you can receive items.
  "Метавира", // The island of Metavira was the fictional location used by JA1
  "Майами", // Miami, Florida, USA (SE corner of USA)
  "Москва", // Moscow, USSR
  "Нью Йорк", // New York, New York, USA
  "Оттава", // Ottawa, Ontario, Canada -- where JA2 was made!
  "Париж", // Paris, France
  "Триполи", // Tripoli, Libya (eastern Mediterranean)
  "Токио", // Tokyo, Japan
  "Ванкувер", // Vancouver, British Columbia, Canada (west coast near US border)
];

export let pSkillAtZeroWarning: string[] /* STR16[] */ = [
  // This string is used in the IMP character generation.  It is possible to select 0 ability
  // in a skill meaning you can't use it.  This text is confirmation to the player.
  "Уверен? Ноль означает отсутствие навыков.",
];

export let pIMPBeginScreenStrings: string[] /* STR16[] */ = [
  "( 8 макс. символов )",
];

export let pIMPFinishButtonText: string[] /* STR16[1] */ = [
  "Анализ",
];

export let pIMPFinishStrings: string[] /* STR16[] */ = [
  "Спасибо,%s", //%s is the name of the merc
];

// the strings for imp voices screen
export let pIMPVoicesStrings: string[] /* STR16[] */ = [
  "Голос",
];

export let pDepartedMercPortraitStrings: string[] /* STR16[] */ = [
  "Убит в бою",
  "Уволен",
  "Другое",
];

// title for program
export let pPersTitleText: string[] /* STR16[] */ = [
  "Кадры",
];

// paused game strings
export let pPausedGameText: string[] /* STR16[] */ = [
  "Пауза",
  "Возобновить (|P|a|u|s|e)",
  "Поставить на паузу (|P|a|u|s|e)",
];

export let pMessageStrings: string[] /* STR16[] */ = [
  "Выйти из игры?",
  "OK",
  "ДА",
  "НЕТ",
  "ОТМЕНА",
  "НАНЯТЬ",
  "ЛОЖЬ",
  "No description", // Save slots that don't have a description.
  "Игра сохранена",
  "Игра сохранена",
  "QuickSave", // The name of the quicksave file (filename, text reference)
  "SaveGame", // The name of the normal savegame file, such as SaveGame01, SaveGame02, etc.
  "sav", // The 3 character dos extension (represents sav)
  "..\\SavedGames", // The name of the directory where games are saved.
  "День",
  "Наемн",
  "Пустая ячейка", // An empty save game slot
  "Демо", // Demo of JA2
  "Ловля Багов", // State of development of a project (JA2) that is a debug build
  "Release", // Release build for JA2
  "пвм", // Abbreviation for Rounds per minute -- the potential # of bullets fired in a minute.
  "мин", // Abbreviation for minute.
  "м", // One character abbreviation for meter (metric distance measurement unit).
  "пули", // Abbreviation for rounds (# of bullets)
  "кг", // Abbreviation for kilogram (metric weight measurement unit)
  "ф", // Abbreviation for pounds (Imperial weight measurement unit)
  "Гл.стр", // Home as in homepage on the internet.
  "USD", // Abbreviation to US dollars
  "н/п", // Lowercase acronym for not applicable.
  "В это время", // Meanwhile
  "%s прибыл(а) в сектор %s%s", // Name/Squad has arrived in sector A9.  Order must not change without notifying
                                 // SirTech
  "Версия",
  "Пустая ячейка быстрого сохр",
  "Эта ячейка-для быстрого сохранения экранов игры (ALT+S).",
  "Открыто",
  "Закрыто",
  "У вас кончается дисковое пространство. У вас осталось %sМБ свободных,а для АЛЬЯНСА 2 требуется %sMБ.",
  "Нанят %s из AIM",
  "%s поймал %s.", //'Merc name' has caught 'item' -- let SirTech know if name comes after item.
  "%s принял лекарство.", //'Merc name' has taken the drug
  "%s не имеет меднавыков", //'Merc name' has no medical skill.

  // CDRom errors (such as ejecting CD while attempting to read the CD)
  "Нарушена целостность программы.",
  "ОШИБКА: Выньте CD-ROM",

  // When firing heavier weapons in close quarters, you may not have enough room to do so.
  "Мало места для стрельбы.",

  // Can't change stance due to objects in the way...
  "Сейчас изменить положение нельзя.",

  // Simple text indications that appear in the game, when the merc can do one of these things.
  "Уронить",
  "Бросить",
  "Передать",

  "%s передано %s.", //"Item" passed to "merc".  Please try to keep the item %s before the merc %s, otherwise,
                      // must notify SirTech.
  "Нельзя передать %s %s.", // pass "item" to "merc".  Same instructions as above.

  // A list of attachments appear after the items.  Ex:  Kevlar vest ( Ceramic Plate 'Attached )'
  " Присоединено )",

  // Cheat modes
  "Достигнут чит-уровень один",
  "Достигнут чит-уровень два",

  // Toggling various stealth modes
  "Отряд скрыт.",
  "Отряд виден.",
  "%s скрыт.",
  "%s открыт.",

  // Wireframes are shown through buildings to reveal doors and windows that can't otherwise be seen in
  // an isometric engine.  You can toggle this mode freely in the game.
  "Дополнительные Каркасы Вкл", //$$
  "Дополнительные Каркасы Выкл", //$$

  // These are used in the cheat modes for changing levels in the game.  Going from a basement level to
  // an upper level, etc.
  "Нельзя подняться с этого уровня...",
  "Ниже уровней нет...",
  "Входим в подвальный уровень %d...",
  "Уходим из подвала...",

  ".", // used in the shop keeper inteface to mark the ownership of the item eg Red's gun
  "ВЫКЛЮЧЕНО.",
  "ВКЛЮЧЕНО.",
  "3D-курсор ОТКЛ.",
  "3D-курсор ВКЛ.",
  "Отряд %d действует.",
  "У вас нет денег,чтобы ежедневно выплачивать %s %s", // first %s is the mercs name, the seconds is a string containing the salary
  "Пропуск",
  "%s не может уйти один.",
  "Игра была сохранена под именем SaveGame99.sav. При необходимости пересохраните ее под именем SaveGame01-SaveGame10 и тогда вы будете получите доступ к ней в экране Загрузка.",
  "%s выпил немного %s",
  "Багаж прибыл в Драссен.",
  "%s должен прибыть в указанное место высадки (сектор %s) в день %d,примерно в %s.", // first %s is mercs name, next is the sector location and name where they will be arriving in, lastely is the day an the time of arrival
  "История обновлена.",
];

export let ItemPickupHelpPopup: string[] /* UINT16[][40] */ = [
  "OK",
  "Листать вверх",
  "Выделить все",
  "Листать вниз",
  "Отмена",
];

export let pDoctorWarningString: string[] /* STR16[] */ = [
  "%s слишком далеко,чтобы его можно было лечить.",
  "Медики не могут перевязать всех.",
];

export let pMilitiaButtonsHelpText: string[] /* STR16[] */ = [
  "Взять новичков(Правый щелчок)/Отвергнуть(Левый щелчок)", // button help text informing player they can pick up or drop militia with this button
  "Взять постоянные войска(Правый щелчок)/Отвергнуть(Левый щелчок)",
  "Взять войска ветеранов(Правый щелчок)/Отвергнуть(Левый щелчок)",
  "Равномерно распределить доступное ополчение по всем секторам",
];

export let pMapScreenJustStartedHelpText: string[] /* STR16[] */ = [
  "Иди в АIM и нанять наемников (*Подсказка* в лаптопе)", // to inform the player to hired some mercs to get things going
  "Если вы готовы отправиться в Арулько,щелкните по кнопке Компрессия времени в правом нижнем углу экрана.", // to inform the player to hit time compression to get the game underway
];

export let pAntiHackerString: string[] /* STR16[] */ = [
  "Ошибка.Испорченные или отсутствующие файлы.Вы выходите из игры.",
];

export let gzLaptopHelpText: string[] /* STR16[] */ = [
  // Buttons:
  "Просмотреть почту",
  "Пролистать web страницы",
  "Просмотреть файлы и аттачменты.",
  "Прочитать последние события",
  "Информация о команде",
  "Просмотреть финансовое заключение и журнал",
  "Закрыть лаптоп",

  // Bottom task bar icons (if they exist):
  "Новое сообщение",
  "Новые файлы",

  // Bookmarks:
  "Международная Ассоциация Наемников",
  "Бобби Рэй-заказ оружия в сети",
  "Институт Психологии Наемников",
  "Рекрутинговый Центр",
  "Морг Мак Гилликути",
  "Объединенная цветочная служба",
  "Страховые агенты по контрактам A.I.M.",
];

export let gzHelpScreenText: string[] /* STR16[] */ = [
  "Выход из экрана помощь",
];

export let gzNonPersistantPBIText: string[] /* STR16[] */ = [
  "Идет бой. Вы можете только покинуть экран битвы.",
  "Войти в сектор, чтобы продолжить бой( |E).",
  "Автоматически остановить текущую битву ( |A).",
  "Нельзя автоматически остановить битву, когда ты нападаешь.",
  "Нельзя автоматически остановить битву,когда на тебя напали.",
  "Нельзя автоматически остановить битву,когда дерешься с существами в шахтах.",
  "Нельзя автоматически остановить битву,если поблизости враждебные жители.",
  "Нельзя автоматически остановить битву,если поблизости кошки-убийцы.",
  "ИДЕТ БОЙ",
  "Сейчас отступать нельзя.",
];

export let gzMiscString: string[] /* STR16[] */ = [
  "Ваше ополчение дерется без помощи наемников...",
  "Машине пока не нужно заправляться.",
  "Бензобак полон на %d%%.",
  "Армия Дейдранны полностью контролирует территорию %s.",
  "Вы потеряли заправку.",
];

export let gzIntroScreen: string[] /* STR16[] */ = [
  "Невозможно найти вступительный ролик",
];

// These strings are combined with a merc name, a volume string (from pNoiseVolStr),
// and a direction (either "above", "below", or a string from pDirectionStr) to
// report a noise.
// e.g. "Sidney hears a loud sound of MOVEMENT coming from the SOUTH."
export let pNewNoiseStr: string[] /* STR16[] */ = [
  "%s слышит %s звук, идущий с %sА.",
  "%s слышит %s звук ДВИЖЕНИЯ, идущий с %sА.",
  "%s слышит %s СКРИП, идущий с %sА.",
  "%s слышит %s ПЛЕСК, идущий с %sА.",
  "%s слышит %s УДАР, идущий с %sА.", //$$
  "%s слышит %s ВЗРЫВ на %sЕ.",
  "%s слышит %s КРИК с %sА.",
  "%s слышит %s УДАР с %sА.",
  "%s слышит %s УДАР с %sА.",
  "%s слышит %s ЗВОН, идущий с %sА.",
  "%s слышит %s ГРОХОТ, идущий  %sА.",
];

export let wMapScreenSortButtonHelpText: string[] /* STR16[] */ = [
  "Сортировка по имени (|F|1)",
  "Сортировка по назн. (|F|2)",
  "Сортировка по сну (|F|3)",
  "Сортировка по месту (|F|4)",
  "Сортировка по месту назн.(|F|5)",
  "Сортировка по времени контракта (|F|6)",
];

export let BrokenLinkText: string[] /* STR16[] */ = [
  "Ошибка 404",
  "URL не найден.",
];

export let gzBobbyRShipmentText: string[] /* STR16[] */ = [
  "Посл.поступления",
  "Заказ #",
  "Количество",
  "Заказано",
];

export let gzCreditNames: string[] /* STR16[] */ = [
  "Chris Camfield",
  "Shaun Lyng",
  "Kris Mornes",
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
  "Ведущий программист игры", // Chris Camfield !!!
  "Дизайн/Сценарий", // Shaun Lyng
  "Программист стратегической части и Редактора", // Kris Marnes
  "Продюсер/Дизайн", // Ian Currie
  "Дизайн/Дизайн карт", // Linda Currie
  "Художник", // Eric \"WTF\" Cheng
  "Бета-Координатор, фин.поддержка", // Lynn Holowka
  "Главный художник", // Norman \"NRG\" Olsen
  "Мастер по звуку", // George Brooks
  "Дизайн экрана/Художник", // Andrew Stacey
  "Главный художник/Анимация", // Scot Loving
  "Главный программист", // Andrew \"Big Cheese Doddle\" Emmons
  "Программист", // Dave French
  "Программист стратегической части и баланса игры", // Alex Meduna
  "Художник по портретам", // Joey \"Joeker\" Whelan",
];

export let gzCreditNameFunny: string[] /* STR16[] */ = [
  "", // Chris Camfield
  "(все еще зубрит правила пунктуации)", // Shaun Lyng
  "(\"Готово. Я просто чиню\")", // Kris \"The Cow Rape Man\" Marnes
  "(он уже слишком стар для этого)", // Ian Currie
  "(работает над Wizardry 8)", // Linda Currie
  "(тестировал по дулом пистолета)", // Eric \"WTF\" Cheng
  "(Ушла от нас в CFSA - скатертью дорожка...)", // Lynn Holowka
  "", // Norman \"NRG\" Olsen
  "", // George Brooks
  "(Мертвая Голова и любитель джаза)", // Andrew Stacey
  "(его настоящее имя Роберт)", // Scot Loving
  "(единственное ответственное лицо)", // Andrew \"Big Cheese Doddle\" Emmons
  "(может опять заняться мотогонками)", // Dave French
  "(украден с работы над Wizardry 8)", // Alex Meduna
  "(строил предметы и загрузочные экраны!)", // Joey \"Joeker\" Whelan",
];

export let sRepairsDoneString: string[] /* STR16[] */ = [
  "%s закончил ремонт своих вещей",
  "%s закончил ремонтировать все оружие и броню",
  "%s закончил ремонтировать все снаряжение",
  "%s закончил ремонтировать все транспортируемые вещи",
];

export let zGioDifConfirmText: string[] /* STR16[] */ = [
  "Вы выбрали ЛЕГКИЙ режим. Это подходит для новичков в Jagged Alliance 'Агония Власти', для новичков в жанре стратегий, или для тех, кто желает сократить битвы в игре. Ваш выбор скажется на игре в целом, так что выбирайте с умом. Вы уверены, что хотите играть в Легком режиме?",
  "Вы выбрали НОРМАЛЬНЫЙ режим. Это подходит для всех тех, кто уже знаком с Jagged Alliance 'Агония Власти' или с подобными играми. Ваш выбор скажется на игре в целом, так что выбирайте с умом. Вы уверены, что хотите играть в Нормальном режиме?",
  "Вы выбрали ТРУДНЫЙ режим. Мы Вас предупреждаем. Нечего на нас пенять, если вас доставят назад в цинковом гробу. Ваш выбор скажется на игре в целом, так что выбирайте с умом. Вы уверены, что хотите играть в Трудном режиме?",
];

export let gzLateLocalizedString: string[] /* STR16[] */ = [
  "%S файл для загрузки экрана не найден...",

  // 1-5
  "Робот не может покинуть сектор,т.к.некому управлять им.",

  // This message comes up if you have pending bombs waiting to explode in tactical.
  "Сейчас сжимать время нельзя.Подождите фейерверка!",

  //'Name' refuses to move.
  "%s отказывается двигаться.",

  //%s a merc name
  "%s:недостаточно энергии,чтобы поменять положение.",

  // A message that pops up when a vehicle runs out of gas.
  "%s:кончилось топливо и он остается в %c%d.",

  // 6-10

  // the following two strings are combined with the pNewNoise[] strings above to report noises
  // heard above or below the merc
  "над",
  "под",

  // The following strings are used in autoresolve for autobandaging related feedback.
  "Ни у кого из ваших наемников нет меднавыков.",
  "Нет материала для перевязок.",
  "Не хватает материалов,чтобы перевязать всех.",
  "Перевязывать ваших наемников не нужно.",
  "Перевязывать наемников автоматически.",
  "Все наемники перевязаны.",

  // 14
  "Арулько",

  "(roof)",

  "Здоровье: %d/%d",

  // In autoresolve if there were 5 mercs fighting 8 enemies the text would be "5 vs. 8"
  //"vs." is the abbreviation of versus.
  "%d против %d",

  "%s полон!", //(ex "The ice cream truck is full")

  "%s нуждается не в перевязке и первой помощи, а в серьезном медицинском обследовании и/или отдыхе.",

  // 20
  // Happens when you get shot in the legs, and you fall down.
  "%s ранен в ногу и без сознания!",
  // Name can't speak right now.
  "%s сейчас говорить не может.",

  // 22-24 plural versions @@@2 elite to veteran
  "%d новички стали ветеранами.",
  "%d новички стали постояным ополчением.",
  "%d постоянное ополчение стало ветеранами.",

  // 25
  "Перекл.",

  // 26
  // Name has gone psycho -- when the game forces the player into burstmode (certain unstable characters)
  "%s двинулся умом!",

  // 27-28
  // Messages why a player can't time compress.
  "Сейчас опасно сжимать время, поскольку у вас есть наемники в секторе %s.", //
  "Опасно сжимать время, когда наемники находятся в шахтах с существами.", //

  // 29-31 singular versions @@@2 elite to veteran
  "1 новичок стал ветеранами.",
  "1 новичок стал постоянным ополчением.",
  "1 постоянное ополчение стало заслуженным.",

  // 32-34
  "%s ничего не говорит.",
  "Выбираться на поверхность?",
  "(Отряд %d)",

  // 35
  // Ex: "Red has repaired Scope's MP5K".  Careful to maintain the proper order (Red before Scope, Scope before MP5K)
  "%s починил %s %s",

  // 36
  "КОШКА-УБИЙЦА",

  // 37-38 "Name trips and falls"
  "%s падает",
  "Эту вещь отсюда брать нельзя.",

  // 39
  "Никто из оставшихся наемн.не может драться.Ополчение сразится с существами само.",

  // 40-43
  //%s is the name of merc.
  "%s:медикаменты кончились!",
  "%s не обладает навыками,чтобы лечить кого-либо!",
  "%s:кончились инструменты!",
  "%s не обладает навыками,чтобы ремонтировать что-либо!",

  // 44-45
  "Время ремонта",
  "%s Не может увидеть этого человека.",

  // 46-48
  "%s'. Барабан его пистолета сломан!",
  "Не разрешается больше %d тренеров ополчения на сектор.",
  "Уверен?",

  // 49-50
  "Компрессия времени",
  "Бак теперь заправлен.",

  // 51-52 Fast help text in mapscreen.
  "Продолжить компрессию времени (|S|p|a|c|e)",
  "Прекратить компрессию времени (|E|s|c)",

  // 53-54 "Magic has unjammed the Glock 18" or "Magic has unjammed Raven's H&K G11"
  "%s исправил(а) %s",
  "%s исправил(а) %s (%s)",

  // 55
  "Невозможно сжимать время при просмотре содержимого сектора.",

  "CD Агония Власти не найден. Программа выходит в ОС.",

  "Предметы успешно совмещены.",

  // 58
  // Displayed with the version information when cheats are enabled.
  "Текущий/Максимальный: %d%%/%d%%",

  // 59
  "Сопроводить Джона и Мэри?",

  "Выключатель нажат.",
];
