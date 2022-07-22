/**
 * Created by ashishbaheti on 28/05/17.
 */
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers, Response, Request, RequestMethod, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import {ResponseContentType} from "@angular/http";
import {apiPath} from "../api-path.constant";
declare var $: any;

@Injectable()
export class ApiService {
  requestUrl: string;
  responseData: any;
  handleError: any;
  empArr:Array<any>;
  rootUrl:string=apiPath+"api/";
  //rootUrl:string="http://192.168.0.102:3000/api/";
  //rootUrl:string="http://api-attendance.ksywb.in/api/";
  constructor(private router: Router,
              private http: Http,
  ) {
    this.http = http;
  }
  protected getRequestOptions(token):RequestOptions{
    let headers = new Headers();
    headers.append('x-access-token',token);
    //console.log(token);
    return new RequestOptions({ headers: headers });


  }
  protected getFormData(postData):FormData{
    let formData:FormData = new FormData();

    if (postData !== "" && postData !== undefined && postData !== null) {
      for (var property in postData) {
        if (postData.hasOwnProperty(property)) {
          formData.append(property, postData[property]);
        }
      }
    }
    return formData;
  }

  getEmployeeList(token)
  {
    let postData = {office:'5928557effae6e202e504c7f'}
    var returnReponse = new Promise((resolve, reject) => {
      this.http.post(this.rootUrl+"employee/get",this.getFormData(postData),this.getRequestOptions(token)).subscribe(
        res => {
          //console.log("res",res);
          this.responseData = res;
          if(res.ok){
            resolve(JSON.parse(this.responseData._body));
          }
        },
        error => {
          reject(error);
        }
      );
    });
    return returnReponse;
  }
  getUserRoles(usrToken)
  {
    var returnReponse = new Promise((resolve, reject) => {
      this.http.get(this.rootUrl+"user/roles",this.getRequestOptions(usrToken)).subscribe(
        res => {
          //console.log("res",res);
          this.responseData = res;
          if(res.ok){
            resolve(JSON.parse(this.responseData._body));
          }
        },
        error => {
          reject(error);
        }
      );
    });
    return returnReponse;
  }
  createUser(postData,userToken)
  {

    var returnReponse = new Promise((resolve, reject) => {
      this.http.post(this.rootUrl+"user/create",this.getFormData(postData),this.getRequestOptions(userToken)).subscribe(
        res => {
          //console.log("res",res);
          this.responseData = res;
          if(res.ok){
            resolve(JSON.parse(this.responseData._body));
          }
        },
        error => {
          reject(error);
        }
      );
    });
    return returnReponse;

  }
  updateUser(postData,userToken)
  {

    var returnReponse = new Promise((resolve, reject) => {
      this.http.post(this.rootUrl+"user/update",this.getFormData(postData),this.getRequestOptions(userToken)).subscribe(
        res => {
          //console.log("res",res);
          this.responseData = res;
          if(res.ok){
            resolve(JSON.parse(this.responseData._body));
          }
        },
        error => {
          reject(error);
        }
      );
    });
    return returnReponse;

  }
  deleteUser(postData,userToken)
  {

    var returnReponse = new Promise((resolve, reject) => {
      this.http.post(this.rootUrl+"user/delete",this.getFormData(postData),this.getRequestOptions(userToken)).subscribe(
        res => {
          //console.log("res",res);
          this.responseData = res;
          if(res.ok){
            resolve(JSON.parse(this.responseData._body));
          }
        },
        error => {
          reject(error);
        }
      );
    });
    return returnReponse;

  }

  resetUserpassword(postData,userToken)
  {

    var returnReponse = new Promise((resolve, reject) => {
      this.http.post(this.rootUrl+"user/resetpass",this.getFormData(postData),this.getRequestOptions(userToken)).subscribe(
        res => {
          //console.log("res",res);
          this.responseData = res;
          if(res.ok){
            resolve(JSON.parse(this.responseData._body));
          }
        },
        error => {
          reject(error);
        }
      );
    });
    return returnReponse;

  }
  getUsers(usrToken)
  {
    var returnReponse = new Promise((resolve, reject) => {
      this.http.get(this.rootUrl+"user/get",this.getRequestOptions(usrToken)).subscribe(
        res => {
          //console.log("res",res);
          this.responseData = res;
          if(res.ok){
            resolve(JSON.parse(this.responseData._body));
          }
        },
        error => {
          reject(error);
        }
      );
    });
    return returnReponse;
  }
 getHolidayList(postData,userToken)
  {

    var returnReponse = new Promise((resolve, reject) => {
      this.http.post(this.rootUrl+"holiday/get",this.getFormData(postData),this.getRequestOptions(userToken)).subscribe(
        res => {
          this.responseData = res;
          if(res.ok){
            resolve(JSON.parse(this.responseData._body));
          }
        },
        error => {
          reject(error);
        }
      );
    });
    return returnReponse;
  }
  deleteHoliday(postData,userToken)
  {

    var returnReponse = new Promise((resolve, reject) => {
      this.http.post(this.rootUrl+"holiday/delete",this.getFormData(postData),this.getRequestOptions(userToken)).subscribe(
        res => {
          this.responseData = res;
          if(res.ok){
            resolve(JSON.parse(this.responseData._body));
          }
        },
        error => {
          reject(error);
        }
      );
    });
    return returnReponse;
  }
  post(url,postData,userToken)
  {

    var returnReponse = new Promise((resolve, reject) => {
      this.http.post(this.rootUrl+url,this.getFormData(postData),this.getRequestOptions(userToken)).subscribe(
        res => {
          this.responseData = res;
          if(res.ok){
            resolve(JSON.parse(this.responseData._body));
          }
        },
        error => {
          reject(error);
        }
      );
    });
    return returnReponse;
  }


  get(url,usrToken)
  {
    var returnReponse = new Promise((resolve, reject) => {
      this.http.get(this.rootUrl+url,this.getRequestOptions(usrToken)).subscribe(
        res => {
          //console.log("res",res);
          this.responseData = res;
          if(res.ok){
            resolve(JSON.parse(this.responseData._body));
          }
        },
        error => {
          reject(error);
        }
      );
    });
    return returnReponse;
  }

}
