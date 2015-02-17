describe('ng-daterangepicker', function() {

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

});