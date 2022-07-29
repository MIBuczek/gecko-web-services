export interface IFooterTexts {
  title: string,
  description: string,
  formEmail: string,
  formMessage: string,
  formBtn: string,
  formSuccessSubmit: string;
  formErrorSubmit: string;
}

export interface IFooterTextContent {
  PL: IFooterTexts;
  EN: IFooterTexts
}

export interface ICopyRightsText {
  copyright: string,
  rightReserved: string,
}

export interface ICopyRightsTextContent {
  PL: ICopyRightsText;
  EN: ICopyRightsText
}

export interface INotFoundText {
  header: string;
  description: string;
  redirect : string;
}

export interface INotFoundTextContent {
  PL: INotFoundText;
  EN: INotFoundText
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
