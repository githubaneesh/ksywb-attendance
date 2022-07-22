import {Component, ViewChild, AfterViewInit, NgModule, Renderer, ChangeDetectorRef} from "@angular/core";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Http, Headers, Response, Request, RequestMethod, URLSearchParams, RequestOptions } from "@angular/http";
import {SelectModule} from 'angular2-select';
import {DateService} from "../service/date.service";
import {OfficeDetailsService} from '../service/officeDetails.service';
import {UserAuthentificationService} from "../service/userAuthentication.service";
import {AttendanceService}  from "../service/attendance.service";
import {EmployeeDetailsService} from "../service/employeelDetails.service"
import {Employee} from "./employee";
import {Day} from "./day";
import {CONSTANTS} from "../service/constants.service";
import {ActivatedRoute, Router} from '@angular/router';
//import * as moment from 'moment';
 import $ from "jquery";
import {HolidayModalComponent} from "../common/directives/modals/holiday/holidaymarking.component";
import {ANFNLeaveModalComponent} from "../common/directives/modals/fnan/fnanpopup.component";
import {ImportExcelModalComponent} from "../common/directives/modals/excel/excelpopup.component";
import {TimePickerModalComponent} from "../common/directives/modals/timepicker/timepicker.component";
import {AttendanceModalComponent} from "../common/directives/modals/attendance/attendancepopup.component";
import {WarningModalComponent} from "../common/directives/modals/warning/warningpopup.component";
import {LeaveMarkingModalComponent} from "../common/directives/modals/leave/leave.component";
import {PrintPreviewModalComponent} from  "../common/directives/modals/printpreview/printpreview.component";
import { ApiService } from '../service/api.service';
//import { Employee } from './employee';




@Component({
  selector: 'attendanceregister',
  styleUrls: ['./attendanceregister.component.css'],
  templateUrl: './attendanceregister.component.html',
  /*directives: [HolidayModalComponent, ANFNLeaveModalComponent,ImportExcelModalComponent,TimePickerModalComponent,AttendanceModalComponent]*/
})

export class AttendanceRegisterComponent implements AfterViewInit {

  @ViewChild(HolidayModalComponent) hmodal: HolidayModalComponent;
  @ViewChild(ANFNLeaveModalComponent) LeaveUpdateModal: ANFNLeaveModalComponent;
  @ViewChild(ImportExcelModalComponent) importJSONmodal: ImportExcelModalComponent;
  @ViewChild(TimePickerModalComponent) timpickerModal: TimePickerModalComponent;
  @ViewChild(AttendanceModalComponent) attendanceModal: AttendanceModalComponent;
  @ViewChild(WarningModalComponent) warningModal: WarningModalComponent;
  @ViewChild(LeaveMarkingModalComponent) leaveModel: LeaveMarkingModalComponent;
  @ViewChild(PrintPreviewModalComponent) printpreviewModel:PrintPreviewModalComponent;
  public formGroup: FormGroup;
  private date_service;
  private office_service;
  private attendance_service;
  private emp_service;
  public str_month;
  public str_year;
  public daysInMonth = [];
  private currMonth = "";
  private currYear = "";
  private monthIndex;
  private yearIndex;
  HDayoptions: Array<any> = [];
  public ArrEmp: Array<Employee> = [];
  private userToken: string;
  private selectedElement;
  /*----------------------*/
  public arroffices: Array<any>;
  public arrLeaves: Array<any>;
  public arrAttendance: Array<any>;
  public arrLeavesandAttends:Array<any>;
  private arrHolidays: Array<any> = [];
  public officeID: String;
  public bShowCalender: Boolean = false; // for showing Application
  public bShowApp: Boolean = false;
  public scrollbarID:String='scrollableTable';
  private _this;
  private monthState: string;


  constructor(private router: Router,
              private renderer: Renderer,
              private _dateService: DateService,
              private offficeservice: OfficeDetailsService,
              private _authservice: UserAuthentificationService,
              private cdr: ChangeDetectorRef,
              private attendanceService: AttendanceService,
              private empService: EmployeeDetailsService,
              private apiService:ApiService,
              private http: Http,
              private constants:CONSTANTS
              ) {
    if (this._authservice.isLoggedIn() != null) {
      this._authservice.loginDone();
      this.date_service = _dateService;
      this.office_service = offficeservice;
      this._authservice = _authservice;
      this.renderer = renderer;
      this.attendance_service = attendanceService;
      this.emp_service = empService;
      this.monthState = 'current';
       this.formGroup = new FormGroup({});
       this.formGroup.addControl('selectOffice', new FormControl());

    }
    else {    
      this._authservice.navigateToUrl('login');
    }
  }


  public ngAfterViewInit() {    
     this.userToken = this._authservice.getUserToken();
    this.initCalender();
    this.initCompanyList();
  }

  public checkMonth(month, year) {
    
  }

