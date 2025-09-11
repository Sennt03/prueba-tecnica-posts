import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Register } from './register';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import toastr from '@shared/utils/toastr';
import { AuthService } from '@services/auth.service';

describe('Register (unit tests)', () => {
  let fixture: ComponentFixture<Register>;
  let component: Register;
  let router: Router;

  let mockAuthService: any;

  beforeEach(waitForAsync(() => {
    mockAuthService = {
      register: jasmine.createSpy('register')
    };

    // espías para toastr
    spyOn(toastr, 'success').and.callThrough();
    spyOn(toastr, 'setOption').and.callThrough();
    spyOn(toastr, 'error').and.callThrough();
    spyOn(toastr, 'setDefaultsOptions').and.callThrough();

    TestBed.configureTestingModule({
      imports: [
        Register,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create the component and build the form with controls', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeDefined();
    expect(component.form.get('username')).toBeDefined();
    expect(component.form.get('password')).toBeDefined();
    expect(component.form.get('confirmPassword')).toBeDefined();
  });

  it('form should be invalid initially (required validators)', () => {
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('username')?.hasError('required')).toBeTrue();
    expect(component.form.get('password')?.hasError('required')).toBeTrue();
    expect(component.form.get('confirmPassword')?.hasError('required')).toBeTrue();
  });

  it('username should validate email format', () => {
    const username = component.form.get('username')!;
    username.setValue('not-email');
    expect(username.hasError('email')).toBeTrue();

    username.setValue('user@test.com');
    expect(username.hasError('email')).toBeFalse();
  });

  it('password should validate minlength and pattern', () => {
    const password = component.form.get('password')!;
    // too short
    password.setValue('P1!');
    expect(password.hasError('minlength')).toBeTrue();

    // long but weak (no uppercase / no special / no number)
    password.setValue('passwordpassword');
    // it should fail pattern
    expect(password.hasError('pattern')).toBeTrue();

    // strong password: uppercase, number, special and length >=8
    password.setValue('Password1!');
    expect(password.valid).toBeTrue();
  });

  it('should set form-level match_password error when passwords do not match', () => {
    component.form.get('password')?.setValue('Password1!');
    component.form.get('confirmPassword')?.setValue('Different1!');
    expect(component.form.hasError('match_password')).toBeTrue();
  });

  it('form should be valid when passwords match and other validators satisfied', () => {
    component.form.get('username')?.setValue('user@test.com');
    component.form.get('password')?.setValue('Password1!');
    component.form.get('confirmPassword')?.setValue('Password1!');
    expect(component.form.hasError('match_password')).toBeFalse();
    expect(component.form.valid).toBeTrue();
  });

  it('register() should markAllAsTouched and not call authService.register when form invalid', () => {
    component.form.get('username')?.setValue(''); // invalid
    component.form.get('password')?.setValue(''); // invalid
    component.form.get('confirmPassword')?.setValue(''); // invalid

    const spyMarkAll = spyOn(component.form, 'markAllAsTouched').and.callThrough();
    component.register();

    expect(spyMarkAll).toHaveBeenCalled();
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });

  it('successful register: should set maskLoad true while waiting then toastr.success and navigate', () => {
    // Preparar subject para controlar flujo asíncrono
    const subj = new Subject<any>();
    mockAuthService.register.and.returnValue(subj.asObservable());

    // llenar formulario válido
    const payload = {
      username: 'user@test.com',
      password: 'Password1!',
      confirmPassword: 'Password1!'
    };
    component.form.setValue(payload);

    // espiar markAsUntouched
    const spyMarkUntouched = spyOn(component.form, 'markAsUntouched').and.callThrough();

    component.register();
    // pendiente
    expect(component.maskLoad()).toBeTrue();
    expect(mockAuthService.register).toHaveBeenCalledWith(payload);

    // respuesta exitosa
    const fakeResp = { message: 'Usuario creado' };
    subj.next(fakeResp);
    subj.complete();

    // despues de la respuesta
    expect(component.maskLoad()).toBeFalse();
    expect(toastr.success).toHaveBeenCalledWith(fakeResp.message, '');
    expect(spyMarkUntouched).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['../login']);
  });

  it('togglePasswordVisibility should toggle classes and input type', () => {
    const icon = document.createElement('i');
    icon.classList.add('fa-eye');
    const input = document.createElement('input') as HTMLInputElement;
    input.type = 'password';

    component.togglePasswordVisibility(icon, input);
    expect(icon.classList.contains('fa-eye-slash')).toBeTrue();
    expect(input.type).toBe('text');

    component.togglePasswordVisibility(icon, input);
    expect(icon.classList.contains('fa-eye')).toBeTrue();
    expect(input.type).toBe('password');
  });
});
