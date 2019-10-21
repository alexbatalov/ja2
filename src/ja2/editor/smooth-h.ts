const ONELEVELTYPEONEROOF = 1;
const ONELEVELTYPETWOROOF = 2;

//   Area (pointer to SGP rect) +
//      Location to check-+--|  |       |---- Check left and right edges -----|    |---- Check top and bottom edges -----|
const IsLocationInArea = (x, y, r) => (((x) >= r->iLeft) && ((x) <= r->iRight) && ((y) >= r->iTop) && ((y) <= r->iBottom));
