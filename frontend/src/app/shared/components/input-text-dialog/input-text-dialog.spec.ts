import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTextDialog } from './input-text-dialog';

describe('InputTextDialog', () => {
  let component: InputTextDialog;
  let fixture: ComponentFixture<InputTextDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputTextDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
