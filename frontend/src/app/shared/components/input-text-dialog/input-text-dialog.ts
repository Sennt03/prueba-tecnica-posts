import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-text-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input-text-dialog.html',
  styleUrl: './input-text-dialog.scss'
})
export class InputTextDialog {

  visible = signal(false);
  userInput = signal('');
  edit = signal(false);

  submitted = output<string>();

  getText = () => this.edit() 
    ? $localize`:@@edit-message-input-d:Edita el comentario`
    : $localize`:@@create-message-input-d:Ingresa un comentario`

  open(content = '') {
    this.edit.set(content != '')
    this.userInput.set(content);
    this.visible.set(true);
  }

  submit() {
    if (this.userInput().trim()) {
      this.submitted.emit(this.userInput());
      this.visible.set(false);
    }
  }

  cancel() {
    this.visible.set(false);
  }

}
