/*
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';
import { UserAuthentificationService } from "./service/userAuthentication.service";
import { ActivatedRoute, Router } from '@angular/router';
/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public angularclassLogo = 'assets/img/angularclass-avatar.png';
  public name = 'Angular 2 Webpack Starter';
  public url = 'https://twitter.com/AngularClass';
  public userLoggedIn:Boolean=false;
  public subscription: any;
  public logoutSubscription:any;
  constructor(
    public appState: AppState,private user_service: UserAuthentificationService,private router: Router
  ) {
    this.subscription = this.user_service.getLogEventEmitter()
      .subscribe(() => this.logEvent());


  }
  public ngOnInit(){
    this.subscription = this.user_service.getLogEventEmitter()
      .subscribe(() => this.logEvent());  
      
  }
  logEvent() {   
    this.userLoggedIn = this.user_service.isLoggedIn();
  }
  logout(){
    this.user_service.logout();
  }
  logoutClickhandler()
  {
  this.user_service.logoutClickhandler().then(result=>{
             if((result as any).error_code==0)
             {
                this.userLoggedIn = false;
                 this.navigateToURL('logout');
             }
        }).catch(error =>{
            //console.log("error",error);
            if(error){}
        });
  }
   loginClickhandler()
   {
     this.navigateToURL('login');
   }
   avatarClickhandler()
   {
      document.getElementById("myDropdown").classList.toggle("show");
   }
  navigateToURL(url)
  {
    console.log('url  '+ url);
   this.router.navigate(['/'+url]);
  }
  isSuperAdmin()
  {
   return this.user_service.isSuperAdmin();
  }
  isAdmin()
  {
   return this.user_service.isAdmin();
  }
}
