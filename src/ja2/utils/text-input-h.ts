// AUTHOR:  Kris Morness
// Intended for inclusion with SGP.

// NEW CHANGES:  January 16, 1998
// I have added the ability to stack the text input modes.  So, if you have a particular
// screen that has fields, then somehow, hit a key to go into another mode with text input,
// it will automatically disable the current fields, as you go on to define new ones.  Previously,
// you would have to make sure the mode was removed before initializing a new one.  There were
// potential side effects of crashes, and unpredictable results, as the new fields would cook the
// existing ones.
// NOTE:  You may have to modify you code now, so that you don't accidentally kill a text input mode
// when you don't one to begin with.  (like removing an already deleted button).  Also, remember that
// this works like a stack system and you can't flip through existing defined text input modes at will.

// NOTES ON LIMITATIONS:
//	-max number of fields 255 (per level)
//  -max num of chars in field 255

// These are the definitions for the input types.  I didn't like the input filter idea,
// and the lack of freedom it gives you.  This method is much simpler to use.
// NOTE:  Uppercase/lowercase filters ensures that all input is either all uppercase or lowercase
// NOTE:  Feel free to expand this to your needs, though you also need to support it in the filter
//			 section.
const INPUTTYPE_NUMERICSTRICT = 0x0001; // 0-9 only, no minus signs.
const INPUTTYPE_ALPHA = 0x0002; // a-z A-Z
const INPUTTYPE_SPACES = 0x0004; // allows spaces in input
const INPUTTYPE_SPECIAL = 0x0008; //  !@#$%^&*()_+`|\[]{};':"<>,./? (spaces not included)
const INPUTTYPE_UPPERCASE = 0x0010; // converts all lowercase to uppercase
const INPUTTYPE_LOWERCASE = 0x0020; // converts all uppercase to lowercase
const INPUTTYPE_FIRSTPOSMINUS = 0x0002; // allows '-' at beginning of field only
const INPUTTYPE_NUMERIC = (INPUTTYPE_NUMERIC | INPUTTYPE_FIRSTPOSMINUS);
const INPUTTYPE_SPECIALCHARS = (INPUTTYPE_SPECIAL | INPUTTYPE_SPACES);
const INPUTTYPE_ALPHANUMERIC = (INPUTTYPE_ALPHA | INPUTTYPE_NUMERICSTRICT);
const INPUTTYPE_ASCII = (INPUTTYPE_ALPHANUMERIC | INPUTTYPE_SPECIALCHARS);

// DON'T GO ABOVE INPUTTYPE_EXCLUSIVE_BASEVALUE FOR INPUTTYPE MASKED VALUES LISTED ABOVE!!!
const INPUTTYPE_EXCLUSIVE_BASEVALUE = 0x1000; // increase this value if necessary

// Exclusive handlers
// The dosfilename inputtype is a perfect example of what is a exclusive handler.
// In this method, the input accepts only alphas and an underscore as the first character,
// then alphanumerics afterwards.  For further support, chances are you'll want to treat it
// as an exclusive handler, and you'll have to process it in the filter input function.
const enum Enum383 {
  INPUTTYPE_EXCLUSIVE_DOSFILENAME = INPUTTYPE_EXCLUSIVE_BASEVALUE,
  INPUTTYPE_EXCLUSIVE_COORDINATE,
  INPUTTYPE_EXCLUSIVE_24HOURCLOCK,
  // INPUTTYPE_EXCLUSIVE_NEWNEWNEW, etc...
}

// A hybrid version of InitTextInput() which uses a specific scheme.  JA2's editor uses scheme 1, so
// feel free to add new color/font schemes.
const enum Enum384 {
  DEFAULT_SCHEME,
}

// This allows you to insert special processing functions and modes that can't be determined here.  An example
// would be a file dialog where there would be a file list.  This file list would be accessed using the Win95
// convention by pressing TAB.  In there, your key presses would be handled differently and by adding a userinput
// field, you can make this hook into your function to accomplish this.  In a filedialog, alpha characters
// would be used to jump to the file starting with that letter, and setting the field in the text input
// field.  Pressing TAB again would place you back in the text input field.  All of that stuff would be handled
// externally, except for the TAB keys.
type INPUT_CALLBACK = (a: UINT8, b: BOOLEAN) => void;
// INPUT_CALLBACK explanation:
// The function must use this signature:  void FunctionName( UINT8 ubFieldID, BOOLEAN fEntering );
// ubFieldID contains the fieldID of that field
// fEntering is true if you are entering the user field, false if exiting.
