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
    styleUrls: [ './officelist.component.css' ],
    templateUrl: './officelist.component.html'
})

export class OfficeListComponent implements OnInit
{
  
  public offices:Array<any>;
  public formGroup: FormGroup;   
  private  userRoles:Array<any>
  public user:string;

  constructor(private service:ApiService,private userService:UserAuthentificationService,
              private officeService:OfficeDetailsService,private router: Router) {
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
    this.formGroup = new FormGroup({});
    this.formGroup.addControl('selectOffice', new FormControl());     
  
    this.getOfficeList();
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
  
  protected getOfficeList()
  {
    this.officeService.getOffices(this.userService.getUserToken()).then(result => {     
      console.log("result  ",result); 
      if ((result as any).error_code == 0) {      
        this.offices = (result as any).data   
       }
    }).catch(error => {      
      if (error) {}
    })
  }
  editOffficeclickhandler(office)
  {
    console.log("office  ",office);
    this.navigateToURL("settings/"+office._id)
  }
   
   
  navigateToURL(url)
  {
    //console.log('url  '+ url);
   this.router.navigate(['/'+url]);
  }
  


}
