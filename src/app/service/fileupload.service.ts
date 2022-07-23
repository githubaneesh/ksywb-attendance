/**
 * Created by ashishbaheti on 03/03/17.
 */
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers, Response, Request, RequestMethod, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import {User} from "../register/user.interface";
import {ResponseContentType} from "@angular/http";
import {apiPath} from "../api-path.constant";
declare var $: any;

@Injectable()
export class HttpClient {
  requestUrl: string;
  responseData: any;
  handleError: any;
  //rootUrl:string="http://192.168.0.102:3000/";
  rootUrl:string=apiPath;
  //rootUrl:string="http://api-attendance.ksywb.in/";
  impexcelUrl:String="api/attendance/import";
  impjsonUrl:String="upload/attendance";
  constructor(private router: Router,
              private http: Http,
  ) {
    this.http = http;

  }

  postWithFile (url: string, postData: any, files: FileList) {


    let headers = new Headers();
    headers.append('Accept', 'application/json');

    let options = new RequestOptions({ headers: headers });

    let formData:FormData = new FormData();

    var file = files[0];
    formData.append("fileup", file);


    var returnReponse = new Promise((resolve, reject) => {
      this.http.post(this.rootUrl  + url, formData, options).subscribe(
        res => {
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
  register (postData: any) {


    let headers = new Headers();
    headers.append('Accept', 'application/json');

    let options = new RequestOptions({ headers: headers });

    let formData:FormData = new FormData();

    if(postData !=="" && postData !== undefined && postData !==null){
      for (var property in postData) {
        if (postData.hasOwnProperty(property)) {
          formData.append(property, postData[property]);
        }
      }
    }
    //console.log(formData);
    var returnReponse = new Promise((resolve, reject) => {
      this.http.post(this.rootUrl  + "/api/auth/register", formData, options).subscribe(
        res => {
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
 postExcelFile ( postData: any, files: FileList) {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });
    let formData:FormData = new FormData();
    var file = files[0];
    formData.append("fileup", file);
    var returnReponse = new Promise((resolve, reject) => {
      this.http.post(this.rootUrl +this.impexcelUrl , formData, options).subscribe(
        res => {
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

  postJsonFile ( postData: any, files: FileList) {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });
    let formData:FormData = new FormData();
    var file = files[0];
    formData.append("fileup", file);
    var returnReponse = new Promise((resolve, reject) => {
      this.http.post(this.rootUrl +this.impjsonUrl , formData, options).subscribe(
        res => {
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




}
