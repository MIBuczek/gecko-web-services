import {IPrivacyPolicyTextContent} from "models/text-content";

export const privacyPolicyTextContent: IPrivacyPolicyTextContent = {
  PL: {
    main_header: 'Polityka Prywatności',
    main_description: [
      'W związku z udostępnianiem usług internetowych, strona Gecko Web Services stosuje tzw. cookies oraz loacl storage, tj. ' +
      'dane informatyczne, w szczególności pliki tekstowe zapisywane przez serwery na urządzeniu końcowym użytkownika, ' +
      'które serwery mogą odczytać przy każdorazowym połączeniu się z tego urządzenia końcowego.',
      'Oprogramowanie służące do przeglądania stron internetowych (przeglądarka internetowa) ' +
      'domyślnie dopuszcza przechowywanie plików cookies w urządzeniu końcowym użytkownika.' +
      'Użytkownicy serwisu mogą dokonać w każdym czasie zmiany ustawień dotyczących plików cookies.' +
      ' Ustawienia te mogą zostać zmienione w szczególności w taki sposób, aby blokować automatyczną obsługę plików cookies ' +
      'w ustawieniach przeglądarki internetowej, bądź informować o ich każdorazowym zamieszczeniu w urządzeniu użytkownika serwisu internetowego.',
      'Szczegółowe informacje o możliwości i sposobach obsługi plików cookies dostępne są w ustawieniach oprogramowania (przeglądarki internetowej).',
      'Mechanizm Cookies nie jest wykorzystywany do pozyskiwania jakichkolwiek informacji o użytkownikach serwisu ani śledzenia ich nawigacji. ' +
      'Pliki Cookies stosowane w serwisie nie przechowują żadnych danych osobowych ani innych informacji zebranych od użytkowników.',
      'Serwis wykorzystuje plik sesyjny, który tworzony jest i istnieje tylko w czasie trwania sesji przeglądarki. ' +
      'Jest on niezbędny dla prawidłowego działania poszczególnych elementów serwisu'
    ],
    parts: [
      {
        inner_header: 'Adres e-mail',
        inner_description: 'Gecko Web Services informuje, że adres email podawany przez użytkowników w formularzu udostępnionym w niniejszym serwisie internetowym ' +
          'jest używany jedynie do przesłania odpowiedzi na złożone zapytanie.'
      },
      {
        inner_header: 'Odnośniki do innych stron',
        inner_description: 'Nie odpowiadamy za politykę prywatności serwisów, do których prowadzą linki ze strony www.gecko-web-services.web.app'
      },
      {
        inner_header: 'Zmiany wraz z rozwojem serwisu',
        inner_description: 'Zastrzegamy sobie prawo zmiany powyższej polityki prywatności poprzez opublikowanie nowej polityki prywatności na tej że stronie.'
      }
    ],
    redirect: 'Powrót na stronę główną'
  },
  EN: {
    main_header: 'Privacy Policy',
    main_description: [
      'In connection with providing web services, the Gecko Web Services website uses so-called cookies and loacl storage, i.e. ' +
      'IT data, in particular text files stored by servers on the user\'s terminal equipment, ' +
      'which servers can read each time you connect from that end device.',
      'Software used to browse the Internet (web browser) ' +
      'allows cookies to be stored on the user\'s terminal device by default. ' +
      'These settings can be changed in particular in such a way as to block the automatic handling of cookies ' +
      'in the settings of your web browser, or to inform you of their placement on the website user\'s device each time',
      'Detailed information about the possibility and methods of handling cookies is available in the settings of your software (web browser).',
      'The Cookies mechanism is not used to obtain any information about users of the site or to track their navigation. ' +
      'Cookies used on the site do not store any personal data or other information collected from users.',
      'The service uses a session file, which is created and exists only for the duration of the browser session. ' +
      'It is necessary for the proper operation of the various elements of the website'
    ],
    parts: [
      {
        inner_header: 'E-mail address',
        inner_description: 'Gecko Web Services informs that the email address provided by users in the form provided on this website ' +
          'is used only to send a response to a submitted request.'
      },
      {
        inner_header: 'Links to other sites',
        inner_description: 'We are not responsible for the privacy policies of sites linked from www.gecko-web-services.web.app'
      },
      {
        inner_header: 'Changes with the development of the service',
        inner_description: 'We reserve the right to change the above privacy policy by publishing a new privacy policy on this website.'
      }
    ],
    redirect: 'Go back to main page'
  }
}
