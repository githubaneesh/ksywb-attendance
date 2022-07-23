import {
  Component,
  ViewChild,
  AfterViewInit,
  OnChanges,
  NgModule,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges
} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {Output} from "@angular/core/src/metadata/directives";
import {Input} from "@angular/core";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SelectModule} from 'angular2-select';
import {ModalComponent} from  'ng2-bs3-modal/ng2-bs3-modal';
import {EmployeeDetailsService} from "../../../../service/employeelDetails.service"
import {Employee} from "../../../../attendance/employee";
import {CONSTANTS} from "../../../../service/constants.service";
@Component({
  selector: 'anfnleave-popup',
  styleUrls: ["./fnanpopup.component.css"],
  templateUrl: './fnanpopup.component.html'

})
export class ANFNLeaveModalComponent implements OnInit {
  @ViewChild('modal')
  modal: ModalComponent;
  @ViewChild('leaveselection') selectionelement: HTMLSelectElement;
  @Input() leaveOptions: Array<any>;
  @Input() attndOptions: Array<any>;
  @Input() employees: Array<any>;
  @Output() modalClosed = new EventEmitter();
  form: FormGroup;
  public options: Array<any> = [];
  public selectedOption: Number = 0;
  private colorArr: Array<any>;
  private attends;
  private leavetype;

  constructor(private ref: ChangeDetectorRef, private emp_service: EmployeeDetailsService, private constats: CONSTANTS) {
    this.colorArr = ['#f80909', '#d305d5', '#050fd5', '#05bad5', '#0ad505', '#d5ba05', '#d52205', '#ccb6b2'];
  }

  public ngOnInit() {
    this.form = new FormGroup({});
    this.form.addControl('selectLeave', new FormControl());
    // this.form.controls['selectLeave'].setValue('P');
  }

  public open(attends, type) {
    console.log(attends, ' : attends');
    console.log(type, ' : attends.type');
    this.attends = attends;
    this.leavetype = type;
    this.populateLeaveoptions();
    this.showDefaultSelection();
    this.modal.open('md');
  }

  populateLeaveoptions() {
    this.options = [];
    console.log(this.attndOptions,this.leaveOptions)
    if(this.attends.employee){
      let emp_id: String = this.attends.employee._id || this.attends.employee.id;
      let employee: Employee = this.emp_service.getEmployeeFromOfficeByID(emp_id, this.employees);
      if (Number(employee.CLtotal) >= this.constats.TOTALCL) {
        //console.log('>5');
        for (var i in this.leaveOptions) {
          //console.log(this.leaveOptions[i].abbrevation + '  : abbreviation');
          if (this.leaveOptions[i].abbrevation != 'CL') {
            let leaveObj = {
              id: this.leaveOptions[i]._id,
              value: this.leaveOptions[i].abbrevation,
              label: this.leaveOptions[i].name + ' (' + this.leaveOptions[i].abbrevation + ')',
              bgColor: this.colorArr[i]
            };
            this.options[i] = leaveObj;
          }
        }
      }
      else {
        // console.log('<5');
        for (var i in this.leaveOptions) {
          let leaveObj = {
            id: this.leaveOptions[i]._id,
            value: this.leaveOptions[i].abbrevation,
            label: this.leaveOptions[i].name + ' (' + this.leaveOptions[i].abbrevation + ')',
            bgColor: this.colorArr[i]
          };
          this.options[i] = leaveObj;
        }
      }
      // console.log(this.options.length + ' :this.options.length');
    }else{

      for (var i in this.attndOptions) {
        let attndObj = {
          id: this.attndOptions[i]._id,
          value: this.attndOptions[i].abbrevation,
          label: this.attndOptions[i].name + ' (' + this.attndOptions[i].abbrevation + ')',
          bgColor: this.colorArr[i]
        };
        this.options[i] = attndObj;
      }
    }
  }

  showDefaultSelection() {
    let defStatus: String;
    switch (this.leavetype) {
      case 'FN':
        for (var i in this.options) {
          if (this.attends.FNStatus && this.attends.FNStatus == this.options[i].id) {
            defStatus = this.leaveOptions[i].abbrevation;
          }
        }
        // console.log(defStatus+ '  FN  defStatus');
        break;
      case 'AN':
        for (var i in this.options) {
          if (this.attends.ANStatus && this.attends.ANStatus == this.options[i].id) {
            defStatus = this.leaveOptions[i].abbrevation;
          }
        }
        //  console.log(defStatus+ '  AN  defStatus');
        break;
      default :
        defStatus = 'undefined';
        break;
    }
    //  console.log(defStatus+ '    defStatus');
    this.form.controls['selectLeave'].setValue(defStatus);

  }

  getSelectedLeaveStatus() {


  }


  closed() {

    //   console.log('FnAn popup Modal closed   ');
    let selectedObject = this.getObjectByValue(this.form.value['selectLeave']);
    console.log(selectedObject.value);
    this.modalClosed.emit({selection: selectedObject.value, attends: this.attends, anfn: this.leavetype});
    //this.modalClosed.emit({date:this.attends.date,anfn:this.leavetype.toLowerCase()})
  }

  public onSubmit(valid) {

    if (valid) {

      this.modal.close();

    }
  }

  dismissed() {

  }

  opened() {

    //console.log('Modal Opened');
  }

  navigate() {

  }

  getObjectByValue(value) {
    for (var i in this.options) {
      if (this.options[i].value == value) {
        return this.options[i];
      }
    }
    return null;
  }

}
