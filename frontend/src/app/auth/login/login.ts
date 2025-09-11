import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Loading} from '@shared/sharedImports';
import { createFormHelper } from '@shared/utils/errors-forms';
import toastr from '@shared/utils/toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, Loading],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  form!: FormGroup
  maskLoad = signal(false)

  private router = inject(Router)
  private formBuilder = inject(FormBuilder)
  private authService = inject(AuthService)

  helperForm = () => createFormHelper(this.form)

  constructor() {
      this.buildForm()
    }

  private buildForm(){
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  login(){
    if(!this.form.valid){
      this.form.markAllAsTouched()
      return
    }

    this.maskLoad.set(true)
    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        this.maskLoad.set(false)
        this.authService.saveAuth(res)
        this.form.markAsUntouched()
        const text = $localize`:@@login-succes-a:Bienvenido!`
        toastr.success(text, '')
          
        this.router.navigate(['/'])
      },
      error: (err) => {
        this.maskLoad.set(false)
        toastr.setOption('timeOut', 3000)
        if (window.innerWidth < 768) toastr.setOption('positionClass', 'toast-top-center')
          const text = err.status == 401
          ? $localize`:@@login-err-b:Credenciales inválidas!`
          : $localize`:@@login-err-b:Error al iniciar sesión!`
        // toastr.error(err.error.message, '')
        toastr.error(text, '')
        toastr.setDefaultsOptions()
      }
    })
  }

  togglePasswordVisibility(iconElement: HTMLElement, inputElement: HTMLInputElement): void {
    if (iconElement.classList.contains('fa-eye')) {
      iconElement.classList.add('fa-eye-slash');
      iconElement.classList.remove('fa-eye');
      inputElement.type = 'text'
    } else {
      iconElement.classList.add('fa-eye');
      iconElement.classList.remove('fa-eye-slash');
      inputElement.type = 'password'
    }
  }
}
