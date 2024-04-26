import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'app/services/auth/auth.service';
import { take, map } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  return inject(AuthService).currentUser.pipe(take(1), map(Boolean));
};
