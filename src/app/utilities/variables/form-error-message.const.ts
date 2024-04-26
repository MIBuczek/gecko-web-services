const formErrorMessageConst: {[x: string]: {[x: string]: string}} = {
  pl: {
    required: 'Pole jest obowiązkowe',
    minlength: 'Minimalna ilość znaktów to',
    maxlength: 'Maksymalna ilość znaków to',
    email: 'Nie poprawny adres e-mail',
    passwordNotMatch: 'Hasła nie są identyczne'
  },
  en: {
    required: 'This value is required',
    minlength: 'Minimal length is',
    maxlength: 'Maximal length is',
    email: 'Invalid email pattern',
    passwordNotMatch: 'Password not match'
  }
};

export {formErrorMessageConst};
