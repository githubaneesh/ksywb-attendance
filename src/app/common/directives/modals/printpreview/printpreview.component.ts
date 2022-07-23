import {Component,ViewChild,OnInit,NgModule, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {Output} from "@angular/core/src/metadata/directives";
import {Input} from "@angular/core"; 
import { ModalComponent } from  'ng2-bs3-modal/ng2-bs3-modal'; 
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
 
@Component({
  selector: 'printpreview-popup',
  styleUrls:["./printpreview.component.css"],
  templateUrl:'./printpreview.component.html',
 /* directives:[DropDownComponent]*/
    
})
export class PrintPreviewModalComponent   {
  @ViewChild('modal')
  modal:ModalComponent;
  @Output() modalClosed = new EventEmitter();
  
  public attendanceData=[];
  public arrDays=[];
  public strMonth;
  constructor(){      
        
  }
  public ngOnInit(){
 
  }

    public open(strMonth,attendanceData)
    {   
      this.strMonth = strMonth;
      this.attendanceData = attendanceData[strMonth];
       console.log(this.attendanceData );
     // this.arrDays = daysInmonth;
      this.modal.open('lg');
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
    printFunction()
    {
        var innerContents = document.getElementById("printPreview").innerHTML;
        var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWinindow.document.open();
        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="printpreview.css" /><style>.report_body{margin-top:10px;margin-bottom:10px;}.report-header{text-align: center;margin-bottom:30px;border-bottom: 1px solid #000000;}.report-employee{margin-top:0px;}.report-employee h4{font-size: 14px;margin:3px 0px}.attendance_table > thead > tr > th{width: 40px;text-align: center;border: 1px solid #000000;}.daysanfn{height: 30px}.hor-line{height: 2px;background-color: #000000} table{border-spacing: inherit;}.attend-coloumn{width:28px;display: inline-block;float: left;border: 1px solid #000000;text-align: center}.border_top{border-top:1px solid #000000 }.status h4{margin: 5px 0px;}.signature{margin-top: 50px;text-align: right;margin-bottom: 50px;margin-right: 50px;.leavesummary h4{margin: 5px 0px 20px;}</style></head><body onload="window.print()">' + innerContents + '</html>'); popupWinindow.document.close();
     
    }
   
}