import { Component,OnInit} from "@angular/core";
import {ApiService} from "../service/api.service";
import {UserAuthentificationService} from "../service/userAuthentication.service";
import {OfficeDetailsService} from "../service/officeDetails.service";
import {EmployeeDetailsService} from "../service/employeelDetails.service";
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { retry } from 'rxjs/operator/retry';


@Component({
    selector: 'userlist',
    styleUrls: [ './userlist.component.css' ],
    templateUrl: './userlist.component.html'
})

export class UserListComponent implements OnInit
{
  public  userList:Array<any>=[]; 
  public offices:Array<any>;
  public formGroup: FormGroup;   
  private  userRoles:Array<any>
  public user:string;

  constructor(private service:ApiService,private userService:UserAuthentificationService,
              private officeService:OfficeDetailsService,private router: Router) {
 if(this.userService.isLoggedIn()!=null)
        {
           this.userService.loginDone();
           this.userList=[];          
         
        }
        else
        {
           this.userService.navigateToUrl('login');
        }
  }
  public ngOnInit()
  {
    this.formGroup = new FormGroup({});
    this.formGroup.addControl('selectOffice', new FormControl()); 
    this.formGroup.addControl('selectRole', new FormControl());    
    
    
    this.getuserList();
    this.getuserRoles();
    this.getOfficeDetails();
    this.getUser();

  }
  protected getUser()
  {
    this.user =  this.userService.getCurrentUserRole();
    console.log(" this.user  ", this.user );
  }
  public isSuperAdmin()
  {
    return this.userService.getCurrentUserRole() =="super_admin";
  }
 protected getuserRoles()
  {
    this.service.getUserRoles(this.userService.getUserToken()).then(result => {      
      console.log("result   ",result);
      if ((result as any).error_code == 0) {    
        
        this.userRoles = (result as any).data.map((item)=>{
          console.log("item  :",item);
          let _role:any =new Object();
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
  protected getOfficeDetails()
  {
    this.officeService.getCompanyList(this.userService.getUserToken()).then(result => {      
      if ((result as any).error_code == 0) {      
        this.offices = (result as any).data.offices.filter((item)=>{
                item.id = item._id;
                item.value = item;
                item.label = item.name;
                return item;
         })  ;       
      }
    }).catch(error => {      
      if (error) {}
    })
  }
  protected getuserList(){
    
    this.service.getUsers(this.userService.getUserToken()).then(result => {
          console.log('result:this.office_service.getCompanyList', result);
          this.userList = (result as any).data.map((user)=>{
            user.edit=false;
            user.resetpassword=false;
            return user;
          }); 
        
    }).catch(error => {
      //console.log("error", error);
      if (error) {

      }
    })
 }
   public officeSelected($event,user)
  {
    console.log("$event ",$event);
    user.office =  $event.value._id;
  }
  public roleSelected($event,user)
  {
    console.log("$event role ",$event);
    user.role =  $event.value;
  }
  navigateToURL(url)
  {
    //console.log('url  '+ url);
   this.router.navigate(['/'+url]);
  }
  public addButtonsEvent(){
  }
  public deleteUser(user){   

    if(confirm("Are you sure to delete user "+user.username)) {
        this.service.deleteUser(user,this.userService.getUserToken()).then(res=>{    
          this.getuserList();
        }) 
     }

  }
  public updateUser(user)
  {
    user.edit=true;
  }

  public resetPassword(user)
  {
    user.resetpassword=true;
  }
  public save(user)
  {
    console.log(user);
    if(user.edit)
    {
      var newData=Object.assign({},user);
      if(newData.office._id)
      {
        newData.office= newData.office._id
      }
      if(newData.role._id)
      {
        newData.role= newData.role._id
      }
      this.service.updateUser(newData,this.userService.getUserToken()).then(res=>{    
        this.getuserList();
      }) 
    }
    else if(user.resetpassword)
    {
      this.service.resetUserpassword(user,this.userService.getUserToken()).then(res=>{    
        this.getuserList();
      }) 
    }
  }
  public cancel(user)
  {
    this.getuserList();
  }



}
