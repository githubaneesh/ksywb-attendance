/**
 * Created by ashishbaheti on 03/03/17.
 */
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers, Response, Request, RequestMethod, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import {ResponseContentType} from "@angular/http";
import {apiPath} from "../api-path.constant";
declare var $: any;

@Injectable()
export class OfficeDetailsService {
  requestUrl: string;
  responseData: any;
  handleError: any;
  companyDetails: any;
  empArr:Array<any>;
  selectedOfficeID:string;
  rootUrl:string=apiPath+"api/";
 // rootUrl:string="http://api-attendance.ksywb.in/api/";
   //rootUrl:String="http://192.168.0.102:3000/api/";
  constructor(private router: Router,
              private http: Http,
  ) {
    //this.http = http;
  }
  getOfficeDetails(){
    return this.companyDetails;
  }
  getCompanyList(token)
  {
    let headers = new Headers();
    //headers.append('Accept', 'application/json');
    headers.append('x-access-token',token);

    let options = new RequestOptions({ headers: headers });

    let formData:FormData = new FormData();
    //console.log(formData);
    var returnReponse = new Promise((resolve, reject) => {
      this.http.get(this.rootUrl+"company/get",options).subscribe(
        res => {
          //console.log("res",res);
          if(res.ok){
            this.companyDetails = JSON.parse((res as any)._body);

            //console.log(this.companyDetails,'companydetails');
            resolve(JSON.parse((res as any)._body));
          }
        },
        error => {
          reject(error);
        }
      );
    });
    return returnReponse;
  }
getAttendance(year,month,officeID,token)
  {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('x-access-token',token);

    let options = new RequestOptions({ headers: headers });

    let formData:FormData = new FormData();
    //console.log(formData);
    var returnReponse = new Promise((resolve, reject) => {
      this.http.post(this.rootUrl+"get/attendance/month",{y:year,m:month,access_token:token,office:officeID}).subscribe(
        res => {
          ////console.log(res);
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
 updateAttendance(postData,token)
 {
    var returnReponse = new Promise((resolve, reject) => {

          this.http.post(this.rootUrl+"attendance/update/v2", postData,this.getRequestOptions(token) ).subscribe(
        res => {
          //console.log(res);
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

getEmployeeList (year,month,token) {

  let headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('x-access-token',token);

  let options = new RequestOptions({ headers: headers });

  let formData:FormData = new FormData();
  //console.log(formData);
  var returnReponse = new Promise((resolve, reject) => {
    //5928557effae6e202e504c7f
    this.http.post(this.rootUrl+"attendance/get",{y:year,m:month,access_token:token,office:'5928557effae6e202e504c7f'}).subscribe(
      res => {
        //console.log(res);
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
addHoliday(postData,token)
{
 var returnReponse = new Promise((resolve, reject) => {

        this.http.post(this.rootUrl+"holiday/add",this.getFormData(postData),this.getRequestOptions(token) ).subscribe(
        res => {
          //console.log(res);
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

exportExcel(postData,token)
{

     let headers = new Headers();
     headers.append("Content-Type", 'application/json');
     let options= new RequestOptions({ headers: headers , body: postData});

     var returnReponse = new Promise((resolve, reject) => {

          this.http.post(this.rootUrl+"attendance/export",options,this.getRequestOptions(token) ).subscribe(
          res => {
            //console.log(res);
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

public getOfficeID()
{
  this.selectedOfficeID=  this.companyDetails.data.offices[0]._id;
  return this.selectedOfficeID;
}
public getHolidayList(token)
  {
    var returnReponse = new Promise((resolve, reject) => {

            this.http.post(this.rootUrl+"holiday/get",{year:2017},this.getRequestOptions(token) ).subscribe(
            res => {
              //console.log(res);
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
  getOffices(usrToken,officeId=null)
  {
     var url = this.rootUrl+"offices/get";
     if(officeId)
     {
      url= url+"/"+officeId
     }
     var returnReponse = new Promise((resolve, reject) => {
      this.http.get(url,this.getRequestOptions(usrToken)).subscribe(
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
  createOffice(postData,userToken)
  {
    
    var returnReponse = new Promise((resolve, reject) => {
      this.http.post(this.rootUrl+"offices/create",this.getFormData(postData),this.getRequestOptions(userToken)).subscribe(
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
   updateOffice(postData,userToken)
   {
     
     var returnReponse = new Promise((resolve, reject) => {
       this.http.post(this.rootUrl+"offices/update",this.getFormData(postData),this.getRequestOptions(userToken)).subscribe(
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
   deleteOffice(postData,userToken)
   {
     
     var returnReponse = new Promise((resolve, reject) => {
       this.http.post(this.rootUrl+"offices/delete",this.getFormData(postData),this.getRequestOptions(userToken)).subscribe(
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
   getOfficeModes(userToken)
   {
    var returnReponse = new Promise((resolve, reject) => {
      this.http.get(this.rootUrl+"offices/mode",this.getRequestOptions(userToken)).subscribe(
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
