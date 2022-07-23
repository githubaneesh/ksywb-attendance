import { Injectable } from "@angular/core";
import { Day } from "../attendance/day";

@Injectable()
export class CONSTANTS
{
  public TOTALCL:Number= 20;
  public TOTAL_LEAVE_ALLOWED:Number=15;
  public CL:String='CL';
  public WARNING_MESSAGE_GT15:String='More than 15 days are not allowed for  leave marking';
   public WARNING_MESSAGE_CLGT15:String='More than 20 casual leaves are not allowed for  an employee';
  public WARNING:String="Warning";
  constructor() {
   
  }

}