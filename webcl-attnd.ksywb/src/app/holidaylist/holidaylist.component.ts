import { Component,OnInit} from "@angular/core";
import {ApiService} from "../service/api.service";
import {UserAuthentificationService} from "../service/userAuthentication.service";
import {OfficeDetailsService} from "../service/officeDetails.service";
import {EmployeeDetailsService} from "../service/employeelDetails.service";
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DateService } from '../service/date.service';
import { error } from 'util';


@Component({
    selector: 'holidaylist',
    styleUrls: [ './holidaylist.component.css' ],
    templateUrl:'./holidaylist.component.html'
})

export class HolidayListComponent implements OnInit
{
  public holidayList:Array<any>=[]
  
  public arrOffice:Array<any>;
  public formGroup: FormGroup;
  constructor(private service:ApiService,private userService:UserAuthentificationService,
              private dateService:DateService, private router: Router) {
 if(this.userService.isLoggedIn()!=null)
        {
           this.userService.loginDone();
           this.holidayList=[];           
        }
        else
        {
           this.userService.navigateToUrl('login');
        }

  }

  public ngOnInit()
  {
    this.getHolidayList();
  }

  protected getHolidayList(){
    let obj:any = {year:this.dateService.getCurrentYear()}
    this.service.getHolidayList(obj ,this.userService.getUserToken()).then(result => {
          console.log('getHolidayList result :', result);
           this.holidayList = (result as any).data         
      }).catch(error => {      
      if (error) {
      }
    })
 }
 deleteHoliday(holiday)
 {
    console.log("holiday._id  :",holiday._id)
    if(confirm("Are you sure to delete "+holiday.name)) {
        this.service.deleteHoliday(holiday,this.userService.getUserToken()).then(result =>{
          console.log('deleteHoliday  :', result);
          this.getHolidayList();
    
    
        }).catch(error=>{
          if (error) {
          }
        })
    }
 }
 
  
   navigateToURL(url)
  {    
   this.router.navigate(['/'+url]);
  }
  public addButtonsEvent()
  {
  }
   
}
