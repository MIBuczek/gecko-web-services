import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth/auth.service';

@Component({
  selector: 'app-admin-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {

  constructor(private auth: AuthService, private router: Router) {

  }

  /* Listener to tract vertical and horizontal pixels */
  @HostListener('window:scroll', ['$event'])
  checkPosition(): boolean {
    return window.scrollY > 60
  }

  async logOut(): Promise<void> {
    this.auth.logout()
    await this.router.navigate(['main-page'])
  }
}
