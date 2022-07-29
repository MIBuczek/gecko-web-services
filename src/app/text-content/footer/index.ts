import {IFooterTextContent} from "models/text-content";

export const footerTextContent: IFooterTextContent = {
  PL: {
    title: 'Kontakt',
    description: 'Pozwól pomóc sobie odnaleźć się w współczesnej dżungli Internetu, wystarczy ze do nas napiszesz.',
    formEmail: "Wpisz adres e-mail",
    formMessage: "Wpisz wiadomość",
    formBtn: 'Wyślij',
    formSuccessSubmit: 'Dziękujemy, Twoja wiadomość została wysłana pomyślnie',
    formErrorSubmit: 'Przepraszamy mamy problem z bazą danych, Twoja wiadomość nie została wysłana do nas poprawnie',
  },
  EN: {
    title: 'Contacts',
    description: 'Let us help you find your way in the modern jungle of the Internet, just write to us.',
    formEmail: "Enter your e-mail",
    formMessage: "Enter your message",
    formBtn: 'Send',
    formSuccessSubmit: 'Thank you, your message was sent successfully',
    formErrorSubmit: 'Sorry we have a problem with the database, your message was not sent to us properly',
  }
}
