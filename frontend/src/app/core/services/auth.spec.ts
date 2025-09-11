import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { environment } from 'enviroments/enviroment';
import { LsLogin, LsRegister, LsResAuth, UserDefault } from '@models/auth.models';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: mockRouter }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login should POST login data', () => {
    const loginData: LsLogin = { username: 'david@david.com', password: 'P@ssw0rd!' };
    const mockRes: LsResAuth = {
      data: { username: 'david@david.com', token: 'abc', expiresIn: 3600 },
      message: 'ok',
    };

    service.login(loginData).subscribe((res) => expect(res).toEqual(mockRes));

    const req = httpMock.expectOne(`${environment.url_api}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockRes);
  });

  it('register should POST register data', () => {
    const registerData: LsRegister = { username: 'david@david.com', password: 'P@ssw0rd!' };
    const mockRes: LsResAuth = {
      data: { username: 'david@david.com', token: 'abc', expiresIn: 3600 },
      message: 'ok',
    };

    service.register(registerData).subscribe((res) => expect(res).toEqual(mockRes));

    const req = httpMock.expectOne(`${environment.url_api}/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockRes);
  });

  it('saveAuth should store data in localStorage', () => {
    const authData: LsResAuth = {
      data: { username: 'david@david.com', token: 'abc', expiresIn: 3600 },
      message: 'ok',
    };
    service.saveAuth(authData);
    expect(JSON.parse(localStorage.getItem('auth')!)).toEqual(authData.data);
  });

  it('getAuth should return parsed data from localStorage', () => {
    const authData = { username: 'david@david.com', token: 'abc', expiresIn: 3600 };
    localStorage.setItem('auth', JSON.stringify(authData));
    expect(service.getAuth()).toEqual(authData as any);
  });

  it('getAuth should return false if parsing fails', () => {
    localStorage.setItem('auth', '{invalid}');
    spyOn(service, 'logout').and.returnValue(of());
    expect(service.getAuth()).toBeFalse();
    expect(service.logout).toHaveBeenCalled();
  });

  it('getUser should return parsed user from localStorage', () => {
    const authData = { username: 'david@david.com', token: 'abc', expiresIn: 3600 };
    localStorage.setItem('auth', JSON.stringify(authData));
    expect(service.getUser()).toEqual(authData);
  });

  it('getUser should return UserDefault if parsing fails', () => {
    localStorage.setItem('auth', '{invalid}');
    spyOn(service, 'logout').and.returnValue(of());
    expect(service.getUser()).toEqual(UserDefault);
    expect(service.logout).toHaveBeenCalled();
  });

  it('getToken should return token from stored auth', () => {
    const authData = { username: 'david@david.com', token: 'abc', expiresIn: 3600 };
    localStorage.setItem('auth', JSON.stringify(authData));
    expect(service.getToken()).toBe('abc');
  });

  it('loggedIn should return true if auth exists', () => {
    const authData = { username: 'david@david.com', token: 'abc', expiresIn: 3600 };
    localStorage.setItem('auth', JSON.stringify(authData));
    expect(service.loggedIn()).toBeTrue();
  });

  it('loggedIn should return false if auth does not exist', () => {
    expect(service.loggedIn()).toBeFalse();
  });

  it('logout should remove auth, navigate and POST logout', () => {
    localStorage.setItem(
      'auth',
      JSON.stringify({ username: 'david@david.com', token: 'abc', expiresIn: 3600 })
    );

    service.logout().subscribe((res) => {
      expect(res).toEqual({ message: 'ok' } as any);
    });

    expect(localStorage.getItem('auth')).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);

    const req = httpMock.expectOne(`${environment.url_api}/auth/logout`);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'ok' });
  });
});
