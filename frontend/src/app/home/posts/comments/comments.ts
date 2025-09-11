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
  id = input<number>(0)
  post = signal<LsGetPost | null>(null)
  
  user = this.authService.getUser()
  idComment = 0
  edit = false

  // INTERCIONALIZACION
  textDeleteConfirm = $localize`:@@delete_confirm_message:¿Estás seguro de eliminar este comentario?`;

  toggleComments(el: HTMLElement, btn: HTMLButtonElement, load = false){
    // this.loading.set(true)
    const text = $localize`:@@error-message-loading:Cargando...`
    btn.textContent = text

    const idPost = this.id() as number
    this.postService.getById(idPost).subscribe({
      next: res => {
        const text = el.classList.contains('open')
          ? $localize`:@@error-message-see-more:Ver mas`
          : $localize`:@@error-message-close:Cerrar`

        if(load) el.classList.add('open')
        else if(res.data.comments.length > 0) el.classList.toggle('open') 
        else{
          const text = $localize`:@@error-message-nohas:No hay comentarios! - Click para recargar`
          btn.textContent = text
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
        const text = $localize`:@@error-message-added:Comentario añadido!`
        toastr.success(text, '')
      },
      error: err => {
        this.loading.set(false)
        const text = $localize`:@@error-message-created-error:Error al crear el comentario!`
        toastr.error(text, '')
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
        const text = $localize`:@@error-message-eliminated:Comentario eliminado correctamente!`
        toastr.success(text, '')
        
      },
      error: err => {
        this.loading.set(false)
        const text = $localize`:@@error-message-error-to-elim:Error al eliminar!`
        toastr.error(text, '')
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
        const text = $localize`:@@error-message:Comentario editado!`
        toastr.success(text, '')
        
      },
      error: err => {
        this.loading.set(false)
        const text = $localize`:@@error-message:Error al editar el comentario!`
        toastr.error(text, '')
      }
    })
  }

}
