import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'login-form',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  username = '';
  password = '';

  constructor(public auth: AuthService, private http: HttpClient, private router: Router) {
  }

  login() {
    this.auth.authenticate(this.username, this.password);
    this.username = ''
    this.password = ''
  }
  
  logout() {
    this.auth.logout();
  }

}