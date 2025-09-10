import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LsAllPosts, LsGetPost, LsPost, LsResPost } from '@models/post.models';
import { environment } from 'enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
 
  private url = `${environment.url_api}/posts`

  private http = inject(HttpClient)

  constructor(){}

  create(data: LsPost): Observable<LsResPost>{
    return this.http.post<LsResPost>(`${this.url}`, data)
  }
  
  update(data: LsPost, id: number): Observable<LsResPost>{
    return this.http.put<LsResPost>(`${this.url}/${id}`, data)
  }
  
  delete(id: number): Observable<LsResPost>{
    return this.http.delete<LsResPost>(`${this.url}/${id}`)
  }
  
  getById(id: number): Observable<LsGetPost>{
    return this.http.get<LsGetPost>(`${this.url}/${id}`)
  }
  
  getAll(): Observable<LsAllPosts>{
    return this.http.get<LsAllPosts>(`${this.url}`)
  }
  
}
