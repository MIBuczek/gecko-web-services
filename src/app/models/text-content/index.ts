export interface IFooterTexts {
  title: string,
  description: string,
  formEmail: string,
  formMessage: string,
  formBtn: string,
  formSuccessSubmit : string;
  formErrorSubmit : string;
  copyright: string,
  rightReserved: string,
  credits: string,
}

export interface IFooterTextContent {
  PL: IFooterTexts;
  EN: IFooterTexts
}


type ICookiesText = Pick<IFooterTexts, 'title' | 'description'> & {
  btn: string
};

export interface ICookiesTextContent {
  PL: ICookiesText,
  EN: ICookiesText
}

export interface IErrorContent {
  required: string,
  email: string,
  minlength: string,
}

export interface IErrorTextContent {
  PL: IErrorContent,
  EN: IErrorContent
}
