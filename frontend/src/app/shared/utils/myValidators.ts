import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class MyValidators {

    // Validacion grupal personzalida
  static matchPasswords(control: AbstractControl){
    const password = (control.get('password') as AbstractControl<any, any, any>).value
    const confirmPassword = (control.get('confirmPassword') as AbstractControl<any, any, any>).value
    if(password !== confirmPassword){
        return {match_password: true}
    }

    return null
  }

  // EJEMPLO de funciones de validacion ascincrona para username o email
//   EJEMPLOS HECHOS POR MI PERSONA

  // Funciones para validaciones asincronas
//   static validateUsername(service: AuthService) {
//     return (control: AbstractControl) => {
//       const value = control.value;
//       return validateAvaible(service, value, 'username')
//     };
//   }


//   static validateEmail(service: AuthService) {
//     return (control: AbstractControl) => {
//       const value = control.value;
//       return validateAvaible(service, value, 'email')
//     };
//   }

//   static emailIsValid(service: UserService) {
//     return (control: AbstractControl) => {
//       const value = control.value;
//       return service.isValidEmal(value).pipe(map((res: any) => {
//         const isValid = res.isValid;
//         if (!isValid) {
//           return {not_valid: true};
//         }
//         return null;
//       }))
//     };
//   }

}

// function validateAvaible(service: AuthService, value: any, field: 'email' | 'username'){

//   return service.validateAvaible(value, field)
//   .pipe(
//     map((response) => {
//       const isAvailable = response.isAvailable;
//       if (!isAvailable) {
//         return {not_available: true};
//       }
//       return null;
//     })
//   );
// }