import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import toastr from '@shared/utils/toastr';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const sessionHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        toastr.error('Sesión caducada!', '');
        authService.logout().subscribe()
        router.navigate(['/auth']);
      }

      return throwError(() => error);
    })
  );
};
