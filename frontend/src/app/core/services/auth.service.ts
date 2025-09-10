import { inject, Injectable } from '@angular/core';
import { environment } from 'enviroments/enviroment';
import { noInterceptToken } from './token.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LsLogin, LsRegister, LsResAuth } from '@models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private url = `${environment.url_api}/auth`
  private noToken = { context: noInterceptToken() }

  private http = inject(HttpClient)
  private router = inject(Router)

  constructor(){}

  login(data: LsLogin): Observable<LsResAuth>{
    return this.http.post<LsResAuth>(`${this.url}/login`, data, this.noToken)
  }

  register(data: LsRegister): Observable<LsResAuth>{
    return this.http.post<LsResAuth>(`${this.url}/register`, data, this.noToken)
  }

  saveAuth(data: LsResAuth){
    localStorage.setItem('auth', JSON.stringify(data.data))
  }

  getAuth(): LsResAuth | boolean{
    try{
      return JSON.parse((localStorage.getItem('auth') as string))
    }catch{
      this.logout()
      return false
    }
  }

  getToken(): string{
    const auth: any = this.getAuth()
    return auth?.token
  }

  loggedIn(){
    const token = this.getAuth() as LsResAuth
    return token ? true : false
  }

  logout(){
    localStorage.removeItem('auth')
    this.router.navigate(['/auth/login'])

    return this.http.post<LsResAuth>(`${this.url}/logout`, {})
  }

}
