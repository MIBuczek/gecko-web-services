import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "app/services/auth/auth.service";

/**
 * Guard function that checks if the user is an admin and has a valid login session.
 *
 * @return {Promise<boolean>} A promise resolving to a boolean indicating if the user is an admin and has a valid login session.
 */

export const adminGuard: CanActivateFn = async (): Promise<boolean> => {
  const authService = inject(AuthService);
  const lastLogin = localStorage.getItem("lastLogin");
  if (
    lastLogin !== null &&
    Number(lastLogin) + 3600000 < new Date().getTime()
  ) {
    localStorage.removeItem("lastLogin");
    void authService.logout();
    return false;
  }

  /* Wait for Firebase to restore the session before reading the current user;
     reading sooner can observe the pre-restore null and wrongly deny access. */
  await authService.whenReady();
  return authService.currentUser() !== null;
};
