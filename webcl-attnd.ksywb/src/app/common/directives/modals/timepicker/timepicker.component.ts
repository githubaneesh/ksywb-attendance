import {Component, ViewChild, OnInit, NgModule, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {Output} from "@angular/core/src/metadata/directives";
import {Input} from "@angular/core";
import {ModalComponent} from  'ng2-bs3-modal/ng2-bs3-modal';
import {DropDownComponent} from '../../dropdown';
import {DateService} from "../../../../service/date.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SelectModule} from 'angular2-select';
@Component({
  selector: 'timepicker-popup',
  styleUrls: ["./timepicker.component.css"],
  templateUrl: './timepicker.component.html',
  /* directives:[DropDownComponent]*/

})
export class TimePickerModalComponent {
  @ViewChild('modal')
  modal: ModalComponent;
  @Output() modalClosed = new EventEmitter();
  private hourArrayOrig: Array<any>; 
  public hourArray: Array<any>;
  public minsArr: Array<any>;
  public ampmArray;
  public selectedHour;
  public selectedMin;
  public selectedState;
  public attends;
  public leavetype;
  private emp;
  private daysInMonth;
  public strWarning:string;
  form: FormGroup;

  constructor(private ref: ChangeDetectorRef, private date_service: DateService) {

    this.hourArrayOrig = date_service.getHoursArr();
    this.minsArr = date_service.getMinsArr();
    this.ampmArray = [{value: 'AM', label: 'AM'}, {value: 'PM', label: 'PM'},]
  }

  public ngOnInit() {

    this.form = new FormGroup({});
    this.form.addControl('selectHr', new FormControl());
    this.form.controls['selectHr'].setValue('01');
    this.form.addControl('selectMin', new FormControl());
    this.form.controls['selectMin'].setValue('00');
  }

  public open(attends, type,_emp,_daysInMonth) {
   
    if (!attends) {
      attends = {an: "", anEnttime: "", anExttime: "", fn: "", fnEnttime: "", fnExttime: ""}
    }
    this.attends = attends;
    this.leavetype = type;
    this.emp=_emp;
    this.daysInMonth = _daysInMonth
    //this.showDeafultTime(attends, type);   
    if(this.leavetype == "FNENT" ||this.leavetype == "FNEXT")
    {
      this.hourArray =  this.hourArrayOrig.slice(0,13) 
    }
    else if(this.leavetype == "ANENT" || this.leavetype == "ANEXT")
    {
      this.hourArray =  this.hourArrayOrig.slice(12,23) 
    }
    this.modal.open('md');
  }

  showDeafultTime(attends, type) {
    let hour: String = '';
    let min: String = '';
    switch (type) {
      case 'FNENT':
        //console.log('FNENT');
      if (attends.fnEnttime != '') {
          hour = (attends.fnEnttime) ? this.date_service.get2DigitTime(this.date_service.getTime(attends.fnEnttime).hr).toString() : null;
          min = (attends.fnEnttime) ? this.date_service.get2DigitTime(this.date_service.getTime(attends.fnEnttime).min).toString() : null;
        }
        break;
      case 'FNEXT':
        //console.log('FNEXT');
        if (attends.fnExttime != '') {
          hour = (attends.fnExttime) ? this.date_service.get2DigitTime(this.date_service.getTime(attends.fnExttime).hr).toString() : null;
          min = (attends.fnExttime) ? this.date_service.get2DigitTime(this.date_service.getTime(attends.fnExttime).min).toString() : null;
        }
        break;
      case 'ANENT':
        //console.log('ANENT');
        if (attends.anEnttime != '') {
          hour = (attends.anEnttime) ? this.date_service.get2DigitTime(this.date_service.getTime(attends.anEnttime).hr).toString() : null;
          min = (attends.anEnttime) ? this.date_service.get2DigitTime(this.date_service.getTime(attends.anEnttime).min).toString() : null;
          //console.log('attends.anEnttime!=');
        }
        break;
      case 'ANEXT':
        //console.log('ANEXT');
        if (attends.anExttime != '') {
          hour = (attends.anExttime) ? this.date_service.get2DigitTime(this.date_service.getTime(attends.anExttime).hr).toString() : null;
          min = (attends.anExttime) ? this.date_service.get2DigitTime(this.date_service.getTime(attends.anExttime).min).toString() : null;
        }
        break;
      default:
        hour = null;
        min = null;
    }
    //console.log(hour +'   hour  '+  typeof hour)
    this.form.controls['selectHr'].setValue(hour);
    this.form.controls['selectMin'].setValue(min);
  }

  closed() {    
    let hr = this.form.value['selectHr'];
    let min = this.form.value['selectMin'];    
    let timestamp = hr + ":" + min    
    let data;
    switch (this.leavetype) {
      case "FNENT":
      case "ANENT":       
        data = {
          date: this.daysInMonth.strdate,
          ent: timestamp
        }
        break;
      case "FNEXT":
      case "ANEXT":
        data = {
          date: this.daysInMonth.strdate,
          ext: timestamp
        }
        break;
    }     
    this.modalClosed.emit({data:data,attends: this.attends, time: hr + ':' + min, type: this.leavetype,emp:this.emp,day:this.daysInMonth});
  }

  dismissed() {

  }

  opened() {

    //console.log('Modal Opened');
  }

  navigate() {

  }

  optionSelectHandler($event) {
    //console.log('optionSelectHandler  '+ $event);
  }

  public onSubmit(valid) {
    console.log("this.form.value['selectHr']  :",this.form.value['selectHr']);
    if(this.form.value['selectHr'] == undefined )
    {
      this.strWarning = "Hour required"
      return;
    }
    else if(this.form.value['selectMin']==undefined)
    {
      this.strWarning = "Minute required"
      return;
    }

    if (valid) {
      this.modal.close();
    }
  }
}
