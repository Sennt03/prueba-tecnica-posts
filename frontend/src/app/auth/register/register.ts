import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Loading, sharedImports } from '@shared/sharedImports';
import { createFormHelper } from '@shared/utils/errors-forms';
import { MyValidators } from '@shared/utils/myValidators';
import toastr from '@shared/utils/toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, Loading],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  private router = inject(Router)
  private formBuilder = inject(FormBuilder)
  private authService = inject(AuthService)

  form!: FormGroup
  maskLoad = signal(false)

  helperForm = () => createFormHelper(this.form)

  constructor() {
    this.buildForm()
  }
  
  private buildForm(){
    const passwordPattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(passwordPattern)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: MyValidators.matchPasswords
    })
  }

  register(){
    if(!this.form.valid){
      this.form.markAllAsTouched()
      return
    }

    this.maskLoad.set(true)
    this.authService.register(this.form.value).subscribe({
      next: (res: any) => {
        toastr.success(res.message, '')
        this.maskLoad.set(false)
        // this.authService.saveAuth(res)
        this.form.markAsUntouched()
        this.router.navigate(['../login'])
      },
      error: (err: any) => {
        this.maskLoad.set(false)
        toastr.setOption('timeOut', 3000)
        if (window.innerWidth < 768) toastr.setOption('positionClass', 'toast-top-center')
        toastr.error(err.error.message, '')
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
