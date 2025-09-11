import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth-guard';
import { AuthService } from '@services/auth.service';

describe('authGuard', () => {
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(() => {
    mockAuthService = {
      getAuth: jasmine.createSpy(),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should allow activation when user is authenticated', () => {
    mockAuthService.getAuth.and.returnValue({ token: '123' });

    const canActivate = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));

    expect(canActivate).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should block activation and navigate to login when user is not authenticated', () => {
    mockAuthService.getAuth.and.returnValue(null);

    const canActivate = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));

    expect(canActivate).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
