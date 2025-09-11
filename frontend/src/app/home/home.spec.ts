import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '@services/auth.service';

describe('Home (unit tests)', () => {
  let fixture: ComponentFixture<Home>;
  let component: Home;
  let mockAuthService: any;
  let mockWindow: { location: { href: string } };

  beforeEach(() => {
    mockAuthService = {
      logout: jasmine.createSpy('logout').and.returnValue(of({}))
    };

    mockWindow = { location: { href: '' } };

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;

    (component as any)._window = mockWindow;

    fixture.detectChanges();
  });

  it('should create component with initial values', () => {
    expect(component).toBeTruthy();
    expect(component.maskLoad()).toBeFalse();
    expect(['es','en','fr']).toContain(component.currentLang);
  });

  it('logout should call authService.logout', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
