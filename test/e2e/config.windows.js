exports.config = {
  seleniumServerJar: '../../node_modules/gulp-protractor/node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',

  seleniumArgs: ['-Dwebdriver.ie.driver=./node_modules/gulp-protractor/node_modules/protractor/selenium/IEDriverServer.exe'],

  multiCapabilities: [
    {
      'platform': 'WIN8',
      'browserName': 'chrome',
      'name': 'ng-daterangepicker E2E Tests on chrome in WIN8',
      'tunnel-identifier' : process.env.TRAVIS_JOB_NUMBER
    },
    {
      'platform': 'WIN8',
      'browserName': 'internet explorer',
      'version': '11',
      'name': 'ng-daterangepicker E2E Tests on ie in WIN8',
      'tunnel-identifier' : process.env.TRAVIS_JOB_NUMBER
    }
  ],

  exclude: ['./spec/use-browser-default.js'],

  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  framework: 'jasmine',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