  protected initCalender() {
    this.getHolidaysLst();
    this.currMonth = this.date_service.getCurrentMonth();
    this.currYear = this.date_service.getCurrentYear();
    this.str_month = this.date_service.getCurrentMonthName().toUpperCase();
    this.str_year = this.date_service.getCurrentYear().toString();    
    this.monthIndex = this.currMonth;
    this.yearIndex = this.currYear;
    this.bShowApp = true;
    this.cdr.detectChanges();    
  }

  protected getHolidaysLst() {
    this.arrHolidays = [];
    let obj:any = {year:this.date_service.getCurrentYear()}
    this.apiService.getHolidayList(obj ,this._authservice.getUserToken()).then(result => {
          console.log('getHolidayList result :', result);
          this.arrHolidays = (result as any).data;
          this.date_service.setHolidays(this.arrHolidays);  
          this.daysInMonth = this.date_service.updateMonth(this.currMonth, this.currYear, this.arrHolidays);        
      }).catch(error => {      
      if (error) {
        this.daysInMonth = this.date_service.updateMonth(this.currMonth, this.currYear, this.arrHolidays);
      }
    })
   /* this.offficeservice.getHolidayList(this.userToken).then(result=> {      
      if ((result as any).error_code == 0) {
        this.arrHolidays = (result as any).data;
        this.date_service.setHolidays(this.arrHolidays);        
        this.daysInMonth = this.date_service.updateMonth(this.currMonth, this.currYear, this.arrHolidays);
        //this.changeScrolltoCurrentDate();
      }
    }).catch(error => {      
      if (error) {
        this.daysInMonth = this.date_service.updateMonth(this.currMonth, this.currYear, this.arrHolidays);
      }
    });*/
  }
  private totalSapcetoScroll ;
  protected changeScrolltoCurrentDate()
  {
    let multiplier = this.date_service.getCurrentDate();
    this.totalSapcetoScroll =  (multiplier*101);
     if(this.monthIndex ==this.currMonth)
    {
       $(".scroll").animate({ scrollLeft:this.totalSapcetoScroll }, "fast");
    }
    else
    {
        $(".scroll").animate({ scrollLeft:0 }, "fast");
    }

  }
  protected showDefaultOffice(arrOffices)
  {
    let defaultVal = null;
    arrOffices.map(function(item){      
      if(item.label =='HeadOffice,Kudapanakunnu')
      {       
        defaultVal = item
      }
    })
    this.formGroup.controls['selectOffice'].setValue([defaultVal]);
    this.ArrEmp =[];
    let selectedOffice =  defaultVal;
    console.log("selectedOffice  :",selectedOffice);
    this.ArrEmp = this.emp_service.getEmployeeArr(selectedOffice.employees);
    this.officeID = selectedOffice._id;
    this.getEmployeeAttendanceList(this.currYear, (this.currMonth + 1), this.officeID);

  }
  protected initCompanyList() {
    this.ArrEmp = [];
    this.office_service.getCompanyList(this.userToken).then(result => {     
      if (result.error_code == 0) {       
         this.arroffices = result.data.offices.filter((item)=>{
               item.id = item._id;
                item.value = item;
                item.label = item.name;
                return item;
         })  ;
         this.showDefaultOffice(this.arroffices)        
        this.arrLeavesandAttends = result.data.leaves;
        this.arrLeaves = result.data.leaves.filter((item)=> {           
          return  item.name.toLowerCase().indexOf("leave") != -1   ||   item.name.toLowerCase().indexOf("on duty") != -1;
        });
        this.arrAttendance = result.data.leaves.filter((item)=> {
          return item.name.toLowerCase().indexOf("leave") == -1
        });
       
        this.ArrEmp = this.emp_service.getEmployeeArr(this.arroffices[0].employees);
        this.officeID = this.arroffices[0]._id;       
        this.getEmployeeAttendanceList(this.currYear, (this.currMonth + 1), this.officeID);
       
      }
    }).catch(error => {     
      if (error) {

      }
    })
    this.cdr.detectChanges();
  }
  public officeSelected($event)
  {
     this.ArrEmp =[];
     let selectedOffice = $event.value;
     this.ArrEmp = this.emp_service.getEmployeeArr(selectedOffice.employees);
     console.log("this.ArrEmp ",this.ArrEmp);
     this.officeID = selectedOffice._id;
     this.getEmployeeAttendanceList(this.currYear, (this.currMonth + 1), this.officeID);
  }

  public getEmployeeAttendanceList(year, month, officeID) {
    this.office_service.getAttendance(year, month, officeID, this.userToken).then(result=> {
      if (result.error_code == 0) {       
        this.ArrEmp.forEach((item)=>item.attendenceArr=[]);
        this.changeEmployeeAttendance(result.data);
        this.bShowCalender = true;
        this.changeScrolltoCurrentDate();
      }
    }).catch(error=> {     
    })

  }

