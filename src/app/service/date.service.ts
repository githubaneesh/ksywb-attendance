import {Injectable} from "@angular/core";
import {Day} from "../attendance/day";

@Injectable()
export class DateService {
  private monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  private arrHolidays: Array<any>;

  constructor() {

  }

  setHolidays(arrHolidays) {
    this.arrHolidays = arrHolidays;
  }

  getCurrentMonth() {
    let _date = new Date();
    let month = _date.getMonth();
    return month;
  }

  getCurrentMonthName() {
    let _date = new Date();
    return this.monthNames[_date.getMonth()]
  }

  getIndexByMonthName(strMonth: string) {
    return this.monthNames.map(function (x) {
      return x.toUpperCase()
    }).indexOf(strMonth);
  }

  getCurrentYear() {
    let _date = new Date();
    ////console.log('getCurrentYear ',_date.getFullYear())
    return _date.getFullYear();
  }

  getCurrentDate() {
    let _date = new Date();
    return _date.getDate();
  }

  getMonthNameByIndex(index) {
    return this.monthNames[index];
  }


  getdaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  checkWeekendDays(date, Month, year) {
    /*  let myDate = new Date();
     let count=0;
     myDate.setFullYear(year);
     myDate.setMonth(Month);
     myDate.setDate(date);
     if(myDate.getDay() == 0 )
     {
     return true;
     }
     else if(myDate.getDay() == 6 && (date>7 && date<14 ))
     {
     return true;

     }*/
    //var tarr = document.getElementById(tb1).value.split('/');
    var d = new Date(year, Month, date);
    if (d.getDay() == 0) {
      return true;
    }
    if (d.getDay() == 6 && (date > 7 && date < 14 )) {
      return true;
    }


  }
/*
  getNameodDayByDate(day, Month, year) {
    // //console.log(date + '  '+Month+'   '+ year);
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var totalDays = day + (2 * Month) + (3 * (Month + 1) / 5) + year + (year / 4) - (year / 100) + (year / 400) + 2;
    console.log("totalDays of Month  :",totalDays)

    let dayNo = Math.floor( (totalDays) % 7);
    if (dayNo == 0) {
      dayNo = 7;
    }
    return days[dayNo - 1];
  }*/

  getNameodDayByDate(day, month, year)
  {
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let a = Math.floor((14 - month) / 12);
    let y = year - a;
    let m = month + 12 * a - 2;
    let d = (day + y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(year / 400) + Math.floor((31 * m) / 12)) % 7;
    return days[d];
  }

  getTimeString(year, month, date) {
    let _month = (month < 10) ? "0" + month : month;
    let _date = (date < 10) ? "0" + date : date;
    return (year.toString() + _month.toString() + _date.toString());

  }

  getCurrentDateTimestring() {
    return this.getTimeString(this.getCurrentYear(), this.getCurrentMonth() + 1, this.getCurrentDate());

  }

  getFormattedTime(timestamp) {

    let date = new Date(timestamp);
    let amPm = date.getHours() >= 12 ? 'AM' : 'PM'
    //var hours = ("0" + ((date.getHours() % 12)||12)).substr(-2)
    // var minutes = ("0" + date.getMinutes()).substr(-2)
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return hours + ':' + minutes

  }

  getTime(timestamp) {
    let date = new Date(timestamp);
    let amPm = date.getHours() >= 12 ? 'AM' : 'PM'
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return {hr: hours, min: minutes}
  }

  getTimeStamp(sTime) {

    //console.log('sTime  :',sTime);
    //console.log('parseInt(sTime.substr(0, 2), 10) ',parseInt(sTime.substr(0, 2), 10));
    //console.log(' parseInt(sTime.substr(3, 2), 10) ', parseInt(sTime.substr(3, 2), 10));
    let oDate = new Date();
    oDate.setHours(
      parseInt(sTime.substr(0, 2), 10),
      parseInt(sTime.substr(3, 2), 10),
      0,
      0
    );
    let sTimestamp = oDate.getTime();
    return sTimestamp;
  }

