import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers, Response, Request, RequestMethod, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import {ResponseContentType} from "@angular/http";
import {apiPath} from "../api-path.constant";
declare var $: any;

@Injectable()
export class CompanyDetailsService {
  requestUrl: string;
  responseData: any;
  handleError: any;
  companyDetails: any;
  rootUrl:string=apiPath+"api/";
 
  constructor(private router: Router,private http: Http) 
  {
    
  }
  getCompanyDetails(token)
  {
    
      let headers = new Headers();      
      headers.append('x-access-token',token);  
      let options = new RequestOptions({ headers: headers });
      let formData:FormData = new FormData();      
      var returnReponse = new Promise((resolve, reject) => {
        this.http.get(this.rootUrl+"offices/companies",options).subscribe(
          res => {
             console.log("res",res);
            if(res.ok){
              this.companyDetails = JSON.parse((res as any)._body);  
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
    updateCompany(postData,userToken)
    {

      console.log("updateCompany companyService  " )
      var returnReponse = new Promise((resolve, reject) => {
      this.http.post(this.rootUrl+"company/update",this.getFormData(postData),this.getRequestOptions(userToken)).subscribe(
          res => {      
            console.log(res);      
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
    protected getRequestOptions(token):RequestOptions{
      let headers = new Headers();
      headers.append('x-access-token',token);       
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