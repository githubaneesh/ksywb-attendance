import { Component, OnInit } from '@angular/core';
import { UserAuthentificationService } from "../service/userAuthentication.service";
 import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'logout',
  styleUrls: [ './logout.component.css' ],
  templateUrl: './logout.component.html'

})


export class LogoutComponent implements OnInit {
  public user : {};
  public userLoggedOut:Boolean=false;
  public error:String = '';
  public loading:boolean;
  public
 constructor(private router: Router,private user_service: UserAuthentificationService) {
   this.user_service = user_service;
   this.router=router;
 }
public ngOnInit()
  {
  }
  logoutClickhandler()
  {
      console.log("logoutClickhandler ")
      this.user_service.logoutClickhandler().then(result=>{
        console.log("result   ",result)
                if((result as any).error_code==0)
                {
                    this.userLoggedOut = true;                   
                   this.user_service.logout();
                }
            }).catch(error =>{
                //console.log("error",error);
                if(error){}
            });
  }


loginClickhandler()
{
  this.router.navigate(['/login']);
}


}
