import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(!authService.getAuth()) {
    router.navigate(['/auth/login'])
    return false
  }

  return true
  
  // EJEMPLO de como seria el guard con un servicio que valide la sesion del usuario

  // return userService.getProfile().pipe(
  //   map(user => {
  //     authService.updateAuthUser(user)
  //     return true
  //   }),catchError(() => {
  //     authService.logout()
  //     router.navigate(['/auth/login'])
  //     return of(false);
  //   })
  // )
};
