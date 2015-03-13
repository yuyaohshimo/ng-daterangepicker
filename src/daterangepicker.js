/*!
 * ng-daterangepicker.js
 * https://github.com/yuyaohshimo/ng-daterangepicker
 *
 * Copyright (c) 2015 Yuya Ohshimo
 * Licensed under the MIT license.
 */
angular.module('dateRangePicker', [])

.factory('dateRangePickerService', [function() {
  var getMonth = function(month) {      
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
  };

  var isValidDay = function(start, end, startDayValue, endDayValue, type) {          
    var startMonth = (type === 'start') ? start.month : start.value.month();
    var endMonth = (type === 'end') ? end.month : end.value.month();
    return moment().clone().month(startMonth).date(startDayValue) <= moment().clone().month(endMonth).date(endDayValue);
  };

  var getInitialOption = function(options) {
    var option;
    options.forEach(function(item) {
      if (item.selected) {
        option = item;
        return;
      }
    });

    return option;
  };

  var getOppositeType = function(type) {
    return (type === 'start') ? 'end' : 'start';
  };

  var getDaysPerWeek = function(days) {
    var _1w = 7;
    var daysPerWeek = [];

    for(var i = 0; i < Math.ceil(days.length / _1w); i++) {
      var j = i * _1w;
      daysPerWeek.push(days.slice(j, j + _1w));
    }
    return daysPerWeek;
  };

  return {
    getMonth: getMonth,
    isValidDay: isValidDay,
    getInitialOption: getInitialOption,
    getOppositeType: getOppositeType,
    getDaysPerWeek: getDaysPerWeek
  };
}])

.controller('dateRangePickerController', ['$scope', 'dateRangePickerService', function($scope, dateRangePickerService) {
  // Locale
  if ($scope.locale) {
    moment.locale('dateRangePicker', {
      months: $scope.locale.months || moment.months(),
      weekdaysShort: $scope.locale.weekdaysShort || moment.weekdaysShort()
    });
  }

  $scope.applyButtonLabel = $scope.applyButtonLabel || 'Apply';
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
  $scope.start.days = dateRangePickerService.getDaysPerWeek(dateRangePickerService.getMonth($scope.start.month));
  $scope.end.days = dateRangePickerService.getDaysPerWeek(dateRangePickerService.getMonth($scope.end.month));
  $scope.selectedOption = dateRangePickerService.getInitialOption($scope.options);
  $scope.weeks = moment.weekdaysShort();

  $scope.onClickSelect = function() {
    $scope.start.show = $scope.end.show = false;
    $scope.resetMonth('start');
    $scope.resetMonth('end');
  };

  $scope.onChangeSelect = function() {
    if ($scope.selectedOption.value === 'custom') { return; }
    if ($scope.selectedOption.value === 'all') {
      return $scope.applyDate(true);
    }

    // start
    $scope.start.value = $scope.selectedOption.start;
    $scope.start.month = $scope.start.value.month();
    $scope.start.days = dateRangePickerService.getDaysPerWeek(dateRangePickerService.getMonth($scope.start.month));

    // end
    $scope.end.value = $scope.selectedOption.end;
    $scope.end.month = $scope.end.value.month();
    $scope.end.days = dateRangePickerService.getDaysPerWeek(dateRangePickerService.getMonth($scope.end.month));

    $scope.applyDate();
  };

  $scope.onSelectDay = function(type, day, startDayValue, endDayValue) {
    if (day.disabled) { return; }
    if (!dateRangePickerService.isValidDay($scope.start, $scope.end, startDayValue, endDayValue, type)) { return; }

    var month = $scope[type].month;
    $scope[type].value = moment().month(month).date(day.value);

    $scope[type].show = false;
    $scope.resetMonth(type);
  };

  $scope.onChangeMonth = function(type, addtionalMonth) {
    $scope[type].month += addtionalMonth;
    $scope[type].days = dateRangePickerService.getDaysPerWeek(dateRangePickerService.getMonth($scope[type].month));
  };

  $scope.toggleDropdown = function(type) {
    var oppositeType = dateRangePickerService.getOppositeType(type);
    $scope[oppositeType].show = false;
    $scope.resetMonth(oppositeType);
    $scope[type].show = !$scope[type].show;
    if (!$scope[type].show) {
      $scope.resetMonth(type);
    }
  };

  $scope.applyDate = function(isAll) {
    var start = $scope.start;
    var end = $scope.end;

    if (!start.value._d || !end.value._d) {
      return;
    }

    if (isAll) {
      start = null;
      end = null;
    }

    $scope.applyDateRange({
      start: start,
      end: end,
      option: $scope.selectedOption
    });
  };

  $scope.resetMonth = function(type) {
    $scope[type].month = $scope[type].value.month();
  };
}])

.directive('dateRangePicker', ['$window', function($window) {
  return {
    restrict: 'AE',
    replace: true,
    template: '{html}',
    scope: {
      useBrowserDefault: '=',
      options: '=',
      initialRange: '=',
      locale: '=',
      rangeOptions: '=',
      format: '=',
      applyDateRange: '&',
      applyButtonLabel: '='
    },
    controller: 'dateRangePickerController',
    link: function($scope, element, attrs) {

      // Window event
      angular.element($window).bind('click', function() {
        if (!$scope.start.show && !$scope.end.show) return;
        $scope.start.show = $scope.end.show = false;
        $scope.resetMonth('start');
        $scope.resetMonth('end');
        $scope.$apply();
      });

      // use browse default
      $scope.$watch('useBrowserDefault', function() {
        if ($scope.useBrowserDefault) {
          angular.element(document).ready(function() {
            angular.element(document.querySelectorAll('.daterangepicker__input')).bind('change', function() {
              $scope.$apply();
            });
          });
        }
      });
    }
  };
}]);