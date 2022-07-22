import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MyDatePickerModule } from 'mydatepicker';
import { ImageUploadModule } from 'angular2-image-upload';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import {SelectModule} from 'angular2-select';
 /*import {Ng2SliderComponent} from 'ng2-slider-component/ng2-slider.component';
import {SlideAbleDirective} from 'ng2-slideable-directive/slideable.directive';
import {Ng2StyledDirective} from 'ng2-styled-directive/ng2-styled.directive';*/
//import { NouisliderModule } from 'ng2-nouislider';

import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { NoContentComponent } from './no-content';


import '../styles/styles.scss';
import '../styles/headings.css';
import {LoginComponent} from "./login/login.component";
import {AddEmployeeComponent} from "./addemployee/addemployee.component";
import {EmployeeListComponent} from "./employeelist/employeelist.component";
import {AddHoldaysComponent} from "./addholidays/addholidays.component";
import {MyAccountComponent} from "./myaccount/myaccount.component";
import {LogoutComponent} from "./logout/logout.component";
import {RegisterComponent} from "./register/register.component";
import {CountryDropDown} from "./common/country-dropdown/country-dropdown.component";
import {PhotoUploadComponent} from "./common/photoupload/photoupload.component";
import {Draggable} from "./common/directives/draggable";
import {AttendanceRegisterComponent} from "./attendance/attendanceregister.component";
import {HolidayModalComponent} from "./common/directives/modals/holiday/holidaymarking.component";
import {ANFNLeaveModalComponent} from "./common/directives/modals/fnan/fnanpopup.component";
import {ImportExcelModalComponent} from "./common/directives/modals/excel/excelpopup.component";
import {AlertModalComponent} from "./common/directives/modals/alert/alertpopup.component";
import {TimePickerModalComponent} from "./common/directives/modals/timepicker/timepicker.component";
import {AttendanceModalComponent} from "./common/directives/modals/attendance/attendancepopup.component";
import {DropDownComponent} from "./common/directives/dropdown/dropdown.component";
import {WarningModalComponent} from "./common/directives/modals/warning/warningpopup.component";
import {ScrollBarComponent} from "./common/directives/scrollbar/scrollbar.component";
import {LeaveMarkingModalComponent} from "./common/directives/modals/leave/leave.component";
import {PrintPreviewModalComponent} from "./common/directives/modals/printpreview/printpreview.component";
import {AuthGuard} from "./service/guards/auth.guard";
import {HttpClient} from "./service/fileupload.service";
import {UserAuthentificationService} from "./service/userAuthentication.service";
import {DateService} from "./service/date.service";
import {OfficeDetailsService} from "./service/officeDetails.service";
import {ApiService} from "./service/api.service";
import {EmployeeDetailsService} from "./service/employeelDetails.service";
import {AttendanceService} from "./service/attendance.service";
import {CompanyDetailsService } from "./service/companyDetails.service";
import {CONSTANTS} from "./service/constants.service";
import {AddUserComponent} from "./adduser/adduser.component";
import {UserListComponent} from "./userlist/userlist.component";
import {OfficeListComponent} from "./officelist/officelist.component";
import {AddOfficeComponent} from "./addoffice/addoffice.component";
import {ProfileComponent} from "./profile/profile.component";
import {SettingsComponent }from "./settings/settings.component";
import {HolidayListComponent} from "./holidaylist/holidaylist.component";
import {TimeListComponent} from "./timelist/timelist.component";
// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
  HttpClient,
  UserAuthentificationService,
  DateService,
  OfficeDetailsService,
  ApiService,
  EmployeeDetailsService,
  AttendanceService,
  CONSTANTS,
  CompanyDetailsService
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    NoContentComponent,
    RegisterComponent,CountryDropDown,PhotoUploadComponent,Draggable,LoginComponent,AttendanceRegisterComponent ,
    EmployeeListComponent,HolidayModalComponent,ANFNLeaveModalComponent,ImportExcelModalComponent,AddEmployeeComponent,
    AlertModalComponent,TimePickerModalComponent,AttendanceModalComponent,AddHoldaysComponent,MyAccountComponent,DropDownComponent,WarningModalComponent ,
    LogoutComponent,ScrollBarComponent,LeaveMarkingModalComponent,PrintPreviewModalComponent,UserListComponent,AddUserComponent,OfficeListComponent,AddOfficeComponent,
    ProfileComponent,SettingsComponent,HolidayListComponent,TimeListComponent
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MyDatePickerModule,
    ImageUploadModule.forRoot(),
    Ng2Bs3ModalModule,
    SelectModule,    
    RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules })
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection

    AuthGuard,
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public appState: AppState
  ) {}

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
