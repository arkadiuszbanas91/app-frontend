import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../user';
import { catchError, of, throwError } from 'rxjs';
import { CreateUserService } from '../createuser/createuser.service';

@Component({
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  
  users: User[] = [];

  constructor(public auth: AuthService, private http: HttpClient, private createUserService: CreateUserService) {
    if (auth.isAuthenticated.getValue()) {
      this.reloadUsers();
    }
    auth.isAuthenticated.subscribe(authenticated => {
      if (authenticated) {
        this.reloadUsers();
      }
    });
    createUserService.lastCreatedUsername.subscribe(lastUsername => {
      if (auth.isAuthenticated.getValue()) {
        this.reloadUsers();
      }
    });
  }

  currentUser() {
    return this.auth.currentUser;
  }

  reloadUsers() {
    this.http.get('//localhost:8080/users', {withCredentials: true})
      .subscribe(data => {
        this.users = []
        Object.entries(data).forEach((key) => this.users.push({username: key[1].username, enabled: key[1].enabled}));
      });
  }

  changeUserStatus(user: User) {
    if (confirm('Are you sure you want to ' + (user.enabled ? 'disable' : 'enable') + ' user @' + user.username + '?')) {
      user.enabled = !user.enabled;
      this.http.put('//localhost:8080/users/' + user.username + '?enable=' + user.enabled, {}, {withCredentials: true})
        .pipe(catchError(
          err => {
            alert('Sorry, something went wrong. Try again later.');
            console.error(err);
            return throwError(() => err);
          }))
        .subscribe(this.reloadUsers.bind(this));
    }
  }

  removeUser(user: User) {
    if (confirm('Are you sure you want to ' + (user.enabled ? 'disable' : 'enable') + ' user @' + user.username + '?')) {
      user.enabled = !user.enabled;
      this.http.delete('//localhost:8080/users/' + user.username, {withCredentials: true})
        .pipe(catchError(
          err => {
            alert('Sorry, something went wrong. Try again later.');
            console.error(err);
            return throwError(() => err);
          }))
        .subscribe(this.reloadUsers.bind(this));
    }
  }

}