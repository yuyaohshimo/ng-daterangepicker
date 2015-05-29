describe('ng-daterangepicker user browser default', function() {

  beforeEach(function() {
    browser.get(browser.baseUrl + '/example');
    browser.waitForAngular();
    element(by.model('useBrowserDefault')).click();
  });

  it('should start selects custom date', function() {
    var year = '2015';
    var month = '01';
    var date = '01';
    var start = element(by.model('start.value._d'));
    start.sendKeys(date + month + year);
    var startValue = year + '/' + month + '/' + date;

    $('.daterangepicker__apply').click();

    var output = $('.start').getText();

    expect(output).toBe(startValue);
  });

  it('should end selects custom date', function() {
    var year = '2015';
    var month = '01';
    var date = '01';
    var end = element(by.model('end.value._d'));
    end.sendKeys(date + month + year);
    var startValue = year + '/' + month + '/' + date;

    $('.daterangepicker__apply').click();

    var output = $('.end').getText();

    expect(output).toBe(startValue);
  });

});
