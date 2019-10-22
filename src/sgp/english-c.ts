// The gsKeyTranslationTable is used to return KEY values on the basis of the virtual key code and
// SHIFT/ALT/CTRL key states. Range 0-255 is for normal keys, 256-511 is when SHIFT is pressed
// 512-767 is when ALT is pressed and 768-1023 is when CTRL is pressed. This table should be modified
// during translation

let gsKeyTranslationTable: UINT16[] /* [1024] */ = [
  0, //
  1, //
  2, //
  3, //
  4, //
  5, //
  6, //
  7, //
  8, // BACK
  9, // TAB
  10, //
  11, //
  12, //
  13, // ENTER
  14, //
  15, //
  16, // SHIFT
  17, // CTRL
  18, // ALT
  19, // PAUSE
  20, // CAPS
  21, //
  22, //
  23, //
  24, //
  25, //
  26, //
  27, // ESC
  28, //
  29, //
  30, //
  31, //
  32, // SPACE
  33, //
  34, //
  35, //
  36, //
  37, //
  38, //
  39, //
  40, //
  41, //
  42, //
  43, //
  44, //
  45, //
  46, //
  47, //
  48, // 0
  49, // 1
  50, // 2
  51, // 3
  52, // 4
  53, // 5
  54, // 6
  55, // 7
  56, // 8
  57, // 9
  58, //
  59, //
  60, //
  61, //
  62, //
  63, //
  64, //
  97, // a
  98, // b
  99, // c
  100, // d
  101, // e
  102, // f
  103, // g
  104, // h
  105, // i
  106, // j
  107, // k
  108, // l
  109, // m
  110, // n
  111, // o
  112, // p
  113, // q
  114, // r
  115, // s
  116, // t
  117, // u
  118, // v
  119, // w
  120, // x
  121, // y
  122, // z
  91, //
  92, //
  93, //
  94, //
  95, //
  96, //
  97, //
  98, //
  99, //
  100, //
  101, //
  102, //
  103, //
  104, //
  105, //
  42, // NUM_TIMES
  43, // NUM_PLUS
  108, //
  45, // NUM_MINUS
  110, //
  47, // NUM_SLASH
  124, // F1
  125, // F2
  126, // F3
  127, // F4
  128, // F5
  129, // F6
  130, // F7
  131, // F8
  132, // F9
  133, // F10
  134, // F11
  135, // F12
  124, //
  125, //
  126, //
  127, //
  128, //
  129, //
  130, //
  131, //
  132, //
  133, //
  134, //
  135, //
  136, //
  137, //
  138, //
  139, //
  140, //
  141, //
  142, //
  143, //
  144, // NUM_LOCK
  145, // SCRL
  146, //
  147, //
  148, //
  149, //
  150, //
  151, //
  152, //
  153, //
  154, //
  155, //
  156, //
  157, //
  158, //
  159, //
  160, //
  161, //
  162, //
  163, //
  164, //
  165, //
  166, //
  167, //
  168, //
  169, //
  170, //
  171, //
  172, //
  173, //
  174, //
  175, //
  176, //
  177, //
  178, //
  179, //
  180, //
  181, //
  182, //
  183, //
  184, //
  185, //
  59, // ;
  61, // =
  44, // ,
  45, // -
  46, // .
  47, // slash
  96, // `
  193, //
  194, //
  195, //
  196, //
  197, //
  198, //
  199, //
  200, //
  201, //
  202, //
  203, //
  204, //
  205, //
  206, //
  207, //
  208, //
  209, //
  210, //
  211, //
  212, //
  213, //
  214, //
  215, //
  216, //
  217, //
  218, //
  91, // [
  92, // back slash
  93, // ]
  39, // '
  48, // NUM_0 (ON)
  46, // NUM_PERIOD (ON)
  49, // NUM_1 (ON)
  50, // NUM_2 (ON)
  51, // NUM_3 (ON)
  52, // NUM_4 (ON)
  53, // NUM_5 (ON)
  54, // NUM_6 (ON)
  55, // NUM_7 (ON)
  56, // NUM_8 (ON)
  57, // NUM_9 (ON)
  245, // NUM_0 (OFF)
  246, // NUM_PERIOD (OFF)
  247, // NUM_1 (OFF)
  248, // NUM_2 (OFF)
  249, // NUM_3 (OFF)
  250, // NUM_4 (OFF)
  0, // NUM_5 (OFF)
  251, // NUM_6 (OFF)
  252, // NUM_7 (OFF)
  253, // NUM_8 (OFF)
  254, // NUM_9 (OFF)
  245, // INS
  246, // DEL
  247, // END
  248, // DOWN
  249, // PGDN
  250, // LEFT
  251, // RIGHT
  252, // HOME
  253, // UP
  254, // PGUP
  255, //
  256, //
  257, //
  258, //
  259, //
  260, //
  261, //
  262, //
  263, //
  8, // BACK
  265, // TAB
  266, //
  267, //
  268, //
  13, // ENTER
  270, //
  271, //
  16, // SHIFT
  17, // CTRL
  18, // ALT
  19, // PAUSE
  20, // CAPS
  277, //
  278, //
  279, //
  280, //
  281, //
  282, //
  27, // ESC
  284, //
  285, //
  286, //
  287, //
  32, // SPACE
  289, //
  290, //
  291, //
  292, //
  293, //
  294, //
  295, //
  296, //
  297, //
  298, //
  299, //
  300, //
  301, //
  302, //
  303, //
  41, // )
  33, // !
  64, // @
  35, // #
  36, // $
  37, // %
  94, // ^
  38, // &
  42, // *
  40, // (
  314, //
  315, //
  316, //
  317, //
  318, //
  319, //
  320, //
  65, // A
  66, // B
  67, // C
  68, // D
  69, // E
  70, // F
  71, // G
  72, // H
  73, // I
  74, // J
  75, // K
  76, // L
  77, // M
  78, // N
  79, // O
  80, // P
  81, // Q
  82, // R
  83, // S
  84, // T
  85, // U
  86, // V
  87, // W
  88, // X
  89, // Y
  90, // Z
  347, //
  348, //
  349, //
  350, //
  351, //
  352, //
  353, //
  354, //
  355, //
  356, //
  357, //
  358, //
  359, //
  360, //
  361, //
  42, // NUM_TIMES
  43, // NUM_PLUS
  364, //
  45, // NUM_MINUS
  366, //
  47, // NUM_SLASH
  368, // SHIFT-F1
  369, // SHIFT-F2
  370, // SHIFT-F3
  371, // SHIFT-F4
  372, // SHIFT-F5
  373, // SHIFT-F6
  374, // SHIFT-F7
  375, // SHIFT-F8
  376, // SHIFT-F9
  377, // SHIFT-F10
  378, // SHIFT-F11
  379, // SHIFT-F12
  380, //
  381, //
  382, //
  383, //
  384, //
  385, //
  386, //
  387, //
  388, //
  389, //
  390, //
  391, //
  392, //
  393, //
  394, //
  395, //
  396, //
  397, //
  398, //
  399, //
  144, // NUM_LOCK
  145, // SCRL
  402, //
  403, //
  404, //
  405, //
  406, //
  407, //
  408, //
  409, //
  410, //
  411, //
  412, //
  413, //
  414, //
  415, //
  416, //
  417, //
  418, //
  419, //
  420, //
  421, //
  422, //
  423, //
  424, //
  425, //
  426, //
  427, //
  428, //
  429, //
  430, //
  431, //
  432, //
  433, //
  434, //
  435, //
  436, //
  437, //
  438, //
  439, //
  440, //
  441, //
  58, // :
  43, // +
  60, // <
  95, // _
  62, // >
  63, // ?
  126, // ~
  449, //
  450, //
  451, //
  452, //
  453, //
  454, //
  455, //
  456, //
  457, //
  458, //
  459, //
  460, //
  461, //
  462, //
  463, //
  464, //
  465, //
  466, //
  467, //
  468, //
  469, //
  470, //
  471, //
  472, //
  473, //
  474, //
  123, // {
  124, // |
  125, // }
  34, // "
  48, // NUM_0 (ON)
  46, // NUM_PERIOD (ON)
  49, // NUM_1 (ON)
  50, // NUM_2 (ON)
  51, // NUM_3 (ON)
  52, // NUM_4 (ON)
  53, // NUM_5 (ON)
  54, // NUM_6 (ON)
  55, // NUM_7 (ON)
  56, // NUM_8 (ON)
  57, // NUM_9 (ON)
  501, // SHIFT-NUM_0 (OFF)
  502, // SHIFT-NUM_PERIOD (OFF)
  503, // SHIFT-NUM_1 (OFF)
  504, // SHIFT-NUM_2 (OFF)
  505, // SHIFT-NUM_3 (OFF)
  506, // SHIFT-NUM_4 (OFF)
  0, // SHIFT-NUM_5 (OFF)
  507, // SHIFT-NUM_6 (OFF)
  508, // SHIFT-NUM_7 (OFF)
  509, // SHIFT-NUM_8 (OFF)
  510, // SHIFT-NUM_9 (OFF)
  501, // SHIFT-INS
  502, // SHIFT-DEL
  503, // SHIFT-END
  504, // SHIFT-DOWN
  505, // SHIFT-PGDN
  506, // SHIFT-LEFT
  507, // SHIFT-RIGHT
  508, // SHIFT-HOME
  509, // SHIFT-UP
  510, // SHIFT-PGUP
  511, //
  512, //
  513, //
  514, //
  515, //
  516, //
  517, //
  518, //
  519, //
  8, // BACK
  521, // TAB
  522, //
  523, //
  524, //
  13, // ENTER
  526, //
  527, //
  16, // SHIFT
  17, // CTRL
  18, // ALT
  19, // PAUSE
  20, // CAPS
  533, //
  534, //
  535, //
  536, //
  537, //
  538, //
  27, // ESC
  540, //
  541, //
  542, //
  543, //
  32, // SPACE
  545, //
  546, //
  547, //
  548, //
  549, //
  550, //
  551, //
  552, //
  553, //
  554, //
  555, //
  556, //
  557, //
  558, //
  559, //
  560, //
  561, //
  562, //
  563, //
  564, //
  565, //
  566, //
  567, //
  568, //
  569, //
  570, //
  571, //
  572, //
  573, //
  574, //
  575, //
  576, //
  577, //
  578, //
  579, //
  580, //
  581, //
  582, //
  583, //
  584, //
  585, //
  586, //
  587, //
  588, //
  589, //
  590, //
  591, //
  592, //
  593, //
  594, //
  595, //
  596, //
  597, //
  598, //
  599, //
  600, //
  601, //
  602, //
  603, //
  604, //
  605, //
  606, //
  607, //
  608, //
  609, //
  610, //
  611, //
  612, //
  613, //
  614, //
  615, //
  616, //
  617, //
  42, // NUM_TIMES
  43, // NUM_PLUS
  620, //
  45, // NUM_MINUS
  622, //
  47, // NUM_SLASH
  624, // ALT-F1
  625, // ALT-F2
  626, // ALT-F3
  627, // ALT-F4
  628, // ALT-F5
  629, // ALT-F6
  630, // ALT-F7
  631, // ALT-F8
  632, // ALT-F9
  633, // ALT-F10
  634, // ALT-F11
  635, // ALT-F12
  636, //
  637, //
  638, //
  639, //
  640, //
  641, //
  642, //
  643, //
  644, //
  645, //
  646, //
  647, //
  648, //
  649, //
  650, //
  651, //
  652, //
  653, //
  654, //
  655, //
  144, // NUM_LOCK
  145, // SCRL
  658, //
  659, //
  660, //
  661, //
  662, //
  663, //
  664, //
  665, //
  666, //
  667, //
  668, //
  669, //
  670, //
  671, //
  672, //
  673, //
  674, //
  675, //
  676, //
  677, //
  678, //
  679, //
  680, //
  681, //
  682, //
  683, //
  684, //
  685, //
  686, //
  687, //
  688, //
  689, //
  690, //
  691, //
  692, //
  693, //
  694, //
  695, //
  696, //
  697, //
  698, //
  699, //
  700, //
  701, //
  702, //
  703, //
  704, //
  705, //
  706, //
  707, //
  708, //
  709, //
  710, //
  711, //
  712, //
  713, //
  714, //
  715, //
  716, //
  717, //
  718, //
  719, //
  720, //
  721, //
  722, //
  723, //
  724, //
  725, //
  726, //
  727, //
  728, //
  729, //
  730, //
  731, //
  732, //
  733, //
  734, //
  48, // NUM_0 (ON)
  46, // NUM_PERIOD (ON)
  49, // NUM_1 (ON)
  50, // NUM_2 (ON)
  51, // NUM_3 (ON)
  52, // NUM_4 (ON)
  53, // NUM_5 (ON)
  54, // NUM_6 (ON)
  55, // NUM_7 (ON)
  56, // NUM_8 (ON)
  57, // NUM_9 (ON)
  757, // ALT-NUM_0 (OFF)
  758, // ALT-NUM_PERIOD (OFF)
  759, // ALT-NUM_1 (OFF)
  760, // ALT-NUM_2 (OFF)
  761, // ALT-NUM_3 (OFF)
  762, // ALT-NUM_4 (OFF)
  0, // ALT-NUM_5 (OFF)
  763, // ALT-NUM_6 (OFF)
  764, // ALT-NUM_7 (OFF)
  765, // ALT-NUM_8 (OFF)
  766, // ALT-NUM_9 (OFF)
  757, // ALT-INS
  758, // ALT-DEL
  759, // ALT-END
  760, // ALT-DOWN
  761, // ALT-PGDN
  762, // ALT-LEFT
  763, // ALT-RIGHT
  764, // ALT-HOME
  765, // ALT-UP
  766, // ALT-PGUP
  767, //
  768, //
  769, //
  770, //
  771, //
  772, //
  773, //
  774, //
  775, //
  8, // BACK
  777, // TAB
  778, //
  779, //
  780, //
  13, // ENTER
  782, //
  783, //
  16, // SHIFT
  17, // CTRL
  18, // ALT
  19, // PAUSE
  20, // CAPS
  789, //
  790, //
  791, //
  792, //
  793, //
  794, //
  27, // ESC
  796, //
  797, //
  798, //
  799, //
  32, // SPACE
  801, //
  802, //
  803, //
  804, //
  805, //
  806, //
  807, //
  808, //
  809, //
  810, //
  811, //
  812, //
  813, //
  814, //
  815, //
  816, //
  817, //
  818, //
  819, //
  820, //
  821, //
  822, //
  823, //
  824, //
  825, //
  826, //
  827, //
  828, //
  829, //
  830, //
  831, //
  832, //
  833, //
  834, //
  835, //
  836, //
  837, //
  838, //
  839, //
  840, //
  841, //
  842, //
  843, //
  844, //
  845, //
  846, //
  847, //
  848, //
  849, //
  850, //
  851, //
  852, //
  853, //
  854, //
  855, //
  856, //
  857, //
  858, //
  859, //
  860, //
  861, //
  862, //
  863, //
  864, //
  865, //
  866, //
  867, //
  868, //
  869, //
  870, //
  871, //
  872, //
  873, //
  42, // NUM_TIMES
  43, // NUM_PLUS
  876, //
  45, // NUM_MINUS
  878, //
  47, // NUM_SLASH
  880, // CTRL-F1
  881, // CTRL-F2
  882, // CTRL-F3
  883, // CTRL-F4
  884, // CTRL-F5
  885, // CTRL-F6
  886, // CTRL-F7
  887, // CTRL-F8
  888, // CTRL-F9
  889, // CTRL-F10
  890, // CTRL-F11
  891, // CTRL-F12
  892, //
  893, //
  894, //
  895, //
  896, //
  897, //
  898, //
  899, //
  900, //
  901, //
  902, //
  903, //
  904, //
  905, //
  906, //
  907, //
  908, //
  909, //
  910, //
  911, //
  144, // NUM_LOCK
  145, // SCRL
  914, //
  915, //
  916, //
  917, //
  918, //
  919, //
  920, //
  921, //
  922, //
  923, //
  924, //
  925, //
  926, //
  927, //
  928, //
  929, //
  930, //
  931, //
  932, //
  933, //
  934, //
  935, //
  936, //
  937, //
  938, //
  939, //
  940, //
  941, //
  942, //
  943, //
  944, //
  945, //
  946, //
  947, //
  948, //
  949, //
  950, //
  951, //
  952, //
  953, //
  954, //
  955, //
  956, //
  957, //
  958, //
  959, //
  960, //
  961, //
  962, //
  963, //
  964, //
  965, //
  966, //
  967, //
  968, //
  969, //
  970, //
  971, //
  972, //
  973, //
  974, //
  975, //
  976, //
  977, //
  978, //
  979, //
  980, //
  981, //
  982, //
  983, //
  984, //
  985, //
  986, //
  987, //
  988, //
  989, //
  990, //
  48, // NUM_0 (ON)
  46, // NUM_PERIOD (ON)
  49, // NUM_1 (ON)
  50, // NUM_2 (ON)
  51, // NUM_3 (ON)
  52, // NUM_4 (ON)
  53, // NUM_5 (ON)
  54, // NUM_6 (ON)
  55, // NUM_7 (ON)
  56, // NUM_8 (ON)
  57, // NUM_9 (ON)
  1013, // CTRL-NUM_0 (OFF)
  1014, // CTRL-NUM_PERIOD (OFF)
  1015, // CTRL-NUM_1 (OFF)
  1016, // CTRL-NUM_2 (OFF)
  1017, // CTRL-NUM_3 (OFF)
  1018, // CTRL-NUM_4 (OFF)
  0, // CTRL-NUM_5 (OFF)
  1019, // CTRL-NUM_6 (OFF)
  1020, // CTRL-NUM_7 (OFF)
  1021, // CTRL-NUM_8 (OFF)
  1022, // CTRL-NUM_9 (OFF)
  1013, // CTRL-INS
  1014, // CTRL-DEL
  1015, // CTRL-END
  1016, // CTRL-DOWN
  1017, // CTRL-PGDN
  1018, // CTRL-LEFT
  1019, // CTRL-RIGHT
  1020, // CTRL-HOME
  1021, // CTRL-UP
  1022, // CTRL-PGUP
  1023, // CURSOR
];
