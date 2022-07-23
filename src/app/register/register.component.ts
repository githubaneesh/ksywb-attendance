/**
 * Created by Aneesh on 21-02-2017.
 */
import { Component, OnInit } from '@angular/core';
import { User } from './user.interface';
import { IMyOptions, IMyDateModel } from 'mydatepicker';
import { CountryDropDown } from "../common/country-dropdown";
import { Modal } from "../common/modal/modal.component";
import { HttpClient} from "../service/fileupload.service"
@Component({
  selector: 'register',
  styleUrls: [ './register.component.css' ],
  templateUrl: './register.component.html',
  providers: [HttpClient]
})

export class RegisterComponent implements OnInit {

  constructor(private http_service: HttpClient) {
  }
  public imageSelected : Boolean = false;
  public user : User;
  public myDatePickerOptions : IMyOptions = {
    todayBtnTxt : 'Today',
    dateFormat : 'yyyy-mm-dd',
    height : '30px',
    width : '130px',
    inline : false,
    selectionTxtFontSize : '16px',
    showInputField : true,
    showClearDateBtn : false
  };
  public ngOnInit() {
     this.user = {
        name : '',
        mobile : '',
        address : 'Address',
        email : '',
        country : '',
        from : null,
        to : null,
        file:""
    };
  }
  public save (invalid: boolean) {
    //console.log(invalid);
    if(invalid){
      let _this = this;
      this.http_service.register(this.user).then(result=>{
        //console.log("result",result);

      }).catch(error=>{
        //console.log("error",error);
      })
    }
  }
  public onDateChanged(key,event: IMyDateModel) {
    this.user[key] = new Date(event.jsdate).toLocaleDateString();
    //console.log(this.user,key);
  }
  public countrySelected(country) {
    //console.log("countryUpdate",country);
    this.user.country = country;
    // event properties are: event.date, event.jsdate, event.formatted and event.epoc
  }
  public fileUploaded(file) {
    //console.log("fileUploaded",file);
    this.user.file = file._id;
    // event properties are: event.date, event.jsdate, event.formatted and event.epoc
  }



}
