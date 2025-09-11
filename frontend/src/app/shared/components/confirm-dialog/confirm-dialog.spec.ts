import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialog } from './confirm-dialog';
import { CUSTOM_ELEMENTS_SCHEMA, InputSignal, signal } from '@angular/core';

describe('ConfirmDialog (unit tests)', () => {
  let fixture: ComponentFixture<ConfirmDialog>;
  let component: ConfirmDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmDialog],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component with initial values', () => {
    expect(component).toBeTruthy();
    expect(component.visible()).toBeFalse();
    expect(component.text()).toBeUndefined();
  });

  it('open() should set visible to true', () => {
    component.open();
    expect(component.visible()).toBeTrue();
  });

  it('accept() should set visible to false and emit accepted', (done) => {
    component.accepted.subscribe(() => {
      done();
    });

    component.visible.set(true);
    component.accept();
    expect(component.visible()).toBeFalse();
  });

  it('cancel() should set visible to false and not emit', () => {
    const spy = jasmine.createSpy('acceptedSpy');
    component.accepted.subscribe(spy);

    component.visible.set(true);
    component.cancel();
    expect(component.visible()).toBeFalse();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should display the correct text', () => {
    component.text = signal('¿Estás seguro?') as unknown as InputSignal<string | undefined>;
    fixture.detectChanges();
    expect(component.text()).toBe('¿Estás seguro?');
  });
});
