import {INotFoundTextContent} from "models/text-content";

export const notFoundTextContent: INotFoundTextContent = {
  PL: {
    header: 'Bład 404',
    description: 'Podany URL nie istnieje w serwisie.',
    redirect: 'Powrót do strony głównej'
  },
  EN: {
    header: 'Error 404',
    description: 'The specified URL does not exist on the site.',
    redirect: 'Go back to main page'
  }
}
