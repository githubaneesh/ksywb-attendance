/**
 * Created by Aneesh on 23-02-2017.
 */
export interface User {
  username: string; // required with minimum 5 characters
  firstname:string,
  lastname:string,
  password:string;
  cpassword:string;
  role:string,
  office:string;
  email:string;
  mobile:string;
}
