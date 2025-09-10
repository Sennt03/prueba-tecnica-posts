import { FormGroup } from "@angular/forms";

// ESTA FUNCION UTILIZA EL CLAUSERE DE JAVASCRIPT PARA MEMORIZAR EL FORM

export function createFormHelper(form: FormGroup) {
  
  function hasError(field: string, error: string): boolean {
    const control = form.get(field);
    return !!control && control.hasError(error);
  }

  function haveErrors(field: string): boolean {
    const control = form.get(field);
    return !!control && control.touched && control.invalid;
  }

  return {
    hasError,
    haveErrors
  };
}