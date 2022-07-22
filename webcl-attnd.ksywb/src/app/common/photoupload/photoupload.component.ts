/**
 * Created by ashishbaheti on 26/02/17.
 */
import {Component, OnInit} from '@angular/core';
import {HttpClient} from "../../service/fileupload.service";
import {Draggable} from "../directives/draggable";
import {EventEmitter} from "@angular/core";
import {Output} from "@angular/core/src/metadata/directives";
import {apiPath} from "../../api-path.constant";

@Component({
  selector: 'photoupload',
  styleUrls:["./photoupload.css"],
  templateUrl: './photoupload.component.html',
  providers:[HttpClient,Draggable]
})
export class PhotoUploadComponent implements OnInit {
  public fileMessage: String="";
  public fileUploading: Boolean=false;
  @Output() fileUploaded = new EventEmitter();
  constructor(private http_service:HttpClient) {
  }

  ngOnInit() {
  }
  public file: FileList;
  public triggerOnChange(){
    document.getElementById('myFile').click();
  }
  public onChange(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let files: FileList = target.files;
    this.fileMessage="";
    if(files[0].size/1024/1024<=2) {
      this.file = files;
      //this.onFileSelected(this.file);
      this.uploadPhoto();
    }else{
      this.fileMessage="File size should not be greater than 2mb";
    }
  }
  public uploadPhoto(){
    //console.log("upload photos",this);
    //let _this = this;
    this.fileUploading = true;
    this.http_service.postWithFile("/api/file/upload",{},this.file).then(result=>{
      //console.log("result",result);
      if(result.hasOwnProperty("errno")){
        //console.log("Error while uploading file");
      }else{
        this.onFileSelected((result as any).identifier,(result as any).mimetype);
        this.fileUploaded.emit(result);
        this.file = null;
      }

    }).catch(error=>{
      //console.log("error",error);
      this.fileUploading = false;
    })
  }
  public cancel(e){
    e.preventDefault();
    //console.log('cancel');
    this.file = null;
  }
  protected onFileSelected(selectedFile,mimetype) {
    //console.log("onFileSelected");
    var imgtag = document.getElementById("myimage");
    imgtag.setAttribute("src",apiPath+"file/"+selectedFile)

  }
}
