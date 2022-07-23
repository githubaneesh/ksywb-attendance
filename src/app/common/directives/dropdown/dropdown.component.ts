import {Component,ViewChild,OnInit,OnChanges ,NgModule, ChangeDetectionStrategy, ChangeDetectorRef,ElementRef,SimpleChanges,ViewChildren,QueryList} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {Output} from "@angular/core/src/metadata/directives";
import {Input} from "@angular/core"; 
import { ModalComponent } from  'ng2-bs3-modal/ng2-bs3-modal';
  
@Component({
  selector: 'dropdown',
  styleUrls:["./dropdown.component.css"],
  templateUrl:'./dropdown.component.html',
    
})
export class DropDownComponent  implements OnInit {
  @ViewChildren('selectorEl') selector_El: QueryList<ElementRef>;
  @Output() optionSelected = new EventEmitter();
  @Input() optionList:Array<any>;
  public selectedOption:String;
  constructor(private el: ElementRef){

     
  }
 ngOnInit() {
     
  }

  ngOnChanges(changes: SimpleChanges){
     //console.log('input in DropDown list chnged');
     //this.el.nativeElement.selectedIndex  = 0;   
      let elList = this.el.nativeElement.querySelectorAll('option'); 
       //console.log(elList.length + ' option list length ngDoCheck'); 
       //x[i_item]; 
  }



 /* ngAfterViewInit() {
      let elList = this.el.nativeElement.querySelectorAll('option'); 
     
  }
 ngDoCheck()
  {
     let elList = this.el.nativeElement.querySelectorAll('option'); 
     if(elList.length>0)
     {
      elList[0].selected=true;
     }
     // console.log(elList.length + ' option list length ngDoCheck  '+ elList[0]); 
  }*/
  /*ngAfterViewChecked()
  {
     let elList = this.el.nativeElement.querySelectorAll('option'); 
     if(elList.length>0)
     {
      elList[0].selected=true;
     }
      //console.log(elList.length + ' option list length ngAfterViewChecked  '+ elList[0]); 
  }*/

 public changedOption($event){
    //console.log($event.currentTarget.value);
    this.optionSelected.emit($event.currentTarget.value);
 }
   
   
    
}