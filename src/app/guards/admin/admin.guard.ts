import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "app/services/auth/auth.service";
import { take, map, Observable, of } from "rxjs";

/**
 * Guard function that checks if the user is an admin and has a valid login session.
 *
 * @return {Observable<boolean>} An observable that emits a boolean indicating if the user is an admin and has a valid login session.
 */

export const adminGuard: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService);
  const lastLogin = localStorage.getItem("lastLogin");
  if (
    lastLogin !== null &&
    Number(lastLogin) + 3600000 < new Date().getTime()
  ) {
    localStorage.removeItem("lastLogin");
    void authService.logout();
    return of(false);
  }
  return authService.currentUser.pipe(take(1), map(Boolean));
};
