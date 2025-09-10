import { Component, ErrorHandler, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '@services/post.service';
import { Loading } from '@shared/sharedImports';
import { createFormHelper } from '@shared/utils/errors-forms';
import toastr from '@shared/utils/toastr';
import { tap } from 'rxjs';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [ReactiveFormsModule, Loading],
  templateUrl: './new-post.html',
  styleUrl: './new-post.scss'
})
export class NewPost implements OnInit{

  private formBuilder = inject(FormBuilder)
  private router = inject(Router)
  private route = inject(ActivatedRoute); 
  private postService = inject(PostService)

  form!: FormGroup
  maskLoad = signal(false)
  edit = signal(false)
  postId: string | null = null;

  helperForm = () => createFormHelper(this.form)


  constructor(){
    this.buildForm()
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.postId = params.get('id');
      if (this.postId) {
        this.edit.set(true)
        this.loadPostForEditing(this.postId);
      }
    });
  }

  private buildForm(){
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
    })
  }

  private loadPostForEditing(id: string) {
    this.maskLoad.set(true);
    this.postService.getById(id).subscribe({
      next: (post: any) => {
        this.maskLoad.set(false)
        this.form.patchValue(post.data);
      },
      error: err => this.myErrorHandler(err, 'Fallo al cargar el post!')
    });
  }

  sendPost(){
    if(!this.form.valid){
      this.form.markAllAsTouched()
      return
    }

    this.maskLoad.set(true)

    const postId = this.postId as string

    const sub = this.edit() 
    ? this.postService.update(this.form.value, postId)
    : this.postService.create(this.form.value)

    const initText = this.edit() ? 'Editado' : 'Creado'
    const initText2 = this.edit() ? 'editar' : 'crear'

    sub.subscribe({
      next: (res: any) => {
        toastr.success(initText + ' correctamente!', '')
        this.maskLoad.set(false)
        this.form.markAsUntouched()
        this.router.navigate(['/'])
      },
      error: err => this.myErrorHandler(err, `Fallo al ${initText2}!`)
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
