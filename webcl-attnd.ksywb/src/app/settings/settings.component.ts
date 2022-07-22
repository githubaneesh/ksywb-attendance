import { Component,OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserAuthentificationService} from "../service/userAuthentication.service";

import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Office} from "./office.interface";
import { OfficeDetailsService } from '../service/officeDetails.service';
import { DateService } from '../service/date.service';
import { retry } from 'rxjs/operator/retry';
import {CompanyDetailsService} from "../service/companyDetails.service";
@Component({
    selector: 'settings',
    styleUrls: [ './settings.component.css' ],
    templateUrl:'./settings.component.html'
})

export class SettingsComponent implements OnInit
{
  public user;
  public bEdit:Boolean=false;
  public formGroup: FormGroup;
  public office:Office;
  public modesArray:Array<any>
  public companies:any;
  public isOfficeIdPresent:Boolean;
  public isOfficeEdit:Boolean=false;
  public isCompanyEdit:Boolean=false;
  public hourArray: Array<any>;
  public lunchHourArray: Array<any>;
  public minsArr: Array<any>;
  public strMessage:string;
  constructor(private userService:UserAuthentificationService,
              private officeService:OfficeDetailsService,
              private date_service:DateService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private companyService:CompanyDetailsService
            )
 {
        if(this.userService.isLoggedIn()!=null)
        {
           this.userService.loginDone();
        }
        else
        {
           this.userService.navigateToUrl('login');
        }
  }
  public ngOnInit()
  {
     this.initformGroup();
     this.configTimeOptions();
     this.activatedRoute.params.subscribe((params: Params) => {
       let officeId = params['id'];
       if(officeId)
       {
            this.isOfficeIdPresent = true;
            this.officeService.getOffices(this.userService.getUserToken(),officeId).then((result)=>{
              this.office = (result as any).data;
              console.log(" this.office   ", this.office);
            })
            this.officeService.getOfficeModes(this.userService.getUserToken()).then((result)=>{
              console.log("modes result",result);
              this.modesArray = (result as any).data.map(function (mode , key){
                let _mode:any= {};
                _mode.value = Object.keys(mode);
                _mode.label = mode[_mode.value];
                return _mode;
              })


             /* this.modesArray = (result as any).data.map((mode)=>{
                  let _mode:any= new Object();
                  _mode.value = Object.keys(mode);
                  _mode.label =Object.values( mode)
                  return _mode;
                }); */
            })
       }
       else
       {
        this.isOfficeIdPresent = false;
        this.officeService.getCompanyList(this.userService.getUserToken()).then(result => {
          if ((result as any).error_code == 0) {
            this.companies = (result as any).data
            console.log("this.companies ", this.companies);
          }
        }).catch(error => {
          if (error) {}
        })
       }


    });
  }
  protected configTimeOptions()
  {
    this.hourArray = this.date_service.getHoursArr();
    this.lunchHourArray = this.date_service.getHoursArr().slice(0).map(function (item) {
      return ["12","13","14"].indexOf(item.value)!==-1
    })
    console.log("lunchHourArray",this.lunchHourArray)
    this.minsArr = this.date_service.getMinsArr();
  }
  protected initformGroup()
  {
    this.formGroup = new FormGroup({});
    this.formGroup.addControl('selectMaxFNHr', new FormControl());
    this.formGroup.addControl('selectMaxFNMin', new FormControl());
    this.formGroup.addControl('selectMinANHr', new FormControl());
    this.formGroup.addControl('selectMinANMin', new FormControl());
    this.formGroup.addControl('selectFromHr', new FormControl());
    this.formGroup.addControl('selectFromMin', new FormControl());
    this.formGroup.addControl('selectToHr', new FormControl());
    this.formGroup.addControl('selectToMin', new FormControl());
    this.formGroup.addControl('selectLatePermissionHr', new FormControl());
    this.formGroup.addControl('selectLatePermissionMin', new FormControl());
    this.formGroup.addControl('selectLunchBreakHr', new FormControl());
    this.formGroup.addControl('selectLunchBreakMin', new FormControl());
    this.formGroup.addControl('selectEarlyPermissionHr', new FormControl());
    this.formGroup.addControl('selectEarlyPermissionMin', new FormControl());
    this.formGroup.addControl('selectMode', new FormControl());
  }
  modeSlected(event)
  {
    console.log("event ",event);
    if(event.value =="0")
    {
      return ;
    }
    this.office.mode = event.value;
  }
  UpdateOffice(valid)
  {
    if(this.office.name =='')
    {
      this.strMessage=" office Name required";
      return;
    }
    else if(this.office.address =='')
    {
      this.strMessage=" office address required";
      return;
    }
    delete this.office.employees ;
    let maxFNhr = this.formGroup.value['selectMaxFNHr'];
    let maxFNmin = this.formGroup.value['selectMaxFNMin'];
    this.office.maxFNTime = (maxFNhr && maxFNmin)? maxFNhr + ":" + maxFNmin:null;

    let minANhr = this.formGroup.value['selectMinANHr'];
    let minANmin = this.formGroup.value['selectMinANMin'];
    this.office.maxFNTime = (minANhr && minANmin)? minANhr + ":" + minANmin:null;
   if(valid){
      if(this.userService.isLoggedIn()){
        this.officeService.updateOffice(this.office,this.userService.getUserToken()).then(result => {
          console.log("result   ",result);
          if ((result as any).error_code == 0) {
            this.isOfficeEdit=false;
            // this.showPopup((result as any).data);
           }
        }).catch(error => {
          if (error) {}
        })
       }
    }
}
UpdateCompany(valid)
{
    console.log("UpdateCompany calling");
    if(this.companies.name == '')
    {
      this.strMessage=" Company name required";
      return ;
    }
    delete this.companies.leaves ;
    delete this.companies.offices ;

    let maxFNhr = this.formGroup.value['selectMaxFNHr'];
    let maxFNmin = this.formGroup.value['selectMaxFNMin'];
    this.companies.maxFNTime = (maxFNhr && maxFNmin)? maxFNhr + ":" + maxFNmin: this.companies.maxFNTime;

    let minANhr = this.formGroup.value['selectMinANHr'];
    let minANmin = this.formGroup.value['selectMinANMin'];
    this.companies.minANTime = (minANhr && minANmin)? minANhr + ":" + minANmin: this.companies.minANTime;

    let fromHr = this.formGroup.value['selectFromHr'];
    let fromMin = this.formGroup.value['selectFromMin'];
    this.companies.from = (fromHr && fromMin)? fromHr + ":" + fromMin:null;

    let toHr = this.formGroup.value['selectToHr'];
    let toMin = this.formGroup.value['selectToMin'];
    this.companies.to = (toHr && toMin)? toHr + ":" + toMin:null;

    let lpHr = this.formGroup.value['selectLatePermissionHr'];
    let lpMin = this.formGroup.value['selectLatePermissionMin'];
    this.companies.latepermission = (lpHr && lpMin)? lpHr + ":" + lpMin:null;

    let lbHr = this.formGroup.value['selectLunchBreakHr'];
    let lbMin = this.formGroup.value['selectLunchBreakMin'];
    this.companies.lunchbreak = (lbHr && lbMin)? lbHr + ":" + lbMin:null;

    let epHr = this.formGroup.value['selectEarlyPermissionHr'];
    let epMin = this.formGroup.value['selectEarlyPermissionMin'];
    this.companies.earlypermission = (epHr && epMin)? epHr + ":" + epMin:null;
    console.log("this.companies   ",this.companies)

    if(valid){
      if(this.userService.isLoggedIn()){
         this.companyService.updateCompany(this.companies,this.userService.getUserToken()).then(result => {
          console.log("Company result   ",result);
          if ((result as any).error_code == 0) {
            this.isCompanyEdit=false;
           }
        }).catch(error => {

          if (error) {}
        })
       }
    }





}






}
