exports.config = {
  seleniumServerJar: '../../node_modules/gulp-protractor/node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',

  multiCapabilities: [
    {
      'platform': 'MAC',
      'browserName': 'chrome',
      'name': 'ng-daterangepicker E2E Tests on chrome in MAC',
      'tunnel-identifier' : process.env.TRAVIS_JOB_NUMBER
    }
  ],

  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  framework: 'jasmine',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
