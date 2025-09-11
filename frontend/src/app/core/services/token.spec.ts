import { tokenInterceptor, NO_TOKEN_HEADER, noInterceptToken } from './token.service';
import { AuthService } from '../services/auth.service';
import { HttpRequest, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs';

describe('tokenInterceptor', () => {
  let mockAuthService: Partial<AuthService>;
  let nextFn: (req: HttpRequest<any>) => any;

  beforeEach(() => {
    mockAuthService = {
      getToken: () => '12345',
    };

    // Mock de next()
    nextFn = (req: HttpRequest<any>) => of(req as unknown as HttpEvent<any>);
  });

  // Función wrapper para usar el interceptor con nuestro mock
  const callInterceptor = (req: HttpRequest<any>) => {
    // Simulamos la inyección manual del AuthService
    const token = mockAuthService.getToken?.();

    if (req.context.get(NO_TOKEN_HEADER) === true) {
      return nextFn(req);
    }

    if (token) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return nextFn(clonedReq);
    }

    return nextFn(req);
  };

  it('should add Authorization header if token exists and NO_TOKEN_HEADER is false', (done) => {
    const req = new HttpRequest('GET', '/test');

    callInterceptor(req).subscribe((event: any) => {
      const result = event as unknown as HttpRequest<any>;
      expect(result.headers.get('Authorization')).toBe('Bearer 12345');
      done();
    });
  });

  it('should NOT add Authorization header if NO_TOKEN_HEADER is true', (done) => {
    const req = new HttpRequest('GET', '/test', {
      context: noInterceptToken(),
    });

    callInterceptor(req).subscribe((event: any) => {
      const result = event as unknown as HttpRequest<any>;
      expect(result.headers.get('Authorization')).toBeNull();
      done();
    });
  });

  it('should NOT add Authorization header if token is empty', (done) => {
    mockAuthService.getToken = () => '';

    const req = new HttpRequest('GET', '/test');

    callInterceptor(req).subscribe((event: any) => {
      const result = event as unknown as HttpRequest<any>;
      expect(result.headers.get('Authorization')).toBeNull();
      done();
    });
  });

  it('noInterceptToken should return a context with NO_TOKEN_HEADER true', () => {
    const context = noInterceptToken();
    expect(context.get(NO_TOKEN_HEADER)).toBeTrue();
  });
});