  public  nextButtonClickhandler() {
    this.bShowCalender = false;
    this.changeAttendsArrayBlank();
    this.monthState = 'next';
    if (this.monthIndex + 1 < 12) {
      this.monthIndex = this.monthIndex + 1;
    }
    else {
      this.monthIndex = 0;
      this.yearIndex = this.yearIndex + 1;
      this.str_year = this.yearIndex;
    }

    this.str_month = this.date_service.getMonthNameByIndex(this.monthIndex).toUpperCase();    
    this.daysInMonth = [];
    this.daysInMonth = this.date_service.updateMonth((this.monthIndex ), this.yearIndex, this.arrHolidays);
    if(this.monthIndex ==this.currMonth)
    {
      this.changeScrolltoCurrentDate();
    }    
    this.getEmployeeAttendanceList(this.yearIndex, this.monthIndex+1 , this.officeID);

  }

  public prevButtonClickhandler() {
    this.bShowCalender = false;
    this.changeAttendsArrayBlank();
    this.monthState = 'prev';
    if (this.monthIndex > 0) {
      this.monthIndex = this.monthIndex - 1;
    }
    else {
      this.monthIndex = 11;
      this.yearIndex = this.yearIndex - 1;
      this.str_year = this.yearIndex;
    }
    this.str_month = this.date_service.getMonthNameByIndex(this.monthIndex).toUpperCase();
    // let noOfDaysInMonth=this.date_service.getdaysInMonth((this.monthIndex+1),  this.yearIndex);
    this.daysInMonth = [];
    this.daysInMonth = this.date_service.updateMonth((this.monthIndex), this.yearIndex, this.arrHolidays);
      if(this.monthIndex ==this.currMonth)
    {
      this.changeScrolltoCurrentDate();
    }
    // this.daysInMonth=this.getArrDaysInMonth(noOfDaysInMonth);
    // console.log(this.monthIndex+1 + ' getting next month on attendancelist  ');
    this.getEmployeeAttendanceList(this.yearIndex, this.monthIndex + 1, this.officeID);
  }

  public leaveUpdateClickhandler(event, attends, type, emp, dayOfMonth) {
    
   event.stopPropagation();
    if (!attends) {
      attends = {
        employee:emp
        //id :emp.id,
        /*date:dayOfMonth.strdate,
        employee:emp,
        office:this.offficeservice.getOfficeID()*/
       }
    }
    attends.ein = emp.ein;
    attends.date = dayOfMonth.strdate;

    this.LeaveUpdateModal.open(attends, type);
    this.selectedElement = event.target || event.srcElement || event.currentTarget;
  }

  public leaveUpdateModelClosed($event) {
    
    this.monthState = "currentUpdate"
    let data = {
      ein:$event.attends.ein,
      date: $event.attends.date,
    }
    data[$event.anfn.toLowerCase()]=$event.selection;

    this.attendance_service.addLeave(data, this.userToken).then(result=> {
      if (result.error_code == 0) {
        this.getEmployeeAttendanceList(this.yearIndex, (this.monthIndex+1), this.officeID);
      }
    }).catch(error=> {
      
    })
  }

  public isAfterCurrentDate(objDate) {

    var date:Number = Number(objDate.strdate)
    var now:Number = Number(this.date_service.getCurrentDateTimestring()) ;
    return !(now > date);

    //if (now > date) { return false;} else {return true;}
  }

  public warningModalClosed($event) {

  }

  public  holidayClickhandler(event, date) {
    this.selectedElement = event.target || event.srcElement || event.currentTarget;
    this.hmodal.open(date);


  }

  public  handleHolidayPopupClosed($event) {
    let holiday: any = $event;
    /*let d = new Date;
     let _date =d.getFullYear()+d.getMonth()+d.getDate();
     holiday.time =  ;
     holiday.name =
     holiday.date = _date;*/
    this.office_service.addHoliday(holiday, this._authservice.getUserToken()).then(result => {
      switch ((result as any).error_code) {
        case 0:
          this.warningModal.open({title: 'Success', body: 'Holiday is successfully added'});
            this.initCalender();
            this.getEmployeeAttendanceList(this.yearIndex, (this.monthIndex+1), this.officeID);
         
          break;
        case 1:
          this.warningModal.open({title: 'Error', body: 'Holiday Could not be added'});         
          break;
      }
    }).catch(error => {     
      if (error) {

      }
    })

    if (this.selectedElement != null) {
      //this.selectedElement.querySelector('h4').innerHTML = $event.value;
      // this.renderer.setElementStyle( this.selectedElement, 'backgroundColor', $event.bgColor);
      this.selectedElement = null;
    }
  }

  public  importJSONBtnClickhandler() {
    this.importJSONmodal.open();
  }
  public printBtnClickhandler()
  {
    if(this.ArrEmp.length>0)
    {
      let formattedData = this.getExcelFormattedData(this.str_month, this.ArrEmp);
      this.printpreviewModel.open(this.str_month,formattedData);
    }
    else
    {
      this.warningModal.open({title: 'Error', body: 'Employees not found on this Office'});  
    } 
  }
  public  exportExcelBtnClickhandler() {
    let formattedData = this.getExcelFormattedData(this.str_month, this.ArrEmp);
   
    this.office_service.exportExcel(formattedData, this.userToken).then(result=> {
      if (result.error_code == 0) {           
             this.downloadFile(result)
       }
    }).catch(error=> {     
    })
  }
  private downloadFile(dataObj)
  {
        // window.open(dataObj.data);
           /* let link = document.createElement("a");
            link.href = dataObj.data;
            link.click(); */
        /*  this.http.get(dataObj.data).success(function(data, status) {} );*/
        var a = document.createElement("a");
        a.href = dataObj.data;
        var clickEvent = new MouseEvent("click", {
            "view": window,
            "bubbles": true,
            "cancelable": false
        });
        a.dispatchEvent(clickEvent);


  }
  public attendanceAddBtnClickhandler() {

    if(this.ArrEmp.length>0)
    {
      this.attendanceModal.open();
    }
    else
    {
      this.warningModal.open({title: 'Error', body: 'Employees not found on this Office'});  
    }
     

  }

