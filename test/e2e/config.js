exports.config = {
  seleniumServerJar: '../../node_modules/gulp-protractor/node_modules/protractor/selenium/selenium-server-standalone-2.44.0.jar',

  capabilities: {
    'browserName': 'chrome',
    'name': 'ng-daterangepicker E2E Tests',
    'tunnel-identifier' : process.env.TRAVIS_JOB_NUMBER
  },

  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  framework: 'jasmine',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
