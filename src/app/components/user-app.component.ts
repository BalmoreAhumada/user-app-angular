import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { Router, RouterOutlet } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { SharingDataService } from '../services/sharing-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './user-app.component.html',
  styleUrl: './user-app.component.css'
})
export class UserAppComponent implements OnInit {
  users: User[] = [];
  paginator: any = {};

  constructor(
    private router: Router,
    private userService: UserService,
    private sharingData: SharingDataService,
    // private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    //this.userService.findAll().subscribe(users => this.users = users);
    // this.route.paramMap.subscribe(params => {
    //   const page = +(params.get('page') || 0);
    //   this.userService.findAllPageable(page).subscribe(pageable => this.users = pageable.content as User[]);
    // });

    this.addUser();
    this.findUserById();
    this.removeUser();
    this.pageUsersEvent();
  }

  pageUsersEvent() {
    this.sharingData.pageUsersEventEmitter.subscribe((pageable) => {
      this.users = pageable.users;
      this.paginator = pageable.paginator;
    });
  }

  findUserById() {
    this.sharingData.findUserByIdEventEmitter.subscribe((id) => {
      const user = this.users.find((user) => user.id == id);
      this.sharingData.selectUserEventEmitter.emit(user);
    });
  }

  addUser() {
    this.sharingData.newUserEventEmitter.subscribe((user) => {
      if (user.id > 0) {
        this.userService.update(user).subscribe({
          next: (userUpdated) => {
            this.users = this.users.map((u) =>
              u.id == userUpdated.id ? { ...userUpdated } : u,
            );
            this.router.navigate(['/users'], {
              state: {
                users: this.users,
                paginator: this.paginator,
              },
            });
            Swal.fire({
              title: 'Usuario Actualizado!',
              text: 'Usuario guardado con exito!',
              icon: 'success',
            });
          },
          error: (err) => {
            //console.log(err.error)
            //console.log(err.status)
            if (err.status == 400) {
              this.sharingData.erroruserFormEventEmitter.emit(err.error);
            }
          },
        });
      } else {
        this.userService.create(user).subscribe({
          next: (userNew) => {
            console.log(user);
            this.users = [...this.users, { ...userNew }];
            this.router.navigate(['/users'], {
              state: {
                users: this.users,
                paginator: this.paginator,
              },
            });
            Swal.fire({
              title: 'Nuevo usuario creado!',
              text: 'Usuario guardado con exito!',
              icon: 'success',
            });
          },
          error: (err) => {
            if (err.status == 400) {
              this.sharingData.erroruserFormEventEmitter.emit(err.error);
            }
          },
        });
      }
    });
  }

  removeUser(): void {
    this.sharingData.idUserEventEmitter.subscribe((id) => {
      Swal.fire({
        title: 'Seguro que quiere eliminar?',
        text: 'Cuidado el usuario sera eliminado del sistema!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
      }).then((result) => {
        if (result.isConfirmed) {
          this.userService.remove(id).subscribe(() => {
            this.users = this.users.filter((user) => user.id != id);
            this.router
              .navigate(['/users/create'], { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['/users'], {
                  state: {
                    users: this.users,
                    paginator: this.paginator,
                  },
                });
              });
          });
          Swal.fire({
            title: 'Eliminado!',
            text: 'Usuario eliminado con exito.',
            icon: 'success',
          });
        }
      });
    });
  }
}