  public attendanceAddModalClosed($event) {
    console.log('attendanceAddModalClosed',$event);
    this.attendance_service.addAttendance($event, this.userToken).then(result=> {
      if (result.error_code == 0) {     
        this.initCompanyList();
        //this.warningModal.open({title: 'Success', body: 'Attendance successfully added'});
      }
      else
      {
         this.warningModal.open({title: 'Error', body: result.error });
      }
    }).catch(error=> {     
    })
  }
  public leaveAddBtnClickhandler() {
    if(this.ArrEmp.length>0)
    {
      this.leaveModel.open();
    }
    else
    {
      this.warningModal.open({title: 'Error', body: 'Employees not found on this Office'});  
    }
    
  }
 public leaveAddModalClosed($event) {  
    this.monthState = "currentUpdate";    
    let arrDays:Array<any>= this.date_service.getDatesBetween2Date($event.stardate,$event.enddate);
    let dataArr:Array<any>=[];
    for(let i=0;i<arrDays.length;i++)
    {
        if(arrDays[i].is_holiday==false &&arrDays[i].is_weekend==false)
        {
         /* let data={
               id:$event.id,
               date:arrDays[i].date ,
               FNStatus:$event.leaveStatus,
               ANStatus:$event.leaveStatus,
               office: this.officeID,
               employee: $event.employee
          }*/
          
          let data:any ={ein:$event.employee.ein,date:arrDays[i].date,fn:this.getAttendanceStatus($event.leaveStatus),an:this.getAttendanceStatus($event.leaveStatus)}
          dataArr.push(data);
      }
    }
   if(dataArr.length<= this.constants.TOTAL_LEAVE_ALLOWED) //15
    {
      console.log("dataArr.length<= this.constants.TOTAL_LEAVE_ALLOWED");
        if(this.getAttendanceStatus($event.leaveStatus) == this.constants.CL) //checking leave status
        {
             let employee: Employee = this.emp_service.getEmployeeFromOfficeByID($event.id , this.ArrEmp);
             if(employee.CLtotal + dataArr.length >= this.constants.TOTALCL)  // if CL >20
             {
                this.warningModal.open({title:this.constants.WARNING,body:this.constants.WARNING_MESSAGE_CLGT15})
             }
             else // else adding leaves
             {
               this.addLeave(dataArr);
             }
        }
        else // else adding leaves
        {
            this.addLeave(dataArr);
        }
    }
    else
    {this.warningModal.open({title:this.constants.WARNING,body:this.constants.WARNING_MESSAGE_GT15})} 
  }
  addLeave(dataArr)
  {
      let data = dataArr[0];
      console.log("Sending Data ",data)
      this.attendance_service.addLeave(dataArr[0], this.userToken).then(result=> {
            if (result.error_code == 0) {           
               dataArr.shift();
               if(dataArr.length>0)
               {
                 this.addLeave(dataArr);
               }
               else
               {               
                 this.getEmployeeAttendanceList(this.yearIndex, (this.monthIndex+1), this.officeID);
               }
             }
          }).catch(error=> {          
          })
  }

  public timeUpdateClickHandler(event, attends, type,emp,daysInMonth) {
    console.log("timeUpdateClickHandler")
    this.selectedElement = event.target || event.srcElement || event.currentTarget;
    this.timpickerModal.open(attends, type,emp,daysInMonth);
  }

  public excelUpdateModelClosed($event) {
  //  console.log("excelUpdateModelClosed");
    this.getEmployeeAttendanceList(this.currYear, (this.currMonth + 1), this.officeID);
  }
  public timeUpdateModelClosed($event) {
    console.log('timeUpdateModelClosed',$event);
    if($event.data){
      $event.data.ein = $event.emp.ein;
    }
    this.office_service.updateAttendance($event.data, this.userToken).then(result=> {
      if (result.error_code == 0) {
      //  console.log('Time update success  ', result);
        this.getEmployeeAttendanceList(this.yearIndex, (this.monthIndex+1), this.officeID);
      }
    }).catch(error=> {
    //  console.log("error", error);
    })
  }

