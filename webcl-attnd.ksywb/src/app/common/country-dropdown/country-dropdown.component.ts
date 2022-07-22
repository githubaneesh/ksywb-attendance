/**
 * Created by ashishbaheti on 26/02/17.
 */
import {Component} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {Output} from "@angular/core/src/metadata/directives";

@Component({
  selector: 'country-dropdown',
  templateUrl:'./country-dropdown.component.html'
})
export class CountryDropDown {

  @Output() countrySelected = new EventEmitter();

  public ngOnInit(){
    this.countrySelected.emit("India");
  }
  public changedCountry($event){
    //console.log($event.currentTarget.value);
    this.countrySelected.emit($event.currentTarget.value);

  }
}
