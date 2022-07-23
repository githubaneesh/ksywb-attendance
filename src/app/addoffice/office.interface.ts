/**
 * Created by Aneesh on 23-02-2017.
 */
export interface Office {
  name: string; // required with minimum 5 characters
  address:string, // required with minimum 5 characters
  stgid:string,
  maxFNTime:string,
  maxANTime:string,
  from:string,
  to:string,
  latepermission:string,
  lunchbreak:string,
  earlypermission:string,
  macid:string[],
  company:string,
  mode:string
}
