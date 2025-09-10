import { Component, inject, input, output, signal } from '@angular/core';
import { LsGetPost } from '@models/post.models';
import { AuthService } from '@services/auth.service';
import { CommentService } from '@services/comment.service';
import { PostService } from '@services/post.service';
import { ConfirmDialog } from '@shared/components/confirm-dialog/confirm-dialog';
import { InputTextDialog } from '@shared/components/input-text-dialog/input-text-dialog';
import { Loading } from '@shared/sharedImports';
import toastr from '@shared/utils/toastr';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [Loading, InputTextDialog, ConfirmDialog],
  templateUrl: './comments.html',
  styleUrl: './comments.scss'
})
export class Comments {

  private postService = inject(PostService)
  private commentService = inject(CommentService)
  private authService = inject(AuthService)
  
  loading = signal(false)
  id = input<number>()
  post = signal<LsGetPost | null>(null)
  
  user = this.authService.getUser()
  idComment = 0
  edit = false

  toggleComments(el: HTMLElement, btn: HTMLButtonElement, load = false){
    // this.loading.set(true)
    btn.textContent = 'Cargando...'

    const idPost = this.id() as number
    this.postService.getById(idPost).subscribe({
      next: res => {
        // this.loading.set(false)
        const text = el.classList.contains('open') && !load ? 'Ver mas' : 'Cerrar'
        
        if(load) el.classList.add('open')
        else if(res.data.comments.length > 0) el.classList.toggle('open') 
        else{
          btn.textContent = 'No hay comentarios! - Click para recargar'
          return
        }

        btn.textContent = text
        this.post.set(res)
      }
    })
  }

  onComment(comment: string, el: HTMLElement, btn: HTMLButtonElement){
    if(this.edit){
      this.onEditComment(comment, el, btn)
      return
    }

    this.loading.set(true)
    const postId = this.id() as number
    this.commentService.create({content: comment}, postId).subscribe({
      next: res => {
        this.loading.set(false)
        this.toggleComments(el, btn, true)
        toastr.success('Comentario añadido!', '')
      },
      error: err => {
        this.loading.set(false)
        toastr.error('Error al crear el comentario!', '')
      }
    })
  }

  deleteComment(id: number, dialog: ConfirmDialog){
    this.idComment = id
    dialog.open()
  }

  onAcceptDelete(){
    this.loading.set(true)
    const postId = this.id() as number
    this.commentService.delete(postId, this.idComment).subscribe({
      next: res => {
        this.post.update(post => {
          const data = { ...post } as LsGetPost
          data.data.comments = data.data.comments.filter(comment => comment.id != this.idComment)
          return data
        })

        this.loading.set(false)
        this.idComment = 0
        toastr.success('Comentario eliminado correctamente', '')
        
      },
      error: err => {
        this.loading.set(false)
        toastr.error('Error al eliminar!', '')
      }
    })
  }

  editComment(id: number, content: string, dialog: InputTextDialog){
    this.idComment = id
    this.edit = true
    dialog.open(content)
  }

  onEditComment(comment: string, el: HTMLElement, btn: HTMLButtonElement){
    this.loading.set(true)
    const postId = this.id() as number
    this.commentService.update({content: comment}, postId, this.idComment).subscribe({
      next: res => {
        this.post.update(post => {
          const data = { ...post } as LsGetPost
          const index = data.data.comments.findIndex(comment => comment.id == this.idComment)
          data.data.comments[index].content = comment
          return data
        })

        this.idComment = 0;
        this.edit = false;
        this.loading.set(false)
        toastr.success('Comentario editado!', '')
        
      },
      error: err => {
        this.loading.set(false)
        toastr.error('Error al editar el comentario!', '')
      }
    })
  }

}