  getNameofDay(datestring) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date(datestring);
    var dayName = days[d.getDay()];
    return dayName.toString().substring(0, 3);
  }

  checkHolidayByTimeStamp(timestamp, arrHolidays) {

    if (arrHolidays && arrHolidays.length > 0) {

      for (var i in arrHolidays) {
        if (timestamp == arrHolidays[i].date) {
          //console.log('timestamp == hdays.date  '  );
          return arrHolidays[i];
        }
      }
      return null;
    }
  }

  updateMonth(month, year, arrHolidays) {
    let arr: Array<any> = [];
    let noOfDaysInMonth = this.getdaysInMonth(month + 1, year);
    for (var i = 1; i <= noOfDaysInMonth; i++) {
      let _datestring: string = this.getTimeString(year, month + 1, i);
      let objDay: Day;
      if (this.checkWeekendDays(i, month, year) == true) // checking if day is a sunday or secned saturday
      {
        // console.log('(this.date_service.checkWeekendDays');
        objDay = {
          id: i.toString(), date: i, strdate: _datestring.toString(),
          label: this.getNameodDayByDate(i, month + 1, year),
          class: 'holiday',
          time: 'full',
          year: year.toString(),
          name: 'holiday',
          type: 'hd',
          isCurrentDay: (this.getCurrentDateTimestring() == _datestring.toString()) ? true : false
        }
      }
      else if (this.checkHolidayByTimeStamp(_datestring, arrHolidays) != null && this.checkHolidayByTimeStamp(_datestring, arrHolidays).holiday != null) // checking if day is a holiday in holidayList
      {
        // console.log('Enter into checkHolidayByTimeStamp   ',this.date_service.checkHolidayByTimeStamp(_datestring,this.arrHolidays));
        let hObj = this.checkHolidayByTimeStamp(_datestring, arrHolidays);
        objDay = {
          id: hObj._id, date: i, strdate: _datestring.toString(),
          label: this.getNameodDayByDate(i, month + 1, year),
          class: 'holiday',
          time: hObj.time,
          year: hObj.year,
          name: hObj.holiday.name,
          type: 'hd',
          isCurrentDay: (this.getCurrentDateTimestring() == _datestring.toString()) ? true : false
        }
      }
      else  // working Day
      {
        // console.log('working Day');
        objDay = {
          id: i.toString(), date: i, strdate: _datestring.toString(),
          label: this.getNameodDayByDate(i, month + 1, year),
          class: 'workingday',
          time: '',
          year: year.toString(),
          name: 'workingday',
          type: 'wd',
          isCurrentDay: (this.getCurrentDateTimestring() == _datestring.toString()) ? true : false
        };
      }
      // console.log( this.getCurrentDateTimestring()+'  : _datestring.toString() '+_datestring.toString())
      arr.push(objDay);
    }
    return arr;
  }

  getHoursArr() {
    return [{value: '01', label: '01'}, {value: '02', label: '02'}, {value: '03', label: '03'}, {
      value: '04',
      label: '04'
    }, {value: '05', label: '05'},
      {value: '06', label: '06'}, {value: '07', label: '07'}, {value: '08', label: '08'}, {
        value: '09',
        label: '09'
      }, {value: '10', label: '10'},
      {value: '11', label: '11'}, {value: '12', label: '12'}, {value: '13', label: '13'}, {
        value: '14',
        label: '14'
      }, {value: '15', label: '15'},
      {value: '16', label: '16'}, {value: '17', label: '17'}, {value: '18', label: '18'}, {
        value: '19',
        label: '19'
      }, {value: '20', label: '20'},
      {value: '21', label: '21'}, {value: '22', label: '22'}, {value: '23', label: '23'}

    ];

  }

  getMinsArr() {
    return [{value: '00', label: '00'},
      {value: '01', label: '01'},
      {value: '02', label: '02'},
      {value: '03', label: '03'},
      {value: '04', label: '04'},
      {value: '05', label: '05'},
      {value: '06', label: '06'},
      {value: '07', label: '07'},
      {value: '08', label: '08'},
      {value: '09', label: '09'},
      {value: '10', label: '10'},
      {value: '11', label: '11'},
      {value: '12', label: '12'},
      {value: '13', label: '13'},
      {value: '14', label: '14'},
      {value: '15', label: '15'},
      {value: '16', label: '16'},
      {value: '17', label: '17'},
      {value: '18', label: '18'},
      {value: '19', label: '19'},
      {value: '20', label: '20'},
      {value: '21', label: '21'},
      {value: '22', label: '22'},
      {value: '23', label: '23'},
      {value: '24', label: '24'},
      {value: '25', label: '25'},
      {value: '26', label: '26'},
      {value: '27', label: '27'},
      {value: '28', label: '28'},
      {value: '29', label: '29'},
      {value: '30', label: '30'},
      {value: '31', label: '31'},
      {value: '32', label: '32'},
      {value: '33', label: '33'},
      {value: '34', label: '34'},
      {value: '35', label: '35'},
      {value: '36', label: '36'},
      {value: '37', label: '37'},
      {value: '38', label: '38'},
      {value: '39', label: '39'},
      {value: '40', label: '40'},
      {value: '41', label: '41'},
      {value: '42', label: '42'},
      {value: '43', label: '43'},
      {value: '44', label: '44'},
      {value: '45', label: '45'},
      {value: '46', label: '46'},
      {value: '47', label: '47'},
      {value: '48', label: '48'},
      {value: '49', label: '49'},
      {value: '50', label: '50'},
      {value: '51', label: '51'},
      {value: '52', label: '52'},
      {value: '53', label: '53'},
      {value: '54', label: '54'},
      {value: '55', label: '55'},
      {value: '56', label: '56'},
      {value: '57', label: '57'},
      {value: '58', label: '58'},
      {value: '59', label: '59'}

    ];
  }

  getAnFnArr() {
    return [{value: 'fn', label: 'Fore noon'}, {value: 'an', label: 'After noon'}, {value: 'full', label: 'Full Day'}];
  }

  getEntExtArr() {
    return [{value: 'ent', label: 'Entry'}, {value: 'ext', label: 'Exit'}];
  }

  get2DigitTime(time) {
    return (time < 10) ? '0' + time : time;
  }

  getDatesBetween2Date(from_date, to_date)  // start date end date  in hte form of'2016-01-01';
  {
    var current_date = new Date(from_date);
    var end_date = new Date(to_date);

    var getTimeDiff = Math.abs(current_date.getTime() - end_date.getTime());
    var date_range = Math.ceil(getTimeDiff / (1000 * 3600 * 24));

    var weekday = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var dates = new Array();

    for (var i = 0; i <= date_range; i++)
    {
            console.log("date_range");
            var getDate, getMonth = '';

            if (current_date.getDate() < 10) {
              getDate = ('0' + current_date.getDate());
            }
            else {
              getDate = current_date.getDate();
            }

            if (current_date.getMonth() < 9) {
              getMonth = ('0' + (current_date.getMonth() + 1));
            }
            else {
              getMonth = current_date.getMonth().toString();
            }
            console.log("date_range ente here 1");
            var row_date = {day: getDate, month: getMonth, year: current_date.getFullYear()};
            var fmt_date = {weekDay: weekday[current_date.getDay()], date: getDate, month: months[current_date.getMonth()]};
            var is_weekend = false;
            var is_holiday = false;
            console.log("date_range ente here 2 ");
            if (this.checkWeekendDays(current_date.getDate(), current_date.getMonth(), current_date.getFullYear())) {
              is_weekend = true;
            }
            let datestring: String = this.getTimeString(current_date.getFullYear(), current_date.getMonth() + 1, current_date.getDate())
            console.log(datestring+ '    datestring');
            console.log('arrHolidays  :',this.arrHolidays);
            if (this.checkHolidayByTimeStamp(datestring, this.arrHolidays) != null && this.checkHolidayByTimeStamp(datestring, this.arrHolidays).holiday != null) {
              is_holiday = true;
            }
            console.log("date_range ente here 3");

            dates.push({row_date: row_date, date: datestring, is_weekend: is_weekend, is_holiday: is_holiday}); // fmt_date: fmt_date,
            current_date.setDate(current_date.getDate() + 1);
    }

    return dates;

  }

  getTodayInObject() {
    var current_date = new Date();
    return {day: current_date.getDate() + 1, month: (current_date.getMonth() + 1), year: current_date.getFullYear()}
  }

  getMonthsBetweenRange(from, to) {
    return this.monthNames.map(x=>x.toUpperCase()).slice(from,to);
  }
  getMonthsBetweenDates(from, to) {
    var current_date = new Date(from);
    var end_date = new Date(to);

    var getTimeDiff = Math.abs(current_date.getTime() - end_date.getTime());
    var date_range = Math.ceil(getTimeDiff / (1000 * 3600 * 24))
    var arrMonths = new Array();

    for (var i = 0; i <= date_range; i++) {
      var monthName = this.monthNames[current_date.getMonth()];

      if (arrMonths.indexOf(monthName) == -1) {
        arrMonths.push(monthName);
      }
      current_date.setDate(current_date.getDate() + 1);
    }
    return arrMonths;
  }

  getLastDayOfMonth(date){
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }
  getFirstDayOfMonth(date){
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  public getFormattedStr(fullDate) {
    const date = fullDate.getDate();
    const month = fullDate.getMonth();
    return date+ this.nth(date) +" " +this.monthNames[month]+" "+fullDate.getFullYear();
  }
  public getFormattedMonthStr(fullDate) {
    const date = fullDate.getDate();
    const month = fullDate.getMonth();
    return this.monthNames[month]+" "+fullDate.getFullYear();
  }
  public get currentMonthFormattedStr(){
    return this.getFormattedMonthStr(new Date());
  }
  public getRangeFormattedStr(from,to){
    let date = new Date();
    return this.getFormattedMonthStr(this.getFirstDayOfMonth(new Date(date.getFullYear(), from, 1))) +" - "+
      this.getFormattedMonthStr(this.getFirstDayOfMonth(new Date(date.getFullYear(), to, 0))) ;
  }

  private nth(d) {
    if (d > 3 && d < 21) return 'th'; // thanks kennebec
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }
  public checkTimeisLessThan(time,value)
  {
    let _timeArr1 =  time.split(':');
    let hrtosec = parseInt(_timeArr1[0]) * 3600;
    let mintosec =(_timeArr1[1]!='')? parseInt(_timeArr1[1]) * 60:0;
    let timetotal = hrtosec + mintosec;

    let _timeArr2 =  value.split(':');
    let hrtosec1 = parseInt(_timeArr2[0]) * 3600;
    let mintosec1 =(_timeArr2[1]!='')? parseInt(_timeArr2[1]) * 60:0;
    let valuetotal = hrtosec1 + mintosec1;
    if(timetotal<valuetotal)
    {
      return true;
    }
    return  false;
   //var FNexitTimeinSeconds=46800;
  }
  getLunchBreakTime()
  {
    return "13:15" ;
  }
}
