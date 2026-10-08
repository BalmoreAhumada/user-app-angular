import { Component, inject, Input } from '@angular/core';
import { User } from '../../models/user';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  @Input() users: User[] = [];
  @Input() paginator = {};

  get login(){
    return this.authService.user;
  }

  get admin(){
    return this.authService.isAdmin();
  }

  handlerLogout(){
    this.authService.logout();
    this.router.navigate(['/login'])
  }
}
