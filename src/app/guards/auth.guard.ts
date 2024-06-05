import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { map, switchMap, take } from 'rxjs/operators';
import { FirestoreService } from '../services/firestore/firestore.service';
import { of } from 'rxjs';

export const AuthGuard: CanActivateFn = (
  route, state
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map(user => {
      if (user) {
        authService.currentUserSig(); 
        return true;
      } else {
        router.navigate(['/hjem']);
        return false;
      }
    })
  );
};

export const AdminGuard: CanActivateFn = (
  route, 
  state
) => {
  const authService = inject(AuthService);
  const firestoreService = inject(FirestoreService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    switchMap(user => {
      if (user) {
        return firestoreService.isAdmin(authService.currentUserSig()!.email).pipe(
          map(isAdmin => {
            if (isAdmin) {
              return true;
            } else {
              router.navigate(['/hjem']);
              return false; 
            }
          })
        );
      } else {
        router.navigate(['/hjem']); 
        return of(false); 
      }
    })
  );
};