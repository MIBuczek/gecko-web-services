// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAMp-BKXhXlvIWqIZ_4Gt5hCOosUUTBWpE",
    authDomain: "gecko-web-services.firebaseapp.com",
    projectId: "gecko-web-services",
    storageBucket: "gecko-web-services.appspot.com",
    messagingSenderId: "406375635773",
    appId: "1:406375635773:web:b1e839df699078db770354",
    databaseURL:
      "https://gecko-web-services-default-rtdb.europe-west1.firebasedatabase.app/",
  },
  recaptcha: {
    siteKey: "6LfKNi0cAAAAACeYwFRY9_d_qjGhpiwYUo5gNW5-",
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
