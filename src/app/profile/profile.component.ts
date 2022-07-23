import { Component,OnInit} from "@angular/core";

import {UserAuthentificationService} from "../service/userAuthentication.service";

import { ActivatedRoute, Router } from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'profile',
    styleUrls: [ './profile.component.css' ],
    templateUrl:'./profile.component.html'
})

export class ProfileComponent implements OnInit
{
  public user;
  public bEdit:Boolean=false;
   form: FormGroup;
  constructor(private userService:UserAuthentificationService,
              private router: Router) {
        if(this.userService.isLoggedIn()!=null)
        {
           this.userService.loginDone();            
        }
        else
        {
           this.userService.navigateToUrl('login');
        }

  }

  public ngOnInit()
  {
    if(this.userService.isLoggedIn() != null && this.userService.getUser())
    {
      this.user = this.userService.getUser().data.user;
    } 
    else
    {
      this.userService.navigateToUrl('login');
    }
    
  }
  editButtonClickhandler()
  {
    this.bEdit=true;
  }
  onSubmit()
  {
    this.bEdit=false;
  }
  cancelClickHandler()
  {
    this.bEdit=false; 
  }
  
  
}
