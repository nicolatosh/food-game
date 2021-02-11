// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const baseUrl = "localhost"
const basePort = "30000"
const apiBaseUrl = "http://" + baseUrl + ":" + basePort
export const environment = {
  production: false,
  apiLogin: apiBaseUrl + "/login",
  apiRegister: apiBaseUrl + "/register",
  apiMatchTypes: apiBaseUrl + "/matchtypes",
  apiPlay: apiBaseUrl + "/play",
  apiGame: apiBaseUrl + "/game",
  apiJoin: apiBaseUrl + "/game/join",
  apiSse: apiBaseUrl + "/sse"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
