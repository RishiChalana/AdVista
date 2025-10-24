/**
 * Import and export all your functions here.
 *
 * Each function is defined in its own file and imported here.
 * This file exports them so they can be deployed to Firebase Cloud Functions.
 *
 * Example:
 *
 * import {helloWorld} from "./helloWorld";
 * export {helloWorld};
 *
 */

import {createImpersonationToken} from "./admin";

export {
  createImpersonationToken,
};
