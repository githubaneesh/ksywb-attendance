import { Component, OnInit } from '@angular/core';
import { UserAuthentificationService } from "../service/userAuthentication.service";
 import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'login',
  styleUrls: [ './login.component.css' ],
  templateUrl: './login.component.html'

})


export class LoginComponent implements OnInit {
 public user : {};
  public userLoggedIn:Boolean=false;
  public error:String = '';
  public loading:boolean;
 constructor(private router: Router,private user_service: UserAuthentificationService) {
   this.user_service = user_service;
   this.router=router;
 }
public ngOnInit()
  {
/* this.user = {
        mobile :"1234567891",
        password:"OrArt5M@yil"
    };*/
    this.user = {
      mobile :"",
      password:""
  };
  
    this.user_service.logout();
  }

public Submit (invalid: boolean) {
    //console.log(invalid);
    if(invalid){
     // let _this = this;
      this.user_service.login(this.user).then(result =>{
        //console.log('result',result);
        if ((result as any).error_code === 0) {
          // login successful
          this.userLoggedIn = this.user_service.isLoggedIn();
          //console.log(this.userLoggedIn);
          if(this.userLoggedIn)
          {
            this.router.navigate(['/attendance']);
          }
        } else {
          // login failed
          this.error = 'Username or password is incorrect';
          this.loading = false;
        }

      }).catch(error =>{
        //console.log("error",error);
      })
    }
  }
}
