import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Loading } from '@shared/sharedImports';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, FormsModule, Loading],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  private authService = inject(AuthService)
  maskLoad = signal(false)

  currentLang: 'es' | 'en' | 'fr' = window.location.host == 'localhost:4201' ? 'es'
  : window.location.host == 'localhost:4202' ? 'en'
  : 'fr'

  logout(){
    this.authService.logout().subscribe()
  }

  changeLang(){
    this.maskLoad.set(true)
    const urls = {
      'es': 'http://localhost:4201',
      'en': 'http://localhost:4202',
      'fr': 'http://localhost:4203',
    }
    window.location.href = urls[this.currentLang] ?? '/';
  }

}
