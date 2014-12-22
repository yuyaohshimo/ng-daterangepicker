angular.module('test', ['dateRangePicker']);
    
angular.module('test').controller('TestCtrl', function($scope){
  $scope.dates = {
    start: moment(),
    end: moment().add(1, 'days')
  };
  $scope.monthNumbers = 5;
  $scope.rangeOptions = [
    {
      label: 'Today',
      value: moment().range(moment(), moment()),
    },
    {
      label: 'This Week',
      value: moment().range(moment().startOf('week'), moment().endOf('week'))
    },
    {
      label: 'This Month',
      value: moment().range(moment().startOf('month'), moment().endOf('month'))
    }
  ];
  $scope.locale = {
    months : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdaysShort: '日_月_火_水_木_金_土'.split('_')
  };
  $scope.format = {
    date: 'YYYY/MM/DD',
    to: '~'
  };
});