  /*protected getEmployeeArr(arr)
   {
   let arrEmp:Array<Employee>=[];
   for(let i in arr)
   {
   let employee:Employee= {id:arr[i]._id,attendenceArr:[],designation:arr[i].designation,ein:arr[i].ein,name:arr[i].name,officeId:arr[i].officeId,pin:arr[i].pin,user:arr[i].user,
   CLbefore:0,LTBefore:0,CLtotal:0,LTtotal:0,HPL:0,CML:0,EL:0,LWA:0,LWAM:0} ;
   arrEmp[i]=employee;
   }
   return arrEmp
   }*/
  protected changeEmployeeAttendance(data){

     console.log('changeEmployeeAttendance   ',data );
     this.ArrEmp.forEach((item)=>item.attendenceArr = new Array(this.daysInMonth.length));
     data.forEach((dateEntry,index)=> {
     // console.log(dateEntry,index);
      this.daysInMonth.forEach((day)=> {
        if(day.strdate===dateEntry["date"].toString()){
          //console.log('this.daysInMonth Index of :'+ this.daysInMonth.indexOf(day));
          //console.log("Entry Matched ",day.strdate,dateEntry["attendance"]);
          let index = this.daysInMonth.indexOf(day);
          for(var props in dateEntry["attendance"]){
            var attnds = dateEntry["attendance"][props];
            let employee: Employee = this.emp_service.getEmployeeFromOfficeByID(attnds.empId, this.ArrEmp);
            if(employee){
               employee.attendenceArr[index]= this.getPopulatedAttends(attnds,dateEntry["date"].toString()) ;
             }
          }
        }
      })
    })
  }
  protected getPopulatedAttends(attnds,date)
  {
     let attnd:any = new Object();
     attnd.date = date.substring(0,4)+"/"+date.substring(4,6)+"/"+ date.substring(6,8);     
     attnd.fn= attnds.status.fn ;
     attnd.an= attnds.status.an ;    
     attnd.fnEnttime = (attnds.ent && attnds.ent.time_raw && this.date_service.checkTimeisLessThan(attnds.ent.time_raw,this.date_service.getLunchBreakTime()))?attnds.ent.time_raw:'';
     attnd.fnExttime = (attnds.ext && attnds.ext.time_raw && this.date_service.checkTimeisLessThan(attnds.ext.time_raw,this.date_service.getLunchBreakTime()))?attnds.ext.time_raw:'';

     attnd.anEnttime = (attnds.ent && attnds.ent.time_raw && !this.date_service.checkTimeisLessThan(attnds.ent.time_raw,this.date_service.getLunchBreakTime()))?attnds.ent.time_raw:'';
     attnd.anExttime = (attnds.ext && attnds.ext.time_raw && !this.date_service.checkTimeisLessThan(attnds.ext.time_raw,this.date_service.getLunchBreakTime()))?attnds.ext.time_raw:'';
     return attnd;
  }



  protected updateEmployeeAttendance(data) {
    for (var key in data) {
     // console.log(data[key]._id + '     data[key]._id    ' + this.ArrEmp.length + '    : this.ArrEmp');
      let employee: Employee = this.emp_service.getEmployeeFromOfficeByID(data[key]._id, this.ArrEmp); // get Employee from ofice by emp_id

      employee.attendenceArr = this.getEmployeeAttends(data[key].attnds);       //marking employee attendance
      if (this.monthState == "next" || this.monthState == "current") {
       console.log(' updateEmployeeAttendance current');
        employee.CLbefore = employee.CLtotal;
        employee.LTBefore = employee.LTtotal;
      }
      else if( this.monthState == "currentUpdate")
      {
         console.log(' updateEmployeeAttendance currentUpdate');
       // console.log(employee.CLbefore + '   : employee.CLbefore');
       // console.log(this.getTotalCLAndLateTime(employee.attendenceArr).totalCL + '   : this.getTotalCLAndLateTime(employee.attendenceArr).totalCL');
       // console.log(employee.CLbefore + this.getTotalCLAndLateTime(employee.attendenceArr).totalCL)
      }
      else {
         console.log(' updateEmployeeAttendance previous');
        employee.CLbefore = employee.CLtotal - this.getTotalCLAndLateTime(employee.attendenceArr).totalCL;
        employee.LTBefore = employee.LTtotal - this.getTotalCLAndLateTime(employee.attendenceArr).totalLT;
      }
      // console.log('employee.CLbefore    :'+employee.id+' : '+employee.CLbefore);
      // console.log('employee.CLbefore    :'+employee.id+' : '+employee.LTBefore);
      // console.log('getTotalCLAndLateTime :'+employee.id+':  '+ this.getTotalCLAndLateTime(employee.attendenceArr).totalCL);
      // console.log('employee.CLtotal :'+employee.id+'  : '+  (employee.CLbefore + this.getTotalCLAndLateTime(employee.attendenceArr).totalCL));

      employee.CLtotal = employee.CLbefore + this.getTotalCLAndLateTime(employee.attendenceArr).totalCL;
      employee.LTtotal = employee.LTBefore + this.getTotalCLAndLateTime(employee.attendenceArr).totalLT;
      employee.HPL = this.getTotalCLAndLateTime(employee.attendenceArr).totalHPL;
      employee.CML = this.getTotalCLAndLateTime(employee.attendenceArr).totalCML;
      employee.EL = this.getTotalCLAndLateTime(employee.attendenceArr).totalEL;
      employee.LWA = this.getTotalCLAndLateTime(employee.attendenceArr).totalLWA;
      employee.LWAM = this.getTotalCLAndLateTime(employee.attendenceArr).totalLWAM;

    }
  }


