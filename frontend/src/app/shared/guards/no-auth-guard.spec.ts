import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { noAuthGuard } from './no-auth-guard';
import { AuthService } from '@services/auth.service';

describe('noAuthGuard', () => {
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(() => {
    mockAuthService = {
      loggedIn: jasmine.createSpy(),
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

  it('should block activation and navigate to "/" if user is logged in', () => {
    mockAuthService.loggedIn.and.returnValue(true);

    const canActivate = TestBed.runInInjectionContext(() => noAuthGuard(null as any, null as any));

    expect(canActivate).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should allow activation if user is not logged in', () => {
    mockAuthService.loggedIn.and.returnValue(false);

    const canActivate = TestBed.runInInjectionContext(() => noAuthGuard(null as any, null as any));

    expect(canActivate).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
