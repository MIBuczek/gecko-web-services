export interface IFooterTexts {
  title: string,
  description: string,
  copyright: string,
  rightReserved: string,
  credits: string,
}

export interface IFooterTextContent {
  PL: IFooterTexts;
  EN: IFooterTexts
}


type ICookiesText = Omit<IFooterTexts, 'copyright' | 'rightReserved' | 'credits'> & {
  btn: string
};

export interface ICookiesTextContent {
  PL: ICookiesText,
  EN: ICookiesText
}
