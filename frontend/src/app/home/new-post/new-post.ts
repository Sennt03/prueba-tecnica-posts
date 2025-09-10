import { Component, ErrorHandler, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '@services/post.service';
import { Loading } from '@shared/sharedImports';
import { createFormHelper } from '@shared/utils/errors-forms';
import toastr from '@shared/utils/toastr';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [ReactiveFormsModule, Loading],
  templateUrl: './new-post.html',
  styleUrl: './new-post.scss'
})
export class NewPost {

  form!: FormGroup
  maskLoad = signal(false)

  helperForm = () => createFormHelper(this.form)

  formBuilder = inject(FormBuilder)
  router = inject(Router)
  postService = inject(PostService)

  constructor(){
    this.buildForm()
  }

  private buildForm(){
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
    })
  }

  sendPost(){
    if(!this.form.valid){
      this.form.markAllAsTouched()
      return
    }

    this.maskLoad.set(true)
    this.postService.create(this.form.value).subscribe({
      next: (res: any) => {
        toastr.success('Creado correctamente!', '')
        this.maskLoad.set(false)
        this.form.markAsUntouched()
        this.router.navigate(['/'])
      },
      error: err => this.myErrorHandler(err, 'Fallo al crear!')
    })
  }

  myErrorHandler(err: any, text: string){
    this.maskLoad.set(false)
    toastr.setOption('timeOut', 3000)
    if (window.innerWidth < 768) toastr.setOption('positionClass', 'toast-top-center')
    toastr.error(err.error.message, text)
    toastr.setDefaultsOptions()
  }

}
