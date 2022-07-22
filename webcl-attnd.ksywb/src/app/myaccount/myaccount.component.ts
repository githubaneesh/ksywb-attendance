import { Component,OnInit} from "@angular/core";

import {UserAuthentificationService} from "../service/userAuthentication.service";

import { ActivatedRoute, Router } from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { concat } from 'rxjs/observable/concat';

@Component({
    selector: 'myaccount',
    styleUrls: [ './myaccount.component.css' ],
    templateUrl:'./myaccount.component.html'
})

export class MyAccountComponent implements OnInit
{
  public user;
  public bProfilePage:Boolean=false;
  public bSettingsPage:Boolean=false;
  public bLogouPage:Boolean=false;
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
     
  }
  profileClickhandler()
  {
    this.bProfilePage=true;
    this.bSettingsPage=false;
    this.bLogouPage=false;
  }
  settingsClickhandler()
  {
    this.bProfilePage=false;
    this.bSettingsPage=true;
    this.bLogouPage=false;

  }
  /*logoutClickhandler()
  {
    this.bProfilePage=false;
    this.bSettingsPage=false;
    this.bLogouPage=true;
  }*/
  
  
  
  
  
}
