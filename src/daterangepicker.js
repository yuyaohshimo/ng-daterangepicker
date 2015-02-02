/*!
 * ng-daterangepicker.js
 * https://github.com/yuyaohshimo/ng-daterangepicker
 *
 * Copyright (c) 2014 Yuya Ohshimo
 * Licensed under the MIT license.
 */

(function() {
  angular.module('dateRangePicker', []);

  angular.module('dateRangePicker').directive('dateRangePicker', ['$window', function($window) {
    return {
      restrict: 'AE',
      replace: true,
      template: '{html}',
      scope: {
        model: '=ngModel',
        locale: '=',
        monthNumbers: '=',
        rangeOptions: '=',
        format: '='
      },
      link: function($scope, element, attrs) {
        var _changeTime;
        var _getDays;
        var _getFirstWeek;
        var _getCalendarDays;
        var _getCalendarDaysArray;
        var _createCalendar;
        var _isSelectedDay;
        var _markSelectedDay;
        var _hideCalendar;
        var currentMonth = 0;
        var selectSteps = [];
        $scope.showDropdown = false;
        $scope.start = $scope.model.start;
        $scope.end = $scope.model.end;
        $scope.calendars = [];
        $scope.months = [];

        // Window event
        angular.element($window).bind('click', function() {
          if (!$scope.showDropdown) return;
          _hideCalendar();
          $scope.$apply();
        });

        // Locale
        if ($scope.locale) {
          moment.locale('dateRangePicker', {
            months: $scope.locale.months || moment.months(),
            weekdaysShort: $scope.locale.weekdaysShort || moment.weekdaysShort()
          });
        }

        // Style
        document.querySelectorAll('.daterangepicker__dropdown')[0].style.top = document.querySelectorAll('.daterangepicker__input')[0].offsetHeight + 'px';

        _changeTime = function(target, h, m, s) {
          return target.hour(h).minute(m).second(s);
        };

        _getDays =  function(month) {
          var days = [];

          var startDay = moment().startOf('month').add(month, 'month');
          var endDay = moment().endOf('month').add(month, 'month');
          var range = moment().range(startDay, endDay);

          range.by('days', function(moment) {
            days.push(moment);
          });

          return days;
        };

        _getFirstDay = function(month) {
          return moment().startOf('month').add(month, 'month').day();
        };

        _getCalendarDays = function(days, firstDay) {
          var calendarDays = [];
          days.forEach(function(day, idx) {
            calendarDays.push({ value: idx + 1});
          });
          for (var i = 0; i < firstDay; i++) {
            calendarDays.unshift({ value: '' });
          }

          return calendarDays;
        };

        _getCalendarDaysArray = function(calendarDays) {
          var calendarDaysArray = [];
          for (var i = 0; calendarDays.length > 0; i++) {
            calendarDaysArray.push(calendarDays.splice(0, 7));
          }
          return calendarDaysArray;
        };

        _createCalendar = function(month) {
          var days = _getDays(month);
          var firstDay = _getFirstDay(month);
          var calendarDays = _getCalendarDays(days, firstDay);
          var calendarDaysArray = _getCalendarDaysArray(calendarDays);

          $scope.calendars.push(calendarDaysArray);
        };

        _createCalendars = function() {
          $scope.months = [];
          $scope.weeks = [];
          $scope.calendars = [];

          // Set week
          $scope.weeks = moment.weekdaysShort();

          // Set months and days
          var month = 0 + currentMonth;
          for (var i = month - Math.floor($scope.monthNumbers/2); i < month - Math.floor($scope.monthNumbers/2) + $scope.monthNumbers; i++) {
            $scope.months.push({
              name: moment().add(i, 'month').format('MMMM'),
              value: i
            });
            _createCalendar(i);
          }

          // mark selected day
          _markSelectedDay();
        };

        _markSelectedDay = function() {
          if (!$scope.start) return;

          var start = $scope.start;
          var end = ($scope.end) ? $scope.end : moment(angular.extend({}, $scope.start));

          if (start > end) {
            var copyStart = start;
            $scope.start = start = end;
            $scope.end = end = copyStart;
          }

          var dayRange = moment().range(_changeTime(start, 0, 0, 0), _changeTime(end, 23, 59, 59));

          $scope.months.forEach(function(month, idx) {
            $scope.calendars[idx].forEach(function(weeks) {
              weeks.forEach(function(day) {
                if (!day.value) return;
                day.selected = dayRange.contains(moment().startOf('month').add(month.value, 'month').add(day.value - 1, 'day').hour(12).minute(0).second(0));
              });
            });
          });
        };

        _hideCalendar = function() {
          selectSteps = [];
          _markSelectedDay();
          $scope.showDropdown = false;
        };

        $scope.toggleDropdown = function() {
          $scope.showDropdown = !$scope.showDropdown;
        };

        $scope.prev = function() {
          currentMonth--;
          _createCalendars();
        };

        $scope.next = function() {
          currentMonth++;
          _createCalendars();
        };

        $scope.ok = function() {
          _hideCalendar();
        };

        $scope.cancel = function() {
          $scope.start = $scope.model.start;
          $scope.end = $scope.model.end;
          _hideCalendar();
        };

        $scope.applyRange = function(range) {
          selectSteps = ['start', 'end'];
          $scope.start = range.start;
          $scope.end = range.end;
          _markSelectedDay();
        };

        $scope.select = function(monthIndex, day) {
          if (day.selected || selectSteps.length === 2) {
            $scope.start = null;
            $scope.end = null;
            selectSteps = [];
          }

          switch (selectSteps.length) {
            case 0:
              $scope.start = moment().startOf('month').add($scope.months[monthIndex].value, 'month').add(day.value - 1, 'day');
              $scope.end = moment().startOf('month').add($scope.months[monthIndex].value, 'month').add(day.value - 1, 'day');
              selectSteps.push('start');
              break;
            case 1:
              $scope.end = moment().startOf('month').add($scope.months[monthIndex].value, 'month').add(day.value - 1, 'day');
              selectSteps.push('end');
              break;
            default:
              break;
          }
          _markSelectedDay();

        };

        // create calendars
        _createCalendars();
      }
    };
  }]);

}).call(this);