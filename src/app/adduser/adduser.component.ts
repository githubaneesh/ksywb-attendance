import {Component, ViewChild, OnInit, NgModule} from "@angular/core";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SelectModule} from 'angular2-select';
import {EmployeeDetailsService} from '../service/employeelDetails.service';
import {User} from './user.interface';
import {ApiService} from "../service/api.service";
import {UserAuthentificationService} from "../service/userAuthentication.service";
import {OfficeDetailsService }from "../service/officeDetails.service"
import { AlertModalComponent } from '../common/directives/modals/alert';
import {Router} from "@angular/router";

@Component({
  selector: 'addemployee',
  styleUrls: ['./adduser.component.css'],
  templateUrl: './adduser.component.html',
 /* directives: [ AlertModalComponent ]*/
})

export class AddUserComponent implements OnInit {
   @ViewChild(AlertModalComponent) alertmodal:AlertModalComponent;
  public user: User;
  public strMessage : string;
  public userRoles:Array<any>;

  private officeID: string;
  public offices:Array<any>;
   form: FormGroup;
  constructor(private service:ApiService,private userService:UserAuthentificationService,
              private emp_service:EmployeeDetailsService,private office_service:OfficeDetailsService,
  private router:Router) {
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
  public ngOnInit() {
    this.strMessage = "";
     this.user = {username: '',firstname: '',lastname: '',email:'',mobile:'',password: '',cpassword:'',role: 'Administrator',office:'' };
    // this.user.role = 'Administrator';
     this.getOfficeDetails();
    this.getuserRoles();

  }
  protected getOfficeDetails()
  {
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
  protected getuserRoles()
  {
    this.service.getUserRoles(this.userService.getUserToken()).then(result => {
      console.log("result   ",result);
      if ((result as any).error_code == 0) {

        this.userRoles = (result as any).data.map((item)=>{
          console.log("item  :",item);
          let _role:any ={};
           _role.id = item;
           _role.value = item;
          _role.label = item;
          console.log("_role ",_role);
          return _role;
         })  ;
         console.log(" this.userRoles    ", this.userRoles );
      }
    }).catch(error => {
      if (error) {}
    })

  }
  roleSelected(event)
  {
   this.user.role = event.value;  
 
  }

  protected initFromGroup()
  {
     this.form = new FormGroup({});
     this.form.addControl('selectOffice', new FormControl());
     this.form.addControl('selectRole', new FormControl());
  }


  changedRole(event){
  }
  changedOffice(event)
  {
  }
  officeSelected(event) {
     this.user.office = event.value._id;
    // console.log(" this.employee.office ", this.employee.office);
  }
  onSubmit(valid){
    if( this.user.username =='' )
    {
     this.strMessage = 'User name is required.';
     return;
    }
    if( this.user.firstname =='' )
    {
     this.strMessage = 'First Name is required.';
     return;
    }
    if( this.user.lastname =='' )
    {
     this.strMessage = 'Last Name is required.';
     return;
    }
    /*else if( this.user.mobile =='' )
    {
     this.strMessage = ' User Mobile is required.';
     return;
    }*/
    else if( this.user.password != this.user.cpassword )
    {
     this.strMessage = ' Password not matched.';
     return;
    }
    this.user.role = 'Administrator';
    this.user.office = null;
    if(valid){
      if(this.userService.isLoggedIn()){
        this.service.createUser(this.user,this.userService.getUserToken()).then(result => {

          if ((result as any).error_code == 0) {
            console.log("createUser result   ",result);
             this.showPopup((result as any).data);

          }
        }).catch(error => {
          if (error) {}
        })



      }
    }
  }
 /* update(valid){
    this.strMessage = "";

    if(valid){
      if(this.userService.isLoggedIn()){

        this.emp_service.addOrUpdateEmployee("update",this.userService.getUserToken(),this.employee).then(res=>{
          //console.log(res);
          this.showMessage(JSON.parse((res as any)._body))
        })
      }
    }
  }*/
  showPopup(resObj)
  {
     console.log("showPopup  :",resObj);
      this.strMessage = "User created succesfully";
      this.clearEmployeeDetails();


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
    this.clearEmployeeDetails();
    this.strMessage='';
  }
  clearEmployeeDetails()
  {
    this.user = {username: '',firstname: '',lastname: '', email:'',mobile:'',password: '',cpassword:'',role: '',office:'' };
       this.form.controls['selectOffice'].setValue('');
       this.form.controls['selectRole'].setValue('');
  }

  navigateToURL(url)
  {
    this.alertModelClosed();
    //console.log('url  '+ url);
    this.router.navigate(['/'+url]);
  }
}
