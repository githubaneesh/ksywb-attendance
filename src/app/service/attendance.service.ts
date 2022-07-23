import { Injectable } from "@angular/core";
import { Http, Headers, Response, Request, RequestMethod, URLSearchParams, RequestOptions } from "@angular/http";
import {apiPath} from "../api-path.constant";

@Injectable()
export class AttendanceService
{
 rootUrl:string=apiPath+"api/";

 constructor(private http:Http) {
    this.http = http;
  }

public addAttendance(postData,token)
  {
    //console.log('addAttendance in AttendanceService');
    var returnReponse = new Promise((resolve, reject) => {

            this.http.post(this.rootUrl+"add/attendance",this.getFormData(postData),this.getRequestOptions(token) ).subscribe(
            res => {
              //console.log('addAttendance ',res);
              resolve(JSON.parse((res as any)._body));
            },
            error => {
              reject(error);
            }
          );
        });
      return returnReponse;

  }
public addLeave(postData,token)
  {
    //console.log('addAttendance in AttendanceService');
    var returnReponse = new Promise((resolve, reject) => {

            this.http.post(this.rootUrl+"leave/add/v2",this.getFormData(postData),this.getRequestOptions(token) ).subscribe(
            res => {
              //console.log('addLeave ',res);
              resolve(JSON.parse((res as any)._body));
            },
            error => {
              reject(error);
            }
          );
        });
      return returnReponse;

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

}
