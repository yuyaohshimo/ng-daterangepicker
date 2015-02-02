ng-daterangepicker
==================

Date range picker for Angular.js

# Installation
```
$ bower install ng-daterangepicker
```

# Usage

You should write script and link tag in HTML header:
```html
<script type="text/javascript" src="angular.js"></script>
<script type="text/javascript" src="moment.js"></script>
<script type="text/javascript" src="moment-range.js"></script>
<script type="text/javascript" src="daterangepicker.js"></script>
<link rel="stylesheet" type="text/css" href="daterangepicker.css"/>
```
You should write `date-range-picker` tag as an angular directive:
```html
<date-range-picker dates="dates" locale="locale" month-numbers="monthNumbers" range-options="rangeOptions" format="format" applyDateRange="applyDateRange(start, end)"></date-range-picker>
```

## Options
  - `dates`: initial range
  - `monthNumbers`: the number of showing month
  - `rangeOptions`: add custom range button
  - `locale`: set locale
  - `format`: set format to display date.
  - `applyDateRange`: callback function when ok button clicks.

Example:
```javascript
dates = {
  start: moment(), // today
  end: moment().add(1, 'days') // tomorrow
};
monthNumbers = 3; // show 3 months
rangeOptions = [
  {
    label: 'Today',
    value: moment().range(moment(), moment())
  },
  {
    label: 'This Week',
    value: moment().range(moment().startOf('week'), moment().endOf('week'))
  }
];
locale = {
  month: 'JAN_FEB_MAR_APR_MAY_JUN_JULY_AUG_SEPT_OCT_NOV_DEC'.split('_'),
  weekdaysShort: 'SUN_MON_TUE_WED_THU_FRI_SAT'.split('_')
};
format = {
  date: 'YYYY/MM/DD',
  to: '~'
};
applyDateRange = function(start, end) {
  console.log(start);
  console.log(end);
};
```

# License

[MIT license](LICENSE)
