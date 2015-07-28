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

  var getMonthValue = function(m) {
    var _m = m.clone().endOf('month');
    return moment().month() + _m.diff(moment().endOf('month'), 'month');
  };

  var isValidDay = function(start, end, startDayValue, endDayValue, type) {
    var startMonth = (type === 'start') ? start.month : this.getMonthValue(start.value);
    var endMonth = (type === 'end') ? end.month : this.getMonthValue(end.value);
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
    getMonthValue: getMonthValue,
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
    month: $scope.initialRange ? dateRangePickerService.getMonthValue($scope.initialRange.start) : moment().month(),
    show: false
  };
  $scope.end = {
    value: $scope.initialRange ? $scope.initialRange.end : moment(),
    month: $scope.initialRange ? dateRangePickerService.getMonthValue($scope.initialRange.end) : moment().month(),
    show: false
  };
  $scope.start.days = dateRangePickerService.getDaysPerWeek(dateRangePickerService.getMonth($scope.start.month));
  $scope.end.days = dateRangePickerService.getDaysPerWeek(dateRangePickerService.getMonth($scope.end.month));
  $scope.selectedOption = dateRangePickerService.getInitialOption($scope.options);
  $scope.weeks = moment.weekdaysShort();

  $scope.onChangeSelect = function() {
    if ($scope.selectedOption.value === 'custom') { return; }
    if ($scope.selectedOption.value === 'all') {
      return $scope.applyDate(true);
    }

    // start
    $scope.start.value = $scope.selectedOption.start;
    $scope.start.month = dateRangePickerService.getMonthValue($scope.start.value);
    $scope.start.days = dateRangePickerService.getDaysPerWeek(dateRangePickerService.getMonth($scope.start.month));

    // end
    $scope.end.value = $scope.selectedOption.end;
    $scope.end.month = dateRangePickerService.getMonthValue($scope.end.value);
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

  $scope.toggleDropdown = function($event, type) {

    $event.stopPropagation();

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
    $scope[type].month = dateRangePickerService.getMonthValue($scope[type].value);
  };

  $scope.getMonthValue = function(m) {
    return dateRangePickerService.getMonthValue(m);
  }
}])

.directive('dateRangePicker', ['$window', function($window) {
  return {
    restrict: 'AE',
    replace: true,
    template: '<div class="daterangepicker"><div class="daterangepicker__option"><select ng-model="selectedOption" ng-options="option.label for option in options" ng-change="onChangeSelect()"></select></div><div ng-show="selectedOption.value === \'custom\'" class="daterangepicker__cutom"><div class="daterangepicker__start"><input ng-if="useBrowserDefault" type="date" ng-model="start.value._d" class="daterangepicker__input"/><input ng-if="!useBrowserDefault" type="text" ng-value="start.value.format(format.date)" ng-click="toggleDropdown($event, \'start\')" readonly="" class="daterangepicker__input"/><div ng-show="start.show" ng-if="!useBrowserDefault" ng-click="$event.stopPropagation()" class="daterangepicker__dropdown"><button ng-click="onChangeMonth(\'start\', -1)" class="daterangepicker__prev">&lt;</button><button ng-click="onChangeMonth(\'start\', 1)" ng-if="start.month &lt; end.month" class="daterangepicker__next">&gt;</button><div class="daterangepicker__calendars"><h4><div class="daterangepicker__year">{{ _moment.clone().month(start.month).format(locale.year || \'YYYY\') }}</div><div class="daterangepicker__month">{{ _moment.clone().month(start.month).format(\'MMMM\') }}</div></h4><table><thead><tr><th ng-repeat="week in weeks">{{ week }}</th></tr></thead><tbody><tr ng-repeat="week in start.days"><td ng-repeat="day in week" ng-class="{ disabled: day.disabled, selected: !day.disabled &amp;&amp; (getMonthValue(start.value) === start.month) &amp;&amp; (day.value == start.value.format(\'D\')) }" ng-click="onSelectDay(\'start\', day, day.value, end.value.format(\'D\'))">{{ day.value }}</td></tr></tbody></table></div></div></div><div ng-bind="format.to" class="daterangepicker__to"></div><div class="daterangepicker__end"><input ng-if="useBrowserDefault" type="date" ng-model="end.value._d" class="daterangepicker__input"/><input ng-if="!useBrowserDefault" type="text" ng-value="end.value.format(format.date)" ng-click="toggleDropdown($event, \'end\')" readonly="" class="daterangepicker__input"/><div ng-show="end.show" ng-if="!useBrowserDefault" ng-click="$event.stopPropagation()" class="daterangepicker__dropdown"><button ng-click="onChangeMonth(\'end\', -1)" ng-if="start.month &lt; end.month" class="daterangepicker__prev">&lt;</button><button ng-click="onChangeMonth(\'end\', 1)" class="daterangepicker__next">&gt;</button><div class="daterangepicker__calendars"><h4 class="daterangepicker__year">{{ _moment.clone().month(end.month).format(locale.year || \'YYYY\') }}</h4><h4 class="daterangepicker__month">{{ _moment.clone().month(end.month).format(\'MMMM\') }}</h4><table><thead><tr><th ng-repeat="week in weeks">{{ week }}</th></tr></thead><tbody><tr ng-repeat="week in end.days"><td ng-repeat="day in week" ng-class="{ disabled: day.disabled, selected: !day.disabled &amp;&amp; (getMonthValue(end.value) === end.month) &amp;&amp; (day.value == end.value.format(\'D\')) }" ng-click="onSelectDay(\'end\', day, start.value.format(\'D\'), day.value)">{{ day.value }}</td></tr></tbody></table></div></div></div><button ng-click="applyDate()" class="daterangepicker__apply">{{ applyButtonLabel }}</button></div></div>',
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
