import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../services/sharing-data.service';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './user-app.component.html',
  styleUrl: './user-app.component.css',
})
export class UserAppComponent implements OnInit {
  users: User[] = [];
  paginator: any = {};

  constructor(
    private router: Router,
    private userService: UserService,
    private sharingDataService: SharingDataService,
    private authService: AuthService,
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
    this.loginHandler();
  }

  loginHandler() {
    this.sharingDataService.handlerLoginEventEmitter.subscribe(
      ({ username, password }) => {
        //console.log(username + ' + ' + password);

        this.authService.loginUser({ username, password }).subscribe({
          next: (response) => {
            const token = response.token;
            //console.log(token);
            const payload = this.authService.getPayload(token);
            //console.log(payload);
            const user = { username: payload.sub };
            const login = {
              user: user,
              isAuth: true,
              isAdmin: payload.isAdmin,
            };

            this.authService.token = token;
            this.authService.user = login;
            this.router.navigate(['/users/page/0']);
          },
          error: (error) => {
            if (error.status == 401) {
              console.log(error.error);
              Swal.fire(
                'Error en el login',
                'username o password incorrectos!',
                'error',
              );
            } else {
              throw error;
            }
          },
        });
      },
    );
  }

  pageUsersEvent() {
    this.sharingDataService.pageUsersEventEmitter.subscribe((pageable) => {
      this.users = pageable.users;
      this.paginator = pageable.paginator;
    });
  }

  findUserById() {
    this.sharingDataService.findUserByIdEventEmitter.subscribe((id) => {
      const user = this.users.find((user) => user.id == id);
      this.sharingDataService.selectUserEventEmitter.emit(user);
    });
  }

  addUser() {
    this.sharingDataService.newUserEventEmitter.subscribe((user) => {
      if (user.id > 0) {
        this.userService.update(user).subscribe({
          next: (userUpdated) => {
            this.users = this.users.map((u) =>
              u.id == userUpdated.id ? { ...userUpdated } : u,
            );
            this.router.navigate(['/users/page/0'], {
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
              this.sharingDataService.errorUserFormEventEmitter.emit(err.error);
            }
          },
        });
      } else {
        this.userService.create(user).subscribe({
          next: (userNew) => {
            console.log(user);
            this.users = [...this.users, { ...userNew }];
            this.router.navigate(['/users/page/0'], {
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
              this.sharingDataService.errorUserFormEventEmitter.emit(err.error);
            }
          },
        });
      }
    });
  }

  removeUser(): void {
    this.sharingDataService.idUserEventEmitter.subscribe((id) => {
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
