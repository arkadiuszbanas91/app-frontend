import { HttpClient } from '@angular/common/http';
import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { catchError, throwError } from 'rxjs';
import { User } from '../user';
import { CreateUserService } from './createuser.service';

@Component({
    selector: 'createuser-modal',
    templateUrl: './createusermodal.component.html'
})
export class CreateUserModalComponent {

    @Input() name = {};

    error: String = '';
    user: User = this.emptyUser();

    constructor(public activeModal: NgbActiveModal, private http: HttpClient, public createUserService: CreateUserService) {
        createUserService.lastCreatedUsername.asObservable().subscribe(() => {
            this.user = this.emptyUser();
            this.activeModal.close();
        })
        createUserService.lastError.asObservable().subscribe(error => {
            this.error = error;
        })
    }

    createUser() {
        this.createUserService.createUser(this.user);
    }

    private emptyUser() : User {
        return {username: '', password: '', enabled: true}
    }
}


@Component({
  selector: 'createuser', 
  templateUrl: './createuser.html'
})
export class CreateUserComponent {

    constructor(private modalService: NgbModal) {}

    open() {
        const modalRef = this.modalService.open(CreateUserModalComponent);
        modalRef.componentInstance.name = 'CreateUser';
        modalRef.componentInstance.error = '';
    }
}