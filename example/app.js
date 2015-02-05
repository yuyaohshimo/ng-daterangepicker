angular.module('test', ['dateRangePicker']);
    
angular.module('test').controller('TestCtrl', function($scope) {
  $scope.options = [
    {
      label: 'Custom',
      value: 'custom'
    },
    {
      label: 'All',
      value: 'all'
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
  $scope.initialRange = {
    start: moment(), // today
    end: moment().add(1, 'days') // tomorrow
  };
  $scope.locale = {
    months : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdaysShort: '日_月_火_水_木_金_土'.split('_')
  };
  $scope.format = {
    date: 'YYYY/MM/DD',
    to: '~'
  };
  $scope.applyDateRange = function(start, end) {
    console.log(start);
    console.log(end);
  };
});