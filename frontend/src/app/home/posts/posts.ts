import { Component, inject, signal } from '@angular/core';
import { Comments } from './comments/comments';
import { PostService } from '@services/post.service';
import { BasePostData } from '@models/post.models';
import { Loading } from '@shared/sharedImports';
import toastr from '@shared/utils/toastr';

@Component({
  selector: 'app-posts',
  imports: [Comments, Loading],
  templateUrl: './posts.html',
  styleUrl: './posts.scss'
})
export class Posts {

  private postService = inject(PostService)

  posts = signal<BasePostData[]>([])
  loading = signal(true)

  constructor(){
    this.loadPosts()
  }

  loadPosts(){
    this.loading.set(true)
    this.postService.getAll().subscribe({
      next: res => {
        this.posts.set(res.data)
        this.loading.set(false)
      }
    })
  }

  deletePost(id: number){
    this.loading.set(true)
    this.postService.delete(id).subscribe({
      next: res => {
        this.loading.set(false)
        toastr.success('Post eliminado correctamente', '')
        
        this.posts.update(posts => posts.filter(post => post.id != id))
      }
    })
  }

}
