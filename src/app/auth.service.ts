import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User } from './user'
import { finalize, catchError} from 'rxjs/operators';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

    private authenticated$ = new BehaviorSubject(false);
    currentUser: User = this.emptyUser()

    get isAuthenticated() {
        return this.authenticated$;
    }
    
    constructor(private http: HttpClient, private router: Router) {
    }
    
    authenticate(username: String, password: String) {
        const headers = new HttpHeaders(username && password ? {
                authorization : 'Basic ' + btoa(username + ':' + password),
                withCredentials : 'true'
            } : {});
            
        this.http.get<User>('//localhost:8080/authenticate', {headers: headers, withCredentials: true, responseType: 'json'})
            .pipe(catchError(
                (error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        alert('Bad username or password! Verify your credentials.');
                    } else {
                        alert('Sorry, something went wrong. Try again later.');
                    }
                    return throwError(() => error);
                }))
            .subscribe((user) => {
                if (user) {
                    this.authenticated$.next(true);
                    this.currentUser = {username: user.username, enabled: user.enabled};
                    this.router.navigateByUrl("");
                } else {
                    this.authenticated$.next(false);
                    this.currentUser = this.emptyUser();
                }
            });
    }

    emptyUser() : User {
        return {username: '', enabled: true};
    }

    logout() {
        this.http.post('//localhost:8080/logout', {}, {withCredentials: true, responseType: 'text'})
            .pipe(finalize(() => {
                this.authenticated$.next(false);
                this.currentUser = this.emptyUser();
            }))
            .subscribe();
    }

}