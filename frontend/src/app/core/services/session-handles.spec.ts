import { TestBed } from '@angular/core/testing';
import { sessionHandlerInterceptor } from './session-handler.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpRequest, HttpContext, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NO_TOKEN_HEADER } from './token.service';
import { of, throwError } from 'rxjs';
import toastr from '@shared/utils/toastr';

describe('sessionHandlerInterceptor', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let nextFn: any;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);
    mockAuthService.logout.and.returnValue(of());

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    spyOn(toastr, 'error');

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    // Función "next" que simula pasar la request
    nextFn = (req: HttpRequest<any>) => of(req);
  });

  it('should pass through request if NO_TOKEN_HEADER is true', (done) => {
    const req = new HttpRequest('GET', '/test', {
      context: new HttpContext().set(NO_TOKEN_HEADER, true),
    });

    // Simulamos backend
    const nextFn = (r: HttpRequest<any>) =>
      of(new HttpResponse({ status: 200, body: { ok: true } }));

    TestBed.runInInjectionContext(() => {
      sessionHandlerInterceptor(req, nextFn).subscribe({
        next: (result) => {
          // Hacemos cast seguro a HttpResponse para poder usar body
          if (result instanceof HttpResponse) {
            expect(result.body).toEqual({ ok: true });
          } else {
            fail('Expected HttpResponse');
          }

          expect(mockAuthService.logout).not.toHaveBeenCalled();
          expect(mockRouter.navigate).not.toHaveBeenCalled();
          expect(toastr.error).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });
  it('should handle 401 error by calling logout and navigating', (done) => {
    const req = new HttpRequest('GET', '/test');
    const nextError = () => throwError(() => new HttpErrorResponse({ status: 401 }));

    TestBed.runInInjectionContext(() => {
      sessionHandlerInterceptor(req, nextError).subscribe({
        next: () => {},
        error: (err) => {
          expect(err.status).toBe(401);
          expect(mockAuthService.logout).toHaveBeenCalled();
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth']);
          expect(toastr.error).toHaveBeenCalledWith('Sesión caducada!', '');
          done();
        },
      });
    });
  });

  it('should propagate non-401 errors without calling logout', (done) => {
    const req = new HttpRequest('GET', '/test');
    const nextError = () => throwError(() => new HttpErrorResponse({ status: 500 }));

    TestBed.runInInjectionContext(() => {
      sessionHandlerInterceptor(req, nextError).subscribe({
        next: () => {},
        error: (err) => {
          expect(err.status).toBe(500);
          expect(mockAuthService.logout).not.toHaveBeenCalled();
          expect(mockRouter.navigate).not.toHaveBeenCalled();
          expect(toastr.error).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
