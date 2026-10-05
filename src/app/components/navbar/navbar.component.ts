import { Component, Input } from '@angular/core';
import { User } from '../../models/user';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  @Input() users: User[] = [];
  @Input() paginator = {};
}
