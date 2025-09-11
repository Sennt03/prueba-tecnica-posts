import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auth } from './auth';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('Auth (unit tests)', () => {
  let fixture: ComponentFixture<Auth>;
  let component: Auth;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Auth,
        RouterTestingModule.withRoutes([]), // permite probar router-outlet
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Auth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render overlay and auth-content divs', () => {
    const overlay = fixture.debugElement.query(By.css('.overlay'));
    const content = fixture.debugElement.query(By.css('.auth-content'));

    expect(overlay).toBeTruthy();
    expect(content).toBeTruthy();
  });

  it('should contain a router-outlet', () => {
    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutlet).toBeTruthy();
  });
});
