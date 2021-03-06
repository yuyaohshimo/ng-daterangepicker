ng-daterangepicker [![Build Status](https://travis-ci.org/yuyaohshimo/ng-daterangepicker.svg?branch=master)](https://travis-ci.org/yuyaohshimo/ng-daterangepicker)
==================

Date range picker for Angular.js

# Demo

http://yuyaohshimo.github.io/ng-daterangepicker

# Installation
```
$ bower install ng-daterangepicker
```

# Usage

You should write script and link tag in HTML header:
```html
<script type="text/javascript" src="angular.js"></script>
<script type="text/javascript" src="moment.js"></script>
<script type="text/javascript" src="daterangepicker.js"></script>
<link rel="stylesheet" type="text/css" href="daterangepicker.css"/>
```
You should write `date-range-picker` tag as an angular directive:
```html
<date-range-picker use-browser-default="useBrowserDefault" options="options" initial-range="initialRange" locale="locale" format="format" apply-button-label="applyButtonLabel" apply-date-range="applyDateRange(start, end)"></date-range-picker>
```

## Options
  - `use-browser-default`: if you want to use a browser's calendar, set `true`
  - `options`: range options
  - `initial-range`: initial range
  - `locale`: locale for `moment`
  - `format`: format to display date
  - `apply-button-label`: label of custom button (optional)
  - `apply-date-range`: callback function

Example:
```javascript
options = [
  // if you want to set date with calendar, put custom
  {
    label: 'Custom',
    value: 'custom'
  },
  // if you want to set all range option, put all
  {
    label: 'All',
    value: 'all',
    selected: true
  },
  {
    label: 'Today',
    value:'today',
    start: moment(),
    end: moment()
  },
  {
    label: 'This week',
    value:'thisWeek',
    start: moment().startOf('week'),
    end: moment().endOf('week')
  },
  {
    label: 'This month',
    value:'thisMonth',
    start: moment().startOf('month'),
    end: moment().endOf('month')
  }
];
initialRange = {
  start: moment(), // today
  end: moment().add(1, 'days') // tomorrow
};
locale = {
  year: 'YYYY年',
  months : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  weekdaysShort: '日_月_火_水_木_金_土'.split('_')
};
format = {
  date: 'YYYY/MM/DD',
  to: '~'
};
applyDateRange = function(start, end, option) {
  console.log(start);
  console.log(end);
  console.log(option);
};
```

# Development

Please run gulp.

```
$ gulp
```

# Test

## E2E Test

We can do E2E test using protractor.

```
$ npm run update-webdriver
```

```
$ gulp test:e2e
```

# License

[MIT license](LICENSE)
