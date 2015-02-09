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
      template: '<div ng-click="$event.stopPropagation()" class="daterangepicker"><div class="daterangepicker__option"><select ng-model="selectedOption" ng-options="option.label for option in options" ng-change="onChangeSelect()" ng-click="onClickSelect()"></select></div><div ng-show="selectedOption.value === \'custom\'" class="daterangepicker__cutom"><div class="daterangepicker__start"><input ng-if="isMobile" type="date" ng-model="start.value._d" class="daterangepicker__input"/><input ng-if="!isMobile" type="text" ng-value="start.value.format(format.date)" ng-click="toggleDropdown(\'start\')" readonly="" class="daterangepicker__input"/><div ng-show="start.show" ng-if="!isMobile" class="daterangepicker__dropdown"><button ng-click="onChangeMonth(\'start\', -1)" class="daterangepicker__prev">&lt;</button><button ng-click="onChangeMonth(\'start\', 1)" ng-if="start.month &lt; end.month" class="daterangepicker__next">&gt;</button><div class="daterangepicker__calendars"><h4 class="daterangepicker__year">{{ _moment.clone().month(start.month).format(locale.year || \'YYYY\') }}</h4><h4 class="daterangepicker__month">{{ _moment.clone().month(start.month).format(\'MMMM\') }}</h4><table><thead><tr><th ng-repeat="week in weeks">{{ week }}</th></tr></thead><tbody><tr ng-repeat="week in start.days"><td ng-repeat="day in week" ng-class="{ disabled: day.disabled, selected: !day.disabled &amp;&amp; (start.value.month() === start.month) &amp;&amp; (day.value == start.value.format(\'D\')) }" ng-click="onSelectDay(\'start\', day, day.value, end.value.format(\'D\'))">{{ day.value }}</td></tr></tbody></table></div></div></div><div ng-bind="format.to" class="daterangepicker__to"></div><div class="daterangepicker__end"><input ng-if="isMobile" type="date" ng-model="end.value._d" class="daterangepicker__input"/><input ng-if="!isMobile" type="text" ng-value="end.value.format(format.date)" ng-click="toggleDropdown(\'end\')" readonly="" class="daterangepicker__input"/><div ng-show="end.show" ng-if="!isMobile" class="daterangepicker__dropdown"><button ng-click="onChangeMonth(\'end\', -1)" ng-if="start.month &lt; end.month" class="daterangepicker__prev">&lt;</button><button ng-click="onChangeMonth(\'end\', 1)" class="daterangepicker__next">&gt;</button><div class="daterangepicker__calendars"><h4 class="daterangepicker__year">{{ _moment.clone().month(end.month).format(locale.year || \'YYYY\') }}</h4><h4 class="daterangepicker__month">{{ _moment.clone().month(end.month).format(\'MMMM\') }}</h4><table><thead><tr><th ng-repeat="week in weeks">{{ week }}</th></tr></thead><tbody><tr ng-repeat="week in end.days"><td ng-repeat="day in week" ng-class="{ disabled: day.disabled, selected: !day.disabled &amp;&amp; (end.value.month() === end.month) &amp;&amp; (day.value == end.value.format(\'D\')) }" ng-click="onSelectDay(\'end\', day, start.value.format(\'D\'), day.value)">{{ day.value }}</td></tr></tbody></table></div></div></div></div></div>',
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
          _resetMonth('start');
          _resetMonth('end');
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
          _resetMonth('start');
          _resetMonth('end');
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
          if (!_isValidDay(startDayValue, endDayValue, type)) { return; }

          var month = $scope[type].month;
          $scope[type].value = moment().month(month).date(day.value);

          $scope[type].show = false;
          _resetMonth(type);

          _apply();
        };

        $scope.onChangeMonth = function(type, addtionalMonth) {
          $scope[type].month += addtionalMonth;
          $scope[type].days = _getDaysPerWeek(_getMonth(type));
        };

        $scope.toggleDropdown = function(type) {
          var oppositeType = _getOppositeType(type);
          $scope[oppositeType].show = false;
          _resetMonth(oppositeType);
          $scope[type].show = !$scope[type].show;
          if (!$scope[type].show) {
            _resetMonth(type);
          }
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

        function _isValidDay(startDayValue, endDayValue, type) {          
          var startMonth = (type === 'start') ? $scope.start.month : $scope.start.value.month();
          var endMonth = (type === 'end') ? $scope.end.month : $scope.end.value.month();
          var start = moment().clone().month(startMonth).date(startDayValue);
          var end = moment().clone().month(endMonth).date(endDayValue);
          return start <= end;
        }

        function _resetMonth(type) {
          $scope[type].month = $scope[type].value.month();
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