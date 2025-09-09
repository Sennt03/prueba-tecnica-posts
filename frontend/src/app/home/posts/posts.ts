import { Component } from '@angular/core';
import { Comments } from './comments/comments';

@Component({
  selector: 'app-posts',
  imports: [Comments],
  templateUrl: './posts.html',
  styleUrl: './posts.scss'
})
export class Posts {

}
