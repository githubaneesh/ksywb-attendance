import {Component,ViewChild,OnInit,OnChanges ,NgModule, ChangeDetectionStrategy, ChangeDetectorRef,ElementRef,SimpleChanges,ViewChildren,QueryList} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {Output} from "@angular/core/src/metadata/directives";
import {Input} from "@angular/core"; 
import $ from "jquery";
/*import {Ng2SliderComponent} from 'ng2-slider-component/ng2-slider.component';
import {SlideAbleDirective} from 'ng2-slideable-directive/slideable.directive';
import {Ng2StyledDirective} from 'ng2-styled-directive/ng2-styled.directive';*/
 import '../../../../../node_modules/nouislider/distribute/nouislider.min.css'
@Component({
  selector: 'scrollbar',
  styleUrls:["./scrollbar.component.css"],
  templateUrl:'./scrollbar.component.html',
    
})
export class ScrollBarComponent  implements OnInit {
   private scroll:HTMLInputElement;
  
  @Input() elementId:String;
 
  constructor(private el: ElementRef){

     
  }
 ngOnInit() {
          this.scroll = $('#'+this.elementId);
 
  
   /*  $(":range").rangeinput({
      
          
        onSlide: function(ev, step)  {
            scroll.css({left: -step});
          },
        
           
          progress: true,
        
          
          value: 100,
        
          
          change: function(e, i) {
            scroll.animate({left: -i}, "fast");
          },
        
          
          speed: 0
        
        });*/
  }
 showVal(val)
 {
   let value : number = parseFloat((document.getElementById("inputRange") as HTMLInputElement).value);
   //console.log(value + '  show valin range');
   value =(value>=2600)?value+300:value;
   $("#scrollableTable").animate({ scrollLeft:value }, "fast");
 }
 slideEvent(val)
 {
 let step : number = parseFloat((document.getElementById("inputRange") as HTMLInputElement).step);
 
 // $('#'+this.elementId).animate({left: value}, "fast");
   $("#scrollableTable").css({left: -step});
 }
 rangeValueChanged($event,range_3_start,range_3_end)
 {
    //console.log('range changed');
 }
public someRange2config: any = {
  behaviour: 'drag',
  connect: true,
  start: [0, 5],
  margin: 1,
  limit: 5,  
  range: {
    min: 0,
    max: 20
  },
  pips: {
    mode: 'steps',
    density: 5
  }
};
  
   
   
    
}