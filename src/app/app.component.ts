import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'cascade-front';
  creatingUser = false;

  constructor(public auth: AuthService, private http: HttpClient, private router: Router) {
    this.auth.authenticate('', '');
  }

  authenticated() {
    return this.auth.isAuthenticated
  }

  some() {

  }
}

