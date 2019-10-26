export const CHECKF = (exp) => {
  if (!(exp)) {
    return (false);
  }
};
export const CHECKV = (exp) => {
  if (!(exp)) {
    return;
  }
};
export const CHECKN = (exp) => {
  if (!(exp)) {
    return (null);
  }
};
const CHECKBI = (exp) => {
  if (!(exp)) {
    return (-1);
  }
};

const CHECKASSERTF = (exp) => {
  if (!(exp)) {
    ASSERT(0);
    return (false);
  }
};
const CHECKASSERTV = (exp) => {
  if (!(exp)) {
    ASSERT(0);
    return;
  }
};
const CHECKASSERTN = (exp) => {
  if (!(exp)) {
    ASSERT(0);
    return (null);
  }
};
const CHECKASSERTBI = (exp) => {
  if (!(exp)) {
    ASSERT(0);
    return (-1);
  }
};
