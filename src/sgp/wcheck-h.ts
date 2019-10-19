const CHECKF = (exp) => {
  if (!(exp)) {
    return (FALSE);
  }
};
const CHECKV = (exp) => {
  if (!(exp)) {
    return;
  }
};
const CHECKN = (exp) => {
  if (!(exp)) {
    return (NULL);
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
    return (FALSE);
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
    return (NULL);
  }
};
const CHECKASSERTBI = (exp) => {
  if (!(exp)) {
    ASSERT(0);
    return (-1);
  }
};
