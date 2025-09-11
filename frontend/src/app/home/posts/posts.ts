import { Component, inject, signal } from '@angular/core';
import { Comments } from './comments/comments';
import { PostService } from '@services/post.service';
import { BasePostData } from '@models/post.models';
import { Loading } from '@shared/sharedImports';
import toastr from '@shared/utils/toastr';
import { ConfirmDialog } from '@shared/components/confirm-dialog/confirm-dialog';
import { AuthService } from '@services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [RouterModule, Comments, Loading, ConfirmDialog],
  templateUrl: './posts.html',
  styleUrl: './posts.scss'
})
export class Posts {

  private postService = inject(PostService)
  private authService = inject(AuthService)
  user = this.authService.getUser()

  posts = signal<BasePostData[]>([])
  loading = signal(true)
  idPost = 0

  // INTERCIONALIZACION
  textDeleteConfirm = $localize`:@@delete_confirm_message_post:¿Estás seguro de eliminar este post?`;

  constructor(){
    this.loadPosts()
  }

  loadPosts(){
    this.loading.set(true)
    this.postService.getAll().subscribe({
      next: (res) => {
        this.posts.set(res.data)
        this.loading.set(false)
      }
    })
  }

  deletePost(id: number, dialog: ConfirmDialog){
    this.idPost = id
    dialog.open()
  }

  onAcceptDelete(){
    this.loading.set(true)
    this.postService.delete(this.idPost).subscribe({
      next: res => {
        this.loading.set(false)
        const text = $localize`:@@error-message_success:Post eliminado correctamente!`
        toastr.success(text, '')
        
        this.posts.update(posts => posts.filter(post => post.id != this.idPost))
      },
      error: err => {
        this.loading.set(false)
        toastr.success(err?.message, '')
      }
    })
  }

}
