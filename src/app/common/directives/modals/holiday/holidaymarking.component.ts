import {Component,ViewChild,OnInit,NgModule} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {Output} from "@angular/core/src/metadata/directives";
import {Input} from "@angular/core";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SelectModule} from 'angular2-select';
import { ModalComponent } from  'ng2-bs3-modal/ng2-bs3-modal';
@Component({
  selector: 'holidaymarking-popup',
  styleUrls:["./holidaymarking.component.css"],
  templateUrl:'./holidaymarking.component.html'
})
export class HolidayModalComponent   {
  @ViewChild('modal')
  modal:ModalComponent;
  @Output() hmodalClosed = new EventEmitter();
  form: FormGroup;
  HDayoptions: Array<any> = [];
  holiday:any;
  constructor(){
      
      this.HDayoptions=[ { value:'fn',label:'Fore Noon',bgColor:'#f2eded'},{value:'an',label:'After Noon',bgColor:'#c2bebe'},{value:'full',label:'Full Day',bgColor:'#dedede'}];
      
  }
  public ngOnInit(){
        this.holiday={name:'',date:"",time:""}
        this.form = new FormGroup({});
        this.form.addControl('selectSingle', new FormControl());
        this.form.controls['selectSingle'].setValue('full');
  }

  public open(date)
  {
      this.holiday.date = date.strdate;
      this.modal.open('sm');
      // console.log('Call Modal Opening for ');
  }
    closed() {        
       // let Value =this.form.value['selectSingle'];
       // this.hmodalClosed.emit(this.getObjectByValue(Value));
        this.hmodalClosed.emit(this.holiday);
    }

    dismissed() {
       
    }

    opened() {
      
        //console.log('Modal Opened');
    }

    navigate() {
      
    }
public onSubmit(valid)
  {
      
    if(valid)
    {
       this.holiday.time = this.form.value['selectSingle']; 
       this.modal.close();

    }
  }

    getObjectByValue(value)
      {
           for(let i in this.HDayoptions)
           {
                if(this.HDayoptions[i].value==value)
                {
                return this.HDayoptions[i];
                }
           }
           return null;
      }
    
}