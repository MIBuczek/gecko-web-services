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
  redirect: string;
}

export interface INotFoundTextContent {
  PL: INotFoundText;
  EN: INotFoundText
}

type ICookiesText = Pick<IFooterTexts, 'title' | 'description'> & {
  redirect: string,
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


export interface IPrivacyPolicy {
  main_header: string;
  main_description: string[];
  parts: Array<{
    inner_header: string;
    inner_description: string
  }>;
  redirect: string;
}

export interface IPrivacyPolicyTextContent {
  PL: IPrivacyPolicy;
  EN: IPrivacyPolicy
}

export interface ISingleCard {
  card_header: string;
  card_icon: string;
  card_short_description: string;
  card_full_description: string;
  card_tags: string[];
}

export interface ISingleCardBtn {
  more: string;
  hide: string;
}

export interface IServiceCard {
  main_header: string;
  intro: string;
  cards: Array<ISingleCard>;
  btn: ISingleCardBtn
}

export interface IServiceCardsTextContent {
  PL: IServiceCard;
  EN: IServiceCard;
}
