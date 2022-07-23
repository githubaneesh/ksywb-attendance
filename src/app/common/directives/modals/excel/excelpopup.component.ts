import {Component, ViewChild, OnInit, NgModule,Input,Output,EventEmitter} from "@angular/core";
import {HttpClient} from "../../../../service/fileupload.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalComponent} from  'ng2-bs3-modal/ng2-bs3-modal';
import {ElementRef} from "@angular/core";

@Component({
  selector: 'excel-popup',
  styleUrls: ["./excelpopup.component.css"],
  templateUrl: './excelpopup.component.html',
  providers: [HttpClient]
})
export class ImportExcelModalComponent {
  @ViewChild('modal')
  modal: ModalComponent;
  @Output() modalClosed = new EventEmitter();
  form: FormGroup;
  public fileMessage: String = "";
  public fileUploading: Boolean = false;
  public file: FileList;
  private inputElement:HTMLInputElement
  constructor(private http_service: HttpClient,private elemRef:ElementRef) {


  }

  public ngOnInit() {

  }

  public onChange(event: EventTarget) {
    this.file = null;
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    this.inputElement = <HTMLInputElement> eventObj.target;
    let files: FileList = this.inputElement.files;
    this.fileMessage = "";
    if (files[0].size / 1024 / 1024 <= 2) {
      this.file = files;
    } else {
      this.fileMessage = "File size should not be greater than 2mb";
    }
  }

  public open() {
    this.file = null;
    this.modal.open('sm');
    //console.log('Call Modal Opening for ');
  }

  closed() {
    this.fileUploading = false;
    this.fileMessage = "";
    this.file = null;
    this.modalClosed.emit({});
    //console.log('Modal closed   '+ this.form.value['selectSingle']);
    this.modal.dismiss();

  }

  dismissed() {
    //console.log('dismissed');
    this.file = null;
  }

  opened() {

    //console.log('Modal Opened');
  }

  navigate() {

  }

  importBtnClickhandler() {
    //console.log('importBtnClickhandler');
    //let _this = this;
    if (!this.file) {
      this.fileMessage = "Select File";
      return;
    }

    this.fileUploading = true;
    this.http_service.postJsonFile({}, this.file).then(result=> {
      //console.log("result",result);
      if(this.inputElement){
        this.inputElement.value = null;
      }
      if (result.hasOwnProperty("errno")) {
        console.log("Error while uploading file");
      } else {
        this.file = null;
        this.closed()
      }

    }).catch(error=> {
      //console.log("error",error);
      this.inputElement.value = null;
      this.fileUploading = false;
    })
  }

  public cancel(e) {
    e.preventDefault();
    //console.log('cancel');
    this.file = null;
    this.closed()
  }

}
