import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User } from '../user'
import { finalize, catchError, map, tap} from 'rxjs/operators';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { Router } from '@angular/router';


@Injectable()
export class CreateUserService {

    private created$ = new BehaviorSubject<String>('');
    private error$ = new BehaviorSubject<String>('');

    constructor (private http: HttpClient) {
    }

    createUser(user: User) {
        return this.http.post('//localhost:8080/users', user, {withCredentials: true})
            .subscribe({
                next: () => this.created$.next(user.username),
                error: (error: HttpErrorResponse) => this.error$.next(error.error)
            });
    }

    get lastCreatedUsername() {
        return this.created$;
    }

    get lastError() {
        return this.error$;
    }
}