  /* protected  getEmployeeFromOfficeByID(id)
   {
   for(var i in this.ArrEmp)
   {
   if( this.ArrEmp[i].id==id)
   {
   return this.ArrEmp[i] as Employee;
   }
   }
   return null;
   }*/
  protected getEmployeeAttends(attends) {
    let attArr: Array<any> = new Array(this.daysInMonth.length);
    for (var i = 0; i < this.daysInMonth.length; i++) {
      for (var j = 0; j < attends.length; j++) {
        if (attends[j].date == this.daysInMonth[i].strdate) {
          attArr[i] = attends[j];
          attArr[i].fn= '';
          attArr[i].fnEnttime='';
          attArr[i].fnExttime ='';
          attArr[i].anEnttime ='';
          attArr[i].anExttime ='';

          if(attends[j].FNStatus){
            attArr[i].fn= this.getAttendanceStatus(attends[j].FNStatus);
            attArr[i].fnEnttime = (attends[j].ENT)? this.getTimeAsPerAttendanceStatus(attends[j].FNStatus,attends[j].ENT,"fn","ent"):'';
            attArr[i].fnExttime = (attends[j].ENT)? this.getTimeAsPerAttendanceStatus(attends[j].FNStatus,attends[j].EXT,"fn","ext"):'';
           }
           if(attends[j].ANStatus){
            attArr[i].an= this.getAttendanceStatus(attends[j].ANStatus);
            attArr[i].anEnttime = (attends[j].ENT)? this.getTimeAsPerAttendanceStatus(attends[j].ANStatus,attends[j].ENT,"an","ent"):'';
            attArr[i].anExttime = (attends[j].ENT)? this.getTimeAsPerAttendanceStatus(attends[j].ANStatus,attends[j].EXT,"an","ext"):'';
           }
            if(attends[j].ENT && attends[j].FNStatus==undefined &&attends[j].ANStatus==undefined )
            {
                let hr = this.date_service.getTime(attends[j].ENT).hr;
                let min = this.date_service.getTime(attends[j].ENT).min;
                let hrtosec = hr * 3600;
                let mintosec = min * 60;
                let total = hrtosec + mintosec;
                let FNexitTimeinSeconds=46800;
                // let FNexitTimeinSeconds=47700;
                if(total<FNexitTimeinSeconds)
                {
                  attArr[i].fnEnttime =this.getFormattedTime(hr) +':'+this.getFormattedTime(min)
                }
                else
                {
                  attArr[i].anEnttime =this.getFormattedTime(hr) +':'+this.getFormattedTime(min)
                }
            }


        }
      }
    }
    return attArr;
  }

  protected getTotalCLAndLateTime(attendanceArr) {
    
    let totalcl = 0;
    let totalLT = 0;
    let totalLP = 0;
    let totalEP = 0;
    let totalHPL = 0;
    let totalCML = 0;
    let totalEL = 0;
    let totalLWA = 0;
    let totalLWAM = 0;
    let totalLPEP=0;
    attendanceArr.forEach(element => {
      if (element) {
        if (element.FNStatus != undefined) {
          totalcl = (this.getAttendanceStatus(element.FNStatus) == 'CL') ? totalcl + 0.5 : totalcl;
          totalLT = (this.getAttendanceStatus(element.FNStatus) == 'LT') ? totalLT + 1 : totalLT;
          totalLPEP = (this.getAttendanceStatus(element.FNStatus) == 'LP' || this.getAttendanceStatus(element.FNStatus) == 'EP') ? totalLPEP + 1 : totalLPEP;
          totalHPL = (this.getAttendanceStatus(element.FNStatus) == 'HPL') ? totalHPL + 0.5 : totalHPL;
          totalCML = (this.getAttendanceStatus(element.FNStatus) == 'CML') ? totalCML + 0.5 : totalCML;
          totalEL = (this.getAttendanceStatus(element.FNStatus) == 'EL') ? totalEL + 0.5 : totalEL;
          totalLWA = (this.getAttendanceStatus(element.FNStatus) == 'LWA') ? totalLWA + 0.5 : totalLWA;
          totalLWAM = (this.getAttendanceStatus(element.FNStatus) == 'LWAM') ? totalLWAM + 0.5 : totalLWAM;
        }
        if (element.ANStatus != undefined) {
          totalcl = (this.getAttendanceStatus(element.ANStatus) == 'CL') ? totalcl + 0.5 : totalcl;
          totalLT = (this.getAttendanceStatus(element.ANStatus) == 'LT') ? totalLT + 1 : totalLT;
          totalLPEP = (this.getAttendanceStatus(element.ANStatus) == 'LP' || this.getAttendanceStatus(element.ANStatus) == 'EP') ? totalLPEP + 1 : totalLPEP;
          totalHPL = (this.getAttendanceStatus(element.ANStatus) == 'HPL') ? totalHPL + 0.5 : totalHPL;
          totalCML = (this.getAttendanceStatus(element.ANStatus) == 'CML') ? totalCML + 0.5 : totalCML;
          totalEL = (this.getAttendanceStatus(element.ANStatus) == 'EL') ? totalEL + 0.5 : totalEL;
          totalLWA = (this.getAttendanceStatus(element.ANStatus) == 'LWA') ? totalLWA + 0.5 : totalLWA;
          totalLWAM = (this.getAttendanceStatus(element.ANStatus) == 'LWAM') ? totalLWAM + 0.5 : totalLWAM;
        }

       if(totalLPEP >= 4)
        {
          totalLT= totalLT+ 1;
         // totalLPEP = 0;
        }
       
        if (totalLT >= 3)
         {
          totalcl = totalcl + 1;
          totalLT = 0;
         }
        
      }
    });
    return {
      totalCL: totalcl,
      totalLT: totalLT,
      totalHPL: totalHPL,
      totalCML: totalCML,
      totalEL: totalEL,
      totalLWA: totalLWA,
      totalLWAM: totalLWAM
    };
  }

