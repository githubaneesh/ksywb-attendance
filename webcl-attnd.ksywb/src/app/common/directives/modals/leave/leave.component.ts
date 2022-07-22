import {Component,ViewChild,OnInit,NgModule, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {Output} from "@angular/core/src/metadata/directives";
import {Input} from "@angular/core";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SelectModule} from 'angular2-select';
import { ModalComponent } from  'ng2-bs3-modal/ng2-bs3-modal';
import { IMyOptions, IMyDateModel } from 'mydatepicker';
import { DateService } from "../../../../service/date.service";
import {EmployeeDetailsService} from "../../../../service/employeelDetails.service"
import {Employee} from "../../../../attendance/employee";
import {CONSTANTS} from "../../../../service/constants.service";
@Component({
  selector: 'leaveMarking-popup',
  styleUrls:["./leave.component.css"],
  templateUrl:'./leave.component.html'
})
export class LeaveMarkingModalComponent   {
  @ViewChild('modal')
  modal:ModalComponent;
  @Input() leaves:Array<any>;
  @Input() employees:Array<any>;
  @Output() modalClosed = new EventEmitter();
  form: FormGroup;

  
  public arr_leaves: Array<any> = [];
  public arr_emp: Array<any> = [];

  protected startDate:string='';
  protected endDate:string='';

  protected  empData;
  public disableLeave:Boolean=true;
  public strmessage:string='';
  public bAbsent:Boolean=false;
   public myDatePickerOptions : IMyOptions = {
    todayBtnTxt : 'Today',
    dateFormat :'dd-mm-yyyy',
    height : '30px',
    width : '130px',
    inline : false,
    selectionTxtFontSize : '16px',
    showInputField : true,
    showClearDateBtn : false,
    editableDateField:false
  };
  constructor(private ref: ChangeDetectorRef,private date_service:DateService,private emp_service:EmployeeDetailsService,private constats:CONSTANTS){      
         
         
}
  public ngOnInit(){
        this.empData={id:'',date:'',time:''}
        this.form = new FormGroup({});
        this.form.addControl('selectEmployee', new FormControl());
        this.form.addControl('selectLeave', new FormControl());
  }
 public onStartDateChanged(key,event: IMyDateModel)
  {
    // //console.log('event.jsdate',event.jsdate );
   //  console.log('event.date:', event.date);
     let year:string = event.date.year.toString();
     let month:string = (event.date.month<10)?"0"+event.date.month:event.date.month.toString();
     let day:String =  (event.date.day<10)?"0"+event.date.day:event.date.day.toString();
     this.startDate =  year+month+day;

  }
  public onEndDateChanged(key,event: IMyDateModel)
  {
    // console.log('event.jsdate',event.jsdate );
    //  console.log('event.date:', event.date);
     let year:string = event.date.year.toString();
     let month:string = (event.date.month<10)?"0"+event.date.month:event.date.month.toString();
     let day:String =  (event.date.day<10)?"0"+event.date.day:event.date.day.toString();
     this.endDate =  year+month+day;

  }
    public open()
    {
        this.disableLeave=true;
         this.clearAllFields();
         this.populateEmpArr();
         this.populateLeaveArr();         
         this.modal.open('md');
    }
    protected clearAllFields()
    {
        this.form.controls['selectEmployee'].setValue(null);
        this.form.controls['selectLeave'].setValue(null);
        
    }
    protected populateEmpArr()
    {
         if( this.employees.length>0 )
         {
            if( this.arr_emp.length==0 )
            {
                for(var i=0;i<this.employees.length;i++)
                {
                    //console.log('value :'+this.employees[i].id);
                let emp={id:this.employees[i].id,value:this.employees[i],label:this.employees[i].name}
                this.arr_emp[i] = emp;
                }
            }
         } 
   }
    protected populateLeaveArr()
    {
          this.arr_leaves=[];
         if(this.leaves.length>0)
         {
               for(var i=0;i<this.leaves.length;i++)
                {
                    let leaves={id:this.leaves[i]._id,value:this.leaves[i]._id,label:this.leaves[i].name}
                    this.arr_leaves[i] = leaves;
                }
            
      
         }
    }
    onEmployeeSelectionOpened()
    {

    }
    onEmployeeSelectionClosed()
    {
        
    }
    onEmployeeSelectionSelected(event)
    {
        
           this.disableLeave=false;
          let employee: Employee = this.emp_service.getEmployeeFromOfficeByID(event.value.id , this.employees);
          if(Number(employee.CLtotal)>=this.constats.TOTALCL)
          {
              this.arr_leaves =  this.arr_leaves.slice(1,this.arr_leaves.length);
           }
          else
          {    
                this.populateLeaveArr(); 
               
          }
    }
    onEmployeeSelectionDeselected(event)
    {
         //console.log(event.value);
    }

     closed() {
        //console.log('attenddnce Model Closed');
        this.modalClosed.emit(this.empData);
    }

    dismissed() {
       
    }

    opened() {
      
        //console.log('Modal Opened');
    }

    navigate() {
      
    }
     getObjectByValue(value,arr)
    {
        for(var i in arr)
        {
            if(arr[i].value ==value)
            {
            return arr[i];
            }
        }
        return null;
    } 
    leaveSelected(item)
    {
         if(this.getObjectByValue(item.value,this.arr_leaves).label =='Absent')
         {
            this.bAbsent = true;
         }
         else
         {
             this.bAbsent=false;
         }
    }
    
    onSubmit(valid)
    {
       
              if(this.form.value['selectEmployee']!=null && this.form.value['selectLeave']!=null &&this.startDate!='' && this.endDate!='' )
              {
                    this.empData.id = this.form.value['selectEmployee'].id;    
                    this.empData.employee = this.form.value['selectEmployee'];       
                    this.empData.leaveStatus=this.form.value['selectLeave'];   
                    this.empData.stardate =  this.startDate.substr(0,4)+'-'+this.startDate.substr(4,2)+'-'+this.startDate.substr(6,2);
                    this.empData.enddate =   this.endDate.substr(0,4)+'-'+this.endDate.substr(4,2)+'-'+this.endDate.substr(6,2);
                    //console.log( this.empData.stardate + '       this.empData.stardate  '+  this.empData.enddate);
                    if(Number(this.startDate)<=Number(this.endDate))
                    {
                       this.modal.close();
                    }
                    else
                    {
                        this.strmessage='End date should be greater than or equal to Start Date' ;
                    }                   
                }
                else
                {
                    this.strmessage='Please select all fields.'
                }
    }
}