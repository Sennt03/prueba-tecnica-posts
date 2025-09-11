import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Login } from './login';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// IMPORTS DEL PROYECTO
import toastr from '@shared/utils/toastr';
import { AuthService } from '@services/auth.service';

describe('Login (unit tests)', () => {
  let fixture: ComponentFixture<Login>;
  let component: Login;
  let router: Router;

  // mocks
  let mockAuthService: any;

  beforeEach(waitForAsync(() => {
    // Crear mocks espía para AuthService
    mockAuthService = {
      login: jasmine.createSpy('login'),
      saveAuth: jasmine.createSpy('saveAuth'),
    };

    // Spies para toastr
    spyOn(toastr, 'setOption').and.callThrough();
    spyOn(toastr, 'error').and.callThrough();
    spyOn(toastr, 'setDefaultsOptions').and.callThrough();

    TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      providers: [{ provide: AuthService, useValue: mockAuthService }, FormBuilder],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;

    // obtener el Router del TestBed y espiar navigate
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create the component and build the form with controls', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeDefined();
    expect(component.form.get('username')).toBeDefined();
    expect(component.form.get('password')).toBeDefined();
  });

  it('form should be invalid initially', () => {
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('username')?.hasError('required')).toBeTrue();
    expect(component.form.get('password')?.hasError('required')).toBeTrue();
  });

  it('username should validate email format', () => {
    const username = component.form.get('username')!;
    username.setValue('not-an-email');
    expect(username.hasError('email')).toBeTrue();

    username.setValue('test@example.com');
    expect(username.hasError('email')).toBeFalse();
    expect(username.valid).toBeTrue();
  });

  it('password should validate minlength 8', () => {
    const password = component.form.get('password')!;
    password.setValue('short');
    expect(password.hasError('minlength')).toBeTrue();

    password.setValue('longenoughpassword');
    expect(password.hasError('minlength')).toBeFalse();
    expect(password.valid).toBeTrue();
  });

  it('login() should markAllAsTouched and not call authService.login when form invalid', () => {
    // dejar el form inválido
    component.form.get('username')?.setValue(''); // invalid
    component.form.get('password')?.setValue(''); // invalid

    const spyMarkAll = spyOn(component.form, 'markAllAsTouched').and.callThrough();

    component.login();

    expect(spyMarkAll).toHaveBeenCalled();
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('successful login: should set maskLoad true while waiting and then call saveAuth and navigate', () => {
    // Preparar subject para controlar flujo asíncrono (pendiente -> luego emitir)
    const loginSubject = new Subject<any>();
    mockAuthService.login.and.returnValue(loginSubject.asObservable());

    // Poner form válido
    const payload = { username: 'user@test.com', password: 'password123' };
    component.form.setValue(payload);

    // espiar markAsUntouched
    const spyMarkUntouched = spyOn(component.form, 'markAsUntouched').and.callThrough();

    // Llamar login (esto debe poner maskLoad true inmediatamente)
    component.login();
    // después de llamar, el observable no ha emitido aún -> maskLoad true
    expect(component.maskLoad()).toBeTrue();
    expect(mockAuthService.login).toHaveBeenCalledWith(payload);

    // Emular respuesta exitosa
    const fakeResp = { token: 'abc', user: { id: 1 } };
    loginSubject.next(fakeResp);
    loginSubject.complete();

    // Después de recibir la respuesta (las emisiones son síncronas porque next fue llamado)
    expect(component.maskLoad()).toBeFalse();
    expect(mockAuthService.saveAuth).toHaveBeenCalledWith(fakeResp);
    expect(spyMarkUntouched).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('togglePasswordVisibility should switch icon classes and input type from password -> text and back', () => {
    // Crear elementos DOM para simular icono y input
    const icon = document.createElement('i');
    icon.classList.add('fa-eye');
    const input = document.createElement('input') as HTMLInputElement;
    input.type = 'password';

    component.togglePasswordVisibility(icon, input);
    expect(icon.classList.contains('fa-eye-slash')).toBeTrue();
    expect(icon.classList.contains('fa-eye')).toBeFalse();
    expect(input.type).toBe('text');

    component.togglePasswordVisibility(icon, input);
    expect(icon.classList.contains('fa-eye')).toBeTrue();
    expect(icon.classList.contains('fa-eye-slash')).toBeFalse();
    expect(input.type).toBe('password');
  });
});
