import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AttendanceRegisterComponent} from "./attendance/attendanceregister.component";
import {EmployeeListComponent} from "./employeelist/employeelist.component";
import {AddEmployeeComponent} from "./addemployee/addemployee.component";
import {AddHoldaysComponent} from "./addholidays/addholidays.component";
import {MyAccountComponent} from "./myaccount/myaccount.component";
import {LogoutComponent} from "./logout/logout.component";
import {AddUserComponent} from "./adduser/adduser.component";
import {UserListComponent} from "./userlist/userlist.component";
import{OfficeListComponent} from "./officelist/officelist.component";
import {AddOfficeComponent} from "./addoffice/addoffice.component";
import {ProfileComponent} from "./profile/profile.component";
import {SettingsComponent }from "./settings/settings.component";
import {HolidayListComponent} from "./holidaylist/holidaylist.component";
import {TimeListComponent} from "./timelist/timelist.component"
export const ROUTES: Routes = [
  { path: 'login',   component: LoginComponent },
  { path:'attendance', component:AttendanceRegisterComponent },
  { path:'employeelist', component:EmployeeListComponent },
  { path:'addemployee', component:AddEmployeeComponent },
  {path:'addholidays',component:AddHoldaysComponent },
  {path:'myaccount',component:MyAccountComponent },
   {path:'logout',component:LogoutComponent },
   {path:'userlist',component:UserListComponent },
   {path:'adduser',component:AddUserComponent },
   {path:"officelist",component:OfficeListComponent},
   {path:"addoffice",component:AddOfficeComponent},
   {path:"settings/:id",component:SettingsComponent},
   {path:"settings",component:SettingsComponent},
   {path:"profile",component:ProfileComponent},
   {path:"holidaylist",component:HolidayListComponent},
   {path:"timelist",component:TimeListComponent},
  { path: '**', redirectTo: 'login' }
];
