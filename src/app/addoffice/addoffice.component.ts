import {Component, ViewChild, OnInit, NgModule} from "@angular/core";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SelectModule} from 'angular2-select';
import {EmployeeDetailsService} from '../service/employeelDetails.service';
import {Office} from './office.interface';
import {ApiService} from "../service/api.service";
import {UserAuthentificationService} from "../service/userAuthentication.service";
import {OfficeDetailsService }from "../service/officeDetails.service"
import { AlertModalComponent } from '../common/directives/modals/alert';
import {Router} from "@angular/router";
import {CompanyDetailsService} from "../service/companyDetails.service";
import { DateService } from '../service/date.service';
@Component({
  selector: 'addemployee',
  styleUrls: ['./addoffice.component.css'],
  templateUrl: './addoffice.component.html',
 /* directives: [ AlertModalComponent ]*/
})

export class AddOfficeComponent implements OnInit {
   @ViewChild(AlertModalComponent) alertmodal:AlertModalComponent;
  public office: Office;
  public strMessage : string;
  public companies:Array<any>;
  private officeID: string;
  public offices:Array<any>;
  public modesArray:Array<any>
  public formGroup: FormGroup;
  public hourArray:Array<any>;
  public minsArr:Array<any>;

  constructor(private service:ApiService,private userService:UserAuthentificationService,private office_service:OfficeDetailsService,
            private router:Router,private companyService:CompanyDetailsService,private date_service:DateService ) {
    if(this.userService.isLoggedIn()!=null)
        {
          this.userService.loginDone();
          this.initFromGroup();
        }
        else
        {
         this.userService.navigateToUrl('login');
        }
  }
  protected initFromGroup()
  {
     this.formGroup = new FormGroup({});
     this.formGroup.addControl('selectCompany', new FormControl());
     this.formGroup.addControl('selectMode', new FormControl());
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
  }
  public ngOnInit()
  {
    this.strMessage = "";
     this.office = {name: '',address: '',stgid: '',maxFNTime: '', maxANTime: '', from: '', to: '', latepermission: '', lunchbreak: '',earlypermission: '',macid:[],company:'',mode:'' };
      this.getCompanyDetails();
      this.getOfficeModes()
      this.configTimeOptions();
  }
  protected configTimeOptions()
  {
    this.hourArray = this.date_service.getHoursArr();
    this.minsArr = this.date_service.getMinsArr();

  }
  getCompanyDetails()
  {
      this.companyService.getCompanyDetails(this.userService.getUserToken()).then(result => {
      console.log(" Company detials result  ",result);
      this.companies = (result as any).data.map((company)=>{
              let _company:any ={};
              _company.id = company._id;
              _company.value = company._id;
              _company.label = company.name;
              return _company;
        })

    }).catch(error => {
      if (error) {}
    })
  }
  getOfficeModes()
  {
    this.office_service.getOfficeModes(this.userService.getUserToken()).then((result)=>{
      this.modesArray = (result as any).data.map((mode)=>{
          let _mode:any= new Object();
          _mode.value = Object.keys(mode);
          _mode.label =  mode[_mode.value];
          return _mode;
        });
    })
  }
  onSubmit(valid){

    if( this.office.name =='' )
    {
     this.strMessage = 'Office name is required.';
     return;
    }
    if( this.office.address =='' )
    {
     this.strMessage = 'Office address is required.';
     return;
    }
    else if( this.office.company=='' )
    {
     this.strMessage = 'Company is required';
     return;
    }

    let maxFNhr = this.formGroup.value['selectMaxFNHr'];
    let maxFNmin = this.formGroup.value['selectMaxFNMin'];
    this.office.maxFNTime = (maxFNhr && maxFNmin)? maxFNhr + ":" + maxFNmin:null;

    let minANhr = this.formGroup.value['selectMinANHr'];
    let minANmin = this.formGroup.value['selectMinANMin'];
    this.office.maxANTime = (minANhr && minANmin)? minANhr + ":" + minANmin:null;

    let fromHr = this.formGroup.value['selectFromHr'];
    let fromMin = this.formGroup.value['selectFromMin'];
    this.office.from = (fromHr && fromMin)? fromHr + ":" + fromMin:null;

    let toHr = this.formGroup.value['selectToHr'];
    let toMin = this.formGroup.value['selectToMin'];
    this.office.to = (toHr && toMin)? toHr + ":" + toMin:null;

    let lpHr = this.formGroup.value['selectLatePermissionHr'];
    let lpMin = this.formGroup.value['selectLatePermissionMin'];
    this.office.latepermission = (lpHr && lpMin)? lpHr + ":" + lpMin:null;

    let lbHr = this.formGroup.value['selectLunchBreakHr'];
    let lbMin = this.formGroup.value['selectLunchBreakMin'];
    this.office.lunchbreak = (lbHr && lbMin)? lbHr + ":" + lbMin:null;

    let epHr = this.formGroup.value['selectEarlyPermissionHr'];
    let epMin = this.formGroup.value['selectEarlyPermissionMin'];
    this.office.earlypermission = (epHr && epMin)? epHr + ":" + epMin:null;

   if(valid){
      if(this.userService.isLoggedIn()){
        console.log("this.userService.isLoggedIn() ",this.userService.isLoggedIn())
        this.office_service.createOffice(this.office,this.userService.getUserToken()).then(result => {
          console.log("result   ",result);
          if ((result as any).error_code == 0) {
            console.log("New Office Created",result);
             this.showPopup((result as any).data);

          }
        }).catch(error => {
          if (error) {}
        })
       }
    }
  }
  companySelected(event)
  {
    console.log("event",event);
    this.office.company = event.value;
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
  showPopup(resObj)
  {
     console.log("showPopup  :",resObj);
      this.strMessage = "Office created succesfully";
      this.clearOfficeDetails();
  }
  showMessage(body){
    //console.log(body)
    if(body)
    {
      if(body.error_code==0){
            this.strMessage = body.data;
          }else{
            this.strMessage = body.message;
          }
    }

  }
  alertModelClosed(event = null)
  {

    this.strMessage='';
  }
  clearOfficeDetails()
  {
    this.office = {name: '',address: '',stgid: '',maxFNTime: '', maxANTime: '', from: '', to: '', latepermission: '', lunchbreak: '',earlypermission: '',macid:[],company:'',mode:'' };
    this.formGroup.controls['selectCompany'].setValue('');

  }

  navigateToURL(url)
  {
    this.alertModelClosed();
    //console.log('url  '+ url);
    this.router.navigate(['/'+url]);
  }
}
