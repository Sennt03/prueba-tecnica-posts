import { Component, inject, input, signal } from '@angular/core';
import { LsGetPost } from '@models/post.models';
import { PostService } from '@services/post.service';
import { Loading } from '@shared/sharedImports';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [Loading],
  templateUrl: './comments.html',
  styleUrl: './comments.scss'
})
export class Comments {

  private postService = inject(PostService)
  loading = signal(false)
  id = input<number>()

  post = signal<LsGetPost | null>(null)

  toggleComments(el: HTMLElement, btn: HTMLButtonElement){
    this.loading.set(true)

    const idPost = this.id() as number
    this.postService.getById(idPost).subscribe({
      next: res => {
        this.loading.set(false)
        if(res.data.comments.length > 0){
          const text = el.classList.contains('open') ? 'Ver mas' : 'Cerrar'
          el.classList.toggle('open')
          btn.textContent = text
          this.post.set(res)
        }else{
          btn.textContent = 'No hay comentarios! - Click para recargar'
        }
      }
    })
  }

}
