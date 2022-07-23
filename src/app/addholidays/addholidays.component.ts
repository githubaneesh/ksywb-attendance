import { Component,OnInit} from "@angular/core";
import {ApiService} from "../service/api.service";
import {UserAuthentificationService} from "../service/userAuthentication.service"; 

import {OfficeDetailsService} from "../service/officeDetails.service"; 
import { ActivatedRoute, Router } from '@angular/router';
import { IMyOptions, IMyDateModel } from 'mydatepicker';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'addholidays',
    styleUrls: [ './addholidays.component.css' ],
    templateUrl:'./addholidays.component.html'
})

export class AddHoldaysComponent implements OnInit
{
  public empList:Array<any>=[]
  public officeDescription:string="";
  public   HDayoptions: Array<any> = [];
  public holiday:any;
    form: FormGroup;
  public strMessage:string;
  constructor(private service:ApiService, 
              private router: Router,
              private office_service:OfficeDetailsService,
              private userService:UserAuthentificationService
              ) {
    if(this.userService.isLoggedIn()!=null)
        {
             this.userService.loginDone();  
            this.empList=[];
            this.officeDescription = "";
            this.HDayoptions=[ { value:'fn',label:'Fore Noon',bgColor:'#f2eded'},{value:'an',label:'After Noon',bgColor:'#c2bebe'},{value:'full',label:'Full Day',bgColor:'#dedede'}];
            this.holiday={
                name:'',
                date:'',
                time:''
                }
        }
       else
         {
            this.userService.navigateToUrl('login');
        }
  }
  public myDatePickerOptions : IMyOptions = {
    todayBtnTxt : 'Today',
    dateFormat : 'yyyy-mm-dd',
    height : '30px',
    width : '130px',
    inline : false,
    selectionTxtFontSize : '16px',
    showInputField : true,
    showClearDateBtn : false
  };
  public ngOnInit()
  {
        this.form = new FormGroup({});
        this.form.addControl('selectSingle', new FormControl());
        this.form.controls['selectSingle'].setValue('fn');
  }
  public onDateChanged(event: IMyDateModel) {
      console.log('event date', event.date);
       let year = event.date.year.toString(); 
      let month = event.date.month.toString();
      let day = event.date.day.toString();
      month =  (month.length<2)?"0"+month :month  ;
      day= (day.length<2)?'0'+day:day ;
      this.holiday.date =  year +month +day;
      
  }
  public OptionSelected(event)
  {
    this.holiday.time = event.value;
  }
  public onSubmit(valid)
  {
      console.log("this.holiday.date :",this.holiday.date);
     if(this.holiday.name == '')
     {
        this.strMessage = "Holiday name required";  
        return ;
     }
     else if(this.holiday.date == '')
     {
        this.strMessage = "Holiday date required";  
        return ;
     }   
   if(valid)
    {
        this.office_service.addHoliday( this.holiday,this.userService.getUserToken()).then(result =>{
            switch((result as any).error_code)
            {
                case 0:                      
                     this.strMessage="Successfully added";
                break;
                case 1:
                    this.strMessage="this holiday is already added";
                break;
            }
        }).catch(error =>{
            //console.log("error",error);
            if(error){

            }
        })
     } 
  }


   navigateToURL(url)
  {
    //console.log('url  '+ url);
   this.router.navigate(['/'+url]);
  }
}