  protected changeAttendsArrayBlank() {
    for (let j = 0; j < this.ArrEmp.length; j++) {
      let emp: Employee = this.ArrEmp[j] as Employee;
      emp.attendenceArr = [];
    }
  }

  protected getArrDaysInMonth(noOfDays) {
    let _daysArr = [];
    for (var i = 0; i < noOfDays; i++) {
      let _datestring: string = this.date_service.getTimeString(this.yearIndex, (this.monthIndex + 1), (i + 1));
      let obj: Day = {
        id: (i + 1).toString(),
        date: (i + 1),
        strdate: _datestring.toString(),
        label: this.date_service.getNameodDayByDate((i + 1), this.monthIndex + 1, this.yearIndex),
        class: (this.date_service.checkWeekendDays((i + 1), this.monthIndex, this.yearIndex)) ? 'holiday' : 'workingday',
        time: '',
        year: '',
        name: '',
        type: '',
        isCurrentDay:false
      };
      _daysArr.push(obj);

    }
    return _daysArr;
  }

  protected checkAndUpdateEmployee_TotalCL(data) {
      
    let eployee: Employee = this.emp_service.getEmployeeFromOfficeByID(data.employee, this.ArrEmp);
    if (data.FNstatus != undefined) {
      eployee.CLtotal = (this.getAttendanceStatus(data.FNstatus) == 'CL') ? eployee.CLtotal + 0.5 : eployee.CLtotal;
      eployee.LTtotal = (this.getAttendanceStatus(data.FNstatus) == 'LT') ? eployee.LTtotal + 1 : eployee.LTtotal;
    }
    if (data.ANstatus != undefined) {
      eployee.CLtotal = (this.getAttendanceStatus(data.ANstatus) == 'CL') ? eployee.CLtotal + 0.5 : eployee.CLtotal;
      eployee.LTtotal = (this.getAttendanceStatus(data.ANstatus) == 'LT') ? eployee.LTtotal + 1 : eployee.LTtotal;
    }
    if (eployee.LTtotal >= 3) {
      eployee.CLtotal = eployee.CLtotal + 1;
      eployee.LTtotal = 0;
    }

  }

  public getAttendanceStatus(id_str) {
     if(id_str==undefined)
      {
        return '';
      }
  
    for (let i in this.arrAttendance) {
      if (id_str == this.arrAttendance[i]._id) {
        return this.arrAttendance[i].abbrevation;
      }
    }

    for (let j in this.arrLeaves) {
      
       if (id_str == this.arrLeaves[j]._id) {
        return this.arrLeaves[j].abbrevation;
      }
    }
    return '';
  }
private diference(timestamp1, timestamp2) {
    var difference = timestamp1 - timestamp2;
    var daysDifference = Math.floor(difference/1000/60/60/24);

    return daysDifference;
}
  public getTimeAsPerAttendanceStatus(status, timestamp, daystaus, type) {
   
    let attStatus = this.getAttendanceStatus(status);
    let strFormatTime = '';
    if(timestamp ==undefined)
    {
      return strFormatTime = '';
    }
    let time = this.date_service.getTime(timestamp);
    let hrtosec = time.hr * 3600;
    let mintosec = time.min * 60;
    let total = hrtosec + mintosec;
   // let Time = moment({h: new Date(timestamp).getHours(), m: new Date(timestamp).getMinutes()});
   // var FNexitTime = moment({h: 13, m: 15});
    var FNexitTimeinSeconds=46800;

    if (daystaus == 'fn' && type == 'ent' || daystaus == 'fn' && type == 'ext')
     {
      strFormatTime=(total<FNexitTimeinSeconds)? this.getFormattedTime(time.hr) + ' : ' + this.getFormattedTime(time.min) : '';
     }
    if (daystaus == 'an' && type == 'ent' || daystaus == 'an' && type == 'ext') {
       strFormatTime=(total>FNexitTimeinSeconds)? this.getFormattedTime(time.hr) + ' : ' + this.getFormattedTime(time.min) : '';
     }
    return  (!this.checkStatusisLeave(attStatus))? strFormatTime:'';

  }
   getFormattedTime(time)
  {
    return (time<10)?'0'+time:time;
  }
  checkStatusisLeave(status)
  {
     for (let j in this.arrLeaves)
      {
         if (status == this.arrLeaves[j].abbrevation) {
           return true;
        }
    }
    return false;
  }
  public getTimeAsPerTimeStamp(timestamp) {
    return this.date_service.getFormattedTime(timestamp);
  }

