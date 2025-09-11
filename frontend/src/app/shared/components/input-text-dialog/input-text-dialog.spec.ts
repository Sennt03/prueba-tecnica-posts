import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputTextDialog } from './input-text-dialog';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('InputTextDialog (unit tests)', () => {
  let fixture: ComponentFixture<InputTextDialog>;
  let component: InputTextDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InputTextDialog, FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InputTextDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component with initial values', () => {
    expect(component).toBeTruthy();
    expect(component.visible()).toBeFalse();
    expect(component.userInput()).toBe('');
    expect(component.edit()).toBeFalse();
  });

  it('open() should set visible true and set userInput/edit', () => {
    component.open('test');
    expect(component.visible()).toBeTrue();
    expect(component.userInput()).toBe('test');
    expect(component.edit()).toBeTrue();

    component.open('');
    expect(component.visible()).toBeTrue();
    expect(component.userInput()).toBe('');
    expect(component.edit()).toBeFalse();
  });

  it('submit() should emit submitted and hide dialog', () => {
    const spy = spyOn(component.submitted, 'emit');
    component.userInput.set('hello');

    component.submit();

    expect(spy).toHaveBeenCalledOnceWith('hello');
    expect(component.visible()).toBeFalse();
  });

  it('cancel() should hide the dialog', () => {
    component.open('test');
    expect(component.visible()).toBeTrue();

    component.cancel();
    expect(component.visible()).toBeFalse();
  });

  it('getText() should return correct text based on edit state', () => {
    component.edit.set(false);
    expect(component.getText()).toContain('Ingresa un comentario');

    component.edit.set(true);
    expect(component.getText()).toContain('Edita el comentario');
  });
});
