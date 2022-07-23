import {Component, ViewChild, OnInit, NgModule} from "@angular/core";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SelectModule} from 'angular2-select';
import {EmployeeDetailsService} from '../service/employeelDetails.service';
import {Employee} from './employee.interface';
import {ApiService} from "../service/api.service";
import {UserAuthentificationService} from "../service/userAuthentication.service";
import {OfficeDetailsService }from "../service/officeDetails.service"
import { AlertModalComponent } from '../common/directives/modals/alert';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'addemployee',
  styleUrls: ['./addemployee.component.css'],
  templateUrl: './addemployee.component.html',
 /* directives: [ AlertModalComponent ]*/
})

export class AddEmployeeComponent implements OnInit {
   @ViewChild(AlertModalComponent) alertmodal:AlertModalComponent;
  public employee: Employee;
  public strMessage : string;
  public userRoles:Array<any>;
  public user;
  private officeID: string;
  public offices:Array<any>;
   form: FormGroup;
  constructor(private service:ApiService,private userService:UserAuthentificationService,
    private emp_service:EmployeeDetailsService,private office_service:OfficeDetailsService,
    private router:Router
  ) {
    if(this.userService.isLoggedIn()!=null)
        {
          this.userService.loginDone();
          this.userRoles=[ { value:'Employee',label:'Employee'} ];
           this.initFromGroup();
        }
        else
        {
         this.userService.navigateToUrl('login');
        }
  }
  public ngOnInit() {
    this.strMessage = "";
     this.employee = {name: '', username: '',password: '',cpassword:'', userid:'', mobile: '', email: '',role: 'Employee',designation: '',office:'',  employeeid:'', };
     this.office_service.getCompanyList(this.userService.getUserToken()).then(result => {
      if ((result as any).error_code == 0) {
        this.offices = (result as any).data.offices.filter((item)=>{
                item.id = item._id;
                item.value = item;
                item.label = item.name;
                return item;
         })  ;
        this.clearEmployeeDetails();
      }
    }).catch(error => {
      if (error) {}
    })
  }
  protected initFromGroup()
  {
     this.form = new FormGroup({});
     this.form.addControl('selectOffice', new FormControl());
  }


  changedRole(event){
  }
  changedOffice(event)
  {
  }
  officeSelected(event) {
     this.employee.office = event.value._id;
    // console.log(" this.employee.office ", this.employee.office);
  }
  onSingleDeselected(item) {
   }
  onSubmit(valid){
    if( this.employee.name =='' )
    {
     this.strMessage = ' Name is required .';
     return;
    }
    else if( this.employee.designation =='' )
    {
     this.strMessage = 'Employee Designation is required .';
     return;
    }
    else if(this.employee.office =="")
    {
     this.strMessage = 'Office is required.';
     return;
    }
    if(valid){
      if(this.userService.isLoggedIn()){
        delete this.employee.role;
        this.emp_service.addOrUpdateEmployee("add",this.userService.getUserToken(),this.employee).then(res=>{
           console.log('employee added ',res);
          if( (res as any).error_code===0){
           // this.showMessage("User created");
            valid=false;
            //console.log(res);
            this.showPopup(res);
          }else{
            this.showMessage((res as any).data);
          }
        })
      }
    }
  }
  update(valid){
    this.strMessage = "";
   // //console.log(valid);
    if(valid){
      if(this.userService.isLoggedIn()){
        delete this.employee.role;
       /* delete this.employee.pin;*/
       //delete this.employee.ein;
        this.emp_service.addOrUpdateEmployee("update",this.userService.getUserToken(),this.employee).then(res=>{
          //console.log(res);
          this.showMessage(JSON.parse((res as any)._body))
        })
      }
    }
  }
  showPopup(resObj)
  {
   // this.user = resObj;
    this.alertmodal.open(resObj);
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
  alertModelClosed(event)
  {
    this.clearEmployeeDetails();
    this.strMessage='';
  }
  clearEmployeeDetails()
  {
      this.employee = {name: '', username: '',password: '',cpassword: '',userid: '', mobile: '', email: '',role: '', designation: '',office: "" ,employeeid:''};
       this.form.controls['selectOffice'].setValue('');
  }
  cancelBtnclickhandler()
  {
    this.router.navigate(['/employeelist']);
  }
}
