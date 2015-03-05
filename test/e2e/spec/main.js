describe('ng-daterangepicker main', function() {

  var formatDate = function(date) {
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    return year + '/' + month + '/' + day;
  };

  beforeEach(function() {
    browser.get(browser.baseUrl + '/example');
    browser.navigate().refresh();
  });

  it('should be initial select is blank', function() {
    expect($('.selected_option span').getText()).toBe('');
  });

  it('should select All', function() {
    $('select option[value="0"]').click();
    expect($('.selected_option span').getText()).toBe('all');
  });

  it('should select Today', function() {
    $('select option[value="2"]').click();
    expect($('.selected_option span').getText()).toBe('today');
  });

  it('should select This week', function() {
    $('select option[value="3"]').click();
    expect($('.selected_option span').getText()).toBe('this_week');
  });

  it('should select This month', function() {
    $('select option[value="4"]').click();
    expect($('.selected_option span').getText()).toBe('this_month');
  });

  it('should initial range is set', function() {
    var now = formatDate(new Date());
    var tomorrow = formatDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));

    var start = $('.daterangepicker__start .daterangepicker__input').getAttribute('value');
    expect(start).toBe(now);

    var end = $('.daterangepicker__end .daterangepicker__input').getAttribute('value');
    expect(end).toBe(tomorrow);
  });

  it('should locale is set', function() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;

    $('.daterangepicker__input').click();

    expect($('.daterangepicker__year').getText()).toBe(year + '年');
    expect($('.daterangepicker__month').getText()).toBe(month + '月');
    expect($('.daterangepicker__calendars table tr th').getText()).toBe('日');
  });

  it('should format is set', function() {
    var now = formatDate(new Date());
    var inputValue = $('.daterangepicker__input').getAttribute('value');
    var toValue = $('.daterangepicker__to').getText();

    $('select option[value="2"]').click();
    expect(inputValue).toBe(now);
    expect(toValue).toBe('~');
  });

  it('should start selects custom date', function() {
    // click start
    $('.daterangepicker__start .daterangepicker__input').click();
    element.all(by.css('.daterangepicker__start .daterangepicker__calendars tbody tr td')).each(function(element, index) {
      element.getText().then(function (text) {
        if (text === '1') {
          element.click();
        }
      });
    });

    var startValue = $('.daterangepicker__start .daterangepicker__input').getAttribute('value');
    var start = $('.start').getText();

    expect(startValue).toBe(start);
  });

  it('should end selects custom date', function() {
    // click start
    $('.daterangepicker__start .daterangepicker__input').click();
    element.all(by.css('.daterangepicker__start .daterangepicker__calendars tbody tr td')).each(function(element, index) {
      element.getText().then(function (text) {
        if (text === '1') {
          element.click();
        }
      });
    });

    // click end
    $('.daterangepicker__end .daterangepicker__input').click();
    element.all(by.css('.daterangepicker__end .daterangepicker__calendars tbody tr td')).each(function(element, index) {
      element.getText().then(function (text) {
        if (text === '2') {
          element.click();
        }
      });
    });

    var endValue = $('.daterangepicker__end .daterangepicker__input').getAttribute('value');
    var end = $('.end').getText();

    expect(endValue).toBe(end);
  });

  it('should start equals end', function() {

    $('.daterangepicker__start .daterangepicker__input').click();
    $('.daterangepicker__start .daterangepicker__calendars tbody tr td').click();

    $('.daterangepicker__end .daterangepicker__input').click();
    $('.daterangepicker__end .daterangepicker__calendars tbody tr td').click();

    var start = $('.start').getText();
    var end = $('.end').getText();

    expect(start).toBe(end);
  });

});