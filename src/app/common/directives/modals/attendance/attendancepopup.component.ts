import {Component, ViewChild, OnInit, NgModule, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {Output} from "@angular/core/src/metadata/directives";
import {Input} from "@angular/core";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SelectModule} from 'angular2-select';
import {ModalComponent} from  'ng2-bs3-modal/ng2-bs3-modal';
import {IMyOptions, IMyDateModel} from 'mydatepicker';
import {DateService} from "../../../../service/date.service";
@Component({
  selector: 'attendance-popup',
  styleUrls: ["./attendancepopup.component.css"],
  templateUrl: './attendancepopup.component.html'
})
export class AttendanceModalComponent {
  @ViewChild('modal')
  modal: ModalComponent;
  @Input() employees: Array<any>;
  @Output() modalClosed = new EventEmitter();
  form: FormGroup;
  public arr_emp: Array<any> = [];
  protected date: string = '';
  protected empData;
  private hourArray: Array<any>;
  public minsArr: Array<any>;
  public strmessage: string = '';
  public myDatePickerOptions: IMyOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd-mm-yyyy',
    height: '30px',
    width: '130px',
    inline: false,
    selectionTxtFontSize: '16px',
    showInputField: true,
    showClearDateBtn: false,
    editableDateField: false
  };

  constructor(private ref: ChangeDetectorRef, private date_service: DateService) {

    this.hourArray = date_service.getHoursArr();
    this.minsArr = date_service.getMinsArr();
    //this.anfn_arr = date_service.getAnFnArr();
    //this.entext_arr = date_service.getEntExtArr();
  }

  public ngOnInit() {
    this.empData = {empcode: '', date: '', ent: ''}
    this.form = new FormGroup({});
    this.form.addControl('selectEmployee', new FormControl());
    this.form.addControl('selectHourEntry', new FormControl());
    this.form.addControl('selectMinEntry', new FormControl());
    this.form.addControl('selectHourExit', new FormControl());
    this.form.addControl('selectMinExit', new FormControl());
  }

  public onDateChanged(key, event: IMyDateModel) {
    //console.log('event.jsdate',event.jsdate );
    //console.log('event.date:', event.date);
    let year: string = event.date.year.toString();
    let month: string = ("0" + event.date.month).slice(-2);
    let day: String = ("0" + event.date.day).slice(-2);
    this.date = year + month + day;

  }

  public open() {
    this.clearAllFields();
    this.populateEmpArr();
    this.modal.open('md');
  }

  protected clearAllFields() {
    this.form.controls['selectEmployee'].setValue(null);
    this.form.controls['selectHourEntry'].setValue(null);
    this.form.controls['selectMinEntry'].setValue(null);
    this.form.controls['selectHourExit'].setValue(null);
    this.form.controls['selectMinExit'].setValue(null);
  }

  protected populateEmpArr() {
    if (this.employees.length > 0) {
      if (this.arr_emp.length == 0) {
        for (var i = 0; i < this.employees.length; i++) {
          console.log('value :',this.employees[i]);
          let emp = {id: this.employees[i].id, value: this.employees[i].ein, label: this.employees[i].name,ein: this.employees[i].ein}
          this.arr_emp[i] = emp;
        }
      }
    }
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

  getObjectByValue(value, arr) {
    for (var i in arr) {
      if (arr[i].value == value) {
        return arr[i];
      }
    }
    return null;
  }


  onSubmit(valid) {
    this.empData = {};
    if (this.form.value['selectEmployee'] != null && this.date != '') {
      let hrEnt = this.form.value['selectHourEntry'];
      let minEnt = this.form.value['selectMinEntry'];
      let hr = this.form.value['selectHourExit'];
      let min = this.form.value['selectMinExit'];
      this.empData.empcode = this.form.value['selectEmployee'];
      this.empData.date = this.date;
      if(hrEnt){
        this.empData.ent = hrEnt + ':' + minEnt;
      }
      if(hr){
        this.empData.ext = hr + ':' + min;
      }
      //this.empData.time = this.date_service.getTimeStamp(hr+':'+min);
      this.modal.close();
    }
    else {
      this.strmessage = 'Please select all fields.'
    }

  }
}
