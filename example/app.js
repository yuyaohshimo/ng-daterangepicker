angular.module('test', ['dateRangePicker']);
    
angular.module('test').controller('TestCtrl', function($scope) {
  $scope.applyButtonLabel = 'Apply';
  $scope.options = [
    {
      label: 'All',
      value: 'all'
    },
    {
      label: 'Custom',
      value: 'custom',
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
      value:'this_week',
      start: moment().startOf('week'),
      end: moment().endOf('week')
    },
    {
      label: 'This month',
      value:'this_month',
      start: moment().startOf('month'),
      end: moment().endOf('month')
    }
  ];
  $scope.initialRange = {
    start: moment(), // today
    end: moment().add(1, 'days') // tomorrow
  };
  $scope.locale = {
    year: 'YYYY年',
    months : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdaysShort: '日_月_火_水_木_金_土'.split('_')
  };
  $scope.format = {
    date: 'YYYY/MM/DD',
    to: '~'
  };
  $scope.applyDateRange = function(start, end, option) {
    $scope.start = start ? start.value.format($scope.format.date) : null;
    $scope.end = end ? end.value.format($scope.format.date) : null;
    $scope.option = option.value;
  };
});