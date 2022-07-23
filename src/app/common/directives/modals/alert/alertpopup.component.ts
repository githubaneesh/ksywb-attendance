import {Component,ViewChild,OnInit,NgModule, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {Output} from "@angular/core/src/metadata/directives";
import {Input} from "@angular/core"; 
import { ModalComponent } from  'ng2-bs3-modal/ng2-bs3-modal';
@Component({
  selector: 'alert-popup',
  styleUrls:["./alertpopup.component.css"],
  templateUrl:'./alertpopup.component.html'
})
export class AlertModalComponent   {
  @ViewChild('modal')
  modal:ModalComponent;
  private userDetails;
  @Output() modalClosed = new EventEmitter();
  public user_name;     
  public user_mobile;                         
  public user_code 
  public user_email ;
  constructor(private ref: ChangeDetectorRef){      
         
  }
  public ngOnInit(){

        
  }

    public open(userObj)
    { 
        ////console.log('res',this.userDetails);
        this.userDetails=userObj        
        this.user_name=this.userDetails.data.name;     
         this.user_code =this.userDetails.data.ein ;
         this.user_mobile=this.userDetails.data.mobile;                        
        this.user_email=this.userDetails.data.email ;
        this.modal.open('md');
      
    }
    closed() {      
         this.modalClosed.emit({});
    }

    dismissed() {
       
    }

    opened() {
      
        //console.log('Modal Opened');
    }

    navigate() {
      
    }
   
    
}