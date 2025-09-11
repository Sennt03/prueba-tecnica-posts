import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Loading } from './loading';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, InputSignal, signal } from '@angular/core';

describe('Loading (unit tests)', () => {
  let fixture: ComponentFixture<Loading>;
  let component: Loading;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Loading],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(Loading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component with initial values', () => {
    expect(component).toBeTruthy();
    expect(component.show()).toBeFalse();
  });

  it('should not render the lmask div when show is false', () => {
    component.show = signal(false) as unknown as InputSignal<boolean>;
    fixture.detectChanges();

    const mask = fixture.debugElement.query(By.css('.lmask'));
    expect(mask).toBeNull();
  });

  it('should render the lmask div when show is true', () => {
    component.show = signal(true) as unknown as InputSignal<boolean>;
    fixture.detectChanges();

    const mask = fixture.debugElement.query(By.css('.lmask'));
    expect(mask).not.toBeNull();
  });
});
