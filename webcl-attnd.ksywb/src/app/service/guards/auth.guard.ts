/**
 * Created by ashishbaheti on 27/05/17.
 */
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {UserAuthentificationService} from "../userAuthentication.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,private user_service: UserAuthentificationService) { }

  canActivate() {
    return this.user_service.isLoggedIn();
  }
}
