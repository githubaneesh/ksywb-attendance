import {Component,ViewChild,OnInit,NgModule, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {Output} from "@angular/core/src/metadata/directives";
import {Input} from "@angular/core";
import { ModalComponent } from  'ng2-bs3-modal/ng2-bs3-modal';
@Component({
  selector: 'warning-popup',
  styleUrls:["./warningpopup.component.css"],
  templateUrl:'./warningpopup.component.html'
})
export class WarningModalComponent   {
  @ViewChild('modal')
  modal:ModalComponent;
  @Output() modalClosed = new EventEmitter();
  public title;
  public body;

  constructor(private ref: ChangeDetectorRef){

  }
  public ngOnInit(){


  }

    public open(dataObj)
    {

        this.title=dataObj.title;
        this.body=dataObj.body;
         this.modal.open('md');

    }
    closed() {
         this.modalClosed.emit({});
    }

    dismissed() {

    }
    opened() {

        //console.log('Warning Modal Opened');
    }

    navigate() {

    }


}
