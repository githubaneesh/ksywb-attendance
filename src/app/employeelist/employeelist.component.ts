import { Component,OnInit} from "@angular/core";
import {ApiService} from "../service/api.service";
import {UserAuthentificationService} from "../service/userAuthentication.service";
import {OfficeDetailsService} from "../service/officeDetails.service";
import {EmployeeDetailsService} from "../service/employeelDetails.service";
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';


@Component({
    selector: 'employeelist',
    styleUrls: [ './employeelist.component.css' ],
    templateUrl:'./employeelist.component.html'
})

export class EmployeeListComponent implements OnInit
{
  public empList:Array<any>=[]
  public originalEmpList:Array<any>=[]
  public officeDescription:string="";
  public arrOffice:Array<any>;
  public formGroup: FormGroup;
  public msg:string=""
  constructor(private service:ApiService,private userService:UserAuthentificationService,
              private officeService:OfficeDetailsService,private emp_service:EmployeeDetailsService,private router: Router) {
 if(this.userService.isLoggedIn()!=null)
        {
           this.userService.loginDone();
           this.empList=[];
           this.officeDescription = "";
           this.formGroup = new FormGroup({});
           this.formGroup.addControl('selectOffice', new FormControl());

        }
        else
        {
           this.userService.navigateToUrl('login');
        }

  }

  public ngOnInit()
  {
    this.getEmpList();
  }

  protected getEmpList(){

    this.officeService.getCompanyList(this.userService.getUserToken()).then(result => {
          console.log('result:this.office_service.getCompanyList', result);
           this.arrOffice = (result as any).data.offices.map((item)=>{
            item.id = item._id;
            item.value = item;
            item.label = item.name;
            return item;
          });
        this.showDefaultOffice(this.arrOffice);
    }).catch(error => {
      if (error) {
      }
    })
 }
 protected showDefaultOffice(arrOffices)
  {
    let defaultVal = null;
    arrOffices.map(function(item){
      if(item.label =='HeadOffice,Kudapanakunnu')
      {
        defaultVal = item
      }
    })
    this.formGroup.controls['selectOffice'].setValue([defaultVal]);
    let selectedOffice =  defaultVal;
    this.officeDescription = selectedOffice.address;
    this.empList = selectedOffice.employees.map(function (item) {
      item.edit=false;
      return item;
    });
    this.originalEmpList = selectedOffice.employees.slice().map(function (item) {
      item.edit=false;
      return Object.assign({},item);
    })
    console.log(this.empList,this.originalEmpList)
  }

   public officeSelected($event)
  {
          this.officeDescription = $event.value.address;
          this.empList =  $event.value.employees;
  }


   navigateToURL(url)
  {
    //console.log('url  '+ url);
   this.router.navigate(['/'+url]);
  }
  public addButtonsEvent(){
  }
  public deleteEmp(emp){
    console.log(emp);
    if(confirm("Are you sure to delete employee "+emp.name)) {
      console.log("Implement delete functionality here");
      this.emp_service.addOrUpdateEmployee("delete",this.userService.getUserToken(),emp).then(res=>{
        //console.log(res);
        this.getEmpList();
      })
    }
   /* this.emp_service.addOrUpdateEmployee("delete",this.userService.getUserToken(),emp).then(res=>{
      //console.log(res);
      this.getEmpList();
    })*/
  }
  public updateEmp(emp){
    console.log(emp);
    emp.edit=true;
  }
  public save(emp){
    console.log(emp);
    if(emp.name.length==0 || emp.designation.length==0 || emp.ein.length==0 ){
      this.msg = "Please provide all data."
      return;
    }
    emp.edit=false;
    this.emp_service.addOrUpdateEmployee("update",this.userService.getUserToken(),emp).then(res=>{
      //console.log(res);
      this.getEmpList();
    })
  }
  public cancel(emp,index){
    console.log(emp);
    console.log(this.empList,this.originalEmpList)
    const empId= emp._id;
    emp.edit=false;
    this.empList[index] = Object.assign({},this.originalEmpList.filter(function (item) {
      return item._id === empId
    })[0])
  }
}