  public   getBgColor(attendance_status) {
    let colorArr = [{status: 'P', color: '#f80909'}, {status: 'A', color: '#d305d5'}, {
      status: 'CL',
      color: '#050fd5'
    }, {status: 'HPL', color: '#05bad5'}, {status: 'CML', color: '#0ad505'}, {
      status: 'EL',
      color: '#d5ba05'
    }, {status: 'LWA', color: '#d52205'}, {status: 'LWAM', color: '#ccb6b2'}];
    for (let i in colorArr) {
      if (colorArr[i].status == attendance_status) {
        return colorArr[i].color;
      }
    }
    return "";
  }

  public getClass(index) {    
    //return this.daysInMonth[index].class.toString();
    return '';
  }

  protected  getExcelFormattedData(str_month, ArrEmp) {
    console.log('getExcelFormattedData');
    let formattedData: Object = new Object;
    let key = str_month;
    let dataArr: Array<any> = [];
    ArrEmp.forEach(employee=> {
      
      let emp: Object = new Object;
      emp['name'] = employee.name;
      emp['Designation'] = employee.designation;
      emp['LTBefore'] = employee.LTBefore;
      emp['CLBefore'] = employee.CLbefore;
      emp['attnds'] = [];
      
      // employee.attendenceArr.forEach(attends=>{
      for (var i = 0; i < employee.attendenceArr.length; i++) {
      
        let attends = employee.attendenceArr[i];
        let attendsObj: Object = new Object;
        if (attends) {                
          attendsObj['day'] = this.date_service.getNameofDay(attends.date);
         /* attendsObj['ENT'] = {
            status: this.getAttendanceStatus(attends.FNStatus),
            time: this.getTimeAsPerAttendanceStatus(attends.FNStatus, attends.ENT, "fn", "ent")
          };
          attendsObj['EXT'] = {
            status: this.getAttendanceStatus(attends.ANStatus),
            time: this.getTimeAsPerAttendanceStatus(attends.ANStatus, attends.EXT, "an", "ext")
          };*/
          attendsObj['ENT'] = {
            status:  attends.fn,
            time:  attends.fnEnttime 
          };
          attendsObj['EXT'] = {
            status: attends.an,
            time:  attends.anExttime 
          };
        }
        else if (this.daysInMonth[i].type == "hd") {
          attendsObj['day'] = this.date_service.getNameofDay(this.daysInMonth[i].date);
          attendsObj['ENT'] = {status: 'H', time: ''};
          attendsObj['EXT'] = {status: 'H', time: ''};
        }
        else {
          attendsObj['day'] = '';
          attendsObj['ENT'] = {status: '', time: ''};
          attendsObj['EXT'] = {status: '', time: ''};
        }
        emp['attnds'].push(attendsObj);
      }
      // })
      emp['LTAfter'] = employee.LTtotal;
      emp['CLAfter'] = employee.CLtotal;
       emp['HPL'] = employee.HPL;
       emp['CML'] = employee.CML;
       emp['EL'] = employee.EL ;
       emp['LWA'] = employee.LWA  ;
       emp['LWAM'] = employee.LWAM   ;
      dataArr.push(emp);
    })
    formattedData[key] = dataArr;
    return formattedData;
  }
  ngOnDestroy(): void
  {
  this.totalSapcetoScroll=0;
}
public scrolltoLeft()
{
   $(".scroll").animate({ scrollLeft: $(".scroll").scrollLeft()+100 }, "fast");
}
public scrolltoRight()
{
   $(".scroll").animate({ scrollLeft: $(".scroll").scrollLeft()-100 }, "fast");
}

public scrollToStart()
{
  $(".scroll").animate({ scrollLeft: 0 }, "fast");
}
private isBtnPressed:Boolean=false;
public scrollToBack()
{
  this.isBtnPressed=true;
   let owner= this;
 $(".scroll").animate({ scrollLeft: $(".scroll").scrollLeft()-103 }, {

     duration: 500,
     complete: function(){     
         if( owner.isBtnPressed){ owner.scrollToBack()}
    }});
}
public scrollToNext()
{
  this.isBtnPressed=true;
  let owner= this;
  $(".scroll").animate({ scrollLeft: $(".scroll").scrollLeft()+103 }, {

     duration: 500,
     complete: function(){        
         if( owner.isBtnPressed){  owner.scrollToNext()}
    }

});
}
public scrollToEnd()
{

  $(".scroll").animate({ scrollLeft:$("#register").width()}, "fast");
}
public stopScroll()
{
this.isBtnPressed=false;
 $(".scroll").stop();
}


}


