/**
 * Created by ashishbaheti on 03/03/17.
 */
import {Injectable, EventEmitter} from "@angular/core";
import {ActivatedRoute, Router} from '@angular/router';
import {Http, Headers, Response, Request, RequestMethod, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map'
import {User} from "../register/user.interface";
import {ResponseContentType} from "@angular/http";
import {apiPath} from "../api-path.constant";
declare var $: any;

@Injectable()
export class UserAuthentificationService {
  requestUrl: string;
  responseData: any;
  handleError: any;
  protected userToken: string = null;
  protected rootPath: string = apiPath;
  //protected rootPath:string="http://api-attendance.ksywb.in";
  //protected rootPath:string="http://192.168.0.102:3000";

  protected apiPath: string = "api";
  protected authPath: string = "auth/login";
  protected logoutPath:string = "auth/logout";
  logInDone: EventEmitter<string> = new EventEmitter();
   
  constructor(private router: Router,
              private http: Http,) {
    //console.log('localStorage.getItem()', localStorage.getItem('currentUser'))
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var time = (new Date()).getTime();
    var expired = (currentUser) ? currentUser.expires<time : true;
    if(expired){
      localStorage.removeItem('currentUser');
    }
    this.userToken = expired?null:((currentUser) ? currentUser.token : null);
    this.loginDone();
  }

  loginDone() {
    this.logInDone.emit('loginDone');
  }

  getLogEventEmitter() {
    return this.logInDone;
  }

  login(postData: any) {


    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({headers: headers});
    let formData: FormData = new FormData();
    if (postData !== "" && postData !== undefined && postData !== null) {
      for (var property in postData) {
        if (postData.hasOwnProperty(property)) {
          formData.append(property, postData[property]);
        }
      }
    }
    //console.log(formData);
    var returnReponse = new Promise((resolve, reject) => {
      this.http.post(this.rootPath + this.authPath, formData, options).subscribe(
        res => {
          //console.log('res ',res);
          localStorage.removeItem('currentUser');
          this.responseData = res.json();
          //console.log('this.responseData  ',this.responseData);

        if ( this.responseData &&  this.responseData.data && this.responseData.data.token) {
                    //console.log(this.responseData.data)
                    this.userToken = this.responseData.data.token;
                    localStorage.setItem('currentUser', JSON.stringify({
                      username: this.responseData.data.user.name,
                      token: this.userToken,
                      expires:this.responseData.data.expires,
                      role:this.responseData.data.user.role.machine_name
                    }));
                    this.loginDone();
                  }
                  resolve(this.responseData);
         },
        error => {
          reject(error);
        }
      );
    });
    return returnReponse;
  }

  getUserToken() {

    return this.userToken
  }
  getUser()
  {
     return this.responseData ;
  }
  verifyLoginElseRedirect() {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var time = (new Date()).getTime();
    var expired = (currentUser) ? currentUser.expires<time : true;
    if(expired){
      localStorage.removeItem('currentUser');
    }
    this.userToken = expired?null:((currentUser) ? currentUser.token : null);
    if(this.userToken==null){
      this.navigateToUrl("")
    }
  }
  isLoggedIn() {
    this.verifyLoginElseRedirect();
    return this.userToken != null;
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.userToken = null;
    localStorage.removeItem('currentUser');
    this.loginDone();
  }
  logoutClickhandler()
  {
     var returnReponse = new Promise((resolve, reject) => {
      this.http.post(this.rootPath + this.logoutPath, this.getUserToken()).subscribe(
        res => {
          //console.log('res ',res);
           this.responseData = res.json();
           resolve(this.responseData);
         },
        error => {
          reject(error);
        }
      );
    });
    return returnReponse;
  }

  navigateToUrl(url)
  {
    this.router.navigate(['/'+url]);
  }
  isSuperAdmin()
  {
     var currentUser = JSON.parse(localStorage.getItem('currentUser'));
     return currentUser.role=='super_admin';
  }
  isAdmin()
  {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return    currentUser && currentUser.role == 'administrator';
  }
  isUser()
  {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser.role != 'administrator' && currentUser.role != 'super_admin';
  }
  getCurrentUserRole()
  {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser.role  ;
  }

}
