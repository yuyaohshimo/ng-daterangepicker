/*!
 * ng-daterangepicker.js
 * https://github.com/yuyaohshimo/ng-daterangepicker
 *
 * Copyright (c) 2014 Yuya Ohshimo
 * Licensed under the MIT license.
 */

(function() {
  angular.module('dateRangePicker', []);

  angular.module('dateRangePicker')
  .directive('dateRangePicker', ['$window', function($window) {
    return {
      restrict: 'AE',
      replace: true,
      template: '{html}',
      scope: {
        isMobile: '=',
        options: '=',
        initialRange: '=',
        locale: '=',
        rangeOptions: '=',
        format: '=',
        applyDateRange: '&'
      },
      link: function($scope, element, attrs) {
        // Locale
        if ($scope.locale) {
          moment.locale('dateRangePicker', {
            months: $scope.locale.months || moment.months(),
            weekdaysShort: $scope.locale.weekdaysShort || moment.weekdaysShort()
          });
        }

        // Window event
        angular.element($window).bind('click', function() {
          if (!$scope.start.show && !$scope.end.show) return;
          $scope.start.show = $scope.end.show = false;
          $scope.$apply();
        });

        $scope._moment = moment();
        $scope.start = {
          value: $scope.initialRange ? $scope.initialRange.start : moment(),
          month: $scope.initialRange ? $scope.initialRange.start.month() : moment().month(),
          show: false
        };
        $scope.end = {
          value: $scope.initialRange ? $scope.initialRange.end : moment(),
          month: $scope.initialRange ? $scope.initialRange.end.month() : moment().month(),
          show: false
        };
        $scope.start.days = _getDaysPerWeek(_getMonth('start'));
        $scope.end.days = _getDaysPerWeek(_getMonth('end'));
        $scope.selectedOption = _getInitialOption();
        $scope.weeks = moment.weekdaysShort();

        $scope.onClickSelect = function() {
          $scope.start.show = $scope.end.show = false;
        };

        $scope.onChangeSelect = function() {
          if ($scope.selectedOption.value === 'custom') { return; }
          if ($scope.selectedOption.value === 'all') {
            return _apply(true);
          }

          // start
          $scope.start.value = $scope.selectedOption.start;
          $scope.start.month = $scope.start.value.month();
          $scope.start.days = _getDaysPerWeek(_getMonth('start'));

          // end
          $scope.end.value = $scope.selectedOption.end;
          $scope.end.month = $scope.end.value.month();
          $scope.end.days = _getDaysPerWeek(_getMonth('end'));

          _apply();
        };

        $scope.onSelectDay = function(type, day, startDayValue, endDayValue) {
          if (day.disabled) { return; }
          if (!_isValidDay(startDayValue, endDayValue)) { return; }

          var month = $scope[type].month;
          $scope[type].value = moment().month(month).date(day.value);

          $scope[type].show = false;

          _apply();
        };

        $scope.onChangeMonth = function(type, addtionalMonth) {
          $scope[type].month += addtionalMonth;
          $scope[type].days = _getDaysPerWeek(_getMonth(type));
        };

        $scope.toggleDropdown = function(type) {
          $scope[_getOppositeType(type)].show = false;
          $scope[type].show = !$scope[type].show;
        };

        function _apply(isAll) {
          var start = $scope.start;
          var end = $scope.end;

          if (isAll) {
            start = null;
            end = null;
          }

          $scope.applyDateRange({
            start: start,
            end: end,
            option: $scope.selectedOption
          });
        }

        function _isValidDay(startDayValue, endDayValue) {
          return moment().clone().month($scope.start.month).day(startDayValue) <= moment().clone().month($scope.end.month).day(endDayValue);
        }

        function _getInitialOption() {
          var option;
          $scope.options.forEach(function(item) {
            if (item.selected) {
              option = item;
              return ;
            }
          });

          return option;
        }

        function _getOppositeType(type) {
          return (type === 'start') ? 'end' : 'start';
        }

        function _getDaysPerWeek(days) {
          var _1w = 7;
          var daysPerWeek = [];

          for(var i = 0; i < Math.ceil(days.length / _1w); i++) {
            var j = i * _1w;
            daysPerWeek.push(days.slice(j, j + _1w));
          }
          return daysPerWeek;
        }

        function _getMonth(type) {
          var month = $scope[type].month;
          
          var prevDays = moment().month(month).startOf('month').day();
          var presentDays = moment().month(month).endOf('month').date();
          var nextDays = 6 - moment().month(month).endOf('month').day();
          var prevLastDay = moment().month(month - 1).endOf('month').format('D');
          var days = [];

          // prev days
          while (prevDays > 0) {
            days.push({
              value: prevLastDay - prevDays + 1,
              disabled: true
            });
            prevDays--;
          }

          // present days
          for (var i = 1; i <= presentDays; i++) {
            days.push({
              value: i,
              disabled: false
            });
          }

          // next days
          for (var j = 1; j <= nextDays; j++) {
            days.push({
              value: j,
              disabled: true
            });
          }
          return days;
        }
      }
    };
  }]);

}).call(this);