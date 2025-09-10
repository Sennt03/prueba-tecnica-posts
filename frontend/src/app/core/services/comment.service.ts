import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LsCommentCreate, LsResComment } from '@models/comment.models';
import { environment } from 'enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private url = `${environment.url_api}/posts`

  private http = inject(HttpClient)

  constructor(){}

  create(data: LsCommentCreate, postId: string | number): Observable<LsResComment>{
    return this.http.post<LsResComment>(`${this.url}/${postId}/comments`, data)
  }
  
  update(data: LsCommentCreate, postId: string | number, commentId: string | number): Observable<LsResComment>{
    return this.http.put<LsResComment>(`${this.url}/${postId}/comments/${commentId}`, data)
  }
  
  delete(postId: string | number, commentId: string | number): Observable<LsResComment>{
    return this.http.delete<LsResComment>(`${this.url}/${postId}/comments/${commentId}`)
  }
}
