import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers, Response, Request, RequestMethod, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import {ResponseContentType} from "@angular/http";
import { Employee } from "../attendance/employee";
import {apiPath} from "../api-path.constant";
declare var $: any;

@Injectable()
export class EmployeeDetailsService {
  requestUrl: string;
  responseData: any;
  handleError: any;
  companyDetails: any;
  empArr:Array<any>;
 rootUrl:string=apiPath+"api/";
  //rootUrl:string="http://api-attendance.ksywb.in/api/";
  //rootUrl:String="http://192.168.0.102:3000/api/";
 constructor(private router: Router,private http: Http) {
    this.http = http;
  }
 getEmployeeList(postData,token)
  {
    ///let postData1 = {office:'5928fd7512505a19d52e382b'}
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
  addOrUpdateEmployee(action,token,postData)
  {
    var returnReponse = new Promise((resolve, reject) => {
      this.http.post(this.rootUrl+"employee/"+action,this.getFormData(postData) ,this.getRequestOptions(token)).subscribe(
        res => {
          ////console.log("res",res);
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
  getEmployeeFromOfficeByID(id,ArrEmp)
      {
        for(var i in ArrEmp)
        {
          console.log(ArrEmp[i].id+"=="+id);
           if(ArrEmp[i].id==id)
            {
                 return ArrEmp[i] ;
            }
        }
        return null;
      }
getEmployeeArr(arr)
        {
          //console.log('employee in arrray  ');
            let arrEmp:Array<Employee>=[];
            for(let i in arr)
            {
                //console.log('employee in arrray  '+ i);
                 let employee:Employee= {id:arr[i]._id,attendenceArr:[],designation:arr[i].designation,ein:arr[i].ein,name:arr[i].name,officeId:arr[i].officeId,pin:arr[i].pin,user:arr[i].user,
                      CLbefore:0,LTBefore:0,CLtotal:0,LTtotal:0,HPL:0,CML:0,EL:0,LWA:0,LWAM:0} ;
                 arrEmp[i]=employee;
            }
            return arrEmp
        }
   getEmployeeAttends(attends,arrdaysInMonth)
      {
        let attArr:Array<any>=new Array(arrdaysInMonth.length);
        for(var i=0;i <arrdaysInMonth.length;i++)
            {
               for(var j=0;j<attends.length;j++)
               {
                       if(attends[j].date == arrdaysInMonth.strdate)
                        {
                            attArr[i]=attends[j];

                        }
              }


         }
         return attArr;
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
