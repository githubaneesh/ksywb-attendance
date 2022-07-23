import { Component,OnInit} from "@angular/core";
import { error } from 'util';
import {FormGroup} from "@angular/forms";
import {ApiService} from "../service/api.service";
import {UserAuthentificationService} from "../service/userAuthentication.service";
import {OfficeDetailsService} from "../service/officeDetails.service";
import {EmployeeDetailsService} from "../service/employeelDetails.service";
import {Router} from "@angular/router";
import {FormControl} from "@angular/forms";


@Component({
    selector: 'holidaylist',
    styleUrls: [ './timelist.component.css' ],
    templateUrl:'./timelist.component.html'
})

export class TimeListComponent implements OnInit
{

  public timeList:Array<any>=[]
  public originalTimeList:Array<any>=[]
  public formGroup: FormGroup;
  public msg:string=""
  constructor(private service:ApiService,private userService:UserAuthentificationService,
              private officeService:OfficeDetailsService,private emp_service:EmployeeDetailsService,private router: Router) {
    if(this.userService.isLoggedIn()!=null)
    {
      this.userService.loginDone();
      this.timeList=[];
      this.originalTimeList=[];
      this.formGroup = new FormGroup({});

    }
    else
    {
      this.userService.navigateToUrl('login');
    }

  }

  public ngOnInit()
  {
    this.getTimeList();
  }

  protected getTimeList(){

    this.service.get("time/v3/get",this.userService.getUserToken()).then(result => {
      console.log('result:this.service.times', result);
      this.timeList = (result as any).data.map(function (item) {
        item.edit=false;
        return item;
      });
      this.originalTimeList = (result as any).data.slice().map(function (item) {
        item.edit=false;
        return Object.assign({},item);
      });
    }).catch(error => {
      if (error) {
      }
    })
  }

  navigateToURL(url)
  {
    //console.log('url  '+ url);
    this.router.navigate(['/'+url]);
  }
  public addButtonsEvent(){
  }
  public updateTime(t){
    console.log(t);
    t.edit=true;
  }
  public save(t){
    console.log(t);
    if(t.name.length==0 || t.time.length==0){
      this.msg = "Please provide all data."
      return;
    }
    t.edit=false;
    this.service.post("time/v3/update",this.userService.getUserToken(),t).then(res=>{
      //console.log(res);
      this.getTimeList();
    })
  }
  public cancel(t,index){
    console.log(t);
    console.log(this.timeList,this.originalTimeList)
    const empId= t._id;
    t.edit=false;
    this.timeList[index] = Object.assign({},this.originalTimeList.filter(function (item) {
      return item._id === empId
    })[0])
  }


}
